/**
 * Quick verification of PDF safety improvements
 */

import { ProfessionalPDFGenerator } from './server/pdfReportGenerator';
import fs from 'fs';

async function verifyPDFSafety() {
  const generator = new ProfessionalPDFGenerator();
  
  // Test with completely empty assessment
  const emptyAssessment = {
    id: 'empty-test',
    email: 'empty@test.com',
    timestamp: null,
    scores: null,
    profile: null,
    genderProfile: null,
    demographics: null
  };
  
  try {
    console.log('Testing empty assessment data...');
    const pdfBuffer = await generator.generateIndividualReport(emptyAssessment);
    
    if (pdfBuffer && pdfBuffer.length > 0) {
      fs.writeFileSync('test-outputs/empty-assessment-test.pdf', pdfBuffer);
      console.log(`✓ Empty assessment PDF generated: ${pdfBuffer.length} bytes`);
    }
  } catch (error) {
    console.log(`✗ Empty assessment test failed: ${error}`);
  }
  
  // Test with malformed data
  const malformedAssessment = {
    id: 'malformed-test',
    email: 'malformed@test.com',
    timestamp: 'invalid-date',
    scores: '{"broken": json',
    profile: 'not-json',
    genderProfile: undefined,
    demographics: '{invalid}'
  };
  
  try {
    console.log('Testing malformed assessment data...');
    const pdfBuffer = await generator.generateIndividualReport(malformedAssessment);
    
    if (pdfBuffer && pdfBuffer.length > 0) {
      fs.writeFileSync('test-outputs/malformed-assessment-test.pdf', pdfBuffer);
      console.log(`✓ Malformed assessment PDF generated: ${pdfBuffer.length} bytes`);
    } else {
      console.log(`✗ Malformed assessment test returned empty buffer`);
    }
  } catch (error) {
    console.log(`✗ Malformed assessment test failed: ${error}`);
    console.log('Error details:', error.stack);
  }
  
  console.log('PDF safety verification completed.');
}

// Ensure test-outputs directory exists
if (!fs.existsSync('test-outputs')) {
  fs.mkdirSync('test-outputs');
}

verifyPDFSafety().catch(console.error);