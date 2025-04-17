import fs from 'fs';
import path from 'path';
import { CoupleAssessmentReport, DifferenceAnalysis, AssessmentResult } from './shared/schema';
import { generateCoupleAssessmentPDF } from './server/pdf-generator';

// Create realistic test data
const primaryAssessment: AssessmentResult = {
  email: "michael@example.com",
  name: "Michael Johnson",
  demographics: {
    firstName: "Michael",
    lastName: "Johnson",
    email: "michael@example.com",
    birthday: "1985-03-15",
    gender: "male",
    lifeStage: "Married",
    phone: "555-123-4567",
    marriageStatus: "Married",
    desireChildren: "Yes",
    ethnicity: "Caucasian",
    city: "Atlanta",
    state: "GA",
    zipCode: "30303",
    hasPaid: true
  },
  scores: {
    sections: {
      "Your Faith Life": { earned: 95, possible: 108, percentage: 88 },
      "Your Foundation": { earned: 86, possible: 108, percentage: 80 },
      "Your Family/Home Life": { earned: 90, possible: 108, percentage: 83 },
      "Your Finances": { earned: 85, possible: 108, percentage: 79 },
      "Your Partnership": { earned: 82, possible: 108, percentage: 76 },
      "Your Marriage Life": { earned: 89, possible: 108, percentage: 82 },
      "Your Parenting Life": { earned: 92, possible: 108, percentage: 85 },
      "Your Health and Wellness": { earned: 94, possible: 108, percentage: 87 }
    },
    overallPercentage: 82.5,
    strengths: ["Your Faith Life", "Your Health and Wellness", "Your Parenting Life"],
    improvementAreas: ["Your Partnership", "Your Finances"],
    totalEarned: 713,
    totalPossible: 864
  },
  profile: {
    id: 2,
    name: "Harmonious Planners",
    description: "You place high value on order, stability, and clearly defined roles in marriage, with faith playing an important part in your relationship framework.",
    genderSpecific: null,
    criteria: [{ section: "Your Faith Life", min: 70 }, { section: "Your Foundation", min: 75 }],
    iconPath: "/profiles/HP.png"
  },
  genderProfile: {
    id: 8,
    name: "Structured Leaders",
    description: "As a Structured Leader, you believe in taking primary responsibility for the family's spiritual and financial wellbeing, while maintaining traditional leadership roles.",
    genderSpecific: "male",
    criteria: [
      { section: "Your Faith Life", min: 70 },
      { section: "Your Foundation", min: 70 },
      { section: "Your Finances", min: 65 }
    ],
    iconPath: "/profiles/SL.png"
  },
  responses: {
    // Just some sample responses to allow the PDF generator to work
    "1": { option: "Strongly Agree", value: 4 },
    "2": { option: "Agree", value: 3 },
    "3": { option: "Strongly Agree", value: 4 }
  },
  timestamp: "2025-04-17T20:24:47.188Z",
  coupleId: "realistic-test-1744925087186",
  coupleRole: "primary"
};

