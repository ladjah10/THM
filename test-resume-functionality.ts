/**
 * Test script to create a partial assessment for "LA Average" user
 * and verify the resume functionality works correctly
 */

import { storage } from './server/storage';

async function createTestPartialAssessment() {
  console.log('Creating test partial assessment for LA Average...');
  
  const testEmail = "laaverage@test.com";
  const testDemographics = {
    firstName: "LA",
    lastName: "Average", 
    email: testEmail,
    phone: "555-0123",
    gender: "male",
    marriageStatus: "single",
    desireChildren: "yes",
    ethnicity: "african-american",
    lifeStage: "college-age",
    birthday: "1995-01-01",
    city: "Atlanta",
    state: "GA",
    zipCode: "30309",
    hasPurchasedBook: "no",
    purchaseDate: "",
    promoCode: "",
    interestedInArrangedMarriage: false,
    thmPoolApplied: false,
    hasPaid: true
  };
  
  const testResponses = {
    "1": { option: "We each already believe in and (have) receive(d) Jesus Christ...", value: 0 },
    "2": { option: "We will be active in a local church...", value: 0 },
    "3": { option: "We will have family prayer time...", value: 0 },
    "4": { option: "I will fast and pray regularly...", value: 0 },
    "5": { option: "We will tithe 10% of our income...", value: 0 }
  };
  
  try {
    // Save partial assessment progress
    await storage.saveAssessmentProgress({
      email: testEmail,
      demographicData: testDemographics,
      responses: testResponses,
      assessmentType: 'individual',
      timestamp: new Date().toISOString(),
      completed: false
    });
    
    console.log('✓ Test partial assessment created successfully');
    console.log(`  Email: ${testEmail}`);
    console.log(`  Responses: ${Object.keys(testResponses).length} questions`);
    console.log(`  Demographics: ${testDemographics.firstName} ${testDemographics.lastName}`);
    
    // Verify it was saved
    const saved = await storage.getAssessmentProgress(testEmail);
    if (saved) {
      console.log('✓ Verification: Progress can be retrieved');
      console.log(`  Found ${Object.keys(saved.responses || {}).length} saved responses`);
    } else {
      console.log('✗ Error: Could not retrieve saved progress');
    }
    
  } catch (error) {
    console.error('✗ Error creating test assessment:', error);
  }
}

async function testResumeAPI() {
  console.log('\nTesting resume API endpoints...');
  
  const testEmail = "laaverage@test.com";
  
  try {
    // Test check existing endpoint
    const existingAssessment = await storage.getAssessmentByEmail(testEmail);
    const partialProgress = await storage.getAssessmentProgress(testEmail);
    
    console.log('API Test Results:');
    console.log(`  getAssessmentByEmail: ${!!existingAssessment}`);
    console.log(`  getAssessmentProgress: ${!!partialProgress}`);
    
    if (partialProgress) {
      console.log(`  Partial progress found with ${Object.keys(partialProgress.responses || {}).length} responses`);
    }
    
  } catch (error) {
    console.error('✗ API test error:', error);
  }
}

// Run the test
createTestPartialAssessment()
  .then(() => testResumeAPI())
  .then(() => {
    console.log('\n🎯 Test complete! Now check the frontend to see if resume dialog appears.');
    console.log('Navigate to the assessment page and it should detect the partial progress for LA Average.');
  })
  .catch(console.error);