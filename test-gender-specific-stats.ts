import { sendAssessmentEmail } from './server/nodemailer';
import { AssessmentResult, UserProfile } from './shared/schema';

// First, create a male test assessment
const maleTestAssessment: AssessmentResult = {
  email: 'la@lawrenceadjah.com', // Replace with your own email if you want to receive the test
  name: 'John Smith (Male Test)',
  timestamp: new Date().toISOString(),
  demographics: {
    firstName: 'John',
    lastName: 'Smith',
    email: 'la@lawrenceadjah.com',
    phone: '555-123-4567',
    gender: 'male',
    marriageStatus: 'Single',
    desireChildren: 'Yes',
    ethnicity: 'African, African American',
    hasPaid: true,
    lifeStage: 'Young Adult (22-30)',
    birthday: '1995-06-15',
    interestedInArrangedMarriage: false,
    thmPoolApplied: false,
    city: 'New York',
    state: 'NY',
    zipCode: '10001'
  },
  profile: {
    id: 1,
    name: 'Steadfast Believers',
    description: 'You hold traditional values and religious convictions central to your life and relationship expectations. You likely place high value on conventional gender roles and family structures. Faith-based principles guide your approach to marriage, and you seek a spouse who shares your spiritual commitment.',
    genderSpecific: null,
    criteria: [
      { section: 'Your Faith Life', min: 80 },
      { section: 'Your Family/Home Life', min: 75 },
      { section: 'Your Parenting Life', min: 80 }
    ],
    iconPath: '/assets/profiles/SB.png'
  },
  genderProfile: {
    id: 7,
    name: 'Faithful Protectors',
    description: 'As a male with traditional values, you see yourself as the spiritual leader and provider for your family. You believe in clearly defined gender roles and feel a strong responsibility to protect and provide for your spouse and children. Your faith deeply informs how you approach relationships.',
    genderSpecific: 'male',
    criteria: [
      { section: 'Your Faith Life', min: 85 },
      { section: 'Your Family/Home Life', min: 80 },
      { section: 'Your Parenting Life', min: 85 }
    ],
    iconPath: '/assets/profiles/FP.png'
  },
  scores: {
    sections: {
      'Your Faith Life': { earned: 45, possible: 50, percentage: 90 },
      'Your Family/Home Life': { earned: 40, possible: 50, percentage: 80 },
      'Your Health and Wellness': { earned: 42, possible: 50, percentage: 84 },
      'Your Parenting Life': { earned: 43, possible: 50, percentage: 86 },
      'Your Marriage and Boundaries': { earned: 38, possible: 50, percentage: 76 },
      'Your Finances': { earned: 44, possible: 50, percentage: 88 }
    },
    overallPercentage: 84.0,
    totalEarned: 252,
    totalPossible: 300,
    strengths: ['Faith-centered approach to relationship', 'Aligned parenting perspectives', 'Shared financial values and planning'],
    improvementAreas: ['Relationship boundaries', 'Home and family dynamics']
  },
  responses: {
    '1': { option: 'Strongly Agree', value: 36 },
    '2': { option: 'Agree', value: 4 },
    '3': { option: 'Somewhat Agree', value: 3 },
    '4': { option: 'Strongly Agree', value: 5 },
    '5': { option: 'Agree', value: 4 },
    '6': { option: 'Strongly Agree', value: 5 },
    '7': { option: 'Somewhat Agree', value: 3 },
    '8': { option: 'Disagree', value: 2 },
    '9': { option: 'Strongly Agree', value: 5 },
    '10': { option: 'Agree', value: 4 }
    // In a real scenario, there would be responses for all 99 questions
  }
};

