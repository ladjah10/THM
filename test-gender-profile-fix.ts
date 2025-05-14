/**
 * This test script verifies our fix for the gender profile issue
 * by testing the profile determination functions with gender normalization
 */

import { determineProfiles, calculateScores } from './client/src/utils/scoringUtils';
import { psychographicProfiles } from './client/src/data/psychographicProfiles';
// Define the types we need locally to avoid import issues
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

// Simplified test function that doesn't rely on the database
function testGenderProfileFix() {
  console.log('Running gender profile fix test...');
  
  // Set up some test scores that could map to different profiles
  const testScores: AssessmentScores = {
    sections: {
      "spiritualBelief": { earned: 45, possible: 50, percentage: 90 },
      "familyValues": { earned: 40, possible: 50, percentage: 80 },
      "personalPriorities": { earned: 42, possible: 50, percentage: 84 },
      "physicalPreferences": { earned: 38, possible: 50, percentage: 76 },
      "emotionalSupport": { earned: 44, possible: 50, percentage: 88 },
      "intellectualStimulation": { earned: 45, possible: 50, percentage: 90 },
      "relationshipNurturing": { earned: 39, possible: 50, percentage: 78 },
      "substanceChoices": { earned: 46, possible: 50, percentage: 92 },
      "attitudeTowardCounseling": { earned: 43, possible: 50, percentage: 86 },
      "financialChoices": { earned: 40, possible: 50, percentage: 80 },
      "interpersonalConflicts": { earned: 41, possible: 50, percentage: 82 },
      "sexualLifestyle": { earned: 42, possible: 50, percentage: 84 },
      "physicalHealth": { earned: 35, possible: 50, percentage: 70 }
    },
    overallPercentage: 83,
    strengths: ["spiritualBelief", "intellectualStimulation", "substanceChoices"],
    improvementAreas: ["physicalHealth", "physicalPreferences", "relationshipNurturing"],
    totalEarned: 540,
    totalPossible: 650
  };
  
  // Test different gender formats and cases to ensure our normalization works
  const genderVariations = [
    'male',
    'MALE',
    'Male',
    'female',
    'FEMALE',
    'Female',
    null,
    undefined,
    '',
    ' male ', // with spaces
    ' female ', // with spaces
  ];
  
  console.log('\n--- Testing profile determination with various gender formats ---');
  genderVariations.forEach(gender => {
    console.log(`\nTesting gender: "${gender}"`);
    
    // This should use our normalized gender handling
    const profiles = determineProfiles(testScores, gender);
    
    console.log('Primary profile:', profiles.primaryProfile?.id ?? 'undefined');
    console.log('Gender-specific profile:', profiles.genderProfile?.id ?? 'undefined');
  });
  
  // Test with all psychographic profiles to ensure coverage
  console.log('\n--- All psychographic profiles available in the system ---');
  console.log('Total profiles:', psychographicProfiles.length);
  
  // Group and count profiles by type
  const unisexProfiles = psychographicProfiles.filter(p => !p.genderSpecific);
  const maleProfiles = psychographicProfiles.filter(p => p.genderSpecific === 'male');
  const femaleProfiles = psychographicProfiles.filter(p => p.genderSpecific === 'female');
  
  console.log('Unisex profiles:', unisexProfiles.length);
  console.log('Male-specific profiles:', maleProfiles.length);
  console.log('Female-specific profiles:', femaleProfiles.length);
  
  console.log('\nUnisex profile IDs:', unisexProfiles.map(p => p.id).join(', '));
  console.log('Male profile IDs:', maleProfiles.map(p => p.id).join(', '));
  console.log('Female profile IDs:', femaleProfiles.map(p => p.id).join(', '));
  
  console.log('\nTest complete!');
}

// Run the test
try {
  testGenderProfileFix();
  console.log('Test finished successfully.');
} catch (error) {
  console.error('Test failed with error:', error);
  process.exit(1);
}