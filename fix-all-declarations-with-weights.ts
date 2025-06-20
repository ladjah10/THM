/**
 * Comprehensive Declaration Questions Fix
 * Adds antithesis options with proper scoring weights for all Declaration questions
 */

import fs from 'fs';
import { questions } from './client/src/data/questionsData';

const declarationFixes = [
  {
    id: 3,
    antithesis: "We do not believe we have a responsibility to raise our children according to any specific faith tradition and prefer to let them choose their own spiritual path when they're old enough to decide"
  },
  {
    id: 5,
    antithesis: "We do not believe it's necessary to establish Power of Attorney before marriage and prefer to address this matter later if and when it becomes relevant"
  },
  {
    id: 6,
    antithesis: "We do not believe creating a will is necessary before marriage and prefer to address estate planning at a later stage in our relationship"
  },
  {
    id: 7,
    antithesis: "We believe that while marriage is intended to be lifelong, divorce may be a reasonable option in circumstances beyond biblical grounds if the relationship becomes irreconcilably damaged"
  },
  {
    id: 13,
    antithesis: "We prefer a different order of priorities or need to discuss what priority structure works best for our unique situation"
  },
  {
    id: 19,
    antithesis: "We believe it's acceptable to address conflicts immediately even in front of others if the situation requires it"
  },
  {
    id: 20,
    antithesis: "We believe it's sometimes necessary to seek advice from trusted friends or family before addressing issues with our spouse"
  },
  {
    id: 21,
    antithesis: "We believe sometimes space and silence for more than 24 hours can be healthy for processing and reflection"
  },
  {
    id: 22,
    antithesis: "We believe text messages can be an appropriate way to communicate about serious issues when in-person conversation isn't possible"
  },
  {
    id: 23,
    antithesis: "We believe sometimes going to sleep while still processing emotions is healthier than forcing resolution before we're ready"
  },
  {
    id: 24,
    antithesis: "We believe sometimes sleeping separately can be beneficial for health, space, or conflict resolution purposes"
  },
  {
    id: 25,
    antithesis: "We believe physical intimacy naturally fluctuates during conflicts and shouldn't be forced during unresolved tensions"
  },
  {
    id: 26,
    antithesis: "We believe temporary periods of silence can be healthy for processing emotions and preventing harmful words"
  },
  {
    id: 28,
    antithesis: "We believe in more egalitarian decision-making where both spouses have equal authority in different areas or all major decisions"
  },
  {
    id: 32,
    antithesis: "We prefer a more flexible approach to physical affection that allows for natural fluctuations and individual preferences"
  },
  {
    id: 36,
    antithesis: "We prefer to maintain some financial privacy and handle individual debts separately while sharing household expenses"
  },
  {
    id: 43,
    antithesis: "We prefer to maintain closer family relationships even if it requires more involvement from extended family in our marriage decisions"
  },
  {
    id: 53,
    antithesis: "We prefer to handle mental and emotional challenges independently or seek individual professional help rather than couples-focused support"
  },
  {
    id: 55,
    antithesis: "We prefer to pursue our individual ministry callings independently without requiring spousal involvement or support"
  },
  {
    id: 58,
    antithesis: "We prefer to pursue individual learning and development independently without requiring spousal support or involvement"
  },
  {
    id: 59,
    antithesis: "We believe individual interests and hobbies should be completely separate from our relationship and not require spousal encouragement"
  },
  {
    id: 62,
    antithesis: "We prefer to grow in character independently and don't believe spouses should hold each other accountable for personal development"
  },
  {
    id: 63,
    antithesis: "We believe some wrongs should be remembered and that complete forgiveness isn't always possible or healthy"
  },
  {
    id: 65,
    antithesis: "We believe each person should express love in their natural way rather than adapting to their spouse's preferences"
  },
  {
    id: 66,
    antithesis: "We believe personality differences are barriers to overcome rather than differences to appreciate and understand"
  },
  {
    id: 67,
    antithesis: "We believe people should maintain their natural communication style rather than adapting to their spouse's personality"
  },
  {
    id: 68,
    antithesis: "We believe romantic love is more important than friendship as the foundation of marriage"
  },
  {
    id: 70,
    antithesis: "We believe each person is primarily responsible for their own health care and major illness should be handled with professional rather than spousal support"
  },
  {
    id: 71,
    antithesis: "We believe financial difficulties should be handled individually and that job loss is primarily the responsibility of the affected spouse"
  },
  {
    id: 72,
    antithesis: "We believe grief and loss should be processed individually with professional help rather than relying primarily on spousal support"
  },
  {
    id: 74,
    antithesis: "We believe some trust violations cannot be overcome and that transparency requirements can be excessive and controlling"
  },
  {
    id: 76,
    antithesis: "We prefer to maintain individual friendships and don't prioritize developing couple friendships with shared values"
  },
  {
    id: 78,
    antithesis: "We believe maintaining some social media connections with former romantic partners is acceptable if boundaries are maintained"
  },
  {
    id: 82,
    antithesis: "We have different standards regarding substance use and believe some recreational use may be acceptable"
  },
  {
    id: 83,
    antithesis: "We believe individual health and appearance choices should be personal decisions without spousal expectations or involvement"
  },
  {
    id: 87,
    antithesis: "We believe natural conversation styles should be maintained rather than practicing formal active listening techniques"
  },
  {
    id: 88,
    antithesis: "We believe appreciation should be expressed naturally rather than as a regular practiced commitment"
  },
  {
    id: 91,
    antithesis: "We prefer to worship individually or are still exploring our church commitment and community involvement"
  },
  {
    id: 93,
    antithesis: "We prefer to focus on our immediate family rather than intentionally building a multi-generational legacy"
  },
  {
    id: 95,
    antithesis: "We prefer to focus on our own marriage growth rather than mentoring other couples"
  },
  {
    id: 98,
    antithesis: "We believe marriage naturally reaches a comfortable stable state and doesn't require continuous active improvement efforts"
  },
  {
    id: 99,
    antithesis: "We view our marriage primarily as a personal relationship rather than as a testimony or witness to others"
  }
];

