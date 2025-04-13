// Full 59-question assessment with detailed scoring weights
// Based on the assessment requirements

export interface QuestionOption {
  value: string;
  label: string;
  points: number;
}

export interface Question {
  id: number;
  text: string;
  type: 'M' | 'D'; // Multiple choice or Agree/Disagree
  category: string;
  points: number;
  options: QuestionOption[];
}

export const questions: Question[] = [
  {
    id: 1,
    text: 'Your Foundation: Marriage + Family - What is your faith position?',
    type: 'M',
    category: 'Significant',
    points: 36,
    options: [
      { value: 'believe_in_christ', label: 'Believe in Christ', points: 36 },
      { value: 'plan_to_accept', label: 'Plan to accept Christ', points: 18 },
      { value: 'other', label: 'Other', points: 0 }
    ]
  },
  {
    id: 2,
    text: 'Your Foundation: Marriage + Family Accountability - I believe in accountability for my marriage.',
    type: 'D',
    category: 'Significant',
    points: 12,
    options: [
      { value: 'agree', label: 'Agree', points: 12 },
      { value: 'disagree', label: 'Disagree', points: 0 }
    ]
  },
  {
    id: 3,
    text: 'Your Foundation: Marriage & Your Children\'s Faith - How do you plan to raise your children?',
    type: 'M',
    category: 'Significant',
    points: 12,
    options: [
      { value: 'christian_faith', label: 'Raise in Christian faith', points: 12 },
      { value: 'other', label: 'Not Applicable/Other', points: 0 }
    ]
  },
  {
    id: 4,
    text: 'Your Foundation: Marriage Mindset: Happiness - What is your primary focus in marriage?',
    type: 'D',
    category: 'Significant',
    points: 12,
    options: [
      { value: 'individual_happiness', label: 'Individual happiness', points: 12 },
      { value: 'happy_spouse', label: 'Happy spouse', points: 0 }
    ]
  },
  {
    id: 5,
    text: 'Your Foundation: Marriage Preparation: Legal (Incapacitation) - What is your position on Power of Attorney?',
    type: 'M',
    category: 'Medium',
    points: 7,
    options: [
      { value: 'commit_to_poa', label: 'Commit to Power of Attorney', points: 7 },
      { value: 'other', label: 'Other', points: 0 }
    ]
  },
  {
    id: 6,
    text: 'Your Foundation: Marriage Preparation: Legal (Estate) - What is your position on creating a will?',
    type: 'M',
    category: 'Medium',
    points: 7,
    options: [
      { value: 'commit_to_will', label: 'Commit to will', points: 7 },
      { value: 'other', label: 'Other', points: 0 }
    ]
  },
  {
    id: 7,
    text: 'Your Foundation: Marriage Mindset: Divorce - What is your position on divorce?',
    type: 'D',
    category: 'Significant',
    points: 12,
    options: [
      { value: 'no_divorce', label: 'No divorce (biblical/safety)', points: 12 },
      { value: 'other', label: 'Other', points: 0 }
    ]
  },
  {
    id: 8,
    text: 'Your Foundation: Marriage Mindset: Divorce & Law - What is your position on prenuptial agreements?',
    type: 'M',
    category: 'Significant',
    points: 12,
    options: [
      { value: 'no_legal_agreements', label: 'No legal agreements', points: 12 },
      { value: 'prenup', label: 'Prenup/Other', points: 0 }
    ]
  },
  {
    id: 9,
    text: 'Your Foundation: Marriage Mindset: Celebrating our Covenant - How do you plan to celebrate your marriage?',
    type: 'M',
    category: 'Small',
    points: 3,
    options: [
      { value: 'annually_renewal', label: 'Celebrate annually + renewal', points: 3 },
      { value: 'annually', label: 'Annually only', points: 2 },
      { value: 'other', label: 'Other', points: 0 }
    ]
  },
  {
    id: 10,
    text: 'Your Faith Life: Worship Life: Marriage (Husband and Wife) - How often do you plan to pray together?',
    type: 'M',
    category: 'Medium',
    points: 7,
    options: [
      { value: 'daily_prayer', label: 'Daily prayer', points: 7 },
      { value: 'weekly', label: 'Weekly', points: 4 },
      { value: 'other', label: 'Other', points: 0 }
    ]
  },
  {
    id: 11,
    text: 'Your Faith Life: Worship Life: Family - How often do you plan to have family worship?',
    type: 'M',
    category: 'Medium',
    points: 7,
    options: [
      { value: 'weekly_family_worship', label: 'Weekly family worship', points: 7 },
      { value: 'partial', label: 'Partial (e.g., meals only)', points: 4 },
      { value: 'other', label: 'Other', points: 0 }
    ]
  },
  {
    id: 12,
    text: 'Your Faith Life: Worship Life: Serving - How do you plan to volunteer in your community?',
    type: 'M',
    category: 'Medium',
    points: 7,
    options: [
      { value: 'every_season', label: 'Volunteer in every season', points: 7 },
      { value: 'flexible', label: 'Flexible', points: 4 },
      { value: 'other', label: 'Other', points: 0 }
    ]
  },
  {
    id: 13,
    text: 'Your Marriage Life: Order of Priority before God - What is your order of priority?',
    type: 'D',
    category: 'Significant',
    points: 12,
    options: [
      { value: 'god_spouse_children', label: 'God, Spouse, Children', points: 12 },
      { value: 'other', label: 'Other', points: 0 }
    ]
  },
  {
    id: 14,
    text: 'Your Marriage Life: Family Name - What is your position on family names after marriage?',
    type: 'M',
    category: 'Significant',
    points: 12,
    options: [
      { value: 'wife_takes_husband', label: 'Wife takes husband\'s name', points: 12 },
      { value: 'hyphenate', label: 'Hyphenate/Other', points: 0 }
    ]
  },
  {
    id: 15,
    text: 'Your Marriage Life: Relationship Model (Work/Home) - What is your preferred work arrangement?',
    type: 'M',
    category: 'Medium',
    points: 7,
    options: [
      { value: 'both_work', label: 'Both work full-time', points: 7 },
      { value: 'one_stays_home', label: 'One stays home', points: 4 },
      { value: 'other', label: 'Other', points: 0 }
    ]
  },
  {
    id: 16,
    text: 'Your Marriage Life: Relationship Model (Travel) - What is your maximum time apart due to travel?',
    type: 'M',
    category: 'Medium',
    points: 7,
    options: [
      { value: 'max_7_days', label: 'Max 7 days apart', points: 7 },
      { value: 'max_10_days', label: 'Max 10 days', points: 4 },
      { value: 'other', label: 'Other', points: 0 }
    ]
  },
  {
    id: 17,
    text: 'Your Marriage Life: Relationship Model (Work Down Time) - How much daily downtime do you need?',
    type: 'M',
    category: 'Medium',
    points: 7,
    options: [
      { value: '2_hours', label: '2 hours daily', points: 7 },
      { value: '1_to_1.5_hours', label: '1–1.5 hours', points: 4 },
      { value: 'other', label: 'Other', points: 0 }
    ]
  },
  {
    id: 18,
    text: 'Your Marriage Life: Relationship Model (Late Night Work) - How many late work nights per week?',
    type: 'M',
    category: 'Medium',
    points: 7,
    options: [
      { value: 'max_2_nights', label: 'Max 2 late nights', points: 7 },
      { value: 'max_1_night', label: 'Max 1', points: 4 },
      { value: 'other', label: 'Other', points: 0 }
    ]
  },
  {
    id: 19,
    text: 'Your Marriage Life: Dedicated Time (Fellowship) - How often do you plan to have date nights?',
    type: 'M',
    category: 'Medium',
    points: 7,
    options: [
      { value: 'weekly', label: 'Weekly date night', points: 7 },
      { value: 'bi_weekly', label: 'Bi-weekly', points: 4 },
      { value: 'other', label: 'Other', points: 0 }
    ]
  },
  {
    id: 20,
    text: 'Your Marriage Life: Sex Perspective: Declaration - I believe sex is a duty in marriage.',
    type: 'D',
    category: 'Significant',
    points: 12,
    options: [
      { value: 'agree', label: 'Agree', points: 12 },
      { value: 'disagree', label: 'Disagree', points: 0 }
    ]
  },
  {
    id: 21,
    text: 'Your Marriage Life: Sex - Frequency - What is your preferred frequency for intimacy?',
    type: 'M',
    category: 'Significant',
    points: 12,
    options: [
      { value: '3x_week', label: '3x/week', points: 12 },
      { value: '2x_week', label: '2x/week', points: 8 },
      { value: 'daily', label: 'Daily', points: 12 },
      { value: 'other', label: 'Other', points: 0 }
    ]
  },
  {
    id: 22,
    text: 'Your Marriage Life: Sex - Initiation - How do you prefer to initiate intimacy?',
    type: 'M',
    category: 'Medium',
    points: 7,
    options: [
      { value: 'natural_flow', label: 'Let it flow naturally', points: 7 },
      { value: 'alternating', label: 'Alternating', points: 4 },
      { value: 'other', label: 'Other', points: 0 }
    ]
  },
  {
    id: 23,
    text: 'Your Marriage Life: Sex - Communication - How soon would you discuss intimacy issues?',
    type: 'M',
    category: 'Medium',
    points: 7,
    options: [
      { value: 'within_1_month', label: 'Discuss within 1 month', points: 7 },
      { value: '3_6_months', label: '3–6 months', points: 4 },
      { value: 'other', label: 'Other', points: 0 }
    ]
  },
  {
    id: 24,
    text: 'Your Marriage Life: Sex - Contraception - What is your position on contraception?',
    type: 'M',
    category: 'Medium',
    points: 7,
    options: [
      { value: 'no_contraception', label: 'No contraception', points: 7 },
      { value: 'use_contraception', label: 'Use contraception', points: 0 }
    ]
  },
  {
    id: 25,
    text: 'Your Marriage Life: Sex – Boundaries (Declarations) - I believe we should never discuss our sex life with others.',
    type: 'D',
    category: 'Significant',
    points: 12,
    options: [
      { value: 'agree', label: 'Agree', points: 12 },
      { value: 'disagree', label: 'Disagree', points: 0 }
    ]
  },
  {
    id: 26,
    text: 'Your Marriage Life: Living – Room Boundaries (Electronics) - I believe we should not have electronics in the bedroom.',
    type: 'D',
    category: 'Medium',
    points: 7,
    options: [
      { value: 'agree', label: 'Agree', points: 7 },
      { value: 'disagree', label: 'Disagree', points: 0 }
    ]
  },
  {
    id: 27,
    text: 'Your Marriage Life: Marriage: Dedicated Time - How often would you have marriage check-ins?',
    type: 'M',
    category: 'Medium',
    points: 7,
    options: [
      { value: 'weekly', label: 'Weekly check-in', points: 7 },
      { value: 'not_committed', label: 'Not committed', points: 0 }
    ]
  },
  {
    id: 28,
    text: 'Your Marriage Life: Communication & Conflict Resolution - I believe we should not fight in front of others.',
    type: 'D',
    category: 'Medium',
    points: 7,
    options: [
      { value: 'agree', label: 'Agree', points: 7 },
      { value: 'disagree', label: 'Disagree', points: 0 }
    ]
  },
  {
    id: 29,
    text: 'Your Marriage Life: Communication & Conflict Resolution: Counseling - How often would you attend marriage counseling?',
    type: 'M',
    category: 'Medium',
    points: 7,
    options: [
      { value: 'bi_weekly_first_year', label: 'Bi-weekly first year', points: 7 },
      { value: 'monthly', label: 'Monthly', points: 4 },
      { value: 'other', label: 'Other', points: 0 }
    ]
  },
  {
    id: 30,
    text: 'Your Marriage Life: Communication & Conflict Resolution (Discuss with others) - I believe we should never discuss issues with others before discussing with spouse.',
    type: 'D',
    category: 'Significant',
    points: 12,
    options: [
      { value: 'agree', label: 'Agree', points: 12 },
      { value: 'disagree', label: 'Disagree', points: 0 }
    ]
  },
  {
    id: 31,
    text: 'Your Marriage Life: Communication & Conflict Resolution:2 (24 hours) - I believe we should not go more than 24 hours without speaking.',
    type: 'D',
    category: 'Medium',
    points: 7,
    options: [
      { value: 'agree', label: 'Agree', points: 7 },
      { value: 'disagree', label: 'Disagree', points: 0 }
    ]
  },
  {
    id: 32,
    text: 'Your Marriage Life: Communication & Conflict Resolution:3 (Text) - I believe we should not discuss serious issues via text.',
    type: 'D',
    category: 'Medium',
    points: 7,
    options: [
      { value: 'agree', label: 'Agree', points: 7 },
      { value: 'disagree', label: 'Disagree', points: 0 }
    ]
  },
  {
    id: 33,
    text: 'Your Marriage Life: Communication & Conflict Resolution:4 (Sleep angry) - I believe we should not sleep angry.',
    type: 'D',
    category: 'Medium',
    points: 7,
    options: [
      { value: 'agree', label: 'Agree', points: 7 },
      { value: 'disagree', label: 'Disagree', points: 0 }
    ]
  },
  {
    id: 34,
    text: 'Your Marriage Life: Communication & Conflict Resolution:5 (Same bed) - I believe we should always sleep in the same bed.',
    type: 'D',
    category: 'Medium',
    points: 7,
    options: [
      { value: 'agree', label: 'Agree', points: 7 },
      { value: 'disagree', label: 'Disagree', points: 0 }
    ]
  },
  {
    id: 35,
    text: 'Your Marriage Life: Communication & Conflict Resolution:6 (Sex as weapon) - I believe we should never withhold sex as punishment.',
    type: 'D',
    category: 'Medium',
    points: 7,
    options: [
      { value: 'agree', label: 'Agree', points: 7 },
      { value: 'disagree', label: 'Disagree', points: 0 }
    ]
  },
  {
    id: 36,
    text: 'Your Marriage Life: Communication & Conflict Resolution:7 (Silence as weapon) - I believe we should never use silence as punishment.',
    type: 'D',
    category: 'Medium',
    points: 7,
    options: [
      { value: 'agree', label: 'Agree', points: 7 },
      { value: 'disagree', label: 'Disagree', points: 0 }
    ]
  },
  {
    id: 37,
    text: 'Your Marriage Life: Decision Making - I believe the husband should be the final authority in decision making.',
    type: 'D',
    category: 'Significant',
    points: 12,
    options: [
      { value: 'agree', label: 'Agree', points: 12 },
      { value: 'disagree', label: 'Disagree', points: 0 }
    ]
  },
  {
    id: 38,
    text: 'Your Marriage Life: Marriage: Living – Rooting - What is your preference for where to live?',
    type: 'M',
    category: 'Medium',
    points: 7,
    options: [
      { value: 'flexible', label: 'Flexible location', points: 7 },
      { value: 'specific_city', label: 'Specific city', points: 4 },
      { value: 'other', label: 'Other', points: 0 }
    ]
  },
  {
    id: 39,
    text: 'Your Marriage Life: Marriage: Living – City Type - What type of area do you prefer to live in?',
    type: 'M',
    category: 'Small',
    points: 3,
    options: [
      { value: 'flexible', label: 'Flexible', points: 3 },
      { value: 'specific', label: 'Specific (e.g., suburbs)', points: 2 },
      { value: 'other', label: 'Other', points: 0 }
    ]
  },
  {
    id: 40,
    text: 'Your Marriage Life: Marriage: Living – Domestic/International - Would you be willing to live internationally?',
    type: 'M',
    category: 'Small',
    points: 3,
    options: [
      { value: 'flexible', label: 'Flexible', points: 3 },
      { value: 'specific', label: 'Specific', points: 2 },
      { value: 'other', label: 'Other', points: 0 }
    ]
  },
  {
    id: 41,
    text: 'Your Marriage Life: Marriage: Living – Home Type - What type of home do you prefer?',
    type: 'M',
    category: 'Small',
    points: 3,
    options: [
      { value: 'single_family', label: 'Single-family house', points: 3 },
      { value: 'other', label: 'Other', points: 2 }
    ]
  },
  {
    id: 42,
    text: 'Your Marriage Life with Children: Children Decision: To Have Them (Biologically) - Do you want to have biological children?',
    type: 'M',
    category: 'Significant',
    points: 12,
    options: [
      { value: 'have_children', label: 'Have children', points: 12 },
      { value: 'not_commit', label: 'Not commit', points: 0 }
    ]
  },
  {
    id: 43,
    text: 'Your Marriage Life with Children: Children Decision: How To Have Them (Method) - What is your preferred delivery method?',
    type: 'M',
    category: 'Small',
    points: 3,
    options: [
      { value: 'standard', label: 'Standard delivery', points: 3 },
      { value: 'water', label: 'Water delivery', points: 2 },
      { value: 'other', label: 'Other', points: 0 }
    ]
  },
  {
    id: 44,
    text: 'Your Marriage Life with Children: Children Decision: Where To Have Them - Where would you prefer to give birth?',
    type: 'M',
    category: 'Small',
    points: 3,
    options: [
      { value: 'hospital', label: 'Hospital', points: 3 },
      { value: 'birth_center', label: 'Birth center', points: 2 },
      { value: 'other', label: 'Other', points: 0 }
    ]
  },
  {
    id: 45,
    text: 'Your Marriage Life with Children: Children Decision: When To Have Them - When would you like to have children?',
    type: 'M',
    category: 'Medium',
    points: 7,
    options: [
      { value: 'asap', label: 'As soon as possible', points: 7 },
      { value: 'specific_time', label: 'Specific time', points: 4 },
      { value: 'other', label: 'Other', points: 0 }
    ]
  },
  {
    id: 46,
    text: 'Your Marriage Life with Children: Children Decision: Number of Children (Biologically) - How many biological children do you want?',
    type: 'M',
    category: 'Medium',
    points: 7,
    options: [
      { value: 'as_many', label: 'As many as God allows', points: 7 },
      { value: 'specific_number', label: 'Specific number', points: 4 },
      { value: 'other', label: 'Other', points: 0 }
    ]
  },
  {
    id: 47,
    text: 'Your Marriage Life with Children: Children Decision: Number of Children (Adopted) - Would you consider adoption?',
    type: 'M',
    category: 'Medium',
    points: 7,
    options: [
      { value: 'consider_adoption', label: 'Consider adoption', points: 7 },
      { value: 'not_plan', label: 'Not plan', points: 0 }
    ]
  },
  {
    id: 48,
    text: 'Your Marriage Life with Children: Children Decision: Naming of Children (Model) - How would you approach naming your children?',
    type: 'M',
    category: 'Small',
    points: 3,
    options: [
      { value: 'pray_together', label: 'Pray and decide together', points: 3 },
      { value: 'other', label: 'Other', points: 2 }
    ]
  },
  {
    id: 49,
    text: 'Your Marriage Life with Children: Children Decision: Naming of Children (Jr\'s) - Would you consider naming a child after a parent?',
    type: 'M',
    category: 'Small',
    points: 3,
    options: [
      { value: 'name_after_parent', label: 'Option to name after parent', points: 3 },
      { value: 'not_applicable', label: 'Not applicable', points: 0 }
    ]
  },
  {
    id: 50,
    text: 'Your Marriage Life with Children: Pregnancy Announcement - When would you announce a pregnancy?',
    type: 'M',
    category: 'Small',
    points: 3,
    options: [
      { value: 'private_first_trimester', label: 'Private until 1st trimester', points: 3 },
      { value: 'no_guideline', label: 'No guideline', points: 0 }
    ]
  },
  {
    id: 51,
    text: 'Your Marriage Life with Children: Marriage: Children: Discipline - What is your approach to child discipline?',
    type: 'M',
    category: 'Significant',
    points: 12,
    options: [
      { value: 'godly_no_physical', label: 'Godly wisdom, no physical discipline', points: 12 },
      { value: 'physical_discipline', label: 'Physical discipline', points: 8 },
      { value: 'other', label: 'Other', points: 0 }
    ]
  },
  {
    id: 52,
    text: 'Your Marriage Life with Children: Communication & Discipline - I believe parents should present a united front in discipline.',
    type: 'D',
    category: 'Significant',
    points: 12,
    options: [
      { value: 'agree', label: 'Agree', points: 12 },
      { value: 'disagree', label: 'Disagree', points: 0 }
    ]
  },
  {
    id: 53,
    text: 'Your Marriage Life with Children: Communication & Conflict Resolution - I believe we should not fight in front of children.',
    type: 'D',
    category: 'Medium',
    points: 7,
    options: [
      { value: 'agree', label: 'Agree', points: 7 },
      { value: 'disagree', label: 'Disagree', points: 0 }
    ]
  },
  {
    id: 54,
    text: 'Your Marriage Life with Children: Communication: Sex - At what age would you discuss sex with your children?',
    type: 'M',
    category: 'Medium',
    points: 7,
    options: [
      { value: 'by_age_5', label: 'Discuss by age 5', points: 7 },
      { value: 'later', label: 'Later', points: 4 },
      { value: 'other', label: 'Other', points: 0 }
    ]
  },
  {
    id: 55,
    text: 'Your Marriage Life with Children: Social Media (New Child) - What are your views on sharing newborn photos on social media?',
    type: 'M',
    category: 'Small',
    points: 3,
    options: [
      { value: 'limit_exposure', label: 'Limit exposure', points: 3 },
      { value: 'no_restrictions', label: 'No restrictions', points: 0 }
    ]
  },
  {
    id: 56,
    text: 'Your Marriage Life with Children: Social Media (Exposure) - At what age would you allow children to use social media?',
    type: 'M',
    category: 'Small',
    points: 3,
    options: [
      { value: 'high_school', label: 'No social media until high school', points: 3 },
      { value: 'middle_school', label: 'Middle school', points: 2 },
      { value: 'other', label: 'Other', points: 0 }
    ]
  },
  {
    id: 57,
    text: 'Your Marriage Life with Children: Mobile Phone (Access) - At what age would you give children a mobile phone?',
    type: 'M',
    category: 'Small',
    points: 3,
    options: [
      { value: 'high_school', label: 'No phone until high school', points: 3 },
      { value: 'middle_school', label: 'Middle school', points: 2 },
      { value: 'other', label: 'Other', points: 0 }
    ]
  },
  {
    id: 58,
    text: 'Your Marriage Life with Children: Social Media (New Child Documentation) - What are your views on creating social media accounts for children?',
    type: 'M',
    category: 'Small',
    points: 3,
    options: [
      { value: 'no_account', label: 'No account/restrictions', points: 3 },
      { value: 'allow_sharing', label: 'Allow sharing', points: 0 }
    ]
  },
  {
    id: 59,
    text: 'Your Marriage Life with Children: Communication: Sex / Gender & Sexuality - When would you discuss gender and sexuality with your children?',
    type: 'M',
    category: 'Medium',
    points: 7,
    options: [
      { value: 'agreed_age', label: 'Discuss by agreed age', points: 7 },
      { value: 'other', label: 'Other', points: 0 }
    ]
  }
];

