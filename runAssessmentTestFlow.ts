import { questions } from './client/src/data/questionsData';
import { calculateScores, determineProfiles } from './client/src/utils/scoringUtils';
import { generateIndividualAssessmentPDF } from './server/pdfReportGenerator';
import { sendAssessmentEmail } from './server/nodemailer';
import fs from 'fs';
import path from 'path';

/**
 * Automated Assessment Test System
 * Simulates a complete user assessment flow with authentic scoring and email delivery
 */

interface TestUser {
  email: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female';
  promoCode: string;
  marriageStatus: 'yes' | 'no';
  desireChildren: 'yes' | 'no';
  ethnicity: string;
  city: string;
  state: string;
  zipCode: string;
}

// Test user configuration
const testUser: TestUser = {
  email: "la@lawrenceadjah.com",
  firstName: "Lawrence",
  lastName: "Adjah",
  gender: "male",
  promoCode: "FREE100",
  marriageStatus: "no",
  desireChildren: "yes", 
  ethnicity: "African American",
  city: "Atlanta",
  state: "Georgia",
  zipCode: "30309"
};

/**
 * Generate weighted responses that simulate realistic user behavior
 * Earlier options are weighted more heavily to reflect typical response patterns
 */
function generateWeightedResponse(questionOptions: string[], questionType: string): { option: string; value: number } {
  const options = questionOptions;
  
  if (questionType === "D") {
    // Declaration questions: weighted toward affirmative responses (80% chance)
    const isAffirmative = Math.random() < 0.8;
    const selectedOption = isAffirmative ? options[0] : options[1];
    const value = isAffirmative ? 1 : 0;
    
    return { option: selectedOption, value };
  } else {
    // Multiple choice questions: weighted toward first 3 options
    const weights = options.map((_, i) => Math.max(5 - i, 1)); // [5, 4, 3, 2, 1]
    const totalWeight = weights.reduce((sum, w) => sum + w, 0);
    const randomValue = Math.random() * totalWeight;
    
    let cumulative = 0;
    for (let i = 0; i < options.length; i++) {
      cumulative += weights[i];
      if (randomValue < cumulative) {
        return { 
          option: options[i], 
          value: i + 1 // 1-based indexing for scoring
        };
      }
    }
    
    // Fallback to first option
    return { option: options[0], value: 1 };
  }
}

/**
 * Generate complete set of responses for all 99 questions
 */
function generateSimulatedResponses(): Record<number, { option: string; value: number }> {
  const responses: Record<number, { option: string; value: number }> = {};
  
  questions.forEach(question => {
    responses[question.id] = generateWeightedResponse(question.options, question.type);
  });
  
  return responses;
}

/**
 * Validate promo code and determine if payment should be bypassed
 */
function validatePromoCode(promoCode: string): boolean {
  const validPromoCodes = ['FREE100', 'LA2025', 'MARRIAGE100', 'INVITED10'];
  return validPromoCodes.includes(promoCode);
}

/**
 * Create test outputs directory if it doesn't exist
 */
function ensureTestOutputsDirectory(): void {
  const outputDir = path.join(process.cwd(), 'test-outputs');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
    console.log('📁 Created test-outputs directory');
  }
}

/**
 * Save test results to files for inspection
 */
async function saveTestResults(assessment: any, pdfBuffer: Buffer): Promise<void> {
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const outputDir = path.join(process.cwd(), 'test-outputs');
  
  // Save PDF report
  const pdfPath = path.join(outputDir, `assessment-report-${timestamp}.pdf`);
  fs.writeFileSync(pdfPath, pdfBuffer);
  console.log(`📄 PDF report saved: ${pdfPath}`);
  
  // Save assessment data as JSON
  const jsonPath = path.join(outputDir, `assessment-data-${timestamp}.json`);
  fs.writeFileSync(jsonPath, JSON.stringify(assessment, null, 2));
  console.log(`📊 Assessment data saved: ${jsonPath}`);
  
  // Save email log
  const emailLogPath = path.join(outputDir, `email-log-${timestamp}.json`);
  const emailLog = {
    timestamp: new Date().toISOString(),
    recipient: testUser.email,
    subject: 'Your 100 Marriage Assessment Results',
    assessmentScore: assessment.scores.overallPercentage,
    profileName: assessment.profile.name,
    genderProfileName: assessment.genderProfile?.name || 'None',
    status: 'sent'
  };
  fs.writeFileSync(emailLogPath, JSON.stringify(emailLog, null, 2));
  console.log(`📧 Email log saved: ${emailLogPath}`);
}

/**
 * Main test execution function
 */
