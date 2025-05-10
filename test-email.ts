// Import the necessary modules
import { sendAssessmentEmail } from './server/sendgrid';
import { generateIndividualAssessmentPDF } from './server/updated-individual-pdf';
import * as fs from 'fs';
import * as path from 'path';
import { MailService } from '@sendgrid/mail';
import { DemographicData, UserProfile, AssessmentScores, UserResponse, AssessmentResult } from './shared/schema';

// Create a test assessment result
const testAssessment: AssessmentResult = {
  email: 'la@lawrenceadjah.com',
  name: 'Lawrence Adjah (Test)',
  timestamp: new Date().toISOString(),
  demographics: {
    firstName: 'Lawrence',
    lastName: 'Adjah',
    email: 'la@lawrenceadjah.com',
    phone: '555-123-4567',
    gender: 'Male',
    marriageStatus: 'Single',
    desireChildren: 'Yes',
    ethnicity: 'African, African American',
    hasPaid: true
  },
  profile: {
    id: 1,
    name: 'Marriage Ready Candidate',
    description: 'You demonstrate exceptional preparation for marriage. Your responses indicate a profound understanding of the commitment, communication, and compromise required in a successful marriage. Your perspectives on key areas like finances, conflict resolution, and family planning are well-developed, suggesting you would likely thrive in a marriage relationship.',
    genderSpecific: null,
    criteria: [
      { section: 'Communication', min: 80 },
      { section: 'Conflict Resolution', min: 75 },
      { section: 'Compatibility', min: 80 }
    ]
  },
  scores: {
    sections: {
      'Communication': { earned: 45, possible: 50, percentage: 90 },
      'Conflict Resolution': { earned: 40, possible: 50, percentage: 80 },
      'Compatibility': { earned: 42, possible: 50, percentage: 84 },
      'Finances': { earned: 38, possible: 50, percentage: 76 },
      'Family Planning': { earned: 44, possible: 50, percentage: 88 }
    },
    overallPercentage: 83.6,
    totalEarned: 209,
    totalPossible: 250,
    strengths: ['Communication', 'Family Planning', 'Compatibility'],
    improvementAreas: ['Finances', 'Conflict Resolution']
  },
  responses: {
    '1': { option: 'Strongly Agree', value: 36 },
    '2': { option: 'Agree', value: 4 },
    '3': { option: 'Somewhat Agree', value: 3 },
    '4': { option: 'Strongly Agree', value: 5 },
    '5': { option: 'Agree', value: 4 }
    // ... more responses would be here in a real assessment
  }
};

async function sendTestEmail() {
  try {
    console.log('Generating PDF for test assessment...');
    const pdfBuffer = await generateIndividualAssessmentPDF(testAssessment);
    
    // Save the PDF to a temporary file
    const tempPdfPath = './temp/test-assessment.pdf';
    const tempDir = path.dirname(tempPdfPath);
    
    // Create temp directory if it doesn't exist
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    
    fs.writeFileSync(tempPdfPath, pdfBuffer);
    console.log(`PDF saved to ${tempPdfPath}`);
    
    // Send the email with the PDF attachment
    console.log('Sending test assessment email with PDF attachment...');
    const result = await sendAssessmentEmail(testAssessment, tempPdfPath);
    
    if (result.success) {
      console.log('Test assessment email sent successfully!');
      if (result.messageId) {
        console.log('Message ID:', result.messageId);
      }
    } else {
      console.error('Failed to send test assessment email.');
    }
  } catch (error) {
    console.error('Error in test email process:', error);
    if (error.response && error.response.body) {
      console.error('Error details:', JSON.stringify(error.response.body, null, 2));
    }
  }
}

// Run the test
sendTestEmail();