/**
 * Simple script to process the CSV file directly
 */

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Path to the Excel/CSV file with historical responses - using absolute path
const CSV_FILE_PATH = path.resolve(__dirname, 'attached_assets', 'Responses_The 100 Marriage Assessment (v1.0)(1-59).csv');

async function main() {
  try {
    console.log('Testing CSV file loading...');
    console.log(`Attempting to load: ${CSV_FILE_PATH}`);
    
    // Read the CSV file
    const workbook = XLSX.readFile(CSV_FILE_PATH);
    
    console.log('Successfully loaded CSV file.');
    console.log(`Sheet names: ${workbook.SheetNames.join(', ')}`);
    
    const sheetName = workbook.SheetNames[0];
    console.log(`Using sheet: ${sheetName}`);
    
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`Found ${jsonData.length} rows in the CSV file.`);
    
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
        console.log(`- ${column}: ${firstRow[column] || 'N/A'}`);
      });
    }
    
    console.log('\nTest completed successfully.');
  } catch (error) {
    console.error('Error in test:', error);
  }
}

main();