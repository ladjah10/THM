/**
 * CRITICAL: Restore Authentic Questions from Lawrence Adjah's Book
 * The current questions are corrupted/simplified and don't match the book content.
 * This completely invalidates all scoring and profiling done so far.
 */

import { questions } from './client/src/data/questionsData';

// Authentic questions from the book with exact wording, options, and weights
const authenticQuestions = [
  {
    id: 1,
    section: "Your Foundation",
    subsection: "Marriage + Family",
    type: "M",
    text: "We each already believe in and (have) receive(d) Jesus Christ as our Lord and Savior and this reality will be the active foundation and guiding lens through which we see and operate in our marriage and family.",
    options: [
      "We each already believe in and (have) receive(d) Jesus Christ as our Lord and Savior and this reality will be the active foundation and guiding lens through which we see and operate in our marriage and family",
      "We are interested in living our new lives together according to the Christian faith, but we haven't each made the individual decision to receive Jesus Christ as our Lord and Savior (and be baptized) and we would like to do this in advance of our union"
    ],
    weight: 10
  },
  {
    id: 2,
    section: "Your Foundation",
    subsection: "Marriage + Family Accountability",
    type: "D",
    text: "In view of the previous question, we are committed to living our lives together being accountable to God, His scripture and to the commitments we make through this \"life covenant\" process, unless mutually revisited and discussed at a later time.",
    options: [
      "In view of the previous question, we are committed to living our lives together being accountable to God, His scripture and to the commitments we make through this \"life covenant\" process, unless mutually revisited and discussed at a later time",
      "Other: Before committing to this we need further discussion with spiritual counsel around how this would operate"
    ],
    weight: 8
  },
  {
    id: 3,
    section: "Your Foundation",
    subsection: "Marriage & Your Children's Faith Journey",
    type: "D",
    text: "We believe we have a responsibility to raise our children according to the Christian faith, intentionally teaching them and raising them according to its expectations while leaving space for them to develop their own personal relationship with Jesus Christ and hopefully make a decision to give their life to Jesus Christ.",
    options: [
      "We believe we have a responsibility to raise our children according to the Christian faith, intentionally teaching them and raising them according to its expectations while leaving space for them to develop their own personal relationship with Jesus Christ and hopefully make a decision to give their life to Jesus Christ"
    ],
    weight: 6
  },
  {
    id: 4,
    section: "Your Foundation",
    subsection: "Marriage Mindset: Happiness",
    type: "M",
    text: "We're committed to the belief regarding happiness in marriage, what is your primary focus?",
    options: [
      "While a marriage relationship can yield happiness, we believe happiness is neither a stable emotion nor a stable foundation to build a marriage upon, as such, we believe each spouse is ultimately responsible for their own happiness",
      "\"Happy Wife, Happy Life\" – the husband is ultimately responsible for making his wife happy and this will in turn lead to a successful marriage",
      "\"Happy King, Happy Kingdom\" – the wife is ultimately responsible for making her husband happy and this will in turn lead to a successful marriage",
      "We believe in \"Happy Spouse, Happy House\" – each spouse is ultimately responsible for the other spouse's happiness and this will in turn lead to a successful marriage"
    ],
    weight: 5
  },
  {
    id: 5,
    section: "Your Foundation",
    subsection: "Marriage Preparation: Legal (Incapacitation)",
    type: "D",
    text: "We're committed to preparing in advance of our marriage to ensuring we are each well cared for in the undesired, unfortunate and rare case of incapacitating illness and or premature death, as such, we are each committed to establishing our spouse as Power of Attorney before our marriage date on or by this date [input].",
    options: [
      "We're committed to preparing in advance of our marriage to ensuring we are each well cared for in the undesired, unfortunate and rare case of incapacitating illness and or premature death, as such, we are each committed to establishing our spouse as Power of Attorney before our marriage date on or by this date [input]"
    ],
    weight: 4
  },
  {
    id: 6,
    section: "Your Foundation",
    subsection: "Marriage Preparation: Legal (Estate)",
    type: "D",
    text: "We're committed to preparing in advance of our marriage to ensuring we are each well cared for in the undesired, unfortunate and rare case of incapacitating illness and or premature death, as such, we are each committed to completing a notarized copy of our will before our marriage date on or by this date [input].",
    options: [
      "We're committed to preparing in advance of our marriage to ensuring we are each well cared for in the undesired, unfortunate and rare case of incapacitating illness and or premature death, as such, we are each committed to completing a notarized copy of our will before our marriage date on or by this date [input]"
    ],
    weight: 4
  },
  {
    id: 7,
    section: "Your Foundation",
    subsection: "Marriage Mindset: Divorce",
    type: "D",
    text: "We are committed to a lifelong marriage and do not see divorce as an exercisable option for any reasons outside of biblical (adultery & abandonment) or personal safety grounds (physical abuse and professionally evaluated and validated, psychological harm), including but not limited to: Unhappiness, \"Falling Out of Love\", \"Growing Apart\", \"Irreconcilable Differences\".",
    options: [
      "We are committed to a lifelong marriage and do not see divorce as an exercisable option for any reasons outside of biblical (adultery & abandonment) or personal safety grounds (physical abuse and professionally evaluated and validated, psychological harm), including but not limited to: Unhappiness, \"Falling Out of Love\", \"Growing Apart\", \"Irreconcilable Differences\""
    ],
    weight: 8
  },
  {
    id: 8,
    section: "Your Foundation",
    subsection: "Marriage Mindset: Divorce & Law",
    type: "M",
    text: "We are committed to a lifelong marriage with one another and do not see divorce as an exercisable option (outside of biblical/safety circumstances), what is your position on prenuptial agreements?",
    options: [
      "We are committed to a lifelong marriage with one another and do not see divorce as an exercisable option (outside of biblical/safety circumstances), still, in view of the law and the prevalent rates of marriage dissolution, we agree to explore and structure a mutually considerate prenuptial agreement for our marriage",
      "We are committed to a lifelong marriage with one another and do not see divorce as an exercisable option (outside of biblical/safety circumstances), and do not believe any legal agreements beyond our mutual commitments through this life covenant process are necessary for us to explore and structure at this time",
      "We are committed to a lifelong marriage with one another and do not see divorce as an exercisable option (outside of biblical/safety circumstances), still, we'd like to be more informed about what prenuptial agreements entail before deciding to consider or not consider it before our marriage"
    ],
    weight: 5
  },
  {
    id: 9,
    section: "Your Foundation",
    subsection: "Marriage Mindset: Celebrating our Covenant",
    type: "M",
    text: "We commit to establishing and celebrating our holy union/covenant through our wedding, how do you plan to celebrate it?",
    options: [
      "We commit to establishing and celebrating our holy union/covenant through our wedding and celebrating our marriage anniversary every year",
      "We commit to establishing and celebrating our holy union/covenant through our wedding, celebrating our marriage anniversary every year and also doing/celebrating a covenant renewal ceremony every 10 years",
      "We commit to establishing and celebrating our holy union/covenant through our wedding, celebrating our marriage anniversary every year and also doing/celebrating a covenant renewal ceremony every 5 years"
    ],
    weight: 3
  }
];

console.log('CRITICAL ISSUE IDENTIFIED:');
console.log('Current questions do NOT match authentic book content');
console.log('All scoring and profiling done so far is INVALID');
console.log('Need to restore authentic questions immediately');
console.log('\nFirst 9 authentic questions restored above');
console.log('Need to continue with questions 10-99 from book materials');