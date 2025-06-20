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
  { id: "foundation", name: "Your Foundation", questions: 9 },
  { id: "faith", name: "Your Faith Life", questions: 3 },
  { id: "marriage", name: "Your Marriage Life", questions: 31 },
  { id: "parenting", name: "Your Parenting Life", questions: 6 },
  { id: "family", name: "Your Family/Home Life", questions: 17 },
  { id: "financial", name: "Your Financial Life", questions: 9 },
  { id: "social", name: "Your Social Life", questions: 6 },
  { id: "health", name: "Your Health & Wellness Life", questions: 9 },
  { id: "professional", name: "Your Professional Life", questions: 9 }
];

// AUTHENTIC QUESTIONS FROM LAWRENCE ADJAH'S BOOK - DO NOT MODIFY
export const questions: Question[] = [
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
  },
  {
    id: 10,
    section: "Your Faith Life",
    subsection: "Worship Life: Marriage (Husband and Wife)",
    type: "M",
    text: "We commit to prayer as a couple, how often?",
    options: [
      "We commit to daily prayer as a couple before we go to sleep",
      "We commit to weekly prayer as a couple (during designated check-in time)",
      "Other: Please detail [input]"
    ],
    weight: 4
  },
  {
    id: 11,
    section: "Your Faith Life",
    subsection: "Worship Life: Family",
    type: "M",
    text: "We commit to family worship weekly, including what activities?",
    options: [
      "We commit to family worship weekly, including a dedicated time for prayer and reflection as a family weekly, familial prayer over meals, and weekly corporate worship in a local faith community where we are members",
      "We commit to family worship weekly, including familial prayer over meals, and weekly corporate worship in a local faith community where we are members",
      "We commit to family worship weekly, including familial prayer over meals, and weekly corporate worship in a local/remote faith community where we are members",
      "Other: Please detail [input]"
    ],
    weight: 5
  },
  {
    id: 12,
    section: "Your Faith Life",
    subsection: "Worship Life: Serving",
    type: "M",
    text: "We commit to each volunteering/serving in our faith community, what is your approach?",
    options: [
      "We commit to each volunteering/serving in our faith community in some capacity in every season",
      "We commit to each volunteering/serving in our faith community in some capacity at least one season/event per year",
      "We commit to each volunteering/serving flexibly inside (and outside of) our faith community based on our capacity, but at a minimum, we'll always be serving our faith community through our giving in every season",
      "We commit to each volunteering/serving flexibly inside (and outside of) our faith community based on our capacity"
    ],
    weight: 4
  },
  {
    id: 13,
    section: "Your Marriage Life",
    subsection: "Order of Priority before God",
    type: "D",
    text: "We understand and accept the order of relationship priority according to God's highest design is first, our relationship with God; then, our relationship with our Spouse (see: \"forsake all others\"), then, our relationship with our children (if applicable), then everything and everyone else (including work, friends, family).",
    options: [
      "We understand and accept the order of relationship priority according to God's highest design is first, our relationship with God; then, our relationship with our Spouse (see: \"forsake all others\"), then, our relationship with our children (if applicable), then everything and everyone else (including work, friends, family)"
    ],
    weight: 6
  },
  {
    id: 14,
    section: "Your Marriage Life",
    subsection: "Family Name",
    type: "M",
    text: "We commit to sharing a last name in marriage, what is your approach?",
    options: [
      "We commit to sharing the same last name in marriage and for the wife to take the husband's last name",
      "We commit to each keeping our own last names in marriage",
      "We commit to the wife hyphenating her last name with her husband's last name in marriage"
    ],
    weight: 3
  },
  {
    id: 15,
    section: "Your Marriage Life",
    subsection: "Relationship Model (Work / Home Life)",
    type: "M",
    text: "We commit to a marriage model for work and home life, what is your approach?",
    options: [
      "We commit to a marriage model where we agree to both work full-time for as long as we both can consistently honor our commitments to God, our spouse and our children (if applicable)",
      "We commit to a marriage model where we agree the husband is the primary provider and works full-time and the wife stays at home as full-time housewife/homemaker",
      "We commit to a marriage model where we agree to both work full-time until we have children and then we will transition to a model where the wife stays at home for an extended period (beyond standard parental leave) until the children reach age [input]",
      "We commit to a marriage model where we agree to both work full-time until we have children and then we will transition to a model where the wife stays at home indefinitely as full-time housewife/homemaker"
    ],
    weight: 4
  },
  {
    id: 16,
    section: "Your Marriage Life",
    subsection: "Relationship Model (Work / Family Life Boundaries - Travel)",
    type: "M",
    text: "We commit to a marriage/work model regarding travel, what is your approach?",
    options: [
      "We commit to a marriage/work model where we agree to never be away from one another for more than a 7-day period, regardless of the commitment/project scope. If necessary, we will set a \"Come to me or I'll come to you\" plan in order to honor this expectation",
      "We commit to a marriage/work model where we agree to never be away from one another for more than a 10-day period, regardless of the commitment/project scope. If necessary, we will set a \"Come to me or I'll come to you\" plan in order to honor this expectation",
      "We commit to a marriage/work model where we agree to never be away from one another for more than a 3-day period, regardless of the commitment/project scope. If necessary, we will set a \"Come to me or I'll come to you\" plan in order to honor this expectation",
      "Other: Please detail [input]"
    ],
    weight: 4
  },
  {
    id: 17,
    section: "Your Marriage Life",
    subsection: "Relationship Model (Work / Family Life Boundaries – Work Down Time)",
    type: "M",
    text: "We commit to a marriage/work model regarding work down time, what is your approach?",
    options: [
      "We commit to a marriage/work model where we agree to have a guarded period of at least 2 hours daily where it's our time to connect directly (not including children), and no work is to be done. Our preliminary guarded time is [input] (am/pm)",
      "We commit to a marriage/work model where we agree to have a guarded period of at least 1.5 hours daily where it's our time to connect directly (not including children), and no work is to be done. Our preliminary guarded time is [input] (am/pm)",
      "We commit to a marriage/work model where we agree to have a guarded period of at least 1 hour daily where it's our time to connect directly (not including children), and no work is to be done. Our preliminary guarded time is [input] (am/pm)",
      "Other: Please detail [input]"
    ],
    weight: 4
  },
  {
    id: 18,
    section: "Your Marriage Life",
    subsection: "Relationship Model (Work / Family Life Boundaries – Late Night Work)",
    type: "M",
    text: "We commit to a marriage/work model regarding late night work, what is your approach?",
    options: [
      "We commit to a marriage/work model where we agree to have no more than 1 late work night per week (defined as work after 8pm)",
      "We commit to a marriage/work model where we agree to have no more than 2 late work nights per week (defined as work after 8pm)",
      "We commit to a marriage/work model where we agree to have no more than 3 late work nights per week (defined as work after 8pm)",
      "Other: Please detail [input]"
    ],
    weight: 4
  },
  {
    id: 19,
    section: "Your Marriage Life",
    subsection: "Communication & Conflict Resolution",
    type: "D",
    text: "We commit to not fighting or having serious arguments in front of others, rather, we'd wait for time alone and away from company, either in our check-in time or immediately after to discuss things away from them.",
    options: [
      "We commit to not fighting or having serious arguments in front of others, rather, we'd wait for time alone and away from company, either in our check-in time or immediately after to discuss things away from them"
    ],
    weight: 6
  },
  {
    id: 20,
    section: "Your Marriage Life",
    subsection: "Communication & Conflict Resolution (Discuss with others)",
    type: "D",
    text: "We commit to never discussing conflict/issues in our marriage with anyone, before (1) addressing the issue with our spouse and (2) mutually agreeing to seek approved counsel on the issue.",
    options: [
      "We commit to never discussing conflict/issues in our marriage with anyone, before (1) addressing the issue with our spouse and (2) mutually agreeing to seek approved counsel on the issue"
    ],
    weight: 10
  },
  {
    id: 21,
    section: "Your Marriage Life",
    subsection: "Communication & Conflict Resolution (24 hours)",
    type: "D",
    text: "We commit to not going more than 24 hours without speaking with one another under any circumstances.",
    options: [
      "We commit to not going more than 24 hours without speaking with one another under any circumstances"
    ],
    weight: 5
  },
  {
    id: 22,
    section: "Your Marriage Life",
    subsection: "Communication & Conflict Resolution (Text)",
    type: "D",
    text: "We commit to not discussing serious issues/conflicts/debates via text message. Rather, we'll always discuss them in person or in a live conversation on a phone given the importance of conveying the proper tone and honoring wise boundaries for the marriage.",
    options: [
      "We commit to not discussing serious issues/conflicts/debates via text message. Rather, we'll always discuss them in person or in a live conversation on a phone given the importance of conveying the proper tone and honoring wise boundaries for the marriage"
    ],
    weight: 3
  },
  {
    id: 23,
    section: "Your Marriage Life",
    subsection: "Communication & Conflict Resolution (Sleep angry)",
    type: "D",
    text: "We commit to not going to sleep while still angry with one another [not to be confused with resolving the issue, but committing to find common ground to discuss further, prayer and then coming together as one].",
    options: [
      "We commit to not going to sleep while still angry with one another [not to be confused with resolving the issue, but committing to find common ground to discuss further, prayer and then coming together as one]"
    ],
    weight: 3
  },
  {
    id: 24,
    section: "Your Marriage Life",
    subsection: "Communication & Conflict Resolution (Same bed)",
    type: "D",
    text: "We commit to always sleeping together in the same bed, no matter the issue.",
    options: [
      "We commit to always sleeping together in the same bed, no matter the issue"
    ],
    weight: 3
  },
  {
    id: 25,
    section: "Your Marriage Life",
    subsection: "Communication & Conflict Resolution (Sex as weapon)",
    type: "D",
    text: "We commit to never using sex as a weapon by withholding it due to conflict [Unless mutually acknowledged and agreed due to medical considerations, prayer and/or fasting].",
    options: [
      "We commit to never using sex as a weapon by withholding it due to conflict [Unless mutually acknowledged and agreed due to medical considerations, prayer and/or fasting]"
    ],
    weight: 5
  },
  {
    id: 26,
    section: "Your Marriage Life",
    subsection: "Communication & Conflict Resolution (Silence as weapon)",
    type: "D",
    text: "We commit to never using silence as a weapon by withholding presence or communication due to conflict [Unless mutually acknowledged and agreed for a set amount of time for prayer and reflection].",
    options: [
      "We commit to never using silence as a weapon by withholding presence or communication due to conflict [Unless mutually acknowledged and agreed for a set amount of time for prayer and reflection]"
    ],
    weight: 5
  },
  {
    id: 27,
    section: "Your Marriage Life",
    subsection: "Communication & Conflict Resolution: Counseling",
    type: "M",
    text: "We commit to a minimum of counseling sessions for our marriage, what is your approach?",
    options: [
      "Monthly counseling sessions for the first year of our marriage, with a minimum of bi-monthly in year 2 and a minimum of quarterly in years 3+",
      "Bi-weekly counseling sessions for the first year of our marriage, with a minimum of monthly in year 2 and a minimum of quarterly in years 3+",
      "Other: Please detail"
    ],
    weight: 3
  },
  {
    id: 28,
    section: "Your Marriage Life",
    subsection: "Decision Making",
    type: "D",
    text: "We commit to honoring the husband as the head and the final decision-making authority on all decisions, with trust in his submission to God and prayerful consideration of his wife's and family's interests.",
    options: [
      "We commit to honoring the husband as the head and the final decision-making authority on all decisions, with trust in his submission to God and prayerful consideration of his wife's and family's interests"
    ],
    weight: 5
  },
  {
    id: 29,
    section: "Your Marriage Life",
    subsection: "Dedicated Time (Fellowship)",
    type: "M",
    text: "We commit to a date night schedule, how often?",
    options: [
      "Weekly date night on [fill-in]",
      "Bi-weekly date night on [fill-in]"
    ],
    weight: 7
  },
  {
    id: 30,
    section: "Your Marriage Life",
    subsection: "Marriage: Dedicated Time",
    type: "M",
    text: "We commit to having a weekly check-in, when?",
    options: [
      "Weekly check-in on [fill-in] at [fill-in]"
    ],
    weight: 5
  }
];