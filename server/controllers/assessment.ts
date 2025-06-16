/**
 * Enhanced Assessment Controller for Report Regeneration and Profile Updates
 */

import { AssessmentResult, CoupleAssessmentReport } from '@shared/schema';
import { storage } from '../storage';
import { generateIndividualAssessmentPDF } from '../updated-individual-pdf';
import { generateCoupleAssessmentPDF } from '../updated-couple-pdf';
import fs from 'fs';
import path from 'path';

/**
 * Regenerate all assessment reports with updated profiles and formatting
 */
export const regenerateAllReports = async (): Promise<{
  success: boolean;
  processed: number;
  updated: number;
  errors: string[];
  details: string;
}> => {
  try {
    const assessments = await storage.getAssessments();
    let processed = 0;
    let updated = 0;
    const errors: string[] = [];

    console.log(`Starting regeneration of ${assessments.length} assessment reports...`);

    for (const assessment of assessments) {
      try {
        processed++;
        console.log(`Processing ${assessment.email}...`);

        // Recalculate scores using current scoring logic
        const updatedResults = calculateAssessmentScores(assessment.responses);
        
        // Determine updated profiles with corrected mappings
        const generalProfile = determineGeneralProfile(updatedResults);
        const genderProfile = determineGenderSpecificProfile(updatedResults, assessment.demographics.gender);

        // Create updated assessment object
        const updatedAssessment: AssessmentResult = {
          ...assessment,
          scores: updatedResults,
          profile: generalProfile,
          genderProfile: genderProfile
        };

        // Generate new PDF with updated formatting and profiles
        const pdfBuffer = await generateIndividualAssessmentPDF(updatedAssessment);
        
        // Create PDF file path with proper naming
        const sanitizedName = assessment.name.replace(/[^a-zA-Z0-9]/g, '-');
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const pdfPath = `reports/assessment-${sanitizedName}-${timestamp}.pdf`;
        
        // Ensure reports directory exists
        const reportsDir = path.join(process.cwd(), 'reports');
        if (!fs.existsSync(reportsDir)) {
          fs.mkdirSync(reportsDir, { recursive: true });
        }

        // Save PDF to file system
        const fullPdfPath = path.join(reportsDir, path.basename(pdfPath));
        fs.writeFileSync(fullPdfPath, pdfBuffer);

        // Update assessment in storage with new data
        await storage.updateAssessment(assessment.id, {
          scores: updatedResults,
          profile: generalProfile,
          genderProfile: genderProfile,
          pdfPath: pdfPath,
          pdfBuffer: pdfBuffer,
          recalculated: true,
          recalculationDate: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        });

        updated++;
        console.log(`✓ Regenerated report for ${assessment.email}`);
        console.log(`  - Score: ${assessment.scores.overallPercentage.toFixed(1)}% → ${updatedResults.overallPercentage.toFixed(1)}%`);
        console.log(`  - General Profile: ${assessment.profile.name} → ${generalProfile.name}`);
        console.log(`  - Gender Profile: ${assessment.genderProfile?.name || 'None'} → ${genderProfile?.name || 'None'}`);
        console.log(`  - PDF saved to: ${pdfPath}`);

      } catch (error) {
        const errorMsg = `Failed to regenerate report for ${assessment.email}: ${error.message}`;
        errors.push(errorMsg);
        console.error(`✗ ${errorMsg}`);
      }
    }

    const details = `Regenerated ${updated} of ${processed} assessment reports`;
    console.log(`✅ Report regeneration completed: ${details}`);

    return {
      success: true,
      processed,
      updated,
      errors,
      details
    };

  } catch (error) {
    console.error('Error in regenerateAllReports:', error);
    return {
      success: false,
      processed: 0,
      updated: 0,
      errors: [error.message],
      details: 'Failed to start report regeneration process'
    };
  }
};

/**
 * Regenerate single assessment report
 */
