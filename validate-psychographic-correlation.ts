/**
 * Comprehensive Psychographic Profiles Correlation Analysis
 * Validates that all 13 profiles properly align with the 99 authentic questions,
 * sections, and weighted scoring methodology from Lawrence Adjah's book
 */

import { questions, sections } from './client/src/data/questionsData';
import { psychographicProfiles } from './client/src/data/psychographicProfiles';

interface SectionAnalysis {
  name: string;
  questionCount: number;
  totalWeight: number;
  averageWeight: number;
  declarationQuestions: number;
  multipleChoiceQuestions: number;
  maxPossibleScore: number;
}

interface ProfileValidation {
  profileName: string;
  genderSpecific: string | null;
  validCriteria: number;
  invalidCriteria: string[];
  recommendations: string[];
  isValid: boolean;
}

function analyzeSections(): SectionAnalysis[] {
  const sectionStats: Record<string, SectionAnalysis> = {};
  
  // Initialize all sections
  sections.forEach(section => {
    sectionStats[section] = {
      name: section,
      questionCount: 0,
      totalWeight: 0,
      averageWeight: 0,
      declarationQuestions: 0,
      multipleChoiceQuestions: 0,
      maxPossibleScore: 0
    };
  });
  
  // Analyze each question
  questions.forEach(question => {
    const section = sectionStats[question.section];
    if (section) {
      section.questionCount++;
      section.totalWeight += question.weight;
      section.maxPossibleScore += question.weight;
      
      if (question.type === 'D') {
        section.declarationQuestions++;
      } else if (question.type === 'M') {
        section.multipleChoiceQuestions++;
      }
    }
  });
  
  // Calculate averages
  Object.values(sectionStats).forEach(section => {
    if (section.questionCount > 0) {
      section.averageWeight = section.totalWeight / section.questionCount;
    }
  });
  
  return Object.values(sectionStats);
}

function validateProfiles(): ProfileValidation[] {
  const sectionAnalysis = analyzeSections();
  const sectionNames = sectionAnalysis.map(s => s.name);
  const validations: ProfileValidation[] = [];
  
  psychographicProfiles.forEach(profile => {
    const validation: ProfileValidation = {
      profileName: profile.name,
      genderSpecific: profile.genderSpecific,
      validCriteria: 0,
      invalidCriteria: [],
      recommendations: [],
      isValid: true
    };
    
    profile.criteria.forEach(criterion => {
      // Check if section exists in current questions
      if (!sectionNames.includes(criterion.section)) {
        validation.invalidCriteria.push(`Section "${criterion.section}" does not exist in current questions`);
        validation.isValid = false;
      } else {
        validation.validCriteria++;
        
        // Analyze if criteria makes sense for the section
        const sectionInfo = sectionAnalysis.find(s => s.name === criterion.section);
        if (sectionInfo) {
          // Check if minimum threshold is reasonable
          if (criterion.min && criterion.min > 95) {
            validation.recommendations.push(`${criterion.section} min threshold ${criterion.min}% may be too high`);
          }
          
          // Check if section has enough weight to meaningfully differentiate
          if (sectionInfo.totalWeight < 20) {
            validation.recommendations.push(`${criterion.section} has low total weight (${sectionInfo.totalWeight} points) - may not provide reliable differentiation`);
          }
        }
      }
    });
    
    validations.push(validation);
  });
  
  return validations;
}

function generateCorrectedProfiles(): string {
  const sectionAnalysis = analyzeSections();
  
  return `
/**
 * CORRECTED PSYCHOGRAPHIC PROFILES
 * Updated to align with the 99 authentic questions from Lawrence Adjah's book
 */

// Available sections with their characteristics:
${sectionAnalysis.map(section => 
  `// ${section.name}: ${section.questionCount} questions, ${section.totalWeight} points (${section.declarationQuestions}D + ${section.multipleChoiceQuestions}M)`
).join('\n')}

