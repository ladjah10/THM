import { pgTable, text, serial, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

// Define assessment types
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
  genderSpecific: string | null;
  criteria: ProfileCriterion[];
  iconPath?: string; // Path to the profile icon image
}

export interface UserResponse {
  option: string;
  value: number;
}

export interface DemographicData {
  firstName: string;
  lastName: string;
  email: string;
  lifeStage: string;
  birthday: string;
  phone?: string;
  gender: string;
  marriageStatus: string;
  desireChildren: string;
  ethnicity: string;
  hasPurchasedBook?: string;
  purchaseDate?: string;
  promoCode?: string;
  hasPaid?: boolean;
  interestedInArrangedMarriage?: boolean;
  thmPoolApplied?: boolean;
  city: string;
  state: string;
  zipCode: string;
}

export interface GenderComparisonData {
  value: number;
  average: number;
  percentile: number;
}

export interface AssessmentResult {
  email: string;
  name: string;
  scores: AssessmentScores;
  profile: UserProfile;
  genderProfile?: UserProfile | null;
  responses: Record<string, UserResponse>;
  demographics: DemographicData;
  timestamp: string;
  coupleId?: string; // Links two assessments in a couple
  coupleRole?: 'primary' | 'spouse'; // Role in the couple assessment
  genderComparison?: Record<string, GenderComparisonData>; // Gender-specific comparison data
}

// Interface for comparing assessment responses between partners
export interface DifferenceAnalysis {
  differentResponses: {
    questionId: string;
    questionText: string;
    questionWeight: number;
    section: string;
    primaryResponse: string;
    spouseResponse: string;
  }[];
  majorDifferences: {
    questionId: string;
    questionText: string;
    questionWeight: number;
    section: string;
    primaryResponse: string;
    spouseResponse: string;
  }[];
  strengthAreas: string[];
  vulnerabilityAreas: string[];
}

// Interface for couples assessment report
export interface CoupleAssessmentReport {
  coupleId: string;
  timestamp: string;
  primaryAssessment: AssessmentResult;
  spouseAssessment: AssessmentResult;
  differenceAnalysis: DifferenceAnalysis;
  overallCompatibility: number;
}

// Interface for invitation/referral tracking
export interface ReferralData {
  id: string;
  referrerName: string;
  referrerEmail: string;
  invitedName: string;
  invitedEmail: string;
  timestamp: string;
  status: 'sent' | 'completed' | 'expired';
  promoCode?: string;
  completedTimestamp?: string;
}
