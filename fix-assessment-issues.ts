/**
 * This script fixes two critical issues:
 * 1. Processes incomplete assessments that have full responses
 * 2. Recalculates scores for existing assessments with the corrected algorithm
 */

import { pool } from './server/db';
import { calculateAssessmentWithResponses } from './server/assessmentUtils';

interface IncompleteAssessment {
  email: string;
  demographic_data: any;
  responses: any;
  assessment_type: string;
  timestamp: string;
}

async function fixAssessmentIssues() {
  console.log('🔧 Starting assessment fixes...');
  
  try {
    // Step 1: Get all incomplete assessments that have full responses
    console.log('\n📋 Finding incomplete assessments with full responses...');
    
    const incompleteResult = await pool.query(`
      SELECT email, demographic_data, responses, assessment_type, timestamp
      FROM assessment_progress 
      WHERE completed = false
      ORDER BY timestamp DESC
    `);
    
    const incompleteAssessments: IncompleteAssessment[] = incompleteResult.rows;
    console.log(`Found ${incompleteAssessments.length} incomplete assessments to process`);
    
    // Step 2: Process each incomplete assessment in batches
    let processedCount = 0;
    let skippedCount = 0;
    let errorCount = 0;
    const batchSize = 10;
    
    for (let i = 0; i < incompleteAssessments.length; i += batchSize) {
      const batch = incompleteAssessments.slice(i, i + batchSize);
      console.log(`Processing batch ${Math.floor(i/batchSize) + 1}/${Math.ceil(incompleteAssessments.length/batchSize)}`);
      
      for (const assessment of batch) {
        try {
          const { email, demographic_data, responses, assessment_type, timestamp } = assessment;
          console.log(`Processing assessment for ${email} at ${timestamp}`);
          
          // Input validation
          if (!email || !responses) {
            console.warn(`⚠️ Skipping assessment - missing email or responses for ${email}`);
            skippedCount++;
            continue;
          }
          
          // Parse the data with error handling
          let demographicData, responsesData;
          try {
            demographicData = typeof demographic_data === 'string' 
              ? JSON.parse(demographic_data) 
              : demographic_data;
            responsesData = typeof responses === 'string' 
              ? JSON.parse(responses) 
              : responses;
          } catch (parseError) {
            console.error(`❌ JSON parsing failed for ${email} at ${timestamp}:`, parseError.message);
            errorCount++;
            continue;
          }
          
          // Validate response data
          if (!responsesData || typeof responsesData !== 'object') {
            console.warn(`⚠️ Invalid response data for ${email} at ${timestamp}. Skipping.`);
            skippedCount++;
            continue;
          }
      
          // Check if this assessment has substantial responses (at least 50 questions)
          const responseCount = Object.keys(responsesData).length;
          console.log(`   Response count: ${responseCount}`);
          
          if (responseCount < 50) {
            console.log(`   ⚠️  Skipping - insufficient responses (${responseCount} < 50)`);
            skippedCount++;
            continue;
          }
          
          // Check if already exists in results
          const existsResult = await pool.query(
            'SELECT id FROM assessment_results WHERE email = $1',
            [email]
          );
          
          if (existsResult.rows.length > 0) {
            console.log(`   ℹ️  Already exists in results, will recalculate scores`);
          }
          
          // Calculate the assessment with corrected algorithm
          const assessmentResult = await calculateAssessmentWithResponses(
            email,
            demographicData,
            responsesData
          );
          
          if (assessmentResult) {
            // Insert or update the assessment result
            const insertQuery = `
              INSERT INTO assessment_results (
                id, email, name, scores, profile, gender_profile, 
                responses, demographics, timestamp, transaction_id, 
                couple_id, couple_role, report_sent
              ) VALUES (
                gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
              ) ON CONFLICT (email) DO UPDATE SET
                name = EXCLUDED.name,
                scores = EXCLUDED.scores,
                profile = EXCLUDED.profile,
                gender_profile = EXCLUDED.gender_profile,
                responses = EXCLUDED.responses,
                demographics = EXCLUDED.demographics,
                timestamp = EXCLUDED.timestamp
            `;
            
            await pool.query(insertQuery, [
              assessmentResult.email,
              assessmentResult.name,
              JSON.stringify(assessmentResult.scores),
              JSON.stringify(assessmentResult.profile),
              assessmentResult.genderProfile ? JSON.stringify(assessmentResult.genderProfile) : null,
              JSON.stringify(assessmentResult.responses),
              JSON.stringify(assessmentResult.demographics),
              new Date(assessmentResult.timestamp),
              null, // transactionId
              null, // coupleId
              null, // coupleRole
              false // reportSent
            ]);
            
            // Mark as completed in progress table
            await pool.query(
              'UPDATE assessment_progress SET completed = true WHERE email = $1',
              [email]
            );
            
            console.log(`   ✅ Processed successfully - Score: ${assessmentResult.scores.overallPercentage}%`);
            processedCount++;
          } else {
            console.log(`   ❌ Failed to calculate assessment`);
            errorCount++;
          }
        } catch (error) {
          console.error(`❌ Error processing ${assessment.email} at ${assessment.timestamp}:`, error.message);
          errorCount++;
        }
      }
    }
    
    // Log summary for Step 2
    console.log(`\n📊 Step 2 Summary:`);
    console.log(`   ✅ Processed: ${processedCount}`);
    console.log(`   ⚠️  Skipped: ${skippedCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    
    // Step 3: Recalculate scores for existing assessments that might have incorrect scores
    console.log('\n🔄 Recalculating scores for existing assessments...');
    
    const existingResult = await pool.query(`
      SELECT email, responses, demographics
      FROM assessment_results
      WHERE scores::json->>'overallPercentage' = '47.9'
      ORDER BY timestamp DESC
      LIMIT 100
    `);
    
    let recalculatedCount = 0;
    let recalcErrorCount = 0;
    
    for (const existing of existingResult.rows) {
      try {
        const { email, responses, demographics } = existing;
        
        // Input validation
        if (!responses || !demographics) {
          console.warn(`⚠️ Skipping ${email} - missing data`);
          continue;
        }
        
        const responsesData = typeof responses === 'string' ? JSON.parse(responses) : responses;
        const demographicData = typeof demographics === 'string' ? JSON.parse(demographics) : demographics;
        
        console.log(`🔄 Recalculating ${email}`);
        
        const assessmentResult = await calculateAssessmentWithResponses(
          email,
          demographicData,
          responsesData
        );
        
        if (assessmentResult) {
          // Update the scores
          await pool.query(
            `UPDATE assessment_results 
             SET scores = $1, profile = $2, gender_profile = $3
             WHERE email = $4`,
            [
              JSON.stringify(assessmentResult.scores),
              JSON.stringify(assessmentResult.profile),
              assessmentResult.genderProfile ? JSON.stringify(assessmentResult.genderProfile) : null,
              email
            ]
          );
          
          console.log(`   ✅ Updated - New score: ${assessmentResult.scores.overallPercentage}%`);
          recalculatedCount++;
        } else {
          console.log(`   ❌ Failed to recalculate`);
          recalcErrorCount++;
        }
      } catch (error) {
        console.error(`❌ Error recalculating ${existing.email}:`, error.message);
        recalcErrorCount++;
      }
    }
    
    // Final summary
    console.log(`\n🎉 Assessment fixes completed!`);
    console.log(`📊 Final Summary:`);
    console.log(`   Incomplete Assessments:`);
    console.log(`     ✅ Processed: ${processedCount}`);
    console.log(`     ⚠️  Skipped: ${skippedCount}`);
    console.log(`     ❌ Errors: ${errorCount}`);
    console.log(`   Score Recalculations:`);
    console.log(`     ✅ Updated: ${recalculatedCount}`);
    console.log(`     ❌ Errors: ${recalcErrorCount}`);

  } catch (error) {
    console.error('❌ Fatal error during assessment fixes:', error);
    process.exit(1);
  } finally {
    await pool.end();
  }
}
      
      console.log(`\n🔄 Recalculating ${demographicData.firstName} ${demographicData.lastName} (${email})`);
      
      const assessmentResult = await calculateAssessmentWithResponses(
        email,
        demographicData,
        responsesData
      );
      
      if (assessmentResult) {
        await pool.query(`
          UPDATE assessment_results 
          SET scores = $1, 
              profile = $2,
              gender_profile = $3,
              timestamp = $4
          WHERE email = $5
        `, [
          JSON.stringify(assessmentResult.scores),
          JSON.stringify(assessmentResult.profile),
          assessmentResult.genderProfile ? JSON.stringify(assessmentResult.genderProfile) : null,
          new Date(assessmentResult.timestamp),
          email
        ]);
        
        console.log(`   ✅ Recalculated - New Score: ${assessmentResult.scores.overallPercentage}%`);
        recalculatedCount++;
      }
    }
    
    // Summary
    console.log('\n📊 SUMMARY');
    console.log('='.repeat(50));
    console.log(`✅ Processed incomplete assessments: ${processedCount}`);
    console.log(`⚠️  Skipped incomplete assessments: ${skippedCount}`);
    console.log(`🔄 Recalculated existing assessments: ${recalculatedCount}`);
    
    // Verify results
    const finalResult = await pool.query(`
      SELECT 
        email,
        name,
        scores::json->>'overallPercentage' as score
      FROM assessment_results 
      ORDER BY timestamp DESC
    `);
    
    console.log('\n📋 CURRENT ASSESSMENT RESULTS:');
    console.log('-'.repeat(60));
    finalResult.rows.forEach(row => {
      console.log(`${row.name.padEnd(25)} ${row.email.padEnd(25)} ${row.score}%`);
    });
    
    console.log('\n🎉 Assessment fixes completed successfully!');
    
  } catch (error) {
    console.error('❌ Error fixing assessments:', error);
  } finally {
    await pool.end();
  }
}

// Run the fix
fixAssessmentIssues();