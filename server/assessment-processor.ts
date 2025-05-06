/**
 * Assessment processing logic for calculating scores and determining profiles
 */

import type { AssessmentScores, SectionScore, UserProfile, UserResponse } from "@shared/schema";
import { profiles } from './profiles-data';

// Define section question mappings
const sectionQuestions: Record<string, string[]> = {
  "Behavior Values": ["1", "10", "19", "28", "37", "46", "55", "64", "73", "82", "91"],
  "Spirituality & Faith": ["2", "11", "20", "29", "38", "47", "56", "65", "74", "83", "92"],
  "Family & Children": ["3", "12", "21", "30", "39", "48", "57", "66", "75", "84", "93"],
  "Financial Priorities": ["4", "13", "22", "31", "40", "49", "58", "67", "76", "85", "94"],
  "Traditional Habits": ["5", "14", "23", "32", "41", "50", "59", "68", "77", "86", "95"],
  "Relationship Needs": ["6", "15", "24", "33", "42", "51", "60", "69", "78", "87", "96"],
  "Intellectual Style": ["7", "16", "25", "34", "43", "52", "61", "70", "79", "88", "97"],
  "Physical Priorities": ["8", "17", "26", "35", "44", "53", "62", "71", "80", "89", "98"],
  "Social Lifestyle": ["9", "18", "27", "36", "45", "54", "63", "72", "81", "90", "99"],
};

// Each question's weight
const questionWeights: Record<string, number> = {};
// Initialize all questions with weight 1
Object.values(sectionQuestions).flat().forEach(q => {
  questionWeights[q] = 1;
});

// Calculate scores based on responses
export function calculateScores(responses: Record<string, UserResponse>): AssessmentScores {
  // Calculate section scores
  const sections: Record<string, SectionScore> = {};
  let totalEarned = 0;
  let totalPossible = 0;
  
  Object.entries(sectionQuestions).forEach(([section, questions]) => {
    let sectionEarned = 0;
    let sectionPossible = 0;
    
    questions.forEach(questionId => {
      if (responses[questionId]) {
        const weight = questionWeights[questionId] || 1;
        sectionEarned += responses[questionId].value * weight;
        sectionPossible += 5 * weight; // Maximum score (5) times weight
      }
    });
    
    // Only include section if at least one question was answered
    if (sectionPossible > 0) {
      const percentage = (sectionEarned / sectionPossible) * 100;
      sections[section] = {
        earned: sectionEarned,
        possible: sectionPossible,
        percentage
      };
      
      totalEarned += sectionEarned;
      totalPossible += sectionPossible;
    }
  });
  
  // Calculate overall percentage
  const overallPercentage = totalPossible > 0 ? (totalEarned / totalPossible) * 100 : 0;
  
  // Determine strengths and improvement areas
  const sectionPercentages = Object.entries(sections).map(([name, score]) => ({
    name,
    percentage: score.percentage
  }));
  
  // Sort sections by percentage (high to low)
  sectionPercentages.sort((a, b) => b.percentage - a.percentage);
  
  // Top 3 are strengths, bottom 3 are improvement areas
  const strengths = sectionPercentages.slice(0, 3).map(s => s.name);
  const improvementAreas = sectionPercentages.slice(-3).reverse().map(s => s.name);
  
  return {
    sections,
    overallPercentage,
    totalEarned,
    totalPossible,
    strengths,
    improvementAreas
  };
}

// Determine profile based on scores
export function determineProfile(scores: AssessmentScores, gender: string): UserProfile {
  // Get percentages for each section
  const sectionScores: Record<string, number> = {};
  Object.entries(scores.sections).forEach(([section, score]) => {
    sectionScores[section] = score.percentage;
  });
  
  // Check each profile criteria
  const matchingProfiles = profiles.filter(profile => {
    // Skip gender-specific profiles that don't match
    if (profile.genderSpecific && 
        profile.genderSpecific.toLowerCase() !== gender.toLowerCase() && 
        gender.toLowerCase() !== 'prefer not to say') {
      return false;
    }
    
    // Check if all criteria are met
    return profile.criteria.every(criterion => {
      const sectionScore = sectionScores[criterion.section] || 0;
      // Check min threshold
      if (criterion.min !== undefined && sectionScore < criterion.min) {
        return false;
      }
      // Check max threshold
      if (criterion.max !== undefined && sectionScore > criterion.max) {
        return false;
      }
      return true;
    });
  });
  
  // Return the first matching profile or a default profile
  if (matchingProfiles.length > 0) {
    return matchingProfiles[0];
  }
  
  // Default profile if no match
  return {
    id: 0,
    name: "Balanced Individual",
    description: "You demonstrate a balanced approach across all areas of assessment.",
    genderSpecific: null,
    criteria: []
  };
}