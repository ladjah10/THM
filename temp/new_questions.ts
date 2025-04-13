import { Question } from "@/types/assessment";

// Define sections based on the PDF
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

// Questions from the authentic 100 Marriage Assessment PDF
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
    text: "Your Foundation: Marriage + Family Accountability - I believe in accountability for my marriage.",
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
    text: "Your Foundation: Marriage & Your Children's Faith - How do you plan to raise your children?",
    options: [
      "We believe we have a responsibility to raise our children according to the Christian faith, intentionally teaching them and raising them according to its expectations while leaving space for them to develop their own personal relationship with Jesus Christ and hopefully make a decision to give their life to Jesus Christ",
      "Disagree"
    ],
    weight: 12
  },
  {
    id: 4,
    section: "Your Foundation",
    subsection: "Marriage Mindset: Happiness",
    type: "M",
    text: "Your Foundation: Marriage Mindset: Happiness - What is your primary focus in marriage?",
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
    text: "Your Foundation: Marriage Preparation: Legal (Incapacitation) - What is your position on Power of Attorney?",
    options: [
      "We're committed to preparing in advance of our marriage to ensuring we are each well cared for in the undesired, unfortunate and rare case of incapacitating illness and or premature death, as such, we are each committed to establishing our spouse as Power of Attorney before our marriage date",
      "Disagree"
    ],
    weight: 5
  },
  {
    id: 6,
    section: "Your Foundation",
    subsection: "Marriage Preparation: Legal (Estate)",
    type: "D",
    text: "Your Foundation: Marriage Preparation: Legal (Estate) - What is your position on creating a will?",
    options: [
      "We're committed to preparing in advance of our marriage to ensuring we are each well cared for in the undesired, unfortunate and rare case of incapacitating illness and or premature death, as such, we are each committed to establishing completing a notarized copy of our will before our marriage date",
      "Disagree"
    ],
    weight: 5
  },
  {
    id: 7,
    section: "Your Foundation",
    subsection: "Marriage Mindset: Divorce",
    type: "D",
    text: "Your Foundation: Marriage Mindset: Divorce - What is your position on divorce?",
    options: [
      "We are committed to a lifelong marriage and do not see divorce as an exercisable option for any reasons outside of biblical (adultery & abandonment) or personal safety grounds (physical abuse and professionally evaluated and validated, psychological harm), including but not limited to: Unhappiness, 'Falling Out of Love', 'Growing Apart', 'Irreconcilable Differences'",
      "Disagree"
    ],
    weight: 12
  },
  {
    id: 8,
    section: "Your Foundation",
    subsection: "Marriage Mindset: Divorce & Law",
    type: "M",
    text: "Your Foundation: Marriage Mindset: Divorce & Law - What is your position on prenuptial agreements?",
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
    text: "Your Foundation: Marriage Mindset: Celebrating our Covenant - How do you plan to celebrate your marriage?",
    options: [
      "We're committed to celebrating both the anniversary of our first date and the anniversary of our wedding day each and every year.",
      "We're committed to celebrating the anniversary of our wedding day each and every year.",
      "We're committed to celebrating whenever we remember and/or when our schedules align, but don't believe anniversaries are as important as the day-to-day love we show to one another."
    ],
    weight: 4
  },
  {
    id: 10,
    section: "Your Foundation",
    subsection: "Marriage Priorities",
    type: "M",
    text: "Your Marriage Life: Order of Priority before God - What is your order of priority?",
    options: [
      "God, Spouse, Children, Work, Extended Family, Friends, Church, Ministry, Hobbies",
      "God, Children, Spouse, Work, Extended Family, Friends, Church, Ministry, Hobbies",
      "God, Work, Spouse, Children, Extended Family, Friends, Church, Ministry, Hobbies",
      "God, Extended Family, Spouse, Children, Work, Friends, Church, Ministry, Hobbies"
    ],
    weight: 12
  },
  
  // YOUR FAITH LIFE
  {
    id: 11,
    section: "Your Faith Life",
    subsection: "Church Community",
    type: "D",
    text: "Your Faith Life: Church Community - Will you attend the same church as a family?",
    options: [
      "We're committed to finding a single church which to attend both individually and as a family.",
      "We're comfortable with having separate churches to attend individually and as a family."
    ],
    weight: 12
  },
  {
    id: 12,
    section: "Your Faith Life",
    subsection: "Worship Life: Marriage",
    type: "M",
    text: "Your Faith Life: Worship Life: Marriage (Husband and Wife) - How often do you plan to pray together?",
    options: [
      "Daily",
      "Weekly",
      "Monthly",
      "Whenever we feel like it or the need arises"
    ],
    weight: 4
  },
  {
    id: 13,
    section: "Your Faith Life",
    subsection: "Worship Life: Family",
    type: "M",
    text: "Your Faith Life: Worship Life: Family - How often do you plan to have family worship?",
    options: [
      "Daily",
      "Weekly",
      "Monthly",
      "Whenever we feel like it or the need arises"
    ],
    weight: 4
  },
  {
    id: 14,
    section: "Your Faith Life",
    subsection: "Worship Life: Serving",
    type: "M",
    text: "Your Faith Life: Worship Life: Serving - How do you plan to volunteer in your community?",
    options: [
      "We're committed to actively volunteering in our church community.",
      "We're committed to actively volunteering in our broader community.",
      "We're committed to actively volunteering in both our church and broader community.",
      "We don't believe volunteering is an important activity for us to commit to in advance."
    ],
    weight: 3
  },
  
  // YOUR MARRIAGE LIFE
  {
    id: 15,
    section: "Your Marriage Life",
    subsection: "Family Name",
    type: "M",
    text: "Your Marriage Life: Family Name - What is your position on family names after marriage?",
    options: [
      "We believe the wife should take the husband's last name and change her current last name to her middle name.",
      "We believe the wife should take the husband's last name and drop her last name.",
      "We believe the wife should maintain her own last name and not take the husband's last name.",
      "We believe the wife should hyphenate her last name with the husband's last name.",
      "We believe the husband should take the wife's last name."
    ],
    weight: 7
  },
  {
    id: 16,
    section: "Your Marriage Life",
    subsection: "Communication & Conflict Resolution",
    type: "D",
    text: "Your Marriage Life: Communication & Conflict Resolution - I believe we should not fight in front of others.",
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
    text: "Your Marriage Life: Communication & Conflict Resolution (Discuss with others) - I believe we should never discuss issues with others before discussing with spouse.",
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
    text: "Your Marriage Life: Communication & Conflict Resolution:2 (24 hours) - I believe we should not go more than 24 hours without speaking.",
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
    text: "Your Marriage Life: Communication & Conflict Resolution:3 (Text) - I believe we should not discuss serious issues via text.",
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
    text: "Your Marriage Life: Communication & Conflict Resolution:4 (Sleep angry) - I believe we should not sleep angry.",
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
    text: "Your Marriage Life: Communication & Conflict Resolution:5 (Same bed) - I believe we should always sleep in the same bed.",
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
    text: "Your Marriage Life: Communication & Conflict Resolution:6 (Sex as weapon) - I believe we should never withhold sex as punishment.",
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
    text: "Your Marriage Life: Communication & Conflict Resolution:7 (Silence as weapon) - I believe we should never use silence as punishment.",
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
    text: "Your Marriage Life: Communication & Conflict Resolution: Counseling - How often would you attend marriage counseling?",
    options: [
      "Regularly (at least once every 90 days) via check-in sessions",
      "Only when there's a problem, disagreement and/or difficulty we can't resolve on our own",
      "Never, we don't believe in using outside support for our marriage issues"
    ],
    weight: 3
  },
  {
    id: 25,
    section: "Your Marriage Life",
    subsection: "Decision Making",
    type: "D",
    text: "Your Marriage Life: Decision Making - I believe the husband should be the final authority in decision making.",
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
    text: "Your Marriage Life: Dedicated Time (Fellowship) - How often do you plan to have date nights?",
    options: [
      "Weekly",
      "Bi-weekly",
      "Monthly",
      "When our schedule allows"
    ],
    weight: 7
  },
  {
    id: 27,
    section: "Your Marriage Life",
    subsection: "Marriage: Dedicated Time",
    type: "M",
    text: "Your Marriage Life: Marriage: Dedicated Time - How often would you have marriage check-ins?",
    options: [
      "Weekly",
      "Monthly",
      "Quarterly",
      "Annually",
      "Never"
    ],
    weight: 5
  },
  {
    id: 28,
    section: "Your Marriage Life",
    subsection: "Living – Room Boundaries (Electronics)",
    type: "D",
    text: "Your Marriage Life: Living – Room Boundaries (Electronics) - I believe we should not have electronics in the bedroom.",
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
    text: "Your Marriage Life: Relationship Model (Work/Home) - What is your preferred work arrangement?",
    options: [
      "One Spouse Stays Home",
      "Both Spouses Work Outside Home",
      "One Spouse Work from Home",
      "Both Spouses Work from Home"
    ],
    weight: 3
  },
  {
    id: 30,
    section: "Your Marriage Life",
    subsection: "Relationship Model (Travel)",
    type: "M",
    text: "Your Marriage Life: Relationship Model (Travel) - What is your maximum time apart due to travel?",
    options: [
      "No more than 2 days",
      "No more than 4 days",
      "No more than 7 days",
      "No more than 14 days"
    ],
    weight: 3
  },
  {
    id: 31,
    section: "Your Marriage Life",
    subsection: "Relationship Model (Late Night Work)",
    type: "M",
    text: "Your Marriage Life: Relationship Model (Late Night Work) - How many late work nights per week?",
    options: [
      "0",
      "1",
      "2",
      "3+"
    ],
    weight: 3
  },
  {
    id: 32,
    section: "Your Marriage Life",
    subsection: "Relationship Model (Work Down Time)",
    type: "M",
    text: "Your Marriage Life: Relationship Model (Work Down Time) - How much daily downtime do you need?",
    options: [
      "None (I'm energized by others)",
      "15-30 minutes",
      "30-60 minutes",
      "60+ minutes"
    ],
    weight: 3
  },
  {
    id: 33,
    section: "Your Marriage Life",
    subsection: "Marriage: Living – Rooting",
    type: "M",
    text: "Your Marriage Life: Marriage: Living – Rooting - What is your preference for where to live?",
    options: [
      "Near Husband's Family",
      "Near Wife's Family",
      "Equidistant to Both Families",
      "Away from Both Families",
      "International"
    ],
    weight: 3
  },
  {
    id: 34,
    section: "Your Marriage Life",
    subsection: "Marriage: Living – City Type",
    type: "M",
    text: "Your Marriage Life: Marriage: Living – City Type - What type of area do you prefer to live in?",
    options: [
      "Urban",
      "Suburban",
      "Rural"
    ],
    weight: 3
  },
  {
    id: 35,
    section: "Your Marriage Life",
    subsection: "Marriage: Living – Home Type",
    type: "M",
    text: "Your Marriage Life: Marriage: Living – Home Type - What type of home do you prefer?",
    options: [
      "Apartment",
      "Townhouse",
      "Single-Family House",
      "Multi-Family House"
    ],
    weight: 3
  },
  {
    id: 36,
    section: "Your Marriage Life",
    subsection: "Marriage: Living – Domestic/International",
    type: "M",
    text: "Your Marriage Life: Marriage: Living – Domestic/International - Would you be willing to live internationally?",
    options: [
      "Yes, for the long-term",
      "Yes, for the short-term",
      "No",
      "Only for extended vacation"
    ],
    weight: 3
  },
  
  // YOUR PARENTING LIFE
  {
    id: 37,
    section: "Your Parenting Life",
    subsection: "Children: Desire",
    type: "M",
    text: "Your Parenting Life: Children: Desire - Do you want to have children?",
    options: [
      "We both want to have biological children",
      "We both want to adopt children",
      "We both want to have both biological and adopted children",
      "We both don't want to have children",
      "We are divided on this issue"
    ],
    weight: 12
  },
  {
    id: 38,
    section: "Your Parenting Life",
    subsection: "Children: Timing",
    type: "M",
    text: "Your Parenting Life: Children: Timing - When do you want to have children?",
    options: [
      "Immediately after marriage",
      "After 1-2 years of marriage",
      "After 3-5 years of marriage",
      "Only after we are financially stable",
      "Never"
    ],
    weight: 5
  },
  {
    id: 39,
    section: "Your Parenting Life",
    subsection: "Children: Quantity",
    type: "M",
    text: "Your Parenting Life: Children: Quantity - How many children do you want?",
    options: [
      "0",
      "1-2",
      "3-4",
      "5+"
    ],
    weight: 5
  },
  {
    id: 40,
    section: "Your Parenting Life",
    subsection: "Children: Parenting Style",
    type: "M",
    text: "Your Parenting Life: Children: Parenting Style - What's your preferred parenting style?",
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
    text: "Your Parenting Life: Children: Discipline - What's your approach to discipline?",
    options: [
      "Positive reinforcement only",
      "Verbal correction and time-outs",
      "Spanking as needed",
      "Consequences based on behavior"
    ],
    weight: 7
  },
  {
    id: 42,
    section: "Your Parenting Life",
    subsection: "Children: Education",
    type: "M",
    text: "Your Parenting Life: Children: Education - What type of education do you prefer for your children?",
    options: [
      "Public school",
      "Private religious school",
      "Private secular school",
      "Homeschool"
    ],
    weight: 5
  },
  
  // YOUR FAMILY/HOME LIFE
  {
    id: 43,
    section: "Your Family/Home Life",
    subsection: "Extended Family: Boundaries",
    type: "D",
    text: "Your Family/Home Life: Extended Family: Boundaries - Do you agree that your spouse should come before extended family?",
    options: [
      "Agree",
      "Disagree"
    ],
    weight: 12
  },
  {
    id: 44,
    section: "Your Family/Home Life",
    subsection: "Extended Family: Living With Parents",
    type: "D",
    text: "Your Family/Home Life: Extended Family: Living With Parents - Would you be willing to have parents live with you?",
    options: [
      "Yes, permanently if needed",
      "Yes, but only temporarily",
      "No, unless extremely necessary",
      "Never under any circumstances"
    ],
    weight: 5
  },
  {
    id: 45,
    section: "Your Family/Home Life",
    subsection: "Extended Family: Money To Parents",
    type: "D",
    text: "Your Family/Home Life: Extended Family: Money To Parents - Are you willing to financially support parents?",
    options: [
      "Yes, regularly and substantially",
      "Yes, occasionally as needed",
      "Only in emergencies",
      "No, we need to focus on our own finances"
    ],
    weight: 5
  },
  {
    id: 46,
    section: "Your Family/Home Life",
    subsection: "Holidays",
    type: "M",
    text: "Your Family/Home Life: Holidays - How do you prefer to spend holidays?",
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
    text: "Your Family/Home Life: Home Management: Chores - How will you divide household responsibilities?",
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
    text: "Your Finances: Financial Philosophy: Combined - Do you agree all finances should be combined?",
    options: [
      "Agree",
      "Disagree"
    ],
    weight: 12
  },
  {
    id: 49,
    section: "Your Finances",
    subsection: "Financial Philosophy: Tithing",
    type: "D",
    text: "Your Finances: Financial Philosophy: Tithing - Do you believe in tithing/giving to charity?",
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
    section: "Your Finances",
    subsection: "Financial Philosophy: Emergency Fund",
    type: "M",
    text: "Your Finances: Financial Philosophy: Emergency Fund - How much emergency savings do you think is necessary?",
    options: [
      "Less than 1 month of expenses",
      "1-3 months of expenses",
      "3-6 months of expenses",
      "6+ months of expenses"
    ],
    weight: 3
  },
  {
    id: 51,
    section: "Your Finances",
    subsection: "Financial Philosophy: Debt",
    type: "M",
    text: "Your Finances: Financial Philosophy: Debt - What's your approach to debt?",
    options: [
      "All debt is bad, avoid completely",
      "Mortgage only, no other debt",
      "Strategic debt is acceptable (education, mortgage, etc.)",
      "Debt is a tool that can be used freely"
    ],
    weight: 5
  },
  {
    id: 52,
    section: "Your Finances",
    subsection: "Financial Decisions: Large Purchases",
    type: "M",
    text: "Your Finances: Financial Decisions: Large Purchases - At what amount should you consult your spouse before spending?",
    options: [
      "$100 or more",
      "$500 or more",
      "$1000 or more",
      "Any amount that affects the monthly budget"
    ],
    weight: 5
  },
  
  // YOUR HEALTH AND WELLNESS
  {
    id: 53,
    section: "Your Health and Wellness",
    subsection: "Physical Health: Exercise",
    type: "M",
    text: "Your Health and Wellness: Physical Health: Exercise - What are your expectations for physical fitness?",
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
    text: "Your Health and Wellness: Mental Health: Therapy - Are you open to individual or couples therapy?",
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
    section: "Your Health and Wellness",
    subsection: "Substance Use: Alcohol",
    type: "M",
    text: "Your Health and Wellness: Substance Use: Alcohol - What are your views on alcohol use?",
    options: [
      "Both abstain completely",
      "Moderate use in social settings only",
      "Regular moderate consumption is acceptable",
      "Different standards for each spouse"
    ],
    weight: 5
  },
  {
    id: 56,
    section: "Your Health and Wellness",
    subsection: "Medical Decisions",
    type: "D",
    text: "Your Health and Wellness: Medical Decisions - How will you approach major medical decisions?",
    options: [
      "Joint decision-making for all major medical issues",
      "Each spouse makes their own medical decisions",
      "Final authority goes to the spouse receiving treatment",
      "Decisions guided primarily by medical professionals"
    ],
    weight: 5
  },
  
  // YOUR MARRIAGE AND BOUNDARIES
  {
    id: 57,
    section: "Your Marriage and Boundaries",
    subsection: "Opposite Sex Friendships",
    type: "M",
    text: "Your Marriage and Boundaries: Opposite Sex Friendships - What boundaries do you expect for opposite-sex friendships?",
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
    section: "Your Marriage and Boundaries",
    subsection: "Social Media Boundaries",
    type: "D",
    text: "Your Marriage and Boundaries: Social Media Boundaries - What level of social media transparency do you expect?",
    options: [
      "Complete access to all accounts and passwords",
      "No secrets but no need to share passwords",
      "Private accounts but appropriate online behavior",
      "Complete privacy in social media accounts"
    ],
    weight: 5
  },
  {
    id: 59,
    section: "Your Marriage and Boundaries",
    subsection: "Personal Privacy",
    type: "M",
    text: "Your Marriage and Boundaries: Personal Privacy - What level of personal privacy do you expect in marriage?",
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
    text: "Your Marriage and Boundaries: Sexual Boundaries - Do you agree that sexual intimacy is exclusive to marriage?",
    options: [
      "Agree",
      "Disagree"
    ],
    weight: 12
  },
  {
    id: 61,
    section: "Your Marriage and Boundaries",
    subsection: "Sexual Frequency",
    type: "M",
    text: "Your Marriage and Boundaries: Sexual Frequency - What are your expectations for sexual frequency?",
    options: [
      "Multiple times per week",
      "About once per week",
      "A few times per month",
      "No specific expectations"
    ],
    weight: 5
  },
];