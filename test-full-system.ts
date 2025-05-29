import { sendAssessmentEmailSendGrid } from './server/sendgrid';
import { generateIndividualAssessmentPDF } from './server/pdfReportGenerator';

async function testFullSystem() {
  console.log('Testing full assessment system with realistic data...');
  
  // Create realistic assessment result using actual section structure
  const assessmentResult = {
    email: 'la@lawrenceadjah.com',
    name: 'Test User',
    timestamp: new Date().toISOString(),
    demographics: {
      firstName: 'Test',
      lastName: 'User',
      email: 'la@lawrenceadjah.com',
      gender: 'male',
      marriageStatus: 'Single',
      desireChildren: 'Yes',
      ethnicity: 'African American',
      birthday: '1990-01-01',
      lifeStage: 'Adult',
      city: 'Atlanta',
      state: 'GA',
      zipCode: '30309',
      hasPurchasedBook: 'Yes'
    },
    scores: {
      sections: {
        'Your Foundation': { earned: 48, possible: 55, percentage: 87 },
        'Your Marriage and Boundaries': { earned: 42, possible: 50, percentage: 84 },
        'Your Marriage Life': { earned: 45, possible: 60, percentage: 75 },
        'Your Faith Life': { earned: 52, possible: 65, percentage: 80 },
        'Your Finances': { earned: 38, possible: 55, percentage: 69 },
        'Your Parenting Life': { earned: 44, possible: 50, percentage: 88 },
        'Your Physical Life': { earned: 35, possible: 45, percentage: 78 }
      },
      overallPercentage: 80,
      strengths: [
        'Strong foundation in biblical principles',
        'Excellent parenting perspectives',
        'Healthy marriage boundaries'
      ],
      improvementAreas: [
        'Financial stewardship and planning',
        'Marriage life balance'
      ],
      totalEarned: 304,
      totalPossible: 380
    },
    profile: {
      id: 2,
      name: 'Biblical Foundation Builder',
      description: 'You demonstrate a strong commitment to biblical principles in relationships. Your responses indicate deep understanding of marriage foundations, with particular strength in establishing healthy boundaries and parenting perspectives. Your approach to relationships is grounded in faith-based values while maintaining practical wisdom for modern challenges.',
      genderSpecific: null,
      criteria: [
        { section: 'Your Foundation', min: 80 },
        { section: 'Your Marriage and Boundaries', min: 75 }
      ]
    },
    genderProfile: {
      id: 12,
      name: 'The Protector Leader',
      description: 'As a male, you embody protective leadership qualities with strong foundational values. You demonstrate readiness to lead a family with biblical wisdom while maintaining healthy boundaries and clear communication.',
      genderSpecific: 'male',
      criteria: [
        { section: 'Your Foundation', min: 80 },
        { section: 'Your Marriage and Boundaries', min: 80 }
      ]
    },
    responses: {}
  };

  try {
    console.log('Generating PDF report...');
    const pdfBuffer = await generateIndividualAssessmentPDF(assessmentResult);
    console.log(`PDF generated successfully: ${pdfBuffer.length} bytes`);
    
    console.log('Sending assessment email...');
    const emailResult = await sendAssessmentEmailSendGrid(assessmentResult, pdfBuffer);
    
    if (emailResult.success) {
      console.log('Full system test completed successfully!');
      console.log(`Assessment report sent to ${assessmentResult.email}`);
      console.log(`Overall score: ${assessmentResult.scores.overallPercentage}%`);
      console.log(`Primary profile: ${assessmentResult.profile.name}`);
      console.log(`Gender profile: ${assessmentResult.genderProfile.name}`);
    } else {
      console.error('Email delivery failed:', emailResult.error);
    }
    
  } catch (error) {
    console.error('Test failed:', error);
  }
}

testFullSystem().catch(console.error);