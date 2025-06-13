/**
 * This module provides sample data for testing email and PDF functionality 
 */

import { AssessmentResult, CoupleAssessmentReport, DifferenceAnalysis, UserProfile } from '../shared/schema';
import { v4 as uuidv4 } from 'uuid';

/**
 * Creates a sample individual assessment result for testing
 */
export function createIndividualAssessmentSample(): AssessmentResult {
  const sampleProfile: UserProfile = {
    name: 'Traditional Conservative',
    description: 'You have traditional views on marriage and relationships. You value commitment, loyalty, and clear roles.',
    matchingProfiles: ['Traditional Engaged', 'Faith-Focused', 'Family First'],
    compatibilityNotes: 'You are most compatible with partners who share your traditionalist outlook.',
    icon: 'TC',
    color: '#3366cc'
  };

  const sampleGenderProfile: UserProfile = {
    name: 'Structured Builder (Male)',
    description: 'As a Structured Builder male, you approach marriage with a focus on clear roles and responsibilities. You believe in being the provider and protector.',
    matchingProfiles: ['Family Focused (Female)', 'Faith-Centered (Female)', 'Relationship Nurturer (Female)'],
    compatibilityNotes: 'Your ideal match is someone who appreciates traditional roles and values your leadership.',
    icon: 'SB',
    color: '#996633'
  };

  const sampleAssessment: AssessmentResult = {
    id: uuidv4(),
    email: 'test@example.com',
    name: 'John Smith',
    profile: sampleProfile,
    genderProfile: sampleGenderProfile,
    demographics: {
      firstName: 'John',
      lastName: 'Smith',
      age: 32,
      gender: 'male',
      maritalStatus: 'single',
      relationshipStatus: 'dating',
      children: 0,
      location: 'New York, NY',
      education: "Bachelor's Degree",
      income: '$75,000 - $100,000',
      occupation: 'Software Engineer',
      religion: 'Christian',
      ethnicity: 'Caucasian',
      interestedInArrangedMarriage: false
    },
    scores: {
      totalEarned: 310,
      totalPossible: 356,
      overallPercentage: 87.1,
      sections: {
        'Spiritual Beliefs': { earned: 40, possible: 40, percentage: 100 },
        'Family Formation': { earned: 38, possible: 40, percentage: 95 },
        'Physical Preferences': { earned: 35, possible: 40, percentage: 87.5 },
        'Intellectual Stimulation': { earned: 31, possible: 40, percentage: 77.5 },
        'Financial Choices': { earned: 30, possible: 40, percentage: 75 },
        'Romantic Needs': { earned: 29, possible: 40, percentage: 72.5 },
        'Social Life': { earned: 37, possible: 40, percentage: 92.5 },
        'Accommodation Capacity': { earned: 35, possible: 40, percentage: 87.5 },
        'Intimacy Thresholds': { earned: 34, possible: 36, percentage: 94.4 }
      },
      strengths: [
        'Strong spiritual alignment in relationships',
        'Clear vision for family formation',
        'Healthy social connections and integration',
        'Balanced physical preferences',
        'Strong accommodation capacity'
      ],
      improvementAreas: [
        'May benefit from more flexibility in romantic expectations',
        'Could explore more diverse financial approaches',
        'Might consider broader intellectual interests'
      ]
    },
    responses: {
      'q1': { option: 'a', value: 4 },
      'q2': { option: 'a', value: 4 },
      'q3': { option: 'b', value: 3 },
      // ... additional responses would go here
    },
    timestamp: new Date(),
    transactionId: 'tx_' + uuidv4().substring(0, 8),
    reportSent: false
  };

  return sampleAssessment;
}

/**
 * Creates a sample couple assessment report for testing
 */
