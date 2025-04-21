/**
 * This script generates a standalone PDF with all psychographic profiles
 * to test the reference section
 */
import fs from 'fs';
import { generateProfilesReferencePDF } from './server/psychographic-profiles-reference';

async function testProfilesReferencePDF() {
  try {
    console.log('Generating psychographic profiles reference PDF...');
    const pdfBuffer = await generateProfilesReferencePDF();
    
    // Save the PDF to a file
    const filePath = 'psychographic-profiles-reference.pdf';
    fs.writeFileSync(filePath, pdfBuffer);
    
    console.log(`✅ PDF successfully generated and saved to ${filePath}`);
    console.log(`File size: ${Math.round(pdfBuffer.length / 1024)} KB`);
  } catch (error) {
    console.error('❌ Error generating profiles reference PDF:', error);
  }
}

// Run the test
testProfilesReferencePDF();