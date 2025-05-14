/**
 * This script recalculates all assessment scores in the database based on the original weighting scheme
 * It preserves the intended business logic while ensuring accurate scoring
 */

import { pool } from './server/db';
import fs from 'fs';
import path from 'path';
import { psychographicProfiles } from './client/src/data/psychographicProfiles';

// Interfaces to match the client-side types
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

interface UserProfile {
  id: string;
  name: string;
  description: string;
  characteristics: string[];
  idealFor: string[];
  matchesWellWith: string[];
  managementStyle: string;
  leadershipStyle: string;
  communicationStyle: string;
  primaryMotivation: string;
  genderSpecific?: string;
  criteria: Array<{
    section: string;
    min?: number;
    max?: number;
  }>;
}

// Load questions from the client data
async function loadQuestions() {
  try {
    // Try to load from the client's source first
    const questionsPath = path.join(__dirname, 'client/src/data/questions.ts');
    
    if (fs.existsSync(questionsPath)) {
      // Read the file as text
      const fileContent = fs.readFileSync(questionsPath, 'utf8');
      
      // Extract the questions array using regex (safer than eval)
      const match = fileContent.match(/export const questions = (\[[\s\S]*?\]);/);
      
      if (match && match[1]) {
        // Use Function constructor as a safer alternative to eval
        const questions = Function(`return ${match[1]}`)();
        console.log(`Loaded ${questions.length} questions from client data`);
        return questions;
      }
    }
    
    // Fallback to manually defining the expected weights
    console.log('Could not load questions from client data, using fallback weights');
    
    // This should include all 99 questions with their section mapping and weights
    // For now, we'll return a simple structure and assume weight of 1 for all questions
    return Array.from({ length: 99 }, (_, i) => ({
      id: (i + 1).toString(),
      section: determineSectionForQuestion(i + 1),
      weight: 1 // Default weight
    }));
  } catch (error) {
    console.error('Error loading questions:', error);
    throw error;
  }
}

// Helper to determine section for a question number
function determineSectionForQuestion(questionNumber: number): string {
  // This should match the section mappings in the client code
  // Using the same mapping from fix-assessment-scores.ts
  if (questionNumber <= 11) return "Your Foundation";
  if (questionNumber <= 14) return "Your Faith Life"; 
  if (questionNumber <= 28) return "Your Marriage Life";
  if ([37, 38, 39, 40, 41, 42, 44, 50, 51].includes(questionNumber)) return "Your Parenting Life";
  if ([33, 34, 35, 43, 45, 46, 47].includes(questionNumber)) return "Your Family/Home Life";
  if ([48, 49, 72, 73, 74, 75, 76, 77, 78].includes(questionNumber)) return "Your Finances";
  if ([53, 54, 79, 80, 81, 82, 83, 84, 85, 86].includes(questionNumber)) return "Your Health and Wellness";
  if ([29, 30, 31, 32, 36, 57, 58, 59, 60].includes(questionNumber)) return "Your Marriage and Boundaries";
  if ([55, 56, 62, 63, 64, 65, 66].includes(questionNumber)) return "Your Marriage Life with Children";
  
  // If we can't map it, use a default
  return "Other";
}

// Calculate scores using the original algorithm from scoringUtils.ts
function calculateScores(questions, responses: Record<string, UserResponse>): AssessmentScores {
  // Initialize section scores
  const sectionScores: Record<string, SectionScore> = {};
  
  // Initialize total score
  let totalEarned = 0;
  let totalPossible = 0;
  
  // Process each question
  questions.forEach(question => {
    const questionId = question.id.toString();
    const response = responses[questionId];
    
    // Skip if no response
    if (!response) return;
    
    // Initialize section if not exists
    if (!sectionScores[question.section]) {
      sectionScores[question.section] = { earned: 0, possible: 0, percentage: 0 };
    }
    
    // Calculate earned value based on weight
    const questionWeight = question.weight || 1;
    const earned = response.value * questionWeight;
    const possible = 5 * questionWeight; // Max value is 5 (strongly agree)
    
    // Add to section scores
    sectionScores[question.section].earned += earned;
    sectionScores[question.section].possible += possible;
    
    // Add to total scores
    totalEarned += earned;
    totalPossible += possible;
  });
  
  // Calculate percentages for each section
  Object.keys(sectionScores).forEach(section => {
    const { earned, possible } = sectionScores[section];
    
    // Ensure we don't exceed 100%
    if (possible === 0) {
      sectionScores[section].percentage = 0;
    } else {
      // Strictly cap at 100% maximum
      const rawPercentage = (earned / possible) * 100;
      // Round to 1 decimal place for more precise percentages
      sectionScores[section].percentage = Math.min(100, Math.round(rawPercentage * 10) / 10);
    }
  });
  
  // Calculate overall percentage (capped at 100%)
  let overallPercentage = 0;
  if (totalPossible > 0) {
    // Strictly cap at 100% maximum
    const rawPercentage = (totalEarned / totalPossible) * 100;
    // Round to 1 decimal place for more precise percentages
    overallPercentage = Math.min(100, Math.round(rawPercentage * 10) / 10);
  }
  
  // Determine strengths and improvement areas
  const sectionEntries = Object.entries(sectionScores);
  sectionEntries.sort((a, b) => b[1].percentage - a[1].percentage);
  
  // Top 3 sections are strengths
  const strengths = sectionEntries
    .slice(0, 3)
    .map(([section, score]) => {
      // Ensure percentage is displayed correctly with up to 1 decimal place
      const formattedPercentage = score.percentage.toFixed(1).replace('.0', '');
      return `Strong ${section} compatibility (${formattedPercentage}%)`;
    });
  
  // Bottom 2 sections are improvement areas
  const improvementAreas = sectionEntries
    .slice(-2)
    .map(([section, score]) => {
      // Ensure percentage is displayed correctly with up to 1 decimal place
      const formattedPercentage = score.percentage.toFixed(1).replace('.0', '');
      return `${section} alignment can be improved (${formattedPercentage}%)`;
    });
  
  return {
    sections: sectionScores,
    overallPercentage,
    strengths,
    improvementAreas,
    totalEarned,
    totalPossible
  };
}

