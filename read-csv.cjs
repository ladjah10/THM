// Simple script to read CSV/Excel file
const fs = require('fs');
const path = require('path');

// Try to read the CSV file directly
const CSV_PATH = './attached_assets/Responses_The\\ 100\\ Marriage\\ Assessment\\ \\(v1.0\\)\\(1-59\\).csv';

console.log('Checking if file exists at:', CSV_PATH);
console.log('Exists:', fs.existsSync(CSV_PATH));

// Try to list all files in the directory
console.log('\nListing all files in attached_assets directory:');
try {
  const files = fs.readdirSync('./attached_assets');
  files.forEach(file => {
    console.log('-', file);
  });
} catch (err) {
  console.error('Error listing files:', err);
}

// Try to read raw CSV content
console.log('\nReading first 300 characters of CSV file:');
try {
  const data = fs.readFileSync(CSV_PATH, 'utf8');
  console.log(data.substring(0, 300) + '...');
} catch (err) {
  console.error('Error reading file:', err);
}