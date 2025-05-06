const fs = require('fs');

// Create a simplified CSV file based on a few rows of the original data
const csvContent = `Email Address,First Name,Last Name,What is your gender?,Age,Other Demographics
test1@example.com,John,Smith,Male,32,Single
test2@example.com,Mary,Johnson,Female,28,Married
test3@example.com,Robert,Williams,Male,35,Divorced
test4@example.com,Susan,Brown,Female,30,Single
test5@example.com,David,Jones,Male,40,Married`;

// Write to a file with a simple name
fs.writeFileSync('./responses-simple.csv', csvContent);
console.log('Created simplified CSV file at ./responses-simple.csv');

// Also write it to the attached_assets directory
fs.writeFileSync('./attached_assets/responses-simple.csv', csvContent);
console.log('Created simplified CSV file at ./attached_assets/responses-simple.csv');