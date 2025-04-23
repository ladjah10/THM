import React from 'react';
import { CoupleReport } from '../components/couple/CoupleAssessmentReport';
import { CoupleAssessmentReport, AssessmentResult } from '@shared/schema';

export default function SampleCoupleAssessmentPage() {
  // Sample data for demonstration purposes
  const sampleReport: CoupleAssessmentReport = {
    coupleId: 'sample-couple-1',
    timestamp: new Date().toISOString(),
    overallCompatibility: 72,
    
    primaryAssessment: {
      email: 'michael@example.com',
      name: 'Michael Johnson',
      timestamp: new Date().toISOString(),
      demographics: {
        firstName: 'Michael',
        lastName: 'Johnson',
        email: 'michael@example.com',
        lifeStage: 'adult',
        birthday: '1990-05-15',
        gender: 'male',
        marriageStatus: 'engaged',
        desireChildren: 'yes',
        ethnicity: 'Caucasian',
        city: 'New York',
        state: 'NY',
        zipCode: '10001'
      },
      profile: {
        id: 1,
        name: 'Balanced Visionary',
        description: 'You have a thoughtful, balanced approach to marriage. You value both tradition and modern perspectives, seeking harmony between stability and flexibility. Your approach to relationships is both grounded and forward-thinking.',
        genderSpecific: null,
        criteria: [{section: 'Your Foundation', min: 70}]
      },
      genderProfile: {
        id: 2,
        name: 'Balanced Provider',
        description: 'As a male Balanced Provider, you bring stability and consistent support to your relationship. You value shared responsibilities and open communication about family roles.',
        genderSpecific: 'male',
        criteria: [{section: 'Your Faith Life', min: 80}]
      },
      scores: {
        overallPercentage: 81,
        totalEarned: 405,
        totalPossible: 500,
        strengths: ['Faith values', 'Communication style', 'Financial planning'],
        improvementAreas: ['Work-life balance', 'Extended family boundaries'],
        sections: {
          'Your Foundation': { earned: 85, possible: 100, percentage: 85 },
          'Your Faith Life': { earned: 90, possible: 100, percentage: 90 },
          'Your Family Life': { earned: 70, possible: 100, percentage: 70 },
          'Your Finances': { earned: 75, possible: 100, percentage: 75 },
          'Your Future': { earned: 85, possible: 100, percentage: 85 }
        }
      },
      responses: {}
    },

    spouseAssessment: {
      email: 'sarah@example.com',
      name: 'Sarah Williams',
      timestamp: new Date().toISOString(),
      demographics: {
        firstName: 'Sarah',
        lastName: 'Williams',
        email: 'sarah@example.com',
        lifeStage: 'adult',
        birthday: '1992-08-20',
        gender: 'female',
        marriageStatus: 'engaged',
        desireChildren: 'yes',
        ethnicity: 'Asian',
        city: 'New York',
        state: 'NY',
        zipCode: '10001'
      },
      profile: {
        id: 3,
        name: 'Flexible Faithful',
        description: 'You balance a strong faith foundation with adaptability in how you approach life and relationships. You maintain core values while being flexible in how you apply them to modern marriage contexts.',
        genderSpecific: null,
        criteria: [{section: 'Your Faith Life', min: 60}]
      },
      genderProfile: {
        id: 4,
        name: 'Adaptive Communicator',
        description: 'As a female Adaptive Communicator, you excel at fostering dialogue and understanding. You adapt your communication style based on the needs of your relationship and express emotions constructively.',
        genderSpecific: 'female',
        criteria: [{section: 'Your Family Life', min: 75}]
      },
      scores: {
        overallPercentage: 68,
        totalEarned: 340,
        totalPossible: 500,
        strengths: ['Family priorities', 'Communication skills', 'Emotional intelligence'],
        improvementAreas: ['Financial planning', 'Faith practice consistency'],
        sections: {
          'Your Foundation': { earned: 75, possible: 100, percentage: 75 },
          'Your Faith Life': { earned: 65, possible: 100, percentage: 65 },
          'Your Family Life': { earned: 80, possible: 100, percentage: 80 },
          'Your Finances': { earned: 60, possible: 100, percentage: 60 },
          'Your Future': { earned: 60, possible: 100, percentage: 60 }
        }
      },
      responses: {}
    },

    differenceAnalysis: {
      strengthAreas: [
        'You both value family as a top priority',
        'You share compatible communication styles',
        'You have aligned views on parenting'
      ],
      vulnerabilityAreas: [
        'You have different approaches to financial management',
        'Your faith practice expectations differ significantly',
        'You have different expectations about roles in marriage'
      ],
      majorDifferences: [
        {
          questionId: '23',
          section: 'Your Faith Life',
          questionText: 'How do you view the role of faith in marriage?',
          questionWeight: 3,
          primaryResponse: 'Faith should be the foundation of marriage, guiding all decisions and activities.',
          spouseResponse: 'Faith is important but shouldn\'t dictate every aspect of our marriage.'
        },
        {
          questionId: '45',
          section: 'Your Family Life',
          questionText: 'What role should parents play in a married couple\'s decisions?',
          questionWeight: 2,
          primaryResponse: 'Parents should be consulted on major decisions.',
          spouseResponse: 'We should make our own decisions independently.'
        },
        {
          questionId: '68',
          section: 'Your Finances',
          questionText: 'How should financial decisions be made in marriage?',
          questionWeight: 3,
          primaryResponse: 'All financial decisions should be made together equally.',
          spouseResponse: 'Day-to-day finances can be managed separately, with joint decisions on major expenses.'
        },
        {
          questionId: '72',
          section: 'Your Future',
          questionText: 'How many children do you want to have?',
          questionWeight: 3,
          primaryResponse: 'Three or more children',
          spouseResponse: 'One or two children'
        },
        {
          questionId: '89',
          section: 'Your Foundation',
          questionText: 'How should household responsibilities be divided?',
          questionWeight: 2,
          primaryResponse: 'Based on traditional gender roles with some flexibility',
          spouseResponse: 'Equal sharing of all responsibilities regardless of gender'
        }
      ],
      differentResponses: [
        {
          questionId: '23',
          section: 'Your Faith Life',
          questionText: 'How do you view the role of faith in marriage?',
          questionWeight: 3,
          primaryResponse: 'Faith should be the foundation of marriage, guiding all decisions and activities.',
          spouseResponse: 'Faith is important but shouldn\'t dictate every aspect of our marriage.'
        },
        {
          questionId: '45',
          section: 'Your Family Life',
          questionText: 'What role should parents play in a married couple\'s decisions?',
          questionWeight: 2,
          primaryResponse: 'Parents should be consulted on major decisions.',
          spouseResponse: 'We should make our own decisions independently.'
        }
      ]
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-center mb-8">The 100 Marriage - Sample Couple Assessment</h1>
        <p className="text-gray-600 text-center mb-8">
          This is a sample demonstration of the couple assessment report interface with the updated features.
        </p>
        
        <CoupleReport report={sampleReport} />
      </div>
    </div>
  );
}