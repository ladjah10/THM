/**
 * Simplified recalculation system for assessment updates
 */

import { storage } from './server/storage';
import { AssessmentResult } from './shared/schema';

export async function recalculateAllAssessments() {
  console.log('Starting assessment recalculation...');
  
  const startTime = Date.now();
  let successCount = 0;
  let errorCount = 0;
  const results: any[] = [];
  
  try {
    // Get all assessments
    const assessments = await storage.getAllAssessments();
    console.log(`Found ${assessments.length} assessments to recalculate`);
    
    for (const assessment of assessments) {
      try {
        // Skip if already recalculated recently
        if (assessment.recalculated && assessment.recalculationDate) {
          const recalcDate = new Date(assessment.recalculationDate);
          const daysSinceRecalc = (Date.now() - recalcDate.getTime()) / (1000 * 60 * 60 * 24);
          if (daysSinceRecalc < 7) {
            console.log(`Skipping ${assessment.email} - recently recalculated`);
            continue;
          }
        }

        // Store original score for comparison
        const originalScore = assessment.scores?.overallPercentage || 0;
        const originalProfile = assessment.profile?.name || 'Unknown';

        // Simple recalculation: recalculate percentage from responses
        let totalScore = 0;
        let totalPossible = 0;
        
        if (assessment.responses) {
          Object.values(assessment.responses).forEach(response => {
            if (typeof response.value === 'number') {
              totalScore += response.value;
              totalPossible += 5; // Assuming max value of 5 per question
            }
          });
        }
        
        const newPercentage = totalPossible > 0 ? (totalScore / totalPossible) * 100 : originalScore;
        const roundedPercentage = Math.round(newPercentage * 10) / 10;

        // Update assessment with recalculation info
        const updatedAssessment: AssessmentResult = {
          ...assessment,
          scores: {
            ...assessment.scores,
            overallPercentage: roundedPercentage
          },
          recalculated: true,
          recalculationDate: new Date().toISOString(),
          originalScore: originalScore
        };

        // Save updated assessment
        await storage.saveAssessment(updatedAssessment);
        
        results.push({
          email: assessment.email,
          originalScore: originalScore,
          newScore: roundedPercentage,
          scoreDifference: Math.abs(roundedPercentage - originalScore),
          originalProfile: originalProfile,
          newProfile: assessment.profile?.name || 'Unknown',
          profileChanged: false, // Keep profile same for now
          status: 'success'
        });
        
        successCount++;
        console.log(`✓ Recalculated ${assessment.email}: ${originalScore}% → ${roundedPercentage}%`);
        
      } catch (error) {
        console.error(`❌ Failed to recalculate ${assessment.email}:`, error);
        errorCount++;
        
        results.push({
          email: assessment.email,
          status: 'error',
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    const processingTime = Date.now() - startTime;
    
    const summary = {
      totalProcessed: assessments.length,
      successCount,
      errorCount,
      processingTime: `${processingTime}ms`,
      averageTimePerAssessment: assessments.length > 0 ? `${Math.round(processingTime / assessments.length)}ms` : '0ms'
    };

    console.log('✅ Recalculation completed:', summary);
    
    return {
      success: true,
      summary,
      results
    };

  } catch (error) {
    console.error('❌ Bulk recalculation failed:', error);
    return {
      success: false,
      error: 'Recalculation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function recalculateSingleAssessment(assessmentId: string) {
  console.log(`Recalculating single assessment: ${assessmentId}`);
  
  try {
    // Get assessment by ID
    const assessments = await storage.getAllAssessments();
    const assessment = assessments.find(a => a.id === assessmentId);
    
    if (!assessment) {
      throw new Error(`Assessment not found: ${assessmentId}`);
    }

    // Store original data
    const originalScore = assessment.scores?.overallPercentage || 0;
    const originalProfile = assessment.profile?.name || 'Unknown';

    // Recalculate score
    let totalScore = 0;
    let totalPossible = 0;
    
    if (assessment.responses) {
      Object.values(assessment.responses).forEach(response => {
        if (typeof response.value === 'number') {
          totalScore += response.value;
          totalPossible += 5;
        }
      });
    }
    
    const newPercentage = totalPossible > 0 ? (totalScore / totalPossible) * 100 : originalScore;
    const roundedPercentage = Math.round(newPercentage * 10) / 10;

    // Update assessment
    const updatedAssessment: AssessmentResult = {
      ...assessment,
      scores: {
        ...assessment.scores,
        overallPercentage: roundedPercentage
      },
      recalculated: true,
      recalculationDate: new Date().toISOString(),
      originalScore: originalScore
    };

    await storage.saveAssessment(updatedAssessment);
    
    console.log(`✓ Single recalculation completed: ${originalScore}% → ${roundedPercentage}%`);
    
    return {
      success: true,
      assessment: updatedAssessment,
      changes: {
        originalScore,
        newScore: roundedPercentage,
        scoreDifference: Math.abs(roundedPercentage - originalScore),
        originalProfile,
        newProfile: assessment.profile?.name || 'Unknown',
        profileChanged: false
      }
    };

  } catch (error) {
    console.error(`❌ Single recalculation failed:`, error);
    return {
      success: false,
      error: 'Recalculation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}