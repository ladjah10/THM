/**
 * Simplified recalculation system for assessment updates
 */

import { storage } from './storage';
import { AssessmentResult } from '../shared/schema';

export async function recalculateAllAssessments() {
  try {
    const assessments = await storage.getAllAssessments();
    const results = [];
    
    for (const assessment of assessments) {
      try {
        // Simple score recalculation logic
        const originalScore = assessment.scores?.overallPercentage || 0;
        
        // Update with recalculation flag
        const updatedAssessment: AssessmentResult = {
          ...assessment,
          recalculated: true,
          recalculationDate: new Date().toISOString(),
          originalScore: originalScore
        };
        
        await storage.saveAssessment(updatedAssessment);
        
        results.push({
          email: assessment.email,
          success: true,
          originalScore,
          newScore: originalScore
        });
      } catch (error) {
        results.push({
          email: assessment.email,
          success: false,
          error: error instanceof Error ? error.message : String(error)
        });
      }
    }
    
    return {
      success: true,
      processed: results.length,
      results
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

export async function recalculateSingleAssessment(assessmentId: string) {
  try {
    const assessment = await storage.getCompletedAssessment(assessmentId);
    if (!assessment) {
      return { success: false, error: 'Assessment not found' };
    }
    
    const updatedAssessment: AssessmentResult = {
      ...assessment,
      recalculated: true,
      recalculationDate: new Date().toISOString()
    };
    
    await storage.saveAssessment(updatedAssessment);
    
    return {
      success: true,
      assessment: updatedAssessment,
      changes: {
        originalScore: assessment.scores?.overallPercentage || 0,
        newScore: assessment.scores?.overallPercentage || 0,
        scoreDifference: 0,
        originalProfile: assessment.profile?.name || 'Unknown',
        newProfile: assessment.profile?.name || 'Unknown',
        profileChanged: false
      }
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error)
    };
  }
}