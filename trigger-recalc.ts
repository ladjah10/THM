/**
 * Trigger Recalculation Script
 * Runs recalculations for all assessment records and regenerates PDFs
 */

import { storage } from './server/storage';
import { calculateAssessmentWithResponses } from './client/src/utils/scoringUtils';
import { determineGeneralProfile, determineGenderSpecificProfile } from './server/utils/profiling';
import { generateIndividualAssessmentPDF } from './server/updated-individual-pdf';
import fs from 'fs';
import path from 'path';

interface RecalculationResult {
  email: string;
  originalScore: number;
  newScore: number;
  scoreDifference: number;
  originalProfile: string;
  newProfile: string;
  profileChanged: boolean;
  status: 'success' | 'error';
  error?: string;
}

async function triggerRecalculation(): Promise<void> {
  console.log('🔄 Starting comprehensive assessment recalculation...');
  
  try {
    // Get all assessments from storage
    const assessments = await storage.getAllAssessments();
    console.log(`Found ${assessments.length} assessments to process`);
    
    const results: RecalculationResult[] = [];
    let processed = 0;
    let updated = 0;
    
    for (const assessment of assessments) {
      try {
        processed++;
        console.log(`Processing ${assessment.email} (${processed}/${assessments.length})...`);
        
        // Store original values
        const originalScore = assessment.scores?.overallPercentage || 0;
        const originalProfile = assessment.profile?.name || 'Unknown';
        
        // Recalculate scores using current methodology
        const recalculatedScores = calculateAssessmentWithResponses(
          assessment.responses || {},
          assessment.demographics?.gender || 'unknown'
        );
        
        // Determine new profiles
        const newGeneralProfile = determineGeneralProfile(recalculatedScores, assessment.responses || {});
        const newGenderProfile = determineGenderSpecificProfile(
          recalculatedScores,
          assessment.responses || {},
          assessment.demographics?.gender || 'unknown'
        );
        
        // Create updated assessment
        const updatedAssessment = {
          ...assessment,
          scores: recalculatedScores,
          profile: newGeneralProfile,
          genderProfile: newGenderProfile,
          recalculated: true,
          recalculationDate: new Date().toISOString(),
          originalScore: originalScore,
          originalProfile: originalProfile
        };
        
        // Save updated assessment
        await storage.saveAssessment(updatedAssessment);
        
        // Generate new PDF
        const pdfBuffer = await generateIndividualAssessmentPDF(updatedAssessment);
        const sanitizedName = `${assessment.demographics?.firstName || 'Individual'}-${assessment.demographics?.lastName || 'Assessment'}`.replace(/[^a-zA-Z0-9]/g, '-');
        const pdfPath = path.join('reports', `assessment-${sanitizedName}-${new Date().toISOString().replace(/[:.]/g, '-')}.pdf`);
        
        // Ensure reports directory exists
        if (!fs.existsSync('reports')) {
          fs.mkdirSync('reports', { recursive: true });
        }
        
        fs.writeFileSync(pdfPath, pdfBuffer);
        
        const result: RecalculationResult = {
          email: assessment.email,
          originalScore,
          newScore: recalculatedScores.overallPercentage,
          scoreDifference: recalculatedScores.overallPercentage - originalScore,
          originalProfile,
          newProfile: newGeneralProfile.name,
          profileChanged: originalProfile !== newGeneralProfile.name,
          status: 'success'
        };
        
        results.push(result);
        updated++;
        
        console.log(`✓ Updated ${assessment.email}: ${originalScore.toFixed(1)}% → ${recalculatedScores.overallPercentage.toFixed(1)}%`);
        
      } catch (error) {
        const errorResult: RecalculationResult = {
          email: assessment.email,
          originalScore: assessment.scores?.overallPercentage || 0,
          newScore: 0,
          scoreDifference: 0,
          originalProfile: assessment.profile?.name || 'Unknown',
          newProfile: 'Error',
          profileChanged: false,
          status: 'error',
          error: error instanceof Error ? error.message : String(error)
        };
        
        results.push(errorResult);
        console.error(`✗ Failed to recalculate ${assessment.email}: ${error}`);
      }
    }
    
    // Generate summary report
    const summary = {
      totalProcessed: processed,
      successCount: updated,
      errorCount: processed - updated,
      averageScoreChange: results
        .filter(r => r.status === 'success')
        .reduce((sum, r) => sum + r.scoreDifference, 0) / updated,
      profileChanges: results.filter(r => r.profileChanged).length,
      completedAt: new Date().toISOString()
    };
    
    // Save results to file
    const reportPath = path.join('reports', `recalculation-report-${new Date().toISOString().replace(/[:.]/g, '-')}.json`);
    fs.writeFileSync(reportPath, JSON.stringify({ summary, results }, null, 2));
    
    console.log('\n📊 Recalculation Summary:');
    console.log(`Total Processed: ${summary.totalProcessed}`);
    console.log(`Successfully Updated: ${summary.successCount}`);
    console.log(`Errors: ${summary.errorCount}`);
    console.log(`Average Score Change: ${summary.averageScoreChange.toFixed(2)}%`);
    console.log(`Profile Changes: ${summary.profileChanges}`);
    console.log(`Report saved to: ${reportPath}`);
    
  } catch (error) {
    console.error('❌ Fatal error during recalculation:', error);
    throw error;
  }
}

// Run the recalculation if this script is executed directly
if (require.main === module) {
  triggerRecalculation()
    .then(() => {
      console.log('✅ Recalculation completed successfully');
      process.exit(0);
    })
    .catch((error) => {
      console.error('❌ Recalculation failed:', error);
      process.exit(1);
    });
}

export { triggerRecalculation };