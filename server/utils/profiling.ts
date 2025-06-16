/**
 * Enhanced Psychographic Profile Mapping System
 * Updated to match the 13 official profiles with correct scoring criteria
 */

import { AssessmentScores, UserProfile } from '@/types/assessment';
import { psychographicProfiles } from '../data/psychographicProfiles';

/**
 * Determine the appropriate general psychographic profile based on assessment scores
 */
export function determineGeneralProfile(scores: AssessmentScores): UserProfile {
  const sections = scores.sections;
  
  // Check each profile's criteria in order of specificity
  
  // 1. Steadfast Believers - Strong faith foundation
  if (
    sections['Your Foundation']?.percentage >= 90 &&
    sections['Your Faith Life']?.percentage >= 85
  ) {
    return psychographicProfiles.find(p => p.name === 'Steadfast Believers') || psychographicProfiles[0];
  }
  
  // 2. Harmonious Planners - Structure with faith
  if (
    sections['Your Foundation']?.percentage >= 80 &&
    sections['Your Marriage Life']?.percentage >= 75 &&
    sections['Your Finances']?.percentage >= 70
  ) {
    return psychographicProfiles.find(p => p.name === 'Harmonious Planners') || psychographicProfiles[1];
  }
  
  // 3. Balanced Visionaries - Well-rounded approach
  if (
    sections['Your Faith Life']?.percentage >= 75 &&
    sections['Your Marriage Life']?.percentage >= 70 &&
    sections['Your Marriage and Boundaries']?.percentage >= 65
  ) {
    return psychographicProfiles.find(p => p.name === 'Balanced Visionaries') || psychographicProfiles[5];
  }
  
  // 4. Flexible Faithful - Moderate faith with adaptability
  if (
    sections['Your Faith Life']?.percentage >= 70 &&
    sections['Your Faith Life']?.percentage <= 85 &&
    sections['Your Marriage Life']?.percentage >= 80
  ) {
    return psychographicProfiles.find(p => p.name === 'Flexible Faithful') || psychographicProfiles[2];
  }
  
  // 5. Pragmatic Partners - Practical approach
  if (
    sections['Your Finances']?.percentage >= 85 &&
    sections['Your Marriage Life']?.percentage >= 80
  ) {
    return psychographicProfiles.find(p => p.name === 'Pragmatic Partners') || psychographicProfiles[3];
  }
  
  // 6. Individualist Seekers - Lower traditional scores
  if (
    sections['Your Faith Life']?.percentage <= 70 &&
    sections['Your Marriage Life']?.percentage >= 60 &&
    sections['Your Marriage Life']?.percentage <= 80
  ) {
    return psychographicProfiles.find(p => p.name === 'Individualist Seekers') || psychographicProfiles[4];
  }
  
  // Default to Balanced Visionaries if no specific match
  return psychographicProfiles.find(p => p.name === 'Balanced Visionaries') || psychographicProfiles[5];
}

/**
 * Determine the appropriate gender-specific profile based on assessment scores and gender
 */
export function determineGenderSpecificProfile(scores: AssessmentScores, gender: string): UserProfile | null {
  const sections = scores.sections;
  const normalizedGender = gender.toLowerCase();
  
  if (normalizedGender === 'female') {
    // Female-specific profiles
    
    // 1. Faith-Centered Homemakers
    if (
      sections['Your Faith Life']?.percentage >= 75 &&
      sections['Your Family/Home Life']?.percentage >= 80
    ) {
      return psychographicProfiles.find(p => p.name === 'Faith-Centered Homemakers') || null;
    }
    
    // 2. Relational Nurturers
    if (
      sections['Your Parenting Life']?.percentage >= 85 &&
      sections['Your Marriage Life']?.percentage >= 80
    ) {
      return psychographicProfiles.find(p => p.name === 'Relational Nurturers') || null;
    }
    
    // 3. Adaptive Communicators
    if (
      sections['Your Marriage Life']?.percentage >= 85 &&
      sections['Your Faith Life']?.percentage >= 60 &&
      sections['Your Faith Life']?.percentage <= 80
    ) {
      return psychographicProfiles.find(p => p.name === 'Adaptive Communicators') || null;
    }
    
    // 4. Independent Traditionalists
    if (
      sections['Your Foundation']?.percentage >= 75 &&
      sections['Your Finances']?.percentage >= 80
    ) {
      return psychographicProfiles.find(p => p.name === 'Independent Traditionalists') || null;
    }
    
  } else if (normalizedGender === 'male') {
    // Male-specific profiles
    
    // 1. Faithful Protectors
    if (
      sections['Your Foundation']?.percentage >= 85 &&
      sections['Your Faith Life']?.percentage >= 80
    ) {
      return psychographicProfiles.find(p => p.name === 'Faithful Protectors') || null;
    }
    
    // 2. Structured Leaders
    if (
      sections['Your Finances']?.percentage >= 85 &&
      sections['Your Parenting Life']?.percentage >= 80
    ) {
      return psychographicProfiles.find(p => p.name === 'Structured Leaders') || null;
    }
    
    // 3. Balanced Providers
    if (
      sections['Your Finances']?.percentage >= 75 &&
      sections['Your Faith Life']?.percentage >= 70 &&
      sections['Your Health and Wellness']?.percentage >= 70
    ) {
      return psychographicProfiles.find(p => p.name === 'Balanced Providers') || null;
    }
  }
  
  return null; // No gender-specific profile match
}

/**
 * Get both general and gender-specific profiles for an assessment
 */
