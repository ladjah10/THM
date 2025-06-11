/**
 * Simple test to debug couple PDF generation hanging issue
 */

import { ProfessionalPDFGenerator } from './server/pdfReportGenerator';
import fs from 'fs';

async function testSimpleCouple() {
  console.log('Testing simple couple PDF generation...');
  
  const generator = new ProfessionalPDFGenerator();
  
  const simpleCoupleData = {
    primary: {
      id: 'test-1',
      email: 'test1@example.com',
      demographics: '{"firstName": "John", "lastName": "Smith"}',
      scores: '{"overallPercentage": 75, "sections": {}, "strengths": [], "improvementAreas": []}',
      profile: '{"name": "Test Profile", "description": "Test description"}',
      timestamp: new Date().toISOString()
    },
    spouse: {
      id: 'test-2', 
      email: 'test2@example.com',
      demographics: '{"firstName": "Jane", "lastName": "Smith"}',
      scores: '{"overallPercentage": 70, "sections": {}, "strengths": [], "improvementAreas": []}',
      profile: '{"name": "Test Profile 2", "description": "Test description 2"}',
      timestamp: new Date().toISOString()
    },
    compatibilityScore: 80
  };

  try {
    console.log('Starting PDF generation...');
    const pdfBuffer = await generator.generateCoupleReport(simpleCoupleData);
    console.log(`PDF generated: ${pdfBuffer.length} bytes`);
    
    fs.writeFileSync('test-outputs/simple-couple.pdf', pdfBuffer);
    console.log('PDF saved successfully');
  } catch (error) {
    console.error('PDF generation failed:', error);
  }
}

testSimpleCouple().catch(console.error);