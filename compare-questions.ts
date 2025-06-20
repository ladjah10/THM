/**
 * Compare attached questions with current assessment questions
 */

import { questions } from './client/src/data/questionsData';
import { readFileSync } from 'fs';

function compareQuestions() {
  console.log('=== Question Comparison Analysis ===\n');

  // Read the attached file
  const attachedQuestions = readFileSync('./attached_assets/Pasted-100-Marriage-Decisions-Declarations-Full-Questions-1-to-100-Section-I-Your-Foundation-Question--1750405636410_1750405636411.txt', 'utf8');

  // Parse attached questions (first 20 for comparison)
  const attachedData = parseAttachedQuestions(attachedQuestions);
  
  console.log(`Found ${attachedData.length} questions in attached file`);
  console.log(`Current assessment has ${questions.length} questions\n`);

  // Compare first 20 questions
  for (let i = 0; i < Math.min(20, attachedData.length, questions.length); i++) {
    const attached = attachedData[i];
    const current = questions[i];
    
    console.log(`=== Question ${i + 1} Comparison ===`);
    console.log(`Section Match: ${attached.section === current.section ? 'YES' : 'NO'}`);
    if (attached.section !== current.section) {
      console.log(`  Attached: "${attached.section}"`);
      console.log(`  Current:  "${current.section}"`);
    }
    
    console.log(`Text Match: ${attached.text === current.text ? 'YES' : 'NO'}`);
    if (attached.text !== current.text) {
      console.log(`  Attached: "${attached.text.substring(0, 100)}..."`);
      console.log(`  Current:  "${current.text.substring(0, 100)}..."`);
    }
    
    console.log(`Options Count: Attached=${attached.options.length}, Current=${current.options.length}`);
    
    // Compare options
    let optionsMatch = true;
    for (let j = 0; j < Math.min(attached.options.length, current.options.length); j++) {
      if (attached.options[j] !== current.options[j]) {
        optionsMatch = false;
        console.log(`  Option ${j + 1} differs:`);
        console.log(`    Attached: "${attached.options[j].substring(0, 80)}..."`);
        console.log(`    Current:  "${current.options[j].substring(0, 80)}..."`);
      }
    }
    
    if (optionsMatch && attached.options.length === current.options.length) {
      console.log(`Options Match: YES`);
    } else {
      console.log(`Options Match: NO`);
    }
    
    console.log('');
  }

  // Summary
  let exactMatches = 0;
  let sectionMatches = 0;
  let textMatches = 0;
  
  for (let i = 0; i < Math.min(attachedData.length, questions.length); i++) {
    const attached = attachedData[i];
    const current = questions[i];
    
    if (attached.section === current.section) sectionMatches++;
    if (attached.text === current.text) textMatches++;
    if (attached.section === current.section && attached.text === current.text && 
        attached.options.length === current.options.length &&
        attached.options.every((opt, idx) => opt === current.options[idx])) {
      exactMatches++;
    }
  }
  
  const total = Math.min(attachedData.length, questions.length);
  console.log(`=== SUMMARY ===`);
  console.log(`Total Questions Compared: ${total}`);
  console.log(`Exact Matches: ${exactMatches}/${total} (${Math.round(exactMatches/total*100)}%)`);
  console.log(`Section Matches: ${sectionMatches}/${total} (${Math.round(sectionMatches/total*100)}%)`);
  console.log(`Text Matches: ${textMatches}/${total} (${Math.round(textMatches/total*100)}%)`);
  
  if (exactMatches === total) {
    console.log('\n✅ ALL QUESTIONS MATCH EXACTLY');
  } else if (sectionMatches === total && textMatches > total * 0.8) {
    console.log('\n⚠️  QUESTIONS ARE MOSTLY ALIGNED but some differences exist');
  } else {
    console.log('\n❌ SIGNIFICANT DIFFERENCES FOUND between attached and current questions');
  }
}

function parseAttachedQuestions(content: string) {
  const questions = [];
  const lines = content.split('\n');
  
  let currentQuestion: any = null;
  let inOptions = false;
  let currentSection = '';
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    
    // Detect sections
    if (line.startsWith('Section ')) {
      currentSection = line;
      continue;
    }
    
    // Detect questions
    const questionMatch = line.match(/^Question (\d+):\s*(.+)/);
    if (questionMatch) {
      // Save previous question
      if (currentQuestion) {
        questions.push(currentQuestion);
      }
      
      // Start new question
      currentQuestion = {
        id: parseInt(questionMatch[1]),
        section: currentSection,
        subsection: questionMatch[2],
        text: '',
        options: []
      };
      inOptions = false;
      continue;
    }
    
    // Detect options section
    if (line === 'Options:') {
      inOptions = true;
      continue;
    }
    
    // Parse options
    if (inOptions && line && !line.startsWith('Scripture:') && !line.startsWith('Couple\'s Activity:') && currentQuestion) {
      // This is an option
      currentQuestion.options.push(line);
      
      // If this is the first option and no text set, use it as text
      if (!currentQuestion.text && currentQuestion.options.length === 1) {
        currentQuestion.text = line;
      }
      continue;
    }
    
    // Stop parsing options when we hit other sections
    if (line.startsWith('Scripture:') || line.startsWith('Couple\'s Activity:')) {
      inOptions = false;
      continue;
    }
  }
  
  // Add last question
  if (currentQuestion) {
    questions.push(currentQuestion);
  }
  
  return questions;
}

// Run comparison
compareQuestions();