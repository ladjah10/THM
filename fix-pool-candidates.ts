/**
 * Quick fix script to update existing assessments with proper pool flags
 * This addresses the issue where users completed assessments before pool tracking was implemented
 */

import { storage } from './server/storage';

async function fixPoolCandidates() {
  console.log('🔧 Fixing pool candidate flags for existing assessments...');
  
  try {
    // Get all assessments
    const allAssessments = await storage.getAllAssessments();
    console.log(`📊 Found ${allAssessments.length} total assessments`);
    
    let updatedCount = 0;
    
    for (const assessment of allAssessments) {
      const demographics = assessment.demographics;
      
      // Check if user indicated interest in arranged marriage but doesn't have thmPoolApplied flag
      if (demographics?.interestedInArrangedMarriage === true && !demographics?.thmPoolApplied) {
        console.log(`✅ Updating pool status for ${demographics.email}`);
        
        // Update the assessment with the missing flag
        const updatedAssessment = {
          ...assessment,
          demographics: {
            ...demographics,
            thmPoolApplied: true
          }
        };
        
        // Save the updated assessment
        await storage.saveAssessment(updatedAssessment);
        updatedCount++;
      }
    }
    
    console.log(`🎉 Successfully updated ${updatedCount} assessments with pool candidate flags`);
    
    // Now check how many pool candidates we have
    const poolCandidates = allAssessments.filter(assessment => {
      const demographics = assessment.demographics;
      const marriageStatus = demographics?.marriageStatus?.toLowerCase();
      const poolParticipant = demographics?.interestedInArrangedMarriage === true &&
                             (demographics?.thmPoolApplied === true || demographics?.interestedInArrangedMarriage === true);
      const eligibleStatus = ['single', 'divorced', 'widowed'].includes(marriageStatus);
      
      return poolParticipant && eligibleStatus;
    });
    
    console.log(`📋 Total pool candidates after fix: ${poolCandidates.length}`);
    poolCandidates.forEach(candidate => {
      console.log(`   - ${candidate.demographics.firstName} ${candidate.demographics.lastName} (${candidate.demographics.email})`);
    });
    
  } catch (error) {
    console.error('❌ Error fixing pool candidates:', error);
  }
}

// Run the fix
fixPoolCandidates().then(() => {
  console.log('✨ Pool candidate fix completed!');
}).catch(console.error);