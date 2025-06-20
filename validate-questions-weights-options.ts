/**
 * Comprehensive Question Validation Script
 * Verifies each question has appropriate options and weights per Lawrence Adjah's book
 */

import { questions } from './client/src/data/questionsData';

interface QuestionValidation {
  id: number;
  section: string;
  subsection: string;
  type: string;
  text: string;
  optionsCount: number;
  options: string[];
  weight: number;
  validationStatus: 'valid' | 'needs_review' | 'invalid';
  issues: string[];
  recommendations: string[];
}

function validateQuestionStructure(question: any): QuestionValidation {
  const validation: QuestionValidation = {
    id: question.id,
    section: question.section,
    subsection: question.subsection,
    type: question.type,
    text: question.text,
    optionsCount: question.options.length,
    options: question.options,
    weight: question.weight,
    validationStatus: 'valid',
    issues: [],
    recommendations: []
  };

  // Validate question type
  if (!['D', 'M', 'I'].includes(question.type)) {
    validation.issues.push(`Invalid question type: ${question.type}`);
    validation.validationStatus = 'invalid';
  }

  // Validate Declaration (D) questions
  if (question.type === 'D') {
    if (question.options.length !== 1) {
      validation.issues.push(`Declaration questions should have exactly 1 option, found ${question.options.length}`);
      validation.validationStatus = 'needs_review';
    }
    if (question.weight < 3 || question.weight > 10) {
      validation.recommendations.push(`Declaration weight ${question.weight} may need review (typical range: 3-10)`);
    }
  }

  // Validate Multiple Choice (M) questions
  if (question.type === 'M') {
    if (question.options.length < 2 || question.options.length > 4) {
      validation.issues.push(`Multiple choice questions should have 2-4 options, found ${question.options.length}`);
      validation.validationStatus = 'needs_review';
    }
    if (question.weight < 2 || question.weight > 10) {
      validation.recommendations.push(`Multiple choice weight ${question.weight} may need review (typical range: 2-10)`);
    }
  }

  // Validate Input (I) questions
  if (question.type === 'I') {
    if (question.options.length > 1) {
      validation.recommendations.push(`Input questions typically have 0-1 options for guidance`);
    }
    if (question.weight < 1 || question.weight > 5) {
      validation.recommendations.push(`Input weight ${question.weight} may need review (typical range: 1-5)`);
    }
  }

  // Check for empty or very short text
  if (!question.text || question.text.length < 10) {
    validation.issues.push('Question text is missing or too short');
    validation.validationStatus = 'invalid';
  }

  // Check for missing weight
  if (typeof question.weight !== 'number' || question.weight <= 0) {
    validation.issues.push('Invalid or missing weight');
    validation.validationStatus = 'invalid';
  }

  // Check for empty options
  if (question.options.some((opt: string) => !opt || opt.trim().length === 0)) {
    validation.issues.push('Contains empty or whitespace-only options');
    validation.validationStatus = 'needs_review';
  }

  return validation;
}

function analyzeWeightDistribution(): {
  totalWeight: number;
  averageWeight: number;
  weightByType: Record<string, { total: number; count: number; average: number }>;
  weightBySection: Record<string, { total: number; count: number; average: number }>;
  outliers: any[];
} {
  const totalWeight = questions.reduce((sum, q) => sum + q.weight, 0);
  const averageWeight = totalWeight / questions.length;

  const weightByType: Record<string, any> = {};
  const weightBySection: Record<string, any> = {};
  const outliers: any[] = [];

  questions.forEach(question => {
    // Track by type
    if (!weightByType[question.type]) {
      weightByType[question.type] = { total: 0, count: 0, average: 0 };
    }
    weightByType[question.type].total += question.weight;
    weightByType[question.type].count += 1;

    // Track by section
    if (!weightBySection[question.section]) {
      weightBySection[question.section] = { total: 0, count: 0, average: 0 };
    }
    weightBySection[question.section].total += question.weight;
    weightBySection[question.section].count += 1;

    // Identify outliers (unusually high or low weights)
    if (question.weight > 10 || question.weight < 1) {
      outliers.push({
        id: question.id,
        weight: question.weight,
        type: question.type,
        section: question.section
      });
    }
  });

  // Calculate averages
  Object.keys(weightByType).forEach(type => {
    weightByType[type].average = weightByType[type].total / weightByType[type].count;
  });

  Object.keys(weightBySection).forEach(section => {
    weightBySection[section].average = weightBySection[section].total / weightBySection[section].count;
  });

  return {
    totalWeight,
    averageWeight,
    weightByType,
    weightBySection,
    outliers
  };
}

function validateSpecificQuestions(): {
  foundationQuestions: QuestionValidation[];
  highWeightQuestions: QuestionValidation[];
  multipleChoiceIssues: QuestionValidation[];
  declarationIssues: QuestionValidation[];
} {
  const validations = questions.map(validateQuestionStructure);

  return {
    foundationQuestions: validations.filter(v => v.section === 'Your Foundation'),
    highWeightQuestions: validations.filter(v => v.weight >= 8),
    multipleChoiceIssues: validations.filter(v => v.type === 'M' && v.issues.length > 0),
    declarationIssues: validations.filter(v => v.type === 'D' && v.issues.length > 0)
  };
}

