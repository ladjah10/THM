import { AssessmentResult, CoupleAssessmentReport, DifferenceAnalysis } from './shared/schema';
import { sendAssessmentEmail, sendCoupleAssessmentEmail } from './server/nodemailer';

/**
 * This script generates sample individual and couple assessment reports
 * and sends them via email for testing
 */
async function sendSampleReports() {
  try {
    console.log('Preparing to send sample reports to la@lawrenceadjah.com...');
    
    // 1. First, send a sample individual assessment report
    const individualAssessment: AssessmentResult = {
      email: 'la@lawrenceadjah.com', // Send to Lawrence
      name: 'Matthew Johnson',
      timestamp: new Date().toISOString(),
      demographics: {
        firstName: 'Matthew',
        lastName: 'Johnson',
        email: 'la@lawrenceadjah.com', // Send to Lawrence
        phone: '212-555-1234',
        gender: 'male',
        ethnicity: 'Black, African, Caribbean',
        marriageStatus: 'Single',
        desireChildren: 'Yes',
        hasPaid: true,
        lifeStage: 'Established Adult',
        birthday: '1988-04-18',
        city: 'New York',
        state: 'NY',
        zipCode: '10001'
      },
      profile: {
        id: 2,
        name: 'Balanced Visionary',
        description: 'You have a thoughtful, balanced approach to marriage. You value both tradition and modern perspectives, seeking harmony between stability and flexibility. Your responses show a well-rounded understanding of marriage dynamics with a natural ability to adapt while maintaining core values.',
        genderSpecific: 'false', // String as required by schema
        iconPath: '/attached_assets/BV 6.png',
        criteria: [
          { section: 'Your Foundation', min: 70 },
          { section: 'Your Parenting Life', min: 65 },
          { section: 'Your Marriage Life', min: 65 }
        ]
      },
      genderProfile: {
        id: 7,
        name: 'Structured Leader',
        description: 'As a Structured Leader, you bring organization and clarity to relationships. You value defined roles and clear communication. Your thoughtful approach to leadership means you provide stability while still valuing input from your spouse. You excel at creating systems that help marriages thrive.',
        genderSpecific: 'male',
        iconPath: '/attached_assets/SL 12.png',
        criteria: [
          { section: 'Your Marriage Life', min: 70 },
          { section: 'Your Finances', min: 65 },
          { section: 'Your Marriage and Boundaries', min: 75 }
        ]
      },
      responses: {
        '1': { option: 'StronglyAgree', value: 5 },
        '2': { option: 'Agree', value: 4 },
        '3': { option: 'StronglyAgree', value: 5 },
        '4': { option: 'Agree', value: 4 },
        '5': { option: 'StronglyAgree', value: 5 },
        '6': { option: 'Neutral', value: 3 },
        '7': { option: 'StronglyAgree', value: 5 },
        '8': { option: 'Disagree', value: 2 },
        '9': { option: 'Agree', value: 4 },
        '10': { option: 'StronglyAgree', value: 5 },
        '11': { option: 'Disagree', value: 2 },
        '12': { option: 'Agree', value: 4 },
        '13': { option: 'StronglyAgree', value: 5 },
        '14': { option: 'Agree', value: 4 },
        '15': { option: 'Neutral', value: 3 },
        '16': { option: 'StronglyAgree', value: 5 },
        '17': { option: 'StronglyAgree', value: 5 },
        '18': { option: 'Agree', value: 4 },
        '19': { option: 'StronglyAgree', value: 5 },
        '20': { option: 'Neutral', value: 3 },
        // Continue with additional responses...
        '99': { option: 'StronglyAgree', value: 5 }
      },
      scores: {
        sections: {
          'Your Foundation': { earned: 92, possible: 100, percentage: 92 },
          'Your Faith Life': { earned: 84, possible: 100, percentage: 84 },
          'Your Marriage Life': { earned: 88, possible: 100, percentage: 88 },
          'Your Parenting Life': { earned: 78, possible: 100, percentage: 78 },
          'Your Family/Home Life': { earned: 82, possible: 100, percentage: 82 },
          'Your Finances': { earned: 76, possible: 100, percentage: 76 },
          'Your Health and Wellness': { earned: 86, possible: 100, percentage: 86 },
          'Your Marriage and Boundaries': { earned: 72, possible: 100, percentage: 72 }
        },
        totalEarned: 658,
        totalPossible: 800,
        overallPercentage: 82.25,
        strengths: ['Your Foundation', 'Your Faith Life', 'Your Marriage Life'],
        improvementAreas: ['Your Finances', 'Your Marriage and Boundaries', 'Your Health and Wellness']
      }
    };

    // 2. Create sample couple assessment
    const primaryAssessment: AssessmentResult = {
      email: 'la@lawrenceadjah.com', // Send to Lawrence
      name: 'Michael Thomas',
      timestamp: new Date().toISOString(),
      demographics: {
        firstName: 'Michael',
        lastName: 'Thomas',
        email: 'la@lawrenceadjah.com', // Send to Lawrence
        phone: '212-555-2345',
        gender: 'male',
        ethnicity: 'Black, African, Caribbean',
        marriageStatus: 'Engaged',
        desireChildren: 'Yes',
        hasPaid: true,
        lifeStage: 'Established Adult',
        birthday: '1990-08-11',
        city: 'Brooklyn',
        state: 'NY',
        zipCode: '11201'
      },
      profile: {
        id: 6,
        name: 'Faith-Centered Builder',
        description: 'You place faith at the center of your relationship values. You build relationships on spiritual foundations, believing that shared faith creates stronger marriages. You value consistency in spiritual practices and view marriage as a sacred covenant with clearly defined roles and responsibilities.',
        genderSpecific: 'false',
        iconPath: '/attached_assets/FF 3.png',
        criteria: [
          { section: 'Your Foundation', min: 80 },
          { section: 'Your Faith Life', min: 80 },
          { section: 'Your Marriage Life', min: 70 }
        ]
      },
      genderProfile: {
        id: 7,
        name: 'Structured Leader',
        description: 'As a Structured Leader, you bring organization and clarity to relationships. You value defined roles and clear communication. Your thoughtful approach to leadership means you provide stability while still valuing input from your spouse. You excel at creating systems that help marriages thrive.',
        genderSpecific: 'male',
        iconPath: '/attached_assets/SL 12.png',
        criteria: [
          { section: 'Your Marriage Life', min: 70 },
          { section: 'Your Finances', min: 65 },
          { section: 'Your Marriage and Boundaries', min: 75 }
        ]
      },
      responses: {
        '1': { option: 'StronglyAgree', value: 5 },
        '2': { option: 'Agree', value: 4 },
        '3': { option: 'StronglyAgree', value: 5 },
        // More responses...
        '99': { option: 'Agree', value: 4 }
      },
      scores: {
        sections: {
          'Your Foundation': { earned: 96, possible: 100, percentage: 96 },
          'Your Faith Life': { earned: 92, possible: 100, percentage: 92 },
          'Your Marriage Life': { earned: 84, possible: 100, percentage: 84 },
          'Your Parenting Life': { earned: 78, possible: 100, percentage: 78 },
          'Your Family/Home Life': { earned: 82, possible: 100, percentage: 82 },
          'Your Finances': { earned: 74, possible: 100, percentage: 74 },
          'Your Health and Wellness': { earned: 79, possible: 100, percentage: 79 },
          'Your Marriage and Boundaries': { earned: 80, possible: 100, percentage: 80 }
        },
        totalEarned: 665,
        totalPossible: 800,
        overallPercentage: 83.13,
        strengths: ['Your Foundation', 'Your Faith Life', 'Your Marriage and Boundaries'],
        improvementAreas: ['Your Finances', 'Your Parenting Life', 'Your Health and Wellness']
      }
    };

    const spouseAssessment: AssessmentResult = {
      email: 'la@lawrenceadjah.com', // Send to Lawrence
      name: 'Sarah Williams',
      timestamp: new Date().toISOString(),
      demographics: {
        firstName: 'Sarah',
        lastName: 'Williams',
        email: 'la@lawrenceadjah.com', // Send to Lawrence
        phone: '212-555-3456',
        gender: 'female',
        ethnicity: 'Black, African, Caribbean',
        marriageStatus: 'Engaged',
        desireChildren: 'Yes',
        hasPaid: true,
        lifeStage: 'Established Adult',
        birthday: '1991-04-23',
        city: 'Brooklyn',
        state: 'NY',
        zipCode: '11201'
      },
      profile: {
        id: 3,
        name: 'Relationship Nurturer',
        description: 'You are a natural nurturer who prioritizes emotional connections and healthy communication in relationships. You value creating a supportive environment where both partners can grow and flourish. You\'re intuitive about others\' needs and committed to building a partnership that adapts and evolves together.',
        genderSpecific: 'false',
        iconPath: '/attached_assets/RN 7.png',
        criteria: [
          { section: 'Your Marriage Life', min: 75 },
          { section: 'Your Family/Home Life', min: 70 },
          { section: 'Your Health and Wellness', min: 65 }
        ]
      },
      genderProfile: {
        id: 8,
        name: 'Intuitive Supporter',
        description: 'As an Intuitive Supporter, you have a natural ability to recognize and respond to emotional needs in relationships. You lead with empathy and create spaces where authentic communication thrives. You skillfully balance nurturing others while maintaining healthy boundaries, making you a deeply valued partner.',
        genderSpecific: 'female',
        iconPath: '/attached_assets/IS 5.png',
        criteria: [
          { section: 'Your Marriage Life', min: 65 },
          { section: 'Your Family/Home Life', min: 75 },
          { section: 'Your Health and Wellness', min: 70 }
        ]
      },
      responses: {
        '1': { option: 'Agree', value: 4 },
        '2': { option: 'StronglyAgree', value: 5 },
        '3': { option: 'Agree', value: 4 },
        // More responses...
        '99': { option: 'Agree', value: 4 }
      },
      scores: {
        sections: {
          'Your Foundation': { earned: 84, possible: 100, percentage: 84 },
          'Your Faith Life': { earned: 78, possible: 100, percentage: 78 },
          'Your Marriage Life': { earned: 88, possible: 100, percentage: 88 },
          'Your Parenting Life': { earned: 82, possible: 100, percentage: 82 },
          'Your Family/Home Life': { earned: 90, possible: 100, percentage: 90 },
          'Your Finances': { earned: 76, possible: 100, percentage: 76 },
          'Your Health and Wellness': { earned: 86, possible: 100, percentage: 86 },
          'Your Marriage and Boundaries': { earned: 74, possible: 100, percentage: 74 }
        },
        totalEarned: 658,
        totalPossible: 800,
        overallPercentage: 82.25,
        strengths: ['Your Family/Home Life', 'Your Marriage Life', 'Your Health and Wellness'],
        improvementAreas: ['Your Marriage and Boundaries', 'Your Faith Life', 'Your Finances']
      }
    };

    // Define differences for couple assessment - matching the DifferenceAnalysis interface
    const differenceAnalysis: DifferenceAnalysis = {
      differentResponses: [
        {
          questionId: '15',
          questionText: 'A spouse\'s faith should align with their partner\'s.',
          questionWeight: 4,
          section: 'Your Faith Life',
          primaryResponse: 'StronglyAgree',
          spouseResponse: 'Neutral'
        },
        {
          questionId: '27',
          questionText: 'Traditional gender roles are important in a marriage.',
          questionWeight: 3,
          section: 'Your Foundation',
          primaryResponse: 'Agree',
          spouseResponse: 'Disagree'
        },
        {
          questionId: '42',
          questionText: 'Family decisions should be made together.',
          questionWeight: 4,
          section: 'Your Family/Home Life',
          primaryResponse: 'Agree',
          spouseResponse: 'StronglyAgree'
        }
      ],
      majorDifferences: [
        {
          questionId: '12',
          questionText: 'Regular religious practices are vital to a successful marriage.',
          questionWeight: 5,
          section: 'Your Faith Life',
          primaryResponse: 'StronglyAgree',
          spouseResponse: 'Neutral'
        },
        {
          questionId: '28',
          questionText: 'Maintaining individual independence is as important as building togetherness.',
          questionWeight: 4,
          section: 'Your Foundation',
          primaryResponse: 'Disagree',
          spouseResponse: 'Agree'
        },
      ],
      strengthAreas: [
        'You have strong alignment on financial approaches and expectations.',
        'You share similar core values regarding marriage dynamics.',
        'Both of you value physical and emotional well-being in your relationship.'
      ],
      vulnerabilityAreas: [
        'Differences in how faith will be integrated into your relationship practices.',
        'Different perspectives on traditional vs. modern approaches to family foundations.',
        'Varying expectations around family dynamics and home environment decision-making.'
      ]
    };

    // Create couple assessment report
    const coupleReport: CoupleAssessmentReport = {
      coupleId: 'SAMPLE-COUPLE-2025',
      timestamp: new Date().toISOString(),
      primaryAssessment: primaryAssessment,
      spouseAssessment: spouseAssessment,
      differenceAnalysis: differenceAnalysis,
      overallCompatibility: 84
    };

    // Send the individual assessment email
    console.log('Sending individual assessment email...');
    const individualResult = await sendAssessmentEmail(individualAssessment);
    console.log('Individual assessment email result:', individualResult ? 'Success!' : 'Failed');

    // Send the couple assessment email
    console.log('Sending couple assessment email...');
    const coupleResult = await sendCoupleAssessmentEmail(coupleReport);
    console.log('Couple assessment email result:', coupleResult.success ? 'Success!' : 'Failed');

    console.log('Done! Check la@lawrenceadjah.com for the sample reports.');
  } catch (error) {
    console.error('Error sending sample reports:', error);
  }
}

// Run the script
sendSampleReports();