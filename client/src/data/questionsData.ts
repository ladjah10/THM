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
  {
    id: 90,
    section: "Your Marriage and Boundaries",
    subsection: "Relationship Openness",
    type: "D",
    text: "Your Marriage and Boundaries: Relationship Openness - I believe we should be completely open about past relationships.",
    options: [
      "We do believe in complete transparency about past relationships",
      "We do not believe detailed discussion of past relationships is necessary or helpful"
    ],
    weight: 4
  },
  {
    id: 91,
    section: "Your Marriage and Boundaries",
    subsection: "Travel Boundaries",
    type: "D",
    text: "Your Marriage and Boundaries: Travel Boundaries - I believe spouses should rarely travel alone overnight.",
    options: [
      "We do believe spouses should rarely travel alone overnight when possible",
      "We do not believe restricting solo overnight travel is necessary in a trusting relationship"
    ],
    weight: 4
  },
  {
    id: 92,
    section: "Your Marriage and Boundaries",
    subsection: "Emotional Confidants",
    type: "D",
    text: "Your Marriage and Boundaries: Emotional Confidants - I believe spouses should be each other's primary emotional confidants.",
    options: [
      "We do believe spouses should be each other's primary emotional confidants",
      "We do not believe spouses must be each other's only or primary emotional support"
    ],
    weight: 5
  },
  {
    id: 93,
    section: "Your Marriage and Boundaries",
    subsection: "Relational History",
    type: "D",
    text: "Your Marriage and Boundaries: Relational History - I believe maintaining contact with exes is inappropriate.",
    options: [
      "We do believe maintaining contact with ex-spouses is generally inappropriate",
      "We do not believe all contact with exes is inappropriate as long as boundaries are clear"
    ],
    weight: 5
  },
  {
    id: 94,
    section: "Your Faith Life",
    subsection: "Faith Expressions",
    type: "D",
    text: "Your Faith Life: Faith Expressions - I believe we should express our faith publicly.",
    options: [
      "We do believe in openly and publicly expressing our faith in various settings",
      "We do not believe faith needs to be publicly displayed and can be more private in nature"
    ],
    weight: 4
  },
  {
    id: 95,
    section: "Your Faith Life",
    subsection: "Interfaith Relationships",
    type: "D",
    text: "Your Faith Life: Interfaith Relationships - I believe we should have close friendships with people of other faiths.",
    options: [
      "We do believe in cultivating close friendships with people of different faith backgrounds",
      "We do not believe in prioritizing relationships with those who don't share our core faith values"
    ],
    weight: 4
  },
  {
    id: 96,
    section: "Your Marriage Life",
    subsection: "Professional Boundaries",
    type: "D",
    text: "Your Marriage Life: Professional Boundaries - I believe we should limit professional interactions with the opposite sex.",
    options: [
      "We do believe in having clear boundaries around professional interactions with the opposite sex",
      "We do not believe special boundaries are needed for professional interactions with the opposite sex"
    ],
    weight: 5
  },
  {
    id: 97,
    section: "Your Marriage Life",
    subsection: "Vacation Priorities",
    type: "D",
    text: "Your Marriage Life: Vacation Priorities - I believe we should prioritize couple vacations over family or friend trips.",
    options: [
      "We do believe couple-only vacations should be prioritized over other trip types",
      "We do not believe couple trips should necessarily take priority over family or friend vacations"
    ],
    weight: 3
  },
  {
    id: 98,
    section: "Your Marriage Life",
    subsection: "Recreational Time",
    type: "D",
    text: "Your Marriage Life: Recreational Time - I believe spouses should share the same hobbies and interests.",
    options: [
      "We do believe couples should share most recreational interests and hobbies",
      "We do not believe couples need to share the same recreational activities to have a healthy relationship"
    ],
    weight: 3
  },
  {
    id: 99,
    section: "Your Marriage Life",
    subsection: "Community Involvement",
    type: "D",
    text: "Your Marriage Life: Community Involvement - I believe we should be actively involved in our local community together.",
    options: [
      "We do believe couples should be actively involved together in their local community",
      "We do not believe couples need to participate in the same community activities and can have separate interests"
    ],
    weight: 4
  }
];
