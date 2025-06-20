/**
 * Data Integrity Fix: Recalculate assessments with authentic questions
 */

import { db } from './server/db';
import { assessmentResults } from './shared/schema';
import { questions } from './client/src/data/questionsData';
import { eq } from 'drizzle-orm';

// Calculate authentic scores using book-accurate questions and weights
function calculateAuthenticScore(responses: Record<string, any>): {
  totalScore: number;
  maxPossibleScore: number;
  percentage: number;
} {
  let totalScore = 0;
  let maxPossibleScore = 0;

  for (const [questionId, response] of Object.entries(responses)) {
    const qId = parseInt(questionId);
    const question = questions.find(q => q.id === qId);
    
    if (!question) continue;

    const weight = question.weight;
    maxPossibleScore += weight;

    let questionScore = 0;
    if (typeof response === 'object' && response.value !== undefined) {
      questionScore = response.value * weight;
    } else if (typeof response === 'number') {
      questionScore = response * weight;
    } else if (typeof response === 'string') {
      const optionIndex = question.options.indexOf(response);
      if (optionIndex !== -1) {
        questionScore = (1 - optionIndex * 0.25) * weight;
      }
    }

    totalScore += questionScore;
  }

  const percentage = maxPossibleScore > 0 ? (totalScore / maxPossibleScore) * 100 : 0;
  return { totalScore, maxPossibleScore, percentage };
}

// Determine authentic profile based on book criteria
function determineAuthenticProfile(score: number, gender: string): string {
  if (score >= 85) return gender === 'male' ? 'Devoted Husband' : 'Devoted Wife';
  if (score >= 75) return 'Committed Partner';
  if (score >= 65) return 'Balanced Partner';
  if (score >= 55) return 'Developing Partner';
  return 'Growing Partner';
}

async function fixDataIntegrity() {
  console.log('Starting data integrity fix with authentic questions...');
  
  try {
    const allAssessments = await db.select().from(assessmentResults);
    console.log(`Processing ${allAssessments.length} assessments`);
    
    let fixed = 0;
    let errors = 0;
    
    for (const assessment of allAssessments) {
      try {
        if (!assessment.responses) {
          console.warn(`No responses for assessment ${assessment.id}`);
          continue;
        }

        const responses = typeof assessment.responses === 'string' 
          ? JSON.parse(assessment.responses) 
          : assessment.responses;

        const demographics = typeof assessment.demographics === 'string'
          ? JSON.parse(assessment.demographics)
          : assessment.demographics;

        // Calculate with authentic questions
        const authenticCalc = calculateAuthenticScore(responses);
        const newProfile = determineAuthenticProfile(
          authenticCalc.percentage,
          demographics?.gender || 'unknown'
        );

        // Extract current scores for comparison
        const currentScores = typeof assessment.scores === 'string'
          ? JSON.parse(assessment.scores)
          : assessment.scores;
        
        const originalPercentage = currentScores?.overallPercentage || 0;
        const scoreDifference = Math.abs(authenticCalc.percentage - originalPercentage);

        // Update with authentic calculation
        const updatedScores = {
          ...currentScores,
          overallPercentage: Math.round(authenticCalc.percentage * 10) / 10,
          totalEarned: authenticCalc.totalScore,
          totalPossible: authenticCalc.maxPossibleScore,
          authenticQuestionsUsed: true,
          recalculationTimestamp: new Date().toISOString()
        };

        const updatedProfile = {
          name: newProfile,
          description: `Authentic profile based on ${questions.length} verified questions`,
          authenticProfile: true
        };

        await db.update(assessmentResults)
          .set({
            scores: JSON.stringify(updatedScores),
            profile: JSON.stringify(updatedProfile),
            recalculated: true,
            lastRecalculated: new Date(),
            updatedAt: new Date()
          })
          .where(eq(assessmentResults.id, assessment.id));

        console.log(`Fixed ${assessment.email}: ${originalPercentage}% → ${authenticCalc.percentage}%`);
        fixed++;

      } catch (error) {
        console.error(`Error fixing assessment ${assessment.id}:`, error);
        errors++;
      }
    }

    console.log(`\nData integrity fix completed:`);
    console.log(`- Assessments fixed: ${fixed}`);
    console.log(`- Errors: ${errors}`);
    console.log(`- Authentic questions used: ${questions.length}`);
    
  } catch (error) {
    console.error('Critical error in data integrity fix:', error);
  }
}

// Run the fix
fixDataIntegrity();