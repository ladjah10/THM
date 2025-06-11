/**
 * Test script to verify PDF generation safety improvements
 * Tests various edge cases including missing data, malformed JSON, and null values
 */

import { ProfessionalPDFGenerator } from './server/pdfReportGenerator';
import fs from 'fs';

async function testPDFSafety() {
  console.log('Testing PDF generation safety improvements...');
  
  const generator = new ProfessionalPDFGenerator();
  
  // Test Case 1: Missing demographics
  const testCase1 = {
    id: 'test-1',
    email: 'test@example.com',
    timestamp: new Date().toISOString(),
    scores: JSON.stringify({
      overallPercentage: 75.5,
      sections: {
        'Foundation': { percentage: 80.2 },
        'Communication': { percentage: 70.8 }
      },
      strengths: ['Strong biblical foundation', 'Good communication skills'],
      improvementAreas: ['Financial planning', 'Conflict resolution']
    }),
    profile: JSON.stringify({
      name: 'Biblical Foundation Builder',
      description: 'You demonstrate strong commitment to biblical marriage principles.'
    }),
    genderProfile: null,
    demographics: null // Missing demographics
  };
  
  // Test Case 2: Malformed JSON strings
  const testCase2 = {
    id: 'test-2',
    email: 'test2@example.com',
    timestamp: new Date().toISOString(),
    scores: '{"invalid": json}', // Malformed JSON
    profile: '{"name": "Test Profile"', // Incomplete JSON
    genderProfile: 'not-json-at-all',
    demographics: JSON.stringify({
      firstName: 'John',
      lastName: 'Doe',
      gender: 'male'
    })
  };
  
  // Test Case 3: Empty or null values
  const testCase3 = {
    id: 'test-3',
    email: 'test3@example.com',
    timestamp: null, // No timestamp
    scores: null,
    profile: null,
    genderProfile: null,
    demographics: JSON.stringify({})
  };
  
  // Test Case 4: Valid complete data (control test)
  const testCase4 = {
    id: 'test-4',
    email: 'test4@example.com',
    timestamp: new Date().toISOString(),
    scores: JSON.stringify({
      overallPercentage: 82.3,
      sections: {
        'Foundation': { percentage: 85.0 },
        'Communication': { percentage: 78.5 },
        'Financial Planning': { percentage: 80.2 }
      },
      strengths: ['Excellent biblical knowledge', 'Strong communication'],
      improvementAreas: ['Time management', 'Stress handling']
    }),
    profile: JSON.stringify({
      name: 'Harmonious Planner',
      description: 'You balance traditional values with practical planning approaches.'
    }),
    genderProfile: JSON.stringify({
      name: 'The Protector Leader',
      description: 'Strong masculine leadership with protective family values.'
    }),
    demographics: JSON.stringify({
      firstName: 'Michael',
      lastName: 'Smith',
      gender: 'male',
      marriageStatus: 'single',
      desireChildren: 'yes'
    })
  };
  
  const testCases = [testCase1, testCase2, testCase3, testCase4];
  
  for (let i = 0; i < testCases.length; i++) {
    const testCase = testCases[i];
    console.log(`\nTesting Case ${i + 1}: ${getTestDescription(i + 1)}`);
    
    try {
      const pdfBuffer = await generator.generateIndividualReport(testCase);
      
      if (pdfBuffer && pdfBuffer.length > 0) {
        const outputPath = `test-outputs/safety-test-case-${i + 1}.pdf`;
        fs.writeFileSync(outputPath, pdfBuffer);
        console.log(`✓ PDF generated successfully: ${outputPath}`);
        console.log(`  File size: ${pdfBuffer.length} bytes`);
      } else {
        console.log('✗ PDF generation returned empty buffer');
      }
    } catch (error) {
      console.log(`✗ PDF generation failed: ${error}`);
    }
  }
  
  console.log('\nPDF safety testing completed.');
}

function getTestDescription(caseNumber: number): string {
  switch (caseNumber) {
    case 1: return 'Missing demographics data';
    case 2: return 'Malformed JSON strings';
    case 3: return 'Null/empty values';
    case 4: return 'Complete valid data (control)';
    default: return 'Unknown test case';
  }
}

// Ensure test-outputs directory exists
if (!fs.existsSync('test-outputs')) {
  fs.mkdirSync('test-outputs');
}

// Run the test
testPDFSafety().catch(console.error);