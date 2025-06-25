import { Question, UserResponse, AssessmentScores, UserProfile } from "@/types/assessment";
import { psychographicProfiles } from "@/data/psychographicProfiles";

/**
 * Calculate assessment scores based on user responses
 */
export function calculateScores(questions: Question[], responses: Record<number, UserResponse>): AssessmentScores {
  // Import section weights and percentages
  const SECTION_WEIGHTS = {
    "Section I: Your Foundation": 89,
    "Section II: Your Faith Life": 22.5,
    "Section III: Your Marriage Life": 190,
    "Section IV: Your Marriage Life with Children": 120,
    "Section V: Your Family/Home Life": 32,
    "Section VI: Your Finances": 52,
    "Section VII: Your Health and Wellness": 47,
    "Section VIII: Your Marriage and Boundaries": 70.5
  };

  const SECTION_PERCENTAGES = {
    "Section I: Your Foundation": 0.1429,
    "Section II: Your Faith Life": 0.0361,
    "Section III: Your Marriage Life": 0.3050,
    "Section IV: Your Marriage Life with Children": 0.1926,
    "Section V: Your Family/Home Life": 0.0514,
    "Section VI: Your Finances": 0.0835,
    "Section VII: Your Health and Wellness": 0.0754,
    "Section VIII: Your Marriage and Boundaries": 0.1132
  };

  const TOTAL_WEIGHT = 623;

  // Initialize section scores
  const sectionScores: Record<string, { earned: number; possible: number; percentage: number }> = {};
  const sectionEarned: Record<string, number> = {};
  let totalEarned = 0;

  // Initialize all sections
  Object.keys(SECTION_WEIGHTS).forEach(section => {
    sectionScores[section] = { earned: 0, possible: 0, percentage: 0 };
    sectionEarned[section] = 0;
  });

  // Calculate scores for each question using updated algorithm
  questions.forEach(question => {
    const response = responses[question.id];
    if (!response) return;

    const weight = question.weight ?? 1;
    const section = question.section;
    
    let earned: number;
    
    if (question.type === "D") {
      // Declaration questions: 100% or 30%
      if (response.value === 0) {
        earned = weight * 1.0; // 100% for affirmative
      } else {
        earned = weight * 0.30; // 30% for antithesis
      }
    } else {
      // Multiple choice questions: Response percentage scaling
      const optionText = response.option.toLowerCase();
      const isFaithOption = assessFaithContent(optionText);
      const isTraditionalOption = assessTraditionalContent(optionText);
      const isFaithQuestion = (question as any).isFaithQuestion || 
                             assessFaithContent(question.text.toLowerCase()) || 
                             question.section.includes('Faith') || 
                             question.section.includes('Foundation');
      
      // Response scoring based on option value
      if (response.value === 0) {
        earned = weight * 1.0; // 100%
      } else if (response.value === 1) {
        // Apply faith/traditional content bonus
        if (isFaithQuestion && (isFaithOption || isTraditionalOption)) {
          earned = weight * 0.75; // 75% with bonus
        } else {
          earned = weight * 0.75; // 75% standard
        }
      } else if (response.value === 2) {
        earned = weight * 0.40; // 40%
      } else {
        earned = weight * 0.15; // 15%
      }
    }
    
    // Add to section totals
    sectionEarned[section] += earned;
    totalEarned += earned;
  });

  // Normalize each section to percentage
  Object.keys(SECTION_WEIGHTS).forEach(section => {
    const earned = sectionEarned[section];
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
    const weight = question.weight ?? 1;
    
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
  responses: Record<number, UserResponse>,
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
