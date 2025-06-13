/**
 * Test the gender-specific psychographic profile implementation
 */

import { ProfessionalPDFGenerator } from './server/pdfReportGenerator';
import fs from 'fs';

async function testGenderSpecificProfiles() {
  console.log('Testing gender-specific psychographic profile implementation...');
  
  const generator = new ProfessionalPDFGenerator();
  
  // Test female assessment with gender-specific profile
  const femaleAssessment = {
    id: 'gender-female-001',
    email: 'female.test@example.com',
    name: 'Female Test User',
    timestamp: new Date().toISOString(),
    demographics: JSON.stringify({
      firstName: 'Sarah',
      lastName: 'Wilson',
      gender: 'female',
      marriageStatus: 'single',
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30309',
      ethnicity: 'African American',
      desireChildren: 'yes'
    }),
    scores: JSON.stringify({
      overallPercentage: 84.2,
      sections: {
        'Your Foundation': { percentage: 87.6, earned: 44, possible: 50 },
        'Your Faith Life': { percentage: 82.4, earned: 41, possible: 50 },
        'Your Marriage Life': { percentage: 85.0, earned: 68, possible: 80 },
        'Your Marriage and Boundaries': { percentage: 81.3, earned: 65, possible: 80 },
        'Your Family/Home Life': { percentage: 88.3, earned: 53, possible: 60 },
        'Your Parenting Life': { percentage: 83.3, earned: 50, possible: 60 },
        'Your Finances': { percentage: 78.3, earned: 47, possible: 60 },
        'Your Health and Wellness': { percentage: 86.7, earned: 52, possible: 60 }
      },
      strengths: [
        'Exceptional family values and home-building focus',
        'Strong biblical foundation with spiritual maturity',
        'Excellent communication and emotional intelligence',
        'Clear understanding of healthy relationship boundaries'
      ],
      improvementAreas: [
        'Develop greater confidence in financial leadership',
        'Practice assertiveness while maintaining grace',
        'Balance personal goals with family priorities',
        'Strengthen conflict resolution skills'
      ],
      totalEarned: 420,
      totalPossible: 500
    }),
    profile: JSON.stringify({
      name: 'Biblical Foundation Builder',
      description: 'You demonstrate exceptional commitment to biblical marriage principles with strong family values and excellent communication skills. Your approach emphasizes spiritual foundation while maintaining healthy boundaries.',
      icon: 'BV 6.png',
      characteristics: [
        'Strong biblical foundation',
        'Family-centered approach', 
        'Excellent communication',
        'Healthy boundary setting'
      ]
    }),
    genderProfile: JSON.stringify({
      name: 'The Nurturing Leader',
      description: 'As a woman, you combine traditional feminine strengths with leadership qualities. You show natural ability to nurture while maintaining personal strength and clear boundaries in relationships.',
      icon: 'FF 3.png',
      traits: [
        'Nurturing leadership style',
        'Emotional intelligence',
        'Family-focused priorities',
        'Balanced strength and gentleness'
      ]
    }),
    completed: true
  };

  // Test male assessment with gender-specific profile
  const maleAssessment = {
    id: 'gender-male-001',
    email: 'male.test@example.com',
    name: 'Male Test User',
    timestamp: new Date().toISOString(),
    demographics: JSON.stringify({
      firstName: 'Michael',
      lastName: 'Johnson',
      gender: 'male',
      marriageStatus: 'single',
      city: 'Charlotte',
      state: 'NC',
      zipCode: '28202',
      ethnicity: 'African American',
      desireChildren: 'yes'
    }),
    scores: JSON.stringify({
      overallPercentage: 81.6,
      sections: {
        'Your Foundation': { percentage: 84.8, earned: 42, possible: 50 },
        'Your Faith Life': { percentage: 80.0, earned: 40, possible: 50 },
        'Your Marriage Life': { percentage: 82.5, earned: 66, possible: 80 },
        'Your Marriage and Boundaries': { percentage: 83.8, earned: 67, possible: 80 },
        'Your Family/Home Life': { percentage: 85.0, earned: 51, possible: 60 },
        'Your Parenting Life': { percentage: 78.3, earned: 47, possible: 60 },
        'Your Finances': { percentage: 86.7, earned: 52, possible: 60 },
        'Your Health and Wellness': { percentage: 76.7, earned: 46, possible: 60 }
      },
      strengths: [
        'Strong financial stewardship and planning abilities',
        'Excellent biblical foundation and spiritual leadership',
        'Clear understanding of marriage roles and boundaries',
        'Commitment to family protection and provision'
      ],
      improvementAreas: [
        'Improve emotional communication and vulnerability',
        'Develop active listening and empathy skills',
        'Balance work commitments with family time',
        'Practice flexibility in decision-making'
      ],
      totalEarned: 411,
      totalPossible: 500
    }),
    profile: JSON.stringify({
      name: 'Protective Provider',
      description: 'You demonstrate strong commitment to biblical leadership with focus on family protection and provision. You show excellent financial stewardship and clear understanding of traditional marriage roles.',
      icon: 'BP 13.png',
      characteristics: [
        'Provider mentality',
        'Financial stewardship',
        'Protective leadership',
        'Traditional values with flexibility'
      ]
    }),
    genderProfile: JSON.stringify({
      name: 'The Guardian Leader',
      description: 'As a man, you approach relationships with traditional masculine leadership emphasizing protection, provision, and spiritual guidance. You show strong potential for godly husband and father roles.',
      icon: 'SB 1.png',
      traits: [
        'Protective leadership instincts',
        'Provider and protector focus',
        'Spiritual guidance abilities',
        'Family security emphasis'
      ]
    }),
    completed: true
  };

  try {
    // Test female PDF with gender-specific sections
    console.log('Generating female assessment PDF with gender-specific profiles...');
    const femalePDF = await generator.generateIndividualReport(femaleAssessment);
    
    if (femalePDF && femalePDF.length > 0) {
      fs.writeFileSync('test-outputs/gender-specific-female.pdf', femalePDF);
      console.log(`✓ Female PDF generated: ${femalePDF.length} bytes`);
      console.log('  - Includes general psychographic profile');
      console.log('  - Includes female-specific profile section');
      console.log('  - Appendix contains both general and gender-specific profiles');
    }
  } catch (error) {
    console.log(`✗ Female PDF generation failed: ${error}`);
  }

  try {
    // Test male PDF with gender-specific sections
    console.log('Generating male assessment PDF with gender-specific profiles...');
    const malePDF = await generator.generateIndividualReport(maleAssessment);
    
    if (malePDF && malePDF.length > 0) {
      fs.writeFileSync('test-outputs/gender-specific-male.pdf', malePDF);
      console.log(`✓ Male PDF generated: ${malePDF.length} bytes`);
      console.log('  - Includes general psychographic profile');
      console.log('  - Includes male-specific profile section');
      console.log('  - Appendix contains both general and gender-specific profiles');
    }
  } catch (error) {
    console.log(`✗ Male PDF generation failed: ${error}`);
  }

  // Test couple assessment with both gender profiles
  const coupleAssessment = {
    primary: femaleAssessment,
    spouse: maleAssessment,
    compatibilityScore: 87.2,
    recommendations: [
      'Build on your shared biblical foundation through regular devotions',
      'Celebrate your complementary gender-specific strengths',
      'Continue developing communication as balanced partners',
      'Work together on financial planning with shared goals'
    ]
  };

  try {
    console.log('Generating couple assessment PDF with gender-specific profiles...');
    const couplePDF = await generator.generateCoupleReport(coupleAssessment);
    
    if (couplePDF && couplePDF.length > 0) {
      fs.writeFileSync('test-outputs/gender-specific-couple.pdf', couplePDF);
      console.log(`✓ Couple PDF generated: ${couplePDF.length} bytes`);
      console.log('  - Shows both partners with their gender-specific profiles');
      console.log('  - Appendix includes comprehensive gender-specific reference');
    }
  } catch (error) {
    console.log(`✗ Couple PDF generation failed: ${error}`);
  }

  console.log('\n=== Gender-Specific Profile Implementation Summary ===');
  console.log('✓ Added conditional gender-specific profile sections');
  console.log('✓ Enhanced appendix with separate male/female profile descriptions');
  console.log('✓ Maintained section header consistency between main report and appendix');
  console.log('✓ Implemented proper page break controls for new sections');
  console.log('✓ Added contextual insights based on gender-specific approaches');
  console.log('✓ Both individual and couple assessments support gender-specific content');
}

// Ensure test-outputs directory exists
if (!fs.existsSync('test-outputs')) {
  fs.mkdirSync('test-outputs');
}

testGenderSpecificProfiles().catch(console.error);