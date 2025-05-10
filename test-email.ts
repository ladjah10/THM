// Import from nodemailer instead of sendgrid since nodemailer doesn't require PDF path
import { sendAssessmentEmail } from './server/nodemailer';
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

// Send test email
console.log('Sending test assessment email...');
sendAssessmentEmail(testAssessment)
  .then(result => {
    if (result.success) {
      console.log('Test assessment email sent successfully!');
      if (result.previewUrl) {
        console.log('Preview URL:', result.previewUrl);
      }
    } else {
      console.error('Failed to send test assessment email.');
    }
  })
  .catch(error => {
    console.error('Error sending test assessment email:', error);
    if (error.response && error.response.body) {
      console.error('Error details:', JSON.stringify(error.response.body, null, 2));
    }
  });