export function createCoupleAssessmentSample(): CoupleAssessmentReport {
  // Create individual assessments first
  const primary = createIndividualAssessmentSample();
  
  // Modify to create a spouse assessment
  const spouse: AssessmentResult = {
    ...JSON.parse(JSON.stringify(primary)), // Deep clone
    id: uuidv4(),
    email: 'spouse@example.com',
    name: 'Jane Smith',
    demographics: {
      ...primary.demographics,
      firstName: 'Jane',
      lastName: 'Smith',
      gender: 'female'
    },
    profile: {
      name: 'Modern Balanced',
      description: 'You have a balanced approach to relationships with some progressive views. You value equality, communication, and partnership.',
      matchingProfiles: ['Modern Flexible', 'Traditional Moderate', 'Balanced Adaptor'],
      compatibilityNotes: 'You thrive with partners who value equality while respecting traditional elements.',
      icon: 'PB',
      color: '#cc6699'
    },
    genderProfile: {
      name: 'Relationship Nurturer (Female)',
      description: 'As a Relationship Nurturer female, you prioritize emotional connection and communication. You believe in shared responsibilities and mutual support.',
      matchingProfiles: ['Structured Builder (Male)', 'Faith-Centered (Male)', 'Modern Partner (Male)'],
      compatibilityNotes: 'Your ideal match values your emotional intelligence and shares your commitment to nurturing relationships.',
      icon: 'RN',
      color: '#8866cc'
    },
    scores: {
      ...primary.scores,
      totalEarned: 280,
      totalPossible: 356,
      overallPercentage: 78.7,
      sections: {
        'Spiritual Beliefs': { earned: 36, possible: 40, percentage: 90 },
        'Family Formation': { earned: 34, possible: 40, percentage: 85 },
        'Physical Preferences': { earned: 28, possible: 40, percentage: 70 },
        'Intellectual Stimulation': { earned: 35, possible: 40, percentage: 87.5 },
        'Financial Choices': { earned: 32, possible: 40, percentage: 80 },
        'Romantic Needs': { earned: 33, possible: 40, percentage: 82.5 },
        'Social Life': { earned: 30, possible: 40, percentage: 75 },
        'Accommodation Capacity': { earned: 28, possible: 40, percentage: 70 },
        'Intimacy Thresholds': { earned: 24, possible: 36, percentage: 66.7 }
      }
    },
    responses: {
      'q1': { option: 'b', value: 3 },
      'q2': { option: 'b', value: 3 },
      'q3': { option: 'c', value: 2 },
      // ... additional responses would go here
    }
  };

  // Create difference analysis
  const differenceAnalysis: DifferenceAnalysis = {
    totalQuestions: 99,
    agreementCount: 65,
    disagreementCount: 34,
    agreementPercentage: 65.7,
    majorDifferences: [
      { question: 'Question 23: When should sex be initiated in a relationship?', primaryResponse: 'Only after marriage', spouseResponse: 'When both people feel ready' },
      { question: 'Question 45: Who should manage the family finances?', primaryResponse: 'The husband primarily', spouseResponse: 'Both partners equally' },
      { question: 'Question 67: How important is having children?', primaryResponse: 'Essential to a fulfilled marriage', spouseResponse: 'Important but not mandatory' }
    ],
    sectionDifferences: {
      'Spiritual Beliefs': { agreementCount: 8, disagreementCount: 2, agreementPercentage: 80 },
      'Family Formation': { agreementCount: 7, disagreementCount: 3, agreementPercentage: 70 },
      'Physical Preferences': { agreementCount: 6, disagreementCount: 4, agreementPercentage: 60 },
      'Intellectual Stimulation': { agreementCount: 8, disagreementCount: 2, agreementPercentage: 80 },
      'Financial Choices': { agreementCount: 7, disagreementCount: 3, agreementPercentage: 70 },
      'Romantic Needs': { agreementCount: 8, disagreementCount: 2, agreementPercentage: 80 },
      'Social Life': { agreementCount: 6, disagreementCount: 4, agreementPercentage: 60 },
      'Accommodation Capacity': { agreementCount: 7, disagreementCount: 3, agreementPercentage: 70 },
      'Intimacy Thresholds': { agreementCount: 8, disagreementCount: 1, agreementPercentage: 88.9 }
    },
    significantDifferences: {
      'Spiritual Beliefs': ['Views on religious practice frequency'],
      'Family Formation': ['Perspectives on family size', 'Child-rearing approaches'],
      'Physical Preferences': ['Fitness expectations', 'Views on physical attraction importance'],
      'Intellectual Stimulation': ['Intellectual compatibility needs'],
      'Financial Choices': ['Financial decision-making processes', 'Savings vs. spending priorities'],
      'Romantic Needs': ['Expression of affection styles'],
      'Social Life': ['Social activity preferences', 'Time with friends vs. family'],
      'Accommodation Capacity': ['Conflict resolution approaches', 'Compromise willingness'],
      'Intimacy Thresholds': ['Intimacy frequency expectations']
    },
    strengthAreas: [
      'Shared spiritual values foundation',
      'Strong intellectual connection',
      'Compatible romantic needs',
      'Aligned intimacy expectations'
    ],
    vulnerabilityAreas: [
      'Different physical preference expectations',
      'Divergent social life priorities',
      'Accommodation capacity differences'
    ],
    recommendedActions: [
      'Discuss expectations around physical preferences openly',
      'Create a plan for balancing social activities',
      'Work on compromise strategies for areas of disagreement',
      'Regularly communicate about financial decisions',
      'Celebrate your strong spiritual connection'
    ]
  };

  // Create the couple report
  const coupleId = uuidv4();
  const coupleReport: CoupleAssessmentReport = {
    id: coupleId,
    coupleId: coupleId,
    primary: {
      ...primary,
      coupleId: coupleId,
      coupleRole: 'primary'
    },
    spouse: {
      ...spouse,
      coupleId: coupleId,
      coupleRole: 'spouse'
    },
    differenceAnalysis,
    compatibility: 78.5,
    timestamp: new Date(),
    reportSent: false
  };

  return coupleReport;
}