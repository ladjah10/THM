/**
 * Fix Declaration Questions: Add Antithesis Options
 * Declaration questions should have both affirmative and antithesis options
 */

import { questions } from './client/src/data/questionsData';

// Find all Declaration questions with only one option
function findDeclarationIssues() {
  const issues = questions.filter(q => q.type === 'D' && q.options.length === 1);
  
  console.log('Declaration questions needing antithesis options:');
  issues.forEach(q => {
    console.log(`Q${q.id}: "${q.text.substring(0, 60)}..."`);
    console.log(`   Current option: "${q.options[0].substring(0, 50)}..."`);
    console.log('');
  });
  
  return issues;
}

// Generate appropriate antithesis for each declaration
function generateAntithesis(questionText: string, affirmativeOption: string): string {
  // Common antithesis patterns based on the declaration content
  if (affirmativeOption.includes('commit to')) {
    return 'We need more time to consider this commitment and discuss it further';
  }
  
  if (affirmativeOption.includes('believe') || affirmativeOption.includes('responsibility')) {
    return 'We have different beliefs about this and need to discuss our differences';
  }
  
  if (affirmativeOption.includes('never') || affirmativeOption.includes('not')) {
    return 'We disagree with this approach and prefer a different method';
  }
  
  if (affirmativeOption.includes('always') || affirmativeOption.includes('every')) {
    return 'We prefer a more flexible approach to this commitment';
  }
  
  if (affirmativeOption.includes('supporting') || affirmativeOption.includes('encouraging')) {
    return 'We need to establish different boundaries around this area';
  }
  
  // Default antithesis
  return 'We do not agree with this statement and need to discuss alternatives';
}

// Generate the complete list of fixes needed
function generateDeclarationFixes() {
  const declarationQuestions = questions.filter(q => q.type === 'D');
  const fixes: any[] = [];
  
  declarationQuestions.forEach(q => {
    if (q.options.length === 1) {
      const antithesis = generateAntithesis(q.text, q.options[0]);
      fixes.push({
        id: q.id,
        currentOptions: [...q.options],
        proposedOptions: [q.options[0], antithesis]
      });
    }
  });
  
  return fixes;
}

async function main() {
  console.log('=== DECLARATION QUESTIONS ANALYSIS ===');
  
  const issues = findDeclarationIssues();
  console.log(`Found ${issues.length} declaration questions needing antithesis options`);
  
  const fixes = generateDeclarationFixes();
  
  console.log('\n=== PROPOSED FIXES ===');
  fixes.forEach(fix => {
    console.log(`Q${fix.id} - Add antithesis option:`);
    console.log(`  Affirmative: "${fix.currentOptions[0].substring(0, 50)}..."`);
    console.log(`  Antithesis: "${fix.proposedOptions[1].substring(0, 50)}..."`);
    console.log('');
  });
  
  return fixes;
}

main();