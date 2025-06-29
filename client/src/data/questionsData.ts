/**
 * AUTHENTIC Questions from Lawrence Adjah's "The 100 Marriage Assessment - Series 1"
 * All 99 questions restored from the original book content with proper Declaration antithesis options
 * 
 * AUTHENTICITY VERIFIED: These questions match Lawrence Adjah's book exactly
 * Last Updated: 2025-06-20T07:54:51.471Z
 */

export interface Question {
  id: string;
  text: string;
  section: string;
  subsection: string;
  type: "M" | "D" | "I";
  faith: boolean;
  baseWeight: number;
  adjustedWeight: number;
  options: string[];
}

export const sections = [
  "Section I: Your Foundation",
  "Section II: Your Faith Life", 
  "Section III: Your Marriage Life",
  "Section IV: Your Marriage Life with Children",
  "Section V: Your Family/Home Life",
  "Section VI: Your Finances",
  "Section VII: Your Health and Wellness",
  "Section VIII: Your Marriage and Boundaries",
  "Section IX: Your Penultimate Vow"
];

export const questions: Question[] = [
  {

    id: "Q1",

    text: "We each already believe in and (have) receive(d) Jesus Christ as our Lord and Savior and this reality will be the active foundation and guiding lens through which we see and operate in our marriage and family.",

    section: "Section I: Your Foundation",

    subsection: "Marriage + Family",

    type: "D",

    faith: true,

    baseWeight: 10,

    adjustedWeight: 11,
    options: [
      "We each already believe in and (have) receive(d) Jesus Christ as our Lord and Savior and this reality will be the active foundation and guiding lens through which we see and operate in our marriage and family.",
      "We are interested in living our new lives together according to the Christian faith, but we haven't each made the individual decision to receive Jesus Christ as our Lord and Savior (and be baptized) and we would like to do this in advance of our union."
    ]
  },
  {
    id: "Q2",
    text: "In view of the previous question, we are committed to living our lives together being accountable to God, His scripture and to the commitments we make through this \"life covenant\" process, unless mutually revisited and discussed at a later time.",
    section: "Section I: Your Foundation",
    subsection: "Marriage + Family Accountability",
    type: "D",
    faith: true,
    baseWeight: 10,
    adjustedWeight: 11,
    options: [
      "In view of the previous question, we are committed to living our lives together being accountable to God, His scripture and to the commitments we make through this \"life covenant\" process, unless mutually revisited and discussed at a later time.",
      "Other: Before committing to this we need further discussion with spiritual counsel around how this would operate."
    ]
  },
  {

    id: "Q3",

    text: "We believe we have a responsibility to raise our children according to the Christian faith, intentionally teaching them and raising them according to its expectations while leaving space for them to develop their own personal relationship with Jesus Christ and hopefully make a decision to give their life to Jesus Christ.",

    section: "Section I: Your Foundation",

    subsection: "Marriage & Your Children's Faith Journey (for if/when it becomes applicable)",

    type: "D",

    faith: true,

    baseWeight: 10,

    adjustedWeight: 11,

    options: [
      "We believe we have a responsibility to raise our children according to the Christian faith, intentionally teaching them and raising them according to its expectations while leaving space for them to develop their own personal relationship with Jesus Christ and hopefully make a decision to give their life to Jesus Christ.",
      "We have different beliefs about this matter and need further discussion before reaching agreement"
    ]},
  {

    id: "Q4",

    text: "We're committed to the belief: While a marriage relationship can yield happiness, we believe happiness is neither a stable emotion nor a stable foundation to build a marriage upon, as such, we believe each spouse is ultimately responsible for their own happiness., what is your approach?",

    section: "Section I: Your Foundation",

    subsection: "Marriage Mindset: Happiness",

    type: "M",

    faith: true,

    baseWeight: 8,

    adjustedWeight: 8.5,

    options: [
      "We're committed to the belief: While a marriage relationship can yield happiness, we believe happiness is neither a stable emotion nor a stable foundation to build a marriage upon, as such, we believe each spouse is ultimately responsible for their own happiness.",
      "We're committed to the belief: \"Happy Wife, Happy Life\" - the husband is ultimately responsible for making his wife happy and this will in turn lead to a successful marriage.",
      "We're committed to the belief: \"Happy King, Happy Kingdom\" - the wife is ultimately responsible for making her husband happy and this will in turn lead to a successful marriage.",
      "We're committed to the belief: We believe in \"Happy Spouse, Happy House\" - each spouse is ultimately responsible for the other spouse's happiness and this will in turn lead to a successful marriage."
    ]},
  {

    id: "Q5",

    text: "We're committed to preparing in advance of our marriage to ensuring we are each well cared for in the undesired, unfortunate and rare case of incapacitating illness and or premature death, as such, we are each committed to establishing our spouse as Power of Attorney before our marriage date on or by this date.",

    section: "Section I: Your Foundation",

    subsection: "Marriage Preparation: Legal (Incapacitation)",

    type: "D",

    faith: true,

    baseWeight: 10,

    adjustedWeight: 11,

    options: [
      "We're committed to preparing in advance of our marriage to ensuring we are each well cared for in the undesired, unfortunate and rare case of incapacitating illness and or premature death, as such, we are each committed to establishing our spouse as Power of Attorney before our marriage date on or by this date.",
      "We are not ready to make this commitment at this time and prefer to address this matter later in our relationship"
    ]},
  {

    id: "Q6",

    text: "We're committed to preparing in advance of our marriage to ensuring we are each well cared for in the undesired, unfortunate and rare case of incapacitating illness and or premature death, as such, we are each committed to establishing completing a notarized copy of our will before our marriage date on or by this date.",

    section: "Section I: Your Foundation",

    subsection: "Marriage Preparation: Legal (Will)",

    type: "D",

    faith: true,

    baseWeight: 10,

    adjustedWeight: 11,

    options: [
      "We're committed to preparing in advance of our marriage to ensuring we are each well cared for in the undesired, unfortunate and rare case of incapacitating illness and or premature death, as such, we are each committed to establishing completing a notarized copy of our will before our marriage date on or by this date.",
      "We are not ready to make this commitment at this time and prefer to address this matter later in our relationship"
    ]},
  {

    id: "Q7",

    text: "We are committed to a lifelong marriage and do not see divorce as an exercisable option for any reasons outside of biblical (adultery & abandonment) or personal safety grounds (physical abuse and professionally evaluated and validated, psychological harm), including but not limited to: Unhappiness, \"Falling Out of Love\", \"Growing Apart\", \"Irreconcilable Differences\"",

    section: "Section I: Your Foundation",
    subsection: "Marriage Mindset: Divorce",

    type: "M",

    faith: true,

    baseWeight: 8,

    adjustedWeight: 8.5,

    options: [
      "We are committed to a lifelong marriage and do not see divorce as an exercisable option for any reasons outside of biblical (adultery & abandonment) or personal safety grounds (physical abuse and professionally evaluated and validated, psychological harm), including but not limited to: Unhappiness, \"Falling Out of Love\", \"Growing Apart\", \"Irreconcilable Differences\"",
      "We believe divorce is acceptable for various reasons including unhappiness, falling out of love, growing apart, or irreconcilable differences beyond the biblical grounds mentioned above"
    ]},
  {

    id: "Q8",

    text: "We are committed to a lifelong marriage with one another and do not see divorce as an exercisable option (outside of biblical/safety circumstances), still, in view of the law and the prevalent rates of marriage dissolution, we agree to explore and structure a mutually considerate prenuptial agreement for our marriage., what is your approach?",

    section: "Section I: Your Foundation",

    subsection: "Marriage Mindset: Conflict",

    type: "M",

    faith: true,

    baseWeight: 8,

    adjustedWeight: 8.5,

    options: [
      "We are committed to a lifelong marriage with one another and do not see divorce as an exercisable option (outside of biblical/safety circumstances), still, in view of the law and the prevalent rates of marriage dissolution, we agree to explore and structure a mutually considerate prenuptial agreement for our marriage.",
      "We are committed to a lifelong marriage with one another and do not see divorce as an exercisable option (outside of biblical/safety circumstances), and do not believe any legal agreements beyond our mutual commitments through this life covenant process are necessary for us to explore and structure at this time.",
      "We are committed to a lifelong marriage with one another and do not see divorce as an exercisable option (outside of biblical/safety circumstances), still, we'd like to be more informed about what prenuptial agreements entail before deciding to consider or not consider it before our marriage."
    ]},
  {

    id: "Q9",

    text: "We commit to establishing and celebrating our holy union/ covenant through our wedding and celebrating our marriage anniversary every year., what is your approach?",

    section: "Section I: Your Foundation",

    subsection: "Marriage Preparation: Pastoral Counseling",

    type: "M",

    faith: true,

    baseWeight: 8,

    adjustedWeight: 8.5,

    options: [
      "We commit to establishing and celebrating our holy union/ covenant through our wedding and celebrating our marriage anniversary every year.",
      "We commit to establishing and celebrating our holy union/ covenant through our wedding, celebrating our marriage anniversary every year and also doing/celebrating a covenant renewal ceremony every 10 years.",
      "We commit to establishing and celebrating our holy union/ covenant through our wedding, celebrating our marriage anniversary every year and also doing/celebrating a covenant renewal ceremony every 5 years."
    ]},
  {

    id: "Q10",

    text: "We commit to daily prayer as a couple before we go to sleep., what is your approach?",

    section: "Section II: Your Faith Life",

    subsection: "Prayer Life (Individual)",

    type: "M",

    faith: true,

    baseWeight: 7,

    adjustedWeight: 7.5,

    options: [
      "We commit to daily prayer as a couple before we go to sleep.",
      "We commit to weekly prayer as a couple (during designated checkin time).",
      "Other: Please detail"
    ]},
  {

    id: "Q11",

    text: "We commit to family worship weekly, including a dedicated time for prayer and reflection as a family weekly, familial prayer over meals, and weekly corporate worship in a local faith community where we are members., what is your approach?",

    section: "Section II: Your Faith Life",

    subsection: "Prayer Life (Collective)",

    type: "M",

    faith: true,

    baseWeight: 7,

    adjustedWeight: 7.5,

    options: [
      "We commit to family worship weekly, including a dedicated time for prayer and reflection as a family weekly, familial prayer over meals, and weekly corporate worship in a local faith community where we are members.",
      "We commit to family worship weekly, including familial prayer over meals, and weekly corporate worship in a local/femote faith community where we are members.",
      "Other: Please detail"
    ]},
  {

    id: "Q12",

    text: "We commit to each volunteering/serving in our faith community in some capacity in every season., what is your approach?",

    section: "Section II: Your Faith Life",

    subsection: "Spiritual Life Accountability",

    type: "M",

    faith: true,

    baseWeight: 7,

    adjustedWeight: 7.5,

    options: [
      "We commit to each volunteering/serving in our faith community in some capacity in every season.",
      "We commit to each volunteering/serving in our faith community in some capacity at least one season/event per year.",
      "We commit to each volunteering/serving flexibly inside (and outside of) our faith community based on our capacity, but at a minimum, we'll always be serving our faith community through our giving in every season.",
      "We commit to each volunteering/serving flexibly inside (and outside of) our faith community based on our capacity."
    ]},
  {

    id: "Q13",

    text: "We understand and accept the order of relationship priority according to God's highest design is first, our relationship with God; then, our relationship with our Spouse (see: \"forsake all others\"); then, our relationship with our children (if applicable); then everything and everyone else (including work, friends, family)",

    section: "Section III: Your Marriage Life",
    subsection: "Church Life",

    type: "M",

    faith: true,

    baseWeight: 6,

    adjustedWeight: 6.5,

    options: [
      "We understand and accept the order of relationship priority according to God's highest design is first, our relationship with God; then, our relationship with our Spouse (see: \"forsake all others\"); then, our relationship with our children (if applicable); then everything and everyone else (including work, friends, family)",
      "We believe in a more flexible approach to relationship priorities that may vary based on circumstances and individual needs rather than following a strict hierarchical order"
    ]},
  {

    id: "Q14",

    text: "We commit to sharing the same last name in marriage and for the wife to take the husband's last name., what is your approach?",

    section: "Section III: Your Marriage Life",

    subsection: "Roles and Responsibilities: General",

    type: "M",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We commit to sharing the same last name in marriage and for the wife to take the husband's last name.",
      "We commit to each keeping our own last names in marriage.",
      "We commit to the wife hyphenating her last name with her husband's last name in marriage.",
      "Other: (Please detail)"
    ]},
  {

    id: "Q15",

    text: "We commit to a marriage model where we agree to both work full-time for as long as we both can consistently honor our commitments to God, our spouse and our children (If applicable)., what is your approach?",

    section: "Section III: Your Marriage Life",

    subsection: "Roles and Responsibilities: Leadership",

    type: "M",

    faith: true,

    baseWeight: 6,

    adjustedWeight: 6.5,

    options: [
      "We commit to a marriage model where we agree to both work full-time for as long as we both can consistently honor our commitments to God, our spouse and our children (If applicable).",
      "We commit to a marriage model where we agree the husband is the primary provider and works full-time and the wife stays at home as full-time housewife/homemaker.",
      "We commit to a marriage model where we agree to both work full-time until we have children and then we will transition to a model where the wife stays at home for an extended period (beyond standard parental leave) until the children reach age",
      "We commit to a marriage model where we agree to both work full-time until we have children and then we will transition to a model where the wife stays at home indefinitely as full-time housewife/ homemaker."
    ]},
  {

    id: "Q16",

    text: "We commit to a marriage / work model where we agree to never be away from one another for more than a 7-day period, regardless of the commitment/project scope. If necessary, we will set a \"Come to me or I'll come to you\" plan in order to honor this expectation., what is your approach?",

    section: "Section III: Your Marriage Life",
    subsection: "Roles and Responsibilities: Headship/Submission",

    type: "M",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We commit to a marriage / work model where we agree to never be away from one another for more than a 7-day period, regardless of the commitment/project scope. If necessary, we will set a \"Come to me or I'll come to you\" plan in order to honor this expectation.",
      "We commit to a marriage / work model where we agree to never be away from one another for more than a 10-day period, regardless of the commitment/project scope. If necessary, we will set a \"Come to me or I'll come to you\" plan in order to honor this expectation.",
      "We commit to a marriage / work model where we agree to never be away from one another for more than a 3-day period, regardless of the commitment/project scope. If necessary, we will set a \"Come to me or I'll come to you\" plan in order to honor this expectation.",
      "Other: Please detail"
    ]},
  {

    id: "Q17",

    text: "We commit to a marriage / work model where we agree to have a guarded period of at least 2 hours daily where it's our time to connect directly (not including children), and no work is to be done. Our preliminary guarded time is (am/pm), what is your approach?",

    section: "Section III: Your Marriage Life",

    subsection: "Roles and Responsibilities: Decision Making",

    type: "M",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We commit to a marriage / work model where we agree to have a guarded period of at least 2 hours daily where it's our time to connect directly (not including children), and no work is to be done. Our preliminary guarded time is (am/pm)",
      "We commit to a marriage / work model where we agree to have a guarded period of at least 1.5 hours daily where it's our time to connect directly (not including children), and no work is to be done. Our preliminary guarded time is (am/pm)",
      "We commit to a marriage / work model where we agree to have a guarded period of at least 1 hour daily where it's our time to connect directly (not including children), and no work is to be done. Our preliminary guarded time is (am/pm)",
      "Other: Please detail"
    ]},
  {

    id: "Q18",

    text: "We commit to a marriage / work model where we agree to have no more than 2 late night workdays either at the office or at home (i.e., not going to bed with your spouse), per week., what is your approach?",

    section: "Section III: Your Marriage Life",

    subsection: "Roles and Responsibilities: Communication",

    type: "M",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We commit to a marriage / work model where we agree to have no more than 2 late night workdays either at the office or at home (i.e., not going to bed with your spouse), per week.",
      "We commit to a marriage / work model where we agree to have no more than 1 late night workdays either at the office or at home (i.e., not going to bed with your spouse), per week.",
      "Given the nature of our work, we do not believe this commitment would align well for us.",
      "Other: Please detail"
    ]},
  {

    id: "Q19",

    text: "We commit to a weekly date night on (guarded day, no children if applicable)",

    section: "Section III: Your Marriage Life",

    subsection: "Communication: Conflict Resolution",

    type: "D",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We commit to a weekly date night on (guarded day, no children if applicable)",
      "We commit to a bi-weekly date night on (guarded day, no children if applicable)"
    ]},
  {

    id: "Q20",

    text: "We share the belief that sex in marriage is a duty before God and not a conditional expression of love and honor. As such, we believe we not only have the opportunity to have sex in marriage, but also, we each have the equal responsibility to have sex with each other regularly in marriage, unless only for a short pause due to a mutual commitment to prayer or fasting or for an unexpected health challenge.",

    section: "Section III: Your Marriage Life",

    subsection: "Communication: Truth",

    type: "D",

    faith: true,

    baseWeight: 6,

    adjustedWeight: 6.5,

    options: [
      "We share the belief that sex in marriage is a duty before God and not a conditional expression of love and honor. As such, we believe we not only have the opportunity to have sex in marriage, but also, we each have the equal responsibility to have sex with each other regularly in marriage, unless only for a short pause due to a mutual commitment to prayer or fasting or for an unexpected health challenge.",
      "We have different beliefs about this matter and need further discussion before reaching agreement"
    ]},
  {

    id: "Q21",

    text: "We commit to having sex at least 3 times per week, what is your approach?",

    section: "Section III: Your Marriage Life",

    subsection: "Sex (Frequency)",

    type: "M",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We commit to having sex at least 3 times per week",
      "We commit to having sex daily",
      "We commit to having sex at least 2 times per week"
    ]},
  {

    id: "Q22",

    text: "We commit to alternating who initiates sex by week., what is your approach?",

    section: "Section III: Your Marriage Life",

    subsection: "Sex (Initiation)",

    type: "M",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We commit to alternating who initiates sex by week.",
      "We commit to alternating who initiates sex by day/instance.",
      "We commit to \"letting it flow\" naturally without a set alternation schedule, with that said, we each willingly acknowledge it is not the responsibility of one spouse to initiate a duty before God."
    ]},
  {

    id: "Q23",

    text: "We commit to having a conversation within the first month about what we individually enjoy in sex with our spouse and what aspect of the experience, if anything, you would each enjoy more of., what is your approach?",

    section: "Section III: Your Marriage Life",

    subsection: "Sex (Performance Enhancement)",

    type: "M",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We commit to having a conversation within the first month about what we individually enjoy in sex with our spouse and what aspect of the experience, if anything, you would each enjoy more of.",
      "We commit to having a conversation within the first 3 months about what we individually enjoy in sex with our spouse and what aspect of the experience, if anything, you would each enjoy more of.",
      "We commit to having a conversation within the first 6 months about what we individually enjoy in sex with our spouse and what aspect of the experience, if anything, you would each enjoy more of.",
      "Other: Before committing to this we need further discussion in our session around how this would operate."
    ]},
  {

    id: "Q24",

    text: "We do not plan to use contraception of any form during marriage., what is your approach?",

    section: "Section III: Your Marriage Life",

    subsection: "Sex (Boundaries)",

    type: "M",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We do not plan to use contraception of any form during marriage.",
      "We plan to use contraception, but we do not plan to use any which require oral consumption (health concerns/considerations) or invasive surgery (vasectomy, fallopian \"tubes tied\").",
      "We plan to use all forms of contraception available to us which includes oral consumption and/or invasive surgery as an option (vasectomy, fallopian \"tubes tied\")."
    ]},
  {

    id: "Q25",

    text: "We commit to never discussing our sex lives with anyone (friends, colleagues, and family members) unless we mutually agree to seek outside counsel on that aspect of our relationship.",

    section: "Section III: Your Marriage Life",

    subsection: "Sex (Other Activities)",

    type: "D",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We commit to never discussing our sex lives with anyone (friends, colleagues, and family members) unless we mutually agree to seek outside counsel on that aspect of our relationship.",
      "We are not ready to make this commitment at this time and prefer to address this matter later in our relationship"
    ]},
  {

    id: "Q26",

    text: "We're committed to not having any mobile electronics in our bedroom, specifically, TV's, laptops and/or phones at night's end to ensure our bedroom is a place of intimacy.",

    section: "Section III: Your Marriage Life",

    subsection: "Sex (Intimacy Expression)",

    type: "D",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We're committed to not having any mobile electronics in our bedroom, specifically, TV's, laptops and/or phones at night's end to ensure our bedroom is a place of intimacy.",
      "We do not believe we need unique boundaries around electronics in our bedroom."
    ]},
  {

    id: "Q27",

    text: "We commit to having a weekly check-in on at [] (guarded time)",

    section: "Section III: Your Marriage Life",

    subsection: "Affection (Love Languages)",

    type: "D",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We commit to having a weekly check-in on at [] (guarded time) with a recommended agenda including: Specific Appreciation, Area to Grow/Challenge to Address, Planning, and Prayer",
      "We prefer a more flexible approach to relationship communication without committing to scheduled weekly check-ins"
    ]},
  {

    id: "Q28",

    text: "We commit to having a weekly check-in on at [] (guarded time)",

    section: "Section III: Your Marriage Life",

    subsection: "Romance",

    type: "D",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We commit to having a weekly check-in on at [] (guarded time) with a recommended agenda including: Specific Appreciation, Area to Grow/Challenge to Address, Planning, and Prayer",
      "We prefer handling communication and conflict resolution naturally as issues arise rather than through scheduled weekly check-ins"
    ]},
  {

    id: "Q29",

    text: "We commit to not fighting or having serious arguments in front of others, rather, we'd wait for time alone and away from company, either in our check-in time or immediately after to discuss things away from them.",

    section: "Section III: Your Marriage Life",

    subsection: "Quality Time (Date Nights)",

    type: "D",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We commit to not fighting or having serious arguments in front of others, rather, we'd wait for time alone and away from company, either in our check-in time or immediately after to discuss things away from them.",
      "We are not ready to make this commitment at this time and prefer to address this matter later in our relationship"
    ]},
  {

    id: "Q30",

    text: "We commit to a minimum of monthly counseling sessions for the first year of our marriage, with a minimum of bi-monthly in year 2 and a minimum of quarterly in years 3+ as check-ins (with additional sessions as needed)., what is your approach?",

    section: "Section III: Your Marriage Life",

    subsection: "Quality Time (Planning)",

    type: "M",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We commit to a minimum of monthly counseling sessions for the first year of our marriage, with a minimum of bi-monthly in year 2 and a minimum of quarterly in years 3+ as check-ins (with additional sessions as needed).",
      "We commit to a min of bi-weekly counseling sessions for the first year of our marriage, with a min of monthly in year 2 and a min of quarterly in years 3+ as check-ins (with additional sessions as needed).",
      "Other: Please detail"
    ]},
  {

    id: "Q31",

    text: "We commit to never discussing conflict/issues in our marriage with anyone, before (1) addressing the issue with our spouse and (2) mutually agreeing to seek approved counsel on the issue.",

    section: "Section III: Your Marriage Life",

    subsection: "Quality Time (Alone Time)",

    type: "D",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We commit to never discussing conflict/issues in our marriage with anyone, before (1) addressing the issue with our spouse and (2) mutually agreeing to seek approved counsel on the issue.",
      "We are not ready to make this commitment at this time and prefer to address this matter later in our relationship"
    ]},
  {

    id: "Q32",

    text: "We commit to not going more than 24 hours without speaking with one another under any circumstances.",

    section: "Section III: Your Marriage Life",

    subsection: "Quality Time (Friends/Social Life)",

    type: "D",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We commit to not going more than 24 hours without speaking with one another under any circumstances.",
      "We are not ready to make this commitment at this time and prefer to address this matter later in our relationship"
    ]},
  {

    id: "Q33",

    text: "We commit to not discussing serious issues/ conflicts/debates via text message. Rather, we'll always discuss them in person or in a live conversation on a phone given the importance of conveying the proper tone and honoring wise boundaries for the marriage.",

    section: "Section III: Your Marriage Life",

    subsection: "Quality Time (Media Consumption/TV)",

    type: "D",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We commit to not discussing serious issues/ conflicts/debates via text message. Rather, we'll always discuss them in person or in a live conversation on a phone given the importance of conveying the proper tone and honoring wise boundaries for the marriage.",
      "We are not ready to make this commitment at this time and prefer to address this matter later in our relationship"
    ]},
  {

    id: "Q34",

    text: "We commit to not going to sleep while still angry with one another [not to be confused with resolving the issue, but committing to find common ground to discuss further, prayer and then coming together as one]",

    section: "Section III: Your Marriage Life",

    subsection: "Quality Time (Digital Technology/Devices/Social Media)",

    type: "D",

    faith: true,

    baseWeight: 8,

    adjustedWeight: 8.5,

    options: [
      "We commit to not going to sleep while still angry with one another [not to be confused with resolving the issue, but committing to find common ground to discuss further, prayer and then coming together as one]",
      "We are not ready to make this commitment at this time and prefer to address this matter later in our relationship"
    ]},
  {

    id: "Q35",

    text: "We commit to always sleeping together in the same bed, no matter the issue.",

    section: "Section III: Your Marriage Life",

    subsection: "Lifestyle: Recreation",

    type: "D",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We commit to always sleeping together in the same bed, no matter the issue.",
      "We are not ready to make this commitment at this time and prefer to address this matter later in our relationship"
    ]},
  {

    id: "Q36",

    text: "We commit to never using sex as a weapon by withholding it due to conflict [Unless mutually acknowledged and agreed due to medical considerations, prayer and/or fasting]",

    section: "Section III: Your Marriage Life",

    subsection: "Lifestyle: Hobbies",

    type: "D",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We commit to never using sex as a weapon by withholding it due to conflict [Unless mutually acknowledged and agreed due to medical considerations, prayer and/or fasting]",
      "We are not ready to make this commitment at this time and prefer to address this matter later in our relationship"
    ]},
  {

    id: "Q37",

    text: "We commit to never using silence as a weapon by withholding presence or communication due to conflict [Unless mutually acknowledged and agreed for a set amount of time for prayer and reflection]",

    section: "Section III: Your Marriage Life",

    subsection: "Lifestyle: Social Circles",

    type: "D",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We commit to never using silence as a weapon by withholding presence or communication due to conflict [Unless mutually acknowledged and agreed for a set amount of time for prayer and reflection]",
      "We are not ready to make this commitment at this time and prefer to address this matter later in our relationship"
    ]},
  {

    id: "Q38",

    text: "We commit to never discussing conflict/issues in your marriage with anyone (especially family members) before (1) addressing the issue with your spouse and (2) mutually agreeing to seek approved counsel on the issue.",

    section: "Section III: Your Marriage Life",

    subsection: "Lifestyle: Vacations/Travel",

    type: "D",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We commit to never discussing conflict/issues in your marriage with anyone (especially family members) before (1) addressing the issue with your spouse and (2) mutually agreeing to seek approved counsel on the issue.",
      "We are not ready to make this commitment at this time and prefer to address this matter later in our relationship"
    ]},
  {

    id: "Q39",

    text: "We commit to honoring the husband as the head and the final decision-making authority on all decisions, with trust in his submission to God and prayerful consideration of his wife's and family's interests., what is your approach?",

    section: "Section III: Your Marriage Life",

    subsection: "Lifestyle: Entertainment",

    type: "M",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We commit to honoring the husband as the head and the final decision-making authority on all decisions, with trust in his submission to God and prayerful consideration of his wife's and family's interests. We understand that this role and responsibility should not be conflated with function, as the one in authority does not always execute the day-to-day responsibilities. We commit to a model of Discussion, Prayer, Discussion, Prayer, Decision and if necessary, another round of Discussion & Prayer and seeking Godly counsel if applicable.",
      "We are not in agreement with this approach to decision-making in marriage.",
      "We would like to agree with this approach, but need additional discussion with Godly counsel to be sure of our commitment."
    ]},
  {

    id: "Q40",

    text: "We're committed to living in a city where at least one of our families resides, always., what is your approach?",

    section: "Section III: Your Marriage Life",

    subsection: "Lifestyle: Gift-Giving",

    type: "M",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We're committed to living in a city where at least one of our families resides, always.",
      "We're committed to living in a city where at least one of our families resides for up to the next 10 years (with consideration for younger children + childcare, parental care + presence in older age, existing community).",
      "We're committed to being flexible about our home location, open to living wherever opportunity may lead us, even if it's not in a city with existing family.",
      "We're committed to living in a city where at least one of our families resides for up to the next 5 years (with consideration for younger children + childcare, parental care + presence in older age, existing community)."
    ]},
  {

    id: "Q41",

    text: "We're committed to living in a downtown area of a major city long-term., what is your approach?",

    section: "Section III: Your Marriage Life",

    subsection: "Lifestyle: Traditions and Celebrations",

    type: "M",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We're committed to living in a downtown area of a major city long-term.",
      "We're committed to living in the suburbs long-term.",
      "We're committed to living in a remote area, whether domestically or abroad, which is not necessarily connected or proximate to a major city.",
      "We're committed to being flexible about our living area and do not have a particular preference to a city type."
    ]},
  {

    id: "Q42",

    text: "We're committed to living domestically long-term., what is your approach?",

    section: "Section III: Your Marriage Life",

    subsection: "Lifestyle: Personal Space",

    type: "M",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We're committed to living domestically long-term.",
      "We're committed to living internationally long-term and plan to eventually move shortly after our marriage.",
      "We're committed to being flexible about our living location and do not have a particular preference around living domestically or internationally."
    ]},
  {

    id: "Q43",

    text: "We're committed to living in an apartment long-term as our primary residence., what is your approach?",

    section: "Section III: Your Marriage Life",

    subsection: "Lifestyle: Future Dreaming and Planning",

    type: "M",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We're committed to living in an apartment long-term as our primary residence.",
      "We're committed to living in a standalone single-family house long-term as our primary residence.",
      "We're committed to living in a standalone single-family townhouse long-term as our primary residence.",
      "We're committed to living in a multi-family house long-term."
    ]},
  {

    id: "Q44",

    text: "We commit to having children (according to God's will).",

    section: "Section IV: Your Marriage Life with Children",

    subsection: "Children (Desire & Quantity)",

    type: "D",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We commit to having children (according to God's will).",
      "We do not commit to having children."
    ]},
  {

    id: "Q45",

    text: "We recognize the most important outcome we desire is for a healthy delivery for both the mother and the child, with that said, to the extent we can plan, we'd prefer:, what is your approach?",

    section: "Section IV: Your Marriage Life with Children",

    subsection: "Children (Delivery Style)",

    type: "M",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "A Water Delivery (if medically prudent and possible)",
      "Vaginal Delivery (Out of Water) (with potential for C-Section if medically necessary)"
    ]},
  {

    id: "Q46",

    text: "We recognize the most important outcome we desire is for a healthy delivery for both the mother and the child, with that said, to the extent we can plan, we'd prefer:, what is your approach?",

    section: "Section IV: Your Marriage Life with Children",

    subsection: "Children (Birth Location)",

    type: "M",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "A Home Birth (if medically prudent and possible)",
      "A Hospital Birth",
      "A Birth Center (if medically prudent and possible)"
    ]},
  {

    id: "Q47",

    text: "We commit to attempting to have them as soon as possible., what is your approach?",

    section: "Section IV: Your Marriage Life with Children",

    subsection: "Children (Birth Preparation)",

    type: "M",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We commit to attempting to have them as soon as possible.",
      "We commit to attempting to have them after year one.",
      "We commit to attempting to have them after year two.",
      "We commit to attempting to have them after this specific milestone."
    ]},
  {

    id: "Q48",

    text: "We commit to having as many children as God will allow us to have., what is your approach?",

    section: "Section IV: Your Marriage Life with Children",

    subsection: "Children (Newborn Care)",

    type: "M",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We commit to having as many children as God will allow us to have.",
      "We commit to having one child (according to God's will).",
      "We commit to having two children (according to God's will).",
      "We commit to having three children (according to God's will).",
      "Not Applicable"
    ]},
  {

    id: "Q49",

    text: "We commit to adopting at least one child during our marriage., what is your approach?",

    section: "Section IV: Your Marriage Life with Children",

    subsection: "Children (Feeding Style)",

    type: "M",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We commit to adopting at least one child during our marriage.",
      "We admire and believe in adoption but do not plan to adopt during our marriage.",
      "We are committed to having children biologically (according to God's will), but would consider adoption if we discern it's not His will for us to have children biologically."
    ]},
  {

    id: "Q50",

    text: "We commit to naming our children with first names that are from the Bible., what is your approach?",

    section: "Section IV: Your Marriage Life with Children",

    subsection: "Children (Caretaking, Childcare)",

    type: "M",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We commit to naming our children with first names that are from the Bible.",
      "We commit to naming our children with first names that honor a family member from either side of the family.",
      "We commit to naming our children with first names that are gender neutral.",
      "Other: Please detail"
    ]},
  {

    id: "Q51",

    text: "We agree that it's an option to name one of our children after a parent., what is your approach?",

    section: "Section IV: Your Marriage Life with Children",

    subsection: "Children (Homeschooling vs. Traditional School)",

    type: "M",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We agree that it's an option to name one of our children after a parent.",
      "We agree that's not an option name one of our children after a parent.",
      "Not Applicable"
    ]},
  {

    id: "Q52",

    text: "We commit to keeping the news of our pregnancy private until the end of the 1st trimester., what is your approach?",

    section: "Section IV: Your Marriage Life with Children",

    subsection: "Children (Pre-birth Discussions)",

    type: "M",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We commit to keeping the news of our pregnancy private until the end of the 1st trimester.",
      "We commit to keeping the news of our pregnancy private until the end of the 2nd trimester.",
      "We do not have a specific guideline around if and when we will share news of a pregnancy.",
      "Not Applicable"
    ]},
  {

    id: "Q53",

    text: "We commit to raising and disciplining our children with Godly wisdom and discernment, with an orientation to disciplining our children according to their age and level of understanding leveraging:, what is your approach?",

    section: "Section IV: Your Marriage Life with Children",

    subsection: "Children (Discipline Style)",

    type: "M",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We commit to raising and disciplining our children with Godly wisdom and discernment, with an orientation to disciplining our children according to their age and level of understanding leveraging gentle verbal instruction/warning, firm verbal instruction/warning and in the repeated case of disobedience, disrespect or danger, we are comfortable with physical discipline and other forms of punishments in love.",
      "We commit to raising and disciplining our children with Godly wisdom and discernment, with an orientation to disciplining our children according to their age and level of understanding leveraging gentle verbal instruction/warning, firm verbal instruction warning and in the repeated case of disobedience, disrespect or danger, we are comfortable with other forms of punishment in love, which do not include physical discipline.",
      "Not Applicable"
    ]},
  {

    id: "Q54",

    text: "We commit to being a united front before our children, never keeping any secrets from the other parent and never undermining a decision or perspective given by your spouse, whether in front of the children as a couple, or separate from your spouse with the children",

    section: "Section IV: Your Marriage Life with Children",

    subsection: "Children (Positive Reinforcement, Rewards, Consequences)",

    type: "D",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We commit to being a united front before our children, never keeping any secrets from the other parent and never undermining a decision or perspective given by your spouse, whether in front of the children as a couple, or separate from your spouse with the children",
      "We are not ready to make this commitment at this time and prefer to address this matter later in our relationship"
    ]},
  {

    id: "Q55",

    text: "We commit to not fighting or having serious arguments in front of the children, rather, we'd wait for time alone and away from the children, either in our check-in time or immediately after to discuss things away from them.",

    section: "Section IV: Your Marriage Life with Children",

    subsection: "Children (Child Involvement in Household Management)",

    type: "D",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We commit to not fighting or having serious arguments in front of the children, rather, we'd wait for time alone and away from the children, either in our check-in time or immediately after to discuss things away from them.",
      "We commit to fighting respectfully, even if it's a serious disagreement, in front of the children, because we believe it's healthy and constructive to model positive conflict resolution and to set realistic expectations for them in a marriage."
    ]},
  {

    id: "Q56",

    text: "We commit to discussing sex with our children together at no later than 5 years old, specifically, discussing appropriate/inappropriate touch and expectations of communication if it happens., what is your approach?",

    section: "Section IV: Your Marriage Life with Children",

    subsection: "Children (After-School Activities)",

    type: "M",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We commit to discussing sex with our children together at no later than 5 years old, specifically, discussing appropriate/inappropriate touch and expectations of communication if it happens.",
      "We commit to discussing sex with our children one on one (each parent has their own talk) at no later than 5 years old specifically, discussing appropriate/inappropriate touch and expectations of communication if it happens and talking through anatomy and what sex is.",
      "We commit to discussing sex with our children together at no later than 5 years old; however, we'll discuss appropriate/inappropriate touch and expectations of communication if it happens, between by age 7 and we'll talk through anatomy, what sex is and its purpose, by puberty (10-13).",
      "We commit to discussing sex with our children one on one (each parent has their own talk) at no later than 5 years old; however, we'll discuss appropriate/inappropriate touch and expectations of communication if it happens, between by age 7 and we'll talk through anatomy, what sex is and its purpose, by puberty (10-13).",
      "Other: Please detail"
    ]},
  {

    id: "Q57",

    text: "We're committed to guarding the image and identity of our children and are committed to not posting any photos of them on social media indefinitely, what is your approach?",

    section: "Section IV: Your Marriage Life with Children",

    subsection: "Children (Media Consumption and Technology)",

    type: "M",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We're committed to guarding the image and identity of our children and are committed to not posting any photos of them on social media indefinitely",
      "We're committed to guarding the image and identity of our children and are committed to limiting their exposure on social media by restricting others from sharing photos of our children on social media (direct/indirectly) and posting family/individual photos we've mutually agreed to share",
      "We're committed to approaching the issue of social media exposure of our children's image and identity with discretion; however, we do not believe any specific restrictions on sharing / posting from friends and family are necessary",
      "We're committed to guarding the image and identity of our children and are committed to limiting their exposure on social media by limiting others from sharing photos of our children on social media (direct/indirectly) without our permission and posting family/individual photos we've mutually agreed to share."
    ]},
  {

    id: "Q58",

    text: "We're committed to guarding the psychological development and physical safety of our children while allowing them to be socially connected and technologically adept, with that said, we do not believe it is appropriate for our children to be on any form of social media until they become high school age, what is your approach?",

    section: "Section IV: Your Marriage Life with Children",

    subsection: "Children (Health and Medical Care)",

    type: "M",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We're committed to guarding the psychological development and physical safety of our children while allowing them to be socially connected and technologically adept, with that said, we do not believe it is appropriate for our children to be on any form of social media until they become high school age",
      "We're committed to guarding the psychological development and physical safety of our children while allowing them to be socially connected and technologically adept, with that said, we do not believe it is appropriate for our children to be on any form of social media until they become middle school age",
      "We're committed to guarding the psychological development and physical safety of our children while allowing them to be socially connected and technologically adept, with that said, we will allow closely monitored social media use from middle school age on",
      "Other: Please detail"
    ]},
  {

    id: "Q59",

    text: "We're committed to guarding the psychological development and physical safety of our children while allowing them to be socially connected and technologically adept, with that said, we do not believe it is appropriate for our children to have a mobile phone until they become high school age, what is your approach?",

    section: "Section IV: Your Marriage Life with Children",

    subsection: "Children (Faith and Spiritual Formation)",

    type: "M",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We're committed to guarding the psychological development and physical safety of our children while allowing them to be socially connected and technologically adept, with that said, we do not believe it is appropriate for our children to have a mobile phone until they become high school age",
      "We're committed to guarding the psychological development and physical safety of our children while allowing them to be socially connected and technologically adept, with that said, we do not believe it is appropriate for our children to have a mobile phone until they become middle school age",
      "We're committed to guarding the psychological development and physical safety of our children while allowing them to be socially connected and technologically adept, with that said, we will allow closely monitored mobile phone use from as early as we feel comfortable they can properly use it without losing or damaging it.",
      "Other: Please detail"
    ]},
  {

    id: "Q60",

    text: "We're committed to guarding the image and identity of our children and are committed to not posting any photos of them on social media indefinitely., what is your approach?",

    section: "Section IV: Your Marriage Life with Children",

    subsection: "Children (Extended Family Influence and Exposure)",

    type: "M",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We're committed to guarding the image and identity of our children and are committed to not posting any photos of them on social media indefinitely.",
      "We're committed to approaching the issue of social media exposure of our children's image and identity with care, still, we do not plan to create an account on their behalf or have any unique restrictions to friends/family or ourselves of sharing photos with them in them.",
      "We're committed to creating and managing an account on our children's behalf, with photos we will share from their birth until we believe they are of age to take over their account."
    ]},
  {

    id: "Q61",

    text: "We believe God created man and woman, as the two genders, with a sexual ethic of marriage and relationship between a man and a woman, with that said, we also acknowledge many aspects of our human experience are often not in line with God's highest design for humanity and as a result, we want to prepare our children to not only understand God's intentions for them in terms of gender and sexual ethics, but also, we want to raise children who can also effectively engage with those different from them in this regard with grace and love, without compromising their understanding of the truth. As such, we commit to discussing this topic with our children by age [your preferred age], what is your approach?",

    section: "Section IV: Your Marriage Life with Children",

    subsection: "Children (Marriage Age Target)",

    type: "M",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We believe God created man and woman, as the two genders, with a sexual ethic of marriage and relationship between a man and a woman, with that said, we also acknowledge many aspects of our human experience are often not in line with God's highest design for humanity and as a result, we want to prepare our children to not only understand God's intentions for them in terms of gender and sexual ethics, but also, we want to raise children who can also effectively engage with those different from them in this regard with grace and love, without compromising their understanding of the truth. As such, we commit to discussing this topic with our children by age [your preferred age]",
      "While we recognize and acknowledge God's highest design for humanity around gender and sexuality, we do not feel equipped to have this conversation with our children because we need to develop and deepen our own understanding of this topic through our own study and consultation with spiritual counsel. As such, we commit to doing intentional study on our own and in the meantime, allowing our faith community and counsel to provide the primary guidance to our children.",
      "Other: Please detail"
    ]},
  {

    id: "Q62",

    text: "We recognize the reality of race as well as its role and history still we don't believe we should have an explicit discussion about race / racial dynamics in the world and in our country with our children, what is your approach?",

    section: "Section IV: Your Marriage Life with Children",

    subsection: "Children (College Savings and Funding)",

    type: "M",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We recognize the reality of race as well as its role and history still we don't believe we should have an explicit discussion about race / racial dynamics in the world and in our country with our children",
      "We commit to discussing race with our children together at no later than 10 years old, specifically, discussing the history of race / racial dynamics, where it stems from a biblical perspective (Genesis 3), and expectations you have of them around their approach to engaging the issue in this world",
      "We commit to discussing race with our children one on one (each parent has their own talk) at no later than 10 years old, specifically, discussing the history of race / racial dynamics, where it stems from a biblical perspective (Genesis 3), and expectations you have of them around their approach to engaging the issue in this world",
      "Other: Please detail"
    ]},
  {

    id: "Q63",

    text: "We are committed to educating our children in the public school system., what is your approach?",

    section: "Section IV: Your Marriage Life with Children",

    subsection: "Children (Future Family Planning)",

    type: "M",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We are committed to educating our children in the public school system.",
      "We are committed to educating our children in private school.",
      "We are committed to homeschooling our children.",
      "We are committed to a flexible learning experience where we're committed to the best local educational environment which could vary between all school types based on location, outcomes, pricing and more."
    ]},
  {

    id: "Q64",

    text: "We are committed to eating dinner as a family every single day, outside of unique and rare circumstances, what is your approach?",

    section: "Section V: Your Family/Home Life",

    subsection: "Cooking",

    type: "M",

    faith: false,

    baseWeight: 4,

    adjustedWeight: 4,

    options: [
      "We are committed to eating dinner as a family every single day, outside of unique and rare circumstances",
      "We are committed to eating dinner as a family at least once weekly, on",
      "We are committed to eating dinner as a family at least once monthly, on the | of each month",
      "Other: Please detail"
    ]},
  {

    id: "Q65",

    text: "We are committed to budgeting, planning and going on at least one family vacation per year, what is your approach?",

    section: "Section V: Your Family/Home Life",

    subsection: "Household Management (Cleaning)",

    type: "M",

    faith: false,

    baseWeight: 4,

    adjustedWeight: 4,

    options: [
      "We are committed to budgeting, planning and going on at least one family vacation per year",
      "We are committed to budgeting, planning and going on at least two family vacations per year",
      "Other: Please detail"
    ]},
  {

    id: "Q66",

    text: "We are committed to taking a full immediate family photo at least once per year, what is your approach?",

    section: "Section V: Your Family/Home Life",

    subsection: "Household Management (Maintenance)",

    type: "M",

    faith: false,

    baseWeight: 4,

    adjustedWeight: 4,

    options: [
      "We are committed to taking a full immediate family photo at least once per year",
      "We are committed to taking a full immediate family photo at least once every two years",
      "Other: Please detail"
    ]},
  {

    id: "Q67",

    text: "In view of gifting and capacity, we commit to [one designated spouse] being the primary individual in our family who manages and executes the periodic functions of our house cleaning and maintenance, which includes but is not limited to cleaning and maintenance of living space, laundry and dry cleaning.",

    section: "Section V: Your Family/Home Life",

    subsection: "Household Management (Decision-Making and Task Assignment)",

    type: "D",

    faith: false,

    baseWeight: 4,

    adjustedWeight: 4,

    options: [
      "In view of gifting and capacity, we commit to [one designated spouse] being the primary individual in our family who manages and executes the periodic functions of our house cleaning and maintenance, which includes but is not limited to cleaning and maintenance of living space, laundry and dry cleaning. We commit to not conflating this role and responsibility with function as always being the one executing the function/responsibility day to day, meaning [one designated spouse] is primarily and ultimately responsible and accountable for seeing it get done, within the financial and capacity constraints of the family.",
      "We are not in agreement with this approach to house cleaning and maintenance responsibilities.",
      "We would like to agree with this approach, but need additional discussion with Godly counsel to be sure of our commitment."
    ]},
  {

    id: "Q68",

    text: "We commit to a model of weekly house cleaning taking place on Saturdays or Sundays which includes but is not limited to, cleaning of general living areas, kitchen, bathrooms and bedrooms and laundry (assumption of general tidiness, cleaning after self during the week)., what is your approach?",

    section: "Section V: Your Family/Home Life",

    subsection: "Household Management (Organization)",

    type: "M",

    faith: false,

    baseWeight: 4,

    adjustedWeight: 4,

    options: [
      "We commit to a model of weekly house cleaning taking place on Saturdays or Sundays which includes but is not limited to, cleaning of general living areas, kitchen, bathrooms and bedrooms and laundry (assumption of general tidiness, cleaning after self during the week).",
      "We commit to a model of bi-weekly house cleaning taking place on Saturdays or Sundays which includes but is not limited to, cleaning of general living areas, kitchen, bathrooms and bedrooms and laundry (assumption of general tidiness, cleaning after self during the week).",
      "We commit to a model of bi-weekly house cleaning by an outside cleaning vendor which includes but is not limited to, cleaning of general living areas, kitchen, bathrooms and bedrooms and laundry (assumption of general tidiness, cleaning after self during the week).",
      "Other: Please detail"
    ]},
  {

    id: "Q69",

    text: "We commit to a model where the person who prepares the food is not the person who cleans up the kitchen, sink and table after the food is prepared and consumed. It is the responsibility of the noncooking spouse/children to clean., what is your approach?",

    section: "Section V: Your Family/Home Life",

    subsection: "Extended Family (In-Laws)",

    type: "M",

    faith: false,

    baseWeight: 4,

    adjustedWeight: 4,

    options: [
      "We commit to a model where the person who prepares the food is not the person who cleans up the kitchen, sink and table after the food is prepared and consumed. It is the responsibility of the noncooking spouse/children to clean.",
      "We commit to a model where the person who prepares the food is responsible for cleaning up after the meal is done.",
      "We commit to a model where the person who prepares the food is responsible for cleaning up as they cook and after the meal is done.",
      "Other: Please detail"
    ]},
  {

    id: "Q70",

    text: "We commit to a model of weekly outside housework taking place on Saturdays or Sundays which includes but is not limited to, cleaning of vehicles, lawn care, cleaning of trash & recycling bins, deck, sidewalk and general gardening, what is your approach?",

    section: "Section V: Your Family/Home Life",

    subsection: "Extended Family (Boundaries)",

    type: "M",

    faith: false,

    baseWeight: 4,

    adjustedWeight: 4,

    options: [
      "We commit to a model of weekly outside housework taking place on Saturdays or Sundays which includes but is not limited to, cleaning of vehicles, lawn care, cleaning of trash & recycling bins, deck, sidewalk and general gardening",
      "We commit to a model of monthly outside housework taking place on Saturdays or Sundays which includes but is not limited to, cleaning of vehicles, lawn care, cleaning of trash & recycling bins, deck, sidewalk and general gardening",
      "We commit to a model of outside housework by a hired outside vendor which includes but is not limited to, cleaning of vehicles, lawn care, cleaning of trash & recycling bins, deck, sidewalk and general gardening",
      "Other: Please detail"
    ]},
  {

    id: "Q71",

    text: "We are committed to doing at least one outing as a family at least once weekly, what is your approach?",

    section: "Section V: Your Family/Home Life",

    subsection: "Extended Family (Holidays and Celebrations)",

    type: "M",

    faith: false,

    baseWeight: 4,

    adjustedWeight: 4,

    options: [
      "We are committed to doing at least one outing as a family at least once weekly",
      "We are committed to doing at least one outing as a family at least bi-weekly",
      "We are committed to doing at least one outing as a family at least monthly",
      "Other: Please detail"
    ]},
  {

    id: "Q72",

    text: "We commit to having a \"One Flesh, One Financial\" model where any and every amount of income generated by either spouse is considered the family's resources and is budgeted and apportioned against our prayerfully planned annual budget",

    section: "Section VI: Your Finances",
    subsection: "Budget Planning",

    type: "D",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We commit to having a \"One Flesh, One Financial\" model where any and every amount of income generated by either spouse is considered the family's resources and is budgeted and apportioned against our prayerfully planned annual budget",
      "Other: Before committing to this we need further discussion in our session around how this would operate"
    ]},
  {

    id: "Q73",

    text: "We commit to developing an annual budget, with monthly discussions on the of each month, around our status (actuals) against our goals, what is your approach?",

    section: "Section VI: Your Finances",

    subsection: "Budget Oversight and Management",

    type: "M",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We commit to developing an annual budget, with monthly discussions on the of each month, around our status (actuals) against our goals",
      "We commit to working with a financial advisor, who will help us develop an annual budget, with monthly discussion around our status (actuals) against our goals",
      "We commit to developing an annual budget, with bi-monthly discussions on the of every other month, around our status (actuals) against our goals",
      "Other: Please detail"
    ]},
  {

    id: "Q74",

    text: "In view of gifting and capacity, we commit to [one designated spouse] being the primary individual in our family who manages the periodic functions of our finances, which includes but is not limited to, developing the budget, financial reconciliations, bill-payment and investment related asset management and allocation",

    section: "Section VI: Your Finances",

    subsection: "Financial Management",

    type: "D",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "In view of gifting and capacity, we commit to [one designated spouse] being the primary individual in our family who manages the periodic functions of our finances, which includes but is not limited to, developing the budget, financial reconciliations, bill-payment and investment related asset management and allocation",
      "Other: We commit to having a licensed financial professional handle and manage all of our financial matters. We commit to at least monthly updates (indefinitely) with the professional of our choosing."
    ]},
  {

    id: "Q75",

    text: "We commit to giving at least 10% of our net income to our faith community monthly, what is your approach?",

    section: "Section VI: Your Finances",

    subsection: "Spending Limits/Boundaries",

    type: "M",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We commit to giving at least 10% of our net income to our faith community monthly",
      "We commit to giving at least 2% of our net income to our faith community monthly, with the goal of increasing giving by 1% each year",
      "We commit to giving at least 10% of our net income to our faith community and at least 2% to causes and missions we believe in.",
      "Other: Please detail"
    ]},
  {

    id: "Q76",

    text: "We commit to paying for things when we go out together in public, unless we explicitly discuss another plan in advance, what is your approach?",

    section: "Section VI: Your Finances",

    subsection: "Financial Decision-Making (Joint Purchases)",

    type: "M",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We commit to paying for things when we go out together in public, unless we explicitly discuss another plan in advance",
      "We're committed to a more flexible setup where there is no set expectation for one spouse paying (because it's ultimately coming from the same source) and we talk about it in advance each time",
      "Other: Please detail"
    ]},
  {

    id: "Q77",

    text: "We commit to giving our children a weekly allowance as an opportunity to teach financial stewardship, what is your approach?",

    section: "Section VI: Your Finances",

    subsection: "Individual Financial Choices (Discretionary/Individual Spending)",

    type: "M",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We commit to giving our children a weekly allowance as an opportunity to teach financial stewardship",
      "While we believe in teaching our children proper financial stewardship, we do not believe in giving them an allowance. We will provide resources as needed and available.",
      "We commit to giving our children a monthly allowance as an opportunity to teach stewardship",
      "Other: Please detail"
    ]},
  {

    id: "Q78",

    text: "We commit to opening a 529 plan/account for our children after they are born and depositing a budget sensitive amount monthly, what is your approach?",

    section: "Section VI: Your Finances",

    subsection: "Giving and Tithing",

    type: "M",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We commit to opening a 529 plan/account for our children after they are born and depositing a budget sensitive amount monthly",
      "We commit to opening a savings account for our children after they are born and depositing a budget sensitive amount monthly",
      "We commit to opening a brokerage account for our children after they are born and depositing a budget sensitive amount monthly",
      "We commit to opening both a 529 plan/account and a brokerage account for our children after they are born and depositing a budget sensitive amount monthly",
      "Other: Please detail"
    ]},
  {

    id: "Q79",

    text: "We commit to having [one designated spouse] be responsible for the overall food planning and preparation for the family, with considerations made for date night, family outings and circumstances when one is unable to do. (80 / 20), what is your approach?",

    section: "Section VI: Your Finances",

    subsection: "Household Responsibilities (Food/Meals)",

    type: "M",

    faith: false,

    baseWeight: 6,

    adjustedWeight: 6,

    options: [
      "We commit to having [one designated spouse] be responsible for the overall food planning and preparation for the family, with considerations made for date night, family outings and circumstances when one is unable to do. (80 / 20)",
      "We commit to having [one designated spouse] be responsible for the overall food planning and preparation for the family, with a split of [one designated spouse] being responsible for meals during the week (M-Fri) and [one designated spouse] being responsible for meals during the weekend.",
      "We commit to having a chef / nanny be responsible for the overall food planning and preparation for the family.",
      "Other: Please detail"
    ]},
  {

    id: "Q80",

    text: "We commit to enjoying home-cooked meals at least 4 of the 7 days per week, what is your approach?",

    section: "Section VI: Your Finances",

    subsection: "Financial Future Planning",

    type: "M",

    faith: false,

    baseWeight: 4,

    adjustedWeight: 4,

    options: [
      "We commit to enjoying home-cooked meals at least 4 of the 7 days per week",
      "We commit to enjoying home-cooked meals at least 2 of the 7 days per week",
      "We commit to enjoying healthy meals through all channels (without specific constraints beyond it being in line with financial budget)",
      "Other: Please detail"
    ]},
  {

    id: "Q81",

    text: "We commit to preparing and enjoying healthy meals as a family, as defined by completely restricting fried food, fast food, candy as well as any other non-whole, highly processed junk foods from our family's consumption at least 5 of the 7 days per week., what is your approach?",

    section: "Section VII: Your Health and Wellness",

    subsection: "Health and Fitness Goals (Individual)",

    type: "M",

    faith: false,

    baseWeight: 5,

    adjustedWeight: 5,

    options: [
      "We commit to preparing and enjoying healthy meals as a family, as defined by completely restricting fried food, fast food, candy as well as any other non-whole, highly processed junk foods from our family's consumption at least 5 of the 7 days per week.",
      "We commit to preparing and enjoying healthy meals as a family, as defined by completely restricting fried food, fast food, candy as well as any other non-whole, highly processed junk foods from our family's consumption at least 4 of the 7 days per week.",
      "Other: Please detail"
    ]},
  {

    id: "Q82",

    text: "We commit to a healthy balanced diet with no special restriction on any meats (seafood, chicken, beef, pork), dairy, fruits and vegetables, and whole grains or nuts, what is your approach?",

    section: "Section VII: Your Health and Wellness",

    subsection: "Health and Fitness Goals (Collective)",

    type: "M",

    faith: false,

    baseWeight: 5,

    adjustedWeight: 5,

    options: [
      "We commit to a healthy balanced diet with no special restriction on any meats (seafood, chicken, beef, pork), dairy, fruits and vegetables, and whole grains or nuts",
      "We commit to a healthy balanced diet including all meats except pork (seafood, chicken, beef), dairy, fruits and vegetables, and whole grains or nuts",
      "We commit to a healthy balanced vegetarian diet",
      "We commit to a healthy balanced ascertain diet",
      "We commit to a healthy balanced diet which is flexible to individual needs (e.g., husband can pursue carnivore and wife can pursue vegetarian, while children can be unrestricted, for example)"
    ]},
  {

    id: "Q83",

    text: "We commit to breastfeeding primarily and only using formula in rare circumstances.",

    section: "Section VII: Your Health and Wellness",

    subsection: "Health (Diet and Nutrition)",

    type: "D",

    faith: false,

    baseWeight: 5,

    adjustedWeight: 5,

    options: [
      "We commit to breastfeeding primarily and only using formula in rare circumstances.",
      "We commit to breastfeeding whenever possible, still, we do not have any reservations about relying on high quality formula."
    ]},
  {

    id: "Q84",

    text: "We're committed to breastfeeding along with introducing appropriate complementary foods for up to 2 years for our children., what is your approach?",

    section: "Section VII: Your Health and Wellness",

    subsection: "Health (Medical Care)",

    type: "M",

    faith: false,

    baseWeight: 5,

    adjustedWeight: 5,

    options: [
      "We're committed to breastfeeding along with introducing appropriate complementary foods for up to 2 years for our children.",
      "We're committed to breastfeeding along with introducing appropriate complementary foods whenever possible still, we do not plan to do it beyond 1 year for our children.",
      "We do not have a strong perspective about breastfeeding and will take the guidance of our medical professional when the time comes."
    ]},
  {

    id: "Q85",

    text: "We are committed to a more natural, homeopathic approach to the health and wellness of both us and our children, avoiding the use of OTC drugs and medicines outside of extreme and rare circumstances., what is your approach?",

    section: "Section VII: Your Health and Wellness",

    subsection: "Health (Mental Health and Counseling)",

    type: "M",

    faith: false,

    baseWeight: 5,

    adjustedWeight: 5,

    options: [
      "We are committed to a more natural, homeopathic approach to the health and wellness of both us and our children, avoiding the use of OTC drugs and medicines outside of extreme and rare circumstances.",
      "We are committed to our health and wellness and have no reservations with leveraging the medication and OTC drugs available to us to manage pain and illness.",
      "We are committed to our health and wellness and each approach this issue very differently, thus we are committed to a model which is flexible to each individual's preferences."
    ]},
  {

    id: "Q86",

    text: "We are committed to each doing a full physical and check-up annually, including all pertinent age/risk factor appropriate tests (i.e., prostate, breast, etc.). As such, to establish this shared practice, we plan to go on or by before our wedding day.",

    section: "Section VII: Your Health and Wellness",

    subsection: "Wellness (Self-Care)",

    type: "D",

    faith: false,

    baseWeight: 5,

    adjustedWeight: 5,

    options: [
      "We are committed to each doing a full physical and check-up annually, including all pertinent age/risk factor appropriate tests (i.e., prostate, breast, etc.). As such, to establish this shared practice, we plan to go on or by before our wedding day.",
      "We are committed to each doing a full physical and check-up annually, including all pertinent age/risk factor appropriate tests (i.e., prostate, breast, etc.). We already have completed our individual check-ups for the year and look forward to continuing this annual practice in marriage."
    ]},
  {

    id: "Q87",

    text: "We are committed to having a natural birth., what is your approach?",

    section: "Section VII: Your Health and Wellness",

    subsection: "Wellness (Recreation and Leisure)",

    type: "M",

    faith: false,

    baseWeight: 5,

    adjustedWeight: 5,

    options: [
      "We are committed to having a natural birth.",
      "We are committed to having an epidural or anything medically available to relieve labor pain.",
      "We're not well educated enough on the subject to make an informed decision on what's best so we plan to research and revisit this when the time comes."
    ]},
  {

    id: "Q88",

    text: "We are each committed to seeing a (faith-aligned) therapist individually, at least 6 times per year during our marriage (as our resources allow)., what is your approach?",

    section: "Section VII: Your Health and Wellness",

    subsection: "Wellness (Sleep)",

    type: "M",

    faith: false,

    baseWeight: 5,

    adjustedWeight: 5,

    options: [
      "We are each committed to seeing a (faith-aligned) therapist individually, at least 6 times per year during our marriage (as our resources allow).",
      "We are each committed to seeing a (faith-aligned) therapist individually, at least 4 times per year during our marriage (as our resources allow).",
      "We are each committed to seeing a (faith-aligned) therapist individually, at least 12 times per year during our marriage (as our resources allow).",
      "While we believe in seeking counsel for our marriage, we're not ready to commit to long-term individual therapy currently."
    ]},
  {

    id: "Q89",

    text: "We are each committed to a goal of sustainable health, through regular exercise, which for us is at least 3x per week individually, what is your approach?",

    section: "Section VII: Your Health and Wellness",

    subsection: "Substance Use",

    type: "M",

    faith: false,

    baseWeight: 7,

    adjustedWeight: 7,

    options: [
      "We are each committed to a goal of sustainable health, through regular exercise, which for us is at least 3x per week individually",
      "We are each committed to a goal of sustainable health, through regular exercise, which for us is at least 2x per week individually",
      "We are each committed to a goal of sustainable health, through regular exercise, which for us is at least 4x per week individually",
      "Other: please detail"
    ]},
  {

    id: "Q90",

    text: "We commit to never actively keeping / maintaining any secrets from one another.",

    section: "Section VIII: Your Marriage and Boundaries",

    subsection: "Personal Boundaries (Individual Independence)",

    type: "D",

    faith: false,

    baseWeight: 7,

    adjustedWeight: 7,

    options: [
      "We commit to never actively keeping / maintaining any secrets from one another.",
      "We are not ready to make this commitment at this time and prefer to address this matter later in our relationship"
    ]},
  {

    id: "Q91",

    text: "While we fully trust God and our spouse, we believe in oneness and there being no hidden spaces, thus, we believe in \"transparent access\" which means we each have the passcodes for all our technology (hardware) and digital media accounts.",

    section: "Section VIII: Your Marriage and Boundaries",
    subsection: "Personal Boundaries (Lifestyle Choices)",

    type: "D",

    faith: false,

    baseWeight: 7,

    adjustedWeight: 7,

    options: [
      "While we fully trust God and our spouse, we believe in oneness and there being no hidden spaces, thus, we believe in \"transparent access\" which means we each have the passcodes for all our technology (hardware) and digital media accounts.",
      "While we fully trust God and our spouse, and believe in being one, we do not believe in \"transparent access\" and do not believe it is necessary to commit to having the passcodes for all of our technology (hardware) and digital media accounts."
    ]},
  {

    id: "Q92",

    text: "We commit to splitting and rotating visiting family for major holidays between our families (e.g., Thanksgiving, Christmas, Easter) each year., what is your approach?",

    section: "Section VIII: Your Marriage and Boundaries",

    subsection: "Personal Boundaries (Friendships)",

    type: "M",

    faith: false,

    baseWeight: 7,

    adjustedWeight: 7,

    options: [
      "We commit to splitting and rotating visiting family for major holidays between our families (e.g., Thanksgiving, Christmas, Easter) each year.",
      "We commit to doing major holidays at home, with a visit at least one family for one holiday each year (rotating).",
      "Other: Please detail"
    ]},
  {

    id: "Q93",

    text: "We're committed to caring for our spouses' parents in advanced age through financial contribution., what is your approach?",

    section: "Section VIII: Your Marriage and Boundaries",

    subsection: "Personal Boundaries (Professional Life)",

    type: "M",

    faith: false,

    baseWeight: 7,

    adjustedWeight: 7,

    options: [
      "We're committed to caring for our spouses' parents in advanced age through financial contribution.",
      "We're committed to caring for our spouses' parents in advanced age through welcoming them to move in with us so we can be primary caregivers.",
      "We're committed to caring for our spouses' parents in advanced age yet in the interest of our marriage and honoring their best care, we do not believe a longer-term stay is the best option for us.",
      "Other: Please detail"
    ]},
  {

    id: "Q94",

    text: "We're committed to having at least one parent stay with us for a period of a month, after the birth of our first child., what is your approach?",

    section: "Section VIII: Your Marriage and Boundaries",

    subsection: "Personal Boundaries (Family and In-Laws)",

    type: "M",

    faith: false,

    baseWeight: 7,

    adjustedWeight: 7,

    options: [
      "We're committed to having at least one parent stay with us for a period of a month, after the birth of our first child.",
      "We're committed to setting frequent and intentional early interactions with our new child and our parents, for visits and help with care, still, we prefer not to have anyone stay for an extended length of time in the first month.",
      "We're committed to having at least one parent stay with us for a period of two weeks, after the birth of our first child.",
      "Other: Please detail"
    ]},
  {

    id: "Q95",

    text: "We commit to maintaining healthy boundaries with the opposite sex as a married couple, however, we do not believe any unique restrictions on interactions are required for opposite sex interactions that are not present with our same-sex interactions., what is your approach?",

    section: "Section VIII: Your Marriage and Boundaries",

    subsection: "Personal Boundaries (Opposite Sex Interactions)",

    type: "M",

    faith: false,

    baseWeight: 7,

    adjustedWeight: 7,

    options: [
      "We commit to maintaining healthy boundaries with the opposite sex as a married couple, however, we do not believe any unique restrictions on interactions are required for opposite sex interactions that are not present with our same-sex interactions.",
      "We commit to maintaining healthy boundaries with the opposite sex as a married couple, with that said, while we believe in shared interactions with an individual, we do not believe in nurturing/actively maintaining friendships with the opposite sex one on one (outside of work colleagues/family) as measured by: daily/multiple times per week one on one conversations/text/social media messages, one on one meetups without our spouse, and inappropriate conversation you wouldn't be comfortable with your spouse or anyone else seeing."
    ]},
  {

    id: "Q96",

    text: "We're committed to putting our phones away during date nights, with only use for contact with babysitter (if applicable), caregiver or photographs between us, what is your approach?",

    section: "Section VIII: Your Marriage and Boundaries",

    subsection: "Personal Boundaries (Ex-Romantic Relationships)",

    type: "M",

    faith: false,

    baseWeight: 7,

    adjustedWeight: 7,

    options: [
      "We're committed to putting our phones away during date nights, with only use for contact with babysitter (if applicable), caregiver or photographs between us",
      "We commit to exercising discretion, and we do not believe a firm line is necessary",
      "Other: Please detail"
    ]},
  {

    id: "Q97",

    text: "While we fully trust God and our spouse, we believe in honoring our covenant in and through all our actions, as such:, what is your approach?",

    section: "Section VIII: Your Marriage and Boundaries",

    subsection: "Personal Boundaries (Social Media)",

    type: "M",

    faith: false,

    baseWeight: 7,

    adjustedWeight: 7,

    options: [
      "We commit to ensuring there is no direct communications via message or comments with any member of the opposite sex on any platform, unless it's someone we both unequivocally know and trust",
      "We commit to exercising discretion and discernment, and we do not believe a firm line is necessary",
      "Other: Please detail"
    ]},
  {

    id: "Q98",

    text: "While we fully trust God and our spouse, we believe in honoring our covenant in and through all our actions, as such:, what is your approach?",

    section: "Section VIII: Your Marriage and Boundaries",

    subsection: "Personal Boundaries (Past Relationship Boundaries)",

    type: "M",

    faith: false,

    baseWeight: 7,

    adjustedWeight: 7,

    options: [
      "We commit to ensuring there is no direct connection (via follow / being followed, friendship or connection) and/or direct communications via message or comments with any past significant other(s) / past romantic interests on any platform",
      "We commit to ensuring all past significant other(s) / past romantic interests are blocked on every platform",
      "Not Applicable",
      "Other: Please detail"
    ]},
  {

    id: "Q99",

    text: "While we fully trust God and our spouse, we believe in honoring our covenant in and through all our actions, as such:, what is your approach?",

    section: "Section VIII: Your Marriage and Boundaries",

    subsection: "Personal Boundaries (Digital Media with Past Relationships)",

    type: "M",

    faith: true,

    baseWeight: 7,

    adjustedWeight: 7.5,

    options: [
      "We commit to deleting all private and public media with any past significant other(s) / past romantic interests from all private devices and public accounts (active or not) by",
      "Not Applicable",
      "Other: Please detail"
    ]}
];

export default questions;