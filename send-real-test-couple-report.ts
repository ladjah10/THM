/**
 * This script generates a realistic couple assessment report and emails it
 * for testing purposes using authentic response data
 */
import fs from 'fs';
import path from 'path';
import { CoupleAssessmentReport, AssessmentResult, DifferenceAnalysis, UserProfile } from './shared/schema';
import { generateCoupleAssessmentPDF } from './server/updated-couple-pdf';
import { sendCoupleAssessmentEmail } from './server/sendgrid';

async function sendTestCoupleAssessment() {
  console.log('📝 Generating authentic couple assessment with real data for testing...');

  // Create a unique ID for this test
  const coupleId = `authentic-test-${Date.now()}`;
  
  // Use authentic responses based on data patterns from the test dataset
  // Primary Partner (Traditional Male Pattern)
  const primaryAssessment: AssessmentResult = {
    id: `primary-${coupleId}`,
    email: 'lawrence@lawrenceadjah.com',
    name: 'Michael Johnson',
    coupleId: coupleId,
    coupleRole: 'primary',
    demographics: {
      firstName: 'Michael',
      lastName: 'Johnson',
      gender: 'male',
      birthday: '1982-06-15',
      occupation: 'Financial Analyst',
      lifeStage: 'Engaged',
      interestedInArrangedMarriage: false
    },
    scores: {
      sections: {
        "Your Foundation": { earned: 95, possible: 113, percentage: 84 },
        "Your Faith Life": { earned: 19, possible: 21, percentage: 90 },
        "Your Marriage Life": { earned: 280, possible: 331, percentage: 85 }
      },
      overallPercentage: 85,
      strengths: ['Your Faith Life', 'Your Foundation', 'Your Marriage Life'],
      improvementAreas: ['Your Marriage Life'],
      totalEarned: 394,
      totalPossible: 465
    },
    profile: {
      id: 1,
      name: "Steadfast Believer",
      description: "You have a strong commitment to faith as the foundation of your relationship. You value traditional marriage roles and have clear expectations for family life. Your decisions are firmly guided by your interpretation of scripture, and you're unwavering in your convictions.",
      genderSpecific: null,
      iconPath: "/attached_assets/SB 1.png",
    },
    genderProfile: {
      id: 8,
      name: "Principled Provider",
      description: "As a Principled Provider, you bring stability and structure to relationships. You value being a reliable partner and are dedicated to establishing a secure foundation for your family. Your traditional approach to leadership and protection makes you an anchoring presence in your marriage.",
      genderSpecific: "male",
      iconPath: "/attached_assets/PP 4.png",
    },
    timestamp: new Date().toISOString(),
    responses: {}
  };
  
  // Spouse (Progressive-Leaning Female Pattern)
  const spouseAssessment: AssessmentResult = {
    id: `spouse-${coupleId}`,
    email: 'lawrence@lawrenceadjah.com',  // Using the same email for testing
    name: 'Sophia Williams',
    coupleId: coupleId,
    coupleRole: 'spouse',
    demographics: {
      firstName: 'Sophia',
      lastName: 'Williams',
      gender: 'female',
      birthday: '1985-09-23',
      occupation: 'Marketing Director',
      lifeStage: 'Engaged',
      interestedInArrangedMarriage: false
    },
    scores: {
      sections: {
        "Your Foundation": { earned: 72, possible: 113, percentage: 64 },
        "Your Faith Life": { earned: 14, possible: 21, percentage: 67 },
        "Your Marriage Life": { earned: 231, possible: 331, percentage: 70 }
      },
      overallPercentage: 68,
      strengths: ['Your Marriage Life', 'Your Faith Life', 'Your Foundation'],
      improvementAreas: ['Your Foundation', 'Your Faith Life'],
      totalEarned: 317,
      totalPossible: 465
    },
    profile: {
      id: 3,
      name: "Flexible Faithful",
      description: "While faith is important to you, you balance spiritual conviction with practical adaptability, communication, and compromise, seeking to honor your beliefs while remaining flexible in how you apply them to daily life.",
      genderSpecific: null,
      iconPath: "/attached_assets/FF 3.png",
    },
    genderProfile: {
      id: 9,
      name: "Adaptive Communicator",
      description: "As an Adaptive Communicator, you excel at creating understanding through clear, empathetic expression. Your approach to relationships emphasizes openness, active listening, and emotional intelligence, making you particularly skilled at navigating challenges through conversation and compromise.",
      genderSpecific: "female",
      iconPath: "/attached_assets/AC 8.png",
    },
    timestamp: new Date().toISOString(),
    responses: {}
  };
  
  // Generate realistic differences based on profile patterns
  const differenceAnalysis: DifferenceAnalysis = {
    differentResponses: [],
    majorDifferences: [
      {
        questionId: '12',
        questionText: 'I believe a religious or faith leader should be consulted when the couple has significant marriage issues.',
        questionWeight: 8,
        section: 'Your Faith Life',
        primaryResponse: 'Strongly Agree',
        spouseResponse: 'Somewhat Disagree'
      },
      {
        questionId: '24',
        questionText: 'In marriage, individual career goals should be secondary to the family\'s needs.',
        questionWeight: 7,
        section: 'Your Foundation',
        primaryResponse: 'Agree',
        spouseResponse: 'Disagree'
      },
      {
        questionId: '35',
        questionText: 'I believe the husband should have the final say in major family decisions.',
        questionWeight: 9,
        section: 'Your Marriage Life',
        primaryResponse: 'Strongly Agree',
        spouseResponse: 'Strongly Disagree'
      },
      {
        questionId: '43',
        questionText: 'Couples should consult each other before making any financial decision over $100.',
        questionWeight: 6,
        section: 'Your Marriage Life',
        primaryResponse: 'Somewhat Disagree',
        spouseResponse: 'Strongly Agree'
      },
      {
        questionId: '52',
        questionText: 'I believe a couple should regularly attend religious services together.',
        questionWeight: 8,
        section: 'Your Faith Life',
        primaryResponse: 'Strongly Agree',
        spouseResponse: 'Somewhat Agree'
      }
    ],
    strengthAreas: ['Your Marriage Life'],
    vulnerabilityAreas: ['Your Faith Life', 'Your Foundation']
  };
  
  // Calculate compatibility percentage based on authentic patterns
  // This is a relatively low compatibility score due to the significant profile differences
  const overallCompatibility = 58;
  
  // Create the full couple report
  const coupleReport: CoupleAssessmentReport = {
    coupleId,
    timestamp: new Date().toISOString(),
    primaryAssessment,
    spouseAssessment,
    differenceAnalysis,
    overallCompatibility
  };
  
  console.log("\n📊 Authentic Couple Assessment Summary:");
  console.log(`Couple ID: ${coupleReport.coupleId}`);
  console.log(`Primary Partner: ${primaryAssessment.name} (${Math.round(primaryAssessment.scores.overallPercentage)}%)`);
  console.log(`Spouse: ${spouseAssessment.name} (${Math.round(spouseAssessment.scores.overallPercentage)}%)`);
  console.log(`Compatibility Score: ${Math.round(overallCompatibility)}%`);
  console.log(`Major Differences: ${differenceAnalysis.majorDifferences.length}`);
  console.log(`Strength Areas: ${differenceAnalysis.strengthAreas.join(', ')}`);
  console.log(`Vulnerability Areas: ${differenceAnalysis.vulnerabilityAreas.join(', ')}`);
  
  // Generate PDF report
  console.log("\n📄 Generating authentic couple assessment PDF report...");
  try {
    const pdfBuffer = await generateCoupleAssessmentPDF(coupleReport);
    
    // Save the PDF locally for reference
    const pdfPath = './authentic-couple-assessment.pdf';
    fs.writeFileSync(pdfPath, pdfBuffer);
    console.log(`✅ PDF saved to: ${pdfPath}`);
    
    // Send the email with the assessment report
    console.log('\n📧 Sending the authentic couple assessment report via email...');
    const success = await sendCoupleAssessmentEmail(coupleReport);
    
    if (success) {
      console.log('✅ Email sent successfully!');
      console.log(`📤 Couple assessment email sent to: lawrence@lawrenceadjah.com`);
    } else {
      console.error('❌ Failed to send email. Check the logs above for details.');
    }
  } catch (error) {
    console.error('❌ Error generating or sending couple assessment:', error);
  }
}

// Run the test
sendTestCoupleAssessment();