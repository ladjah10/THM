/**
 * Test script to simulate the assessment submission issue
 */

// Simulate what happens when a user completes all questions
const simulateUserResponses = () => {
  const userResponses = {};
  
  // Simulate 99 responses using the format that would be stored
  for (let i = 1; i <= 99; i++) {
    const questionId = `Q${i}`;
    userResponses[questionId] = {
      option: "Sample response",
      value: 1
    };
  }
  
  return userResponses;
};

// Test the validation logic
const testValidation = () => {
  const userResponses = simulateUserResponses();
  const questions = Array.from({length: 99}, (_, i) => ({id: `Q${i+1}`}));
  
  const questionIds = questions.map(q => q.id);
  const answeredQuestionKeys = Object.keys(userResponses);
  
  // Check if we have responses for all questions (handle both string and numeric formats)
  const hasAllResponses = questionIds.every(questionId => {
    const numericId = questionId.replace('Q', '');
    const hasStringMatch = answeredQuestionKeys.includes(questionId);
    const hasNumericMatch = answeredQuestionKeys.includes(numericId);
    return hasStringMatch || hasNumericMatch;
  });
  
  const answeredCount = answeredQuestionKeys.length;
  const totalQuestions = questions.length;
  
  console.log('Test Results:');
  console.log('Total questions:', totalQuestions);
  console.log('Answered count:', answeredCount);
  console.log('Has all responses:', hasAllResponses);
  console.log('Should pass validation:', hasAllResponses && answeredCount >= totalQuestions);
  
  console.log('\nFirst 5 question IDs:', questionIds.slice(0, 5));
  console.log('First 5 response keys:', answeredQuestionKeys.slice(0, 5));
  console.log('Last 5 question IDs:', questionIds.slice(-5));
  console.log('Last 5 response keys:', answeredQuestionKeys.slice(-5));
  
  // Test individual matches
  console.log('\nSample matches:');
  questionIds.slice(0, 3).forEach(qId => {
    const numericId = qId.replace('Q', '');
    console.log(`${qId}: string=${answeredQuestionKeys.includes(qId)}, numeric=${answeredQuestionKeys.includes(numericId)}`);
  });
};

testValidation();