async function runQuestionValidation() {
  console.log('=== QUESTION VALIDATION ANALYSIS ===');
  console.log(`Analyzing ${questions.length} questions from Lawrence Adjah's book`);
  console.log('');

  // Overall validation
  const allValidations = questions.map(validateQuestionStructure);
  const validQuestions = allValidations.filter(v => v.validationStatus === 'valid').length;
  const needsReview = allValidations.filter(v => v.validationStatus === 'needs_review').length;
  const invalidQuestions = allValidations.filter(v => v.validationStatus === 'invalid').length;

  console.log('📊 OVERALL VALIDATION STATUS:');
  console.log(`Valid Questions: ${validQuestions}/99`);
  console.log(`Need Review: ${needsReview}/99`);
  console.log(`Invalid Questions: ${invalidQuestions}/99`);
  console.log('');

  // Weight analysis
  const weightAnalysis = analyzeWeightDistribution();
  console.log('⚖️ WEIGHT DISTRIBUTION ANALYSIS:');
  console.log(`Total Weight: ${weightAnalysis.totalWeight} points`);
  console.log(`Average Weight: ${weightAnalysis.averageWeight.toFixed(1)} points`);
  console.log('');

  console.log('Weight by Question Type:');
  Object.entries(weightAnalysis.weightByType).forEach(([type, data]: [string, any]) => {
    console.log(`  ${type}: ${data.count} questions, avg ${data.average.toFixed(1)} points`);
  });
  console.log('');

  console.log('Weight by Section:');
  Object.entries(weightAnalysis.weightBySection).forEach(([section, data]: [string, any]) => {
    console.log(`  ${section}: ${data.count} questions, ${data.total} total points`);
  });
  console.log('');

  // Question type distribution
  const typeDistribution = questions.reduce((acc, q) => {
    acc[q.type] = (acc[q.type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  console.log('📋 QUESTION TYPE DISTRIBUTION:');
  Object.entries(typeDistribution).forEach(([type, count]) => {
    const percentage = (count / questions.length * 100).toFixed(1);
    const typeName = type === 'D' ? 'Declaration' : type === 'M' ? 'Multiple Choice' : 'Input';
    console.log(`  ${typeName} (${type}): ${count} questions (${percentage}%)`);
  });
  console.log('');

  // Specific validations
  const specificValidations = validateSpecificQuestions();

  console.log('🔍 FOUNDATION QUESTIONS ANALYSIS:');
  specificValidations.foundationQuestions.forEach(q => {
    console.log(`  Q${q.id}: ${q.type} - Weight ${q.weight} - ${q.options.length} options`);
    if (q.issues.length > 0) {
      console.log(`    Issues: ${q.issues.join(', ')}`);
    }
  });
  console.log('');

  console.log('🎯 HIGH-WEIGHT QUESTIONS (8+ points):');
  specificValidations.highWeightQuestions.forEach(q => {
    console.log(`  Q${q.id}: "${q.text.substring(0, 50)}..." - Weight ${q.weight}`);
  });
  console.log('');

  // Issues summary
  if (needsReview > 0 || invalidQuestions > 0) {
    console.log('⚠️ QUESTIONS NEEDING ATTENTION:');
    allValidations.filter(v => v.validationStatus !== 'valid').forEach(v => {
      console.log(`  Q${v.id} (${v.type}): ${v.issues.join(', ')}`);
      if (v.recommendations.length > 0) {
        console.log(`    Recommendations: ${v.recommendations.join(', ')}`);
      }
    });
    console.log('');
  }

  // Weight outliers
  if (weightAnalysis.outliers.length > 0) {
    console.log('📈 WEIGHT OUTLIERS:');
    weightAnalysis.outliers.forEach(outlier => {
      console.log(`  Q${outlier.id}: Weight ${outlier.weight} (${outlier.type} in ${outlier.section})`);
    });
    console.log('');
  }

  console.log('✅ VALIDATION COMPLETE');
  console.log('All questions have been analyzed for proper structure, weights, and options.');

  return {
    totalQuestions: questions.length,
    validQuestions,
    needsReview,
    invalidQuestions,
    totalWeight: weightAnalysis.totalWeight,
    typeDistribution,
    foundationQuestionsCount: specificValidations.foundationQuestions.length
  };
}

// Execute validation
runQuestionValidation().then(summary => {
  console.log('');
  console.log('=== VALIDATION SUMMARY ===');
  console.log(`Questions Analyzed: ${summary.totalQuestions}`);
  console.log(`System Weight Total: ${summary.totalWeight} points`);
  console.log(`Foundation Questions: ${summary.foundationQuestionsCount}`);
  console.log(`Validation Status: ${summary.validQuestions} valid, ${summary.needsReview} need review, ${summary.invalidQuestions} invalid`);
}).catch(error => {
  console.error('Validation error:', error);
});