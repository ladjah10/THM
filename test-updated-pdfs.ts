import fs from 'fs';
import { generateIndividualAssessmentPDF } from './server/updated-individual-pdf';
import { generateCoupleAssessmentPDF } from './server/updated-couple-pdf';
import { AssessmentResult, CoupleAssessmentReport } from './shared/schema';

/**
 * This script tests the updated PDF generators that match the sample visualizations
 */
async function testUpdatedPDFs() {
  console.log("Testing updated PDF generators...");
  
  // Sample individual assessment data
  const individualAssessment: AssessmentResult = {
    email: "john.smith@example.com",
    name: "John Smith",
    timestamp: new Date().toISOString(),
    demographics: {
      firstName: "John",
      lastName: "Smith",
      email: "john.smith@example.com",
      phone: "212-555-1234",
      gender: "male",
      ethnicity: "White, Caucasian",
      desireChildren: "Yes",
      marriageStatus: "Single", // This will be deprecated
      hasPaid: true,
      lifeStage: "Established Adult",
      birthday: "1985-06-15",
      interestedInArrangedMarriage: false,
      city: "New York",
      state: "NY",
      zipCode: "10001"
    },
    profile: {
      id: 2,
      name: "Balanced Visionary",
      description: "You have a thoughtful, balanced approach to marriage. You value both tradition and modern perspectives, seeking harmony between stability and flexibility. Your responses show a well-rounded understanding of marriage dynamics with a natural ability to adapt while maintaining core values.",
      genderSpecific: 'false',
      iconPath: 'attached_assets/BV 6.png',
      criteria: [
        { section: 'Your Foundation', min: 70 },
        { section: 'Your Parenting Life', min: 65 },
        { section: 'Your Marriage Life', min: 65 }
      ]
    },
    genderProfile: {
      id: 7,
      name: "Structured Leader",
      description: "As a Structured Leader, you bring organization and clarity to relationships. You value defined roles and clear communication. Your thoughtful approach to leadership means you provide stability while still valuing input from your spouse. You excel at creating systems that help marriages thrive.",
      genderSpecific: 'male',
      iconPath: 'attached_assets/SL 12.png',
      criteria: [
        { section: 'Your Marriage Life', min: 70 },
        { section: 'Your Finances', min: 65 },
        { section: 'Your Family/Home Life', min: 75 }
      ]
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
      strengths: ['Your Foundation', 'Your Marriage Life', 'Your Health and Wellness'],
      improvementAreas: ['Your Marriage and Boundaries', 'Your Finances']
    },
    responses: {}  // Empty for this test
  };
  
  // Sample couple assessment data
  const coupleAssessment: CoupleAssessmentReport = {
    coupleId: "test-couple-" + Date.now(),
    timestamp: new Date().toISOString(),
    overallCompatibility: 78,
    primaryAssessment: {
      ...individualAssessment,
      name: "Michael Johnson",
      email: "michael@example.com",
      demographics: {
        ...individualAssessment.demographics,
        firstName: "Michael",
        lastName: "Johnson",
        email: "michael@example.com",
        marriageStatus: "Married",
        gender: "male"
      },
      coupleRole: 'primary'
    },
    spouseAssessment: {
      ...individualAssessment,
      name: "Sarah Williams",
      email: "sarah@example.com",
      demographics: {
        ...individualAssessment.demographics,
        firstName: "Sarah",
        lastName: "Williams",
        email: "sarah@example.com",
        gender: "female",
        marriageStatus: "Married"
      },
      profile: {
        id: 3,
        name: "Balanced Partnership",
        description: "You value equality and mutual respect in relationships. Your responses demonstrate a desire for a partnership where both spouses have equal say and shared responsibility. You typically approach conflict with level-headedness and seek fair resolutions.",
        genderSpecific: 'false',
        iconPath: 'attached_assets/BP 13.png',
        criteria: [
          { section: 'Your Marriage Life', min: 65 },
          { section: 'Your Marriage and Boundaries', min: 70 }
        ]
      },
      genderProfile: {
        id: 10,
        name: "Adaptive Nurturer",
        description: "As an Adaptive Nurturer, you bring exceptional emotional intelligence to relationships. You have a gift for understanding others' needs and creating harmonious environments. You value both tradition and progressive approaches, adapting as needed to support relationship goals.",
        genderSpecific: 'female',
        iconPath: 'attached_assets/RN 7.png',
        criteria: [
          { section: 'Your Family/Home Life', min: 70 },
          { section: 'Your Health and Wellness', min: 60 }
        ]
      },
      scores: {
        sections: {
          'Your Foundation': { earned: 85, possible: 100, percentage: 85 },
          'Your Faith Life': { earned: 75, possible: 100, percentage: 75 },
          'Your Marriage Life': { earned: 88, possible: 100, percentage: 88 },
          'Your Parenting Life': { earned: 90, possible: 100, percentage: 90 },
          'Your Family/Home Life': { earned: 76, possible: 100, percentage: 76 },
          'Your Finances': { earned: 72, possible: 100, percentage: 72 },
          'Your Health and Wellness': { earned: 82, possible: 100, percentage: 82 },
          'Your Marriage and Boundaries': { earned: 82, possible: 100, percentage: 82 }
        },
        totalEarned: 650,
        totalPossible: 800,
        overallPercentage: 81.25,
        strengths: ['Your Parenting Life', 'Your Marriage Life', 'Your Foundation'],
        improvementAreas: ['Your Family/Home Life', 'Your Finances']
      },
      coupleRole: 'spouse'
    },
    differenceAnalysis: {
      differentResponses: [],
      majorDifferences: [
        {
          questionId: "15",
          questionText: "How important is it to plan finances together?",
          questionWeight: 3,
          section: "Your Finances",
          primaryResponse: "Very important, all financial decisions should be made together",
          spouseResponse: "Somewhat important, but we should maintain some financial independence"
        },
        {
          questionId: "32",
          questionText: "What role should in-laws play in your marriage?",
          questionWeight: 2,
          section: "Your Family/Home Life",
          primaryResponse: "Limited involvement, with clear boundaries",
          spouseResponse: "Regular involvement and guidance from both families"
        },
        {
          questionId: "47",
          questionText: "How do you prefer to resolve conflicts?",
          questionWeight: 3,
          section: "Your Marriage and Boundaries",
          primaryResponse: "Address issues immediately and directly",
          spouseResponse: "Take time to cool off before discussing sensitive topics"
        }
      ],
      strengthAreas: ['Your Faith Life', 'Your Parenting Life', 'Your Foundation'],
      vulnerabilityAreas: ['Your Family/Home Life', 'Your Marriage and Boundaries']
    }
  };
  
  try {
    // Generate individual assessment PDF
    console.log("Generating individual assessment PDF...");
    const individualPDF = await generateIndividualAssessmentPDF(individualAssessment);
    
    // Save the PDF to a file
    fs.writeFileSync('individual-assessment.pdf', individualPDF);
    console.log("Individual assessment PDF saved to individual-assessment.pdf");
    
    // Generate couple assessment PDF
    console.log("Generating couple assessment PDF...");
    const couplePDF = await generateCoupleAssessmentPDF(coupleAssessment);
    
    // Save the PDF to a file
    fs.writeFileSync('couple-assessment.pdf', couplePDF);
    console.log("Couple assessment PDF saved to couple-assessment.pdf");
    
    console.log("PDF generation tests completed successfully!");
  } catch (error) {
    console.error("Error during PDF generation:", error);
  }
}

// Run the test
testUpdatedPDFs();