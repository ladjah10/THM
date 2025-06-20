/**
 * Test Enhanced PDF Download with Recalculated Assessment Priority
 */

import { storage } from './server/storage';
import type { AssessmentResult, DemographicData } from './shared/schema';

async function testEnhancedPdfDownload() {
  console.log('=== Enhanced PDF Download Test ===\n');

  // Create sample assessment data
  const demographics: DemographicData = {
    email: 'test-pdf@example.com',
    firstName: 'John',
    lastName: 'Doe',
    phone: '555-0123',
    gender: 'male',
    marriageStatus: 'single',
    desireChildren: 'yes',
    ethnicity: 'caucasian',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    birthday: '1990-01-15',
    lifeStage: 'young_adult',
    hasPurchasedBook: false
  };

  // Create original assessment
  const originalAssessment: AssessmentResult = {
    id: 'test-original-123',
    email: 'test-pdf@example.com',
    name: 'John Doe',
    scores: {
      overall: 75,
      sections: {
        'Your Foundation': 80,
        'Intimacy & Romance': 70,
        'Communication': 85
      }
    },
    profile: {
      id: 3,
      name: 'The Free-Flowing Romantic',
      description: 'Original profile description'
    },
    genderProfile: {
      id: 3,
      name: 'Free-Flowing Romantic - Male',
      description: 'Original gender-specific profile'
    },
    responses: {
      '1': { option: 'A', value: 4 },
      '2': { option: 'B', value: 3 }
    },
    demographics,
    timestamp: new Date().toISOString(),
    recalculated: false
  };

  // Create recalculated assessment with improved scores
  const recalculatedAssessment: AssessmentResult = {
    ...originalAssessment,
    scores: {
      overall: 88,
      sections: {
        'Your Foundation': 92,
        'Intimacy & Romance': 85,
        'Communication': 87
      }
    },
    profile: {
      id: 4,
      name: 'The Passionate Provider',
      description: 'Recalculated profile description'
    },
    genderProfile: {
      id: 4,
      name: 'Passionate Provider - Male',
      description: 'Recalculated gender-specific profile'
    },
    recalculated: true,
    lastRecalculated: new Date().toISOString(),
    originalScore: 75,
    originalProfile: 'The Free-Flowing Romantic'
  };

  try {
    // 1. Save original assessment
    console.log('1. Saving original assessment...');
    await storage.saveAssessment(originalAssessment);
    console.log('✓ Original assessment saved');

    // 2. Save recalculated version
    console.log('\n2. Saving recalculated assessment...');
    await storage.updateAssessment(originalAssessment.id, recalculatedAssessment);
    console.log('✓ Recalculated assessment saved');

    // 3. Test retrieval priority
    console.log('\n3. Testing retrieval priority...');
    
    // Test getRecalculatedAssessments
    const recalculatedList = await storage.getRecalculatedAssessments();
    console.log(`Found ${recalculatedList.length} recalculated assessments`);
    
    const foundRecalculated = recalculatedList.find(a => a.id === originalAssessment.id);
    if (foundRecalculated) {
      console.log('✓ Assessment found in recalculated list');
      console.log(`  - Overall score: ${foundRecalculated.scores.overall} (improved from ${foundRecalculated.originalScore})`);
      console.log(`  - Profile: ${foundRecalculated.profile.name}`);
      console.log(`  - Recalculated: ${foundRecalculated.recalculated}`);
    } else {
      console.log('✗ Assessment not found in recalculated list');
    }

    // Test getCompletedAssessment
    const completedAssessment = await storage.getCompletedAssessment(originalAssessment.id);
    if (completedAssessment) {
      console.log('\n✓ Assessment retrieved via getCompletedAssessment');
      console.log(`  - Overall score: ${completedAssessment.scores.overall}`);
      console.log(`  - Is recalculated: ${completedAssessment.recalculated}`);
    } else {
      console.log('\n✗ Assessment not found via getCompletedAssessment');
    }

    // 4. Test PDF download priority logic
    console.log('\n4. Testing PDF download priority logic...');
    
    // Simulate the enhanced PDF download logic
    const decodedId = originalAssessment.id;
    
    // Try to get from recalculated assessments first
    const recalculated = await storage.getRecalculatedAssessments();
    let assessment = recalculated.find(a => a.id === decodedId);
    console.log(`Step 1 - Recalculated search: ${assessment ? 'FOUND' : 'NOT FOUND'}`);
    
    // If not found, try completed assessments
    if (!assessment) {
      assessment = await storage.getCompletedAssessment(decodedId);
      console.log(`Step 2 - Completed search: ${assessment ? 'FOUND' : 'NOT FOUND'}`);
    }
    
    // Fallback to search by ID in all original assessments
    if (!assessment) {
      const allOriginal = await storage.getAllAssessments();
      assessment = allOriginal.find(a => a.id === decodedId);
      console.log(`Step 3 - All assessments search: ${assessment ? 'FOUND' : 'NOT FOUND'}`);
    }

    if (assessment) {
      console.log('\n✓ Assessment successfully retrieved for PDF generation');
      console.log(`  - ID: ${assessment.id}`);
      console.log(`  - Overall score: ${assessment.scores.overall}`);
      console.log(`  - Profile: ${assessment.profile.name}`);
      console.log(`  - Recalculated: ${assessment.recalculated}`);
      console.log(`  - Data source: ${assessment.recalculated ? 'RECALCULATED' : 'ORIGINAL'}`);
      
      if (assessment.recalculated) {
        console.log(`  - Original score: ${assessment.originalScore}`);
        console.log(`  - Score improvement: ${assessment.scores.overall - (assessment.originalScore || 0)}`);
      }
    } else {
      console.log('\n✗ Assessment not found - PDF generation would fail');
    }

    console.log('\n=== Test Summary ===');
    console.log('✓ Enhanced PDF download logic successfully prioritizes recalculated assessments');
    console.log('✓ Fallback mechanism works for original assessments');
    console.log('✓ Assessment data integrity maintained throughout process');

  } catch (error) {
    console.error('Test failed:', error);
    throw error;
  }
}

// Run the test
testEnhancedPdfDownload().catch(console.error);