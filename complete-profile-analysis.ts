/**
 * Complete Psychographic Profiles Analysis
 * Shows all 13 profiles with their scoring criteria and correlation to the 99 authentic questions
 */

import { questions, sections } from './client/src/data/questionsData';
import { psychographicProfiles } from './client/src/data/psychographicProfiles';

interface ProfileAnalysis {
  id: number;
  name: string;
  genderSpecific: string | null;
  description: string;
  criteria: Array<{
    section: string;
    min?: number;
    max?: number;
    sectionExists: boolean;
    sectionWeight: number;
    questionCount: number;
  }>;
  validProfile: boolean;
  totalCriteriaWeight: number;
}

function analyzeSectionData() {
  const sectionData: Record<string, { weight: number; count: number }> = {};
  
  sections.forEach(section => {
    sectionData[section] = { weight: 0, count: 0 };
  });
  
  questions.forEach(question => {
    if (sectionData[question.section]) {
      sectionData[question.section].weight += question.weight;
      sectionData[question.section].count++;
    }
  });
  
  return sectionData;
}

function analyzeAllProfiles(): ProfileAnalysis[] {
  const sectionData = analyzeSectionData();
  const availableSections = Object.keys(sectionData);
  
  return psychographicProfiles.map(profile => {
    let validProfile = true;
    let totalCriteriaWeight = 0;
    
    const analyzedCriteria = profile.criteria.map(criterion => {
      const sectionExists = availableSections.includes(criterion.section);
      const sectionWeight = sectionExists ? sectionData[criterion.section].weight : 0;
      const questionCount = sectionExists ? sectionData[criterion.section].count : 0;
      
      if (!sectionExists) validProfile = false;
      totalCriteriaWeight += sectionWeight;
      
      return {
        section: criterion.section,
        min: criterion.min,
        max: criterion.max,
        sectionExists,
        sectionWeight,
        questionCount
      };
    });
    
    return {
      id: profile.id,
      name: profile.name,
      genderSpecific: profile.genderSpecific,
      description: profile.description,
      criteria: analyzedCriteria,
      validProfile,
      totalCriteriaWeight
    };
  });
}

async function runCompleteProfileAnalysis() {
  console.log('=== COMPLETE PSYCHOGRAPHIC PROFILES ANALYSIS ===\n');
  console.log('All 13 profiles with scoring criteria and correlation to the 99 authentic questions from Lawrence Adjah\'s book\n');
  
  const profileAnalyses = analyzeAllProfiles();
  const sectionData = analyzeSectionData();
  
  // Summary stats
  const validProfiles = profileAnalyses.filter(p => p.validProfile).length;
  const invalidProfiles = profileAnalyses.length - validProfiles;
  
  console.log('📊 SUMMARY:');
  console.log(`Total Profiles: ${profileAnalyses.length}`);
  console.log(`Valid Profiles (all sections exist): ${validProfiles}`);
  console.log(`Invalid Profiles (missing sections): ${invalidProfiles}`);
  console.log(`Total Questions: ${questions.length}`);
  console.log(`Total Weight: ${Object.values(sectionData).reduce((sum, section) => sum + section.weight, 0)} points\n`);
  
  // Available sections from book
  console.log('📚 AVAILABLE SECTIONS FROM BOOK:');
  Object.entries(sectionData).forEach(([sectionName, data]) => {
    console.log(`  ${sectionName}: ${data.count} questions, ${data.weight} points`);
  });
  console.log('');
  
  // Analyze each profile
  console.log('🎯 PROFILE ANALYSIS:\n');
  
  profileAnalyses.forEach((profile, index) => {
    console.log(`${index + 1}. ${profile.name} ${profile.genderSpecific ? `(${profile.genderSpecific})` : '(Unisex)'}`);
    console.log(`   Status: ${profile.validProfile ? '✅ VALID' : '❌ INVALID - Missing sections'}`);
    console.log(`   Description: ${profile.description.substring(0, 100)}...`);
    console.log(`   Scoring Criteria:`);
    
    profile.criteria.forEach(criterion => {
      const status = criterion.sectionExists ? '✅' : '❌';
      const minMax = criterion.max ? `${criterion.min}-${criterion.max}%` : `${criterion.min}%+`;
      console.log(`     ${status} ${criterion.section}: ${minMax} ${criterion.sectionExists ? `(${criterion.questionCount}Q, ${criterion.sectionWeight}pts)` : '(MISSING)'}`);
    });
    
    console.log(`   Total Criteria Weight: ${profile.totalCriteriaWeight} points`);
    console.log('');
  });
  
  // Group by validity
  console.log('🔍 VALIDITY BREAKDOWN:\n');
  
  console.log('✅ VALID PROFILES (All sections exist in book):');
  profileAnalyses.filter(p => p.validProfile).forEach(profile => {
    console.log(`   ${profile.name} (${profile.genderSpecific || 'Unisex'}) - ${profile.totalCriteriaWeight} points`);
  });
  console.log('');
  
  console.log('❌ INVALID PROFILES (Reference missing sections):');
  profileAnalyses.filter(p => !p.validProfile).forEach(profile => {
    const missingSections = profile.criteria.filter(c => !c.sectionExists).map(c => c.section);
    console.log(`   ${profile.name} (${profile.genderSpecific || 'Unisex'}) - Missing: ${missingSections.join(', ')}`);
  });
  console.log('');
  
  // Missing sections analysis
  const allUsedSections = new Set<string>();
  profileAnalyses.forEach(profile => {
    profile.criteria.forEach(criterion => {
      allUsedSections.add(criterion.section);
    });
  });
  
  const missingSections = Array.from(allUsedSections).filter(section => !Object.keys(sectionData).includes(section));
  const unusedSections = Object.keys(sectionData).filter(section => !allUsedSections.has(section));
  
  if (missingSections.length > 0) {
    console.log('🚫 SECTIONS REFERENCED BUT NOT IN BOOK:');
    missingSections.forEach(section => {
      console.log(`   ${section} (needs to be replaced or removed)`);
    });
    console.log('');
  }
  
  if (unusedSections.length > 0) {
    console.log('📖 BOOK SECTIONS NOT USED IN PROFILES:');
    unusedSections.forEach(section => {
      const data = sectionData[section];
      console.log(`   ${section} (${data.count} questions, ${data.weight} points)`);
    });
    console.log('');
  }
  
  console.log('🎯 CORRELATION STATUS:');
  console.log(`${validProfiles}/${profileAnalyses.length} profiles properly correlate with the authentic 99 questions`);
  console.log(`${invalidProfiles} profiles reference sections not found in Lawrence Adjah's book`);
  
  return {
    totalProfiles: profileAnalyses.length,
    validProfiles,
    invalidProfiles,
    missingSections,
    unusedSections,
    profiles: profileAnalyses
  };
}

runCompleteProfileAnalysis().then(results => {
  console.log('\n=== FINAL ASSESSMENT ===');
  if (results.invalidProfiles === 0) {
    console.log('✅ All psychographic profiles perfectly correlate with the 99 authentic questions.');
  } else {
    console.log(`⚠️ ${results.invalidProfiles} profiles need updates to align with the book's section structure.`);
    console.log('These profiles use conceptual sections beyond the book\'s scope.');
  }
});