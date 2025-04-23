/**
 * This script tests the updated PDF generators with the integrated
 * psychographic profiles reference section
 */
import fs from 'fs';
import { AssessmentResult, CoupleAssessmentReport } from './shared/schema';
import { generateAssessmentPDF, generateCoupleAssessmentPDF } from './server/pdf-generator-integration';

async function testUpdatedPDFsWithReference() {
  try {
    console.log('Testing individual and couple assessment PDFs with profiles reference section...');
    
    // Create a sample individual assessment
    const individualAssessment: AssessmentResult = {
      id: 'test-123',
      email: 'lawrence@lawrenceadjah.com',
      name: 'Lawrence Adjah',
      demographics: {
        firstName: 'Lawrence',
        lastName: 'Adjah',
        gender: 'male',
        birthday: '1985-06-15',
        lifeStage: 'single',
        occupation: 'Author',
        interestedInArrangedMarriage: true
      },
      scores: {
        sections: {
          "Your Foundation": { earned: 101, possible: 113, percentage: 89 },
          "Your Faith Life": { earned: 18, possible: 21, percentage: 86 },
          "Your Marriage Life": { earned: 292, possible: 331, percentage: 88 }
        },
        overallPercentage: 88,
        strengths: ['Your Foundation', 'Your Marriage Life', 'Your Faith Life'],
        improvementAreas: ['Your Marriage Life', 'Your Faith Life'],
        totalEarned: 411,
        totalPossible: 465
      },
      profile: {
        id: 6,
        name: "Balanced Visionary",
        description: "You have a thoughtful, balanced approach to marriage. You value both tradition and modern perspectives, seeking harmony between stability and flexibility. Your responses show a well-rounded understanding of marriage dynamics with a natural ability to adapt while maintaining core values.",
        genderSpecific: null,
        iconPath: "/attached_assets/BV 6.png",
        criteria: [
          { section: "Your Faith Life", min: 75 },
          { section: "Your Marriage Life", min: 70 }
        ]
      },
      genderProfile: {
        id: 4,
        name: "Principled Provider",
        description: "As a Principled Provider, you bring stability and structure to relationships. You value being a reliable partner and are dedicated to establishing a secure foundation for your family. Your traditional approach to leadership and protection makes you an anchoring presence in your marriage.",
        genderSpecific: "male",
        iconPath: "/attached_assets/PP 4.png",
        criteria: [
          { section: "Your Foundation", min: 80 },
          { section: "Your Finances", min: 75 }
        ]
      },
      timestamp: new Date().toISOString(),
      responses: {}
    };

    // Generate and save individual PDF
    console.log('Generating individual assessment PDF with profiles reference...');
    const individualPdfBuffer = await generateAssessmentPDF(individualAssessment);
    fs.writeFileSync('individual-with-profiles-reference.pdf', individualPdfBuffer);
    console.log(`✅ Individual PDF saved (${Math.round(individualPdfBuffer.length / 1024)} KB)`);

    // Create a sample couple assessment
    const primaryAssessment: AssessmentResult = {
      ...individualAssessment,
      id: 'test-primary-123'
    };
    
    const spouseAssessment: AssessmentResult = {
      id: 'test-spouse-123',
      email: 'spouse@example.com',
      name: 'Sarah Williams',
      demographics: {
        firstName: 'Sarah',
        lastName: 'Williams',
        gender: 'female',
        birthday: '1987-08-22',
        lifeStage: 'single',
        occupation: 'Teacher',
        interestedInArrangedMarriage: true
      },
      scores: {
        sections: {
          "Your Foundation": { earned: 85, possible: 113, percentage: 75 },
          "Your Faith Life": { earned: 16, possible: 21, percentage: 76 },
          "Your Marriage Life": { earned: 232, possible: 331, percentage: 70 }
        },
        overallPercentage: 73,
        strengths: ['Your Faith Life', 'Your Foundation', 'Your Marriage Life'],
        improvementAreas: ['Your Marriage Life', 'Your Foundation'],
        totalEarned: 333,
        totalPossible: 465
      },
      profile: {
        id: 2,
        name: "Harmonious Planner",
        description: "You value structure and careful planning in your relationship while maintaining strong faith values. You're committed to establishing clear expectations and boundaries in your marriage while prioritizing your spiritual foundation.",
        genderSpecific: null,
        iconPath: "/attached_assets/HP.png",
        criteria: [
          { section: "Your Foundation", min: 80 },
          { section: "Your Marriage Life", min: 75 },
          { section: "Your Finances", min: 70 }
        ]
      },
      genderProfile: {
        id: 7,
        name: "Relational Nurturer",
        description: "As a Relational Nurturer, you have a natural ability to create emotional security and connection in relationships. You prioritize family cohesion and emotional well-being, making you an empathetic and supportive partner who creates a warm, nurturing environment.",
        genderSpecific: "female",
        iconPath: "/attached_assets/RN 7.png",
        criteria: [
          { section: "Your Marriage Life", min: 75 },
          { section: "Your Family/Home Life", min: 80 }
        ]
      },
      timestamp: new Date().toISOString(),
      responses: {}
    };
    
    const coupleReport: CoupleAssessmentReport = {
      coupleId: 'test-couple-123',
      primaryAssessment: primaryAssessment,
      spouseAssessment: spouseAssessment,
      differenceAnalysis: {
        differentResponses: [],
        majorDifferences: [
          {
            questionId: '1',
            questionText: 'Your Foundation: Regular religious practices are vital to a successful marriage.',
            questionWeight: 9,
            section: 'Your Foundation',
            primaryResponse: 'Strongly Agree',
            spouseResponse: 'Somewhat Disagree'
          },
          {
            questionId: '2',
            questionText: 'Your Marriage Life: Couples should share most hobbies and interests.',
            questionWeight: 8,
            section: 'Your Marriage Life',
            primaryResponse: 'Somewhat Agree',
            spouseResponse: 'Strongly Disagree'
          },
          {
            questionId: '3',
            questionText: 'Your Faith Life: Faith communities should play an important role in supporting marriages.',
            questionWeight: 10,
            section: 'Your Faith Life',
            primaryResponse: 'Strongly Agree',
            spouseResponse: 'Somewhat Agree'
          }
        ],
        strengthAreas: ['Your Marriage Life', 'Your Foundation'],
        vulnerabilityAreas: ['Your Foundation', 'Your Faith Life']
      },
      overallCompatibility: 65,
      timestamp: new Date().toISOString()
    };

    // Generate and save couple PDF
    console.log('Generating couple assessment PDF with profiles reference...');
    const couplePdfBuffer = await generateCoupleAssessmentPDF(coupleReport);
    fs.writeFileSync('couple-with-profiles-reference.pdf', couplePdfBuffer);
    console.log(`✅ Couple PDF saved (${Math.round(couplePdfBuffer.length / 1024)} KB)`);

    console.log('All tests completed successfully!');
  } catch (error) {
    console.error('❌ Error testing PDF generation:', error);
  }
}

// Run the test
testUpdatedPDFsWithReference();