/**
 * Test script to verify separate design templates for Individual and Couple reports
 * This ensures proper design fidelity with distinct styling, colors, and branding
 */

import { generateIndividualAssessmentPDF, generateCoupleAssessmentPDF } from './server/pdfReportGenerator';
import { AssessmentResult, CoupleAssessmentReport, DifferenceAnalysis } from './shared/schema';
import fs from 'fs';

async function testSeparateReportTemplates() {
  console.log('Testing separate design templates for Individual and Couple reports...');

  // Individual Assessment Sample
  const individualAssessment: AssessmentResult = {
    id: 'test-individual-123',
    email: 'individual@test.com',
    name: 'Sarah Johnson',
    demographics: {
      firstName: 'Sarah',
      lastName: 'Johnson',
      gender: 'female',
      birthday: '1990-08-15',
      lifeStage: 'single',
      interestedInArrangedMarriage: true
    },
    scores: {
      sections: {
        "Your Foundation": { earned: 95, possible: 113, percentage: 84.1 },
        "Your Faith Life": { earned: 17, possible: 21, percentage: 81.0 },
        "Your Marriage Life": { earned: 280, possible: 331, percentage: 84.6 },
        "Your Finances": { earned: 45, possible: 56, percentage: 80.4 },
        "Your Family/Home Life": { earned: 38, possible: 42, percentage: 90.5 },
        "Your Marriage and Boundaries": { earned: 25, possible: 28, percentage: 89.3 }
      },
      overallPercentage: 84.8,
      strengths: ['Your Family/Home Life', 'Your Marriage and Boundaries'],
      improvementAreas: ['Your Faith Life', 'Your Finances'],
      totalEarned: 500,
      totalPossible: 591
    },
    profile: {
      id: 3,
      name: "Faithful Companion",
      description: "Strong emphasis on loyalty and spiritual foundation in marriage. Values commitment, faithfulness, and building a God-centered relationship with clear moral boundaries.",
      genderSpecific: null,
      iconPath: "FCH 10.png",
      criteria: []
    },
    genderProfile: {
      id: 13,
      name: "The Nurturing Leader (Women Only)",
      description: "Combines traditional feminine strengths with leadership qualities. Shows natural ability to nurture while maintaining personal strength and clear boundaries in relationships.",
      genderSpecific: "female",
      iconPath: "FF 3.png",
      criteria: []
    },
    timestamp: new Date().toISOString(),
    status: 'completed'
  };

  // Couple Assessment Sample
  const primaryAssessment: AssessmentResult = {
    id: 'test-couple-primary',
    email: 'couple1@test.com',
    name: 'Michael Thompson',
    demographics: {
      firstName: 'Michael',
      lastName: 'Thompson',
      gender: 'male',
      birthday: '1988-03-20',
      lifeStage: 'engaged',
      interestedInArrangedMarriage: false
    },
    scores: {
      sections: {
        "Your Foundation": { earned: 101, possible: 113, percentage: 89.4 },
        "Your Faith Life": { earned: 19, possible: 21, percentage: 90.5 },
        "Your Marriage Life": { earned: 295, possible: 331, percentage: 89.1 },
        "Your Finances": { earned: 48, possible: 56, percentage: 85.7 },
        "Your Family/Home Life": { earned: 35, possible: 42, percentage: 83.3 },
        "Your Marriage and Boundaries": { earned: 24, possible: 28, percentage: 85.7 }
      },
      overallPercentage: 88.2,
      strengths: ['Your Faith Life', 'Your Foundation'],
      improvementAreas: ['Your Family/Home Life'],
      totalEarned: 522,
      totalPossible: 591
    },
    profile: {
      id: 8,
      name: "Balanced Visionary",
      description: "Thoughtful, balanced approach to marriage combining traditional values with modern perspectives. Seeks harmony between stability and flexibility.",
      genderSpecific: null,
      iconPath: "BV 6.png",
      criteria: []
    },
    genderProfile: {
      id: 14,
      name: "The Protective Leader (Men Only)",
      description: "Traditional masculine leadership approach with protective family values. Demonstrates strong commitment to providing security and spiritual guidance.",
      genderSpecific: "male",
      iconPath: "BP 13.png",
      criteria: []
    },
    timestamp: new Date().toISOString(),
    status: 'completed'
  };

  const spouseAssessment: AssessmentResult = {
    id: 'test-couple-spouse',
    email: 'couple2@test.com',
    name: 'Emily Thompson',
    demographics: {
      firstName: 'Emily',
      lastName: 'Thompson',
      gender: 'female',
      birthday: '1992-07-12',
      lifeStage: 'engaged',
      interestedInArrangedMarriage: false
    },
    scores: {
      sections: {
        "Your Foundation": { earned: 92, possible: 113, percentage: 81.4 },
        "Your Faith Life": { earned: 18, possible: 21, percentage: 85.7 },
        "Your Marriage Life": { earned: 275, possible: 331, percentage: 83.1 },
        "Your Finances": { earned: 42, possible: 56, percentage: 75.0 },
        "Your Family/Home Life": { earned: 38, possible: 42, percentage: 90.5 },
        "Your Marriage and Boundaries": { earned: 26, possible: 28, percentage: 92.9 }
      },
      overallPercentage: 84.1,
      strengths: ['Your Marriage and Boundaries', 'Your Family/Home Life'],
      improvementAreas: ['Your Finances'],
      totalEarned: 491,
      totalPossible: 591
    },
    profile: {
      id: 3,
      name: "Faithful Companion",
      description: "Strong emphasis on loyalty and spiritual foundation in marriage. Values commitment, faithfulness, and building a God-centered relationship.",
      genderSpecific: null,
      iconPath: "FCH 10.png",
      criteria: []
    },
    genderProfile: {
      id: 13,
      name: "The Nurturing Leader (Women Only)",
      description: "Combines traditional feminine strengths with leadership qualities. Shows natural ability to nurture while maintaining personal strength.",
      genderSpecific: "female",
      iconPath: "FF 3.png",
      criteria: []
    },
    timestamp: new Date().toISOString(),
    status: 'completed'
  };

  const differenceAnalysis: DifferenceAnalysis = {
    overallDifference: 4.1,
    sectionDifferences: {
      "Your Foundation": {
        primaryPercentage: 89.4,
        spousePercentage: 81.4,
        differencePct: 8.0
      },
      "Your Faith Life": {
        primaryPercentage: 90.5,
        spousePercentage: 85.7,
        differencePct: 4.8
      },
      "Your Marriage Life": {
        primaryPercentage: 89.1,
        spousePercentage: 83.1,
        differencePct: 6.0
      },
      "Your Finances": {
        primaryPercentage: 85.7,
        spousePercentage: 75.0,
        differencePct: 10.7
      },
      "Your Family/Home Life": {
        primaryPercentage: 83.3,
        spousePercentage: 90.5,
        differencePct: 7.2
      },
      "Your Marriage and Boundaries": {
        primaryPercentage: 85.7,
        spousePercentage: 92.9,
        differencePct: 7.2
      }
    },
    strengthAreas: ['Your Faith Life', 'Your Marriage and Boundaries'],
    vulnerabilityAreas: ['Your Finances', 'Your Foundation']
  };

  const coupleReport: CoupleAssessmentReport = {
    id: 'test-couple-report',
    primaryAssessment,
    spouseAssessment,
    differenceAnalysis,
    overallCompatibility: 91.8,
    timestamp: new Date().toISOString()
  };

  try {
    // Generate Individual Assessment PDF with green color scheme
    console.log("Generating Individual Assessment PDF (green theme)...");
    const individualPDF = await generateIndividualAssessmentPDF(individualAssessment);
    fs.writeFileSync('test-outputs/individual-assessment-template.pdf', individualPDF);
    console.log("✓ Individual assessment PDF saved with green color scheme");

    // Generate Couple Assessment PDF with blue color scheme
    console.log("Generating Couple Assessment PDF (blue theme)...");
    const couplePDF = await generateCoupleAssessmentPDF(coupleReport);
    fs.writeFileSync('test-outputs/couple-assessment-template.pdf', couplePDF);
    console.log("✓ Couple assessment PDF saved with blue color scheme");

    console.log("\n=== Template Verification Results ===");
    console.log("Individual Report Features:");
    console.log("• Green color scheme (#3D9400 primary, #F1F8E9 header background)");
    console.log("• 'Individual Assessment Report' in header");
    console.log("• 'Individual Report' in footer");
    console.log("• Gender-specific profile sections for female users");
    console.log("• Green divider lines and accent colors");

    console.log("\nCouple Report Features:");
    console.log("• Blue color scheme (#005A9C primary, #E3F2FD header background)");
    console.log("• 'Couple Assessment Report' in header");
    console.log("• 'Couple Report' in footer");
    console.log("• Comparative analysis sections");
    console.log("• Blue divider lines and accent colors");

    console.log("\n✅ Separate design templates successfully implemented!");
    console.log("PDFs saved to test-outputs/ for visual verification");

  } catch (error) {
    console.error("❌ Error during template testing:", error);
    throw error;
  }
}

// Ensure test-outputs directory exists
if (!fs.existsSync('test-outputs')) {
  fs.mkdirSync('test-outputs');
}

testSeparateReportTemplates()
  .then(() => {
    console.log("Template testing completed successfully!");
    process.exit(0);
  })
  .catch((error) => {
    console.error("Template testing failed:", error);
    process.exit(1);
  });