// Second, create a female test assessment
const femaleTestAssessment: AssessmentResult = {
  email: 'la@lawrenceadjah.com', // Replace with your own email if you want to receive the test
  name: 'Jane Smith (Female Test)',
  timestamp: new Date().toISOString(),
  demographics: {
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'la@lawrenceadjah.com',
    phone: '555-123-4567',
    gender: 'female',
    marriageStatus: 'Single',
    desireChildren: 'Yes',
    ethnicity: 'African, African American',
    hasPaid: true,
    lifeStage: 'Young Adult (22-30)',
    birthday: '1996-08-20',
    interestedInArrangedMarriage: false,
    thmPoolApplied: false,
    city: 'New York',
    state: 'NY',
    zipCode: '10001'
  },
  profile: {
    id: 2,
    name: 'Harmonious Planners',
    description: 'You value structure, planning, and clear communication in relationships. You likely approach marriage methodically, with thoughtful consideration of practical matters like finances and family planning. You seek a stable, organized partnership with clear expectations.',
    genderSpecific: null,
    criteria: [
      { section: 'Your Marriage and Boundaries', min: 80 },
      { section: 'Your Finances', min: 75 },
      { section: 'Your Family/Home Life', min: 70 }
    ],
    iconPath: '/assets/profiles/HP.png'
  },
  genderProfile: {
    id: 10,
    name: 'Faith-Centered Homemakers',
    description: 'As a female with deeply traditional values, faith is the cornerstone of your approach to relationships. You see your primary role within marriage as nurturing the home and family, and you value a spouse who provides spiritual leadership and financial stability.',
    genderSpecific: 'female',
    criteria: [
      { section: 'Your Faith Life', min: 85 },
      { section: 'Your Family/Home Life', min: 85 },
      { section: 'Your Parenting Life', min: 85 }
    ],
    iconPath: '/assets/profiles/FCH.png'
  },
  scores: {
    sections: {
      'Your Faith Life': { earned: 45, possible: 50, percentage: 90 },
      'Your Family/Home Life': { earned: 46, possible: 50, percentage: 92 },
      'Your Health and Wellness': { earned: 38, possible: 50, percentage: 76 },
      'Your Parenting Life': { earned: 43, possible: 50, percentage: 86 },
      'Your Marriage and Boundaries': { earned: 41, possible: 50, percentage: 82 },
      'Your Finances': { earned: 39, possible: 50, percentage: 78 }
    },
    overallPercentage: 84.0,
    totalEarned: 252,
    totalPossible: 300,
    strengths: ['Faith-centered approach to relationship', 'Harmonious approach to home and family dynamics', 'Aligned parenting perspectives'],
    improvementAreas: ['Commitment to mutual health and wellbeing', 'Financial planning and money management']
  },
  responses: {
    '1': { option: 'Strongly Agree', value: 36 },
    '2': { option: 'Agree', value: 4 },
    '3': { option: 'Somewhat Agree', value: 3 },
    '4': { option: 'Strongly Agree', value: 5 },
    '5': { option: 'Agree', value: 4 },
    '6': { option: 'Strongly Agree', value: 5 },
    '7': { option: 'Somewhat Agree', value: 3 },
    '8': { option: 'Disagree', value: 2 },
    '9': { option: 'Strongly Agree', value: 5 },
    '10': { option: 'Agree', value: 4 }
    // In a real scenario, there would be responses for all 99 questions
  }
};

// Function to run tests sequentially
async function runTests() {
  console.log('Testing gender-specific statistics for both male and female assessments...');
  
  // First test: Male assessment
  console.log('\n🧪 TEST 1: Male assessment with gender-specific statistics');
  console.log('Sending test email to:', maleTestAssessment.email);
  try {
    const maleResult = await sendAssessmentEmail(maleTestAssessment);
    if (maleResult.success) {
      console.log('✅ Male test email sent successfully!');
      console.log('📧 Preview URL:', maleResult.previewUrl);
    } else {
      console.error('❌ Failed to send male test email');
    }
  } catch (error) {
    console.error('❌ Error sending male test email:', error);
  }

  // Brief delay between tests
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Second test: Female assessment
  console.log('\n🧪 TEST 2: Female assessment with gender-specific statistics');
  console.log('Sending test email to:', femaleTestAssessment.email);
  try {
    const femaleResult = await sendAssessmentEmail(femaleTestAssessment);
    if (femaleResult.success) {
      console.log('✅ Female test email sent successfully!');
      console.log('📧 Preview URL:', femaleResult.previewUrl);
    } else {
      console.error('❌ Failed to send female test email');
    }
  } catch (error) {
    console.error('❌ Error sending female test email:', error);
  }
  
  console.log('\n📊 Testing complete! Check your email for the test reports.');
  console.log('These emails contain the enhanced gender-specific comparative statistics sections.');
}

// Run the tests
runTests();