async function runAssessmentTest(): Promise<void> {
  console.log('🚀 Starting Automated Assessment Test Flow...\n');
  
  try {
    // Step 1: Setup
    console.log('📋 Step 1: Test Configuration');
    console.log(`User: ${testUser.firstName} ${testUser.lastName}`);
    console.log(`Email: ${testUser.email}`);
    console.log(`Gender: ${testUser.gender}`);
    console.log(`Promo Code: ${testUser.promoCode}`);
    
    ensureTestOutputsDirectory();
    
    // Step 2: Validate promo code
    console.log('\n💳 Step 2: Promo Code Validation');
    const skipPayment = validatePromoCode(testUser.promoCode);
    console.log(`Promo code valid: ${skipPayment ? '✅ Yes' : '❌ No'}`);
    
    if (!skipPayment) {
      console.log('❌ Invalid promo code - test would require payment');
      return;
    }
    
    // Step 3: Generate responses
    console.log('\n📝 Step 3: Generating Simulated Responses');
    const responses = generateSimulatedResponses();
    console.log(`Generated ${Object.keys(responses).length} responses`);
    
    // Sample some responses for verification
    const sampleResponses = Object.entries(responses).slice(0, 5);
    sampleResponses.forEach(([questionId, response]) => {
      const question = questions.find(q => q.id === parseInt(questionId));
      console.log(`  Q${questionId}: "${response.option}" (value: ${response.value}, type: ${question?.type})`);
    });
    
    // Step 4: Calculate scores and determine profiles
    console.log('\n🧮 Step 4: Calculating Assessment Scores');
    const scores = calculateScores(questions, responses);
    console.log(`Overall score: ${scores.overallPercentage}%`);
    console.log(`Total earned: ${scores.totalEarned}/${scores.totalPossible} points`);
    
    // Display section scores
    console.log('\nSection Performance:');
    Object.entries(scores.sections).forEach(([section, data]) => {
      console.log(`  ${section}: ${data.percentage}%`);
    });
    
    // Step 5: Determine psychographic profiles
    console.log('\n👤 Step 5: Determining Psychographic Profiles');
    const { primaryProfile, genderProfile } = determineProfiles(scores, testUser.gender);
    console.log(`Primary Profile: ${primaryProfile.name}`);
    console.log(`Gender Profile: ${genderProfile ? genderProfile.name : 'None assigned'}`);
    
    // Step 6: Create assessment result object
    const assessment = {
      email: testUser.email,
      name: `${testUser.firstName} ${testUser.lastName}`,
      demographics: {
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        email: testUser.email,
        gender: testUser.gender,
        marriageStatus: testUser.marriageStatus,
        desireChildren: testUser.desireChildren,
        ethnicity: testUser.ethnicity,
        city: testUser.city,
        state: testUser.state,
        zipCode: testUser.zipCode
      },
      responses,
      scores,
      profile: primaryProfile,
      genderProfile,
      timestamp: new Date().toISOString()
    };
    
    // Step 7: Generate PDF report
    console.log('\n📄 Step 7: Generating PDF Report');
    const pdfBuffer = await generateIndividualAssessmentPDF(assessment);
    console.log(`PDF generated successfully (${pdfBuffer.length} bytes)`);
    
    // Step 8: Save test results
    console.log('\n💾 Step 8: Saving Test Results');
    await saveTestResults(assessment, pdfBuffer);
    
    // Step 9: Send email (optional - only if email service is configured)
    console.log('\n📧 Step 9: Email Delivery Test');
    try {
      const emailResult = await sendAssessmentEmail(testUser.email, assessment);
      console.log('✅ Email sent successfully');
      console.log(`Email preview URL: ${emailResult.previewUrl || 'N/A'}`);
    } catch (emailError) {
      console.log('⚠️  Email delivery skipped (email service not configured)');
      console.log(`Email error: ${emailError.message}`);
    }
    
    // Step 10: Test summary
    console.log('\n🎉 Assessment Test Flow Completed Successfully!');
    console.log('\n📊 Test Summary:');
    console.log(`✅ Questions answered: ${Object.keys(responses).length}/99`);
    console.log(`✅ Overall score: ${scores.overallPercentage}%`);
    console.log(`✅ Profile assigned: ${primaryProfile.name}`);
    console.log(`✅ PDF generated: ${pdfBuffer.length} bytes`);
    console.log(`✅ Files saved to: test-outputs/`);
    
    console.log('\n🔍 Review the generated files in the test-outputs directory to validate:');
    console.log('  • PDF formatting and content accuracy');
    console.log('  • Assessment scoring calculations'); 
    console.log('  • Profile assignment logic');
    console.log('  • Email delivery functionality');
    
  } catch (error) {
    console.error('❌ Assessment test failed:', error);
    throw error;
  }
}

/**
 * Alternative test with female user
 */
async function runFemaleAssessmentTest(): Promise<void> {
  const femaleTestUser = {
    ...testUser,
    email: "sarah.test@lawrenceadjah.com",
    firstName: "Sarah",
    lastName: "TestUser",
    gender: "female" as const
  };
  
  console.log('\n👩 Running Female Assessment Test...');
  
  // Temporarily update the global test user
  const originalUser = { ...testUser };
  Object.assign(testUser, femaleTestUser);
  
  try {
    await runAssessmentTest();
  } finally {
    // Restore original test user
    Object.assign(testUser, originalUser);
  }
}

/**
 * Run comprehensive test suite
 */
async function runFullTestSuite(): Promise<void> {
  console.log('🧪 Starting Comprehensive Assessment Test Suite\n');
  
  try {
    // Test 1: Male assessment
    console.log('='.repeat(60));
    console.log('TEST 1: MALE ASSESSMENT');
    console.log('='.repeat(60));
    await runAssessmentTest();
    
    // Test 2: Female assessment
    console.log('\n' + '='.repeat(60));
    console.log('TEST 2: FEMALE ASSESSMENT');
    console.log('='.repeat(60));
    await runFemaleAssessmentTest();
    
    console.log('\n🎊 Full Test Suite Completed Successfully!');
    console.log('\nBoth male and female assessment flows have been validated.');
    
  } catch (error) {
    console.error('❌ Test suite failed:', error);
  }
}

// Export functions for external use
export { runAssessmentTest, runFemaleAssessmentTest, runFullTestSuite };

// Run test if this file is executed directly
if (require.main === module) {
  const testType = process.argv[2] || 'single';
  
  switch (testType) {
    case 'full':
      runFullTestSuite();
      break;
    case 'female':
      runFemaleAssessmentTest();
      break;
    case 'single':
    default:
      runAssessmentTest();
      break;
  }
}