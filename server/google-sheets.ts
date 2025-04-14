import { google } from 'googleapis';
import { AssessmentResult } from '../shared/schema';

// Check if we have the necessary credentials
if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
  console.warn('GOOGLE_SERVICE_ACCOUNT_KEY environment variable is not set. Google Sheets integration will not work.');
}

// Specify the spreadsheet ID and range
// This would typically be the ID from the URL of your Google Sheet
const SPREADSHEET_ID = process.env.SPREADSHEET_ID || '';
const SHEET_NAME = 'AssessmentResults';

// Function to authenticate with Google Sheets API
async function getAuthClient() {
  try {
    // Check if we have necessary credentials
    if (!process.env.GOOGLE_SERVICE_ACCOUNT_KEY) {
      throw new Error('Missing Google Service Account credentials');
    }

    // Create a JWT client using the service account credentials
    const auth = new google.auth.JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_SERVICE_ACCOUNT_KEY,
      scopes: ['https://www.googleapis.com/auth/spreadsheets'],
    });

    // Authorize the client
    await auth.authorize();
    return auth;
  } catch (error) {
    console.error('Error authenticating with Google:', error);
    throw error;
  }
}

// Function to save assessment result to Google Sheets
export async function saveAssessmentToSheet(assessment: AssessmentResult): Promise<boolean> {
  try {
    // Check if spreadsheet ID is set
    if (!SPREADSHEET_ID) {
      console.warn('SPREADSHEET_ID not set. Skipping Google Sheets update.');
      return false;
    }

    // Authenticate
    const auth = await getAuthClient();
    const sheets = google.sheets({ version: 'v4', auth });

    // Extract data from assessment
    const row = [
      assessment.timestamp,
      assessment.name,
      assessment.email,
      assessment.demographics.gender,
      assessment.demographics.marriageStatus,
      assessment.demographics.desireChildren,
      assessment.demographics.ethnicity,
      assessment.profile.name,
      assessment.scores.overallPercentage.toString(),
      assessment.demographics.hasPurchasedBook
    ];

    // Check if the sheet exists, if not create it
    try {
      // Try to get the sheet to see if it exists
      await sheets.spreadsheets.values.get({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A1:J1`,
      });
    } catch (error) {
      // If sheet doesn't exist, create it with headers
      const headers = [
        'Timestamp',
        'Name',
        'Email',
        'Gender',
        'Marriage Status',
        'Desire Children',
        'Ethnicity',
        'Profile',
        'Overall Score',
        'Book Purchased'
      ];

      // Create a new sheet
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId: SPREADSHEET_ID,
        requestBody: {
          requests: [
            {
              addSheet: {
                properties: {
                  title: SHEET_NAME,
                },
              },
            },
          ],
        },
      });

      // Add headers to the new sheet
      await sheets.spreadsheets.values.update({
        spreadsheetId: SPREADSHEET_ID,
        range: `${SHEET_NAME}!A1:J1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [headers],
        },
      });
    }

    // Append the row to the sheet
    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${SHEET_NAME}!A:J`,
      valueInputOption: 'RAW',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [row],
      },
    });

    console.log(`Assessment for ${assessment.name} added to Google Sheet successfully`);
    return true;
  } catch (error) {
    console.error('Error saving to Google Sheets:', error);
    return false;
  }
}