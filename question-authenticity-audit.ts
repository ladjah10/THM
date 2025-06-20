/**
 * Question Authenticity Audit - Identify questions that don't match Lawrence Adjah's book
 */

import { questions } from './client/src/data/questionsData';
import { readFileSync } from 'fs';

interface BookQuestion {
  id: number;
  section: string;
  subsection: string;
  text: string;
  originalText: string;
  hasOptions: boolean;
  optionCount: number;
}

function auditQuestionAuthenticity() {
  console.log('=== QUESTION AUTHENTICITY AUDIT ===');
  console.log('Identifying questions that don\'t match Lawrence Adjah\'s book\n');

  // Parse book questions
  const bookContent = readFileSync('./attached_assets/Pasted-100-Marriage-Decisions-Declarations-Full-Questions-1-to-100-Section-I-Your-Foundation-Question--1750405636410_1750405636411.txt', 'utf8');
  const bookQuestions = parseBookQuestions(bookContent);

  console.log(`Book Questions Found: ${bookQuestions.length}`);
  console.log(`Assessment Questions: ${questions.length}\n`);

  // Track issues
  const issues = {
    missingFromBook: [],
    differentText: [],
    wrongOrder: [],
    fabricatedQuestions: [],
    correctQuestions: []
  };

  // Audit each assessment question
  for (let i = 0; i < questions.length; i++) {
    const assessmentQ = questions[i];
    const bookQ = bookQuestions.find(bq => bq.id === assessmentQ.id);
    
    console.log(`\n=== Question ${assessmentQ.id} Audit ===`);
    console.log(`Assessment: "${assessmentQ.text.substring(0, 80)}..."`);
    
    if (!bookQ) {
      console.log(`❌ NOT FOUND in book - This question may be fabricated`);
      issues.fabricatedQuestions.push({
        id: assessmentQ.id,
        section: assessmentQ.section,
        text: assessmentQ.text,
        issue: 'Question not found in source book'
      });
      continue;
    }

    console.log(`Book: "${bookQ.originalText.substring(0, 80)}..."`);

    // Check if sections match
    if (assessmentQ.section !== bookQ.section) {
      console.log(`⚠️  SECTION MISMATCH:`);
      console.log(`   Assessment: ${assessmentQ.section}`);
      console.log(`   Book: ${bookQ.section}`);
    }

    // Check if subsections match
    if (assessmentQ.subsection !== bookQ.subsection) {
      console.log(`⚠️  SUBSECTION MISMATCH:`);
      console.log(`   Assessment: ${assessmentQ.subsection}`);
      console.log(`   Book: ${bookQ.subsection}`);
    }

    // Check if question text is authentic (core content should be similar)
    const assessmentCore = extractCoreText(assessmentQ.text);
    const bookCore = extractCoreText(bookQ.originalText);
    
    if (!isTextSimilar(assessmentCore, bookCore)) {
      console.log(`❌ TEXT COMPLETELY DIFFERENT - Possible fabrication`);
      issues.differentText.push({
        id: assessmentQ.id,
        assessmentText: assessmentQ.text,
        bookText: bookQ.originalText,
        issue: 'Question text does not match book content'
      });
    } else {
      console.log(`✅ TEXT AUTHENTIC (properly adapted for assessment)`);
      issues.correctQuestions.push(assessmentQ.id);
    }

    // Check order (questions should appear in same sequence)
    if (i < bookQuestions.length && bookQuestions[i].id !== assessmentQ.id) {
      console.log(`⚠️  ORDER ISSUE: Expected Q${bookQuestions[i]?.id}, got Q${assessmentQ.id}`);
      issues.wrongOrder.push({
        position: i + 1,
        expectedId: bookQuestions[i]?.id,
        actualId: assessmentQ.id
      });
    }
  }

  // Find questions in book that are missing from assessment
  for (const bookQ of bookQuestions) {
    if (bookQ.id <= 99 && !questions.find(q => q.id === bookQ.id)) {
      issues.missingFromBook.push({
        id: bookQ.id,
        section: bookQ.section,
        text: bookQ.originalText,
        issue: 'Book question missing from assessment'
      });
    }
  }

  // Generate detailed report
  console.log('\n\n=== AUTHENTICITY AUDIT RESULTS ===\n');

  console.log(`✅ AUTHENTIC QUESTIONS: ${issues.correctQuestions.length}/99`);
  console.log(`❌ FABRICATED QUESTIONS: ${issues.fabricatedQuestions.length}`);
  console.log(`⚠️  TEXT MISMATCHES: ${issues.differentText.length}`);
  console.log(`📍 ORDER ISSUES: ${issues.wrongOrder.length}`);
  console.log(`🔍 MISSING FROM ASSESSMENT: ${issues.missingFromBook.length}\n`);

  if (issues.fabricatedQuestions.length > 0) {
    console.log('=== FABRICATED QUESTIONS (NOT IN BOOK) ===');
    issues.fabricatedQuestions.forEach(q => {
      console.log(`Q${q.id}: ${q.section}`);
      console.log(`Text: "${q.text.substring(0, 100)}..."`);
      console.log(`Issue: ${q.issue}\n`);
    });
  }

  if (issues.differentText.length > 0) {
    console.log('=== QUESTIONS WITH MISMATCHED TEXT ===');
    issues.differentText.forEach(q => {
      console.log(`Q${q.id}:`);
      console.log(`Assessment: "${q.assessmentText.substring(0, 80)}..."`);
      console.log(`Book: "${q.bookText.substring(0, 80)}..."`);
      console.log(`Issue: ${q.issue}\n`);
    });
  }

  if (issues.wrongOrder.length > 0) {
    console.log('=== ORDER DISCREPANCIES ===');
    issues.wrongOrder.forEach(issue => {
      console.log(`Position ${issue.position}: Expected Q${issue.expectedId}, Found Q${issue.actualId}`);
    });
  }

  if (issues.missingFromBook.length > 0) {
    console.log('\n=== BOOK QUESTIONS MISSING FROM ASSESSMENT ===');
    issues.missingFromBook.forEach(q => {
      console.log(`Q${q.id}: ${q.section}`);
      console.log(`Text: "${q.text.substring(0, 100)}..."\n`);
    });
  }

  // Final assessment
  const authenticityScore = (issues.correctQuestions.length / 99) * 100;
  console.log(`\n=== FINAL AUTHENTICITY ASSESSMENT ===`);
  console.log(`Authenticity Score: ${authenticityScore.toFixed(1)}%`);
  
  if (authenticityScore >= 95) {
    console.log('✅ Assessment is HIGHLY AUTHENTIC to Lawrence Adjah\'s book');
  } else if (authenticityScore >= 80) {
    console.log('⚠️  Assessment is MOSTLY AUTHENTIC with some issues to address');
  } else {
    console.log('❌ Assessment has SIGNIFICANT AUTHENTICITY ISSUES that need correction');
  }

  return {
    authenticityScore,
    issues,
    totalQuestions: 99,
    authenticQuestions: issues.correctQuestions.length
  };
}

