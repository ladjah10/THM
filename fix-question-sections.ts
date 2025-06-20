/**
 * Fix question sections to match authentic book structure
 */

import { readFileSync, writeFileSync } from 'fs';

const questionSectionMap: Record<number, string> = {
  // Section I: Your Foundation (Q1-9)
  1: "Section I: Your Foundation", 2: "Section I: Your Foundation", 3: "Section I: Your Foundation",
  4: "Section I: Your Foundation", 5: "Section I: Your Foundation", 6: "Section I: Your Foundation",
  7: "Section I: Your Foundation", 8: "Section I: Your Foundation", 9: "Section I: Your Foundation",
  
  // Section II: Your Faith Life (Q10-12)
  10: "Section II: Your Faith Life", 11: "Section II: Your Faith Life", 12: "Section II: Your Faith Life",
  
  // Section III: Your Marriage Life (Q13-49)
  13: "Section III: Your Marriage Life", 14: "Section III: Your Marriage Life", 15: "Section III: Your Marriage Life",
  16: "Section III: Your Marriage Life", 17: "Section III: Your Marriage Life", 18: "Section III: Your Marriage Life",
  19: "Section III: Your Marriage Life", 20: "Section III: Your Marriage Life", 21: "Section III: Your Marriage Life",
  22: "Section III: Your Marriage Life", 23: "Section III: Your Marriage Life", 24: "Section III: Your Marriage Life",
  25: "Section III: Your Marriage Life", 26: "Section III: Your Marriage Life", 27: "Section III: Your Marriage Life",
  28: "Section III: Your Marriage Life", 29: "Section III: Your Marriage Life", 30: "Section III: Your Marriage Life",
  31: "Section III: Your Marriage Life", 32: "Section III: Your Marriage Life", 33: "Section III: Your Marriage Life",
  34: "Section III: Your Marriage Life", 35: "Section III: Your Marriage Life", 36: "Section III: Your Marriage Life",
  37: "Section III: Your Marriage Life", 38: "Section III: Your Marriage Life", 39: "Section III: Your Marriage Life",
  40: "Section III: Your Marriage Life", 41: "Section III: Your Marriage Life", 42: "Section III: Your Marriage Life",
  43: "Section III: Your Marriage Life", 44: "Section III: Your Marriage Life", 45: "Section III: Your Marriage Life",
  46: "Section III: Your Marriage Life", 47: "Section III: Your Marriage Life", 48: "Section III: Your Marriage Life",
  49: "Section III: Your Marriage Life",
  
  // Section IV: Your Marriage Life with Children (Q50-52)
  50: "Section IV: Your Marriage Life with Children", 51: "Section IV: Your Marriage Life with Children", 
  52: "Section IV: Your Marriage Life with Children",
  
  // Section V: Your Family/Home Life (Q53-69)
  53: "Section V: Your Family/Home Life", 54: "Section V: Your Family/Home Life", 55: "Section V: Your Family/Home Life",
  56: "Section V: Your Family/Home Life", 57: "Section V: Your Family/Home Life", 58: "Section V: Your Family/Home Life",
  59: "Section V: Your Family/Home Life", 60: "Section V: Your Family/Home Life", 61: "Section V: Your Family/Home Life",
  62: "Section V: Your Family/Home Life", 63: "Section V: Your Family/Home Life", 64: "Section V: Your Family/Home Life",
  65: "Section V: Your Family/Home Life", 66: "Section V: Your Family/Home Life", 67: "Section V: Your Family/Home Life",
  68: "Section V: Your Family/Home Life", 69: "Section V: Your Family/Home Life",
  
  // Section VI: Your Finances (Q70-79)
  70: "Section VI: Your Finances", 71: "Section VI: Your Finances", 72: "Section VI: Your Finances",
  73: "Section VI: Your Finances", 74: "Section VI: Your Finances", 75: "Section VI: Your Finances",
  76: "Section VI: Your Finances", 77: "Section VI: Your Finances", 78: "Section VI: Your Finances",
  79: "Section VI: Your Finances",
  
  // Section VII: Your Health and Wellness (Q80-86)
  80: "Section VII: Your Health and Wellness", 81: "Section VII: Your Health and Wellness", 
  82: "Section VII: Your Health and Wellness", 83: "Section VII: Your Health and Wellness",
  84: "Section VII: Your Health and Wellness", 85: "Section VII: Your Health and Wellness",
  86: "Section VII: Your Health and Wellness",
  
  // Section VIII: Your Marriage and Boundaries (Q87-98)
  87: "Section VIII: Your Marriage and Boundaries", 88: "Section VIII: Your Marriage and Boundaries",
  89: "Section VIII: Your Marriage and Boundaries", 90: "Section VIII: Your Marriage and Boundaries",
  91: "Section VIII: Your Marriage and Boundaries", 92: "Section VIII: Your Marriage and Boundaries",
  93: "Section VIII: Your Marriage and Boundaries", 94: "Section VIII: Your Marriage and Boundaries",
  95: "Section VIII: Your Marriage and Boundaries", 96: "Section VIII: Your Marriage and Boundaries",
  97: "Section VIII: Your Marriage and Boundaries", 98: "Section VIII: Your Marriage and Boundaries",
  
  // Section IX: Your Penultimate Vow (Q99)
  99: "Section IX: Your Penultimate Vow"
};

function fixQuestionSections() {
  const filePath = './client/src/data/questionsData.ts';
  let content = readFileSync(filePath, 'utf8');
  
  // Update each question's section
  for (let questionId = 1; questionId <= 99; questionId++) {
    const correctSection = questionSectionMap[questionId];
    
    // Find and replace the section for this specific question
    const questionPattern = new RegExp(
      `(\\{\\s*id: ${questionId},\\s*\\n\\s*section: )"[^"]*"`,
      'g'
    );
    
    content = content.replace(questionPattern, `$1"${correctSection}"`);
  }
  
  writeFileSync(filePath, content, 'utf8');
  console.log('Updated all 99 questions with authentic book sections');
}

fixQuestionSections();