/**
 * Script to process historical assessment responses from an Excel file
 * and generate individual assessment reports for each respondent.
 * 
 * This script:
 * 1. Reads the Excel file containing historical responses
 * 2. Processes each response to calculate scores based on our assessment algorithm
 * 3. Generates individual assessment PDFs
 * 4. Sends emails with the PDFs to each respondent
 */

import * as XLSX from 'xlsx';
import * as path from 'path';
import * as fs from 'fs';
import type { AssessmentScores, SectionScore, UserProfile, UserResponse, DemographicData, AssessmentResult } from "@shared/schema";
import { generateIndividualPDF } from './server/pdf-generator';
import { sendAssessmentEmail } from './server/sendgrid';
import { calculateScores, determineProfile } from './server/assessment-processor';

// Update this path to point to your Excel file
const EXCEL_FILE_PATH = path.join(__dirname, 'attached_assets', 'Responses_The 100 Marriage Assessment (v1.0)(1-59).xlsx');
// Whether to actually send emails or just simulate the process
const SEND_EMAILS = false; // Set to true to send actual emails

// Main function to process the historical responses
async function processHistoricalResponses() {
  console.log('Starting to process historical responses...');
  
  try {
    // Read the Excel file
    const workbook = XLSX.readFile(EXCEL_FILE_PATH);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`Found ${jsonData.length} responses in the Excel file.`);
    
    // Process each response
    for (let i = 0; i < jsonData.length; i++) {
      const row = jsonData[i];
      console.log(`Processing response ${i+1}/${jsonData.length}: ${row['Email Address']}`);
      
      try {
        // Map data from Excel row to our Assessment format
        const assessmentResult = mapExcelRowToAssessment(row);
        
        // Skip if missing crucial data
        if (!assessmentResult) {
          console.log(`Skipping row ${i+1} due to missing data.`);
          continue;
        }
        
        // Generate PDF
        console.log(`Generating PDF for ${assessmentResult.name}...`);
        const pdfPath = await generateIndividualPDF(assessmentResult);
        
        if (SEND_EMAILS) {
          // Send email with PDF
          console.log(`Sending email to ${assessmentResult.email}...`);
          const result = await sendAssessmentEmail(assessmentResult, pdfPath);
          console.log(`Email sent: ${result.success ? 'Success' : 'Failed'}`);
        } else {
          console.log(`Email simulation (not actually sent) to ${assessmentResult.email}`);
        }
        
        console.log(`Completed processing for ${assessmentResult.name}.`);
      } catch (error) {
        console.error(`Error processing row ${i+1}:`, error);
      }
    }
    
    console.log('Finished processing all historical responses.');
  } catch (error) {
    console.error('Error reading or processing Excel file:', error);
  }
}

// Function to map Excel row data to our assessment format
function mapExcelRowToAssessment(row: any): AssessmentResult | null {
  // Check for required fields
  if (!row['Email Address'] || !row['First Name'] || !row['Last Name']) {
    return null;
  }
  
  // Create demographics data object
  const demographics: DemographicData = {
    firstName: row['First Name'] || '',
    lastName: row['Last Name'] || '',
    email: row['Email Address'] || '',
    gender: mapGender(row['What is your gender?']),
    lifeStage: row['What life stage are you in?'] || 'Adult',
    birthday: row['What is your date of birth?'] || '1990-01-01',
    marriageStatus: row['What is your current marriage status?'] || 'Single',
    desireChildren: row['Do you desire children?'] || 'Yes',
    ethnicity: row['What is your ethnicity?'] || 'Prefer not to say',
    city: row['City'] || 'N/A',
    state: row['State/Province'] || 'N/A',
    zipCode: row['ZIP/Postal Code'] || 'N/A',
    hasPurchasedBook: row['Have you read or purchased The 100 Marriage Book?'] || 'No'
  };
  
  // Map responses from each question
  const responses: Record<string, UserResponse> = {};
  
  // Process all the question columns
  Object.keys(row).forEach(key => {
    // Check if this column is an assessment question
    if (key.startsWith('Question ') && row[key]) {
      const questionId = key.replace('Question ', '');
      const responseValue = mapResponseToValue(row[key]);
      
      if (responseValue !== null) {
        responses[questionId] = {
          option: row[key],
          value: responseValue
        };
      }
    }
  });
  
  // Calculate scores
  const scores = calculateScores(responses);
  
  // Determine profile
  const profile = determineProfile(scores, demographics.gender);
  const genderProfile = profile.genderSpecific ? profile : null;
  
  // Create the full assessment result
  const assessmentResult: AssessmentResult = {
    email: demographics.email,
    name: `${demographics.firstName} ${demographics.lastName}`,
    scores,
    profile,
    genderProfile,
    responses,
    demographics,
    timestamp: new Date().toISOString()
  };
  
  return assessmentResult;
}

// Map gender value to standardized format
function mapGender(gender: string): string {
  if (!gender) return 'prefer not to say';
  
  const lowerGender = gender.toLowerCase();
  if (lowerGender.includes('male') || lowerGender.includes('man')) return 'male';
  if (lowerGender.includes('female') || lowerGender.includes('woman')) return 'female';
  return 'prefer not to say';
}

// Map text response to numeric value
function mapResponseToValue(response: string): number | null {
  if (!response) return null;
  
  const lowerResponse = response.toLowerCase();
  
  // Map based on common response patterns
  if (lowerResponse.includes('strongly agree') || lowerResponse.includes('always')) return 5;
  if (lowerResponse.includes('agree') || lowerResponse.includes('often')) return 4;
  if (lowerResponse.includes('neutral') || lowerResponse.includes('sometimes')) return 3;
  if (lowerResponse.includes('disagree') || lowerResponse.includes('rarely')) return 2;
  if (lowerResponse.includes('strongly disagree') || lowerResponse.includes('never')) return 1;
  
  // If we can't determine the response, return middle value
  return 3;
}

// Run the process
processHistoricalResponses().catch(error => {
  console.error('Unhandled error in process:', error);
});