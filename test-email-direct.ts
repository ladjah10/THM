import { sendAssessmentEmailSendGrid } from './server/sendgrid';
import { generateIndividualAssessmentPDF } from './server/pdfReportGenerator';

async function testEmailDirectly() {
  console.log('🧪 Starting direct email test...');
  
  const testAssessment = {
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
      ethnicity: 'Not specified',
      birthday: '1990-01-01',
      lifeStage: 'Adult',
      city: 'Test City',
      state: 'NY',
      zipCode: '10001',
      hasPurchasedBook: 'No'
    },
    scores: {
      sections: {
        'Your Foundation': { earned: 45, possible: 50, percentage: 90 },
        'Communication': { earned: 40, possible: 50, percentage: 80 },
        'Conflict Resolution': { earned: 42, possible: 50, percentage: 84 },
        'Finances': { earned: 38, possible: 50, percentage: 76 },
        'Family Planning': { earned: 44, possible: 50, percentage: 88 },
        'Physical Intimacy': { earned: 35, possible: 50, percentage: 70 }
      },
      overallPercentage: 82,
      strengths: ['Strong foundation values', 'Excellent communication'],
      improvementAreas: ['Financial planning', 'Physical intimacy'],
      totalEarned: 244,
      totalPossible: 300
    },
    profile: {
      id: 1,
      name: 'The Visionary',
      description: 'Test profile for assessment validation',
      genderSpecific: null,
      criteria: []
    },
    genderProfile: null,
    responses: {}
  };

  try {
    console.log('📄 Generating PDF...');
    const pdfBuffer = await generateIndividualAssessmentPDF(testAssessment);
    console.log(`✅ PDF generated: ${pdfBuffer.length} bytes`);
    
    console.log('📧 Sending email...');
    const result = await sendAssessmentEmailSendGrid(testAssessment, pdfBuffer);
    
    if (result.success) {
      console.log('✅ Email sent successfully!');
      console.log('📧 Check la@lawrenceadjah.com for the assessment report');
    } else {
      console.error('❌ Email failed:', result.error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

testEmailDirectly().catch(console.error);