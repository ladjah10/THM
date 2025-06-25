import { Question, UserResponse, AssessmentScores, UserProfile } from "@/types/assessment";
import { psychographicProfiles } from "@/data/psychographicProfiles";
import { SECTION_WEIGHTS, SECTION_PERCENTAGES, TOTAL_WEIGHT } from "@/config/sectionWeights";

/**
 * Calculate assessment scores based on user responses using improved algorithm
 */
export function calculateScores(questions: Question[], responses: Record<string, UserResponse>): AssessmentScores {

  // Initialize section scores
  const sectionScores: Record<string, { earned: number; possible: number; percentage: number }> = {};
  const sectionEarned: Record<string, number> = {};
  let totalEarned = 0;

  // Map full section names to short names for weight lookup
  const sectionNameMap: Record<string, string> = {
    "Section I: Your Foundation": "Your Foundation",
    "Section II: Your Faith Life": "Your Faith Life", 
    "Section III: Your Marriage Life": "Your Marriage Life",
    "Section IV: Your Marriage Life with Children": "Your Marriage Life with Children",
    "Section V: Your Family/Home Life": "Your Family/Home Life",
    "Section VI: Your Finances": "Your Finances",
    "Section VII: Your Health and Wellness": "Your Health and Wellness",
    "Section VIII: Your Marriage and Boundaries": "Your Marriage and Boundaries"
  };

  // Initialize all sections
  Object.keys(SECTION_WEIGHTS).forEach(section => {
    sectionScores[section] = { earned: 0, possible: 0, percentage: 0 };
    sectionEarned[section] = 0;
  });

  // Calculate scores for each question using improved response scoring
  questions.forEach(question => {
    const response = responses[question.id];
    if (!response) return;

    const weight = question.adjustedWeight ?? question.weight ?? 1;
    const fullSectionName = question.section;
    const shortSectionName = sectionNameMap[fullSectionName] || fullSectionName;
    
    let earned: number;
    
    // Improved response scoring based on option selection
    earned = getResponseScore(response.option, weight);
    
    // Add to section totals using short section name
    if (!sectionEarned[shortSectionName]) {
      sectionEarned[shortSectionName] = 0;
    }
    sectionEarned[shortSectionName] += earned;
    totalEarned += earned;
  });

  // Normalize each section to percentage
  Object.keys(SECTION_WEIGHTS).forEach(section => {
    const earned = sectionEarned[section] || 0;
    const sectionWeight = SECTION_WEIGHTS[section];
    const percentage = (earned / sectionWeight) * 100;
    
    sectionScores[section] = {
      earned,
      possible: sectionWeight,
      percentage: Math.min(100, Math.round(percentage * 10) / 10)
    };
  });

  // Calculate weighted overall percentage
  let overallPercentage = 0;
  Object.entries(sectionScores).forEach(([section, data]) => {
    const sectionPercentage = SECTION_PERCENTAGES[section] || 0;
    overallPercentage += data.percentage * sectionPercentage;
  });
  
  overallPercentage = Math.min(100, Math.round(overallPercentage * 10) / 10);

  // Identify strengths and improvement areas
  const strengths = Object.entries(sectionScores)
    .filter(([, score]) => score.percentage >= 80)
    .map(([section, score]) => {
      const formattedPercentage = score.percentage.toFixed(1).replace('.0', '');
      return `Strong ${section} alignment (${formattedPercentage}%)`;
    });

  const improvementAreas = Object.entries(sectionScores)
    .filter(([, score]) => score.percentage < 70)
    .map(([section, score]) => {
      const formattedPercentage = score.percentage.toFixed(1).replace('.0', '');
      return `${section} alignment can be improved (${formattedPercentage}%)`;
    });

  return {
    sections: sectionScores,
    overallPercentage,
    strengths,
    improvementAreas,
    totalEarned,
    totalPossible: TOTAL_WEIGHT
  };
}

/**
 * Improved response scoring function based on option selection
 */
function getResponseScore(option: string, weight: number): number {
  // Handle different option formats
  if (option.includes('Option 1') || option === 'Option 1') {
    return weight * 1.0; // 100%
  } else if (option.includes('Option 2') || option === 'Option 2') {
    return weight * 0.75; // 75%
  } else if (option.includes('Option 3') || option === 'Option 3') {
    return weight * 0.40; // 40%
  } else if (option.includes('Option 4') || option === 'Option 4') {
    return weight * 0.15; // 15%
  }
  
  // For actual option text, determine position/index and apply scoring
  // This handles cases where actual option text is stored instead of "Option X"
  return weight * 1.0; // Default to full weight for now
}

/**
 * Assess if content contains faith-based elements
 */