export function getCompleteProfileAnalysis(scores: AssessmentScores, gender: string): {
  generalProfile: UserProfile;
  genderProfile: UserProfile | null;
} {
  const generalProfile = determineGeneralProfile(scores);
  const genderProfile = determineGenderSpecificProfile(scores, gender);
  
  return {
    generalProfile,
    genderProfile
  };
}

/**
 * Calculate profile match percentage between two profiles
 */
export function calculateProfileCompatibility(profile1: UserProfile, profile2: UserProfile): number {
  if (profile1.id === profile2.id) {
    return 100; // Perfect match
  }
  
  // Define compatibility matrix based on profile characteristics
  const compatibilityMatrix: Record<string, string[]> = {
    'Steadfast Believers': ['Steadfast Believers', 'Harmonious Planners', 'Faithful Protectors', 'Faith-Centered Homemakers'],
    'Harmonious Planners': ['Harmonious Planners', 'Steadfast Believers', 'Structured Leaders', 'Independent Traditionalists'],
    'Flexible Faithful': ['Flexible Faithful', 'Balanced Visionaries', 'Adaptive Communicators', 'Balanced Providers'],
    'Pragmatic Partners': ['Pragmatic Partners', 'Flexible Faithful', 'Structured Leaders', 'Independent Traditionalists'],
    'Individualist Seekers': ['Individualist Seekers', 'Adaptive Communicators', 'Balanced Providers'],
    'Balanced Visionaries': ['Balanced Visionaries', 'Flexible Faithful', 'Relational Nurturers', 'Balanced Providers']
  };
  
  const profile1Matches = compatibilityMatrix[profile1.name] || [];
  const profile2Matches = compatibilityMatrix[profile2.name] || [];
  
  if (profile1Matches.includes(profile2.name)) {
    return 85; // High compatibility
  }
  
  if (profile2Matches.includes(profile1.name)) {
    return 85; // High compatibility
  }
  
  // Check for moderate compatibility based on shared characteristics
  const traditionalProfiles = ['Steadfast Believers', 'Harmonious Planners', 'Faithful Protectors', 'Faith-Centered Homemakers'];
  const moderateProfiles = ['Flexible Faithful', 'Balanced Visionaries', 'Adaptive Communicators', 'Balanced Providers'];
  const independentProfiles = ['Pragmatic Partners', 'Individualist Seekers', 'Independent Traditionalists', 'Structured Leaders'];
  
  const isProfile1Traditional = traditionalProfiles.includes(profile1.name);
  const isProfile2Traditional = traditionalProfiles.includes(profile2.name);
  const isProfile1Moderate = moderateProfiles.includes(profile1.name);
  const isProfile2Moderate = moderateProfiles.includes(profile2.name);
  const isProfile1Independent = independentProfiles.includes(profile1.name);
  const isProfile2Independent = independentProfiles.includes(profile2.name);
  
  if (
    (isProfile1Traditional && isProfile2Traditional) ||
    (isProfile1Moderate && isProfile2Moderate) ||
    (isProfile1Independent && isProfile2Independent)
  ) {
    return 70; // Moderate compatibility within same category
  }
  
  if (
    (isProfile1Traditional && isProfile2Moderate) ||
    (isProfile1Moderate && isProfile2Traditional) ||
    (isProfile1Moderate && isProfile2Independent) ||
    (isProfile1Independent && isProfile2Moderate)
  ) {
    return 55; // Some compatibility between adjacent categories
  }
  
  return 40; // Lower compatibility for very different approaches
}

/**
 * Replace "Progressive Partner" with "Modern Partner" across all profile names and descriptions
 */
export function normalizeProfileName(profileName: string): string {
  return profileName.replace(/Progressive Partner/g, 'Modern Partner');
}

/**
 * Get profile description with updated terminology
 */
export function getUpdatedProfileDescription(profile: UserProfile): string {
  return profile.description.replace(/Progressive Partner/g, 'Modern Partner');
}

/**
 * Get ideal matches for a given profile
 */
export function getIdealMatches(profileName: string): string[] {
  const matchingMap: Record<string, string[]> = {
    'Steadfast Believers': ['Steadfast Believers', 'Faithful Protectors', 'Faith-Centered Homemakers'],
    'Harmonious Planners': ['Harmonious Planners', 'Structured Leaders', 'Independent Traditionalists'],
    'Flexible Faithful': ['Flexible Faithful', 'Adaptive Communicators', 'Balanced Providers'],
    'Pragmatic Partners': ['Pragmatic Partners', 'Structured Leaders', 'Independent Traditionalists'],
    'Individualist Seekers': ['Individualist Seekers', 'Adaptive Communicators', 'Balanced Providers'],
    'Balanced Visionaries': ['Balanced Visionaries', 'Relational Nurturers', 'Balanced Providers'],
    'Relational Nurturers': ['Balanced Visionaries', 'Faithful Protectors', 'Balanced Providers'],
    'Adaptive Communicators': ['Flexible Faithful', 'Individualist Seekers', 'Balanced Providers'],
    'Independent Traditionalists': ['Harmonious Planners', 'Pragmatic Partners', 'Structured Leaders'],
    'Faith-Centered Homemakers': ['Steadfast Believers', 'Faithful Protectors', 'Balanced Visionaries'],
    'Faithful Protectors': ['Steadfast Believers', 'Faith-Centered Homemakers', 'Relational Nurturers'],
    'Structured Leaders': ['Harmonious Planners', 'Pragmatic Partners', 'Independent Traditionalists'],
    'Balanced Providers': ['Flexible Faithful', 'Balanced Visionaries', 'Adaptive Communicators']
  };
  
  return matchingMap[profileName] || [];
}