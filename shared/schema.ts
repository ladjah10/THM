/**
 * Shared type definitions for the 100 Marriage Assessment system
 */

// User response to a single question
export interface UserResponse {
  option: string;  // The text of the option they selected
  value: number;   // The numeric value of their response (typically 1-5)
}

// Score for a single section
export interface SectionScore {
  earned: number;      // Points earned in this section
  possible: number;    // Maximum possible points for this section
  percentage: number;  // Earned/Possible as a percentage
}

// Criteria for a psychographic profile
export interface ProfileCriterion {
  section: string;     // The section this criterion applies to
  min?: number;        // Minimum percentage score required (if applicable)
  max?: number;        // Maximum percentage score required (if applicable)
}

// A psychographic profile
export interface UserProfile {
  id: number;
  name: string;
  description: string;
  genderSpecific: string | null;  // 'male', 'female', or null if applies to any gender
  criteria: ProfileCriterion[];   // Criteria that determine this profile
  iconPath?: string;              // Path to the profile's icon image
  compatibleWith?: string[];      // List of profile names this profile is compatible with
}

// Complete score results
export interface AssessmentScores {
  sections: Record<string, SectionScore>;  // Scores by section
  overallPercentage: number;               // Overall score as a percentage
  totalEarned: number;                     // Total points earned across all sections
  totalPossible: number;                   // Total possible points across all sections
  strengths: string[];                     // Top 3 sections (by percentage)
  improvementAreas: string[];              // Bottom 3 sections (by percentage)
}

// Demographic data
export interface DemographicData {
  firstName: string;
  lastName: string;
  email: string;
  gender: string;
  birthday: string;
  lifeStage: string;
  marriageStatus: string;
  desireChildren: string;
  ethnicity: string;
  city: string;
  state: string;
  zipCode: string;
  hasPurchasedBook: string;
}

// Complete assessment result
export interface AssessmentResult {
  email: string;
  name: string;
  scores: AssessmentScores;
  profile: UserProfile;
  genderProfile: UserProfile | null;  // Gender-specific profile if applicable
  responses: Record<string, UserResponse>;
  demographics: DemographicData;
  timestamp: string;
}

// Analysis of differences between partners
export interface DifferenceAnalysis {
  significantDifferences: Array<{
    question: string;
    section: string;
    primaryResponse: UserResponse;
    spouseResponse: UserResponse;
    difference: number;
  }>;
  sectionDifferences: Record<string, {
    primaryPercentage: number;
    spousePercentage: number;
    differencePct: number;
  }>;
  totalDifference: number;
  compatibilityScore: number;
}

// Couple assessment report
export interface CoupleAssessmentReport {
  primary: AssessmentResult;
  spouse: AssessmentResult;
  analysis: DifferenceAnalysis;
  timestamp: string;
  compatibilityScore: number;
  // Recommendations based on their specific results
  recommendations: string[];
}

// Question definition
export interface Question {
  id: string;
  text: string;
  section: string;
  options: Array<{
    text: string;
    value: number;
  }>;
}