// Determine profiles using the algorithm from scoringUtils.ts
function determineProfiles(scores: AssessmentScores, gender?: string) {
  // Normalize gender value
  const normalizedGender = gender ? gender.toLowerCase().trim() : undefined;
  
  // Filter unisex profiles
  const unisexProfiles = psychographicProfiles.filter(profile => !profile.genderSpecific);
  
  // Filter gender-specific profiles
  const genderProfiles = psychographicProfiles.filter(profile => {
    if (profile.genderSpecific === 'male' && normalizedGender === 'male') return true;
    if (profile.genderSpecific === 'female' && normalizedGender === 'female') return true;
    return false;
  });
  
  // Function to find best matching profile from a list
  const findBestMatch = (profiles: UserProfile[]) => {
    if (profiles.length === 0) return null;
    
    return profiles.reduce(
      (best, current) => {
        let score = 0;
        
        // Check section matches
        current.criteria.forEach((criterion) => {
          const sectionScore = scores.sections[criterion.section]?.percentage || 0;
          
          if (criterion.min && sectionScore >= criterion.min) {
            score += 1;
          }
          
          if (criterion.max && sectionScore <= criterion.max) {
            score += 1;
          }
        });
        
        return score > best.score ? { profile: current, score } : best;
      },
      { profile: profiles[0], score: 0 }
    ).profile;
  };
  
  // Find the best matching profiles
  const primaryProfile = findBestMatch(unisexProfiles);
  const genderProfile = findBestMatch(genderProfiles);
  
  return {
    primaryProfile,
    genderProfile
  };
}

async function fixAssessmentScores() {
  console.log('Starting assessment score correction script (v2)...');
  
  // Load questions with weights
  const questions = await loadQuestions();
  console.log(`Loaded ${questions.length} questions with weights`);
  
  // Get all assessment records
  const { rows: assessments } = await pool.query(`
    SELECT id, email, name, responses, demographics, scores
    FROM assessment_results
  `);
  
  console.log(`Found ${assessments.length} assessments to process`);
  
  // Create a report file to track changes
  const reportData = {
    processed: 0,
    successful: 0,
    failed: 0,
    scoreChanges: [] as any[]
  };
  
  // Process each assessment
  for (const assessment of assessments) {
    try {
      reportData.processed++;
      
      // Parse the data
      const responses = JSON.parse(assessment.responses);
      const oldScores = JSON.parse(assessment.scores);
      const demographics = JSON.parse(assessment.demographics);
      
      // Recalculate scores using the correct algorithm
      const newScores = calculateScores(questions, responses);
      
      // Determine profiles
      const { primaryProfile, genderProfile } = determineProfiles(newScores, demographics?.gender);
      
      // Check if score changed significantly (more than 0.1%)
      const scoreDifference = Math.abs(newScores.overallPercentage - oldScores.overallPercentage);
      const hasSignificantChange = scoreDifference > 0.1;
      
      // Track score changes
      if (hasSignificantChange) {
        reportData.scoreChanges.push({
          id: assessment.id,
          email: assessment.email,
          name: assessment.name,
          oldScore: oldScores.overallPercentage,
          newScore: newScores.overallPercentage,
          difference: scoreDifference.toFixed(1)
        });
      }
      
      // Update database with corrected scores and profiles
      await pool.query(`
        UPDATE assessment_results
        SET scores = $1, profile = $2, gender_profile = $3
        WHERE id = $4
      `, [
        JSON.stringify(newScores), 
        JSON.stringify(primaryProfile),
        genderProfile ? JSON.stringify(genderProfile) : null,
        assessment.id
      ]);
      
      reportData.successful++;
      
      // Log progress
      if (reportData.processed % 10 === 0) {
        console.log(`Processed ${reportData.processed} of ${assessments.length} assessments...`);
      }
    } catch (error) {
      console.error(`Error processing assessment ${assessment.id} for ${assessment.email}:`, error);
      reportData.failed++;
    }
  }
  
  // Sort score changes by magnitude of difference
  reportData.scoreChanges.sort((a, b) => parseFloat(b.difference) - parseFloat(a.difference));
  
  // Write report to file
  const reportPath = path.join(__dirname, 'score-correction-report.json');
  fs.writeFileSync(reportPath, JSON.stringify(reportData, null, 2));
  
  console.log(`
    Score correction complete!
    - ${reportData.successful} of ${reportData.processed} assessments successfully updated
    - ${reportData.failed} assessments had errors
    - ${reportData.scoreChanges.length} assessments had significant score changes
    - Report saved to: ${reportPath}
  `);
  
  // Show samples of the largest changes
  if (reportData.scoreChanges.length > 0) {
    console.log('\nLargest score changes:');
    reportData.scoreChanges.slice(0, 5).forEach(change => {
      console.log(`  - ${change.email}: ${change.oldScore}% → ${change.newScore}% (Δ ${change.difference}%)`);
    });
  }
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