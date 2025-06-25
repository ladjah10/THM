/**
 * Debug script to identify the assessment submission hanging issue
 */

import { questions } from './client/src/data/questionsData';
import { calculateScores } from './client/src/utils/scoringUtils';
import { determineProfiles } from './client/src/utils/scoringUtils';

// Test male assessment submission that might be hanging
function debugMaleAssessmentSubmission() {
  console.log('=== DEBUGGING MALE ASSESSMENT SUBMISSION HANG ===');
  
  // Simulate completed responses for all 99 questions (male respondent)
  const testResponses: Record<number, { option: string; value: number }> = {};
  
  // Generate responses for all 99 questions
  questions.forEach((q, index) => {
    testResponses[q.id] = {
      option: q.options[0], // First option
      value: 0 // First choice
    };
  });
  
  console.log(`Generated responses for ${Object.keys(testResponses).length} questions`);
  
  try {
    console.log('Step 1: Calculating scores...');
    const scores = calculateScores(questions, testResponses);
    console.log('✅ Scores calculated successfully');
    console.log(`Overall percentage: ${scores.overallPercentage}%`);
    
    console.log('Step 2: Determining profiles for male user...');
    const profiles = determineProfiles(scores, 'male');
    console.log('✅ Profiles determined successfully');
    console.log(`Primary profile: ${profiles.primaryProfile?.name || 'None'}`);
    console.log(`Gender profile: ${profiles.genderProfile?.name || 'None'}`);
    
    console.log('Step 3: Creating assessment result object...');
    const assessmentResult = {
      email: 'la@test.com',
      name: 'LA Test',
      scores: scores,
      profile: profiles.primaryProfile,
      genderProfile: profiles.genderProfile,
      responses: testResponses,
      demographics: {
        firstName: 'LA',
        lastName: 'Test',
        email: 'la@test.com',
        gender: 'male',
        marriageStatus: 'single',
        desireChildren: 'yes',
        ethnicity: 'African American',
        city: 'New York',
        state: 'NY',
        zipCode: '10001'
      },
      timestamp: new Date().toISOString()
    };
    
    console.log('✅ Assessment result object created successfully');
    console.log('✅ No hanging issues detected in core processing logic');
    
    return assessmentResult;
    
  } catch (error) {
    console.error('❌ Error found in assessment processing:');
    console.error(error);
    throw error;
  }
}

debugMaleAssessmentSubmission();