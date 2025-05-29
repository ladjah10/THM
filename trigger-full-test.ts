import questions from './client/src/data/questionsData';
import { calculateScores, determineProfile } from './client/src/utils/scoringUtils';
import { generateIndividualAssessmentPDF } from './server/pdfReportGenerator';
import { sendAssessmentEmailSendGrid } from './server/sendgrid';

async function triggerFullTest() {
  console.log('🧪 Starting full assessment test with real system components...');
  
  const testData = {
    email: 'la@lawrenceadjah.com',
    firstName: 'Test',
    lastName: 'User', 
    gender: 'male'
  };
  
  console.log(`📧 Testing for: ${testData.firstName} ${testData.lastName} (${testData.email})`);
  
  // Generate realistic weighted responses for all 99 questions
  function generateWeightedResponses(questionList: any[]) {
    const responses: Record<number, { option: string; value: number }> = {};
    
    questionList.forEach((question, index) => {
      const questionId = index + 1;
      
      if (question.type === 'declaration') {
        // 70% chance of agreement for declaration questions
        const agrees = Math.random() < 0.7;
        const selectedOption = agrees ? question.options[0] : question.options[1];
        responses[questionId] = {
          option: selectedOption,
          value: agrees ? question.weight : 0
        };
      } else {
        // Weighted towards earlier options (more traditional responses)
        const numOptions = question.options.length;
        const weights = Array.from({ length: numOptions }, (_, i) => 
          Math.pow(0.7, i) // Exponential decay favoring earlier options
        );
        const totalWeight = weights.reduce((sum, w) => sum + w, 0);
        
        let random = Math.random() * totalWeight;
        let selectedIndex = 0;
        for (let i = 0; i < weights.length; i++) {
          random -= weights[i];
          if (random <= 0) {
            selectedIndex = i;
            break;
          }
        }
        
        responses[questionId] = {
          option: question.options[selectedIndex],
          value: (selectedIndex + 1) * question.weight
        };
      }
    });
    
    return responses;
  }
  
  // Generate responses using real question data
  const responses = generateWeightedResponses(questions);
  console.log(`📝 Generated weighted responses for ${Object.keys(responses).length} questions`);
  
  // Create demographics
  const demographics = {
    firstName: testData.firstName,
    lastName: testData.lastName,
    email: testData.email,
    gender: testData.gender,
    marriageStatus: 'Single',
    desireChildren: 'Yes',
    ethnicity: 'Not specified',
    birthday: '1990-01-01',
    lifeStage: 'Adult',
    city: 'Test City',
    state: 'NY',
    zipCode: '10001',
    hasPurchasedBook: 'No'
  };
  
  try {
    // Calculate assessment using real scoring system
    console.log('📊 Calculating assessment scores...');
    const scores = calculateScores(questions, responses);
    const profile = determineProfile(scores, demographics.gender);
    
    const assessmentResult = {
      email: demographics.email,
      name: `${demographics.firstName} ${demographics.lastName}`,
      timestamp: new Date().toISOString(),
      demographics,
      scores,
      profile,
      genderProfile: null,
      responses
    };
    
    console.log(`✅ Assessment completed:`);
    console.log(`   Overall Score: ${scores.overallPercentage}%`);
    console.log(`   Primary Profile: ${profile.name}`);
    console.log(`   Section Count: ${Object.keys(scores.sections).length}`);
    
    // Generate PDF with real assessment data
    console.log('📄 Generating PDF report...');
    const pdfBuffer = await generateIndividualAssessmentPDF(assessmentResult);
    console.log(`✅ PDF generated: ${pdfBuffer.length} bytes`);
    
    // Send email with PDF
    console.log('📧 Sending assessment email...');
    const emailResult = await sendAssessmentEmailSendGrid(assessmentResult, pdfBuffer);
    
    if (emailResult.success) {
      console.log('✅ Full test completed successfully!');
      console.log(`📧 Assessment report sent to ${testData.email}`);
      console.log('\n📋 Test Summary:');
      console.log(`   Questions processed: ${Object.keys(responses).length}`);
      console.log(`   Overall score: ${assessmentResult.scores.overallPercentage}%`);
      console.log(`   Profile assigned: ${assessmentResult.profile.name}`);
      console.log(`   PDF size: ${pdfBuffer.length} bytes`);
      console.log(`   Email delivery: Success`);
    } else {
      console.error('❌ Email delivery failed:', emailResult.error);
    }
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

triggerFullTest().catch(console.error);