function generateUpdatedQuestionsFile() {
  let fileContent = `/**
 * Authentic Questions from Lawrence Adjah's "The 100 Marriage Assessment - Series 1"
 * All 99 questions restored with proper Declaration antithesis options and weighted scoring
 */

export interface Question {
  id: number;
  section: string;
  subsection: string;
  type: "M" | "D" | "I";
  text: string;
  options: string[];
  weight: number;
}

export const sections = [
  "Your Foundation",
  "Your Faith Life", 
  "Your Marriage Life",
  "Your Future Together",
  "Personal Growth",
  "Relationship Dynamics",
  "Crisis Management",
  "Social Relationships",
  "Lifestyle Choices",
  "Communication Patterns",
  "Spiritual Life Together",
  "Legacy Building",
  "Covenant Commitment"
];

export const questions: Question[] = [
`;

  questions.forEach((question, index) => {
    let updatedOptions = [...question.options];
    
    // If this is a Declaration question with only one option, add the antithesis
    if (question.type === 'D' && question.options.length === 1) {
      const fix = declarationFixes.find(f => f.id === question.id);
      if (fix) {
        updatedOptions.push(fix.antithesis);
      }
    }
    
    fileContent += `  {
    id: ${question.id},
    section: "${question.section}",
    subsection: "${question.subsection}",
    type: "${question.type}",
    text: "${question.text.replace(/"/g, '\\"')}",
    options: [
`;
    
    updatedOptions.forEach((option, optIndex) => {
      fileContent += `      "${option.replace(/"/g, '\\"')}"`;
      if (optIndex < updatedOptions.length - 1) {
        fileContent += ',';
      }
      fileContent += '\n';
    });
    
    fileContent += `    ],
    weight: ${question.weight}
  }`;
    
    if (index < questions.length - 1) {
      fileContent += ',';
    }
    fileContent += '\n';
  });

  fileContent += '];';
  
  return fileContent;
}

function updateScoringAlgorithm() {
  const scoringContent = `/**
 * Updated Scoring Algorithm with Proper Declaration Weighting
 * Affirmative declaration choice = full weight points
 * Antithesis declaration choice = 25% weight points (significant penalty for non-commitment)
 */

export function calculateQuestionScore(question: any, response: any): number {
  const weight = question.weight;
  
  if (question.type === 'D') {
    // Declaration questions: First option (affirmative) gets full points, second (antithesis) gets 25%
    if (typeof response === 'object' && response.option) {
      const optionIndex = question.options.indexOf(response.option);
      if (optionIndex === 0) return weight; // Affirmative commitment
      if (optionIndex === 1) return weight * 0.25; // Antithesis (significant penalty)
      return 0;
    } else if (typeof response === 'string') {
      const optionIndex = question.options.indexOf(response);
      if (optionIndex === 0) return weight;
      if (optionIndex === 1) return weight * 0.25;
      return 0;
    }
  } else if (question.type === 'M') {
    // Multiple choice: graduated scoring
    if (typeof response === 'object' && response.option) {
      const optionIndex = question.options.indexOf(response.option);
      if (optionIndex !== -1) {
        const scoreMultiplier = Math.max(0.25, 1 - (optionIndex * 0.25));
        return scoreMultiplier * weight;
      }
    } else if (typeof response === 'string') {
      const optionIndex = question.options.indexOf(response);
      if (optionIndex !== -1) {
        const scoreMultiplier = Math.max(0.25, 1 - (optionIndex * 0.25));
        return scoreMultiplier * weight;
      }
    }
  } else if (question.type === 'I') {
    // Input questions: full points if answered
    return response ? weight : 0;
  }
  
  return 0;
}`;

  return scoringContent;
}

async function applyAllFixes() {
  console.log('Applying comprehensive Declaration question fixes...');
  
  // Generate updated questions file
  const updatedContent = generateUpdatedQuestionsFile();
  
  // Write the updated file
  fs.writeFileSync('./client/src/data/questionsData.ts', updatedContent);
  
  // Generate scoring algorithm documentation
  const scoringContent = updateScoringAlgorithm();
  fs.writeFileSync('./declaration-scoring-algorithm.ts', scoringContent);
  
  console.log('✅ Updated all Declaration questions with antithesis options');
  console.log('✅ Proper scoring weights: Affirmative = 100%, Antithesis = 25%');
  console.log('✅ Created scoring algorithm documentation');
  
  // Summary statistics
  const declarationCount = questions.filter(q => q.type === 'D').length;
  const fixedCount = declarationFixes.length;
  
  console.log(`\nSummary:`);
  console.log(`- Total Declaration questions: ${declarationCount}`);
  console.log(`- Questions fixed with antithesis: ${fixedCount}`);
  console.log(`- Scoring weight: Affirmative choice = 100%, Antithesis = 25%`);
  console.log(`- This creates meaningful differentiation between commitment levels`);
}

applyAllFixes();