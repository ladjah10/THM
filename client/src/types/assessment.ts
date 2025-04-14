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
  ethnicity: string;
  hasPurchasedBook: string;
  purchaseDate: string;
  promoCode: string;
  hasPaid: boolean;
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
}