function assessFaithContent(text: string): boolean {
  const faithKeywords = [
    'god', 'christ', 'jesus', 'lord', 'savior', 'faith', 'prayer',
    'scripture', 'biblical', 'christian', 'church', 'worship',
    'spiritual', 'ministry', 'baptized', 'covenant'
  ];
  
  return faithKeywords.some(keyword => text.includes(keyword));
}

/**
 * Assess if content contains traditional marriage elements
 */
function assessTraditionalContent(text: string): boolean {
  const traditionalKeywords = [
    'husband', 'wife', 'traditional', 'lifelong', 'commitment',
    'family', 'children', 'provider', 'homemaker', 'head', 
    'submission', 'authority', 'roles', 'biblical'
  ];
  
  return traditionalKeywords.some(keyword => text.includes(keyword));
}

/**
 * Enhanced profile matching with near-match feedback and multiple profile handling
 */
export function determineProfiles(scores: AssessmentScores, gender?: string) {
  console.log(`DetermineProfiles called with gender: "${gender}"`, typeof gender);
  
  // Filter unisex profiles
  const unisexProfiles = psychographicProfiles.filter(profile => !profile.genderSpecific);
  console.log(`Found ${unisexProfiles.length} unisex profiles`);
  
  // Filter gender-specific profiles with normalized gender
  const normalizedGender = gender ? gender.toLowerCase().trim() : undefined;
  
  const genderProfiles = psychographicProfiles.filter(profile => {
    if (profile.genderSpecific === 'male' && normalizedGender === 'male') return true;
    if (profile.genderSpecific === 'female' && normalizedGender === 'female') return true;
    return false;
  });
  
  console.log(`Found ${genderProfiles.length} gender-specific profiles for "${normalizedGender}"`);
  
  // Enhanced matching function with exact and near-match detection and male user protection
  const findMatches = (profiles: UserProfile[]) => {
    const exactMatches: UserProfile[] = [];
    const nearMatches: { profile: UserProfile; missedCriteria: string[] }[] = [];
    
    profiles.forEach(profile => {
      let exactMatch = true;
      const missedCriteria: string[] = [];
      
      // Prevent hanging by ensuring valid profile criteria exist
      if (!profile.criteria || profile.criteria.length === 0) {
        console.warn(`Profile ${profile.name} has no criteria - skipping`);
        return;
      }
      
      // Check all criteria for this profile
      profile.criteria.forEach(criterion => {
        const sectionScore = scores.sections[criterion.section]?.percentage || 0;
        let criterionMet = true;
        
        if (criterion.min && sectionScore < criterion.min) {
          criterionMet = false;
          // Check if it's a near miss (within 5 points)
          if (sectionScore >= (criterion.min - 5)) {
            missedCriteria.push(`${criterion.section} (${sectionScore}% vs ${criterion.min}% required)`);
          }
        }
        
        if (criterion.max && sectionScore > criterion.max) {
          criterionMet = false;
          if (sectionScore <= (criterion.max + 5)) {
            missedCriteria.push(`${criterion.section} (${sectionScore}% vs ${criterion.max}% max)`);
          }
        }
        
        if (!criterionMet) {
          exactMatch = false;
        }
      });
      
      if (exactMatch) {
        exactMatches.push(profile);
      } else if (missedCriteria.length > 0) {
        nearMatches.push({ profile, missedCriteria });
      }
    });
    
    return { exactMatches, nearMatches };
  };
  
  // Find matches for both profile types
  const unisexResults = findMatches(unisexProfiles);
  const genderResults = findMatches(genderProfiles);
  
  // Prioritize gender-specific exact matches, then unisex exact matches
  let selectedProfile: UserProfile;
  let isGenderSpecific = false;
  let nearMatchFeedback: string[] = [];
  
  if (genderResults.exactMatches.length > 0) {
    // Use first gender-specific exact match
    selectedProfile = genderResults.exactMatches[0];
    isGenderSpecific = true;
    console.log(`Selected gender-specific profile: ${selectedProfile.name}`);
  } else if (unisexResults.exactMatches.length > 0) {
    // Use first unisex exact match
    selectedProfile = unisexResults.exactMatches[0];
    console.log(`Selected unisex profile: ${selectedProfile.name}`);
  } else {
    // No exact matches - use fallback with near-match feedback
    selectedProfile = unisexProfiles[0] || psychographicProfiles[0];
    
    // Generate near-match feedback
    const allNearMatches = [...genderResults.nearMatches, ...unisexResults.nearMatches];
    if (allNearMatches.length > 0) {
      const bestNearMatch = allNearMatches[0];
      nearMatchFeedback = [
        `You're closest to ${bestNearMatch.profile.name}`,
        ...bestNearMatch.missedCriteria.map(criteria => `Consider improving: ${criteria}`)
      ];
    }
    
    console.log(`No exact matches found. Using fallback: ${selectedProfile.name}`);
    if (nearMatchFeedback.length > 0) {
      console.log(`Near-match feedback:`, nearMatchFeedback);
    }
  }
  
  // Debug output for development
  if (process.env.NODE_ENV === 'development') {
    console.log('=== PROFILE MATCHING DEBUG ===');
    console.log('Section Scores:', Object.entries(scores.sections).map(([section, data]) => 
      `${section}: ${data.percentage}%`
    ));
    console.log('Gender-specific exact matches:', genderResults.exactMatches.map(p => p.name));
    console.log('Unisex exact matches:', unisexResults.exactMatches.map(p => p.name));
    console.log('Near matches:', [...genderResults.nearMatches, ...unisexResults.nearMatches].map(m => 
      `${m.profile.name} (missed: ${m.missedCriteria.join(', ')})`
    ));
    console.log('Selected profile:', selectedProfile.name);
    console.log('=============================');
  }
  
  return {
    primaryProfile: selectedProfile,
    genderProfile: isGenderSpecific ? selectedProfile : null,
    nearMatchFeedback,
    allMatches: {
      exactMatches: [...genderResults.exactMatches, ...unisexResults.exactMatches],
      nearMatches: [...genderResults.nearMatches, ...unisexResults.nearMatches]
    }
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

/**
 * Validate and normalize section weight totals for balanced scoring
 */
export function validateSectionWeights(questions: Question[]) {
  const sectionWeights: Record<string, { totalWeight: number; questionCount: number }> = {};
  
  questions.forEach(question => {
    const weight = question.adjustedWeight ?? 1;
    
    if (!sectionWeights[question.section]) {
      sectionWeights[question.section] = { totalWeight: 0, questionCount: 0 };
    }
    
    sectionWeights[question.section].totalWeight += weight;
    sectionWeights[question.section].questionCount += 1;
  });
  
  // Calculate average weight per question per section
  const sectionAnalysis = Object.entries(sectionWeights).map(([section, data]) => ({
    section,
    totalWeight: data.totalWeight,
    questionCount: data.questionCount,
    averageWeight: Math.round((data.totalWeight / data.questionCount) * 10) / 10
  }));
  
  if (process.env.NODE_ENV === 'development') {
    console.log('=== SECTION WEIGHT ANALYSIS ===');
    sectionAnalysis.forEach(analysis => {
      console.log(`${analysis.section}: ${analysis.questionCount} questions, total weight: ${analysis.totalWeight}, avg: ${analysis.averageWeight}`);
    });
    console.log('===============================');
  }
  
  return sectionAnalysis;
}

/**
 * Developer debug tool for comprehensive assessment analysis
 */
export function debugAssessmentScoring(
  responses: Record<string, UserResponse>,
  questions: Question[],
  gender?: string
) {
  console.log('🔍 === COMPREHENSIVE ASSESSMENT DEBUG ===');
  
  // Validate section weights
  const weightAnalysis = validateSectionWeights(questions);
  
  // Calculate scores
  const scores = calculateScores(questions, responses);
  
  // Determine profiles with detailed feedback
  const profileResults = determineProfiles(scores, gender);
  
  // Generate comprehensive debug report
  const debugReport = {
    timestamp: new Date().toISOString(),
    totalQuestions: questions.length,
    answeredQuestions: Object.keys(responses).length,
    completionRate: `${Math.round((Object.keys(responses).length / questions.length) * 100)}%`,
    
    sectionAnalysis: weightAnalysis,
    
    rawScores: {
      totalEarned: scores.totalEarned,
      totalPossible: scores.totalPossible,
      overallPercentage: scores.overallPercentage
    },
    
    sectionScores: Object.entries(scores.sections).map(([section, data]) => ({
      section,
      earned: data.earned,
      possible: data.possible,
      percentage: data.percentage
    })).sort((a, b) => b.percentage - a.percentage),
    
    profileMatching: {
      selectedProfile: profileResults.primaryProfile.name,
      isGenderSpecific: !!profileResults.genderProfile,
      exactMatches: profileResults.allMatches.exactMatches.map(p => p.name),
      nearMatches: profileResults.allMatches.nearMatches.map(m => ({
        profile: m.profile.name,
        missedCriteria: m.missedCriteria
      })),
      nearMatchFeedback: profileResults.nearMatchFeedback
    },
    
    strengths: scores.strengths,
    improvementAreas: scores.improvementAreas
  };
  
  console.log('Debug Report:', JSON.stringify(debugReport, null, 2));
  console.log('🎯 === DEBUG COMPLETE ===');
  
  return debugReport;
}