// Calculate maximum possible score
export const calculateMaxScore = (): number => {
  return questions.reduce((total, question) => total + question.points, 0);
};

// Get question by ID
export const getQuestionById = (id: number): Question | undefined => {
  return questions.find(q => q.id === id);
};

// Calculate score based on answers
export const calculateScore = (answers: Record<number, string>): number => {
  let totalScore = 0;
  
  Object.entries(answers).forEach(([questionId, answerValue]) => {
    const questionIdNum = parseInt(questionId, 10);
    const question = getQuestionById(questionIdNum);
    
    if (question) {
      const selectedOption = question.options.find(opt => opt.value === answerValue);
      if (selectedOption) {
        totalScore += selectedOption.points;
      }
    }
  });
  
  return totalScore;
};

// Get percentile based on score
export const getPercentile = (score: number, gender?: string): number => {
  const maxScore = calculateMaxScore();
  const percentage = (score / maxScore) * 100;
  
  // These percentiles are based on the data in the assessment document
  // Overall percentiles (n=59)
  const overallPercentiles = {
    '0th': 224,
    '35th': 274,
    '50th': 299,
    '75th': 349,
    '100th': 444
  };
  
  // Gender-specific percentiles
  const menPercentiles = {
    '0th': 234,
    '50th': 304,
    '100th': 444
  };
  
  const womenPercentiles = {
    '0th': 224,
    '50th': 299,
    '100th': 439
  };
  
  // Use gender-specific percentiles if available
  const percentiles = gender === 'male' ? menPercentiles : 
                     gender === 'female' ? womenPercentiles : 
                     overallPercentiles;
  
  // Calculate percentile (simplified approach)
  if (score <= percentiles['0th']) return 0;
  if (score >= percentiles['100th']) return 100;
  
  // Linear interpolation between known percentile points
  const percentilePoints = Object.entries(percentiles).map(([key, value]) => ({
    percentile: parseInt(key, 10),
    score: value
  })).sort((a, b) => a.score - b.score);
  
  // Find the two percentile points that the score falls between
  for (let i = 0; i < percentilePoints.length - 1; i++) {
    const lower = percentilePoints[i];
    const upper = percentilePoints[i + 1];
    
    if (score >= lower.score && score <= upper.score) {
      // Linear interpolation
      return lower.percentile + 
        ((score - lower.score) / (upper.score - lower.score)) * 
        (upper.percentile - lower.percentile);
    }
  }
  
  return 50; // Default to median if calculation fails
};
