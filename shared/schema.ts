/**
 * Shared type definitions for the 100 Marriage Assessment system
 */
// User types for authentication
export interface User {
  id: number;
  username: string;
  password: string;
  email?: string;
}

export type InsertUser = Omit<User, 'id'>;

// Referral data for tracking invites
export interface ReferralData {
  id: string;
  fromEmail: string;
  toEmail: string;
  message?: string;
  status: 'sent' | 'completed' | 'expired';
  createdTimestamp: string;
  completedTimestamp?: string;
  promoCode?: string;
}
import { pgTable, text, integer, timestamp, uuid, serial, numeric, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Database schema definition
export const visitorSessions = pgTable('visitor_sessions', {
  id: uuid('id').primaryKey().defaultRandom(),
  startTime: timestamp('start_time').notNull().defaultNow(),
  endTime: timestamp('end_time'),
  pageCount: integer('page_count').notNull().default(0),
  userAgent: text('user_agent'),
  ipAddress: text('ip_address'),
  referrer: text('referrer'),
  userId: uuid('user_id'),
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

export const paymentTransactions = pgTable('payment_transactions', {
  id: uuid('id').primaryKey().defaultRandom(),
  stripeId: text('stripe_id').unique().notNull(),
  customerId: text('customer_id'),
  customerEmail: text('customer_email'),
  amount: numeric('amount').notNull(),
  currency: text('currency').notNull().default('usd'),
  status: text('status').notNull(),
  created: timestamp('created').notNull().defaultNow(),
  productType: text('product_type').notNull(), // 'individual', 'couple', or 'marriage_pool'
  assessmentType: text('assessment_type'), // 'individual' or 'couple' (alias for productType for backward compatibility)
  productName: text('product_name'), // Full descriptive name of the product
  metadata: text('metadata'), // JSON string for additional data
  isRefunded: boolean('is_refunded').notNull().default(false),
  refundAmount: numeric('refund_amount'),
  refundReason: text('refund_reason'),
  sessionId: uuid('session_id').references(() => visitorSessions.id),
  promoCode: text('promo_code')
});

// Assessment data storage
export const assessmentResults = pgTable('assessment_results', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull(),
  name: text('name').notNull(),
  scores: text('scores').notNull(), // JSON string of AssessmentScores
  profile: text('profile').notNull(), // JSON string of UserProfile
  genderProfile: text('gender_profile'), // JSON string of UserProfile or null
  responses: text('responses').notNull(), // JSON string of responses
  demographics: text('demographics').notNull(), // JSON string of DemographicData
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  transactionId: uuid('transaction_id').references(() => paymentTransactions.id),
  coupleId: text('couple_id'), // For linking spouse assessments
  coupleRole: text('couple_role'), // 'primary' or 'spouse'
  reportSent: boolean('report_sent').notNull().default(false)
});

// Couple assessment reports
export const coupleAssessments = pgTable('couple_assessments', {
  id: uuid('id').primaryKey().defaultRandom(),
  coupleId: text('couple_id').notNull().unique(),
  primaryId: uuid('primary_id').references(() => assessmentResults.id),
  spouseId: uuid('spouse_id').references(() => assessmentResults.id),
  analysis: text('analysis').notNull(), // JSON string of DifferenceAnalysis
  timestamp: timestamp('timestamp').notNull().defaultNow(),
  compatibilityScore: numeric('compatibility_score').notNull(),
  recommendations: text('recommendations').notNull(), // JSON string of recommendations
  reportSent: boolean('report_sent').notNull().default(false)
});

// Referrals table for tracking invite functionality
export const referrals = pgTable('referrals', {
  id: uuid('id').defaultRandom().primaryKey(),
  referrerEmail: text('referrer_email').notNull(),
  referrerName: text('referrer_name'),
  invitedEmail: text('invited_email').notNull(),
  invitedName: text('invited_name'),
  promoCode: text('promo_code').notNull(),
  status: text('status').notNull().default('sent'), // sent, completed, expired
  sentTimestamp: timestamp('sent_timestamp').notNull().defaultNow(),
  completedTimestamp: timestamp('completed_timestamp'),
  productType: text('product_type').notNull(), // individual, couple, pool
  customMessage: text('custom_message')
});

// Drizzle schema for insertions
export const insertPageViewSchema = createInsertSchema(pageViews);
export const insertVisitorSessionSchema = createInsertSchema(visitorSessions);
export const insertPaymentTransactionSchema = createInsertSchema(paymentTransactions);
export const insertAssessmentResultSchema = createInsertSchema(assessmentResults);
export const insertCoupleAssessmentSchema = createInsertSchema(coupleAssessments);

// TypeScript types for inserts
export type InsertPageView = z.infer<typeof insertPageViewSchema>;
export type InsertVisitorSession = z.infer<typeof insertVisitorSessionSchema>;
export type InsertPaymentTransaction = z.infer<typeof insertPaymentTransactionSchema>;
export type InsertAssessmentResult = z.infer<typeof insertAssessmentResultSchema>;
export type InsertCoupleAssessment = z.infer<typeof insertCoupleAssessmentSchema>;

// TypeScript types for selections
export type PageViewDB = typeof pageViews.$inferSelect;
export type VisitorSessionDB = typeof visitorSessions.$inferSelect;
export type PaymentTransactionDB = typeof paymentTransactions.$inferSelect;
export type AssessmentResultDB = typeof assessmentResults.$inferSelect;
export type CoupleAssessmentDB = typeof coupleAssessments.$inferSelect;

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
  endTime?: string;
  pageCount: number;
  userAgent?: string;
  ipAddress?: string;
  referrer?: string;
  userId?: string;
  deviceType?: string;
  browser?: string;
  country?: string;
  region?: string;
}

export interface PaymentTransaction {
  id: string;
  stripeId: string;
  customerId?: string;
  customerEmail?: string;
  amount: number;
  currency: string;
  status: string;
  created: string;
  productType: string;
  assessmentType?: string; // 'individual' or 'couple' (alias for productType for backward compatibility)
  productName?: string;
  metadata?: any;
  isRefunded: boolean;
  refundAmount?: number;
  refundReason?: string;
  sessionId?: string;
  promoCode?: string;
}

export interface AnalyticsSummary {
  period?: 'day' | 'week' | 'month' | 'year';
  startDate?: string;
  endDate?: string;
  totalVisitors: number;
  totalPageViews: number;
  popularPages?: Array<{ path: string; count: number }>;
  topPages: Array<{ path: string; count: number }>;
  dailyVisitors: Array<{ date: string; count: number }>;
  conversionRate: number;
  averageSessionDuration: number;
  uniqueVisitors?: number;
  salesData?: {
    totalSales: number;
    recentTransactions: PaymentTransaction[];
    salesByProductType: Record<string, number>;
    dailySales: Array<{ date: string; amount: number }>;
  };
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
  phone?: string;
  purchaseDate?: string;
  interestedInArrangedMarriage?: boolean;
  thmPoolApplied?: boolean;
}

// Complete assessment result
export interface AssessmentResult {
  id?: string;  // UUID for database storage
  email: string;
  name: string;
  scores: AssessmentScores;
  profile: UserProfile;
  genderProfile: UserProfile | null;  // Gender-specific profile if applicable
  responses: Record<string, UserResponse>;
  demographics: DemographicData;
  timestamp: string;
  transactionId?: string;  // Link to payment transaction
  coupleId?: string;       // For linking spouse assessments
  coupleRole?: 'primary' | 'spouse';  // Role in couple assessment
  reportSent?: boolean;    // Whether report has been sent by email
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
  id?: string;               // UUID for database storage
  coupleId: string;          // Unique identifier for couple
  primary: AssessmentResult;
  spouse: AssessmentResult;
  analysis: DifferenceAnalysis;
  timestamp: string;
  compatibilityScore: number;
  // Recommendations based on their specific results
  recommendations: string[];
  reportSent?: boolean;      // Whether report has been sent
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