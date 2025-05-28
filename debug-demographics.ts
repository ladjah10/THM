/**
 * Debug script to check the actual demographic data in assessments
 */

import { storage } from './server/storage';

async function debugDemographics() {
  console.log('🔍 Debugging demographic data in assessments...');
  
  try {
    const allAssessments = await storage.getAllAssessments();
    console.log(`📊 Found ${allAssessments.length} total assessments`);
    
    allAssessments.slice(0, 5).forEach((assessment, index) => {
      console.log(`\n--- Assessment ${index + 1}: ${assessment.demographics?.email} ---`);
      console.log('Demographics keys:', Object.keys(assessment.demographics || {}));
      console.log('Marriage Status:', assessment.demographics?.marriageStatus);
      console.log('Interested in Arranged Marriage:', assessment.demographics?.interestedInArrangedMarriage);
      console.log('THM Pool Applied:', assessment.demographics?.thmPoolApplied);
      console.log('Has Paid:', assessment.demographics?.hasPaid);
    });
    
  } catch (error) {
    console.error('❌ Error debugging demographics:', error);
  }
}

debugDemographics().then(() => {
  console.log('✨ Debug completed!');
  process.exit(0);
}).catch(console.error);