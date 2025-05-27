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
  "Your Marriage and Boundaries",
  "Your Marriage Life with Children"
];

// Questions from the authentic 100 Marriage Assessment book
export const questions: Question[] = [
  // YOUR FOUNDATION
  {
    id: 1,
    section: "Your Foundation",
    subsection: "Marriage + Family",
    type: "M",
    text: "Your Foundation: Marriage + Family - What is your faith position?",
    options: [
      "We each already believe in and (have) receive(d) Jesus Christ as our Lord and Savior and this reality will be the active foundation and guiding lens through which we see and operate in our marriage and family",
      "We are interested in living our new lives together according to the Christian faith, but we haven't each made the individual decision to receive Jesus Christ as our Lord and Savior (and be baptized) and we would like to do this in advance of our union."
    ],
    weight: 36
  },
  {
    id: 2,
    section: "Your Foundation",
    subsection: "Marriage + Family Accountability",
    type: "D",
    text: "In view of the previous question, we are committed to living our lives together being accountable to God, His scripture and to the commitments we make through this 'life covenant' process, unless mutually revisited and discussed at a later time.",
    options: [
      "In view of the previous question, we are committed to living our lives together being accountable to God, His scripture and to the commitments we make through this 'life covenant' process, unless mutually revisited and discussed at a later time.",
      "Other: Before committing to this we need further discussion with spiritual counsel around how this would operate"
    ],
    weight: 12
  },
  {
    id: 3,
    section: "Your Foundation",
    subsection: "Marriage & Children's Faith",
    type: "D",
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
      "We're committed to the belief: While a marriage relationship can yield happiness, we believe happiness is neither a stable emotion nor a stable foundation to build a marriage upon, as such, we believe each spouse is ultimately responsible for their own happiness.",
      "We're committed to the belief: 'Happy Wife, Happy Life' – the husband is ultimately responsible for making his wife happy and this will in turn lead to a successful marriage.",
      "We're committed to the belief: 'Happy King, Happy Kingdom' – the wife is ultimately responsible for making her husband happy and this will in turn lead to a successful marriage.",
      "We're committed to the belief: We believe in 'Happy Spouse, Happy House' – each spouse is ultimately responsible for the other spouse's happiness and this will in turn lead to a successful marriage."
    ],
    weight: 5
  },
  {
    id: 5,
    section: "Your Foundation",
    subsection: "Marriage Preparation: Legal (Incapacitation)",
    type: "D",
    text: "We're committed to preparing in advance of our marriage to ensuring we are each well cared for in the undesired, unfortunate and rare case of incapacitating illness and or premature death, as such, we are each committed to establishing our spouse as Power of Attorney before our marriage date.",
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
    type: "D",
    text: "We're committed to preparing in advance of our marriage to ensuring we are each well cared for in the undesired, unfortunate and rare case of incapacitating illness and or premature death, as such, we are each committed to establishing completing a notarized copy of our will before our marriage date.",
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
    type: "D",
    text: "We are committed to a lifelong marriage and do not see divorce as an exercisable option for any reasons outside of biblical (adultery & abandonment) or personal safety grounds (physical abuse and professionally evaluated and validated, psychological harm), including but not limited to: Unhappiness, \"Falling Out of Love\", \"Growing Apart\", \"Irreconcilable Differences\".",
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
      "We are committed to a lifelong marriage with one another and do not see divorce as an exercisable option (outside of biblical/safety circumstances), still, in view of the law and the prevalent rates of marriage dissolution, we agree to explore and structure a mutually considerate prenuptial agreement for our marriage.",
      "We are committed to a lifelong marriage with one another and do not see divorce as an exercisable option (outside of biblical/safety circumstances), and do not believe any legal agreements beyond our mutual commitments through this life covenant process are necessary for us to explore and structure at this time.",
      "We are committed to a lifelong marriage with one another and do not see divorce as an exercisable option (outside of biblical/safety circumstances), still, we'd like to be more informed about what prenuptial agreements entail before deciding whether to consider it before our marriage."
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
    section: "Your Foundation",
    subsection: "Marriage Priorities",
    type: "M",
    text: "We understand and accept the order of relationship priority according to God's highest design, what is your order of priority?",
    options: [
      "God, Spouse, Children, Work, Extended Family, Friends, Church, Ministry, Hobbies"
    ],
    weight: 12
  },
  
  // YOUR FAITH LIFE
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
    weight: 3
  },
  
  // YOUR MARRIAGE LIFE
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
    text: "We commit to not fighting or having serious arguments in front of others, rather, we'd wait for time alone and away from company, either in our check-in time or immediately after to discuss things away from them.",
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
    text: "We commit to never discussing conflict/issues in our marriage with anyone, before (1) addressing the issue with our spouse and (2) mutually agreeing to seek approved counsel on the issue.",
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
    text: "We commit to not going more than 24 hours without speaking with one another under any circumstances.",
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
    text: "We commit to not discussing serious issues/conflicts/debates via text message. Rather, we'll always discuss them in person or in a live conversation on a phone given the importance of conveying the proper tone and honoring wise boundaries for the marriage.",
    options: [
      "Agree",
      "Disagree"
    ],
    weight: 3
  },
  {
    id: 20,
    section: "Your Marriage Life",
    subsection: "Communication & Conflict Resolution:4 (Sleep angry)",
    type: "D",
    text: "We commit to not going to sleep while still angry with one another [not to be confused with resolving the issue, but committing to find common ground to discuss further, prayer and then coming together as one].",
    options: [
      "Agree",
      "Disagree"
    ],
    weight: 3
  },
  {
    id: 21,
    section: "Your Marriage Life",
    subsection: "Communication & Conflict Resolution:5 (Same bed)",
    type: "D",
    text: "We commit to sharing the same bed every night.",
    options: [
      "Agree",
      "Disagree"
    ],
    weight: 3
  },
  {
    id: 22,
    section: "Your Marriage Life",
    subsection: "Communication & Conflict Resolution:6 (Sex as weapon)",
    type: "D",
    text: "We commit to never withholding sex as a tactic during conflict in our marriage.",
    options: [
      "Agree",
      "Disagree"
    ],
    weight: 5
  },
  {
    id: 23,
    section: "Your Marriage Life",
    subsection: "Communication & Conflict Resolution:7 (Silence as weapon)",
    type: "D",
    text: "We commit to never using silence as a tactic during conflict in our marriage.",
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
    text: "We commit to meeting with a marriage coach/counselor, what is your approach?",
    options: [
      "At least once per quarter as a check-in whether there are issues or not",
      "At least once per year as a check-in whether there are issues or not",
      "Only when there is an issue we can't resolve independently",
      "Never, we don't believe in outside counsel for marriage"
    ],
    weight: 3
  },
  {
    id: 25,
    section: "Your Marriage Life",
    subsection: "Decision Making",
    type: "D",
    text: "We commit to the husband being the final decision maker for the family after discussion and prayer with his wife.",
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
    text: "We commit to not having any electronics in our bedroom.",
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
    weight: 3
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
    weight: 3
  },
  {
    id: 31,
    section: "Your Marriage Life",
    subsection: "Relationship Model (Late Night Work)",
    type: "M",
    text: "We commit to limiting late work nights, what is your approach?",
    options: [
      "No late work nights",
      "Maximum 1 late work night per week",
      "Maximum 2 late work nights per week",
      "As needed for work responsibilities"
    ],
    weight: 3
  },
  {
    id: 32,
    section: "Your Marriage Life",
    subsection: "Relationship Model (Work Down Time)",
    type: "M",
    text: "We commit to respecting individual downtime needs, what is your approach?",
    options: [
      "No individual downtime needed",
      "15-30 minutes daily downtime",
      "30-60 minutes daily downtime",
      "60+ minutes daily downtime"
    ],
    weight: 3
  },
  {
    id: 33,
    section: "Your Marriage Life",
    subsection: "Marriage: Living – Rooting",
    type: "M",
    text: "We commit to living in a location, what is your approach?",
    options: [
      "Near husband's family",
      "Near wife's family", 
      "Equidistant from both families",
      "Away from both families for independence"
    ],
    weight: 3
  },
  {
    id: 34,
    section: "Your Marriage Life",
    subsection: "Marriage: Living – City Type",
    type: "M",
    text: "We commit to living in a specific type of area, what is your approach?",
    options: [
      "Urban area",
      "Suburban area", 
      "Rural area"
    ],
    weight: 3
  },
  {
    id: 35,
    section: "Your Marriage Life",
    subsection: "Marriage: Living – Home Type",
    type: "M",
    text: "We commit to living in a specific type of home, what is your approach?",
    options: [
      "Apartment",
      "Townhouse",
      "Single-family house",
      "Multi-family house"
    ],
    weight: 3
  },
  {
    id: 36,
    section: "Your Marriage Life",
    subsection: "Marriage: Living – Domestic/International",
    type: "M",
    text: "We commit to considering international living, what is your approach?",
    options: [
      "Yes, willing for long-term international living",
      "Yes, willing for short-term international living",
      "No, prefer domestic living only",
      "Only for extended vacation purposes"
    ],
    weight: 3
  },
  
  // YOUR PARENTING LIFE
  {
    id: 37,
    section: "Your Parenting Life",
    subsection: "Children: Desire",
    type: "M",
    text: "We commit to having children, what is your approach?",
    options: [
      "Yes, we want biological children",
      "Yes, we want to adopt children",
      "Yes, we want both biological and adopted children",
      "No, we don't want children",
      "We are divided on this decision"
    ],
    weight: 12
  },
  {
    id: 38,
    section: "Your Parenting Life",
    subsection: "Children: Timing",
    type: "M",
    text: "We commit to timing of having children, what is your approach?",
    options: [
      "Immediately after marriage",
      "After 1-2 years of marriage",
      "After 3-5 years of marriage",
      "Only after financial stability",
      "Never want children"
    ],
    weight: 5
  },
  {
    id: 39,
    section: "Your Parenting Life",
    subsection: "Children: Quantity",
    type: "M",
    text: "We commit to the number of children, what is your approach?",
    options: [
      "No children",
      "1-2 children",
      "3-4 children",
      "5+ children"
    ],
    weight: 5
  },
  {
    id: 40,
    section: "Your Parenting Life",
    subsection: "Children: Parenting Style",
    type: "M",
    text: "We commit to a parenting style, what is your approach?",
    options: [
      "Authoritative (High expectations & High responsiveness)",
      "Authoritarian (High expectations & Low responsiveness)",
      "Permissive (Low expectations & High responsiveness)",
      "Uninvolved (Low expectations & Low responsiveness)"
    ],
    weight: 7
  },
  {
    id: 41,
    section: "Your Parenting Life",
    subsection: "Children: Discipline",
    type: "M",
    text: "We commit to a discipline approach, what is your approach?",
    options: [
      "Positive reinforcement only",
      "Verbal correction and time-outs",
      "Spanking when necessary",
      "Natural consequences based on behavior"
    ],
    weight: 7
  },
  {
    id: 42,
    section: "Your Parenting Life",
    subsection: "Children: Education",
    type: "M",
    text: "We commit to our children's education approach, what is your approach?",
    options: [
      "Public school education",
      "Private religious school education",
      "Private secular school education",
      "Homeschool education"
    ],
    weight: 5
  },
  {
    id: 43,
    section: "Your Marriage Life",
    subsection: "Marriage: Living - Home Type",
    type: "M",
    text: "We commit to living in a specific type of home, what is your approach?",
    options: [
      "We're committed to living in an apartment long-term as our primary residence",
      "We're committed to living in a standalone single-family house long-term as our primary residence",
      "We're committed to living in a standalone single-family townhouse long-term as our primary residence",
      "We're committed to living in a multi-family house long-term"
    ],
    weight: 3
  },
  {
    id: 44,
    section: "Your Parenting Life",
    subsection: "Children Decision: To Have Them (Biologically)",
    type: "M",
    text: "We commit to having children biologically, what is your approach?",
    options: [
      "We commit to having children (according to God's will)",
      "We do not commit to having children"
    ],
    weight: 4
  },
  {
    id: 45,
    section: "Your Parenting Life",
    subsection: "Children Decision: How To Have Them (Method of Delivery Preference)",
    type: "M",
    text: "We commit to a delivery preference approach, what is your approach?",
    options: [
      "We recognize the most important outcome we desire is for a healthy delivery for both the mother and the child, with that said, to the extent we can plan, we'd prefer: A Water Delivery (if medically prudent and possible)",
      "We recognize the most important outcome we desire is for a healthy delivery for both the mother and the child, with that said, to the extent we can plan, we'd prefer: Vaginal Delivery (with potential for C-Section if medically necessary)"
    ],
    weight: 3
  },
  
  // Add more declaration questions for Marriage Life
  {
    id: 46,
    section: "Your Family/Home Life",
    subsection: "Holidays",
    type: "M",
    text: "We commit to spending holidays together, what is your approach?",
    options: [
      "Alternating between families each year",
      "Splitting time between both families during each holiday",
      "Creating our own traditions separate from extended family",
      "Prioritizing one family due to circumstances (distance, health, etc.)"
    ],
    weight: 3
  },
  {
    id: 47,
    section: "Your Family/Home Life",
    subsection: "Home Management: Chores",
    type: "M",
    text: "We commit to dividing household responsibilities, what is your approach?",
    options: [
      "Traditional gender roles",
      "Equal division of all tasks",
      "Division based on skills and preferences",
      "Outsource most chores (cleaning service, etc.)"
    ],
    weight: 5
  },
  
  // YOUR FINANCES
  {
    id: 48,
    section: "Your Finances",
    subsection: "Financial Philosophy: Combined",
    type: "D",
    text: "We commit to combining all finances, what is your approach?",
    options: [
      "Agree - all finances should be combined",
      "Disagree - maintain separate finances"
    ],
    weight: 12
  },
  {
    id: 49,
    section: "Your Finances",
    subsection: "Financial Philosophy: Tithing",
    type: "D",
    text: "We commit to tithing and charitable giving, what is your approach?",
    options: [
      "Yes, 10% to church/religious organization",
      "Yes, regular charitable giving but flexible percentage",
      "Occasional giving when finances allow",
      "No regular giving"
    ],
    weight: 5
  },
  {
    id: 50,
    section: "Your Parenting Life",
    subsection: "Children Decision: Naming of Children (Model)",
    type: "M",
    text: "We commit to naming our children, what is your approach?",
    options: [
      "We commit to naming our children with first names that are from the Bible",
      "We commit to naming our children with first names that honor a family member from either side of the family",
      "We commit to naming our children with first names that are gender neutral",
      "Other approach to naming children"
    ],
    weight: 2
  },
  {
    id: 51,
    section: "Your Parenting Life", 
    subsection: "Children Decision: Naming of Children (Jr's)",
    type: "M",
    text: "We commit to naming children after family members, what is your approach?",
    options: [
      "We agree that it's an option to name one of our children after a parent",
      "We agree that's not an option to name one of our children after a parent",
      "Not applicable to our situation"
    ],
    weight: 2
  },
  {
    id: 52,
    section: "Your Parenting Life",
    subsection: "Pregnancy Announcement",
    type: "M",
    text: "We commit to announcing pregnancy news, what is your approach?",
    options: [
      "We commit to keeping the news of our pregnancy private until the end of the 1st trimester",
      "We commit to keeping the news of our pregnancy private until the end of the 2nd trimester",
      "We do not have a specific guideline around if and when we will share news of a pregnancy",
      "Not applicable to our situation"
    ],
    weight: 2
  },
  {
    id: 53,
    section: "Your Health and Wellness",
    subsection: "Physical Health: Exercise",
    type: "M",
    text: "We commit to physical fitness and exercise, what is your approach?",
    options: [
      "Regular exercise together is important",
      "Individual exercise routines are fine",
      "Maintaining health is important but no specific expectations",
      "No specific expectations about exercise"
    ],
    weight: 3
  },
  {
    id: 54,
    section: "Your Health and Wellness",
    subsection: "Mental Health: Therapy",
    type: "D",
    text: "We commit to mental health and therapy support, what is your approach?",
    options: [
      "Yes, both individual and couples therapy",
      "Yes to couples therapy, individual is personal choice",
      "Only in crisis situations",
      "No, therapy isn't necessary or helpful"
    ],
    weight: 5
  },
  {
    id: 55,
    section: "Your Parenting Life",
    subsection: "Communication & Conflict Resolution",
    type: "M",
    text: "We commit to communication and conflict resolution around children, what is your approach?",
    options: [
      "We commit to not fighting or having serious arguments in front of the children, rather, we'd wait for time alone and away from the children, either in our check-in time or immediately after to discuss things away from them",
      "We commit to fighting respectfully, even if it's a serious disagreement, in front of the children, because we believe it's healthy and constructive to model positive conflict resolution and to set realistic expectations for them in a marriage"
    ],
    weight: 4
  },
  {
    id: 56,
    section: "Your Parenting Life",
    subsection: "Communication: Sex",
    type: "M",
    text: "We commit to discussing sex education with our children, what is your approach?",
    options: [
      "We commit to discussing sex with our children together at no later than 5 years old, specifically, discussing appropriate/inappropriate touch and expectations of communication if it happens",
      "We commit to discussing sex with our children one on one (each parent has their own talk) at no later than 5 years old specifically, discussing appropriate/inappropriate touch and expectations of communication if it happens and talking through anatomy and what sex is",
      "We commit to discussing sex with our children together at no later than 5 years old; however, we'll discuss appropriate/inappropriate touch and expectations of communication if it happens, between by age 7 and we'll talk through anatomy, what sex is and its purpose, by puberty (10-13)",
      "We commit to discussing sex with our children one on one (each parent has their own talk) at no later than 5 years old; however, we'll discuss appropriate/inappropriate touch and expectations of communication if it happens, between by age 7 and we'll talk through anatomy, what sex is and its purpose, by puberty (10-13)",
      "Other approach to sex education"
    ],
    weight: 4
  },
  {
    id: 57,
    section: "Your Marriage and Boundaries",
    subsection: "Opposite Sex Friendships",
    type: "M",
    text: "We commit to boundaries for opposite-sex friendships, what is your approach?",
    options: [
      "No one-on-one time with opposite sex",
      "Group settings only for opposite sex friendships",
      "One-on-one acceptable with spouse's knowledge",
      "No special restrictions for opposite sex friendships"
    ],
    weight: 12
  },
  {
    id: 58,
    section: "Your Parenting Life",
    subsection: "Social Media (Exposure)",
    type: "M",
    text: "We commit to managing our children's social media exposure, what is your approach?",
    options: [
      "We're committed to guarding the psychological development and physical safety of our children while allowing them to be socially connected and technologically adept, with that said, we do not believe it is appropriate for our children to be on any form of social media until they become high school age",
      "We're committed to guarding the psychological development and physical safety of our children while allowing them to be socially connected and technologically adept, with that said, we do not believe it is appropriate for our children to be on any form of social media until they become middle school age",
      "We're committed to guarding the psychological development and physical safety of our children while allowing them to be socially connected and technologically adept, with that said, we will allow closely monitored social media use from middle school age on",
      "Other approach to social media management"
    ],
    weight: 3
  },
  {
    id: 59,
    section: "Your Marriage and Boundaries",
    subsection: "Personal Privacy",
    type: "M",
    text: "We commit to personal privacy boundaries in marriage, what is your approach?",
    options: [
      "Complete transparency in all areas (phone, email, etc.)",
      "General transparency but some personal space",
      "Privacy is important but should not create secrets",
      "Strong boundaries around personal privacy"
    ],
    weight: 5
  },
  {
    id: 60,
    section: "Your Marriage and Boundaries",
    subsection: "Sexual Boundaries",
    type: "D",
    text: "We commit to sexual intimacy being exclusive to marriage, what is your approach?",
    options: [
      "Agree - sexual intimacy is exclusive to marriage",
      "Disagree - other approaches to sexual intimacy"
    ],
    weight: 12
  },
  {
    id: 61,
    section: "Your Marriage and Boundaries",
    subsection: "Sexual Frequency",
    type: "M",
    text: "We commit to sexual frequency expectations, what is your approach?",
    options: [
      "Multiple times per week",
      "About once per week",
      "A few times per month",
      "No specific expectations"
    ],
    weight: 5
  },
  {
    id: 62,
    section: "Your Parenting Life",
    subsection: "Communication: Race / Racial Dynamics",
    type: "M",
    text: "We commit to discussing race and racial dynamics with our children, what is your approach?",
    options: [
      "We recognize the reality of race as well as its role and history still we don't believe we should have an explicit discussion about race / racial dynamics in the world and in our country with our children",
      "We commit to discussing race with our children together at no later than 10 years old, specifically, discussing the history of race / racial dynamics, where it stems from a biblical perspective (Genesis 3), and expectations you have of them around their approach to engaging the issue in this world",
      "We commit to discussing race with our children one on one (each parent has their own talk) at no later than 10 years old, specifically, discussing the history of race / racial dynamics, where it stems from a biblical perspective (Genesis 3), and expectations you have of them around their approach to engaging the issue in this world",
      "Other approach to discussing race and racial dynamics"
    ],
    weight: 3
  },
  {
    id: 63,
    section: "Your Parenting Life",
    subsection: "Education (Institution)",
    type: "M",
    text: "We commit to our children's educational institution, what is your approach?",
    options: [
      "We are committed to educating our children in the public school system",
      "We are committed to educating our children in private school",
      "We are committed to homeschooling our children",
      "We are committed to a flexible learning experience where we're committed to the best local educational environment which could vary between all school types based on location, outcomes, pricing and more"
    ],
    weight: 4
  },
  {
    id: 64,
    section: "Your Family/Home Life",
    subsection: "Traditions: Family Dinner [Excludes Date Night]",
    type: "M",
    text: "We commit to family dinner traditions, what is your approach?",
    options: [
      "We are committed to eating dinner as a family every single day, outside of unique and rare circumstances",
      "We are committed to eating dinner as a family at least once weekly",
      "We are committed to eating dinner as a family at least once monthly",
      "Other approach to family dinner traditions"
    ],
    weight: 3
  },
  {
    id: 65,
    section: "Your Family/Home Life",
    subsection: "Traditions: Family Vacations",
    type: "M",
    text: "We commit to family vacation traditions, what is your approach?",
    options: [
      "We are committed to budgeting, planning and going on at least one family vacation per year",
      "We are committed to budgeting, planning and going on at least two family vacations per year",
      "Other approach to family vacation traditions"
    ],
    weight: 2
  },
  {
    id: 66,
    section: "Your Family/Home Life",
    subsection: "Traditions: Family Photos",
    type: "M",
    text: "We commit to family photo traditions, what is your approach?",
    options: [
      "We are committed to taking a full immediate family photo at least once per year",
      "We are committed to taking a full immediate family photo at least once every two years",
      "Other approach to family photo traditions"
    ],
    weight: 1
  },
  {
    id: 67,
    section: "Your Family/Home Life",
    subsection: "House Cleaning & Maintenance",
    type: "M",
    text: "We commit to house cleaning and maintenance responsibilities, what is your approach?",
    options: [
      "In view of gifting and capacity, we commit to being the primary individual in our family who manages and executes the periodic functions of our house cleaning and maintenance, which includes but is not limited to cleaning and maintenance of living space, laundry and dry cleaning",
      "We commit to not conflating this role and responsibility with function as always being the one executing the function/ responsibility day to day. What this means is is primarily and ultimately responsible and accountable for seeing it get done, within the financial and capacity constraints of the family"
    ],
    weight: 3
  },
  {
    id: 68,
    section: "Your Family/Home Life",
    subsection: "Cleaning Model with Home (Inside)",
    type: "M",
    text: "We commit to a home cleaning model, what is your approach?",
    options: [
      "We commit to a model of weekly house cleaning taking place on Saturdays or Sundays which includes but is not limited to, cleaning of general living areas, kitchen, bathrooms and bedrooms and laundry (assumption of general tidiness, cleaning after self during the week)",
      "We commit to a model of bi-weekly house cleaning taking place on Saturdays or Sundays which includes but is not limited to, cleaning of general living areas, kitchen, bathrooms and bedrooms and laundry (assumption of general tidiness, cleaning after self during the week)",
      "We commit to a model of bi-weekly house cleaning by an outside cleaning vendor which includes but is not limited to, cleaning of general living areas, kitchen, bathrooms and bedrooms and laundry (assumption of general tidiness, cleaning after self during the week)",
      "Other approach to home cleaning model"
    ],
    weight: 2
  },
  {
    id: 69,
    section: "Your Family/Home Life",
    subsection: "Cleaning Model with Food",
    type: "M",
    text: "We commit to a food preparation and cleanup model, what is your approach?",
    options: [
      "We commit to a model where the person who prepares the food is not the person who cleans up the kitchen, sink and table after the food is prepared and consumed. It is the responsibility of the noncooking spouse/children to clean",
      "We commit to a model where the person who prepares the food is responsible for cleaning up after the meal is done",
      "We commit to a model where the person who prepares the food is responsible for cleaning up as they cook and after the meal is done",
      "Other approach to food preparation and cleanup model"
    ],
    weight: 2
  },
  {
    id: 70,
    section: "Your Family/Home Life",
    subsection: "Cleaning Model with Home (Outside)",
    type: "M",
    text: "We commit to outdoor home maintenance, what is your approach?",
    options: [
      "We commit to a model of weekly outside housework taking place on Saturdays or Sundays which includes but is not limited to, cleaning of vehicles, lawn care, cleaning of trash & recycling bins, deck, sidewalk and general gardening",
      "We commit to a model of monthly outside housework taking place on Saturdays or Sundays which includes but is not limited to, cleaning of vehicles, lawn care, cleaning of trash & recycling bins, deck, sidewalk and general gardening",
      "We commit to a model of outside housework by a hired outside vendor which includes but is not limited to, cleaning of vehicles, lawn care, cleaning of trash & recycling bins, deck, sidewalk and general gardening",
      "Other approach to outdoor home maintenance"
    ],
    weight: 2
  },
  {
    id: 71,
    section: "Your Family/Home Life",
    subsection: "Traditions: Family Outings",
    type: "M",
    text: "We commit to family outing traditions, what is your approach?",
    options: [
      "We are committed to doing at least one outing as a family at least once weekly",
      "We are committed to doing at least one outing as a family at least bi-weekly",
      "We are committed to doing at least one outing as a family at least monthly",
      "Other approach to family outing traditions"
    ],
    weight: 2
  },
  {
    id: 72,
    section: "Your Finances",
    subsection: "The Overall Model",
    type: "M",
    text: "We commit to a financial model, what is your approach?",
    options: [
      "We commit to having a \"One Flesh, One Financial\" model where any and every amount of income generated by either spouse is considered the family's resources and is budgeted and apportioned against our prayerfully planned annual budget",
      "Other: Before committing to this we need further discussion in our session around how this would operate"
    ],
    weight: 8
  },
  {
    id: 73,
    section: "Your Finances",
    subsection: "Financial Planning Model",
    type: "M",
    text: "We commit to financial planning and budgeting, what is your approach?",
    options: [
      "We commit to developing an annual budget, with monthly discussions on the of each month, around our status (actuals) against our goals",
      "We commit to working with a financial advisor, who will help us develop an annual budget, with monthly discussion around our status (actuals) against our goals",
      "We commit to developing an annual budget, with bi-monthly discussions on the of every other month, around our status (actuals) against our goals",
      "Other approach to financial planning and budgeting"
    ],
    weight: 5
  },
  {
    id: 74,
    section: "Your Finances",
    subsection: "Financial Management Model",
    type: "M",
    text: "We commit to financial management responsibilities, what is your approach?",
    options: [
      "In view of gifting and capacity, we commit to being the primary individual in our family who manages the periodic functions of our finances, which includes but is not limited to, developing the budget, financial reconciliations, bill-payment and investment related asset management and allocation",
      "Other: We commit to having a licensed financial professional handle and manage all of our financial matters. We commit to at least monthly updates (indefinitely) with the professional of our choosing"
    ],
    weight: 5
  },
  {
    id: 75,
    section: "Your Finances",
    subsection: "Financial Generosity (in Faith)",
    type: "M",
    text: "We commit to financial generosity in faith, what is your approach?",
    options: [
      "We commit to giving at least 10% of our net income to our faith community monthly",
      "We commit to giving at least 2% of our net income to our faith community monthly, with the goal of increasing giving by 1% each year",
      "We commit to giving at least 10% of our net income to our faith community and at least 2% to causes and missions we believe in",
      "Other approach to financial generosity in faith"
    ],
    weight: 6
  },
  {
    id: 76,
    section: "Your Finances",
    subsection: "Financial Management: Payments Execution (Public Social)",
    type: "M",
    text: "We commit to payment execution in social settings, what is your approach?",
    options: [
      "We're committed to paying for social outings, based on who initiated the outing",
      "We're committed to paying for social outings, based on whoever has the means at that moment",
      "We're committed to paying for social outings, with the male generally being the one pulling out the card"
    ],
    weight: 2
  },
  {
    id: 77,
    section: "Your Finances",
    subsection: "Financial Management: with Children (Allowance)",
    type: "M",
    text: "We commit to children's allowance and financial education, what is your approach?",
    options: [
      "We commit to giving our children a weekly allowance as an opportunity to teach financial stewardship",
      "While we believe in teaching our children proper financial stewardship, we do not believe in giving them an allowance. We will provide resources as needed and available",
      "We commit to giving our children a monthly allowance as an opportunity to teach stewardship",
      "Other approach to children's allowance and financial education"
    ],
    weight: 2
  },
  {
    id: 78,
    section: "Your Finances",
    subsection: "Financial Management: with Children (Investments / Savings)",
    type: "M",
    text: "We commit to children's investments and savings, what is your approach?",
    options: [
      "We commit to opening a 529 plan/account for our children after they are born and depositing a budget sensitive amount monthly",
      "We commit to opening a savings account for our children after they are born and depositing a budget sensitive amount monthly",
      "We commit to opening a brokerage account for our children after they are born and depositing a budget sensitive amount monthly",
      "We commit to opening both a 529 plan/account and a brokerage account for our children after they are born and depositing a budget sensitive amount monthly",
      "Other approach to children's investments and savings"
    ],
    weight: 2
  },
  {
    id: 79,
    section: "Your Family/Home Life",
    subsection: "Food Preparation & Planning: Overall Model: Responsibility",
    type: "M",
    text: "We commit to food preparation and planning responsibilities, what is your approach?",
    options: [
      "We commit to having be responsible for the overall food planning and preparation for the family, with considerations made for date night, family outings and circumstances when one is unable to do. (80/20)",
      "We commit to having be responsible for the overall food planning and preparation for the family, with a split of being responsible for meals during the week (M-Fri) and being responsible for meals during the weekend",
      "We commit to having a chef / nanny be responsible for the overall food planning and preparation for the family",
      "Other approach to food preparation and planning responsibilities"
    ],
    weight: 4
  },
  {
    id: 80,
    section: "Your Family/Home Life",
    subsection: "Financial Stewardship & Nutrition Health Goals",
    type: "M",
    text: "We commit to financial stewardship and nutrition health goals, what is your approach?",
    options: [
      "We commit to meal planning weekly and batch cooking (if doing it ourselves) with a goal of minimizing eating out to 1x per week for both stewardship and health benefits",
      "We commit to meal planning weekly and batch cooking (if doing it ourselves) with a goal of minimizing eating out to 2x per week for both stewardship and health benefits",
      "We commit to meal planning weekly and batch cooking (if doing it ourselves) with a goal of minimizing eating out to 3x per week for both stewardship and health benefits",
      "Other approach to financial stewardship and nutrition health goals"
    ],
    weight: 3
  },
  {
    id: 81,
    section: "Your Health and Wellness",
    subsection: "Approach to Medicine, Illness and Pain Management",
    type: "M",
    text: "We commit to healthy eating as a family, what is your approach?",
    options: [
      "We commit to preparing and enjoying healthy meals as a family, as defined by completely restricting fried food, fast food, candy as well as any other non-whole, highly processed junk foods from our family's consumption at least 5 of the 7 days per week",
      "We commit to preparing and enjoying healthy meals as a family, as defined by completely restricting fried food, fast food, candy as well as any other non-whole, highly processed junk foods from our family's consumption at least 4 of the 7 days per week",
      "Other approach to healthy eating as a family"
    ],
    weight: 4
  },
  {
    id: 82,
    section: "Your Health and Wellness",
    subsection: "Specific Consumption Goals [Meal Types]",
    type: "M",
    text: "We commit to specific dietary choices, what is your approach?",
    options: [
      "We commit to a healthy balanced diet with no special restriction on any meats (seafood, chicken, beef, pork), dairy, fruits and vegetables, and whole grains or nuts",
      "We commit to a healthy balanced diet including all meats except pork (seafood, chicken, beef), dairy, fruits and vegetables, and whole grains or nuts",
      "We commit to a healthy balanced vegetarian diet",
      "We commit to a healthy balanced pescatarian diet",
      "We commit to a healthy balanced diet which is flexible to individual needs (e.g., husband can pursue carnivore and wife can pursue vegetarian, while children can be unrestricted, for example)"
    ],
    weight: 4
  },
  {
    id: 83,
    section: "Your Health and Wellness",
    subsection: "New Babies: Nutrition: Breastfeeding",
    type: "M",
    text: "We commit to infant nutrition and breastfeeding, what is your approach?",
    options: [
      "We commit to breastfeeding primarily and only using formula in rare circumstances",
      "We commit to breastfeeding whenever possible, still, we do not have any reservations about relying on high quality formula",
      "Not Applicable"
    ],
    weight: 3
  },
  {
    id: 87,
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
    id: 88,
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
    id: 84,
    section: "Your Health and Wellness",
    subsection: "Diet Expectations",
    type: "D",
    text: "I believe we should follow the same dietary approach.",
    options: [
      "We do believe spouses should generally follow the same dietary approach",
      "We do not believe spouses need to follow identical diets and can have individual approaches"
    ],
    weight: 3
  },
  {
    id: 85,
    section: "Your Health and Wellness",
    subsection: "Medical Approaches",
    type: "D",
    text: "I believe in using alternative/holistic medicine alongside conventional medicine.",
    options: [
      "We do believe in incorporating alternative/holistic approaches alongside conventional medicine",
      "We do not believe in alternative medicine and prefer to rely solely on conventional medical treatments"
    ],
    weight: 4
  },
  {
    id: 86,
    section: "Your Health and Wellness",
    subsection: "Regular Checkups",
    type: "D",
    text: "I believe in getting regular preventative medical checkups.",
    options: [
      "We do believe in getting regular preventative medical and dental checkups",
      "We do not believe routine checkups are necessary unless specific health concerns arise"
    ],
    weight: 4
  },
  {
    id: 89,
    section: "Your Marriage and Boundaries",
    subsection: "Device-Free Time",
    type: "D",
    text: "I believe we should have regular device-free time together.",
    options: [
      "We do believe in having regular scheduled device-free time for connection",
      "We do not believe formally scheduling device-free time is necessary"
    ],
    weight: 4
  },
  // Next, adding additional authentic questions to reach the full 100
  {
    id: 90,
    section: "Your Marriage Life",
    subsection: "Sex - Initiation",
    type: "M",
    text: "We commit to physical intimacy initiation, what is your approach?",
    options: [
      "We commit to alternating who initiates sex by week",
      "We commit to alternating who initiates sex by day/instance",
      "We commit to \"letting it flow\" naturally without a set alternation schedule, with that said, we each willingly acknowledge it is not the responsibility of one spouse to initiate a duty before God"
    ],
    weight: 5
  },
  {
    id: 91,
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
    id: 92,
    section: "Your Marriage Life",
    subsection: "Sex - Contraception",
    type: "M",
    text: "We commit to family planning and contraception, what is your approach?",
    options: [
      "We do not plan to use contraception of any form during marriage",
      "We plan to use contraception, but we do not plan to use any which require oral consumption (health concerns/considerations) or invasive surgery (vasectomy, fallopian \"tubes tied\")",
      "We plan to use all forms of contraception available to us which includes oral consumption and/or invasive surgery as an option (vasectomy, fallopian \"tubes tied\")"
    ],
    weight: 5
  },
  {
    id: 93,
    section: "Your Marriage Life",
    subsection: "Sex - Boundaries",
    type: "D",
    text: "We commit to never discussing our sex lives with anyone (friends, colleagues, and family members) unless we mutually agree to seek outside counsel on that aspect of our relationship.",
    options: [
      "We commit to never discussing our sex lives with anyone (friends, colleagues, and family members) unless we mutually agree to seek outside counsel on that aspect of our relationship",
      "We disagree with this statement"
    ],
    weight: 6
  },
  {
    id: 94,
    section: "Your Marriage Life with Children",
    subsection: "Children Decision: How To Have Them (Method of Delivery Preference)",
    type: "M",
    text: "We commit to childbirth delivery method, what is your preference?",
    options: [
      "We recognize the most important outcome we desire is for a healthy delivery for both the mother and the child, with that said, to the extent we can plan, we'd prefer: A Water Delivery (if medically prudent and possible)",
      "We recognize the most important outcome we desire is for a healthy delivery for both the mother and the child, with that said, to the extent we can plan, we'd prefer: Vaginal Delivery (with potential for C-Section if medically necessary)",
      "Not Applicable"
    ],
    weight: 3
  },
  {
    id: 95,
    section: "Your Marriage Life with Children",
    subsection: "Children Decision: Where To Have Them (Location Preference)",
    type: "M",
    text: "We commit to childbirth location, what is your preference?",
    options: [
      "We recognize the most important outcome we desire is for a healthy delivery for both the mother and the child, with that said, to the extent we can plan, we'd prefer: A Home Birth (if medically prudent and possible)",
      "We recognize the most important outcome we desire is for a healthy delivery for both the mother and the child, with that said, to the extent we can plan, we'd prefer: A Hospital Birth",
      "We recognize the most important outcome we desire is for a healthy delivery for both the mother and the child, with that said, to the extent we can plan, we'd prefer: A Birth Center (if medically prudent and possible)",
      "Not Applicable"
    ],
    weight: 3
  },
  {
    id: 96,
    section: "Your Marriage Life with Children",
    subsection: "Children Decision: Number of Children (Adopted)",
    type: "M",
    text: "We commit to adoption, what is your approach?",
    options: [
      "We commit to adopting at least one child during our marriage",
      "We admire and believe in adoption but do not plan to adopt during our marriage",
      "We are committed to having children biologically (according to God's will), but would consider adoption if we discern it's not His will for us to have children biologically",
      "Not Applicable"
    ],
    weight: 4
  },
  {
    id: 97,
    section: "Your Marriage Life with Children",
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
    id: 98,
    section: "Your Marriage Life with Children",
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
    id: 99,
    section: "Your Marriage Life with Children",
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

];
