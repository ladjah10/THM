import { UserProfile } from "@/types/assessment";

export const psychographicProfiles: UserProfile[] = [
  // Unisex profiles
  {
    id: 1,
    name: "Steadfast Believers",
    description: "You have a strong commitment to faith as the foundation of your relationship. You value traditional marriage roles and have clear expectations for family life. Your decisions are firmly guided by your interpretation of scripture, and you're unwavering in your convictions.",
    genderSpecific: null,
    criteria: [
      { section: "Your Foundation", min: 90 },
      { section: "Your Faith Life", min: 85 }
    ]
  },
  {
    id: 2,
    name: "Harmonious Planners",
    description: "You value structure and careful planning in your relationship while maintaining strong faith values. You're committed to establishing clear expectations and boundaries in your marriage while prioritizing your spiritual foundation.",
    genderSpecific: null,
    criteria: [
      { section: "Your Foundation", min: 80 },
      { section: "Your Marriage Life", min: 75 },
      { section: "Your Finances", min: 70 }
    ]
  },
  {
    id: 3,
    name: "Flexible Faithful",
    description: "While your faith is important to you, you balance spiritual conviction with practical adaptability. You value communication and compromise, seeking to honor your beliefs while remaining flexible in how you apply them to daily life.",
    genderSpecific: null,
    criteria: [
      { section: "Your Faith Life", min: 70, max: 85 },
      { section: "Your Marriage Life", min: 80 }
    ]
  },
  {
    id: 4,
    name: "Pragmatic Partners",
    description: "You approach marriage with a practical mindset, valuing clear communication and shared responsibility. While faith plays a role in your relationship, you also emphasize mutual respect and fairness in all aspects of your relationship.",
    genderSpecific: null,
    criteria: [
      { section: "Your Finances", min: 85 },
      { section: "Your Marriage Life", min: 80 }
    ]
  },
  {
    id: 5,
    name: "Individualist Seekers",
    description: "You value personal growth and independence within your relationship. While you appreciate the spiritual dimension of marriage, you also believe in maintaining individuality and creating a relationship that evolves as you both grow.",
    genderSpecific: null,
    criteria: [
      { section: "Your Faith Life", max: 70 },
      { section: "Your Marriage Life", min: 60, max: 80 }
    ]
  },
  {
    id: 6,
    name: "Balanced Visionaries",
    description: "You have a strong foundation of faith-centered expectations paired with practical wisdom. You value clear communication, mutual respect, and shared spiritual growth. Your balanced approach to relationships positions you well for a fulfilling marriage built on aligned expectations and shared values.",
    genderSpecific: null,
    criteria: [
      { section: "Your Faith Life", min: 75 },
      { section: "Your Marriage Life", min: 70 },
      { section: "Your Marriage and Boundaries", min: 65 }
    ]
  },
  
  // Women-specific profiles
  {
    id: 7,
    name: "Relational Nurturers",
    description: "You prioritize emotional connection and nurturing in your marriage. Your faith influences how you care for your relationship and future family, and you value creating a supportive, loving home environment.",
    genderSpecific: "female",
    criteria: [
      { section: "Your Parenting Life", min: 85 },
      { section: "Your Marriage Life", min: 80 }
    ]
  },
  {
    id: 8,
    name: "Adaptive Communicators",
    description: "You excel at building bridges through communication and emotional intelligence. Your faith informs your values, but you're also skilled at finding common ground and creating harmony in your relationship.",
    genderSpecific: "female",
    criteria: [
      { section: "Your Marriage Life", min: 85 },
      { section: "Your Faith Life", min: 60, max: 80 }
    ]
  },
  {
    id: 9,
    name: "Independent Traditionalists",
    description: "You value traditional marriage foundations while maintaining your unique identity. You believe in honoring faith-based principles but also advocate for mutual respect and equality within your relationship.",
    genderSpecific: "female",
    criteria: [
      { section: "Your Foundation", min: 75 },
      { section: "Your Finances", min: 80 }
    ]
  },
  {
    id: 10,
    name: "Faith-Centered Homemakers",
    description: "You place high value on creating a nurturing home environment guided by faith principles. You balance traditional family values with modern perspectives, focusing on building a strong spiritual foundation for your family while maintaining your own identity and growth.",
    genderSpecific: "female",
    criteria: [
      { section: "Your Faith Life", min: 75 },
      { section: "Your Family/Home Life", min: 80 }
    ]
  },
  
  // Men-specific profiles
  {
    id: 11,
    name: "Faithful Protectors",
    description: "You see yourself as the spiritual leader and protector of your family. Your faith deeply influences how you approach your role as a husband, and you take seriously your responsibility to provide guidance and security.",
    genderSpecific: "male",
    criteria: [
      { section: "Your Foundation", min: 85 },
      { section: "Your Faith Life", min: 80 }
    ]
  },
  {
    id: 12,
    name: "Structured Leaders",
    description: "You value order and clarity in your approach to marriage. Your faith provides a framework for how you lead in your relationship, and you believe in establishing clear boundaries and expectations for family life.",
    genderSpecific: "male",
    criteria: [
      { section: "Your Finances", min: 85 },
      { section: "Your Parenting Life", min: 80 }
    ]
  },
  {
    id: 13,
    name: "Balanced Providers",
    description: "You prioritize providing stability while maintaining strong spiritual values. You seek balance between work, family responsibilities, and personal growth. Your approach to marriage combines traditional values with openness to new perspectives, creating a dynamic and supportive relationship.",
    genderSpecific: "male",
    criteria: [
      { section: "Your Finances", min: 75 },
      { section: "Your Faith Life", min: 70 },
      { section: "Your Health and Wellness", min: 70 }
    ]
  }
];
