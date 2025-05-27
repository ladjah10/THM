import { Question } from "@/types/assessment";

// Define sections for navigation
export const sections = [
  "Your Foundation",
  "Your Faith Life",
  "Your Marriage Life",
  "Your Parenting Life",
  "Your Family/Home Life", 
  "Your Finances",
  "Your Health and Wellness",
  "Your Marriage and Boundaries"
];

// Authentic 99 Questions from Lawrence Adjah's "The 100 Marriage Assessment - Series 1"
export const questions: Question[] = [
  // YOUR FOUNDATION (Questions 1-10)
  {
    id: 1,
    section: "Your Foundation",
    subsection: "Marriage + Family",
    type: "M",
    text: "Your Foundation: Marriage + Family - What is your faith position?",
    options: [
      "Both believe in Jesus Christ as Lord and Savior",
      "Interested in Christian faith but not yet decided"
    ],
    weight: 10
  },
  {
    id: 2,
    section: "Your Foundation",
    subsection: "Marriage + Family Accountability",
    type: "M",
    text: "In view of the previous question, we are committed to living our lives together being accountable to God, His scripture and to the commitments we make through this 'life covenant' process, unless mutually revisited and discussed at a later time.",
    options: [
      "In view of the previous question, we are committed to living our lives together being accountable to God, His scripture and to the commitments we make through this 'life covenant' process, unless mutually revisited and discussed at a later time.",
      "Other: Before committing to this we need further discussion with spiritual counsel around how this would operate"
    ],
    weight: 8
  },
  {
    id: 3,
    section: "Your Foundation",
    subsection: "Marriage & Children's Faith",
    type: "M",
    text: "We believe we have a responsibility to raise our children according to the Christian faith, intentionally teaching them and raising them according to its expectations while leaving space for them to develop their own personal relationship with Jesus Christ and hopefully make a decision to give their life to Jesus Christ",
    options: [
      "We believe we have a responsibility to raise our children according to the Christian faith, intentionally teaching them and raising them according to its expectations while leaving space for them to develop their own personal relationship with Jesus Christ and hopefully make a decision to give their life to Jesus Christ",
      "We do not believe we have a responsibility to raise our children according to any specific faith tradition and prefer to let them choose their own spiritual path when they're old enough to decide"
    ],
    weight: 12
  },
  {
    id: 4,
    section: "Your Foundation",
    subsection: "Marriage Mindset: Happiness",
    type: "M",
    text: "We're committed to the belief regarding happiness in marriage, what is your primary focus?",
    options: [
      "We're committed to the belief: While a marriage relationship can yield happiness, we believe happiness is neither a stable emotion nor a stable foundation to build a marriage upon, as such, we believe each spouse is ultimately responsible for their own happiness",
      "We're committed to the belief: 'Happy Wife, Happy Life' – the husband is ultimately responsible for making his wife happy and this will in turn lead to a successful marriage",
      "We're committed to the belief: 'Happy King, Happy Kingdom' – the wife is ultimately responsible for making her husband happy and this will in turn lead to a successful marriage",
      "We're committed to the belief: We believe in 'Happy Spouse, Happy House' – each spouse is ultimately responsible for the other spouse's happiness and this will in turn lead to a successful marriage"
    ],
    weight: 5
  },
  {
    id: 5,
    section: "Your Foundation",
    subsection: "Marriage Preparation: Legal (Incapacitation)",
    type: "M",
    text: "We're committed to preparing in advance of our marriage to ensuring we are each well cared for in the undesired, unfortunate and rare case of incapacitating illness and or premature death, as such, we are each committed to establishing our spouse as Power of Attorney before our marriage date",
    options: [
      "We're committed to preparing in advance of our marriage to ensuring we are each well cared for in the undesired, unfortunate and rare case of incapacitating illness and or premature death, as such, we are each committed to establishing our spouse as Power of Attorney before our marriage date",
      "We do not believe it's necessary to establish Power of Attorney before marriage and prefer to address this matter later if and when it becomes relevant"
    ],
    weight: 5
  },
  {
    id: 6,
    section: "Your Foundation",
    subsection: "Marriage Preparation: Legal (Estate)",
    type: "M",
    text: "We're committed to preparing in advance of our marriage to ensuring we are each well cared for in the undesired, unfortunate and rare case of incapacitating illness and or premature death, as such, we are each committed to establishing completing a notarized copy of our will before our marriage date",
    options: [
      "We're committed to preparing in advance of our marriage to ensuring we are each well cared for in the undesired, unfortunate and rare case of incapacitating illness and or premature death, as such, we are each committed to establishing completing a notarized copy of our will before our marriage date",
      "We do not believe creating a will is necessary before marriage and prefer to address estate planning at a later stage in our relationship"
    ],
    weight: 5
  },
  {
    id: 7,
    section: "Your Foundation",
    subsection: "Marriage Mindset: Divorce",
    type: "M",
    text: "We are committed to a lifelong marriage and do not see divorce as an exercisable option for any reasons outside of biblical (adultery & abandonment) or personal safety grounds (physical abuse and professionally evaluated and validated, psychological harm), including but not limited to: Unhappiness, \"Falling Out of Love\", \"Growing Apart\", \"Irreconcilable Differences\"",
    options: [
      "We are committed to a lifelong marriage and do not see divorce as an exercisable option for any reasons outside of biblical (adultery & abandonment) or personal safety grounds (physical abuse and professionally evaluated and validated, psychological harm), including but not limited to: Unhappiness, 'Falling Out of Love', 'Growing Apart', 'Irreconcilable Differences'",
      "We believe that while marriage is intended to be lifelong, divorce may be a reasonable option in a wider range of circumstances, including when personal happiness and fulfillment are severely compromised"
    ],
    weight: 12
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
      "We are committed to a lifelong marriage with one another and do not see divorce as an exercisable option (outside of biblical/safety circumstances), still, we'd like to be more informed about what prenuptial agreements entail before deciding whether to consider it before our marriage"
    ],
    weight: 12
  },
  {
    id: 9,
    section: "Your Foundation",
    subsection: "Marriage Mindset: Celebrating our Covenant",
    type: "M",
    text: "We commit to establishing and celebrating our holy union/covenant through our wedding, how do you plan to celebrate it?",
    options: [
      "Celebrate marriage anniversary every year",
      "Celebrate marriage anniversary every year and do a covenant renewal ceremony every 10 years",
      "Celebrate marriage anniversary every year and do a covenant renewal ceremony every 5 years"
    ],
    weight: 4
  },
  {
    id: 10,
    section: "Your Marriage Life",
    subsection: "Order of Priority before God",
    type: "M",
    text: "We understand and accept the order of relationship priority according to God's highest design, what is your order of priority?",
    options: [
      "God, Spouse, Children, Work, Extended Family, Friends, Church, Ministry, Hobbies"
    ],
    weight: 12
  },

  // YOUR FAITH LIFE (Questions 11-14)
  {
    id: 11,
    section: "Your Faith Life",
    subsection: "Worship Life: Marriage (Husband and Wife)",
    type: "M",
    text: "We commit to prayer as a couple, how often?",
    options: [
      "Daily prayer before sleep",
      "Weekly prayer during check-in",
      "Other: Please detail"
    ],
    weight: 4
  },
  {
    id: 12,
    section: "Your Faith Life",
    subsection: "Worship Life: Marriage",
    type: "M",
    text: "We commit to prayer as a couple, how often?",
    options: [
      "Daily prayer before sleep",
      "Weekly prayer during check-in",
      "Other: Please detail"
    ],
    weight: 4
  },
  {
    id: 13,
    section: "Your Faith Life",
    subsection: "Worship Life: Family",
    type: "M",
    text: "We commit to family worship weekly, including what activities?",
    options: [
      "Weekly, including a dedicated time for prayer and reflection as a family weekly, familial prayer over meals, and weekly corporate worship in a local faith community where we are members",
      "Weekly, including familial prayer over meals, and weekly corporate worship in a local faith community where we are members",
      "Weekly, including familial prayer over meals, and weekly corporate worship in a local/remote faith community where we are members",
      "Other: Please detail"
    ],
    weight: 4
  },
  {
    id: 14,
    section: "Your Faith Life",
    subsection: "Worship Life: Serving",
    type: "M",
    text: "We commit to each volunteering/serving in our community, what is your approach?",
    options: [
      "In our faith community in some capacity in every season",
      "In our faith community in some capacity at least one season/event per year",
      "Flexibly inside (and outside of) our faith community based on our capacity, but at a minimum, we'll always be serving our faith community through our giving in every season",
      "Flexibly inside (and outside of) our faith community based on our capacity"
    ],
    weight: 4
  },

  // YOUR MARRIAGE LIFE (Questions 15-70)
  {
    id: 15,
    section: "Your Marriage Life",
    subsection: "Family Name",
    type: "M",
    text: "We commit to sharing the same last name in marriage, what is your approach?",
    options: [
      "We commit to sharing the same last name in marriage and for the wife to take the husband's last name",
      "We commit to each keeping our own last names in marriage",
      "We commit to the wife hyphenating her last name with her husband's last name in marriage"
    ],
    weight: 7
  },
  {
    id: 16,
    section: "Your Marriage Life",
    subsection: "Communication & Conflict Resolution",
    type: "D",
    text: "We commit to not fighting or having serious arguments in front of others, rather, we'd wait for time alone and away from company, either in our check-in time or immediately after to discuss things away from them",
    options: [
      "Agree",
      "Disagree"
    ],
    weight: 6
  },
  {
    id: 17,
    section: "Your Marriage Life",
    subsection: "Communication & Conflict Resolution (Discuss with others)",
    type: "D",
    text: "We commit to never discussing conflict/issues in our marriage with anyone, before (1) addressing the issue with our spouse and (2) mutually agreeing to seek approved counsel on the issue",
    options: [
      "Agree",
      "Disagree"
    ],
    weight: 10
  },
  {
    id: 18,
    section: "Your Marriage Life",
    subsection: "Communication & Conflict Resolution:2 (24 hours)",
    type: "D",
    text: "We commit to not going more than 24 hours without speaking with one another under any circumstances",
    options: [
      "Agree",
      "Disagree"
    ],
    weight: 5
  },
  {
    id: 19,
    section: "Your Marriage Life",
    subsection: "Communication & Conflict Resolution:3 (Text)",
    type: "D",
    text: "We commit to not discussing serious issues/conflicts/debates via text message. Rather, we'll always discuss them in person or in a live conversation on a phone given the importance of conveying the proper tone and honoring wise boundaries for the marriage",
    options: [
      "Agree",
      "Disagree"
    ],
    weight: 5
  },
  {
    id: 20,
    section: "Your Marriage Life",
    subsection: "Communication & Conflict Resolution:4 (Sleep angry)",
    type: "D",
    text: "We commit to not going to sleep while still angry with one another [not to be confused with resolving the issue, but committing to find common ground to discuss further, prayer and then coming together as one]",
    options: [
      "Agree",
      "Disagree"
    ],
    weight: 10
  },
  {
    id: 21,
    section: "Your Marriage Life",
    subsection: "Communication & Conflict Resolution:5 (Same bed)",
    type: "D",
    text: "We commit to sharing the same bed every night",
    options: [
      "Agree",
      "Disagree"
    ],
    weight: 5
  },
  {
    id: 22,
    section: "Your Marriage Life",
    subsection: "Communication & Conflict Resolution:6 (Sex as weapon)",
    type: "D",
    text: "We commit to never withholding sex as a tactic during conflict in our marriage",
    options: [
      "Agree",
      "Disagree"
    ],
    weight: 8
  },
  {
    id: 23,
    section: "Your Marriage Life",
    subsection: "Communication & Conflict Resolution:7 (Silence as weapon)",
    type: "D",
    text: "We commit to never using silence as a tactic during conflict in our marriage",
    options: [
      "Agree",
      "Disagree"
    ],
    weight: 5
  },
  {
    id: 24,
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
    id: 25,
    section: "Your Marriage Life",
    subsection: "Decision Making",
    type: "D",
    text: "We commit to the husband being the final decision maker for the family after discussion and prayer with his wife",
    options: [
      "Agree",
      "Disagree"
    ],
    weight: 5
  },
  {
    id: 26,
    section: "Your Marriage Life",
    subsection: "Dedicated Time (Fellowship)",
    type: "M",
    text: "We commit to weekly date nights, what is your approach?",
    options: [
      "Weekly date nights",
      "Bi-weekly date nights",
      "Monthly date nights"
    ],
    weight: 7
  },
  {
    id: 27,
    section: "Your Marriage Life",
    subsection: "Marriage: Dedicated Time",
    type: "M",
    text: "We commit to marriage check-ins, what is your approach?",
    options: [
      "Weekly marriage check-ins",
      "Monthly marriage check-ins",
      "Quarterly marriage check-ins"
    ],
    weight: 5
  },
  {
    id: 28,
    section: "Your Marriage Life",
    subsection: "Living – Room Boundaries (Electronics)",
    type: "D",
    text: "We commit to not having any electronics in our bedroom",
    options: [
      "Agree",
      "Disagree"
    ],
    weight: 5
  },
  {
    id: 29,
    section: "Your Marriage Life",
    subsection: "Relationship Model (Work/Home)",
    type: "M",
    text: "We commit to a work/home model, what is your approach?",
    options: [
      "One spouse stays home with children",
      "Both spouses work outside the home",
      "One spouse works from home",
      "Both spouses work from home"
    ],
    weight: 7
  },
  {
    id: 30,
    section: "Your Marriage Life",
    subsection: "Relationship Model (Travel)",
    type: "M",
    text: "We commit to a maximum time apart due to travel, what is your approach?",
    options: [
      "No more than 2 days apart",
      "No more than 4 days apart",
      "No more than 7 days apart",
      "No more than 14 days apart"
    ],
    weight: 5
  },
  {
    id: 31,
    section: "Your Marriage Life",
    subsection: "Sex - Frequency",
    type: "M",
    text: "We commit to physical intimacy frequency, what is your approach?",
    options: [
      "Daily physical intimacy",
      "Multiple times per week",
      "Weekly physical intimacy",
      "As desired mutually"
    ],
    weight: 8
  },
  {
    id: 32,
    section: "Your Marriage Life",
    subsection: "Sex - Initiation",
    type: "M",
    text: "We commit to physical intimacy initiation, what is your approach?",
    options: [
      "We commit to alternating who initiates sex by week",
      "We commit to alternating who initiates sex by day/instance",
      "We commit to \"letting it flow\" naturally without a set alternation schedule, with that said, we each willingly acknowledge it is not the responsibility of one spouse to initiate a duty before God"
    ],
    weight: 6
  },
  {
    id: 33,
    section: "Your Marriage Life",
    subsection: "Sex - Communication",
    type: "M",
    text: "We commit to intimate communication, what is your approach?",
    options: [
      "We commit to having a conversation within the first month about what we individually enjoy in sex with our spouse and what aspect of the experience, if anything, you would each enjoy more of",
      "We commit to having a conversation within the first 3 months about what we individually enjoy in sex with our spouse and what aspect of the experience, if anything, you would each enjoy more of",
      "We commit to having a conversation within the first 6 months about what we individually enjoy in sex with our spouse and what aspect of the experience, if anything, you would each enjoy more of",
      "Other: Before committing to this we need further discussion in our session around how this would operate"
    ],
    weight: 5
  },
  {
    id: 34,
    section: "Your Marriage Life",
    subsection: "Sex - Contraception",
    type: "M",
    text: "We commit to family planning and contraception, what is your approach?",
    options: [
      "We do not plan to use contraception of any form during marriage",
      "We plan to use contraception, but we do not plan to use any which require oral consumption (health concerns/considerations) or invasive surgery (vasectomy, fallopian \"tubes tied\")",
      "We plan to use all forms of contraception available to us which includes oral consumption and/or invasive surgery as an option (vasectomy, fallopian \"tubes tied\")"
    ],
    weight: 7
  },
  {
    id: 35,
    section: "Your Marriage Life",
    subsection: "Sex - Boundaries",
    type: "D",
    text: "We commit to never discussing our sex lives with anyone (friends, colleagues, and family members) unless we mutually agree to seek outside counsel on that aspect of our relationship",
    options: [
      "We commit to never discussing our sex lives with anyone (friends, colleagues, and family members) unless we mutually agree to seek outside counsel on that aspect of our relationship",
      "We disagree with this statement"
    ],
    weight: 8
  },
  {
    id: 36,
    section: "Your Marriage Life",
    subsection: "Children Decision: How To Have Them (Method of Delivery Preference)",
    type: "M",
    text: "We commit to childbirth delivery preferences, what is your approach?",
    options: [
      "We are committed to having our babies at home with a trained midwife",
      "We are committed to having our babies at a hospital (or birthing center) with a trained midwife",
      "We are committed to having our babies at a hospital with an OBGYN",
      "Not Applicable"
    ],
    weight: 3
  },
  {
    id: 37,
    section: "Your Marriage Life",
    subsection: "Children Decision: How To Have Them (Pregnancy/Family)",
    type: "M",
    text: "We commit to family planning and children, what is your approach?",
    options: [
      "We plan to have children and are committed to having as many children as God blesses us with during our childbearing years",
      "We plan to have children and are committed to having 1-2 children",
      "We plan to have children and are committed to having 3-4 children",
      "We plan to have children and are committed to having 5+ children",
      "We do not plan to have children",
      "Not Applicable"
    ],
    weight: 8
  },
  {
    id: 38,
    section: "Your Marriage Life",
    subsection: "Children Decision: Adoption",
    type: "M",
    text: "We commit to adoption considerations, what is your approach?",
    options: [
      "We commit to adopting at least one child during our marriage",
      "We admire and believe in adoption but do not plan to adopt during our marriage",
      "We are committed to having children biologically (according to God's will), but would consider adoption if we discern it's not His will for us to have children biologically",
      "Not Applicable"
    ],
    weight: 5
  },
  {
    id: 39,
    section: "Your Marriage Life",
    subsection: "Children Decision: Naming of Children (Model)",
    type: "M",
    text: "We commit to naming our children, what is your approach?",
    options: [
      "We commit to naming our children with first names that are from the Bible",
      "We commit to naming our children with first names that honor a family member from either side of the family",
      "We commit to naming our children with first names that are gender neutral",
      "Other approach to naming our children",
      "Not Applicable"
    ],
    weight: 2
  },
  {
    id: 40,
    section: "Your Marriage Life",
    subsection: "Children Decision: Naming of Children (Jr's)",
    type: "M",
    text: "We commit to naming children after parents, what is your approach?",
    options: [
      "We agree that it's an option to name one of our children after a parent",
      "We agree that's not an option to name one of our children after a parent",
      "Not Applicable"
    ],
    weight: 2
  },
  {
    id: 41,
    section: "Your Marriage Life",
    subsection: "Pregnancy Announcement",
    type: "M",
    text: "We commit to pregnancy announcement timing, what is your approach?",
    options: [
      "We commit to keeping the news of our pregnancy private until the end of the 1st trimester",
      "We commit to keeping the news of our pregnancy private until the end of the 2nd trimester",
      "We do not have a specific guideline around if and when we will share news of a pregnancy",
      "Not Applicable"
    ],
    weight: 2
  },
  {
    id: 42,
    section: "Your Marriage Life",
    subsection: "Work Down Time",
    type: "M",
    text: "We commit to managing work stress and downtime, what is your approach?",
    options: [
      "Complete separation of work and home life",
      "Limited work discussion at home",
      "Open communication about work challenges",
      "Shared work responsibilities and support"
    ],
    weight: 4
  },
  {
    id: 43,
    section: "Your Marriage Life",
    subsection: "Communication & Discipline",
    type: "M",
    text: "We commit to child discipline and communication approach, what is your method?",
    options: [
      "Biblical discipline with clear communication",
      "Positive reinforcement with structured boundaries",
      "Natural consequences with open dialogue",
      "Collaborative approach with mutual agreement"
    ],
    weight: 7
  },
  {
    id: 44,
    section: "Your Marriage Life",
    subsection: "Social Media: New Child",
    type: "M",
    text: "We commit to social media sharing regarding our children, what is your approach?",
    options: [
      "No social media sharing of children's images or information",
      "Limited sharing with family and close friends only",
      "Occasional sharing with privacy settings enabled",
      "Open sharing as we feel comfortable"
    ],
    weight: 4
  },
  {
    id: 45,
    section: "Your Marriage Life",
    subsection: "Communication: Sex/Gender",
    type: "M",
    text: "We commit to discussing sex and gender topics with our children, what is your approach?",
    options: [
      "Biblical perspective on sexuality and gender roles",
      "Age-appropriate scientific and moral education",
      "Open dialogue with traditional values",
      "Comprehensive education with family values"
    ],
    weight: 5
  },

  // YOUR HEALTH AND WELLNESS (Questions 71-89)
  {
    id: 71,
    section: "Your Health and Wellness",
    subsection: "Financial Stewardship & Nutrition Health Goals",
    type: "M",
    text: "We commit to enjoying home-cooked meals, what is your approach?",
    options: [
      "We commit to enjoying home-cooked meals at least 4 of the 7 days per week",
      "We commit to enjoying home-cooked meals at least 2 of the 7 days per week",
      "We commit to enjoying healthy meals through all channels (cooking at home, eating out, and catering), we will not focus on cooking at home for any amount of days per week",
      "Other: Please detail"
    ],
    weight: 4
  },
  {
    id: 72,
    section: "Your Health and Wellness",
    subsection: "Specific Consumption Goals [Meal Types]",
    type: "M",
    text: "We commit to a healthy balanced diet, what is your approach?",
    options: [
      "No special restriction on any meats, fish, poultry and dairy products",
      "All meats except pork and shellfish, in accordance with biblical dietary guidelines",
      "Vegetarian diet",
      "Vegan diet",
      "Pescatarian diet",
      "Carnivore diet",
      "Flexible to individual needs and preferences"
    ],
    weight: 3
  },
  {
    id: 73,
    section: "Your Health and Wellness",
    subsection: "New Babies: Nutrition: Breastfeeding",
    type: "M",
    text: "We commit to breastfeeding, what is your approach?",
    options: [
      "We commit to breastfeeding primarily and only using formula in rare circumstances",
      "We commit to breastfeeding whenever possible, still, we do not have any reservations about relying on high quality formula",
      "Not Applicable"
    ],
    weight: 3
  },
  {
    id: 74,
    section: "Your Health and Wellness",
    subsection: "Approach to Medicine, Illness and Pain Management: Natural Birth or Epidural",
    type: "M",
    text: "We commit to birth pain management approach, what is your approach?",
    options: [
      "We are committed to having a natural birth",
      "We are committed to having an epidural or anything medically available to relieve labor pain",
      "We're not well educated enough on the subject to make an informed decision on what's best so we plan to research and revisit this when the time comes",
      "Not Applicable"
    ],
    weight: 3
  },
  {
    id: 75,
    section: "Your Health and Wellness",
    subsection: "Psychological / Physical (Individual Therapy)",
    type: "M",
    text: "We commit to individual therapy for personal wellness, what is your approach?",
    options: [
      "We are each committed to seeing a (faith-aligned) therapist individually, at least 6 times per year during our marriage (as our resources allow)",
      "We are each committed to seeing a (faith-aligned) therapist individually, at least 4 times per year during our marriage (as our resources allow)",
      "We are each committed to seeing a (faith-aligned) therapist individually, at least 12 times per year during our marriage (as our resources allow)",
      "While we believe in seeking counsel for our marriage, we're not ready to commit to long-term individual therapy currently"
    ],
    weight: 4
  },
  {
    id: 76,
    section: "Your Health and Wellness",
    subsection: "Diet Expectations",
    type: "D",
    text: "I believe we should follow the same dietary approach",
    options: [
      "We do believe spouses should generally follow the same dietary approach",
      "We do not believe spouses need to follow identical diets and can have individual approaches"
    ],
    weight: 3
  },
  {
    id: 77,
    section: "Your Health and Wellness",
    subsection: "Approach to Medicine, Illness and Pain Management",
    type: "M",
    text: "We are committed to each doing a full physical, what is your approach?",
    options: [
      "Annual physical and check-up before wedding",
      "Annual physical, already completed this year",
      "Other: Please detail"
    ],
    weight: 4
  },
  {
    id: 78,
    section: "Your Health and Wellness",
    subsection: "Psychological / Physical (Physical Wellness – Exercise)",
    type: "M",
    text: "We are each committed to regular exercise, what is your approach?",
    options: [
      "At least 3x per week individually",
      "At least 2x per week individually",
      "At least 4x per week individually",
      "Other: please detail"
    ],
    weight: 4
  },
  {
    id: 79,
    section: "Your Health and Wellness",
    subsection: "Approach to Medicine, Illness and Pain Management",
    type: "M",
    text: "We commit to an approach for medicine, illness and pain management, what is your approach?",
    options: [
      "We commit to an approach that leans towards natural/homeopathic remedies and avoiding over-the-counter drugs unless medically necessary",
      "We commit to an approach that utilizes all available over-the-counter drugs and medical treatments",
      "We commit to being flexible to individual preferences and medical needs"
    ],
    weight: 4
  },
  {
    id: 80,
    section: "Your Health and Wellness",
    subsection: "Sex Perspective: Declaration",
    type: "D",
    text: "We share the belief that sex in marriage is a duty before God and not a conditional expression of love and honor",
    options: [
      "We agree with this statement",
      "We disagree with this statement"
    ],
    weight: 8
  },

  // YOUR FINANCES (Questions 81-89)
  {
    id: 81,
    section: "Your Finances",
    subsection: "Financial Management",
    type: "M",
    text: "We commit to financial management approach, what is your method?",
    options: [
      "Joint accounts and shared financial decisions",
      "Separate accounts with shared household expenses",
      "One spouse manages all finances",
      "Professional financial advisor guidance"
    ],
    weight: 8
  },
  {
    id: 82,
    section: "Your Finances",
    subsection: "Budget Management",
    type: "M",
    text: "We commit to budget management, what is your approach?",
    options: [
      "Detailed monthly budget with regular review",
      "General spending guidelines without strict tracking",
      "Annual budget planning with quarterly reviews",
      "Flexible spending based on income and needs"
    ],
    weight: 6
  },
  {
    id: 83,
    section: "Your Finances",
    subsection: "Savings Goals",
    type: "M",
    text: "We commit to savings and financial goals, what is your priority?",
    options: [
      "Emergency fund as top priority",
      "Home ownership savings focus",
      "Retirement planning emphasis",
      "Children's education fund priority"
    ],
    weight: 7
  },
  {
    id: 84,
    section: "Your Finances",
    subsection: "Stewardship and Giving",
    type: "M",
    text: "We commit to financial stewardship and giving, what is your approach?",
    options: [
      "We commit to tithing 10% of our gross income to our local church",
      "We commit to giving a percentage of our income to charitable causes",
      "We commit to flexible giving based on our financial capacity",
      "We are still determining our approach to financial giving"
    ],
    weight: 8
  },
  {
    id: 85,
    section: "Your Finances",
    subsection: "Financial Decisions",
    type: "M",
    text: "We commit to making major financial decisions, what is your approach?",
    options: [
      "All major financial decisions require mutual agreement",
      "Each spouse has autonomy up to a certain spending limit",
      "One spouse takes the lead on financial decisions with consultation",
      "We will seek financial counseling for major decisions"
    ],
    weight: 7
  },
  {
    id: 86,
    section: "Your Finances",
    subsection: "Career and Income",
    type: "M",
    text: "We commit to career and income priorities, what is your approach?",
    options: [
      "Both spouses prioritize career advancement equally",
      "One spouse prioritizes career while other supports family",
      "Flexible approach based on opportunities and family needs",
      "Ministry and service prioritized over income maximization"
    ],
    weight: 6
  },

  // YOUR FAMILY/HOME LIFE (Questions 87-93)
  {
    id: 87,
    section: "Your Family/Home Life",
    subsection: "Traditions: Family Dinner",
    type: "M",
    text: "We commit to family dinner traditions, what is your approach?",
    options: [
      "Daily family dinners together",
      "Weekly family dinners on specific days",
      "Special occasion family dinners only",
      "Flexible family meal arrangements"
    ],
    weight: 4
  },
  {
    id: 88,
    section: "Your Family/Home Life",
    subsection: "House Cleaning & Maintenance",
    type: "M",
    text: "We commit to household responsibilities, what is your approach?",
    options: [
      "Shared responsibilities based on availability",
      "Traditional gender-based role division",
      "Hired help for major cleaning tasks",
      "Rotating weekly responsibility assignments"
    ],
    weight: 3
  },
  {
    id: 89,
    section: "Your Family/Home Life",
    subsection: "Extended Family Relationships",
    type: "M",
    text: "We commit to extended family relationships, what is your approach?",
    options: [
      "Regular visits and close relationships with both families",
      "Balanced involvement with boundaries as needed",
      "Selective engagement based on positive influences",
      "Primary focus on our immediate family unit"
    ],
    weight: 5
  },
  {
    id: 90,
    section: "Your Family/Home Life",
    subsection: "Holiday and Celebration Traditions",
    type: "M",
    text: "We commit to holiday and celebration traditions, what is your approach?",
    options: [
      "Create new traditions focused on our nuclear family",
      "Balance traditions from both families of origin",
      "Focus primarily on Christian/religious celebrations",
      "Flexible approach based on circumstances each year"
    ],
    weight: 4
  },

  // YOUR MARRIAGE AND BOUNDARIES (Questions 91-99)
  {
    id: 91,
    section: "Your Marriage and Boundaries",
    subsection: "Communication with Opposite Gender",
    type: "M",
    text: "We commit to boundaries in communication with opposite gender, what is your approach?",
    options: [
      "Transparent communication about all opposite gender interactions",
      "Group settings only for opposite gender friendships",
      "Professional courtesy with clear boundaries",
      "Spouse involvement in all significant opposite gender relationships"
    ],
    weight: 8
  },
  {
    id: 92,
    section: "Your Marriage and Boundaries",
    subsection: "Social Media and Privacy",
    type: "M",
    text: "We commit to social media and privacy boundaries, what is your approach?",
    options: [
      "Complete transparency with shared passwords and access",
      "Individual privacy with general openness about usage",
      "Minimal social media use with family focus",
      "Professional use only with personal boundaries"
    ],
    weight: 5
  },
  {
    id: 93,
    section: "Your Marriage and Boundaries",
    subsection: "Friendship and Social Relationships",
    type: "M",
    text: "We commit to friendships and social relationships as a married couple, what is your approach?",
    options: [
      "Primarily couple friendships and family activities",
      "Individual friendships with transparency and boundaries",
      "Church community as primary social relationship focus",
      "Balanced approach to individual and couple relationships"
    ],
    weight: 5
  },
  {
    id: 94,
    section: "Your Marriage and Boundaries",
    subsection: "Work-Life Balance",
    type: "M",
    text: "We commit to work-life balance in our marriage, what is your approach?",
    options: [
      "Strict boundaries between work and family time",
      "Flexible integration of work and family responsibilities",
      "Family priorities take precedence over career advancement",
      "Seasonal adjustments based on work and family demands"
    ],
    weight: 5
  },
  {
    id: 95,
    section: "Your Marriage and Boundaries",
    subsection: "Hospitality and Service",
    type: "M",
    text: "We commit to hospitality and service as a married couple, what is your approach?",
    options: [
      "Regular hosting and welcoming others into our home",
      "Active service in church and community ministries",
      "Occasional hospitality based on capacity and calling",
      "Focus on family stability before extensive outreach"
    ],
    weight: 5
  },
  {
    id: 96,
    section: "Your Marriage and Boundaries",
    subsection: "Recreation and Entertainment",
    type: "M",
    text: "We commit to recreation and entertainment choices, what is your approach?",
    options: [
      "Family-friendly activities aligned with Christian values",
      "Balanced entertainment with discernment and boundaries",
      "Outdoor and active recreation prioritized over screen time",
      "Cultural and educational entertainment experiences"
    ],
    weight: 4
  },
  {
    id: 97,
    section: "Your Marriage and Boundaries",
    subsection: "Legacy and Future Vision",
    type: "M",
    text: "We commit to legacy and future vision for our family, what is your approach?",
    options: [
      "Strong Christian legacy through generations",
      "Financial and educational legacy for children",
      "Service and ministry legacy in community",
      "Combination of spiritual, financial, and service legacy"
    ],
    weight: 7
  },
  {
    id: 98,
    section: "Your Marriage and Boundaries",
    subsection: "Marital Growth and Development",
    type: "M",
    text: "We commit to continuous marital growth and development, what is your approach?",
    options: [
      "Regular marriage retreats and couples conferences",
      "Ongoing biblical study and spiritual growth together",
      "Professional marriage counseling and education",
      "Mentorship relationships with older married couples"
    ],
    weight: 6
  },
  {
    id: 99,
    section: "Your Marriage and Boundaries",
    subsection: "Covenant Renewal and Commitment",
    type: "M",
    text: "We commit to covenant renewal and ongoing commitment, what is your approach?",
    options: [
      "Annual covenant renewal ceremony and recommitment",
      "Regular review and renewal of marriage vows",
      "Milestone celebrations and covenant acknowledgment",
      "Daily commitment and ongoing covenant consciousness"
    ],
    weight: 8
  }
];