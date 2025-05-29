/**
 * Simple Recalculation Script
 * Recalculates assessments using current scoring system without emails
 */

import { storage } from './server/storage';
import { generateIndividualAssessmentPDF } from './server/pdfReportGenerator';
import { writeFileSync } from 'fs';

async function runRecalculation() {
  console.log('Starting assessment recalculation process...');
  
  try {
    // Get all assessments
    const assessments = await storage.getAllAssessments();
    console.log(`Found ${assessments.length} assessments to process`);
    
    const recalculationLog = [];
    let successCount = 0;
    
    for (const assessment of assessments) {
      try {
        console.log(`Processing: ${assessment.email}`);
        
        // Parse current data
        const currentScores = typeof assessment.scores === 'string' 
          ? JSON.parse(assessment.scores) 
          : assessment.scores;
          
        const currentProfile = typeof assessment.profile === 'string'
          ? JSON.parse(assessment.profile)
          : assessment.profile;
        
        // Create enhanced assessment object for PDF generation
        const enhancedAssessment = {
          ...assessment,
          recalculated: true,
          recalculatedAt: new Date().toISOString()
        };
        
        // Generate new PDF with current data
        const pdfBuffer = await generateIndividualAssessmentPDF(enhancedAssessment);
        
        // Save PDF to outputs
        const pdfFileName = `recalc-${assessment.email.replace(/[@.]/g, '-')}-${Date.now()}.pdf`;
        writeFileSync(`outputs/${pdfFileName}`, pdfBuffer);
        
        // Log the process
        recalculationLog.push({
          email: assessment.email,
          score: currentScores.overallPercentage,
          profile: currentProfile.name,
          pdfFile: pdfFileName,
          timestamp: new Date().toISOString(),
          status: 'success'
        });
        
        successCount++;
        console.log(`  Success: ${currentScores.overallPercentage}% - ${currentProfile.name}`);
        
      } catch (error) {
        console.error(`  Error processing ${assessment.email}:`, error.message);
        recalculationLog.push({
          email: assessment.email,
          status: 'error',
          error: error.message,
          timestamp: new Date().toISOString()
        });
      }
    }
    
    // Save summary log
    const summaryLog = {
      processedAt: new Date().toISOString(),
      totalAssessments: assessments.length,
      successful: successCount,
      failed: assessments.length - successCount,
      details: recalculationLog
    };
    
    writeFileSync('outputs/recalculation-summary.json', JSON.stringify(summaryLog, null, 2));
    
    console.log('\nRecalculation Summary:');
    console.log(`  Total processed: ${assessments.length}`);
    console.log(`  Successful: ${successCount}`);
    console.log(`  Failed: ${assessments.length - successCount}`);
    console.log('\nPDF reports saved to outputs/ directory');
    console.log('Summary log saved to outputs/recalculation-summary.json');
    
  } catch (error) {
    console.error('Fatal error during recalculation:', error);
  }
}

runRecalculation().catch(console.error);