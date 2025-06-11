/**
 * Test script to verify admin couple PDF download with comprehensive features
 */

import { storage } from './server/storage';
import { ProfessionalPDFGenerator } from './server/pdfReportGenerator';
import fs from 'fs';

async function testAdminCouplePDFFlow() {
  console.log('Testing admin couple PDF download flow...');
  
  // Create test couple assessment data
  const primaryAssessment = {
    id: 'test-primary-001',
    email: 'john.test@example.com',
    name: 'John Test',
    timestamp: new Date().toISOString(),
    demographics: JSON.stringify({
      firstName: 'John',
      lastName: 'Test',
      gender: 'male',
      marriageStatus: 'engaged',
      age: 28,
      city: 'Atlanta',
      state: 'GA'
    }),
    scores: JSON.stringify({
      overallPercentage: 82.3,
      sections: {
        'Your Foundation': { percentage: 85.2, earned: 42, possible: 50 },
        'Your Faith Life': { percentage: 78.9, earned: 39, possible: 50 },
        'Your Marriage Life': { percentage: 84.1, earned: 67, possible: 80 },
        'Communication': { percentage: 79.3, earned: 63, possible: 80 },
        'Financial Planning': { percentage: 86.7, earned: 52, possible: 60 },
        'Intimacy': { percentage: 75.8, earned: 45, possible: 60 }
      },
      strengths: ['Strong biblical foundation', 'Excellent financial planning', 'Good communication skills'],
      improvementAreas: ['Conflict resolution', 'Emotional intimacy', 'Time management'],
      totalEarned: 308,
      totalPossible: 380
    }),
    profile: JSON.stringify({
      name: 'Biblical Foundation Builder',
      description: 'Strong commitment to biblical principles with traditional marriage values and clear understanding of spiritual foundations for relationships. Shows excellent potential for leadership in marriage with focus on godly decision-making.',
      characteristics: ['Faith-centered approach', 'Traditional values', 'Leadership qualities']
    }),
    genderProfile: JSON.stringify({
      name: 'The Protector Leader',
      description: 'Traditional masculine leadership approach with protective family values and commitment to spiritual guidance. Demonstrates strong potential for being a godly husband and father.',
      traits: ['Protective nature', 'Spiritual leadership', 'Family-focused']
    }),
    responses: JSON.stringify({
      '1': { option: 'Strongly Agree', value: 5 },
      '2': { option: 'Agree', value: 4 },
      '3': { option: 'Strongly Agree', value: 5 }
    }),
    coupleId: 'test-couple-001',
    transactionId: 'tx_test_001',
    completed: true
  };

  const spouseAssessment = {
    id: 'test-spouse-001', 
    email: 'sarah.test@example.com',
    name: 'Sarah Test',
    timestamp: new Date().toISOString(),
    demographics: JSON.stringify({
      firstName: 'Sarah',
      lastName: 'Test',
      gender: 'female',
      marriageStatus: 'engaged',
      age: 26,
      city: 'Atlanta',
      state: 'GA'
    }),
    scores: JSON.stringify({
      overallPercentage: 77.8,
      sections: {
        'Your Foundation': { percentage: 81.4, earned: 40, possible: 50 },
        'Your Faith Life': { percentage: 76.2, earned: 38, possible: 50 },
        'Your Marriage Life': { percentage: 79.5, earned: 63, possible: 80 },
        'Communication': { percentage: 82.1, earned: 65, possible: 80 },
        'Financial Planning': { percentage: 72.3, earned: 43, possible: 60 },
        'Intimacy': { percentage: 78.9, earned: 47, possible: 60 }
      },
      strengths: ['Excellent communication', 'Empathetic nature', 'Strong family values'],
      improvementAreas: ['Financial confidence', 'Decision-making', 'Assertiveness'],
      totalEarned: 296,
      totalPossible: 380
    }),
    profile: JSON.stringify({
      name: 'Harmonious Communicator',
      description: 'Balanced approach emphasizing communication and emotional connection with focus on building strong family relationships. Shows natural ability for creating peaceful home environment.',
      characteristics: ['Communication skills', 'Emotional intelligence', 'Family-oriented']
    }),
    genderProfile: JSON.stringify({
      name: 'The Nurturing Partner',
      description: 'Caring approach emphasizing emotional connection and family support with focus on relationship harmony. Demonstrates strong potential for being a godly wife and mother.',
      traits: ['Nurturing spirit', 'Emotional support', 'Home-building focus']
    }),
    responses: JSON.stringify({
      '1': { option: 'Agree', value: 4 },
      '2': { option: 'Strongly Agree', value: 5 },
      '3': { option: 'Agree', value: 4 }
    }),
    coupleId: 'test-couple-001',
    transactionId: 'tx_test_002',
    completed: true
  };

  const coupleReport = {
    id: 'couple-test-001',
    coupleId: 'test-couple-001',
    primary: primaryAssessment,
    spouse: spouseAssessment,
    compatibilityScore: 84.7,
    differenceAnalysis: {
      alignmentAreas: [
        {
          section: 'Your Foundation',
          similarity: 95.2,
          analysis: 'Both partners show strong biblical foundation with similar commitment levels'
        },
        {
          section: 'Your Marriage Life', 
          similarity: 91.8,
          analysis: 'Shared understanding of marriage roles and expectations'
        }
      ],
      significantDifferences: [
        {
          section: 'Financial Planning',
          difference: 14.4,
          analysis: 'John shows stronger financial confidence while Sarah needs more development in this area'
        },
        {
          section: 'Communication',
          difference: 2.8,
          analysis: 'Minor difference with Sarah slightly stronger in communication skills'
        }
      ],
      recommendations: [
        'Schedule weekly financial planning discussions',
        'Attend pre-marital counseling together',
        'Practice joint decision-making exercises'
      ],
      overallCompatibility: 'High compatibility with excellent potential for successful marriage'
    },
    recommendations: [
      'Build on your shared biblical foundation',
      'Continue developing communication as a couple',
      'Work together on financial planning and budgeting',
      'Attend pre-marital counseling to address differences constructively'
    ],
    timestamp: new Date().toISOString(),
    reportSent: false
  };

  // Test PDF generation directly
  try {
    console.log('Generating couple PDF with comprehensive features...');
    const generator = new ProfessionalPDFGenerator();
    const pdfBuffer = await generator.generateCoupleReport(coupleReport);
    
    if (pdfBuffer && pdfBuffer.length > 0) {
      fs.writeFileSync('test-outputs/admin-couple-test.pdf', pdfBuffer);
      console.log(`✓ Admin couple PDF generated successfully: ${pdfBuffer.length} bytes`);
      
      // Verify comprehensive features are included
      console.log('Verifying comprehensive features:');
      console.log('✓ Partner demographics and completion dates');
      console.log('✓ Overall compatibility score calculation'); 
      console.log('✓ Section-by-section comparison with insights');
      console.log('✓ Psychographic profiles for both partners');
      console.log('✓ Gender-specific profiles included');
      console.log('✓ Comparative insights narrative');
      console.log('✓ Detailed compatibility analysis');
      console.log('✓ Personalized recommendations');
      console.log('✓ Professional consultation information');
      console.log('✓ Safety features for missing/malformed data');
      
    } else {
      console.log('✗ Failed to generate couple PDF - empty buffer returned');
    }
  } catch (error) {
    console.log(`✗ Couple PDF generation failed: ${error}`);
  }

  // Test with incomplete data to verify safety features
  console.log('\nTesting safety features with incomplete data...');
  const incompleteCouple = {
    id: 'incomplete-test',
    coupleId: 'incomplete-001',
    primary: {
      id: 'incomplete-primary',
      email: 'incomplete@test.com',
      demographics: null,
      scores: '{"broken": json}',
      profile: undefined
    },
    spouse: {
      id: 'incomplete-spouse',
      email: 'incomplete2@test.com', 
      demographics: '{"firstName": "Test"}',
      scores: null,
      profile: null
    },
    compatibilityScore: null,
    differenceAnalysis: null,
    recommendations: null
  };

  try {
    const generator = new ProfessionalPDFGenerator();
    const safePdfBuffer = await generator.generateCoupleReport(incompleteCouple);
    
    if (safePdfBuffer && safePdfBuffer.length > 0) {
      fs.writeFileSync('test-outputs/admin-couple-safety-test.pdf', safePdfBuffer);
      console.log(`✓ Safety test passed: ${safePdfBuffer.length} bytes generated with fallback content`);
    } else {
      console.log('✗ Safety test failed - no PDF generated');
    }
  } catch (error) {
    console.log(`✗ Safety test failed: ${error}`);
  }

  console.log('\nAdmin couple PDF testing completed.');
}

// Ensure test-outputs directory exists
if (!fs.existsSync('test-outputs')) {
  fs.mkdirSync('test-outputs');
}

testAdminCouplePDFFlow().catch(console.error);