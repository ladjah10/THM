// Utility functions for processing assessment data
import { AssessmentResult } from "@shared/schema";

/**
 * Calculate assessment results from raw responses
 * This function processes completed assessments and prepares them for storage in the results table
 */
export async function calculateAssessmentWithResponses(
  email: string,
  demographicData: any,
  responses: Record<string, { option: string, value: number }>
): Promise<AssessmentResult | null> {
  try {
    // Import the necessary modules
    const { calculateScores, determineProfiles } = await import('../client/src/utils/scoringUtils');
    const { questions } = await import('../client/src/data/questions');
    
    console.log(`Calculating scores for completed assessment: ${email}`);
    
    // Calculate scores based on the responses
    const scores = calculateScores(questions, responses);
    
    // Determine primary profile
    const { primaryProfile, genderProfile } = determineProfiles(
      scores, 
      demographicData.gender
    );
    
    // Create the assessment result
    const assessmentResult: AssessmentResult = {
      email: email,
      name: `${demographicData.firstName || ''} ${demographicData.lastName || ''}`.trim(),
      scores: scores,
      profile: primaryProfile,
      genderProfile: genderProfile,
      responses: responses,
      demographics: demographicData,
      timestamp: new Date().toISOString()
    };
    
    return assessmentResult;
  } catch (error) {
    console.error(`Error calculating assessment for ${email}:`, error);
    return null;
  }
}