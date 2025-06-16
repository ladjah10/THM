export interface Question {
  id: number;
  section: string;
  subsection?: string;
  type: "M" | "D"; // M = Multiple Choice, D = Declaration
  text: string;
  options: string[];
  weight: number;
}

export interface UserResponse {
  option: string;
  value: number;
}

export interface DemographicData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gender: string;
  marriageStatus: string;
  desireChildren: string;
  ethnicity: string; // Comma-separated string of selected ethnicities
  ethnicities?: string[]; // Array of selected ethnicities (client-side only)
  hasPurchasedBook: string;
  purchaseDate: string;
  promoCode: string;
  hasPaid: boolean;
  lifeStage: string;
  birthday: string;
  interestedInArrangedMarriage: boolean;
  thmPoolApplied: boolean;
  city: string;
  state: string;
  zipCode: string;
}

export interface SectionScore {
  earned: number;
  possible: number;
  percentage: number;
}

export interface AssessmentScores {
  sections: Record<string, SectionScore>;
  overallPercentage: number;
  strengths: string[];
  improvementAreas: string[];
  totalEarned: number;
  totalPossible: number;
}

export interface ProfileCriterion {
  section: string;
  min?: number;
  max?: number;
}

export interface UserProfile {
  id: number;
  name: string;
  description: string;
  genderSpecific: "male" | "female" | null;
  criteria: ProfileCriterion[];
  iconPath?: string; // Path to the profile icon image
}

export interface AssessmentResult {
  id?: string;  // UUID for database storage
  email: string;
  name: string;
  scores: AssessmentScores;
  profile: UserProfile;
  genderProfile?: UserProfile | null;
  responses: Record<number, UserResponse>;
  demographics: DemographicData;
  rawAnswers?: any; // Complete raw submission data for admin download
  timestamp: string;
  transactionId?: string;  // Link to payment transaction
  coupleId?: string;       // For linking spouse assessments
  coupleRole?: 'primary' | 'spouse';  // Role in couple assessment
  reportSent?: boolean;    // Whether report has been sent by email
  
  // Recalculation tracking fields
  recalculated?: boolean;        // Whether this assessment has been recalculated
  recalculationDate?: string;    // When the recalculation occurred
  originalScore?: number;        // Original score before recalculation
  originalProfile?: string;      // Original profile name before recalculation
  reportRegeneratedAt?: string;  // When report was regenerated
  status?: 'completed' | 'incomplete' | 'processing';  // Assessment status
}
