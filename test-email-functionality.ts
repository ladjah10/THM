import { sendAssessmentEmail } from './server/nodemailer';
import { AssessmentResult } from './shared/schema';

// Create a test assessment result with the same data
const testAssessment: AssessmentResult = {
  email: 'la@lawrenceadjah.com', // Replace with your own email if you want to receive the test
  name: 'Lawrence Adjah (Test)',
  timestamp: new Date().toISOString(),
  demographics: {
    firstName: 'Lawrence',
    lastName: 'Adjah',
    email: 'la@lawrenceadjah.com', // Replace with your own email if you want to receive the test
    phone: '555-123-4567',
    gender: 'Male',
    marriageStatus: 'Single',
    desireChildren: 'Yes',
    ethnicity: 'African, African American',
    hasPaid: true,
    lifeStage: 'Established Adult',
    birthday: '1985-06-15',
    city: 'New York',
    state: 'NY',
    zipCode: '10001'
  },
  profile: {
    id: 1,
    name: 'Marriage Ready Candidate',
    description: 'You demonstrate exceptional preparation for marriage. Your responses indicate a profound understanding of the commitment, communication, and compromise required in a successful marriage. Your perspectives on key areas like finances, conflict resolution, and family planning are well-developed, suggesting you would likely thrive in a marriage relationship.',
    genderSpecific: null,
    criteria: [
      { section: 'Your Marriage and Boundaries', min: 80 },
      { section: 'Your Foundation', min: 75 },
      { section: 'Your Marriage Life', min: 80 }
    ]
  },
  scores: {
    sections: {
      'Your Marriage and Boundaries': { earned: 45, possible: 50, percentage: 90 },
      'Your Foundation': { earned: 40, possible: 50, percentage: 80 },
      'Your Marriage Life': { earned: 42, possible: 50, percentage: 84 },
      'Your Finances': { earned: 38, possible: 50, percentage: 76 },
      'Your Parenting Life': { earned: 44, possible: 50, percentage: 88 }
    },
    overallPercentage: 83.6,
    totalEarned: 209,
    totalPossible: 250,
    strengths: ['Healthy relational boundaries', 'Aligned parenting perspectives', 'Clear communication and conflict resolution skills'],
    improvementAreas: ['Financial planning and money management', 'Strong foundational values and expectations']
  },
  responses: {
    '1': { option: 'Strongly Agree', value: 36 },
    '2': { option: 'Agree', value: 4 },
    '3': { option: 'Somewhat Agree', value: 3 },
    '4': { option: 'Strongly Agree', value: 5 },
    '5': { option: 'Agree', value: 4 },
    // Add more sample responses to match the format
    '6': { option: 'Strongly Agree', value: 5 },
    '7': { option: 'Somewhat Agree', value: 3 },
    '8': { option: 'Disagree', value: 2 },
    '9': { option: 'Strongly Agree', value: 5 },
    '10': { option: 'Agree', value: 4 }
    // In a real scenario, there would be responses for all 99 questions
  }
};

// Run the email test
console.log('Testing email functionality with Nodemailer...');
console.log('Sending test email to:', testAssessment.email);
console.log('CC to administrator:', 'la@lawrenceadjah.com');

sendAssessmentEmail(testAssessment)
  .then(result => {
    if (result.success) {
      console.log('✅ Test email sent successfully!');
      console.log('📧 Preview URL:', result.previewUrl);
      console.log('(Open this URL in your browser to view the test email with PDF attachment)');
    } else {
      console.error('❌ Failed to send test email');
    }
  })
  .catch(error => {
    console.error('❌ Error sending test email:', error);
  });