function parseBookQuestions(content: string): BookQuestion[] {
  const questions: BookQuestion[] = [];
  const lines = content.split('\n');
  
  let currentQuestion: Partial<BookQuestion> = {};
  let currentSection = '';
  let collectingOptions = false;
  let optionCount = 0;
  
  for (const line of lines) {
    const trimmed = line.trim();
    
    // Detect sections
    if (trimmed.startsWith('Section ')) {
      currentSection = trimmed;
      continue;
    }
    
    // Detect questions
    const questionMatch = trimmed.match(/^Question (\d+):\s*(.+)/);
    if (questionMatch) {
      // Save previous question
      if (currentQuestion.id) {
        questions.push({
          ...currentQuestion,
          hasOptions: optionCount > 0,
          optionCount
        } as BookQuestion);
      }
      
      // Start new question
      currentQuestion = {
        id: parseInt(questionMatch[1]),
        section: currentSection,
        subsection: questionMatch[2],
        originalText: '', // Will be set from first option or text
      };
      collectingOptions = false;
      optionCount = 0;
      continue;
    }
    
    // Detect options section
    if (trimmed === 'Options:') {
      collectingOptions = true;
      continue;
    }
    
    // Collect options and extract original text
    if (collectingOptions && trimmed && 
        !trimmed.startsWith('Scripture:') && 
        !trimmed.startsWith('Couple\'s Activity:') &&
        !trimmed.startsWith('Other:') &&
        currentQuestion.id) {
      
      optionCount++;
      
      // Use first substantial option as the original text
      if (!currentQuestion.originalText && trimmed.length > 20) {
        currentQuestion.originalText = trimmed;
      }
      continue;
    }
    
    // Stop collecting when we hit other sections
    if (trimmed.startsWith('Scripture:') || trimmed.startsWith('Couple\'s Activity:')) {
      collectingOptions = false;
    }
  }
  
  // Add last question
  if (currentQuestion.id) {
    questions.push({
      ...currentQuestion,
      hasOptions: optionCount > 0,
      optionCount
    } as BookQuestion);
  }
  
  return questions;
}

function extractCoreText(text: string): string {
  // Remove assessment-specific formatting and get core content
  return text
    .replace(/^[^,]*,\s*/, '') // Remove "We commit to..." prefixes
    .replace(/\?$/, '') // Remove question marks
    .replace(/\[input\]/g, '') // Remove input placeholders
    .toLowerCase()
    .trim();
}

function isTextSimilar(text1: string, text2: string): boolean {
  // Check if core concepts are present
  const words1 = text1.split(/\s+/).filter(w => w.length > 3);
  const words2 = text2.split(/\s+/).filter(w => w.length > 3);
  
  const commonWords = words1.filter(w => words2.includes(w));
  const similarity = commonWords.length / Math.max(words1.length, words2.length);
  
  return similarity > 0.4; // 40% word overlap indicates similar content
}

// Run audit
auditQuestionAuthenticity();