import { ProfessionalPDFGenerator } from './server/pdfReportGenerator';
import { AssessmentResult, CoupleAssessmentReport } from './shared/schema';
import fs from 'fs';

// Test data for individual assessment
const testIndividualAssessment: AssessmentResult = {
  demographicData: {
    firstName: "John",
    lastName: "Smith",
    email: "john.smith@example.com",
    gender: "male",
    marriageStatus: "no",
    desireChildren: "yes",
    ethnicity: "Caucasian",
    city: "Atlanta",
    state: "Georgia",
    zipCode: "30309"
  },
  scores: {
    sections: {
      "Your Foundation": { earned: 45, possible: 68, percentage: 85.2 },
      "Your Faith Life": { earned: 52, possible: 67, percentage: 77.6 },
      "Your Marriage Life": { earned: 110, possible: 143, percentage: 76.9 },
      "Your Parenting Life": { earned: 95, possible: 131, percentage: 72.5 },
      "Your Family/Home Life": { earned: 72, possible: 102, percentage: 70.6 },
      "Your Finances": { earned: 44, possible: 63, percentage: 69.8 },
      "Your Health and Wellness": { earned: 38, possible: 60, percentage: 63.3 },
      "Your Marriage and Boundaries": { earned: 41, possible: 64, percentage: 64.1 }
    },
    overallPercentage: 74.2,
    strengths: [
      "Strong Your Foundation compatibility (85.2%)",
      "Strong Your Faith Life compatibility (77.6%)",
      "Strong Your Marriage Life compatibility (76.9%)"
    ],
    improvementAreas: [
      "Your Health and Wellness alignment can be improved (63.3%)",
      "Your Marriage and Boundaries alignment can be improved (64.1%)"
    ],
    totalEarned: 497,
    totalPossible: 698
  },
  profile: {
    id: 13,
    name: "Biblical Protectors",
    description: "You take spiritual leadership seriously and are committed to protecting and providing for your family. Your strong biblical convictions guide your decisions, and you believe in leading with both strength and gentleness. You value traditional marriage roles while respecting your partner's unique gifts and contributions.",
    genderSpecific: "male",
    criteria: [
      { section: "Your Foundation", min: 85 },
      { section: "Your Marriage and Boundaries", min: 80 }
    ],
    iconPath: "/icons/profiles/BP 13.png"
  },
  genderProfile: {
    id: 13,
    name: "Biblical Protectors",
    description: "You take spiritual leadership seriously and are committed to protecting and providing for your family. Your strong biblical convictions guide your decisions, and you believe in leading with both strength and gentleness.",
    genderSpecific: "male",
    criteria: [
      { section: "Your Foundation", min: 85 },
      { section: "Your Marriage and Boundaries", min: 80 }
    ],
    iconPath: "/icons/profiles/BP 13.png"
  }
};

// Test data for couple assessment
const testCoupleAssessment: CoupleAssessmentReport = {
  primaryAssessment: testIndividualAssessment,
  spouseAssessment: {
    ...testIndividualAssessment,
    demographicData: {
      ...testIndividualAssessment.demographicData,
      firstName: "Sarah",
      lastName: "Smith",
      email: "sarah.smith@example.com",
      gender: "female"
    },
    scores: {
      ...testIndividualAssessment.scores,
      overallPercentage: 78.5,
      sections: {
        "Your Foundation": { earned: 50, possible: 68, percentage: 88.2 },
        "Your Faith Life": { earned: 48, possible: 67, percentage: 71.6 },
        "Your Marriage Life": { earned: 115, possible: 143, percentage: 80.4 },
        "Your Parenting Life": { earned: 105, possible: 131, percentage: 80.2 },
        "Your Family/Home Life": { earned: 78, possible: 102, percentage: 76.5 },
        "Your Finances": { earned: 40, possible: 63, percentage: 63.5 },
        "Your Health and Wellness": { earned: 42, possible: 60, percentage: 70.0 },
        "Your Marriage and Boundaries": { earned: 45, possible: 64, percentage: 70.3 }
      }
    },
    profile: {
      id: 7,
      name: "Relational Nurturers",
      description: "You prioritize emotional connection and nurturing in your marriage. Your faith influences how you care for your relationship and future family, and you value creating a supportive, loving home environment.",
      genderSpecific: "female",
      criteria: [
        { section: "Your Parenting Life", min: 85 },
        { section: "Your Marriage Life", min: 80 }
      ],
      iconPath: "/icons/profiles/RN 7.png"
    }
  },
  differenceAnalysis: {
    significantDifferences: [
      {
        section: "Your Faith Life",
        difference: 6.0,
        analysis: "There's a notable difference in faith expression preferences that could benefit from open discussion."
      }
    ],
    alignmentAreas: [
      {
        section: "Your Foundation",
        similarity: 96.6,
        analysis: "You both share strong foundational values and beliefs about marriage."
      },
      {
        section: "Your Marriage Life",
        similarity: 95.5,
        analysis: "Excellent alignment on marriage expectations and relationship priorities."
      }
    ],
    recommendations: [
      "Discuss your different approaches to faith expression and find ways to honor both perspectives",
      "Build on your strong foundational alignment to create shared spiritual practices",
      "Continue developing your excellent communication about marriage expectations"
    ],
    overallCompatibility: "High compatibility with strong foundational alignment"
  },
  compatibilityScore: 87.3,
  recommendations: [
    "Schedule regular spiritual discussions to bridge faith expression differences",
    "Create a family mission statement based on your shared foundational values",
    "Establish weekly check-ins to maintain your excellent marriage communication",
    "Consider couples Bible study to deepen your spiritual connection"
  ],
  timestamp: new Date().toISOString()
};

async function testPDFGeneration() {
  console.log('🎯 Testing Professional PDF Generation...');
  
  try {
    const generator = new ProfessionalPDFGenerator();
    
    // Test individual report
    console.log('📄 Generating individual assessment report...');
    const individualPDF = await generator.generateIndividualReport(testIndividualAssessment);
    fs.writeFileSync('test-individual-report.pdf', individualPDF);
    console.log('✅ Individual report saved as test-individual-report.pdf');
    
    // Test couple report
    console.log('💑 Generating couple assessment report...');
    const couplePDF = await generator.generateCoupleReport(testCoupleAssessment);
    fs.writeFileSync('test-couple-report.pdf', couplePDF);
    console.log('✅ Couple report saved as test-couple-report.pdf');
    
    console.log('🎉 PDF generation test completed successfully!');
    console.log('📋 Features implemented:');
    console.log('  ✓ Reusable layout functions');
    console.log('  ✓ Grid-based positioning system');
    console.log('  ✓ Standardized fonts and styles');
    console.log('  ✓ Professional color palette');
    console.log('  ✓ Consistent text alignment and width');
    console.log('  ✓ Automatic page breaks');
    console.log('  ✓ Visual score bars and headers');
    console.log('  ✓ Professional branding elements');
    
  } catch (error) {
    console.error('❌ Error during PDF generation test:', error);
  }
}

// Run the test
testPDFGeneration();