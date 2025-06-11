/**
 * Debug script to isolate the couple PDF generation hanging issue
 */

import { ProfessionalPDFGenerator } from './server/pdfReportGenerator';
import fs from 'fs';

async function debugCouplePDFIssue() {
  console.log('Debugging couple PDF generation issue...');
  
  const generator = new ProfessionalPDFGenerator();
  
  // Minimal couple data to test
  const minimalCouple = {
    primary: {
      id: 'debug-1',
      email: 'debug1@test.com',
      demographics: '{"firstName": "John", "lastName": "Doe"}',
      scores: '{"overallPercentage": 75, "sections": {}}',
      profile: '{"name": "Test Profile"}',
      timestamp: new Date().toISOString()
    },
    spouse: {
      id: 'debug-2',
      email: 'debug2@test.com', 
      demographics: '{"firstName": "Jane", "lastName": "Doe"}',
      scores: '{"overallPercentage": 70, "sections": {}}',
      profile: '{"name": "Test Profile 2"}',
      timestamp: new Date().toISOString()
    }
  };

  console.log('Starting minimal couple PDF generation...');
  
  try {
    // Add timeout to catch hanging issues
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error('PDF generation timed out')), 15000);
    });
    
    const pdfPromise = generator.generateCoupleReport(minimalCouple);
    
    const result = await Promise.race([pdfPromise, timeoutPromise]);
    
    if (result instanceof Buffer) {
      console.log(`Success: PDF generated with ${result.length} bytes`);
      fs.writeFileSync('test-outputs/debug-couple.pdf', result);
    } else {
      console.log('Unexpected result type:', typeof result);
    }
  } catch (error) {
    console.log('Error caught:', error.message);
    
    if (error.message.includes('timed out')) {
      console.log('PDF generation is hanging - investigating further...');
    }
  }
}

debugCouplePDFIssue().catch(console.error);