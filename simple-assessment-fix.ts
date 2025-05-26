/**
 * Simple script to fix the two critical assessment issues:
 * 1. Process incomplete assessments with full responses (like Seke Bangudu)
 * 2. Recalculate scores for assessments showing 47.9% incorrectly
 */

import { pool } from './server/db';

// Corrected scoring function matching the original assessment structure
function calculateCorrectScores(responses: Record<string, any>) {
  const sectionRanges = {
    "Your Foundation": [1, 10],
    "Your Faith Life": [11, 13], 
    "Your Marriage Life": [14, 27],
    "Your Marriage and Boundaries": [28, 36],
    "Your Family/Home Life": [37, 52],
    "Your Parenting Life": [53, 62],
    "Your Finances": [63, 77],
    "Other": [78, 89],
    "Your Health and Wellness": [90, 99]
  };

  const sections: Record<string, {earned: number, possible: number, percentage: number}> = {};
  let totalEarned = 0;
  let totalPossible = 0;

  Object.entries(sectionRanges).forEach(([section, [start, end]]) => {
    let sectionEarned = 0;
    let sectionPossible = 0;

    for (let qNum = start; qNum <= end; qNum++) {
      const response = responses[qNum.toString()];
      if (response && response.value !== undefined) {
        sectionEarned += response.value;
        sectionPossible += 12; // Maximum value per question
      }
    }

    const percentage = sectionPossible > 0 ? (sectionEarned / sectionPossible) * 100 : 0;
    
    sections[section] = {
      earned: sectionEarned,
      possible: sectionPossible,
      percentage: Math.round(percentage * 10) / 10
    };

    totalEarned += sectionEarned;
    totalPossible += sectionPossible;
  });

  const overallPercentage = totalPossible > 0 
    ? Math.round((totalEarned / totalPossible) * 1000) / 10 
    : 0;

  const sectionPercentages = Object.entries(sections)
    .map(([section, data]) => ({ section, percentage: data.percentage }))
    .sort((a, b) => b.percentage - a.percentage);

  const strengths = sectionPercentages
    .slice(0, 3)
    .map(s => `Strong ${s.section} compatibility (${s.percentage}%)`);
    
  const improvementAreas = sectionPercentages
    .slice(-2)
    .map(s => `${s.section} alignment can be improved (${s.percentage}%)`);

  return {
    sections,
    overallPercentage,
    strengths,
    improvementAreas,
    totalEarned,
    totalPossible
  };
}

async function fixAssessmentIssues() {
  console.log('🔧 Fixing assessment scoring issues...');

  try {
    // Step 1: Process complete assessments marked as incomplete (like Seke Bangudu)
    console.log('\n📋 Processing complete assessments marked as incomplete...');
    
    const incompleteButComplete = await pool.query(`
      SELECT email, demographic_data, responses
      FROM assessment_progress 
      WHERE completed = false
      AND jsonb_object_keys(responses::jsonb) @> ARRAY['99']
    `);

    for (const assessment of incompleteButComplete.rows) {
      const { email, demographic_data, responses } = assessment;
      const demographicData = JSON.parse(demographic_data);
      const responsesData = JSON.parse(responses);
      
      console.log(`👤 Processing ${demographicData.firstName} ${demographicData.lastName} (${email})`);
      
      // Calculate correct scores
      const scores = calculateCorrectScores(responsesData);
      
      // Insert new result
      await pool.query(`
        INSERT INTO assessment_results (
          id, email, name, scores, profile, gender_profile, 
          responses, demographics, timestamp, transaction_id,
          couple_id, couple_role, report_sent
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12
        )
      `, [
        email,
        `${demographicData.firstName} ${demographicData.lastName}`,
        JSON.stringify(scores),
        JSON.stringify({
          id: "balanced",
          name: "Balanced Individual", 
          description: "You have a balanced approach to relationships and marriage."
        }),
        null,
        JSON.stringify(responsesData),
        JSON.stringify(demographicData),
        new Date(),
        null, null, null, false
      ]);

      // Mark as completed
      await pool.query(
        'UPDATE assessment_progress SET completed = true WHERE email = $1',
        [email]
      );

      console.log(`   ✅ Added - New Score: ${scores.overallPercentage}%`);
    }

    // Step 2: Fix existing assessments with incorrect 47.9% scores
    console.log('\n🔄 Fixing incorrect 47.9% scores...');
    
    const incorrectScores = await pool.query(`
      SELECT email, responses, demographics, name
      FROM assessment_results
      WHERE scores::json->>'overallPercentage' = '47.9'
    `);

    for (const result of incorrectScores.rows) {
      const { email, responses, demographics, name } = result;
      const responsesData = JSON.parse(responses);
      
      console.log(`🔄 Recalculating ${name} (${email})`);
      
      // Calculate correct scores
      const scores = calculateCorrectScores(responsesData);
      
      // Update with correct scores
      await pool.query(`
        UPDATE assessment_results 
        SET scores = $1, timestamp = $2
        WHERE email = $3
      `, [
        JSON.stringify(scores),
        new Date(),
        email
      ]);

      console.log(`   ✅ Fixed - New Score: ${scores.overallPercentage}%`);
    }

    // Summary
    console.log('\n📊 FINAL RESULTS:');
    const allResults = await pool.query(`
      SELECT name, email, scores::json->>'overallPercentage' as score
      FROM assessment_results 
      ORDER BY timestamp DESC
    `);

    allResults.rows.forEach(row => {
      console.log(`${row.name.padEnd(25)} ${row.email.padEnd(25)} ${row.score}%`);
    });

    console.log('\n🎉 Assessment fixes completed successfully!');
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await pool.end();
  }
}

// Run the fix
fixAssessmentIssues();