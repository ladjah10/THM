/**
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
    id: 1,
    section: "Section I: Your Foundation",
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
    section: "Section I: Your Foundation",
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
    section: "Section I: Your Foundation",
    subsection: "Marriage & Your Children's Faith Journey",
    type: "D",
    text: "We believe we have a responsibility to raise our children according to the Christian faith, intentionally teaching them and raising them according to its expectations while leaving space for them to develop their own personal relationship with Jesus Christ and hopefully make a decision to give their life to Jesus Christ.",
    options: [
      "We believe we have a responsibility to raise our children according to the Christian faith, intentionally teaching them and raising them according to its expectations while leaving space for them to develop their own personal relationship with Jesus Christ and hopefully make a decision to give their life to Jesus Christ",
      "We do not believe we have a responsibility to raise our children according to any specific faith tradition and prefer to let them choose their own spiritual path when they're old enough to decide"
    ],
    weight: 6
  },
  {
    id: 4,
    section: "Section I: Your Foundation",
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
    section: "Section I: Your Foundation",
    subsection: "Marriage Preparation: Legal (Incapacitation)",
    type: "D",
    text: "We're committed to preparing in advance of our marriage to ensuring we are each well cared for in the undesired, unfortunate and rare case of incapacitating illness and or premature death, as such, we are each committed to establishing our spouse as Power of Attorney before our marriage date on or by this date [input].",
    options: [
      "We're committed to preparing in advance of our marriage to ensuring we are each well cared for in the undesired, unfortunate and rare case of incapacitating illness and or premature death, as such, we are each committed to establishing our spouse as Power of Attorney before our marriage date on or by this date [input]",
      "We do not believe it's necessary to establish Power of Attorney before marriage and prefer to address this matter later if and when it becomes relevant"
    ],
    weight: 4
  },
  {
    id: 6,
    section: "Section I: Your Foundation",
    subsection: "Marriage Preparation: Legal (Estate)",
    type: "D",
    text: "We're committed to preparing in advance of our marriage to ensuring we are each well cared for in the undesired, unfortunate and rare case of incapacitating illness and or premature death, as such, we are each committed to completing a notarized copy of our will before our marriage date on or by this date [input].",
    options: [
      "We're committed to preparing in advance of our marriage to ensuring we are each well cared for in the undesired, unfortunate and rare case of incapacitating illness and or premature death, as such, we are each committed to completing a notarized copy of our will before our marriage date on or by this date [input]",
      "We do not believe creating a will is necessary before marriage and prefer to address estate planning at a later stage in our relationship"
    ],
    weight: 4
  },
  {
    id: 7,
    section: "Section I: Your Foundation",
    subsection: "Marriage Mindset: Divorce",
    type: "D",
    text: "We are committed to a lifelong marriage and do not see divorce as an exercisable option for any reasons outside of biblical (adultery & abandonment) or personal safety grounds (physical abuse and professionally evaluated and validated, psychological harm), including but not limited to: Unhappiness, \"Falling Out of Love\", \"Growing Apart\", \"Irreconcilable Differences\".",
    options: [
      "We are committed to a lifelong marriage and do not see divorce as an exercisable option for any reasons outside of biblical (adultery & abandonment) or personal safety grounds (physical abuse and professionally evaluated and validated, psychological harm), including but not limited to: Unhappiness, \"Falling Out of Love\", \"Growing Apart\", \"Irreconcilable Differences\"",
      "We believe that while marriage is intended to be lifelong, divorce may be a reasonable option in circumstances beyond biblical grounds if the relationship becomes irreconcilably damaged"
    ],
    weight: 8
  },
  {
    id: 8,
    section: "Section I: Your Foundation",
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
    section: "Section I: Your Foundation",
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
      "We understand and accept the order of relationship priority according to God's highest design is first, our relationship with God; then, our relationship with our Spouse (see: \"forsake all others\"), then, our relationship with our children (if applicable), then everything and everyone else (including work, friends, family)",
      "We prefer a different order of priorities or need to discuss what priority structure works best for our unique situation"
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
      "We commit to not fighting or having serious arguments in front of others, rather, we'd wait for time alone and away from company, either in our check-in time or immediately after to discuss things away from them",
      "We believe it's acceptable to address conflicts immediately even in front of others if the situation requires it"
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
      "We commit to never discussing conflict/issues in our marriage with anyone, before (1) addressing the issue with our spouse and (2) mutually agreeing to seek approved counsel on the issue",
      "We believe it's sometimes necessary to seek advice from trusted friends or family before addressing issues with our spouse"
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
      "We commit to not going more than 24 hours without speaking with one another under any circumstances",
      "We believe sometimes space and silence for more than 24 hours can be healthy for processing and reflection"
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
      "We commit to not discussing serious issues/conflicts/debates via text message. Rather, we'll always discuss them in person or in a live conversation on a phone given the importance of conveying the proper tone and honoring wise boundaries for the marriage",
      "We believe text messages can be an appropriate way to communicate about serious issues when in-person conversation isn't possible"
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
      "We commit to not going to sleep while still angry with one another [not to be confused with resolving the issue, but committing to find common ground to discuss further, prayer and then coming together as one]",
      "We believe sometimes going to sleep while still processing emotions is healthier than forcing resolution before we're ready"
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
      "We commit to always sleeping together in the same bed, no matter the issue",
      "We believe sometimes sleeping separately can be beneficial for health, space, or conflict resolution purposes"
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
      "We commit to never using sex as a weapon by withholding it due to conflict [Unless mutually acknowledged and agreed due to medical considerations, prayer and/or fasting]",
      "We believe physical intimacy naturally fluctuates during conflicts and shouldn't be forced during unresolved tensions"
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
      "We commit to never using silence as a weapon by withholding presence or communication due to conflict [Unless mutually acknowledged and agreed for a set amount of time for prayer and reflection]",
      "We believe temporary periods of silence can be healthy for processing emotions and preventing harmful words"
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
      "We commit to honoring the husband as the head and the final decision-making authority on all decisions, with trust in his submission to God and prayerful consideration of his wife's and family's interests",
      "We believe in more egalitarian decision-making where both spouses have equal authority in different areas or all major decisions"
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
      "Sunday evening after dinner",
      "Saturday morning with coffee",
      "Wednesday evening mid-week",
      "Other: Please specify your preferred time"
    ],
    weight: 5
  },
  {
    id: 31,
    section: "Your Marriage Life",
    subsection: "Intimacy: Date Night Planning",
    type: "M",
    text: "We commit to regular date nights with intentional planning, how do you approach this?",
    options: [
      "We plan date nights in advance with specific activities and venues",
      "We keep date nights spontaneous and flexible",
      "We alternate planning responsibilities between us",
      "Other: Please detail"
    ],
    weight: 4
  },
  {
    id: 32,
    section: "Your Marriage Life",
    subsection: "Intimacy: Physical Affection",
    type: "D",
    text: "We commit to regular physical affection and intimacy as an essential part of our marriage covenant.",
    options: [
      "We commit to regular physical affection and intimacy as an essential part of our marriage covenant",
      "We prefer a more flexible approach to physical affection that allows for natural fluctuations and individual preferences"
    ],
    weight: 6
  },
  {
    id: 33,
    section: "Your Marriage Life",
    subsection: "Intimacy: Sexual Expectations",
    type: "M",
    text: "We commit to open communication about our sexual relationship, what is your approach?",
    options: [
      "Regular discussion about needs and preferences",
      "Addressing issues as they arise",
      "Seeking professional counsel when needed",
      "All of the above"
    ],
    weight: 8
  },
  {
    id: 34,
    section: "Your Marriage Life",
    subsection: "Financial Management: Joint Accounts",
    type: "M",
    text: "We commit to managing our finances together, what is your approach to banking?",
    options: [
      "All joint accounts with shared access",
      "Joint accounts with individual allowances",
      "Separate accounts with shared expenses account",
      "Other: Please detail"
    ],
    weight: 6
  },
  {
    id: 35,
    section: "Your Marriage Life",
    subsection: "Financial Management: Major Purchases",
    type: "M",
    text: "We commit to mutual agreement on major financial decisions, what threshold requires discussion?",
    options: [
      "Any purchase over $100",
      "Any purchase over $500",
      "Any purchase over $1,000",
      "Any purchase over $2,500"
    ],
    weight: 8
  },
  {
    id: 36,
    section: "Your Marriage Life",
    subsection: "Financial Management: Debt",
    type: "D",
    text: "We commit to transparency about all existing debts and working together to eliminate them systematically.",
    options: [
      "We commit to transparency about all existing debts and working together to eliminate them systematically",
      "We prefer to maintain some financial privacy and handle individual debts separately while sharing household expenses"
    ],
    weight: 10
  },
  {
    id: 37,
    section: "Your Marriage Life",
    subsection: "Financial Management: Budgeting",
    type: "M",
    text: "We commit to creating and maintaining a household budget, how often will you review it?",
    options: [
      "Weekly budget reviews",
      "Monthly budget reviews",
      "Quarterly budget reviews",
      "As needed"
    ],
    weight: 6
  },
  {
    id: 38,
    section: "Your Marriage Life",
    subsection: "Financial Management: Savings Goals",
    type: "M",
    text: "We commit to establishing and working toward shared financial goals, what is your priority?",
    options: [
      "Emergency fund (6 months expenses)",
      "Home ownership down payment",
      "Retirement savings",
      "Children's education fund"
    ],
    weight: 4
  },
  {
    id: 39,
    section: "Your Marriage Life",
    subsection: "Career & Work: Balance",
    type: "M",
    text: "We commit to supporting each other's career goals while prioritizing our marriage, what is your approach?",
    options: [
      "Marriage always takes priority over career advancement",
      "Career and marriage require equal attention and balance",
      "Career advancement is necessary to support our marriage",
      "Other: Please detail"
    ],
    weight: 8
  },
  {
    id: 40,
    section: "Your Marriage Life",
    subsection: "Career & Work: Travel",
    type: "M",
    text: "We commit to managing work-related travel in a way that honors our marriage, what are your boundaries?",
    options: [
      "No overnight work travel without spouse approval",
      "Limited work travel with advance notice and planning",
      "Work travel as needed with regular communication",
      "Other: Please detail"
    ],
    weight: 6
  },
  {
    id: 41,
    section: "Your Marriage Life",
    subsection: "Household Management: Chores",
    type: "M",
    text: "We commit to sharing household responsibilities fairly, how will you divide tasks?",
    options: [
      "Traditional gender-based division of labor",
      "Equal sharing of all household tasks",
      "Division based on individual preferences and schedules",
      "Other: Please detail"
    ],
    weight: 4
  },
  {
    id: 42,
    section: "Your Marriage Life",
    subsection: "Household Management: Cooking",
    type: "M",
    text: "We commit to sharing meal preparation and planning, what is your approach?",
    options: [
      "One person primarily responsible for cooking",
      "Alternating cooking responsibilities",
      "Cooking together as a team",
      "Other: Please detail"
    ],
    weight: 3
  },
  {
    id: 43,
    section: "Your Marriage Life",
    subsection: "Extended Family: Boundaries",
    type: "D",
    text: "We commit to establishing healthy boundaries with extended family while honoring our parents.",
    options: [
      "We commit to establishing healthy boundaries with extended family while honoring our parents",
      "We prefer to maintain closer family relationships even if it requires more involvement from extended family in our marriage decisions"
    ],
    weight: 8
  },
  {
    id: 44,
    section: "Your Marriage Life",
    subsection: "Extended Family: Holidays",
    type: "M",
    text: "We commit to managing holiday celebrations in a way that honors both families, what is your approach?",
    options: [
      "Alternate holidays between families each year",
      "Split time during each holiday season",
      "Create new traditions as our own family unit",
      "Other: Please detail"
    ],
    weight: 4
  },
  {
    id: 45,
    section: "Your Marriage Life",
    subsection: "Extended Family: Living Arrangements",
    type: "M",
    text: "We commit to maintaining independence while supporting extended family, what are your boundaries?",
    options: [
      "Extended family welcome to visit but not live with us",
      "Extended family welcome for extended stays in emergencies",
      "Open to extended family living arrangements if needed",
      "Other: Please detail"
    ],
    weight: 6
  },
  {
    id: 46,
    section: "Your Future Together",
    subsection: "Children: Timing",
    type: "M",
    text: "We have discussed and agreed on our timeline for having children, what is your preference?",
    options: [
      "Children within the first year of marriage",
      "Children within 2-3 years of marriage",
      "Children when financially and emotionally ready",
      "We are undecided and need more discussion"
    ],
    weight: 10
  },
  {
    id: 47,
    section: "Your Future Together",
    subsection: "Children: Number",
    type: "M",
    text: "We have discussed and agreed on the number of children we hope to have, what is your preference?",
    options: [
      "1-2 children",
      "3-4 children",
      "5 or more children",
      "As many as God blesses us with"
    ],
    weight: 8
  },
  {
    id: 48,
    section: "Your Future Together",
    subsection: "Children: Discipline",
    type: "M",
    text: "We commit to consistent parenting and discipline approaches, what is your philosophy?",
    options: [
      "Biblical discipline with love and correction",
      "Positive reinforcement with natural consequences",
      "Balanced approach combining multiple methods",
      "We need to discuss this further"
    ],
    weight: 6
  },
  {
    id: 49,
    section: "Your Future Together",
    subsection: "Children: Education",
    type: "M",
    text: "We have discussed our preferences for our children's education, what is your approach?",
    options: [
      "Christian private school education",
      "Homeschooling with Christian curriculum",
      "Public school with strong family values reinforcement",
      "Other: Please detail"
    ],
    weight: 4
  },
  {
    id: 50,
    section: "Your Future Together",
    subsection: "Housing: Ownership",
    type: "M",
    text: "We have discussed our housing goals and timeline, what is your priority?",
    options: [
      "Home ownership within 2 years",
      "Home ownership within 5 years",
      "Rent until circumstances are optimal for buying",
      "Other: Please detail"
    ],
    weight: 3
  },
  {
    id: 51,
    section: "Your Future Together",
    subsection: "Housing: Location",
    type: "M",
    text: "We have discussed our preferred living location and community, what is your priority?",
    options: [
      "Close to extended family",
      "Strong Christian community",
      "Good schools and family amenities",
      "Career opportunities and growth"
    ],
    weight: 4
  },
  {
    id: 52,
    section: "Your Future Together",
    subsection: "Health & Wellness: Lifestyle",
    type: "M",
    text: "We commit to maintaining healthy lifestyles together, what is your approach?",
    options: [
      "Regular exercise and healthy eating together",
      "Supporting each other's individual health goals",
      "Preventive healthcare and regular checkups",
      "All of the above"
    ],
    weight: 3
  },
  {
    id: 53,
    section: "Your Future Together",
    subsection: "Health & Wellness: Mental Health",
    type: "D",
    text: "We commit to supporting each other's mental and emotional wellbeing, including seeking professional help when needed.",
    options: [
      "We commit to supporting each other's mental and emotional wellbeing, including seeking professional help when needed",
      "We prefer to handle mental and emotional challenges independently or seek individual professional help rather than couples-focused support"
    ],
    weight: 5
  },
  {
    id: 54,
    section: "Your Future Together",
    subsection: "Ministry & Service: Together",
    type: "M",
    text: "We commit to serving together in ministry and community service, what is your preference?",
    options: [
      "Active leadership roles in church ministry",
      "Regular volunteer service in community",
      "Supporting missions and charitable causes",
      "Other: Please detail"
    ],
    weight: 4
  },
  {
    id: 55,
    section: "Your Future Together",
    subsection: "Ministry & Service: Individual",
    type: "D",
    text: "We commit to supporting each other's individual ministry callings and service opportunities.",
    options: [
      "We commit to supporting each other's individual ministry callings and service opportunities",
      "We prefer to pursue our individual ministry callings independently without requiring spousal involvement or support"
    ],
    weight: 3
  },
  {
    id: 56,
    section: "Your Future Together",
    subsection: "Retirement: Planning",
    type: "M",
    text: "We commit to planning for our retirement together, what is your approach?",
    options: [
      "Traditional retirement savings and investments",
      "Real estate and property investments",
      "Business ownership and passive income",
      "Other: Please detail"
    ],
    weight: 3
  },
  {
    id: 57,
    section: "Your Future Together",
    subsection: "Retirement: Lifestyle",
    type: "M",
    text: "We have discussed our vision for retirement lifestyle, what is your preference?",
    options: [
      "Travel and new experiences together",
      "Settled life near family and community",
      "Continued ministry and service work",
      "Other: Please detail"
    ],
    weight: 2
  },
  {
    id: 58,
    section: "Personal Growth",
    subsection: "Individual Development: Education",
    type: "D",
    text: "We commit to supporting each other's continued learning and personal development throughout our marriage.",
    options: [
      "We commit to supporting each other's continued learning and personal development throughout our marriage",
      "We prefer to pursue individual learning and development independently without requiring spousal support or involvement"
    ],
    weight: 4
  },
  {
    id: 59,
    section: "Personal Growth",
    subsection: "Individual Development: Hobbies",
    type: "D",
    text: "We commit to encouraging each other's individual interests and hobbies while maintaining priority on our relationship.",
    options: [
      "We commit to encouraging each other's individual interests and hobbies while maintaining priority on our relationship",
      "We believe individual interests and hobbies should be completely separate from our relationship and not require spousal encouragement"
    ],
    weight: 3
  },
  {
    id: 60,
    section: "Personal Growth",
    subsection: "Spiritual Growth: Individual",
    type: "M",
    text: "We commit to individual spiritual growth and development, what is your approach?",
    options: [
      "Daily personal Bible study and prayer",
      "Regular participation in Bible study groups",
      "Spiritual mentorship and accountability",
      "All of the above"
    ],
    weight: 6
  },
  {
    id: 61,
    section: "Personal Growth",
    subsection: "Spiritual Growth: Together",
    type: "M",
    text: "We commit to growing spiritually together as a couple, what is your priority?",
    options: [
      "Regular couples devotion and Bible study",
      "Attending conferences and retreats together",
      "Serving together in ministry",
      "All of the above"
    ],
    weight: 8
  },
  {
    id: 62,
    section: "Personal Growth",
    subsection: "Character Development: Accountability",
    type: "D",
    text: "We commit to holding each other accountable for character growth and spiritual maturity with love and grace.",
    options: [
      "We commit to holding each other accountable for character growth and spiritual maturity with love and grace",
      "We prefer to grow in character independently and don't believe spouses should hold each other accountable for personal development"
    ],
    weight: 6
  },
  {
    id: 63,
    section: "Personal Growth",
    subsection: "Character Development: Forgiveness",
    type: "D",
    text: "We commit to practicing forgiveness quickly and completely, not holding grudges or keeping record of wrongs.",
    options: [
      "We commit to practicing forgiveness quickly and completely, not holding grudges or keeping record of wrongs",
      "We believe some wrongs should be remembered and that complete forgiveness isn't always possible or healthy"
    ],
    weight: 8
  },
  {
    id: 64,
    section: "Relationship Dynamics",
    subsection: "Love Languages: Understanding",
    type: "M",
    text: "We have identified and discussed our love languages, what is most important to you?",
    options: [
      "Words of affirmation and encouragement",
      "Quality time and undivided attention",
      "Physical touch and affection",
      "Acts of service and helpfulness"
    ],
    weight: 5
  },
  {
    id: 65,
    section: "Relationship Dynamics",
    subsection: "Love Languages: Expression",
    type: "D",
    text: "We commit to regularly expressing love in ways that are meaningful to our spouse, even if they differ from our own preferences.",
    options: [
      "We commit to regularly expressing love in ways that are meaningful to our spouse, even if they differ from our own preferences",
      "We believe each person should express love in their natural way rather than adapting to their spouse's preferences"
    ],
    weight: 6
  },
  {
    id: 66,
    section: "Relationship Dynamics",
    subsection: "Personality Types: Understanding",
    type: "D",
    text: "We commit to understanding and appreciating our different personality types and working styles.",
    options: [
      "We commit to understanding and appreciating our different personality types and working styles",
      "We believe personality differences are barriers to overcome rather than differences to appreciate and understand"
    ],
    weight: 4
  },
  {
    id: 67,
    section: "Relationship Dynamics",
    subsection: "Personality Types: Adaptation",
    type: "D",
    text: "We commit to adapting our communication and interaction styles to work better with our spouse's personality.",
    options: [
      "We commit to adapting our communication and interaction styles to work better with our spouse's personality",
      "We believe people should maintain their natural communication style rather than adapting to their spouse's personality"
    ],
    weight: 5
  },
  {
    id: 68,
    section: "Relationship Dynamics",
    subsection: "Friendship: Priority",
    type: "D",
    text: "We commit to maintaining and deepening our friendship as the foundation of our romantic relationship.",
    options: [
      "We commit to maintaining and deepening our friendship as the foundation of our romantic relationship",
      "We believe romantic love is more important than friendship as the foundation of marriage"
    ],
    weight: 7
  },
  {
    id: 69,
    section: "Relationship Dynamics",
    subsection: "Friendship: Activities",
    type: "M",
    text: "We commit to regularly engaging in activities that strengthen our friendship, what is your preference?",
    options: [
      "Shared hobbies and interests",
      "Deep conversations and sharing",
      "Fun adventures and new experiences",
      "All of the above"
    ],
    weight: 4
  },
  {
    id: 70,
    section: "Crisis Management",
    subsection: "Health: Serious Illness",
    type: "D",
    text: "We commit to caring for each other 'in sickness and in health' with devotion, patience, and sacrificial love.",
    options: [
      "We commit to caring for each other 'in sickness and in health' with devotion, patience, and sacrificial love",
      "We believe each person is primarily responsible for their own health care and major illness should be handled with professional rather than spousal support"
    ],
    weight: 8
  },
  {
    id: 71,
    section: "Crisis Management",
    subsection: "Financial: Job Loss",
    type: "D",
    text: "We commit to supporting each other through financial difficulties and job changes with faith and teamwork.",
    options: [
      "We commit to supporting each other through financial difficulties and job changes with faith and teamwork",
      "We believe financial difficulties should be handled individually and that job loss is primarily the responsibility of the affected spouse"
    ],
    weight: 6
  },
  {
    id: 72,
    section: "Crisis Management",
    subsection: "Family: Death/Loss",
    type: "D",
    text: "We commit to supporting each other through grief and loss with compassion, patience, and understanding.",
    options: [
      "We commit to supporting each other through grief and loss with compassion, patience, and understanding",
      "We believe grief and loss should be processed individually with professional help rather than relying primarily on spousal support"
    ],
    weight: 7
  },
  {
    id: 73,
    section: "Crisis Management",
    subsection: "Relationship: Infidelity",
    type: "M",
    text: "We commit to absolute faithfulness, but if unfaithfulness occurs, what is your approach to restoration?",
    options: [
      "Professional counseling with commitment to restoration",
      "Separation with path to reconciliation if possible",
      "This would require much prayer and professional guidance",
      "This situation would end our marriage"
    ],
    weight: 10
  },
  {
    id: 74,
    section: "Crisis Management",
    subsection: "Relationship: Trust Issues",
    type: "D",
    text: "We commit to rebuilding trust through transparency, accountability, and professional help when trust is broken.",
    options: [
      "We commit to rebuilding trust through transparency, accountability, and professional help when trust is broken",
      "We believe some trust violations cannot be overcome and that transparency requirements can be excessive and controlling"
    ],
    weight: 8
  },
  {
    id: 75,
    section: "Social Relationships",
    subsection: "Friendships: Individual",
    type: "M",
    text: "We commit to maintaining healthy individual friendships while prioritizing our marriage, what are your boundaries?",
    options: [
      "Individual friendships with full transparency",
      "Primarily couple friendships with some individual connections",
      "Individual friendships of same gender only",
      "Other: Please detail"
    ],
    weight: 5
  },
  {
    id: 76,
    section: "Social Relationships",
    subsection: "Friendships: Couple",
    type: "D",
    text: "We commit to developing friendships with other couples who share our values and support our marriage.",
    options: [
      "We commit to developing friendships with other couples who share our values and support our marriage",
      "We prefer to maintain individual friendships and don't prioritize developing couple friendships with shared values"
    ],
    weight: 4
  },
  {
    id: 77,
    section: "Social Relationships",
    subsection: "Social Media: Boundaries",
    type: "M",
    text: "We commit to appropriate social media use that honors our marriage, what are your boundaries?",
    options: [
      "Complete transparency with shared access to accounts",
      "Individual accounts with agreed-upon boundaries",
      "Limited social media use to protect our relationship",
      "Other: Please detail"
    ],
    weight: 4
  },
  {
    id: 78,
    section: "Social Relationships",
    subsection: "Social Media: Ex-Relationships",
    type: "D",
    text: "We commit to ending all social media connections and communication with former romantic partners.",
    options: [
      "We commit to ending all social media connections and communication with former romantic partners",
      "We believe maintaining some social media connections with former romantic partners is acceptable if boundaries are maintained"
    ],
    weight: 7
  },
  {
    id: 79,
    section: "Lifestyle Choices",
    subsection: "Entertainment: Standards",
    type: "M",
    text: "We commit to entertainment choices that align with our Christian values, what is your approach?",
    options: [
      "Only explicitly Christian entertainment",
      "Family-friendly content with Christian values",
      "Selective mainstream content with discernment",
      "Other: Please detail"
    ],
    weight: 3
  },
  {
    id: 80,
    section: "Lifestyle Choices",
    subsection: "Entertainment: Time Limits",
    type: "M",
    text: "We commit to balanced entertainment consumption that doesn't interfere with our relationship, what are your boundaries?",
    options: [
      "Specific time limits on entertainment consumption",
      "No entertainment during designated couple time",
      "Mutual agreement on entertainment choices",
      "All of the above"
    ],
    weight: 3
  },
  {
    id: 81,
    section: "Lifestyle Choices",
    subsection: "Substance Use: Alcohol",
    type: "M",
    text: "We commit to responsible choices regarding alcohol consumption that honor our marriage and faith, what is your approach?",
    options: [
      "Complete abstinence from alcohol",
      "Occasional social drinking with moderation",
      "Wine with meals and special occasions only",
      "Other: Please detail"
    ],
    weight: 4
  },
  {
    id: 82,
    section: "Lifestyle Choices",
    subsection: "Substance Use: Other",
    type: "D",
    text: "We commit to avoiding all illegal substances and addictive behaviors that would harm our marriage or witness.",
    options: [
      "We commit to avoiding all illegal substances and addictive behaviors that would harm our marriage or witness",
      "We have different standards regarding substance use and believe some recreational use may be acceptable"
    ],
    weight: 6
  },
  {
    id: 83,
    section: "Lifestyle Choices",
    subsection: "Physical Fitness: Health",
    type: "D",
    text: "We commit to maintaining our physical health and appearance as good stewards of our bodies and out of respect for our spouse.",
    options: [
      "We commit to maintaining our physical health and appearance as good stewards of our bodies and out of respect for our spouse",
      "We believe individual health and appearance choices should be personal decisions without spousal expectations or involvement"
    ],
    weight: 4
  },
  {
    id: 84,
    section: "Lifestyle Choices",
    subsection: "Physical Fitness: Activities",
    type: "M",
    text: "We commit to regular physical activity and fitness, what is your preferred approach?",
    options: [
      "Individual workout routines with personal accountability",
      "Exercising together as a couple regularly",
      "Participating in sports or fitness activities together",
      "All of the above"
    ],
    weight: 3
  },
  {
    id: 85,
    section: "Communication Patterns",
    subsection: "Daily Check-ins: Format",
    type: "M",
    text: "We commit to daily communication and connection, what is your preferred format?",
    options: [
      "Morning prayer and planning together",
      "Evening reflection and sharing",
      "Multiple brief check-ins throughout the day",
      "All of the above"
    ],
    weight: 5
  },
  {
    id: 86,
    section: "Communication Patterns",
    subsection: "Deep Conversations: Frequency",
    type: "M",
    text: "We commit to regular deep, meaningful conversations beyond daily logistics, how often?",
    options: [
      "Daily heart-to-heart conversations",
      "Weekly intentional deep sharing",
      "Monthly relationship review and planning",
      "All of the above"
    ],
    weight: 6
  },
  {
    id: 87,
    section: "Communication Patterns",
    subsection: "Listening Skills: Active",
    type: "D",
    text: "We commit to practicing active listening, giving full attention when our spouse is sharing, without interrupting or formulating responses.",
    options: [
      "We commit to practicing active listening, giving full attention when our spouse is sharing, without interrupting or formulating responses",
      "We believe natural conversation styles should be maintained rather than practicing formal active listening techniques"
    ],
    weight: 7
  },
  {
    id: 88,
    section: "Communication Patterns",
    subsection: "Appreciation: Expression",
    type: "D",
    text: "We commit to regularly expressing appreciation and gratitude for each other, both privately and publicly.",
    options: [
      "We commit to regularly expressing appreciation and gratitude for each other, both privately and publicly",
      "We believe appreciation should be expressed naturally rather than as a regular practiced commitment"
    ],
    weight: 5
  },
  {
    id: 89,
    section: "Spiritual Life Together",
    subsection: "Prayer Life: Specific Times",
    type: "M",
    text: "We commit to specific times for prayer together, what is your preference?",
    options: [
      "Morning prayer before starting our day",
      "Evening prayer before sleep",
      "Grace before all meals together",
      "All of the above"
    ],
    weight: 6
  },
  {
    id: 90,
    section: "Spiritual Life Together",
    subsection: "Bible Study: Method",
    type: "M",
    text: "We commit to studying God's Word together regularly, what is your preferred method?",
    options: [
      "Daily devotional reading together",
      "Weekly Bible study with discussion",
      "Following a structured study program",
      "Other: Please detail"
    ],
    weight: 5
  },
  {
    id: 91,
    section: "Spiritual Life Together",
    subsection: "Worship: Corporate",
    type: "D",
    text: "We commit to regular corporate worship attendance and active participation in a local church community.",
    options: [
      "We commit to regular corporate worship attendance and active participation in a local church community",
      "We prefer to worship individually or are still exploring our church commitment and community involvement"
    ],
    weight: 7
  },
  {
    id: 92,
    section: "Spiritual Life Together",
    subsection: "Giving: Stewardship",
    type: "M",
    text: "We commit to faithful stewardship and giving as an expression of our faith, what is your approach?",
    options: [
      "Tithing 10% of gross income",
      "Proportional giving based on blessings received",
      "Regular giving with additional charitable support",
      "Other: Please detail"
    ],
    weight: 4
  },
  {
    id: 93,
    section: "Legacy Building",
    subsection: "Family Heritage: Values",
    type: "D",
    text: "We commit to intentionally building a family legacy of faith, love, and strong character for future generations.",
    options: [
      "We commit to intentionally building a family legacy of faith, love, and strong character for future generations",
      "We prefer to focus on our immediate family rather than intentionally building a multi-generational legacy"
    ],
    weight: 6
  },
  {
    id: 94,
    section: "Legacy Building",
    subsection: "Family Heritage: Traditions",
    type: "M",
    text: "We commit to establishing meaningful family traditions that reinforce our values, what is your priority?",
    options: [
      "Annual family mission or service projects",
      "Regular family celebrations and memory-making",
      "Documented family history and faith stories",
      "All of the above"
    ],
    weight: 4
  },
  {
    id: 95,
    section: "Legacy Building",
    subsection: "Mentorship: Others",
    type: "D",
    text: "We commit to mentoring and encouraging other couples in their marriage journey as we mature in our own relationship.",
    options: [
      "We commit to mentoring and encouraging other couples in their marriage journey as we mature in our own relationship",
      "We prefer to focus on our own marriage growth rather than mentoring other couples"
    ],
    weight: 3
  },
  {
    id: 96,
    section: "Legacy Building",
    subsection: "Community Impact: Service",
    type: "M",
    text: "We commit to making a positive impact in our community together, what is your preferred focus?",
    options: [
      "Church ministry and leadership",
      "Community service and outreach",
      "Professional and workplace witness",
      "All of the above"
    ],
    weight: 3
  },
  {
    id: 97,
    section: "Covenant Commitment",
    subsection: "Renewal: Regular",
    type: "M",
    text: "We commit to regularly renewing our marriage covenant and commitments, how often?",
    options: [
      "Annual formal covenant renewal ceremony",
      "Regular reaffirmation during anniversaries",
      "Ongoing daily recommitment in prayer",
      "All of the above"
    ],
    weight: 5
  },
  {
    id: 98,
    section: "Covenant Commitment",
    subsection: "Growth: Continuous",
    type: "D",
    text: "We commit to continuous growth and improvement in our marriage, never becoming complacent or taking our relationship for granted.",
    options: [
      "We commit to continuous growth and improvement in our marriage, never becoming complacent or taking our relationship for granted",
      "We believe marriage naturally reaches a comfortable stable state and doesn't require continuous active improvement efforts"
    ],
    weight: 7
  },
  {
    id: 99,
    section: "Covenant Commitment",
    subsection: "Eternal Perspective: Final",
    type: "D",
    text: "We commit to honoring God through our marriage as a testimony of His love and faithfulness, maintaining an eternal perspective on our covenant relationship.",
    options: [
      "We commit to honoring God through our marriage as a testimony of His love and faithfulness, maintaining an eternal perspective on our covenant relationship",
      "We view our marriage primarily as a personal relationship rather than as a testimony or witness to others"
    ],
    weight: 10
  }
];