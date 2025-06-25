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
    
    // Skip if no response or invalid response format
    if (!response || typeof response.value !== "number") {
      console.warn("Skipped question ID:", question.id, "- Missing or invalid response");
      return;
    }
    
    // Initialize section if not exists
    if (!sectionScores[question.section]) {
      sectionScores[question.section] = { earned: 0, possible: 0, percentage: 0 };
    }
    
    // Calculate earned and possible values based on question type
    let earned: number;
    let possible: number;
    
    if (question.type === "D") {
      // Declaration questions: Affirmative choice = 100% weight, Antithesis choice = 25% weight
      const weight = question.weight ?? 1;
      if (response.value === 0) {
        // First option (affirmative declaration) = full weight
        earned = weight;
      } else {
        // Second option (antithesis/non-commitment) = 25% weight
        earned = Math.round(weight * 0.25);
      }
      possible = weight;
    } else {
      // Multiple choice questions: context-aware scoring based on traditionalism and faith content
      const weight = question.weight ?? 1;
      const optionText = response.option.toLowerCase();
      const questionText = question.text.toLowerCase();
      
      // Assess faith and traditional content in the option
      const isFaithOption = assessFaithContent(optionText);
      const isTraditionalOption = assessTraditionalContent(optionText);
      const isFaithQuestion = assessFaithContent(questionText) || question.section.includes('Faith') || question.section.includes('Foundation');
      
      // Calculate earned points based on content alignment and position
      if (response.value === 0) {
        // First option - typically most aligned/committed
        earned = weight;
      } else if (response.value === 1) {
        // Second option - assess content quality
        if (isFaithOption || isTraditionalOption) {
          earned = Math.round(weight * 0.85); // High score for faith/traditional content
        } else {
          earned = Math.round(weight * 0.70); // Standard second option
        }
      } else if (response.value === 2) {
        // Third option
        if (isFaithOption || isTraditionalOption) {
          earned = Math.round(weight * 0.60); // Moderate score for faith/traditional content
        } else {
          earned = Math.round(weight * 0.45); // Lower score for non-aligned content
        }
      } else {
        // Fourth+ option
        if (isFaithOption || isTraditionalOption) {
          earned = Math.round(weight * 0.40); // Some credit for faith/traditional content
        } else {
          earned = Math.round(weight * 0.20); // Minimal score for non-aligned content
        }
      }
      
      // Apply faith question multiplier for questions in faith-heavy sections
      if (isFaithQuestion && (isFaithOption || isTraditionalOption)) {
        earned = Math.round(earned * 1.1); // 10% bonus for faith alignment in faith questions
        earned = Math.min(earned, weight); // Cap at maximum weight
      }
      
      possible = weight;
    }
    
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
