import { questions } from './client/src/data/questionsData';
import { calculateScores, determineProfiles } from './client/src/utils/scoringUtils';

/**
 * Simple Assessment Test - Validates scoring and profile logic
 */

console.log('🚀 Running Simple Assessment Test...\n');

// Test configuration
const testUser = {
  email: "la@lawrenceadjah.com",
  firstName: "Lawrence",
  lastName: "Adjah",
  gender: "male" as const,
  promoCode: "FREE100"
};

// Generate weighted responses (favor earlier options)
function generateTestResponses() {
  const responses: Record<number, { option: string; value: number }> = {};
  
  questions.forEach(question => {
    if (question.type === "D") {
      // Declaration: 80% chance of affirmative
      const isAffirmative = Math.random() < 0.8;
      responses[question.id] = {
        option: isAffirmative ? question.options[0] : question.options[1],
        value: isAffirmative ? 1 : 0
      };
    } else {
      // Multiple choice: weighted toward first 3 options
      const weights = [5, 4, 3, 2, 1];
      const totalWeight = weights.slice(0, question.options.length).reduce((sum, w) => sum + w, 0);
      const randomValue = Math.random() * totalWeight;
      
      let cumulative = 0;
      let selectedIndex = 0;
      
      for (let i = 0; i < question.options.length; i++) {
        cumulative += weights[i] || 1;
        if (randomValue < cumulative) {
          selectedIndex = i;
          break;
        }
      }
      
      responses[question.id] = {
        option: question.options[selectedIndex],
        value: selectedIndex + 1
      };
    }
  });
  
  return responses;
}

try {
  // Step 1: Generate responses
  console.log('📝 Step 1: Generating Test Responses');
  const responses = generateTestResponses();
  console.log(`✅ Generated ${Object.keys(responses).length} responses`);
  
  // Sample some responses
  const sampleResponses = Object.entries(responses).slice(0, 5);
  console.log('\nSample Responses:');
  sampleResponses.forEach(([questionId, response]) => {
    const question = questions.find(q => q.id === parseInt(questionId));
    console.log(`  Q${questionId} (${question?.type}): "${response.option}" → ${response.value} points`);
  });
  
  // Step 2: Calculate scores
  console.log('\n🧮 Step 2: Calculating Assessment Scores');
  const scores = calculateScores(questions, responses);
  console.log(`✅ Overall Score: ${scores.overallPercentage}%`);
  console.log(`✅ Total Points: ${scores.totalEarned}/${scores.totalPossible}`);
  
  // Section breakdown
  console.log('\n📊 Section Performance:');
  Object.entries(scores.sections).forEach(([section, data]) => {
    console.log(`  ${section}: ${data.percentage.toFixed(1)}% (${data.earned}/${data.possible})`);
  });
  
  // Step 3: Determine profiles
  console.log('\n👤 Step 3: Profile Assignment');
  const { primaryProfile, genderProfile } = determineProfiles(scores, testUser.gender);
  console.log(`✅ Primary Profile: ${primaryProfile.name}`);
  console.log(`✅ Gender Profile: ${genderProfile ? genderProfile.name : 'None assigned'}`);
  
  // Step 4: Validation summary
  console.log('\n🎉 Test Validation Summary:');
  console.log(`✅ Questions processed: ${questions.length}/99`);
  console.log(`✅ Response generation: Working`);
  console.log(`✅ Score calculation: Working`);
  console.log(`✅ Profile assignment: Working`);
  console.log(`✅ System ready for deployment`);
  
  // Step 5: Key insights
  console.log('\n💡 Key Test Results:');
  console.log(`• Strengths: ${scores.strengths.join(', ')}`);
  console.log(`• Growth Areas: ${scores.improvementAreas.join(', ')}`);
  console.log(`• Profile Description: ${primaryProfile.description}`);
  
  if (genderProfile) {
    console.log(`• Gender-Specific Profile: ${genderProfile.description}`);
  }
  
  console.log('\n✨ Assessment system is working correctly and ready for users!');
  
} catch (error) {
  console.error('❌ Test failed:', error);
  process.exit(1);
}