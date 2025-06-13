/**
 * Assessment Recalculation System
 * 
 * This script recalculates all assessments in the database using the latest scoring algorithm,
 * updates records with accurate timestamps, and marks them for admin dashboard display.
 */

import { storage } from './storage';
import { generateIndividualAssessmentPDF, generateCoupleAssessmentPDF } from './pdfReportGenerator';
import { AssessmentResult, CoupleAssessmentReport } from '../shared/schema';

interface RecalculationResult {
  email: string;
  originalScore?: number;
  newScore?: number;
  scoreDifference?: number;
  originalProfile?: string;
  newProfile?: string;
  profileChanged?: boolean;
  pdfGenerated?: boolean;
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
  console.log('Starting recalculation of all assessments...');
  
  const startTime = new Date();
  const results: RecalculationResult[] = [];
  let successCount = 0;
  let errorCount = 0;

  try {
    // Get all completed assessments from storage
    const assessments = await storage.getAllAssessments();
    console.log(`Found ${assessments.length} assessments to recalculate`);

    for (const assessment of assessments) {
      if (assessment.status !== 'completed' || !assessment.responses) {
        console.log(`Skipping incomplete assessment for ${assessment.email}`);
        continue;
      }

      try {
        const result: RecalculationResult = {
          email: assessment.email,
          originalScore: assessment.scores?.overallPercentage,
          originalProfile: assessment.profile?.name,
          timestamp: new Date().toISOString(),
          status: 'success'
        };

        // Import the scoring utilities
        const { calculateAssessmentWithResponses } = await import('../client/src/utils/scoringUtils');
        
        // Recalculate scores using current algorithm
        const recalculatedData = calculateAssessmentWithResponses(assessment.responses, assessment.demographics);
        const recalculatedScores = {
          overallPercentage: recalculatedData.scores.overallPercentage,
          profile: recalculatedData.profile,
          genderProfile: recalculatedData.genderProfile
        };
        
        result.newScore = recalculatedScores.overallPercentage;
        result.newProfile = recalculatedScores.profile?.name;
        result.scoreDifference = result.originalScore ? 
          Math.abs(result.newScore - result.originalScore) : 0;
        result.profileChanged = result.originalProfile !== result.newProfile;

        // Update assessment with recalculated data
        const updatedAssessment: AssessmentResult = {
          ...assessment,
          scores: recalculatedScores.scores,
          profile: recalculatedScores.profile,
          genderProfile: recalculatedScores.genderProfile,
          recalculated: true,
          recalculationDate: new Date().toISOString(),
          originalScore: result.originalScore,
          timestamp: assessment.timestamp // Keep original completion timestamp
        };

        // Generate updated PDF
        try {
          const pdfBuffer = await generateIndividualAssessmentPDF(updatedAssessment);
          updatedAssessment.pdfBuffer = pdfBuffer;
          result.pdfGenerated = true;
        } catch (pdfError) {
          console.error(`PDF generation failed for ${assessment.email}:`, pdfError);
          result.pdfGenerated = false;
        }

        // Save updated assessment
        await storage.updateAssessment(assessment.id, updatedAssessment);
        
        results.push(result);
        successCount++;
        
        console.log(`✓ Recalculated assessment for ${assessment.email} - Score: ${result.originalScore}% → ${result.newScore}%`);

      } catch (error) {
        console.error(`Error recalculating assessment for ${assessment.email}:`, error);
        
        results.push({
          email: assessment.email,
          timestamp: new Date().toISOString(),
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
        
        errorCount++;
      }
    }

    // Recalculate couple assessments
    const coupleAssessments = await storage.getAllCoupleAssessments();
    console.log(`Found ${coupleAssessments.length} couple assessments to recalculate`);

    for (const coupleAssessment of coupleAssessments) {
      try {
        // Recalculate compatibility and difference analysis
        const primaryScores = coupleAssessment.primaryAssessment.scores;
        const spouseScores = coupleAssessment.spouseAssessment.scores;
        
        // Calculate updated compatibility score
        const overallCompatibility = 100 - Math.abs(
          primaryScores.overallPercentage - spouseScores.overallPercentage
        );

        // Recalculate difference analysis
        const sectionDifferences: any = {};
        const strengthAreas: string[] = [];
        const vulnerabilityAreas: string[] = [];

        Object.keys(primaryScores.sections).forEach(section => {
          const primaryPercent = primaryScores.sections[section]?.percentage || 0;
          const spousePercent = spouseScores.sections[section]?.percentage || 0;
          const difference = Math.abs(primaryPercent - spousePercent);

          sectionDifferences[section] = {
            primaryPercentage: primaryPercent,
            spousePercentage: spousePercent,
            differencePct: difference
          };

          if (difference < 15 && primaryPercent > 60 && spousePercent > 60) {
            strengthAreas.push(section);
          } else if (difference > 25) {
            vulnerabilityAreas.push(section);
          }
        });

        const updatedCoupleAssessment: CoupleAssessmentReport = {
          ...coupleAssessment,
          overallCompatibility,
          differenceAnalysis: {
            overallDifference: Math.abs(primaryScores.overallPercentage - spouseScores.overallPercentage),
            sectionDifferences,
            strengthAreas,
            vulnerabilityAreas
          },
          recalculated: true,
          recalculationDate: new Date().toISOString()
        };

        // Generate updated couple PDF
        try {
          const pdfBuffer = await generateCoupleAssessmentPDF(updatedCoupleAssessment);
          updatedCoupleAssessment.pdfBuffer = pdfBuffer;
        } catch (pdfError) {
          console.error(`Couple PDF generation failed for ${coupleAssessment.id}:`, pdfError);
        }

        // Save updated couple assessment
        await storage.updateCoupleAssessment(coupleAssessment.id, updatedCoupleAssessment);
        
        console.log(`✓ Recalculated couple assessment ${coupleAssessment.id} - Compatibility: ${overallCompatibility.toFixed(1)}%`);
        successCount++;

      } catch (error) {
        console.error(`Error recalculating couple assessment ${coupleAssessment.id}:`, error);
        errorCount++;
      }
    }

    const summaryReport: RecalculationSummary = {
      recalculationDate: startTime.toISOString(),
      totalProcessed: assessments.length + coupleAssessments.length,
      successCount,
      errorCount,
      results
    };

    console.log(`Recalculation completed: ${successCount} successful, ${errorCount} errors`);
    return summaryReport;

  } catch (error) {
    console.error('Fatal error during recalculation:', error);
    throw error;
  }
}

export async function recalculateSingleAssessment(assessmentId: string): Promise<RecalculationResult> {
  console.log(`Recalculating single assessment: ${assessmentId}`);
  
  try {
    const assessment = await storage.getAssessment(assessmentId);
    if (!assessment) {
      throw new Error('Assessment not found');
    }

    if (assessment.status !== 'completed' || !assessment.responses) {
      throw new Error('Assessment is not completed or missing responses');
    }

    const result: RecalculationResult = {
      email: assessment.email,
      originalScore: assessment.scores?.overallPercentage,
      originalProfile: assessment.profile?.name,
      timestamp: new Date().toISOString(),
      status: 'success'
    };

    // Recalculate scores
    const recalculatedScores = calculateAssessmentScores(assessment.responses, assessment.demographics);
    
    result.newScore = recalculatedScores.overallPercentage;
    result.newProfile = recalculatedScores.profile?.name;
    result.scoreDifference = result.originalScore ? 
      Math.abs(result.newScore - result.originalScore) : 0;
    result.profileChanged = result.originalProfile !== result.newProfile;

    // Update assessment
    const updatedAssessment: AssessmentResult = {
      ...assessment,
      scores: recalculatedScores.scores,
      profile: recalculatedScores.profile,
      genderProfile: recalculatedScores.genderProfile,
      recalculated: true,
      recalculationDate: new Date().toISOString(),
      originalScore: result.originalScore,
      timestamp: assessment.timestamp
    };

    // Generate updated PDF
    try {
      const pdfBuffer = await generateIndividualAssessmentPDF(updatedAssessment);
      updatedAssessment.pdfBuffer = pdfBuffer;
      result.pdfGenerated = true;
    } catch (pdfError) {
      console.error(`PDF generation failed:`, pdfError);
      result.pdfGenerated = false;
    }

    // Save updated assessment
    await storage.updateAssessment(assessmentId, updatedAssessment);
    
    console.log(`✓ Recalculated assessment for ${assessment.email}`);
    return result;

  } catch (error) {
    console.error(`Error recalculating assessment ${assessmentId}:`, error);
    return {
      email: 'unknown',
      timestamp: new Date().toISOString(),
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}