const spouseAssessment: AssessmentResult = {
  email: "sarah@example.com",
  name: "Sarah Williams",
  demographics: {
    firstName: "Sarah",
    lastName: "Williams",
    email: "sarah@example.com",
    birthday: "1987-06-12",
    gender: "female",
    lifeStage: "Married",
    phone: "555-987-6543",
    marriageStatus: "Married",
    desireChildren: "Yes",
    ethnicity: "African American",
    city: "Atlanta",
    state: "GA",
    zipCode: "30303",
    hasPaid: true
  },
  scores: {
    sections: {
      "Your Faith Life": { earned: 70, possible: 108, percentage: 65 },
      "Your Foundation": { earned: 65, possible: 108, percentage: 60 },
      "Your Family/Home Life": { earned: 78, possible: 108, percentage: 72 },
      "Your Finances": { earned: 72, possible: 108, percentage: 67 },
      "Your Partnership": { earned: 80, possible: 108, percentage: 74 },
      "Your Marriage Life": { earned: 62, possible: 108, percentage: 57 },
      "Your Parenting Life": { earned: 74, possible: 108, percentage: 69 },
      "Your Health and Wellness": { earned: 85, possible: 108, percentage: 79 }
    },
    overallPercentage: 67.9,
    strengths: ["Your Health and Wellness", "Your Partnership", "Your Family/Home Life"],
    improvementAreas: ["Your Marriage Life", "Your Foundation"],
    totalEarned: 586,
    totalPossible: 864
  },
  profile: {
    id: 5,
    name: "Individualist Seekers",
    description: "You value personal growth and independence within marriage, believing relationships should adapt to support each partner's evolving needs and aspirations.",
    genderSpecific: null,
    criteria: [
      { section: "Your Faith Life", max: 70 },
      { section: "Your Foundation", max: 70 },
      { section: "Your Partnership", min: 65 }
    ],
    iconPath: "/profiles/IS.png"
  },
  genderProfile: {
    id: 6,
    name: "Relational Nurturers",
    description: "As a Relational Nurturer, you place high value on emotional connection and creating a harmonious home environment, desiring a supportive partner who appreciates these qualities.",
    genderSpecific: "female",
    criteria: [
      { section: "Your Family/Home Life", min: 70 },
      { section: "Your Partnership", min: 70 }
    ],
    iconPath: "/profiles/RN.png"
  },
  responses: {
    // Just some sample responses to allow the PDF generator to work
    "1": { option: "Disagree", value: 1 },
    "2": { option: "Neutral", value: 2 },
    "3": { option: "Agree", value: 3 }
  },
  timestamp: "2025-04-17T20:24:47.188Z",
  coupleId: "realistic-test-1744925087186",
  coupleRole: "spouse"
};

// Create realistic difference analysis
const differenceAnalysis: DifferenceAnalysis = {
  differentResponses: [
    {
      questionId: "1",
      questionText: "My spouse and I should share the same faith or religious beliefs.",
      questionWeight: 4,
      section: "Your Faith Life",
      primaryResponse: "Strongly Agree",
      spouseResponse: "Disagree"
    },
    {
      questionId: "2",
      questionText: "I believe that the husband should be the primary decision maker in a marriage.",
      questionWeight: 3,
      section: "Your Foundation",
      primaryResponse: "Agree",
      spouseResponse: "Neutral"
    },
    {
      questionId: "3",
      questionText: "I believe in maintaining traditional gender roles in marriage.",
      questionWeight: 3,
      section: "Your Marriage Life",
      primaryResponse: "Strongly Agree",
      spouseResponse: "Agree"
    }
  ],
  majorDifferences: [
    {
      questionId: "1",
      questionText: "My spouse and I should share the same faith or religious beliefs.",
      questionWeight: 4,
      section: "Your Faith Life",
      primaryResponse: "Strongly Agree",
      spouseResponse: "Disagree"
    },
    {
      questionId: "4",
      questionText: "I believe it's important to prioritize marriage over career.",
      questionWeight: 3,
      section: "Your Foundation",
      primaryResponse: "Strongly Agree",
      spouseResponse: "Disagree"
    }
  ],
  strengthAreas: ["Your Health and Wellness", "Your Parenting Life", "Your Family/Home Life"],
  vulnerabilityAreas: ["Your Marriage Life", "Your Foundation"]
};

// Create the couple report
const coupleReport: CoupleAssessmentReport = {
  coupleId: "realistic-test-1744925087186",
  timestamp: "2025-04-17T20:24:47.188Z",
  primaryAssessment,
  spouseAssessment,
  differenceAnalysis,
  overallCompatibility: 15.2
};

// Function to save and test PDF generation
async function savePDFReport() {
  console.log("Generating PDF report for testing...");

  try {
    const pdfBuffer = await generateCoupleAssessmentPDF(coupleReport);
    const outputPath = path.join(process.cwd(), 'couple-assessment-sample.pdf');
    
    fs.writeFileSync(outputPath, pdfBuffer);
    console.log(`PDF saved successfully to: ${outputPath}`);
  } catch (error) {
    console.error("Error generating PDF:", error);
  }
}

// Run the test
savePDFReport();