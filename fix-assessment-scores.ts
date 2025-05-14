/**
 * This script recalculates all assessment scores in the database based on actual response data
 * It resolves the issue where many assessments incorrectly show the same 67.3% score
 */

import { Pool } from 'pg';
import { config } from 'dotenv';

// Load environment variables
config();

// Connect to database
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

interface UserResponse {
  option: string;
  value: number;
}

interface SectionScore {
  earned: number;
  possible: number;
  percentage: number;
}

interface AssessmentScores {
  sections: Record<string, SectionScore>;
  overallPercentage: number;
  strengths: string[];
  improvementAreas: string[];
  totalEarned: number;
  totalPossible: number;
}

// Question weights by section to ensure consistent calculation
const sectionQuestions: Record<string, string[]> = {
  "Your Foundation": ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"],
  "Your Faith Life": ["12", "13", "14"],
  "Your Marriage Life": ["15", "16", "17", "18", "19", "20", "21", "22", "23", "24", "25", "26", "27", "28"],
  "Your Parenting Life": ["37", "38", "39", "40", "41", "42", "44", "50", "51"],
  "Your Family/Home Life": ["33", "34", "35", "43", "45", "46", "47"],
  "Your Finances": ["48", "49", "72", "73", "74", "75", "76", "77", "78"],
  "Your Health and Wellness": ["53", "54", "79", "80", "81", "82", "83", "84", "85", "86"],
  "Your Marriage and Boundaries": ["29", "30", "31", "32", "36", "57", "58", "59", "60"],
  "Your Marriage Life with Children": ["55", "56", "62", "63", "64", "65", "66"]
};

// Calculate scores based on responses
function calculateScores(responses: Record<string, UserResponse>): AssessmentScores {
  // Calculate section scores
  const sections: Record<string, SectionScore> = {};
  let totalEarned = 0;
  let totalPossible = 0;
  
  Object.entries(sectionQuestions).forEach(([section, questionIds]) => {
    let sectionEarned = 0;
    let sectionPossible = 0;
    
    questionIds.forEach(questionId => {
      if (responses[questionId]) {
        // Use the value directly from the response
        sectionEarned += responses[questionId].value;
        sectionPossible += 12; // Maximum value in our data appears to be 12
      }
    });
    
    // Only include section if at least one question was answered
    if (sectionPossible > 0) {
      // Calculate percentage with 1 decimal precision
      const percentage = Math.round((sectionEarned / sectionPossible) * 1000) / 10;
      sections[section] = {
        earned: sectionEarned,
        possible: sectionPossible,
        percentage
      };
      
      totalEarned += sectionEarned;
      totalPossible += sectionPossible;
    }
  });
  
  // Calculate overall percentage with 1 decimal place precision
  const overallPercentage = totalPossible > 0 
    ? Math.round((totalEarned / totalPossible) * 1000) / 10 
    : 0;
  
  // Determine strengths and improvement areas
  const sectionPercentages = Object.entries(sections).map(([name, score]) => ({
    name,
    percentage: score.percentage
  }));
  
  // Sort sections by percentage (high to low)
  sectionPercentages.sort((a, b) => b.percentage - a.percentage);
  
  // Top 3 are strengths
  const strengths = sectionPercentages
    .slice(0, 3)
    .map(s => `Strong ${s.name} compatibility (${s.percentage}%)`);
  
  // Bottom 2 are improvement areas
  const improvementAreas = sectionPercentages
    .slice(-2)
    .reverse() // Reverse to start with the lowest
    .map(s => `${s.name} alignment can be improved (${s.percentage}%)`);
  
  return {
    sections,
    overallPercentage,
    strengths,
    improvementAreas,
    totalEarned,
    totalPossible
  };
}

async function fixAssessmentScores() {
  console.log('Starting assessment score correction script...');
  
  // First, get all assessment records
  const { rows: assessments } = await pool.query(`
    SELECT id, email, name, responses, demographics
    FROM assessment_results
  `);
  
  console.log(`Found ${assessments.length} assessments to process`);
  
  // Process each assessment
  let updatedCount = 0;
  let errorCount = 0;
  
  for (const assessment of assessments) {
    try {
      // Parse the responses JSON
      const responses = JSON.parse(assessment.responses);
      
      // Recalculate scores using the correct algorithm
      const recalculatedScores = calculateScores(responses);
      
      // Update database with corrected scores
      await pool.query(`
        UPDATE assessment_results
        SET scores = $1
        WHERE id = $2
      `, [JSON.stringify(recalculatedScores), assessment.id]);
      
      updatedCount++;
      if (updatedCount % 10 === 0) {
        console.log(`Processed ${updatedCount} of ${assessments.length} assessments...`);
      }
    } catch (error) {
      console.error(`Error processing assessment ${assessment.id} for ${assessment.email}:`, error);
      errorCount++;
    }
  }
  
  console.log(`
    Score correction complete!
    - ${updatedCount} assessments successfully updated
    - ${errorCount} assessments had errors
  `);
}

// Run the script
fixAssessmentScores()
  .then(() => {
    console.log('Script completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Script failed:', error);
    process.exit(1);
  });