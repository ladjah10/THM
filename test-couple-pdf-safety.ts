/**
 * Test script to verify couple PDF generation safety and comprehensive features
 */

import { ProfessionalPDFGenerator } from './server/pdfReportGenerator';
import fs from 'fs';

async function testCouplePDFGeneration() {
  console.log('Testing couple PDF generation with comprehensive features...');
  
  const generator = new ProfessionalPDFGenerator();
  
  // Test Case 1: Complete couple assessment data
  const completeCouple = {
    primary: {
      id: 'test-primary',
      email: 'primary@test.com',
      timestamp: new Date('2024-06-01').toISOString(),
      demographics: JSON.stringify({
        firstName: 'John',
        lastName: 'Smith',
        gender: 'male',
        marriageStatus: 'engaged'
      }),
      scores: JSON.stringify({
        overallPercentage: 78.5,
        sections: {
          'Foundation': { percentage: 82.3 },
          'Communication': { percentage: 75.8 },
          'Financial Planning': { percentage: 80.1 },
          'Intimacy': { percentage: 74.2 }
        },
        strengths: ['Strong biblical foundation', 'Good financial planning'],
        improvementAreas: ['Communication skills', 'Conflict resolution']
      }),
      profile: JSON.stringify({
        name: 'Biblical Foundation Builder',
        description: 'Strong commitment to biblical principles with traditional marriage values and clear understanding of spiritual foundations for relationships.'
      }),
      genderProfile: JSON.stringify({
        name: 'The Protector Leader',
        description: 'Traditional masculine leadership approach with protective family values and commitment to spiritual guidance.'
      })
    },
    spouse: {
      id: 'test-spouse',
      email: 'spouse@test.com', 
      timestamp: new Date('2024-06-02').toISOString(),
      demographics: JSON.stringify({
        firstName: 'Sarah',
        lastName: 'Smith',
        gender: 'female',
        marriageStatus: 'engaged'
      }),
      scores: JSON.stringify({
        overallPercentage: 72.1,
        sections: {
          'Foundation': { percentage: 79.5 },
          'Communication': { percentage: 68.3 },
          'Financial Planning': { percentage: 75.7 },
          'Intimacy': { percentage: 71.8 }
        },
        strengths: ['Empathetic communication', 'Strong family values'],
        improvementAreas: ['Financial confidence', 'Decision-making']
      }),
      profile: JSON.stringify({
        name: 'Harmonious Planner',
        description: 'Balanced approach emphasizing communication and strategic planning with focus on emotional connection.'
      }),
      genderProfile: JSON.stringify({
        name: 'The Nurturing Partner',
        description: 'Caring approach emphasizing emotional connection and family support with focus on relationship harmony.'
      })
    },
    compatibilityScore: 85.2,
    differenceAnalysis: {
      alignmentAreas: [
        { section: 'Foundation', analysis: 'Both partners show strong biblical commitment' },
        { section: 'Financial Planning', analysis: 'Shared approach to financial responsibility' }
      ],
      significantDifferences: [
        { section: 'Communication', analysis: 'Different communication styles requiring discussion' }
      ]
    },
    recommendations: [
      'Schedule weekly relationship check-ins',
      'Attend pre-marital counseling together',
      'Develop joint financial planning system'
    ]
  };
  
  // Test Case 2: Missing data scenario
  const incompleteCouple = {
    primary: {
      id: 'incomplete-primary',
      email: 'incomplete1@test.com',
      timestamp: null,
      demographics: '{"firstName": "Alex"}',
      scores: null,
      profile: null,
      genderProfile: null
    },
    spouse: {
      id: 'incomplete-spouse', 
      email: 'incomplete2@test.com',
      timestamp: 'invalid-date',
      demographics: '{"lastName": "Johnson"}',
      scores: '{"broken": json}',
      profile: 'not-json',
      genderProfile: undefined
    },
    compatibilityScore: null,
    differenceAnalysis: null,
    recommendations: null
  };
  
  // Test complete couple assessment
  try {
    console.log('Testing complete couple assessment...');
    const completePDF = await generator.generateCoupleReport(completeCouple);
    
    if (completePDF && completePDF.length > 0) {
      fs.writeFileSync('test-outputs/complete-couple-test.pdf', completePDF);
      console.log(`✓ Complete couple PDF generated: ${completePDF.length} bytes`);
    } else {
      console.log('✗ Complete couple test returned empty buffer');
    }
  } catch (error) {
    console.log(`✗ Complete couple test failed: ${error}`);
  }
  
  // Test incomplete couple assessment
  try {
    console.log('Testing incomplete couple assessment...');
    const incompletePDF = await generator.generateCoupleReport(incompleteCouple);
    
    if (incompletePDF && incompletePDF.length > 0) {
      fs.writeFileSync('test-outputs/incomplete-couple-test.pdf', incompletePDF);
      console.log(`✓ Incomplete couple PDF generated: ${incompletePDF.length} bytes`);
    } else {
      console.log('✗ Incomplete couple test returned empty buffer');
    }
  } catch (error) {
    console.log(`✗ Incomplete couple test failed: ${error}`);
  }
  
  console.log('Couple PDF testing completed.');
}

// Ensure test-outputs directory exists
if (!fs.existsSync('test-outputs')) {
  fs.mkdirSync('test-outputs');
}

testCouplePDFGeneration().catch(console.error);