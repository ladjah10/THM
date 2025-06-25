/**
 * Verify Question 75 dollar sign removal
 */

import { questions } from './client/src/data/questionsData';

function verifyQuestion75Final() {
  const q75 = questions.find(q => q.id === 75);
  
  console.log('=== QUESTION 75 FINAL VERIFICATION ===');
  console.log('');
  
  console.log('Text:');
  console.log(q75.text);
  console.log('Has $ signs?', q75.text.includes('$'));
  console.log('');
  
  console.log('Options:');
  q75.options.forEach((option, index) => {
    console.log(`${index + 1}. ${option}`);
  });
  
  const hasAnyDollarSigns = q75.text.includes('$') || q75.options.some(opt => opt.includes('$'));
  
  if (!hasAnyDollarSigns) {
    console.log('✅ Question 75 successfully cleaned');
    console.log('✅ All dollar signs removed from question and options');
    console.log('✅ Percentages now display cleanly');
  } else {
    console.log('❌ Question 75 still contains dollar signs');
  }
}

verifyQuestion75Final();