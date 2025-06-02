/**
 * Recalculate All Assessments Script
 * 
 * This script recalculates all assessment scores using updated question logic
 * and weighting system, regenerates PDF reports, and saves results with
 * a recalculated flag for admin review. No emails are sent.
 */

import { storage } from './server/storage';
import { calculateScores, determineProfile } from './client/src/utils/scoringUtils';
import { questions } from './client/src/data/questionsData';
import { generateIndividualAssessmentPDF } from './server/pdfReportGenerator';
import { writeFileSync, mkdirSync } from 'fs';
import { join } from 'path';

interface RecalculationLog {
  email: string;
  originalScore: number;
  newScore: number;
  scoreDifference: number;
  originalProfile: string;
  newProfile: string;
  profileChanged: boolean;
  timestamp: string;
  status: 'success' | 'error';
  error?: string;
}

async function recalculateAllAssessments() {
  console.log('🔄 Starting assessment recalculation process...');
  const logs: RecalculationLog[] = [];
  let successCount = 0;
  let errorCount = 0;
  
  try {
    // Fetch all assessments from database
    console.log('📊 Fetching all assessments from database...');
    const assessments = await storage.getAllAssessments();
    console.log(`Found ${assessments.length} assessments to recalculate`);
    
    if (assessments.length === 0) {
      console.log('No assessments found in database');
      return;
    }
    
    // Process each assessment
    for (let i = 0; i < assessments.length; i++) {
      const assessment = assessments[i];
      console.log(`\n🔍 Processing assessment ${i + 1}/${assessments.length}: ${assessment.email}`);
      
      try {
        // Parse stored data
        const originalResponses = typeof assessment.responses === 'string' 
          ? JSON.parse(assessment.responses) 
          : assessment.responses;
          
        const originalScores = typeof assessment.scores === 'string'
          ? JSON.parse(assessment.scores)
          : assessment.scores;
          
        const originalProfile = typeof assessment.profile === 'string'
          ? JSON.parse(assessment.profile)
          : assessment.profile;
          
        const demographics = typeof assessment.demographics === 'string'
          ? JSON.parse(assessment.demographics)
          : assessment.demographics;
        
        // Validate that we have responses to work with
        if (!originalResponses || Object.keys(originalResponses).length === 0) {
          throw new Error('No responses found for assessment');
        }
        
        console.log(`   Original score: ${originalScores.overallPercentage}%`);
        console.log(`   Original profile: ${originalProfile.name}`);
        console.log(`   Response count: ${Object.keys(originalResponses).length}`);
        
        // Recalculate scores using updated logic
        const newScores = calculateScores(questions, originalResponses);
        const newProfile = determineProfile(newScores, demographics.gender);
        
        console.log(`   New score: ${newScores.overallPercentage}%`);
        console.log(`   New profile: ${newProfile.name}`);
        
        // Create updated assessment object
        const updatedAssessment = {
          ...assessment,
          scores: newScores,
          profile: newProfile,
          recalculated: true,
          last_recalculated: new Date(),
          originalScore: originalScores.overallPercentage,
          originalProfile: originalProfile.name
        };
        
        // Generate new PDF report
        console.log('   📄 Generating updated PDF report...');
        const pdfBuffer = await generateIndividualAssessmentPDF(updatedAssessment);
        
        // Save PDF to outputs directory for admin review
        const pdfFileName = `recalculated-${assessment.email.replace('@', '-at-')}-${Date.now()}.pdf`;
        const pdfPath = join('outputs', pdfFileName);
        writeFileSync(pdfPath, pdfBuffer);
        
        // Update assessment in database with recalculated flag
        updatedAssessment.recalculatedPdfPath = pdfPath;
        await storage.updateAssessment(assessment.email, updatedAssessment);
        
        // Log the changes
        const scoreDifference = newScores.overallPercentage - originalScores.overallPercentage;
        const profileChanged = originalProfile.name !== newProfile.name;
        
        logs.push({
          email: assessment.email,
          originalScore: originalScores.overallPercentage,
          newScore: newScores.overallPercentage,
          scoreDifference: Number(scoreDifference.toFixed(1)),
          originalProfile: originalProfile.name,
          newProfile: newProfile.name,
          profileChanged,
          timestamp: new Date().toISOString(),
          status: 'success'
        });
        
        successCount++;
        console.log(`   ✅ Successfully recalculated (Score change: ${scoreDifference > 0 ? '+' : ''}${scoreDifference.toFixed(1)}%)`);
        
      } catch (error) {
        errorCount++;
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        console.error(`   ❌ Error recalculating assessment: ${errorMessage}`);
        
        logs.push({
          email: assessment.email,
          originalScore: 0,
          newScore: 0,
          scoreDifference: 0,
          originalProfile: 'Error',
          newProfile: 'Error',
          profileChanged: false,
          timestamp: new Date().toISOString(),
          status: 'error',
          error: errorMessage
        });
      }
    }
    
    // Generate summary report
    console.log('\n📊 Recalculation Summary:');
    console.log(`   ✅ Successful: ${successCount}`);
    console.log(`   ❌ Errors: ${errorCount}`);
    console.log(`   📈 Total processed: ${assessments.length}`);
    
    // Save detailed log file for admin review
    const logFileName = `recalculation-log-${new Date().toISOString().slice(0, 10)}.json`;
    writeFileSync(join('outputs', logFileName), JSON.stringify({
      summary: {
        totalProcessed: assessments.length,
        successful: successCount,
        errors: errorCount,
        timestamp: new Date().toISOString()
      },
      details: logs
    }, null, 2));
    
    console.log(`\n📋 Detailed log saved to: outputs/${logFileName}`);
    
    // Show significant changes
    const significantChanges = logs.filter(log => 
      log.status === 'success' && (Math.abs(log.scoreDifference) > 5 || log.profileChanged)
    );
    
    if (significantChanges.length > 0) {
      console.log('\n⚠️  Significant Changes Detected:');
      significantChanges.forEach(change => {
        console.log(`   ${change.email}: ${change.originalScore}% → ${change.newScore}% (${change.scoreDifference > 0 ? '+' : ''}${change.scoreDifference}%)`);
        if (change.profileChanged) {
          console.log(`     Profile: ${change.originalProfile} → ${change.newProfile}`);
        }
      });
    }
    
    console.log('\n🎯 Next Steps:');
    console.log('   1. Review recalculated PDFs in the outputs directory');
    console.log('   2. Check the detailed log for any errors or significant changes');
    console.log('   3. Use admin dashboard to send updated reports when ready');
    
  } catch (error) {
    console.error('❌ Fatal error during recalculation process:', error);
  }
}

// Run the recalculation
recalculateAllAssessments().catch(console.error);