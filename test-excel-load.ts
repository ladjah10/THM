/**
 * Simple test script to check if we can correctly load the Excel file
 */

import { readFile, utils } from 'xlsx';

// Path to the Excel/CSV file with historical responses
const EXCEL_FILE_PATH = './attached_assets/Responses_The 100 Marriage Assessment (v1.0)(1-59).xlsx';

async function main() {
  try {
    console.log('Testing Excel file loading...');
    console.log(`Attempting to load: ${EXCEL_FILE_PATH}`);
    
    // Read the Excel file
    const workbook = XLSX.readFile(EXCEL_FILE_PATH);
    
    console.log('Successfully loaded Excel file.');
    console.log(`Sheet names: ${workbook.SheetNames.join(', ')}`);
    
    const sheetName = workbook.SheetNames[0];
    console.log(`Using sheet: ${sheetName}`);
    
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`Found ${jsonData.length} rows in the Excel file.`);
    
    if (jsonData.length > 0) {
      console.log('First row column names:');
      const firstRow = jsonData[0];
      Object.keys(firstRow).forEach(key => {
        console.log(`- ${key}`);
      });
      
      // Check a few key columns to make sure they contain data
      const sampleColumns = ['Email Address', 'First Name', 'Last Name', 'What is your gender?'];
      console.log('\nSample data from first row:');
      sampleColumns.forEach(column => {
        console.log(`- ${column}: ${firstRow[column]}`);
      });
    }
    
    console.log('\nTest completed successfully.');
  } catch (error) {
    console.error('Error in test:', error);
  }
}

main();