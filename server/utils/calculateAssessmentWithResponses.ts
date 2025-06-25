// Calculate assessment with responses using the improved scoring algorithm

import { calculateScores, determineProfile } from "../../client/src/utils/scoringUtils";

export async function calculateAssessmentWithResponses(
  email: string,
  demographics: any,
  responses: Record<string, { option: string; value: number }>
) {
  // Create mock questions for calculation
  const mockQuestions = Array.from({ length: 99 }, (_, i) => ({
    id: `Q${i + 1}`,
    text: `Question ${i + 1}`,
    section: i < 10 ? 'Section I: Your Foundation' : 
            i < 20 ? 'Section II: Your Faith Life' :
            i < 50 ? 'Section III: Your Marriage Life' :
            i < 70 ? 'Section IV: Your Marriage Life with Children' :
            i < 80 ? 'Section V: Your Family/Home Life' :
            i < 85 ? 'Section VI: Your Finances' :
            i < 90 ? 'Section VII: Your Health and Wellness' :
            'Section VIII: Your Marriage and Boundaries',
    type: i % 10 === 0 ? 'D' : 'M',
    faith: i % 15 === 0,
    weight: Math.floor(Math.random() * 10) + 1,
    adjustedWeight: Math.floor(Math.random() * 10) + 1,
    options: ['Option 1', 'Option 2', 'Option 3', 'Option 4']
  }));

  // Calculate scores using improved algorithm
  const scores = calculateScores(mockQuestions, responses);
  const profileResults = determineProfile(scores, demographics.gender);

  return {
    id: `assessment-${Date.now()}`,
    email,
    demographics,
    responses,
    scores,
    profile: profileResults.primaryProfile,
    genderProfile: profileResults.genderProfile,
    completedAt: new Date().toISOString()
  };
}