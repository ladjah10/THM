import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
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
}

export interface UserResponse {
  option: string;
  value: number;
}

export interface DemographicData {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  gender: string;
  marriageStatus: string;
  desireChildren: string;
  ethnicity: string;
  purchaseDate?: string;
}

export interface AssessmentResult {
  email: string;
  name: string;
  scores: AssessmentScores;
  profile: UserProfile;
  responses: Record<string, UserResponse>;
  demographics: DemographicData;
  timestamp: string;
}
