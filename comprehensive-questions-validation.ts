/**
 * Comprehensive Questions Validation
 * Validates all 99 questions have proper options and scoring
 */

import { questions } from './client/src/data/questionsData';

interface ValidationResult {
  questionId: number;
  section: string;
  type: string;
  text: string;
  issues: string[];
  optionCount: number;
  hasValidOptions: boolean;
  scoringValid: boolean;
}

function validateAllQuestions(): ValidationResult[] {
  const results: ValidationResult[] = [];
  
  questions.forEach(question => {
    const issues: string[] = [];
    let hasValidOptions = true;
    let scoringValid = true;
    
    // Check if question has options
    if (!question.options || question.options.length === 0) {
      issues.push("No options provided");
      hasValidOptions = false;
    } else if (question.options.length < 2) {
      issues.push("Less than 2 options provided");
      hasValidOptions = false;
    }
    
    // Check Declaration questions have exactly 2 options (affirmative + antithesis)
    if (question.type === 'D' && question.options && question.options.length !== 2) {
      issues.push(`Declaration question should have exactly 2 options, has ${question.options.length}`);
      hasValidOptions = false;
    }
    
    // Check Multiple choice questions have 2+ options
    if (question.type === 'M' && question.options && question.options.length < 2) {
      issues.push(`Multiple choice question should have 2+ options, has ${question.options.length}`);
      hasValidOptions = false;
    }
    
    // Check weight is present and positive
    if (!question.weight || question.weight <= 0) {
      issues.push("Invalid or missing weight");
      scoringValid = false;
    }
    
    // Check options are not empty strings
    if (question.options) {
      question.options.forEach((option, index) => {
        if (!option || option.trim() === '') {
          issues.push(`Option ${index + 1} is empty`);
          hasValidOptions = false;
        }
      });
    }
    
    results.push({
      questionId: question.id,
      section: question.section,
      type: question.type,
      text: question.text.substring(0, 100) + '...',
      issues,
      optionCount: question.options ? question.options.length : 0,
      hasValidOptions,
      scoringValid
    });
  });
  
  return results;
}

function displayValidationResults() {
  const results = validateAllQuestions();
  const validQuestions = results.filter(r => r.issues.length === 0);
  const invalidQuestions = results.filter(r => r.issues.length > 0);
  
  console.log(`\n=== QUESTIONS VALIDATION RESULTS ===`);
  console.log(`Total Questions: ${results.length}`);
  console.log(`Valid Questions: ${validQuestions.length}`);
  console.log(`Invalid Questions: ${invalidQuestions.length}`);
  
  if (invalidQuestions.length > 0) {
    console.log(`\n❌ INVALID QUESTIONS:`);
    invalidQuestions.forEach(result => {
      console.log(`\nQuestion ${result.questionId} (${result.type}):`);
      console.log(`  Section: ${result.section}`);
      console.log(`  Text: ${result.text}`);
      console.log(`  Options: ${result.optionCount}`);
      console.log(`  Issues: ${result.issues.join(', ')}`);
    });
  }
  
  // Summary by section
  const sectionSummary: { [section: string]: { valid: number, invalid: number } } = {};
  results.forEach(result => {
    if (!sectionSummary[result.section]) {
      sectionSummary[result.section] = { valid: 0, invalid: 0 };
    }
    if (result.issues.length === 0) {
      sectionSummary[result.section].valid++;
    } else {
      sectionSummary[result.section].invalid++;
    }
  });
  
  console.log(`\n📊 VALIDATION BY SECTION:`);
  Object.entries(sectionSummary).forEach(([section, counts]) => {
    const status = counts.invalid === 0 ? '✅' : '❌';
    console.log(`${status} ${section}: ${counts.valid} valid, ${counts.invalid} invalid`);
  });
  
  // Type summary
  const typeSummary: { [type: string]: { valid: number, invalid: number } } = {};
  results.forEach(result => {
    if (!typeSummary[result.type]) {
      typeSummary[result.type] = { valid: 0, invalid: 0 };
    }
    if (result.issues.length === 0) {
      typeSummary[result.type].valid++;
    } else {
      typeSummary[result.type].invalid++;
    }
  });
  
  console.log(`\n📋 VALIDATION BY TYPE:`);
  Object.entries(typeSummary).forEach(([type, counts]) => {
    const typeDesc = type === 'D' ? 'Declaration' : type === 'M' ? 'Multiple Choice' : 'Input';
    const status = counts.invalid === 0 ? '✅' : '❌';
    console.log(`${status} ${typeDesc} (${type}): ${counts.valid} valid, ${counts.invalid} invalid`);
  });
  
  if (invalidQuestions.length === 0) {
    console.log(`\n✅ ALL QUESTIONS VALIDATED SUCCESSFULLY`);
    console.log(`All 99 questions have proper options and scoring structure.`);
  } else {
    console.log(`\n⚠️ VALIDATION ISSUES FOUND`);
    console.log(`${invalidQuestions.length} questions need attention.`);
  }
}

displayValidationResults();