export const correctedPsychographicProfiles: UserProfile[] = [
  // Unisex profiles based on authentic book sections
  {
    id: 1,
    name: "Steadfast Believers",
    description: "Strong commitment to faith as the foundation of your relationship. Values traditional marriage roles with unwavering convictions guided by scripture.",
    genderSpecific: null,
    criteria: [
      { section: "Your Foundation", min: 85 },
      { section: "Your Faith Life", min: 80 },
      { section: "Covenant Commitment", min: 85 }
    ],
    iconPath: "/icons/profiles/SB 1.png"
  },
  {
    id: 2,
    name: "Harmonious Planners", 
    description: "Values structure and careful planning while maintaining strong faith values. Committed to clear expectations and boundaries.",
    genderSpecific: null,
    criteria: [
      { section: "Your Foundation", min: 75 },
      { section: "Your Marriage Life", min: 75 },
      { section: "Your Future Together", min: 70 }
    ],
    iconPath: "/icons/profiles/HP.png"
  },
  {
    id: 3,
    name: "Flexible Faithful",
    description: "Balances spiritual conviction with practical adaptability. Values communication and compromise while honoring beliefs.",
    genderSpecific: null,
    criteria: [
      { section: "Your Faith Life", min: 65, max: 85 },
      { section: "Communication Patterns", min: 75 },
      { section: "Relationship Dynamics", min: 70 }
    ],
    iconPath: "/icons/profiles/FF 3.png"
  },
  {
    id: 4,
    name: "Pragmatic Partners",
    description: "Practical mindset valuing clear communication and shared responsibility. Faith plays a role but emphasizes mutual respect.",
    genderSpecific: null,
    criteria: [
      { section: "Your Marriage Life", min: 70 },
      { section: "Communication Patterns", min: 80 },
      { section: "Crisis Management", min: 75 }
    ],
    iconPath: "/icons/profiles/PP 4.png"
  },
  {
    id: 5,
    name: "Individualist Seekers",
    description: "Values personal growth and independence within relationship. Appreciates spiritual dimension while maintaining individuality.",
    genderSpecific: null,
    criteria: [
      { section: "Personal Growth", min: 80 },
      { section: "Your Faith Life", max: 70 },
      { section: "Lifestyle Choices", min: 70 }
    ],
    iconPath: "/icons/profiles/IS 5.png"
  },
  {
    id: 6,
    name: "Balanced Visionaries",
    description: "Strong foundation of faith-centered expectations with practical wisdom. Values clear communication and mutual respect.",
    genderSpecific: null,
    criteria: [
      { section: "Your Faith Life", min: 70 },
      { section: "Your Marriage Life", min: 70 },
      { section: "Your Future Together", min: 65 },
      { section: "Spiritual Life Together", min: 70 }
    ],
    iconPath: "/icons/profiles/BV 6.png"
  }
  
  // Gender-specific profiles would be added here with corrected section names
];`;
}

async function runProfileCorrelationAnalysis() {
  console.log('=== PSYCHOGRAPHIC PROFILES CORRELATION ANALYSIS ===\n');
  
  // Analyze current sections
  const sectionAnalysis = analyzeSections();
  console.log('📊 CURRENT QUESTION SECTIONS ANALYSIS:');
  console.log(`Total Sections: ${sectionAnalysis.length}`);
  console.log(`Total Questions: ${questions.length}`);
  console.log(`Total Weight: ${sectionAnalysis.reduce((sum, s) => sum + s.totalWeight, 0)} points\n`);
  
  sectionAnalysis.forEach(section => {
    console.log(`${section.name}:`);
    console.log(`  Questions: ${section.questionCount} (${section.declarationQuestions}D + ${section.multipleChoiceQuestions}M)`);
    console.log(`  Weight: ${section.totalWeight} points (avg: ${section.averageWeight.toFixed(1)})`);
    console.log('');
  });
  
  // Validate profiles
  const profileValidations = validateProfiles();
  console.log('🎯 PROFILE VALIDATION RESULTS:');
  
  let validProfiles = 0;
  let invalidProfiles = 0;
  
  profileValidations.forEach(validation => {
    console.log(`\n${validation.profileName} (${validation.genderSpecific || 'Unisex'}):`);
    
    if (validation.isValid) {
      console.log(`  ✅ VALID - ${validation.validCriteria} criteria using existing sections`);
      validProfiles++;
    } else {
      console.log(`  ❌ INVALID - ${validation.invalidCriteria.length} issues found:`);
      validation.invalidCriteria.forEach(issue => {
        console.log(`    - ${issue}`);
      });
      invalidProfiles++;
    }
    
    if (validation.recommendations.length > 0) {
      console.log(`  💡 Recommendations:`);
      validation.recommendations.forEach(rec => {
        console.log(`    - ${rec}`);
      });
    }
  });
  
  console.log(`\n📈 SUMMARY:`);
  console.log(`Valid Profiles: ${validProfiles}/${profileValidations.length}`);
  console.log(`Invalid Profiles: ${invalidProfiles}/${profileValidations.length}`);
  
  // Identify sections not used in profiles
  const sectionsUsedInProfiles = new Set<string>();
  psychographicProfiles.forEach(profile => {
    profile.criteria.forEach(criterion => {
      sectionsUsedInProfiles.add(criterion.section);
    });
  });
  
  const unusedSections = sectionAnalysis
    .filter(section => !sectionsUsedInProfiles.has(section.name))
    .map(section => section.name);
  
  if (unusedSections.length > 0) {
    console.log(`\n🔍 UNUSED SECTIONS IN PROFILES:`);
    unusedSections.forEach(section => {
      const sectionInfo = sectionAnalysis.find(s => s.name === section);
      console.log(`  - ${section} (${sectionInfo?.questionCount} questions, ${sectionInfo?.totalWeight} points)`);
    });
  }
  
  // Generate recommendations
  console.log(`\n🎯 CORRELATION RECOMMENDATIONS:`);
  
  if (invalidProfiles > 0) {
    console.log(`1. Update ${invalidProfiles} profiles with invalid section references`);
  }
  
  if (unusedSections.length > 0) {
    console.log(`2. Consider incorporating ${unusedSections.length} unused sections into profile criteria`);
  }
  
  const highWeightSections = sectionAnalysis.filter(s => s.totalWeight >= 50);
  console.log(`3. High-impact sections for profiling: ${highWeightSections.map(s => s.name).join(', ')}`);
  
  const lowWeightSections = sectionAnalysis.filter(s => s.totalWeight < 20);
  if (lowWeightSections.length > 0) {
    console.log(`4. Low-weight sections (may need grouping): ${lowWeightSections.map(s => s.name).join(', ')}`);
  }
  
  console.log(`\n${invalidProfiles === 0 ? '✅' : '⚠️'} CORRELATION STATUS: ${invalidProfiles === 0 ? 'ALIGNED' : 'NEEDS CORRECTION'}`);
  
  return {
    totalProfiles: profileValidations.length,
    validProfiles,
    invalidProfiles,
    unusedSections,
    sectionAnalysis,
    needsCorrection: invalidProfiles > 0
  };
}

runProfileCorrelationAnalysis().then(results => {
  if (results.needsCorrection) {
    console.log('\n=== CORRECTION NEEDED ===');
    console.log('Some psychographic profiles reference sections that don\'t exist in the current 99 authentic questions.');
    console.log('Profile criteria must be updated to align with the book\'s actual section structure.');
  } else {
    console.log('\n=== CORRELATION CONFIRMED ===');
    console.log('All psychographic profiles properly correlate with the 99 authentic questions from Lawrence Adjah\'s book.');
  }
});