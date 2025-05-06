const fs = require('fs');
const path = require('path');

// Path to our simplified CSV file
const CSV_PATH = './responses-simple.csv';

console.log('Testing simple CSV file processing...');
console.log(`Looking for file at: ${CSV_PATH}`);

// Read the CSV file
if (fs.existsSync(CSV_PATH)) {
  console.log('CSV file found!');
  
  // Read file content
  const data = fs.readFileSync(CSV_PATH, 'utf8');
  console.log('CSV data:', data);
  
  // Parse CSV data
  const lines = data.split('\n');
  const headers = lines[0].split(',');
  
  console.log('CSV headers:', headers);
  
  // Process each row
  const rows = [];
  for (let i = 1; i < lines.length; i++) {
    const row = {};
    const currentLine = lines[i].split(',');
    
    for (let j = 0; j < headers.length; j++) {
      row[headers[j]] = currentLine[j];
    }
    
    rows.push(row);
  }
  
  console.log(`Processed ${rows.length} rows of data`);
  console.log('First row:', rows[0]);
  
  // Now create a simple assessment report for the first user
  const firstUser = rows[0];
  console.log(`\nGenerating sample report for ${firstUser['First Name']} ${firstUser['Last Name']}`);
  
  // Simulate assessment scores
  const assessmentData = {
    name: `${firstUser['First Name']} ${firstUser['Last Name']}`,
    email: firstUser['Email Address'],
    gender: firstUser['What is your gender?'],
    age: firstUser['Age'],
    totalScore: 85,
    sectionScores: {
      'Foundation': { earned: 42, possible: 50, percentage: 84 },
      'Communication': { earned: 38, possible: 45, percentage: 84 },
      'Finances': { earned: 40, possible: 50, percentage: 80 },
      'Intimacy': { earned: 43, possible: 50, percentage: 86 },
      'Spiritual': { earned: 45, possible: 50, percentage: 90 }
    },
    topStrengths: ['Spiritual', 'Intimacy', 'Foundation'],
    improvementAreas: ['Finances', 'Communication'],
    primaryProfile: 'Supportive Builder',
    genderProfile: firstUser['What is your gender?'] === 'Male' ? 'Faithful Father' : 'Supportive Builder',
    compatibleWith: ['Faithful Father', 'Balanced Visionary']
  };
  
  console.log('Generated assessment data:', JSON.stringify(assessmentData, null, 2));
  
  // In a real implementation, we would:
  // 1. Generate a PDF using this data
  // 2. Send an email with the PDF attached
  console.log('\nIn a full implementation, we would generate a PDF report and email it to', firstUser['Email Address']);
  
} else {
  console.log('CSV file not found');
}