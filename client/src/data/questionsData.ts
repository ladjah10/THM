import { Question } from "@/types/assessment";

// Define sections for navigation
export const sections = [
  "Your Foundation",
  "Your Faith Life",
  "Your Marriage Life",
  "Your Parenting Life",
  "Your Financial Life",
  "Your Sexual Life"
];

// Questions from the authentic 100 Marriage Assessment
export const questions: Question[] = [
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
      "Agree",
      "Disagree"
    ],
    weight: 12
  },
  {
    id: 3,
    section: "Your Foundation",
    subsection: "Marriage & Your Children's Faith",
    type: "M",
    text: "Your Foundation: Marriage & Your Children's Faith - How do you plan to raise your children?",
    options: [
      "Raise in Christian faith",
      "Expose to multiple faiths",
      "Allow them to choose without guidance",
      "Other"
    ],
    weight: 12
  },
  {
    id: 4,
    section: "Your Foundation",
    subsection: "Marriage Mindset: Happiness",
    type: "M",
    text: "Your Foundation: Marriage Mindset: Happiness",
    options: [
      "We believe each spouse is responsible for their own happiness",
      "We believe in 'Happy Wife, Happy Life'",
      "We believe in 'Happy King, Happy Kingdom'",
      "We believe in 'Happy Spouse, Happy House'"
    ],
    weight: 5
  },
  {
    id: 5,
    section: "Your Foundation",
    subsection: "Marriage Preparation: Legal",
    type: "D",
    text: "Your Foundation: Marriage Preparation: Legal (Incapacitation) - We will establish Power of Attorney before marriage.",
    options: [
      "Agree",
      "Disagree"
    ],
    weight: 5
  },
  {
    id: 6,
    section: "Your Foundation",
    subsection: "Marriage Preparation: Legal",
    type: "D",
    text: "Your Foundation: Marriage Preparation: Legal (Estate) - We will establish a Will before marriage.",
    options: [
      "Agree",
      "Disagree"
    ],
    weight: 5
  },
  {
    id: 7,
    section: "Your Foundation",
    subsection: "Marriage Mindset: Divorce",
    type: "D",
    text: "Your Foundation: Marriage Mindset: Divorce - Divorce is not an option for our marriage.",
    options: [
      "Agree",
      "Disagree"
    ],
    weight: 12
  },
  {
    id: 8,
    section: "Your Foundation",
    subsection: "Marriage Mindset: Legal Agreement",
    type: "D",
    text: "Your Foundation: Marriage Mindset: Legal Agreement - We will not establish a pre-nuptial agreement.",
    options: [
      "Agree",
      "Disagree"
    ],
    weight: 12
  },
  {
    id: 9,
    section: "Your Foundation",
    subsection: "Marriage Mindset: Legal Property",
    type: "D",
    text: "Your Foundation: Marriage Mindset: Legal Property - All our assets will be shared in marriage.",
    options: [
      "Agree",
      "Disagree"
    ],
    weight: 4
  },
  {
    id: 10,
    section: "Your Foundation",
    subsection: "Marriage Mindset: Soulmates",
    type: "M",
    text: "Your Foundation: Marriage Mindset: Soulmates",
    options: [
      "We believe God has one specific person for each of us",
      "We believe God gives us freedom to choose from several compatible partners",
      "We believe the concept of soulmates is not biblical"
    ],
    weight: 2
  },
  {
    id: 11,
    section: "Your Foundation",
    subsection: "Marriage Priorities",
    type: "M",
    text: "Your Foundation: Marriage Priorities - Our priority order will be:",
    options: [
      "God, Spouse, Children, Work, Extended Family, Friends, Church, Ministry, Hobbies",
      "God, Children, Spouse, Work, Extended Family, Friends, Church, Ministry, Hobbies",
      "God, Work, Spouse, Children, Extended Family, Friends, Church, Ministry, Hobbies",
      "God, Extended Family, Spouse, Children, Work, Friends, Church, Ministry, Hobbies"
    ],
    weight: 12
  },
  {
    id: 12,
    section: "Your Foundation",
    subsection: "Marriage Name",
    type: "M",
    text: "Your Foundation: Marriage Name - Our approach to surname will be:",
    options: [
      "Wife takes husband's surname",
      "Both keep current surname",
      "Both choose a combined/hyphenated surname",
      "Husband takes wife's surname"
    ],
    weight: 12
  },
  {
    id: 13,
    section: "Your Faith Life",
    subsection: "Church Community",
    type: "D",
    text: "Your Faith Life: Church Community - We will choose and attend the same church as a family.",
    options: [
      "Agree",
      "Disagree"
    ],
    weight: 12
  },
  {
    id: 14,
    section: "Your Faith Life",
    subsection: "Spiritual Learning",
    type: "D",
    text: "Your Faith Life: Spiritual Learning - We will study the Bible together regularly.",
    options: [
      "Agree",
      "Disagree"
    ],
    weight: 4
  },
  {
    id: 15,
    section: "Your Faith Life",
    subsection: "Prayer",
    type: "D",
    text: "Your Faith Life: Prayer - We will pray together daily.",
    options: [
      "Agree",
      "Disagree"
    ],
    weight: 4
  },
  {
    id: 16,
    section: "Your Marriage Life",
    subsection: "Communication: Frequency",
    type: "D",
    text: "Your Marriage Life: Communication: Frequency - We will talk in depth daily.",
    options: [
      "Agree",
      "Disagree"
    ],
    weight: 6
  },
  {
    id: 17,
    section: "Your Marriage Life",
    subsection: "Date Nights",
    type: "D",
    text: "Your Marriage Life: Date Nights - We will have a weekly date night.",
    options: [
      "Agree",
      "Disagree"
    ],
    weight: 7
  },
  {
    id: 18,
    section: "Your Marriage Life",
    subsection: "Device Boundaries",
    type: "D",
    text: "Your Marriage Life: Device Boundaries - We will establish boundaries for phone/device use.",
    options: [
      "Agree",
      "Disagree"
    ],
    weight: 5
  },
  {
    id: 19,
    section: "Your Marriage Life",
    subsection: "Dedicated Time",
    type: "M",
    text: "Your Marriage Life: Dedicated Time (Fellowship) - Our approach to meals:",
    options: [
      "We will eat dinner together every night as a family",
      "We will eat together whenever our schedules align",
      "We don't see eating together as a priority"
    ],
    weight: 3
  },
  {
    id: 20,
    section: "Your Parenting Life",
    subsection: "Children: Desire",
    type: "M",
    text: "Your Parenting Life: Children: Desire - Our plan for having children:",
    options: [
      "We want to have biological children",
      "We want to adopt children",
      "We want both biological and adopted children",
      "We don't want children",
      "We are undecided about having children"
    ],
    weight: 12
  }
  
  // Note: In a full implementation, all 100 questions would be listed here
];
