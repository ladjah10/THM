/**
 * Restore the important subsection data that was accidentally removed
 */

// The subsection data that was removed contains Lawrence Adjah's authentic categorization
const subsectionData = {
  1: "Marriage + Family",
  2: "Marriage + Family Accountability", 
  3: "Marriage & Your Children's Faith Journey (for if/when it becomes applicable)",
  4: "Marriage Mindset: Happiness",
  5: "Marriage Preparation: Legal (Incapacitation)",
  6: "Marriage Preparation: Legal (Will)",
  7: "Marriage Mindset: Divorce",
  8: "Marriage Mindset: Conflict",
  9: "Marriage Preparation: Pastoral Counseling",
  10: "Prayer Life (Individual)",
  11: "Prayer Life (Collective)",
  12: "Spiritual Life Accountability",
  13: "Church Life",
  14: "Roles and Responsibilities: General",
  15: "Roles and Responsibilities: Leadership",
  16: "Roles and Responsibilities: Headship/Submission",
  17: "Roles and Responsibilities: Decision Making",
  18: "Roles and Responsibilities: Communication",
  19: "Communication: Conflict Resolution",
  20: "Communication: Truth",
  21: "Sex (Frequency)",
  22: "Sex (Initiation)",
  23: "Sex (Performance Enhancement)",
  24: "Sex (Boundaries)",
  25: "Sex (Other Activities)",
  26: "Sex (Intimacy Expression)",
  27: "Affection (Love Languages)",
  28: "Romance",
  29: "Quality Time (Date Nights)",
  30: "Quality Time (Planning)",
  31: "Quality Time (Alone Time)",
  32: "Quality Time (Friends/Social Life)",
  33: "Quality Time (Media Consumption/TV)",
  34: "Quality Time (Digital Technology/Devices/Social Media)",
  35: "Lifestyle: Recreation",
  36: "Lifestyle: Hobbies",
  37: "Lifestyle: Social Circles",
  38: "Lifestyle: Vacations/Travel",
  39: "Lifestyle: Entertainment",
  40: "Lifestyle: Gift-Giving",
  41: "Lifestyle: Traditions and Celebrations",
  42: "Lifestyle: Personal Space",
  43: "Lifestyle: Future Dreaming and Planning",
  44: "Children (Desire & Quantity)",
  45: "Children (Delivery Style)",
  46: "Children (Birth Location)",
  47: "Children (Birth Preparation)",
  48: "Children (Newborn Care)",
  49: "Children (Feeding Style)",
  50: "Children (Caretaking, Childcare)",
  51: "Children (Homeschooling vs. Traditional School)",
  52: "Children (Pre-birth Discussions)",
  53: "Children (Discipline Style)",
  54: "Children (Positive Reinforcement, Rewards, Consequences)",
  55: "Children (Child Involvement in Household Management)",
  56: "Children (After-School Activities)",
  57: "Children (Media Consumption and Technology)",
  58: "Children (Health and Medical Care)",
  59: "Children (Faith and Spiritual Formation)",
  60: "Children (Extended Family Influence and Exposure)",
  61: "Children (Marriage Age Target)",
  62: "Children (College Savings and Funding)",
  63: "Children (Future Family Planning)",
  64: "Cooking",
  65: "Household Management (Cleaning)",
  66: "Household Management (Maintenance)",
  67: "Household Management (Decision-Making and Task Assignment)",
  68: "Household Management (Organization)",
  69: "Extended Family (In-Laws)",
  70: "Extended Family (Boundaries)",
  71: "Extended Family (Holidays and Celebrations)",
  72: "Budget Planning",
  73: "Budget Oversight and Management",
  74: "Financial Management",
  75: "Spending Limits/Boundaries",
  76: "Financial Decision-Making (Joint Purchases)",
  77: "Individual Financial Choices (Discretionary/Individual Spending)",
  78: "Giving and Tithing",
  79: "Household Responsibilities (Food/Meals)",
  80: "Financial Future Planning",
  81: "Health and Fitness Goals (Individual)",
  82: "Health and Fitness Goals (Collective)",
  83: "Health (Diet and Nutrition)",
  84: "Health (Medical Care)",
  85: "Health (Mental Health and Counseling)",
  86: "Wellness (Self-Care)",
  87: "Wellness (Recreation and Leisure)",
  88: "Wellness (Sleep)",
  89: "Substance Use",
  90: "Personal Boundaries (Individual Independence)",
  91: "Personal Boundaries (Lifestyle Choices)",
  92: "Personal Boundaries (Friendships)",
  93: "Personal Boundaries (Professional Life)",
  94: "Personal Boundaries (Family and In-Laws)",
  95: "Personal Boundaries (Opposite Sex Interactions)",
  96: "Personal Boundaries (Ex-Romantic Relationships)",
  97: "Personal Boundaries (Social Media)",
  98: "Personal Boundaries (Past Relationship Boundaries)",
  99: "Personal Boundaries (Digital Media with Past Relationships)"
};

function restoreSubsectionData() {
  console.log('Restoring important subsection data...');
  
  const questionsPath = './client/src/data/questionsData.ts';
  let content = readFileSync(questionsPath, 'utf8');
  
  // Update the interface to include subsection
  const newInterface = `export interface Question {
  id: string;
  text: string;
  section: string;
  subsection: string;
  type: "M" | "D" | "I";
  faith: boolean;
  baseWeight: number;
  adjustedWeight: number;
  options: string[];
}`;
  
  content = content.replace(/export interface Question \{[\s\S]*?\}/, newInterface);
  
  // Add subsection data back to each question
  for (let i = 1; i <= 99; i++) {
    const subsection = subsectionData[i];
    if (!subsection) continue;
    
    // Find and update each question to include subsection
    const questionPattern = new RegExp(
      `(\\s+){\\s*id: "Q${i}",\\s*text: "([^"]*)",\\s*section: "([^"]*)",\\s*type: "([^"]*)",\\s*faith: ([^,]+),\\s*baseWeight: ([^,]+),\\s*adjustedWeight: ([^,]+),`,
      'g'
    );
    
    content = content.replace(questionPattern, (match, indent, text, section, type, faith, baseWeight, adjustedWeight) => {
      return `${indent}{
${indent}  id: "Q${i}",
${indent}  text: "${text}",
${indent}  section: "${section}",
${indent}  subsection: "${subsection}",
${indent}  type: "${type}",
${indent}  faith: ${faith},
${indent}  baseWeight: ${baseWeight},
${indent}  adjustedWeight: ${adjustedWeight},`;
    });
  }
  
  writeFileSync(questionsPath, content);
  console.log('Subsection data restored successfully');
}

import { readFileSync, writeFileSync } from 'fs';
restoreSubsectionData();