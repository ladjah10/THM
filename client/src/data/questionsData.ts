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
      "We do not believe we have a responsibility to raise our children according to any specific faith tradition and prefer to let them choose their own spiritual path when they're old enough to decide"
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
      "We do not believe it's necessary to establish Power of Attorney before marriage and prefer to address this matter later if and when it becomes relevant"
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
      "We do not believe creating a will is necessary before marriage and prefer to address estate planning at a later stage in our relationship"
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
      "We believe that while marriage is intended to be lifelong, divorce may be a reasonable option in a wider range of circumstances, including when personal happiness and fulfillment are severely compromised"
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
      "We do believe disagreements should be kept private and not conducted in front of others",
      "We do not believe all disagreements need to be hidden from others and some can be respectfully discussed in public"
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
      "We do believe all marital issues should be discussed with our spouse before sharing with others",
      "We do not believe it's always necessary to discuss issues with our spouse first before seeking outside perspective"
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
      "We do believe couples should resolve conflicts and resume communication within 24 hours",
      "We do not believe there should be a strict timeframe for resolving conflicts and resuming communication"
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
      "We do believe serious relationship issues should be discussed in person rather than through text messages",
      "We do not believe the medium of communication matters as much as clear expression of thoughts and feelings"
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
      "We do believe couples should resolve conflicts before going to bed and not sleep while angry",
      "We do not believe every conflict must be resolved before sleeping and sometimes rest can provide needed perspective"
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
      "We do believe couples should always sleep in the same bed to maintain intimacy and connection",
      "We do not believe sleeping in separate beds occasionally compromises the marriage relationship"
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
  
  // Add more declaration questions for Marriage Life
  {
    id: 62,
    section: "Your Marriage Life",
    subsection: "Social Media Boundaries",
    type: "D",
    text: "Your Marriage Life: Social Media Boundaries - I believe we should have access to each other's social media accounts.",
    options: [
      "We do believe spouses should have access to each other's social media accounts for transparency and trust",
      "We do not believe spouses should have access to each other's social media accounts as this infringes on personal privacy"
    ],
    weight: 4
  },
  {
    id: 63,
    section: "Your Marriage Life",
    subsection: "Phone Privacy",
    type: "D",
    text: "Your Marriage Life: Phone Privacy - I believe we should have access to each other's phones.",
    options: [
      "We do believe spouses should have full access to each other's phones and passwords",
      "We do not believe spouses need access to each other's phones as that violates personal privacy"
    ],
    weight: 4
  },
  {
    id: 64,
    section: "Your Marriage Life",
    subsection: "Friendship Boundaries",
    type: "D",
    text: "Your Marriage Life: Friendship Boundaries - I believe we should limit close friendships with the opposite sex.",
    options: [
      "We do believe spouses should limit close one-on-one friendships with the opposite sex out of respect for our marriage",
      "We do not believe limiting friendships based on gender is necessary in a trusting marriage"
    ],
    weight: 5
  },
  {
    id: 65,
    section: "Your Marriage Life",
    subsection: "Spiritual Leadership",
    type: "D",
    text: "Your Marriage Life: Spiritual Leadership - I believe the husband should be the spiritual leader of the home.",
    options: [
      "We do believe the husband should take primary responsibility for spiritual leadership in the home",
      "We do not believe spiritual leadership is gender-specific and should be shared equally"
    ],
    weight: 6
  },
  {
    id: 66,
    section: "Your Marriage Life",
    subsection: "Financial Decisions",
    type: "D",
    text: "Your Marriage Life: Financial Decisions - I believe major financial decisions should be made together.",
    options: [
      "We do believe all major financial decisions should be discussed and agreed upon by both spouses",
      "We do not believe all financial decisions need joint approval and each spouse should have some autonomy"
    ],
    weight: 6
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
  
  // Add additional declaration questions (67-99) to reach 99 total
  {
    id: 67,
    section: "Your Faith Life",
    subsection: "Bible Study",
    type: "D",
    text: "Your Faith Life: Bible Study - I believe we should have regular Bible study together.",
    options: [
      "We do believe in having regular Bible study together as a couple",
      "We do not believe regular couple Bible study is necessary as long as we each maintain our own spiritual disciplines"
    ],
    weight: 5
  },
  {
    id: 68,
    section: "Your Faith Life",
    subsection: "Faith Mentorship",
    type: "D",
    text: "Your Faith Life: Faith Mentorship - I believe we should have spiritual mentors for our marriage.",
    options: [
      "We do believe having spiritual mentors or counselors for our marriage is important",
      "We do not believe having formal spiritual mentors is necessary for a healthy marriage"
    ],
    weight: 4
  },
  {
    id: 69,
    section: "Your Faith Life",
    subsection: "Sabbath Observance",
    type: "D",
    text: "Your Faith Life: Sabbath Observance - I believe we should set aside a sabbath day for rest and worship.",
    options: [
      "We do believe in setting aside a specific sabbath day for rest and worship", 
      "We do not believe formally observing a sabbath day is necessary for our faith practice"
    ],
    weight: 3
  },
  {
    id: 70,
    section: "Your Parenting Life",
    subsection: "Religious Education",
    type: "D",
    text: "Your Parenting Life: Religious Education - I believe our children should attend religious schools.",
    options: [
      "We do believe our children should attend religious schools for their education",
      "We do not believe religious schools are necessary for our children's education"
    ],
    weight: 5
  },
  {
    id: 71,
    section: "Your Parenting Life",
    subsection: "Gender Roles",
    type: "D",
    text: "Your Parenting Life: Gender Roles - I believe we should raise our children with traditional gender roles.",
    options: [
      "We do believe in raising our children with traditional gender roles and expectations",
      "We do not believe in emphasizing traditional gender roles when raising our children"
    ],
    weight: 6
  },
  {
    id: 72,
    section: "Your Parenting Life",
    subsection: "Technology Access",
    type: "D",
    text: "Your Parenting Life: Technology Access - I believe we should strictly limit our children's access to technology.",
    options: [
      "We do believe in strictly limiting and monitoring our children's access to technology",
      "We do not believe in strict limitations on technology but rather teaching responsible use"
    ],
    weight: 4
  },
  {
    id: 73,
    section: "Your Parenting Life",
    subsection: "Allowance",
    type: "D",
    text: "Your Parenting Life: Allowance - I believe children should earn allowance through chores.",
    options: [
      "We do believe children should earn allowance through completing chores and responsibilities",
      "We do not believe allowance should be tied to chores as children should contribute to the household regardless"
    ],
    weight: 3
  },
  {
    id: 74,
    section: "Your Parenting Life",
    subsection: "Extended Family Childcare",
    type: "D",
    text: "Your Parenting Life: Extended Family Childcare - I believe extended family should be involved in childcare.",
    options: [
      "We do believe extended family should be regularly involved in caring for our children",
      "We do not believe extended family should have a primary role in providing regular childcare"
    ],
    weight: 4
  },
  {
    id: 75,
    section: "Your Family/Home Life",
    subsection: "Housework Division",
    type: "D",
    text: "Your Family/Home Life: Housework Division - I believe housework should be divided based on traditional gender roles.",
    options: [
      "We do believe housework should generally follow traditional gender role divisions",
      "We do not believe housework should be divided based on gender but rather on preferences and availability"
    ],
    weight: 5
  },
  {
    id: 76,
    section: "Your Family/Home Life",
    subsection: "Home Decor Decisions",
    type: "D",
    text: "Your Family/Home Life: Home Decor Decisions - I believe home decoration decisions should be made together.",
    options: [
      "We do believe all home decoration decisions should be made jointly",
      "We do not believe all decoration decisions need joint approval and can be more independent"
    ],
    weight: 3
  },
  {
    id: 77,
    section: "Your Family/Home Life",
    subsection: "Pet Ownership",
    type: "D",
    text: "Your Family/Home Life: Pet Ownership - I believe pets are important members of the family.",
    options: [
      "We do believe pets are important family members and should be treated as such",
      "We do not believe pets should be considered equivalent to family members"
    ],
    weight: 3
  },
  {
    id: 78,
    section: "Your Family/Home Life",
    subsection: "Television Time",
    type: "D",
    text: "Your Family/Home Life: Television Time - I believe we should limit television/screen time in our home.",
    options: [
      "We do believe in setting strict limits on television and screen time in our home",
      "We do not believe strict screen time limits are necessary as long as other responsibilities are met"
    ],
    weight: 3
  },
  {
    id: 79,
    section: "Your Finances",
    subsection: "Saving Priority",
    type: "D",
    text: "Your Finances: Saving Priority - I believe saving for the future should be a top financial priority.",
    options: [
      "We do believe saving for the future should take priority over current lifestyle expenses",
      "We do not believe aggressive saving should come at the expense of enjoying life in the present"
    ],
    weight: 5
  },
  {
    id: 80,
    section: "Your Finances",
    subsection: "Financial Transparency",
    type: "D",
    text: "Your Finances: Financial Transparency - I believe we should have complete transparency about all spending.",
    options: [
      "We do believe in complete transparency and detailed accounting of all spending",
      "We do not believe every purchase needs to be reported as long as the budget is respected"
    ],
    weight: 5
  },
  {
    id: 81,
    section: "Your Finances",
    subsection: "Lending to Family",
    type: "D",
    text: "Your Finances: Lending to Family - I believe we should lend money to family members in need.",
    options: [
      "We do believe in lending or giving money to family members in need when we are able",
      "We do not believe in lending money to family as it can create relationship complications"
    ],
    weight: 5
  },
  {
    id: 82,
    section: "Your Finances",
    subsection: "Financial Education",
    type: "D",
    text: "Your Finances: Financial Education - I believe we should actively educate ourselves about finances.",
    options: [
      "We do believe in continually educating ourselves about financial management and investing",
      "We do not believe extensive financial education is necessary beyond basic budgeting skills"
    ],
    weight: 4
  },
  {
    id: 83,
    section: "Your Finances",
    subsection: "Giving Decisions",
    type: "D",
    text: "Your Finances: Giving Decisions - I believe charitable giving decisions should be made jointly.",
    options: [
      "We do believe all charitable giving decisions should be made together as a couple",
      "We do not believe all giving requires joint approval and each spouse should have some autonomy"
    ],
    weight: 4
  },
  {
    id: 84,
    section: "Your Health and Wellness",
    subsection: "Diet Expectations",
    type: "D",
    text: "Your Health and Wellness: Diet Expectations - I believe we should follow the same dietary approach.",
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
    text: "Your Health and Wellness: Medical Approaches - I believe in using alternative/holistic medicine alongside conventional medicine.",
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
    text: "Your Health and Wellness: Regular Checkups - I believe in getting regular preventative medical checkups.",
    options: [
      "We do believe in getting regular preventative medical and dental checkups",
      "We do not believe routine checkups are necessary unless specific health concerns arise"
    ],
    weight: 4
  },
  {
    id: 87,
    section: "Your Health and Wellness",
    subsection: "Mental Health Openness",
    type: "D",
    text: "Your Health and Wellness: Mental Health Openness - I believe in being open about mental health struggles.",
    options: [
      "We do believe in openly discussing and seeking help for mental health struggles",
      "We do not believe mental health issues need to be widely discussed outside of professional treatment"
    ],
    weight: 5
  },
  {
    id: 88,
    section: "Your Health and Wellness",
    subsection: "Health Accountability",
    type: "D",
    text: "Your Health and Wellness: Health Accountability - I believe spouses should hold each other accountable for health goals.",
    options: [
      "We do believe spouses should actively hold each other accountable for health goals",
      "We do not believe in imposing accountability and each person should manage their own health goals"
    ],
    weight: 4
  },
  {
    id: 89,
    section: "Your Marriage and Boundaries",
    subsection: "Device-Free Time",
    type: "D",
    text: "Your Marriage and Boundaries: Device-Free Time - I believe we should have regular device-free time together.",
    options: [
      "We do believe in having regular scheduled device-free time for connection",
      "We do not believe formally scheduling device-free time is necessary"
    ],
    weight: 4
  },
  
  // The following are authentic questions from the original book that were previously missing
  {
    id: 90,
    section: "Your Marriage Life",
    subsection: "Sex - Initiation",
    type: "M",
    text: "Your Marriage Life: Sex - Initiation",
    options: [
      "We commit to alternating who initiates sex by week.",
      "We commit to alternating who initiates sex by day/instance.",
      "We commit to \"letting it flow\" naturally without a set alternation schedule, with that said, we each willingly acknowledge it is not the responsibility of one spouse to initiate a duty before God."
    ],
    weight: 5
  },
  {
    id: 91,
    section: "Your Marriage Life",
    subsection: "Sex - Communication",
    type: "M",
    text: "Your Marriage Life: Sex - Communication",
    options: [
      "We commit to having a conversation within the first month about what we individually enjoy in sex with our spouse and what aspect of the experience, if anything, you would each enjoy more of.",
      "We commit to having a conversation within the first 3 months about what we individually enjoy in sex with our spouse and what aspect of the experience, if anything, you would each enjoy more of.",
      "We commit to having a conversation within the first 6 months about what we individually enjoy in sex with our spouse and what aspect of the experience, if anything, you would each enjoy more of.",
      "Other: Before committing to this we need further discussion in our session around how this would operate."
    ],
    weight: 5
  },
  {
    id: 92,
    section: "Your Marriage Life",
    subsection: "Sex - Contraception",
    type: "M",
    text: "Your Marriage Life: Sex - Contraception",
    options: [
      "We do not plan to use contraception of any form during marriage.",
      "We plan to use contraception, but we do not plan to use any which require oral consumption (health concerns/considerations) or invasive surgery (vasectomy, fallopian \"tubes tied\").",
      "We plan to use all forms of contraception available to us which includes oral consumption and/or invasive surgery as an option (vasectomy, fallopian \"tubes tied\")."
    ],
    weight: 5
  },
  {
    id: 93,
    section: "Your Marriage Life",
    subsection: "Sex - Boundaries",
    type: "D",
    text: "Your Marriage Life: Sex - Boundaries (Declarations)",
    options: [
      "We commit to never discussing our sex lives with anyone (friends, colleagues, and family members) unless we mutually agree to seek outside counsel on that aspect of our relationship.",
      "We disagree with this statement."
    ],
    weight: 6
  },
  {
    id: 94,
    section: "Your Marriage Life with Children",
    subsection: "Children Decision: How To Have Them (Method of Delivery Preference)",
    type: "M",
    text: "Your Marriage Life with Children: Children Decision: How To Have Them (Method of Delivery Preference)",
    options: [
      "We recognize the most important outcome we desire is for a healthy delivery for both the mother and the child, with that said, to the extent we can plan, we'd prefer: A Water Delivery (if medically prudent and possible)",
      "We recognize the most important outcome we desire is for a healthy delivery for both the mother and the child, with that said, to the extent we can plan, we'd prefer: Vaginal Delivery (with potential for C-Section if medically necessary)"
    ],
    weight: 3
  },
  {
    id: 95,
    section: "Your Marriage Life with Children",
    subsection: "Children Decision: Where To Have Them (Location Preference)",
    type: "M",
    text: "Your Marriage Life with Children: Children Decision: Where To Have Them (Location Preference)",
    options: [
      "We recognize the most important outcome we desire is for a healthy delivery for both the mother and the child, with that said, to the extent we can plan, we'd prefer: A Home Birth (if medically prudent and possible)",
      "We recognize the most important outcome we desire is for a healthy delivery for both the mother and the child, with that said, to the extent we can plan, we'd prefer: A Hospital Birth",
      "We recognize the most important outcome we desire is for a healthy delivery for both the mother and the child, with that said, to the extent we can plan, we'd prefer: A Birth Center (if medically prudent and possible)"
    ],
    weight: 3
  },
  {
    id: 96,
    section: "Your Marriage Life with Children",
    subsection: "Children Decision: Number of Children (Adopted)",
    type: "M",
    text: "Your Marriage Life with Children: Children Decision: Number of Children (Adopted)",
    options: [
      "We commit to adopting at least one child during our marriage.",
      "We admire and believe in adoption but do not plan to adopt during our marriage.",
      "We are committed to having children biologically (according to God's will), but would consider adoption if we discern it's not His will for us to have children biologically."
    ],
    weight: 4
  },
  {
    id: 97,
    section: "Your Marriage Life with Children",
    subsection: "Children Decision: Naming of Children (Model)",
    type: "M",
    text: "Your Marriage Life with Children: Children Decision: Naming of Children (Model)",
    options: [
      "We commit to naming our children with first names that are from the Bible.",
      "We commit to naming our children with first names that honor a family member from either side of the family.",
      "We commit to naming our children with first names that are gender neutral.",
      "Other: Please detail"
    ],
    weight: 2
  },
  {
    id: 98,
    section: "Your Marriage Life with Children",
    subsection: "Children Decision: Naming of Children (Jr's)",
    type: "M",
    text: "Your Marriage Life with Children: Children Decision: Naming of Children (Jr's)",
    options: [
      "We agree that it's an option to name one of our children after a parent.",
      "We agree that's not an option name one of our children after a parent.",
      "Not Applicable"
    ],
    weight: 2
  },
  {
    id: 99,
    section: "Your Marriage Life with Children",
    subsection: "Pregnancy Announcement",
    type: "M",
    text: "Your Marriage Life with Children: Pregnancy Announcement",
    options: [
      "We commit to keeping the news of our pregnancy private until the end of the 1st trimester.",
      "We commit to keeping the news of our pregnancy private until the end of the 2nd trimester.",
      "We do not have a specific guideline around if and when we will share news of a pregnancy.",
      "Not Applicable"
    ],
    weight: 2
  },
  {
    id: 100,
    section: "Your Marriage Life with Children",
    subsection: "Communication & Discipline",
    type: "D",
    text: "Your Marriage Life with Children: Communication & Discipline",
    options: [
      "We commit to being a united front before our children, never keeping any secrets from the other parent and never undermining a decision or perspective given by your spouse, whether in front of the children as a couple, or separate from your spouse with the children",
      "We disagree with this statement."
    ],
    weight: 6
  },
  {
    id: 101,
    section: "Your Marriage Life with Children",
    subsection: "Communication & Conflict Resolution",
    type: "M",
    text: "Your Marriage Life with Children: Communication & Conflict Resolution",
    options: [
      "We commit to not fighting or having serious arguments in front of the children, rather, we'd wait for time alone and away from the children, either in our check-in time or immediately after to discuss things away from them.",
      "We commit to fighting respectfully, even if it's a serious disagreement, in front of the children, because we believe it's healthy and constructive to model positive conflict resolution and to set realistic expectations for them in a marriage."
    ],
    weight: 5
  },
  {
    id: 102,
    section: "Your Marriage Life with Children",
    subsection: "Communication: Sex",
    type: "M",
    text: "Your Marriage Life with Children: Communication: Sex",
    options: [
      "We commit to discussing sex with our children together at no later than 5 years old, specifically, discussing appropriate/inappropriate touch and expectations of communication if it happens.",
      "We commit to discussing sex with our children one on one (each parent has their own talk) at no later than 5 years old specifically, discussing appropriate/inappropriate touch and expectations of communication if it happens and talking through anatomy and what sex is.",
      "We commit to discussing sex with our children together at no later than 5 years old; however, we'll discuss appropriate/inappropriate touch and expectations of communication if it happens, between by age 7 and we'll talk through anatomy, what sex is and its purpose, by puberty (10-13).",
      "We commit to discussing sex with our children one on one (each parent has their own talk) at no later than 5 years old; however, we'll discuss appropriate/inappropriate touch and expectations of communication if it happens, between by age 7 and we'll talk through anatomy, what sex is and its purpose, by puberty (10-13).",
      "Other: Please detail"
    ],
    weight: 5
  },
  {
    id: 103,
    section: "Your Marriage Life with Children",
    subsection: "Social Media (New Child)",
    type: "M",
    text: "Your Marriage Life with Children: Social Media (New Child)",
    options: [
      "We're committed to guarding the image and identity of our children and are committed to not posting any photos of them on social media indefinitely",
      "We're committed to guarding the image and identity of our children and are committed to limiting their exposure on social media by restricting others from sharing photos of our children on social media (direct/indirectly) and posting family/individual photos we've mutually agreed to share",
      "We're committed to approaching the issue of social media exposure of our children's image and identity with discretion; however, we do not believe any specific restrictions on sharing / posting from friends and family are necessary",
      "We're committed to guarding the image and identity of our children and are committed to limiting their exposure on social media by limiting others from sharing photos of our children on social media (direct/indirectly) without our permission and posting family/individual photos we've mutually agreed to share."
    ],
    weight: 3
  },
  {
    id: 104,
    section: "Your Marriage Life with Children",
    subsection: "Mobile Phone (Access)",
    type: "M",
    text: "Your Marriage Life with Children: Mobile Phone (Access)",
    options: [
      "We're committed to guarding the psychological development and physical safety of our children while allowing them to be socially connected and technologically adept, with that said, we do not believe it is appropriate for our children to have a mobile phone until they become high school age",
      "We're committed to guarding the psychological development and physical safety of our children while allowing them to be socially connected and technologically adept, with that said, we do not believe it is appropriate for our children to have a mobile phone until they become middle school age",
      "We're committed to guarding the psychological development and physical safety of our children while allowing them to be socially connected and technologically adept, with that said, we will allow closely monitored mobile phone use from as early as we feel comfortable they can properly use it without losing or damaging it.",
      "Other: Please detail"
    ],
    weight: 3
  },
  {
    id: 105,
    section: "Your Marriage Life with Children",
    subsection: "Social Media (New Child Documentation)",
    type: "M",
    text: "Your Marriage Life with Children: Social Media (New Child Documentation)",
    options: [
      "We're committed to guarding the image and identity of our children and are committed to not posting any photos of them on social media indefinitely.",
      "We're committed to approaching the issue of social media exposure of our children's image and identity with care, still, we do not plan to create an account on their behalf or have any unique restrictions to friends/family or ourselves of sharing photos with them in them.",
      "We're committed to creating and managing an account on our children's behalf, with photos we will share from their birth until we believe they are of age to take over their account."
    ],
    weight: 2
  },
  {
    id: 106,
    section: "Your Marriage Life with Children",
    subsection: "Communication: Sex / Gender & Sexuality",
    type: "M",
    text: "Your Marriage Life with Children: Communication: Sex / Gender & Sexuality",
    options: [
      "We believe God created man and woman, as the two genders, with a sexual ethic of marriage and relationship between a man and a woman, with that said, we also acknowledge many aspects of our human experience are often not in line with God's highest design for humanity and as a result, we want to prepare our children to not only understand God's intentions for them in terms of gender and sexual ethics, but also, we want to raise children who can also effectively engage with those different from them. As such, we commit to discussing this topic with our children by age [specific age]",
      "While we recognize and acknowledge God's highest design for humanity around gender and sexuality, we do not feel equipped to have this conversation with our children because we need to develop and deepen our own understanding of this topic through our own study and consultation with spiritual counsel. As such, we commit to doing intentional study on our own and in the meantime, allowing our faith community and counsel to provide the primary guidance to our children.",
      "Other: Please detail"
    ],
    weight: 5
  },
  {
    id: 107,
    section: "Your Marriage Life with Children",
    subsection: "Communication: Race / Racial Dynamics",
    type: "M",
    text: "Your Marriage Life with Children: Communication: Race / Racial Dynamics",
    options: [
      "We recognize the reality of race as well as its role and history still we don't believe we should have an explicit discussion about race / racial dynamics in the world and in our country with our children",
      "We commit to discussing race with our children together at no later than 10 years old, specifically, discussing the history of race / racial dynamics, where it stems from a biblical perspective (Genesis 3), and expectations you have of them around their approach to engaging the issue in this world",
      "We commit to discussing race with our children one on one (each parent has their own talk) at no later than 10 years old, specifically, discussing the history of race / racial dynamics, where it stems from a biblical perspective (Genesis 3), and expectations you have of them around their approach to engaging the issue in this world",
      "Other: Please detail"
    ],
    weight: 5
  },
  {
    id: 108,
    section: "Your Family/Home Life",
    subsection: "Traditions: Family Dinner",
    type: "M",
    text: "Your Family Life: Traditions: Family Dinner [Excludes Date Night]",
    options: [
      "We are committed to eating dinner as a family every single day, outside of unique and rare circumstances",
      "We are committed to eating dinner as a family at least once weekly, on [specific day]",
      "We are committed to eating dinner as a family at least once monthly, on the [specific date] of each month",
      "Other: Please detail"
    ],
    weight: 4
  },
  {
    id: 109,
    section: "Your Family/Home Life",
    subsection: "Traditions: Family Vacations",
    type: "M",
    text: "Your Family Life: Traditions: Family Vacations",
    options: [
      "We are committed to budgeting, planning and going on at least one family vacation per year",
      "We are committed to budgeting, planning and going on at least two family vacations per year",
      "Other: Please detail"
    ],
    weight: 3
  },
  {
    id: 110,
    section: "Your Family/Home Life",
    subsection: "Traditions: Family Photos",
    type: "M",
    text: "Your Family Life: Traditions: Family Photos",
    options: [
      "We are committed to taking a full immediate family photo at least once per year",
      "We are committed to taking a full immediate family photo at least once every two years",
      "Other: Please detail"
    ],
    weight: 2
  },
  {
    id: 111,
    section: "Your Family/Home Life",
    subsection: "Cleaning Model with Home (Inside)",
    type: "M",
    text: "Your Family Life: Cleaning Model with Home (Inside)",
    options: [
      "We commit to a model of weekly house cleaning taking place on Saturdays or Sundays which includes but is not limited to, cleaning of general living areas, kitchen, bathrooms and bedrooms and laundry (assumption of general tidiness, cleaning after self during the week).",
      "We commit to a model of bi-weekly house cleaning taking place on Saturdays or Sundays which includes but is not limited to, cleaning of general living areas, kitchen, bathrooms and bedrooms and laundry (assumption of general tidiness, cleaning after self during the week).",
      "We commit to a model of bi-weekly house cleaning by an outside cleaning vendor which includes but is not limited to, cleaning of general living areas, kitchen, bathrooms and bedrooms and laundry (assumption of general tidiness, cleaning after self during the week).",
      "Other: Please detail"
    ],
    weight: 4
  },
  {
    id: 112,
    section: "Your Family/Home Life",
    subsection: "Cleaning Model with Food",
    type: "M",
    text: "Your Family Life: Cleaning Model with Food",
    options: [
      "We commit to a model where the person who prepares the food is not the person who cleans up the kitchen, sink and table after the food is prepared and consumed. It is the responsibility of the noncooking spouse/children to clean.",
      "We commit to a model where the person who prepares the food is responsible for cleaning up after the meal is done.",
      "We commit to a model where the person who prepares the food is responsible for cleaning up as they cook and after the meal is done.",
      "Other: Please detail"
    ],
    weight: 4
  },
  {
    id: 113,
    section: "Your Family/Home Life",
    subsection: "Cleaning Model with Home (Outside)",
    type: "M",
    text: "Your Family Life: Cleaning Model with Home (Outside) (if applicable)",
    options: [
      "We commit to a model of weekly outside housework taking place on Saturdays or Sundays which includes but is not limited to, cleaning of vehicles, lawn care, cleaning of trash & recycling bins, deck, sidewalk and general gardening",
      "We commit to a model of monthly outside housework taking place on Saturdays or Sundays which includes but is not limited to, cleaning of vehicles, lawn care, cleaning of trash & recycling bins, deck, sidewalk and general gardening",
      "We commit to a model of outside housework by a hired outside vendor which includes but is not limited to, cleaning of vehicles, lawn care, cleaning of trash & recycling bins, deck, sidewalk and general gardening",
      "Other: Please detail"
    ],
    weight: 3
  },
  {
    id: 114,
    section: "Your Family/Home Life",
    subsection: "Traditions: Family Outings",
    type: "M",
    text: "Your Family Life: Traditions: Family Outings [Excludes Date Night]",
    options: [
      "We are committed to doing at least one outing as a family at least once weekly",
      "We are committed to doing at least one outing as a family at least bi-weekly",
      "We are committed to doing at least one outing as a family at least monthly",
      "Other: Please detail"
    ],
    weight: 3
  },
  {
    id: 115,
    section: "Your Finances",
    subsection: "Financial Planning Model",
    type: "M",
    text: "Your Finances: Financial Planning Model",
    options: [
      "We commit to developing an annual budget, with monthly discussions on the [specific date] of each month, around our status (actuals) against our goals",
      "We commit to working with a financial advisor, who will help us develop an annual budget, with monthly discussion around our status (actuals) against our goals",
      "We commit to developing an annual budget, with bi-monthly discussions on the [specific date] of every other month, around our status (actuals) against our goals",
      "Other: Please detail"
    ],
    weight: 4
  },
  {
    id: 116,
    section: "Your Finances",
    subsection: "Financial Management Model",
    type: "M",
    text: "Your Finances: Financial Management Model",
    options: [
      "In view of gifting and capacity, we commit to being the primary individual in our family who manages the periodic functions of our finances, which includes but is not limited to, developing the budget, financial reconciliations, bill-payment and investment related asset management and allocation",
      "Other: We commit to having a licensed financial professional handle and manage all of our financial matters. We commit to at least monthly updates (indefinitely) with the professional of our choosing."
    ],
    weight: 4
  },
  {
    id: 117,
    section: "Your Finances",
    subsection: "Financial Management: Payments Execution (Public Social)",
    type: "M",
    text: "Your Finances: Financial Management: Payments Execution (Public Social)",
    options: [
      "We commit to paying for things when we go out together in public, unless we explicitly discuss another plan in advance",
      "We're committed to a more flexible setup where there is no set expectation for one spouse paying (because it's ultimately coming from the same source) and we talk about it in advance each time",
      "Other: Please detail"
    ],
    weight: 3
  },
  {
    id: 118,
    section: "Your Finances",
    subsection: "Financial Management: with Children (Investments / Savings)",
    type: "M",
    text: "Your Finances: Financial Management: with Children (Investments / Savings)",
    options: [
      "We commit to opening a 529 plan/account for our children after they are born and depositing a budget sensitive amount monthly",
      "We commit to opening a savings account for our children after they are born and depositing a budget sensitive amount monthly",
      "We commit to opening a brokerage account for our children after they are born and depositing a budget sensitive amount monthly",
      "We commit to opening both a 529 plan/account and a brokerage account for our children after they are born and depositing a budget sensitive amount monthly",
      "Other: Please detail"
    ],
    weight: 3
  },
  {
    id: 119,
    section: "Your Family/Home Life",
    subsection: "Food Preparation & Planning: Overall Model: Responsibility",
    type: "M",
    text: "Your Family Life: Food Preparation & Planning: Overall Model: Responsibility",
    options: [
      "We commit to having [spouse name] be responsible for the overall food planning and preparation for the family, with considerations made for date night, family outings and circumstances when one is unable to do. (80/20)",
      "We commit to having [spouse name] be responsible for the overall food planning and preparation for the family, with a split of [spouse name] being responsible for meals during the week (M-Fri) and [spouse name] being responsible for meals during the weekend.",
      "We commit to having a chef / nanny be responsible for the overall food planning and preparation for the family.",
      "Other: Please detail"
    ],
    weight: 4
  },
  {
    id: 120,
    section: "Your Finances",
    subsection: "Financial Stewardship & Nutrition Health Goals",
    type: "M",
    text: "Your Finances: Financial Stewardship & Nutrition Health Goals",
    options: [
      "We commit to enjoying home-cooked meals at least 4 of the 7 days per week",
      "We commit to enjoying home-cooked meals at least 2 of the 7 days per week",
      "We commit to enjoying healthy meals through all channels (without specific constraints beyond it being in line with financial budget)",
      "Other: Please detail"
    ],
    weight: 3
  },
  {
    id: 121,
    section: "Your Health and Wellness",
    subsection: "Specific Consumption Goals [Meal Types]",
    type: "M",
    text: "Your Health and Wellness: Specific Consumption Goals [Meal Types]",
    options: [
      "We commit to a healthy balanced diet with no special restriction on any meats (seafood, chicken, beef, pork), dairy, fruits and vegetables, and whole grains or nuts",
      "We commit to a healthy balanced diet including all meats except pork (seafood, chicken, beef), dairy, fruits and vegetables, and whole grains or nuts",
      "We commit to a healthy balanced vegetarian diet",
      "We commit to a healthy balanced pescatarian diet",
      "We commit to a healthy balanced diet which is flexible to individual needs (e.g., husband can pursue carnivore and wife can pursue vegetarian, while children can be unrestricted, for example)"
    ],
    weight: 3
  },
  {
    id: 122,
    section: "Your Health and Wellness",
    subsection: "New Babies: Nutrition: Breastfeeding",
    type: "M",
    text: "Your Health and Wellness: New Babies: Nutrition: Breastfeeding",
    options: [
      "We commit to breastfeeding primarily and only using formula in rare circumstances.",
      "We commit to breastfeeding whenever possible, still, we do not have any reservations about relying on high quality formula."
    ],
    weight: 3
  },
  {
    id: 123,
    section: "Your Health and Wellness",
    subsection: "New Babies: Nutrition: Breastfeeding Length",
    type: "M",
    text: "Your Health and Wellness: New Babies: Nutrition: Breastfeeding Length",
    options: [
      "We're committed to breastfeeding along with introducing appropriate complementary foods for up to 2 years for our children.",
      "We're committed to breastfeeding along with introducing appropriate complementary foods whenever possible still, we do not plan to do it beyond 1 year for our children.",
      "We do not have a strong perspective about breastfeeding and will take the guidance of our medical professional when the time comes."
    ],
    weight: 3
  },
  {
    id: 124,
    section: "Your Health and Wellness",
    subsection: "Natural Birth or Epidural",
    type: "M",
    text: "Your Health and Wellness: Approach to Medicine, Illness and Pain Management: Natural Birth or Epidural",
    options: [
      "We are committed to having a natural birth.",
      "We are committed to having an epidural or anything medically available to relieve labor pain.",
      "We're not well educated enough on the subject to make an informed decision on what's best so we plan to research and revisit this when the time comes."
    ],
    weight: 3
  },
  {
    id: 125,
    section: "Your Marriage and Boundaries",
    subsection: "Openness / Technology",
    type: "M",
    text: "Your Marriage & Boundaries: Openness / Technology",
    options: [
      "While we fully trust God and our spouse, we believe in oneness and there being no hidden spaces, thus, we believe in \"transparent access\" which means we each have the passcodes for all our technology (hardware) and digital media accounts.",
      "While we fully trust God and our spouse, and believe in being one, we do not believe in \"transparent access\" and do not believe it is necessary to commit to having the passcodes for all of our technology (hardware) and digital media accounts."
    ],
    weight: 5
  },
  {
    id: 126,
    section: "Your Marriage and Boundaries",
    subsection: "In-Laws/Loves After Having First Child",
    type: "M",
    text: "Your Marriage & Boundaries: In-Laws/Loves After Having First Child",
    options: [
      "We're committed to having at least one parent stay with us for a period of a month, after the birth of our first child.",
      "We're committed to setting frequent and intentional early interactions with our new child and our parents, for visits and help with care, still, we prefer not to have anyone stay for an extended length of time in the first month.",
      "We're committed to having at least one parent stay with us for a period of two weeks, after the birth of our first child.",
      "Other: Please detail"
    ],
    weight: 3
  },
  {
    id: 127,
    section: "Your Marriage and Boundaries",
    subsection: "Social Media: Interactions with the Opposite Sex",
    type: "M",
    text: "Your Marriage & Boundaries: Social Media: Interactions with the Opposite Sex",
    options: [
      "While we fully trust God and our spouse, we believe in honoring our covenant in and through all our actions, as such: We commit to ensuring there is no direct communications via message or comments with any member of the opposite sex on any platform, unless it's someone we both unequivocally know and trust",
      "We commit to exercising discretion and discernment, and we do not believe a firm line is necessary",
      "Other: Please detail"
    ],
    weight: 5
  },
  {
    id: 128,
    section: "Your Marriage and Boundaries",
    subsection: "Social Media: Connection/Interaction with Past Significant Others/Romantic Interests",
    type: "M",
    text: "Your Marriage & Boundaries: Social Media: Connection/Interaction with Past Significant Others/Romantic Interests",
    options: [
      "While we fully trust God and our spouse, we believe in honoring our covenant in and through all our actions, as such: We commit to ensuring there is no direct connection (via follow / being followed, friendship or connection) and/or direct communications via message or comments with any past significant other(s) / past romantic interests on any platform",
      "We commit to ensuring all past significant other(s) / past romantic interests are blocked on every platform",
      "Not Applicable",
      "Other: Please detail"
    ],
    weight: 5
  },
  {
    id: 129,
    section: "Your Marriage and Boundaries",
    subsection: "Digital Media & Physical Devices: Private and Public Content (Images & Other Media) with Past Significant Others/Romantic Interests",
    type: "M",
    text: "Your Marriage & Boundaries: Digital Media & Physical Devices: Private and Public Content (Images & Other Media) with Past Significant Others/Romantic Interests",
    options: [
      "While we fully trust God and our spouse, we believe in honoring our covenant in and through all our actions, as such: We commit to deleting all private and public media with any past significant other(s) / past romantic interests from all private devices and public accounts (active or not) by [specific date]",
      "Not Applicable",
      "Other: Please detail"
    ],
    weight: 5
  },
  {
    id: 130,
    section: "Your Penultimate Vow",
    subsection: "Final Commitment",
    type: "D",
    text: "Your Penultimate Vow",
    options: [
      "We each promise and commit, before God and each other, to honor the agreements made and expectations set throughout this book. While we recognize we will each be imperfect and inevitably fall short, we each willingly agree by our own volition to be accountable to every single commitment, before God, our spouse and spiritual counsel in our adherence to everything we agreed to in this book. We each make space for adjustments, if and only if, we mutually agree, if not, we submit to our original commitment with trust in God and without any form or threat of retaliation. Most importantly, it is our mutual intention for us each to work daily to be children of God who reflect His unwaivering promises, character and Word through the preceding (and following) commitments made with our words and carried out through our lives. As such, in view of the vows we will make on our day of holy matrimony, we make this vow, to honor these commitments in the name of the Father, the Son and the Holy Spirit, Amen and Amen.",
      "We disagree with this statement."
    ],
    weight: 15
  }
];
