/**
 * This test demonstrates the issue with male profiles in the assessment
 */
import { AssessmentResult } from './shared/schema';
import { generateIndividualAssessmentPDF } from './server/updated-individual-pdf';
import { sendAssessmentEmail } from './server/nodemailer';
import fs from 'fs';

// Create a male test assessment
const maleTestAssessment: AssessmentResult = {
  email: 'test@example.com',
  name: 'John Smith (Male Test)',
  timestamp: new Date().toISOString(),
  demographics: {
    firstName: 'John',
    lastName: 'Smith',
    email: 'test@example.com',
    gender: 'male',
    marriageStatus: 'Single',
    desireChildren: 'Yes',
    ethnicity: 'African, African American',
    hasPurchasedBook: 'No',
    lifeStage: 'Young Adult (22-30)',
    birthday: '1995-06-15',
    interestedInArrangedMarriage: false,
    thmPoolApplied: false,
    city: 'New York',
    state: 'NY',
    zipCode: '10001'
  },
  profile: {
    id: 1,
    name: 'Steadfast Believers',
    description: 'You hold traditional values and religious convictions central to your life and relationship expectations.',
    genderSpecific: null,
    criteria: [
      { section: 'Your Faith Life', min: 80 },
      { section: 'Your Family/Home Life', min: 75 }
    ]
  },
  genderProfile: {
    id: 11,
    name: 'Faithful Protectors',
    description: 'As a male with traditional values, you see yourself as the spiritual leader and provider for your family.',
    genderSpecific: 'male',
    criteria: [
      { section: 'Your Faith Life', min: 85 },
      { section: 'Your Family/Home Life', min: 80 }
    ]
  },
  scores: {
    sections: {
      'Your Faith Life': { earned: 45, possible: 50, percentage: 90 },
      'Your Family/Home Life': { earned: 40, possible: 50, percentage: 80 },
      'Your Foundation': { earned: 42, possible: 50, percentage: 84 },
      'Your Parenting Life': { earned: 43, possible: 50, percentage: 86 },
      'Your Marriage Life': { earned: 38, possible: 50, percentage: 76 },
      'Your Finances': { earned: 44, possible: 50, percentage: 88 }
    },
    overallPercentage: 84.0,
    totalEarned: 252,
    totalPossible: 300,
    strengths: ['Strong faith compatibility (90%)', 'Strong financial alignment (88%)', 'Strong parenting values (86%)'],
    improvementAreas: ['Marriage expectations can be improved (76%)', 'Family planning can be improved (80%)']
  },
  responses: {
    '1': { option: 'a', value: 5 },
    '2': { option: 'b', value: 4 },
    // Other responses would go here
  }
};

// Create a female test assessment for comparison
const femaleTestAssessment: AssessmentResult = {
  ...maleTestAssessment,
  name: 'Jane Smith (Female Test)',
  demographics: {
    ...maleTestAssessment.demographics,
    firstName: 'Jane',
    lastName: 'Smith',
    gender: 'female'
  },
  genderProfile: {
    id: 8,
    name: 'Relational Nurturers',
    description: 'As a female with traditional values, you prioritize nurturing relationships and creating a warm home environment.',
    genderSpecific: 'female',
    criteria: [
      { section: 'Your Faith Life', min: 80 },
      { section: 'Your Family/Home Life', min: 75 }
    ]
  }
};

async function runTest() {
  console.log('Testing PDF generation for male profile...');
  
  try {
    // Test male profile with direct PDF generation
    const malePdfBuffer = await generateIndividualAssessmentPDF(maleTestAssessment);
    fs.writeFileSync('male-test.pdf', malePdfBuffer);
    console.log('✅ Male PDF generated successfully: male-test.pdf');
    
    // Test female profile with direct PDF generation
    const femalePdfBuffer = await generateIndividualAssessmentPDF(femaleTestAssessment);
    fs.writeFileSync('female-test.pdf', femalePdfBuffer);
    console.log('✅ Female PDF generated successfully: female-test.pdf');
    
    // Now test the email function which includes PDF generation
    console.log('\nTesting email function for male profile...');
    try {
      const maleEmailResult = await sendAssessmentEmail(maleTestAssessment);
      console.log('✅ Male email function completed with result:', maleEmailResult);
    } catch (error) {
      console.error('❌ Male email function failed with error:', error);
    }
    
    console.log('\nTesting email function for female profile...');
    try {
      const femaleEmailResult = await sendAssessmentEmail(femaleTestAssessment);
      console.log('✅ Female email function completed with result:', femaleEmailResult);
    } catch (error) {
      console.error('❌ Female email function failed with error:', error);
    }
    
    console.log('\nTest completed!');
  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

runTest();