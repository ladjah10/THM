/**
 * Shared type definitions for the 100 Marriage Assessment system
 */
import { pgTable, text, integer, timestamp, uuid, serial } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Database schema definition
export const visitorSessions = pgTable('visitor_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  startTime: timestamp('start_time').notNull().defaultNow(),
  endTime: timestamp('end_time'),
  pageCount: integer('page_count').notNull().default(0),
  deviceType: text('device_type'),
  browser: text('browser'),
  country: text('country'),
  region: text('region')
});

export const pageViews = pgTable('page_views', {
  id: uuid('id').primaryKey().defaultRandom(),
  path: text('path').notNull(),
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  referrer: text('referrer'),
  userAgent: text('user_agent'),
  ipAddress: text('ip_address'),
  sessionId: uuid('session_id').notNull().references(() => visitorSessions.id)
});

// Drizzle schema for insertions
export const insertPageViewSchema = createInsertSchema(pageViews);
export const insertVisitorSessionSchema = createInsertSchema(visitorSessions);

// TypeScript types for inserts
export type InsertPageView = z.infer<typeof insertPageViewSchema>;
export type InsertVisitorSession = z.infer<typeof insertVisitorSessionSchema>;

// TypeScript types for selections
export type PageViewDB = typeof pageViews.$inferSelect;
export type VisitorSessionDB = typeof visitorSessions.$inferSelect;

// Analytics data interfaces for frontend usage
export interface PageView {
  id: string;
  path: string;
  timestamp: string;
  referrer: string;
  userAgent: string;
  ipAddress: string;
  sessionId: string;
}

export interface VisitorSession {
  id: string;
  startTime: string;
  endTime: string | null;
  pageCount: number;
  deviceType: string;
  browser: string;
  country: string;
  region: string;
}

export interface AnalyticsSummary {
  totalVisitors: number;
  totalPageViews: number;
  topPages: Array<{ path: string; count: number }>;
  dailyVisitors: Array<{ date: string; count: number }>;
  conversionRate: number;
  averageSessionDuration: number;
}

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