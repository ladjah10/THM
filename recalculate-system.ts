/**
 * Assessment Recalculation System
 * 
 * This script:
 * - Fetches all completed assessments
 * - Recalculates scores using current logic
 * - Generates new PDF reports
 * - Saves back to DB with timestamp
 * - Provides re-email option in dashboard
 */

import { storage } from './server/storage';
import { calculateAssessmentWithResponses } from './server/assessmentUtils';
import { generateIndividualAssessmentPDF } from './server/pdfReportGenerator';
import * as fs from 'fs';
import * as path from 'path';

interface RecalculationResult {
  email: string;
  originalScore?: number;
  newScore?: number;
  scoreDifference?: number;
  originalProfile?: string;
  newProfile?: string;
  profileChanged?: boolean;
  pdfGenerated?: string;
  timestamp: string;
  status: 'success' | 'error';
  error?: string;
}

interface RecalculationSummary {
  recalculationDate: string;
  totalProcessed: number;
  successCount: number;
  errorCount: number;
  results: RecalculationResult[];
}

export async function recalculateAllAssessments(): Promise<RecalculationSummary> {
  try {
    console.log('Starting assessment recalculation process...');
    
    // Fetch all completed assessments
    const assessments = await storage.getAllAssessments();
    console.log(`Found ${assessments.length} assessments to process`);
    
    const results: RecalculationResult[] = [];
    let successCount = 0;
    let errorCount = 0;
    
    // Ensure outputs directory exists
    const outputDir = path.join(process.cwd(), 'outputs');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    for (const assessment of assessments) {
      try {
        console.log(`Processing assessment: ${assessment.email}`);
        
        // Parse existing data
        const responses = typeof assessment.responses === 'string' 
          ? JSON.parse(assessment.responses) 
          : assessment.responses;
          
        const demographics = typeof assessment.demographics === 'string' 
          ? JSON.parse(assessment.demographics) 
          : assessment.demographics;
          
        const originalScores = typeof assessment.scores === 'string' 
          ? JSON.parse(assessment.scores) 
          : assessment.scores;
          
        const originalProfile = typeof assessment.profile === 'string' 
          ? JSON.parse(assessment.profile) 
          : assessment.profile;
        
        // Recalculate with current logic
        const recalculatedResult = calculateAssessmentWithResponses(responses, demographics);
        
        // Generate new PDF
        const pdfBuffer = await generateIndividualAssessmentPDF(recalculatedResult);
        
        // Save PDF to outputs directory
        const timestamp = new Date().toISOString().replace(/:/g, '-').split('.')[0];
        const filename = `recalculated-${assessment.email.replace('@', '-at-')}-${timestamp}.pdf`;
        const pdfPath = path.join(outputDir, filename);
        
        fs.writeFileSync(pdfPath, pdfBuffer);
        
        // Update assessment in storage
        const updatedAssessment = {
          ...assessment,
          scores: JSON.stringify(recalculatedResult.scores),
          profile: JSON.stringify(recalculatedResult.profile),
          genderProfile: recalculatedResult.genderProfile ? JSON.stringify(recalculatedResult.genderProfile) : assessment.genderProfile,
          lastRecalculated: new Date().toISOString(),
          recalculatedPdfPath: pdfPath
        };
        
        await storage.saveAssessment(updatedAssessment);
        
        const result: RecalculationResult = {
          email: assessment.email,
          originalScore: originalScores.overallPercentage,
          newScore: recalculatedResult.scores.overallPercentage,
          scoreDifference: Math.round((recalculatedResult.scores.overallPercentage - originalScores.overallPercentage) * 10) / 10,
          originalProfile: originalProfile.name,
          newProfile: recalculatedResult.profile.name,
          profileChanged: originalProfile.name !== recalculatedResult.profile.name,
          pdfGenerated: filename,
          timestamp: new Date().toISOString(),
          status: 'success'
        };
        
        results.push(result);
        successCount++;
        
        console.log(`Completed ${assessment.email}: ${originalScores.overallPercentage}% → ${recalculatedResult.scores.overallPercentage}%`);
        
      } catch (error) {
        console.error(`Error processing ${assessment.email}:`, error);
        
        results.push({
          email: assessment.email,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date().toISOString()
        });
        
        errorCount++;
      }
    }
    
    // Create summary report
    const summaryReport: RecalculationSummary = {
      recalculationDate: new Date().toISOString(),
      totalProcessed: assessments.length,
      successCount,
      errorCount,
      results
    };
    
    // Save summary report
    const summaryPath = path.join(outputDir, `recalculation-summary-${Date.now()}.json`);
    fs.writeFileSync(summaryPath, JSON.stringify(summaryReport, null, 2));
    
    console.log('Recalculation Summary:');
    console.log(`Successful: ${successCount}`);
    console.log(`Errors: ${errorCount}`);
    console.log(`Summary saved: ${summaryPath}`);
    
    return summaryReport;
    
  } catch (error) {
    console.error('Recalculation process failed:', error);
    throw error;
  }
}

// Function to recalculate a single assessment
export async function recalculateSingleAssessment(assessmentId: string): Promise<RecalculationResult> {
  try {
    const assessment = await storage.getAssessmentById(assessmentId);
    if (!assessment) {
      throw new Error('Assessment not found');
    }
    
    const responses = typeof assessment.responses === 'string' 
      ? JSON.parse(assessment.responses) 
      : assessment.responses;
      
    const demographics = typeof assessment.demographics === 'string' 
      ? JSON.parse(assessment.demographics) 
      : assessment.demographics;
      
    const originalScores = typeof assessment.scores === 'string' 
      ? JSON.parse(assessment.scores) 
      : assessment.scores;
      
    const originalProfile = typeof assessment.profile === 'string' 
      ? JSON.parse(assessment.profile) 
      : assessment.profile;
    
    // Recalculate with current logic
    const recalculatedResult = calculateAssessmentWithResponses(responses, demographics);
    
    // Generate new PDF
    const pdfBuffer = await generateIndividualAssessmentPDF(recalculatedResult);
    
    // Update assessment in storage
    const updatedAssessment = {
      ...assessment,
      scores: JSON.stringify(recalculatedResult.scores),
      profile: JSON.stringify(recalculatedResult.profile),
      genderProfile: recalculatedResult.genderProfile ? JSON.stringify(recalculatedResult.genderProfile) : assessment.genderProfile,
      lastRecalculated: new Date().toISOString()
    };
    
    await storage.saveAssessment(updatedAssessment);
    
    return {
      email: assessment.email,
      originalScore: originalScores.overallPercentage,
      newScore: recalculatedResult.scores.overallPercentage,
      scoreDifference: Math.round((recalculatedResult.scores.overallPercentage - originalScores.overallPercentage) * 10) / 10,
      originalProfile: originalProfile.name,
      newProfile: recalculatedResult.profile.name,
      profileChanged: originalProfile.name !== recalculatedResult.profile.name,
      timestamp: new Date().toISOString(),
      status: 'success'
    };
    
  } catch (error) {
    return {
      email: 'unknown',
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    };
  }
}

// Run if called directly
if (require.main === module) {
  recalculateAllAssessments()
    .then((summary) => {
      console.log('Recalculation process completed successfully!');
      console.log(`Total processed: ${summary.totalProcessed}`);
      console.log(`Successful: ${summary.successCount}`);
      console.log(`Errors: ${summary.errorCount}`);
    })
    .catch((error) => {
      console.error('Recalculation process failed:', error);
      process.exit(1);
    });
}