export const regenerateSingleReport = async (assessmentId: string): Promise<{
  success: boolean;
  assessment?: AssessmentResult;
  changes?: {
    originalScore: number;
    newScore: number;
    scoreDifference: number;
    originalProfile: string;
    newProfile: string;
    profileChanged: boolean;
  };
  error?: string;
}> => {
  try {
    const assessment = await storage.getAssessmentById(assessmentId);
    if (!assessment) {
      return { success: false, error: 'Assessment not found' };
    }

    // Store original values for comparison
    const originalScore = assessment.scores.overallPercentage;
    const originalProfile = assessment.profile.name;

    // Recalculate scores and profiles
    const updatedResults = calculateAssessmentScores(assessment.responses);
    const generalProfile = determineGeneralProfile(updatedResults);
    const genderProfile = determineGenderSpecificProfile(updatedResults, assessment.demographics.gender);

    // Create updated assessment
    const updatedAssessment: AssessmentResult = {
      ...assessment,
      scores: updatedResults,
      profile: generalProfile,
      genderProfile: genderProfile
    };

    // Generate new PDF
    const pdfBuffer = await generateIndividualAssessmentPDF(updatedAssessment);
    
    // Create PDF file path
    const sanitizedName = assessment.name.replace(/[^a-zA-Z0-9]/g, '-');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const pdfPath = `reports/assessment-${sanitizedName}-${timestamp}.pdf`;
    
    // Save PDF
    const reportsDir = path.join(process.cwd(), 'reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    const fullPdfPath = path.join(reportsDir, path.basename(pdfPath));
    fs.writeFileSync(fullPdfPath, pdfBuffer);

    // Update assessment
    await storage.updateAssessment(assessmentId, {
      scores: updatedResults,
      profile: generalProfile,
      genderProfile: genderProfile,
      pdfPath: pdfPath,
      pdfBuffer: pdfBuffer,
      recalculated: true,
      recalculationDate: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    });

    const changes = {
      originalScore,
      newScore: updatedResults.overallPercentage,
      scoreDifference: updatedResults.overallPercentage - originalScore,
      originalProfile,
      newProfile: generalProfile.name,
      profileChanged: originalProfile !== generalProfile.name
    };

    return {
      success: true,
      assessment: updatedAssessment,
      changes
    };

  } catch (error) {
    console.error('Error regenerating single report:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Generate assessment report with current formatting and profiles
 */
export const generateAssessmentReport = async (assessment: AssessmentResult): Promise<{
  pdfBuffer: Buffer;
  pdfPath: string;
}> => {
  try {
    // Ensure profiles are up to date
    const generalProfile = determineGeneralProfile(assessment.scores);
    const genderProfile = determineGenderSpecificProfile(assessment.scores, assessment.demographics.gender);

    const updatedAssessment: AssessmentResult = {
      ...assessment,
      profile: generalProfile,
      genderProfile: genderProfile
    };

    // Generate PDF with updated formatting
    const pdfBuffer = await generateIndividualAssessmentPDF(updatedAssessment);
    
    // Create file path
    const sanitizedName = assessment.name.replace(/[^a-zA-Z0-9]/g, '-');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const pdfPath = `reports/assessment-${sanitizedName}-${timestamp}.pdf`;

    return { pdfBuffer, pdfPath };

  } catch (error) {
    console.error('Error generating assessment report:', error);
    throw error;
  }
};

/**
 * Generate couple assessment report
 */
export const generateCoupleReport = async (report: CoupleAssessmentReport): Promise<{
  pdfBuffer: Buffer;
  pdfPath: string;
}> => {
  try {
    // Ensure both partners have updated profiles
    const primaryProfile = determineGeneralProfile(report.primaryAssessment.scores);
    const primaryGenderProfile = determineGenderSpecificProfile(
      report.primaryAssessment.scores, 
      report.primaryAssessment.demographics.gender
    );
    
    const spouseProfile = determineGeneralProfile(report.spouseAssessment.scores);
    const spouseGenderProfile = determineGenderSpecificProfile(
      report.spouseAssessment.scores, 
      report.spouseAssessment.demographics.gender
    );

    const updatedReport: CoupleAssessmentReport = {
      ...report,
      primaryAssessment: {
        ...report.primaryAssessment,
        profile: primaryProfile,
        genderProfile: primaryGenderProfile
      },
      spouseAssessment: {
        ...report.spouseAssessment,
        profile: spouseProfile,
        genderProfile: spouseGenderProfile
      }
    };

    // Generate PDF
    const pdfBuffer = await generateCoupleAssessmentPDF(updatedReport);
    
    // Create file path
    const primaryName = report.primaryAssessment.name.replace(/[^a-zA-Z0-9]/g, '-');
    const spouseName = report.spouseAssessment.name.replace(/[^a-zA-Z0-9]/g, '-');
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const pdfPath = `reports/couple-${primaryName}-${spouseName}-${timestamp}.pdf`;

    return { pdfBuffer, pdfPath };

  } catch (error) {
    console.error('Error generating couple report:', error);
    throw error;
  }
};