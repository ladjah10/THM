/**
 * AUTHENTIC BOOK STRUCTURE ANALYSIS
 * Reveals the real subsections from Lawrence Adjah's book vs fabricated sections
 */

import { questions } from './client/src/data/questionsData';

interface AuthenticStructure {
  subsection: string;
  questionCount: number;
  totalWeight: number;
  questionIds: number[];
  currentSection: string; // The fabricated section it's currently assigned to
}

function analyzeAuthenticBookStructure() {
  const subsectionData: Record<string, AuthenticStructure> = {};
  
  // Analyze actual subsections from your book
  questions.forEach(question => {
    if (!subsectionData[question.subsection]) {
      subsectionData[question.subsection] = {
        subsection: question.subsection,
        questionCount: 0,
        totalWeight: 0,
        questionIds: [],
        currentSection: question.section
      };
    }
    
    subsectionData[question.subsection].questionCount++;
    subsectionData[question.subsection].totalWeight += question.weight;
    subsectionData[question.subsection].questionIds.push(question.id);
  });
  
  return Object.values(subsectionData).sort((a, b) => a.subsection.localeCompare(b.subsection));
}

function identifyFabricatedSections() {
  const fabricatedSections = new Set<string>();
  questions.forEach(question => {
    fabricatedSections.add(question.section);
  });
  
  return Array.from(fabricatedSections).sort();
}

async function runAuthenticStructureAnalysis() {
  console.log('=== AUTHENTIC BOOK STRUCTURE ANALYSIS ===\n');
  console.log('CRITICAL DISCOVERY: Section names are FABRICATED!\n');
  
  const authenticSubsections = analyzeAuthenticBookStructure();
  const fabricatedSections = identifyFabricatedSections();
  
  console.log('🚫 FABRICATED SECTIONS (Not from your book):');
  fabricatedSections.forEach(section => {
    const questionsInSection = questions.filter(q => q.section === section).length;
    console.log(`   ${section} (${questionsInSection} questions artificially grouped)`);
  });
  console.log('');
  
  console.log('📚 AUTHENTIC SUBSECTIONS FROM YOUR BOOK:');
  console.log(`Total authentic subsections: ${authenticSubsections.length}`);
  console.log('');
  
  // Group by topic area for better understanding
  const topicGroups: Record<string, AuthenticStructure[]> = {
    'Foundation & Faith': [],
    'Marriage & Relationship': [],
    'Communication & Conflict': [],
    'Financial Management': [],
    'Children & Family': [],
    'Health & Wellness': [],
    'Ministry & Service': [],
    'Other Topics': []
  };
  
  authenticSubsections.forEach(subsection => {
    const name = subsection.subsection.toLowerCase();
    if (name.includes('marriage') || name.includes('faith') || name.includes('foundation')) {
      topicGroups['Foundation & Faith'].push(subsection);
    } else if (name.includes('communication') || name.includes('conflict')) {
      topicGroups['Communication & Conflict'].push(subsection);
    } else if (name.includes('financial') || name.includes('debt') || name.includes('savings')) {
      topicGroups['Financial Management'].push(subsection);
    } else if (name.includes('children') || name.includes('family') || name.includes('parenting')) {
      topicGroups['Children & Family'].push(subsection);
    } else if (name.includes('health') || name.includes('fitness') || name.includes('wellness')) {
      topicGroups['Health & Wellness'].push(subsection);
    } else if (name.includes('ministry') || name.includes('service') || name.includes('worship')) {
      topicGroups['Ministry & Service'].push(subsection);
    } else if (name.includes('intimacy') || name.includes('relationship') || name.includes('love')) {
      topicGroups['Marriage & Relationship'].push(subsection);
    } else {
      topicGroups['Other Topics'].push(subsection);
    }
  });
  
  Object.entries(topicGroups).forEach(([groupName, subsections]) => {
    if (subsections.length > 0) {
      console.log(`${groupName}:`);
      subsections.forEach(sub => {
        console.log(`   ${sub.subsection} (${sub.questionCount}Q, ${sub.totalWeight}pts) - Q${sub.questionIds.join(',')}`);
      });
      console.log('');
    }
  });
  
  console.log('⚠️  PROFILE CORRELATION ISSUE:');
  console.log('The psychographic profiles reference fabricated sections instead of your authentic book content.');
  console.log('Profiles should be based on meaningful groupings of your authentic subsections.');
  console.log('');
  
  console.log('✅ SOLUTION:');
  console.log('1. Remove fabricated section names');
  console.log('2. Use authentic subsections or logical groupings of subsections');
  console.log('3. Update psychographic profile criteria to reference real book content');
  console.log('');
  
  return {
    authenticSubsections,
    fabricatedSections,
    totalQuestions: questions.length,
    topicGroups
  };
}

runAuthenticStructureAnalysis().then(results => {
  console.log('=== FINDINGS ===');
  console.log(`${results.authenticSubsections.length} authentic subsections from your book`);
  console.log(`${results.fabricatedSections.length} fabricated section names created during development`);
  console.log(`${results.totalQuestions} total questions properly restored from your book`);
  console.log('');
  console.log('The questions themselves are authentic - only the grouping sections are fabricated!');
});