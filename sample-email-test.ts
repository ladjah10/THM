import { sendAssessmentEmail } from './server/nodemailer';
import { AssessmentResult } from './shared/schema';

// Create a sample assessment result with a fake respondent
const sampleAssessment: AssessmentResult = {
  email: 'la@lawrenceadjah.com', // Using your email for demonstration
  name: 'John Smith',
  timestamp: new Date().toISOString(),
  demographics: {
    firstName: 'John',
    lastName: 'Smith',
    email: 'la@lawrenceadjah.com', // Using your email for demonstration
    phone: '555-987-6543',
    gender: 'Male',
    marriageStatus: 'Single',
    desireChildren: 'Yes',
    ethnicity: 'Caucasian, Hispanic',
    hasPaid: true
  },
  profile: {
    id: 2,
    name: 'Relationship Growth Candidate',
    description: 'You show good potential for marriage but have several key areas for growth. Your responses indicate that while you understand some foundational aspects of marriage, there are specific dimensions that would benefit from intentional development. With focused effort on these areas, you could significantly improve your marriage readiness.',
    genderSpecific: null,
    criteria: [
      { section: 'Communication', min: 60, max: 79 },
      { section: 'Compatibility', min: 65, max: 79 }
    ]
  },
  scores: {
    sections: {
      'Communication': { earned: 38, possible: 50, percentage: 76 },
      'Conflict Resolution': { earned: 33, possible: 50, percentage: 66 },
      'Compatibility': { earned: 35, possible: 50, percentage: 70 },
      'Finances': { earned: 28, possible: 50, percentage: 56 },
      'Family Planning': { earned: 40, possible: 50, percentage: 80 }
    },
    overallPercentage: 69.6,
    totalEarned: 174,
    totalPossible: 250,
    strengths: ['Family Planning', 'Communication'],
    improvementAreas: ['Finances', 'Conflict Resolution', 'Compatibility']
  },
  responses: {
    '1': { option: 'Agree', value: 24 },
    '2': { option: 'Somewhat Agree', value: 3 },
    '3': { option: 'Disagree', value: 2 },
    '4': { option: 'Agree', value: 4 },
    '5': { option: 'Strongly Agree', value: 5 },
    '6': { option: 'Somewhat Agree', value: 3 },
    '7': { option: 'Somewhat Disagree', value: 2 },
    '8': { option: 'Disagree', value: 1 },
    '9': { option: 'Somewhat Agree', value: 3 },
    '10': { option: 'Agree', value: 4 },
    '11': { option: 'Somewhat Agree', value: 3 },
    '12': { option: 'Agree', value: 4 },
    '13': { option: 'Somewhat Disagree', value: 2 },
    '14': { option: 'Somewhat Agree', value: 3 },
    '15': { option: 'Agree', value: 4 },
    // More sample responses would be included in a real assessment
  }
};

// Send the sample email
console.log('Sending sample email with PDF for "John Smith"...');
console.log('Email will be sent to:', sampleAssessment.email);

sendAssessmentEmail(sampleAssessment)
  .then(result => {
    if (result.success) {
      console.log('✅ Sample email sent successfully!');
      console.log('');
      console.log('📧 EMAIL PREVIEW URL:');
      console.log(result.previewUrl);
      console.log('');
      console.log('👆 Open the URL above in your browser to see the sample email with PDF attachment');
    } else {
      console.error('❌ Failed to send sample email');
    }
  })
  .catch(error => {
    console.error('❌ Error sending sample email:', error);
  });