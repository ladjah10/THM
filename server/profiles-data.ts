/**
 * Psychographic profiles data and criteria for the assessment
 */

import type { UserProfile } from "@shared/schema";

// List of all profiles with their criteria
export const profiles: UserProfile[] = [
  {
    id: 1,
    name: "Steadfast Believer",
    description: "You prioritize faith and traditional values in your relationships. You seek a partner who shares your spiritual convictions and moral principles.",
    genderSpecific: null,
    criteria: [
      { section: "Spirituality & Faith", min: 80 },
      { section: "Traditional Habits", min: 70 },
    ],
    iconPath: "/assets/SB-1.png"
  },
  {
    id: 2,
    name: "Family First",
    description: "You value family above all else and prioritize creating a nurturing home environment. You seek a partner who shares your commitment to family traditions and child-rearing.",
    genderSpecific: null,
    criteria: [
      { section: "Family & Children", min: 85 },
      { section: "Traditional Habits", min: 65 },
    ],
    iconPath: "/assets/FF-3.png"
  },
  {
    id: 3,
    name: "Passionate Provider",
    description: "You believe in taking care of your loved ones emotionally and financially. You seek a partner who appreciates your protective nature and shares your commitment to security.",
    genderSpecific: null,
    criteria: [
      { section: "Financial Priorities", min: 80 },
      { section: "Relationship Needs", min: 75 },
    ],
    iconPath: "/assets/PP-4.png"
  },
  {
    id: 4,
    name: "Intellectual Seeker",
    description: "You value intellectual stimulation and deep conversations. You seek a partner who challenges your thinking and shares your curiosity about the world.",
    genderSpecific: null,
    criteria: [
      { section: "Intellectual Style", min: 85 },
      { section: "Behavior Values", min: 70 },
    ],
    iconPath: "/assets/IS-5.png"
  },
  {
    id: 5,
    name: "Balanced Visionary",
    description: "You maintain harmony across multiple life dimensions while pursuing long-term goals. You seek a partner who complements your balanced approach and shares your vision for the future.",
    genderSpecific: null,
    criteria: [
      { section: "Financial Priorities", min: 70 },
      { section: "Intellectual Style", min: 70 },
      { section: "Social Lifestyle", min: 70 },
    ],
    iconPath: "/assets/BV-6.png"
  },
  {
    id: 6,
    name: "Relationship Nurturer",
    description: "You prioritize emotional connection and creating a supportive environment. You seek a partner who values your nurturing nature and communicates openly.",
    genderSpecific: null,
    criteria: [
      { section: "Relationship Needs", min: 85 },
      { section: "Behavior Values", min: 75 },
    ],
    iconPath: "/assets/RN-7.png"
  },
  {
    id: 7,
    name: "Active Connector",
    description: "You thrive on social interaction and physical activity. You seek a partner who shares your enthusiasm for an active lifestyle and maintaining a wide social circle.",
    genderSpecific: null,
    criteria: [
      { section: "Physical Priorities", min: 80 },
      { section: "Social Lifestyle", min: 80 },
    ],
    iconPath: "/assets/AC-8.png"
  },
  {
    id: 8,
    name: "Intuitive Thinker",
    description: "You combine emotional intelligence with analytical thinking. You seek a partner who appreciates your depth of thought and emotional awareness.",
    genderSpecific: null,
    criteria: [
      { section: "Intellectual Style", min: 75 },
      { section: "Relationship Needs", min: 75 },
    ],
    iconPath: "/assets/IT-9.png"
  },
  {
    id: 9,
    name: "Faith & Community Harmonizer",
    description: "You find purpose through spiritual practice and community engagement. You seek a partner who shares your values and commitment to serving others.",
    genderSpecific: null,
    criteria: [
      { section: "Spirituality & Faith", min: 75 },
      { section: "Social Lifestyle", min: 75 },
    ],
    iconPath: "/assets/FCH-10.png"
  },
  {
    id: 10,
    name: "Focused Protector",
    description: "You are dedicated to creating a secure and stable environment for loved ones. You seek a partner who respects your protective nature and shares your commitment to security.",
    genderSpecific: null,
    criteria: [
      { section: "Financial Priorities", min: 75 },
      { section: "Family & Children", min: 75 },
    ],
    iconPath: "/assets/FP-11.png"
  },
  {
    id: 11,
    name: "Social Luminary",
    description: "You excel at bringing people together and creating memorable experiences. You seek a partner who appreciates your social nature and shares your enjoyment of diverse environments.",
    genderSpecific: null,
    criteria: [
      { section: "Social Lifestyle", min: 85 },
      { section: "Physical Priorities", min: 70 },
    ],
    iconPath: "/assets/SL-12.png"
  },
  {
    id: 12,
    name: "Balanced Pragmatist",
    description: "You take a practical approach to relationships while maintaining personal values. You seek a partner who appreciates your rational thinking and shared commitment to growth.",
    genderSpecific: null,
    criteria: [
      { section: "Behavior Values", min: 75 },
      { section: "Financial Priorities", min: 70 },
    ],
    iconPath: "/assets/BP-13.png"
  },
  {
    id: 13,
    name: "Holistic Partner",
    description: "You value balance across all dimensions of life and relationships. You seek a partner who complements your well-rounded approach and shares your desire for holistic growth.",
    genderSpecific: null,
    criteria: [
      { section: "Behavior Values", min: 70 },
      { section: "Relationship Needs", min: 70 },
      { section: "Intellectual Style", min: 70 },
      { section: "Physical Priorities", min: 70 },
    ],
    iconPath: "/assets/HP.png"
  }
];