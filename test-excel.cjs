const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

// Attempt to access the Excel file
const EXCEL_FILE = './attached_assets/Responses_The 100 Marriage Assessment (v1.0)(1-59).xlsx';

try {
  console.log('Testing direct Excel file access...');
  console.log(`Looking for file at: ${EXCEL_FILE}`);
  
  // Check if file exists
  if (fs.existsSync(EXCEL_FILE)) {
    console.log('Excel file found!');
    
    // Read workbook
    const workbook = XLSX.readFile(EXCEL_FILE);
    console.log(`Loaded workbook with sheets: ${workbook.SheetNames.join(', ')}`);
    
    // Get first sheet
    const firstSheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[firstSheetName];
    
    // Convert to JSON
    const data = XLSX.utils.sheet_to_json(worksheet);
    console.log(`Successfully loaded ${data.length} rows of data`);
    
    // Show first row headers
    if (data.length > 0) {
      console.log('\nFirst row columns:');
      Object.keys(data[0]).forEach(key => {
        console.log(`- ${key}`);
      });
    }
  } else {
    console.log('File not found, trying with absolute path');
    
    // Try absolute path
    const absolutePath = path.resolve(__dirname, 'attached_assets', 'Responses_The 100 Marriage Assessment (v1.0)(1-59).xlsx');
    console.log(`Looking for file at: ${absolutePath}`);
    
    if (fs.existsSync(absolutePath)) {
      console.log('Excel file found with absolute path!');
      
      // Read workbook
      const workbook = XLSX.readFile(absolutePath);
      console.log(`Loaded workbook with sheets: ${workbook.SheetNames.join(', ')}`);
    } else {
      console.log('File not found with absolute path either');
      
      // List files in directory
      console.log('\nListing all files in directory:');
      const files = fs.readdirSync('./attached_assets');
      files.forEach(file => {
        if (file.includes('Responses')) {
          console.log(`- ${file}`);
        }
      });
    }
  }
} catch (error) {
  console.error('Error:', error);
}