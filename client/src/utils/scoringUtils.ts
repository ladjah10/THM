import { Question, UserResponse, AssessmentScores, UserProfile } from "@/types/assessment";
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
    const possible = 5 * (question.weight || 1); // Max value is 5 (strongly agree)
    
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
    // Ensure we don't exceed 100%
    if (possible === 0) {
      sectionScores[section].percentage = 0;
    } else {
      // Strictly cap at 100% maximum
      const rawPercentage = (earned / possible) * 100;
      // Round to 1 decimal place for more precise percentages
      sectionScores[section].percentage = Math.min(100, Math.round(rawPercentage * 10) / 10);
    }
  });
  
  // Calculate overall percentage (capped at 100%)
  let overallPercentage = 0;
  if (totalPossible > 0) {
    // Strictly cap at 100% maximum
    const rawPercentage = (totalEarned / totalPossible) * 100;
    // Round to 1 decimal place for more precise percentages
    overallPercentage = Math.min(100, Math.round(rawPercentage * 10) / 10);
  }
  
  // Determine strengths and improvement areas
  const sectionEntries = Object.entries(sectionScores);
  sectionEntries.sort((a, b) => b[1].percentage - a[1].percentage);
  
  // Top 3 sections are strengths
  const strengths = sectionEntries
    .slice(0, 3)
    .map(([section, score]) => {
      // Ensure percentage is displayed correctly with up to 1 decimal place
      const formattedPercentage = score.percentage.toFixed(1).replace('.0', '');
      return `Strong ${section} compatibility (${formattedPercentage}%)`;
    });
  
  // Bottom 2 sections are improvement areas
  const improvementAreas = sectionEntries
    .slice(-2)
    .map(([section, score]) => {
      // Ensure percentage is displayed correctly with up to 1 decimal place
      const formattedPercentage = score.percentage.toFixed(1).replace('.0', '');
      return `${section} alignment can be improved (${formattedPercentage}%)`;
    });
  
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
 * Determine user's psychographic profiles based on scores and gender
 * Returns both primary profile and gender-specific profile if available
 */
export function determineProfiles(scores: AssessmentScores, gender?: string) {
  console.log(`DetermineProfiles called with gender: "${gender}"`, typeof gender);
  
  // Filter unisex profiles
  const unisexProfiles = psychographicProfiles.filter(profile => !profile.genderSpecific);
  console.log(`Found ${unisexProfiles.length} unisex profiles`);
  
  // Filter gender-specific profiles - ensure case consistency for gender values and trim whitespace
  const normalizedGender = gender ? gender.toLowerCase().trim() : undefined;
  
  const genderProfiles = psychographicProfiles.filter(profile => {
    if (profile.genderSpecific === 'male' && normalizedGender === 'male') return true;
    if (profile.genderSpecific === 'female' && normalizedGender === 'female') return true;
    return false;
  });
  
  // Log what's happening for debugging
  console.log(`Found ${genderProfiles.length} gender-specific profiles for "${normalizedGender}" (original value: "${gender}")`);
  if (genderProfiles.length > 0) {
    console.log(`Gender profile IDs: ${genderProfiles.map(p => p.id).join(', ')}`);
  }
  
  // Function to find best matching profile from a list
  const findBestMatch = (profiles: UserProfile[]) => {
    if (profiles.length === 0) return null;
    
    return profiles.reduce(
      (best, current) => {
        let score = 0;
        
        // Check section matches
        current.criteria.forEach((criterion: {section: string, min?: number, max?: number}) => {
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
      { profile: profiles[0], score: 0 }
    ).profile;
  };
  
  // Find the best matching profiles with fallback protection
  const primaryProfile = findBestMatch(unisexProfiles) || unisexProfiles[0] || psychographicProfiles[0];
  const genderProfile = findBestMatch(genderProfiles);
  
  // Add debugging for male profile determination
  if (normalizedGender === 'male' && genderProfiles.length > 0) {
    console.log(`Male user detected - found ${genderProfiles.length} male profiles`);
    console.log(`Selected gender profile:`, genderProfile ? genderProfile.name : 'None selected');
  }
  
  return {
    primaryProfile,
    genderProfile
  };
}

/**
 * For backward compatibility, returns the primary profile
 * (either unisex or gender-specific, with preference to gender-specific)
 */
export function determineProfile(scores: AssessmentScores, gender?: string) {
  const { primaryProfile, genderProfile } = determineProfiles(scores, gender);
  return genderProfile || primaryProfile;
}
