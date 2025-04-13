import { Question, UserResponse, AssessmentScores } from "@/types/assessment";
import { psychographicProfiles } from "@/data/psychographicProfiles";

/**
 * Calculate assessment scores based on user responses
 */
export function calculateScores(
  questions: Question[],
  responses: Record<number, UserResponse>
): AssessmentScores {
  // Initialize section scores
  const sectionScores: Record<string, { earned: number; possible: number; percentage: number }> = {};
  
  // Initialize total score
  let totalEarned = 0;
  let totalPossible = 0;
  
  // Process each question
  questions.forEach(question => {
    const response = responses[question.id];
    
    // Skip if no response
    if (!response) return;
    
    // Initialize section if not exists
    if (!sectionScores[question.section]) {
      sectionScores[question.section] = { earned: 0, possible: 0, percentage: 0 };
    }
    
    // Calculate earned value based on weight
    const earned = response.value * (question.weight || 1);
    const possible = question.weight || 1;
    
    // Add to section scores
    sectionScores[question.section].earned += earned;
    sectionScores[question.section].possible += possible;
    
    // Add to total scores
    totalEarned += earned;
    totalPossible += possible;
  });
  
  // Calculate percentages for each section
  Object.keys(sectionScores).forEach(section => {
    const { earned, possible } = sectionScores[section];
    sectionScores[section].percentage = Math.round((earned / possible) * 100);
  });
  
  // Calculate overall percentage
  const overallPercentage = Math.round((totalEarned / totalPossible) * 100);
  
  // Determine strengths and improvement areas
  const sectionEntries = Object.entries(sectionScores);
  sectionEntries.sort((a, b) => b[1].percentage - a[1].percentage);
  
  // Top 3 sections are strengths
  const strengths = sectionEntries
    .slice(0, 3)
    .map(([section, score]) => `Strong ${section} compatibility (${score.percentage}%)`);
  
  // Bottom 2 sections are improvement areas
  const improvementAreas = sectionEntries
    .slice(-2)
    .map(([section, score]) => `${section} alignment can be improved (${score.percentage}%)`);
  
  return {
    sections: sectionScores,
    overallPercentage,
    strengths,
    improvementAreas,
    totalEarned,
    totalPossible
  };
}

/**
 * Determine user's psychographic profile based on scores and gender
 */
export function determineProfile(scores: AssessmentScores, gender?: string) {
  // Filter profiles by gender compatibility
  const eligibleProfiles = psychographicProfiles.filter(profile => {
    if (profile.genderSpecific === 'male' && gender === 'male') return true;
    if (profile.genderSpecific === 'female' && gender === 'female') return true;
    if (!profile.genderSpecific) return true;
    return false;
  });
  
  // Find the best matching profile using criteria matching
  const matchedProfile = eligibleProfiles.reduce(
    (best, current) => {
      let score = 0;
      
      // Check section matches
      current.criteria.forEach(criterion => {
        const sectionScore = scores.sections[criterion.section]?.percentage || 0;
        
        if (criterion.min && sectionScore >= criterion.min) {
          score += 1;
        }
        
        if (criterion.max && sectionScore <= criterion.max) {
          score += 1;
        }
      });
      
      return score > best.score ? { profile: current, score } : best;
    },
    { profile: eligibleProfiles[0], score: 0 }
  );
  
  return matchedProfile.profile;
}
