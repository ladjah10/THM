/**
 * Simple test for gender-specific profile implementation
 */

import { ProfessionalPDFGenerator } from './server/pdfReportGenerator';
import fs from 'fs';

async function testSimpleGenderProfiles() {
  console.log('Testing gender-specific profiles with simplified data...');
  
  const generator = new ProfessionalPDFGenerator();
  
  // Simple female test
  const femaleTest = {
    id: 'simple-female',
    email: 'female@test.com',
    timestamp: new Date().toISOString(),
    demographics: JSON.stringify({
      firstName: 'Jane',
      lastName: 'Doe',
      gender: 'female'
    }),
    scores: JSON.stringify({
      overallPercentage: 80,
      sections: {},
      strengths: ['Test strength'],
      improvementAreas: ['Test improvement']
    }),
    profile: JSON.stringify({
      name: 'Test Female Profile',
      description: 'Test description'
    }),
    genderProfile: JSON.stringify({
      name: 'Female Gender Profile',
      description: 'Female-specific test description'
    }),
    completed: true
  };

  // Simple male test
  const maleTest = {
    id: 'simple-male',
    email: 'male@test.com',
    timestamp: new Date().toISOString(),
    demographics: JSON.stringify({
      firstName: 'John',
      lastName: 'Doe',
      gender: 'male'
    }),
    scores: JSON.stringify({
      overallPercentage: 75,
      sections: {},
      strengths: ['Test strength'],
      improvementAreas: ['Test improvement']
    }),
    profile: JSON.stringify({
      name: 'Test Male Profile',
      description: 'Test description'
    }),
    genderProfile: JSON.stringify({
      name: 'Male Gender Profile',
      description: 'Male-specific test description'
    }),
    completed: true
  };

  try {
    const femalePDF = await generator.generateIndividualReport(femaleTest);
    if (femalePDF && femalePDF.length > 0) {
      fs.writeFileSync('test-outputs/simple-female-gender.pdf', femalePDF);
      console.log(`✓ Female PDF: ${femalePDF.length} bytes`);
    }
  } catch (error) {
    console.log(`✗ Female PDF failed: ${error}`);
  }

  try {
    const malePDF = await generator.generateIndividualReport(maleTest);
    if (malePDF && malePDF.length > 0) {
      fs.writeFileSync('test-outputs/simple-male-gender.pdf', malePDF);
      console.log(`✓ Male PDF: ${malePDF.length} bytes`);
    }
  } catch (error) {
    console.log(`✗ Male PDF failed: ${error}`);
  }

  console.log('Gender-specific profile testing completed.');
}

if (!fs.existsSync('test-outputs')) {
  fs.mkdirSync('test-outputs');
}

testSimpleGenderProfiles().catch(console.error);