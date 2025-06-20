/**
 * Update all psychographic profiles to use authentic book section names
 */

import { readFileSync, writeFileSync } from 'fs';

function fixAllProfileSections() {
  const filePath = './client/src/data/psychographicProfiles.ts';
  let content = readFileSync(filePath, 'utf8');
  
  // Map old section names to authentic book sections
  const sectionMapping = {
    '"Your Foundation"': '"Section I: Your Foundation"',
    '"Your Faith Life"': '"Section II: Your Faith Life"',
    '"Your Marriage Life"': '"Section III: Your Marriage Life"',
    '"Your Finances"': '"Section VI: Your Finances"',
    '"Your Family/Home Life"': '"Section V: Your Family/Home Life"',
    '"Your Health and Wellness"': '"Section VII: Your Health and Wellness"',
    '"Your Marriage and Boundaries"': '"Section VIII: Your Marriage and Boundaries"',
    '"Your Parenting Life"': '"Section IV: Your Marriage Life with Children"'
  };
  
  // Replace all section references
  for (const [oldSection, newSection] of Object.entries(sectionMapping)) {
    content = content.replace(new RegExp(oldSection, 'g'), newSection);
  }
  
  writeFileSync(filePath, content, 'utf8');
  console.log('Updated all psychographic profiles with authentic book sections');
}

fixAllProfileSections();