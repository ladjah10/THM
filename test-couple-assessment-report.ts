import { sendCoupleAssessmentEmail } from './server/nodemailer';
import { AssessmentResult, CoupleAssessmentReport, DifferenceAnalysis } from './shared/schema';

// Create sample assessment data for primary spouse
const primaryAssessment: AssessmentResult = {
  email: "john@example.com",
  name: "John Smith",
  scores: {
    sections: {
      "Communication": { earned: 85, possible: 100, percentage: 85 },
      "Compatibility": { earned: 90, possible: 100, percentage: 90 },
      "Faith": { earned: 78, possible: 100, percentage: 78 },
      "Financial Management": { earned: 65, possible: 100, percentage: 65 },
      "Family Planning": { earned: 92, possible: 100, percentage: 92 },
      "Life Vision": { earned: 88, possible: 100, percentage: 88 }
    },
    overallPercentage: 83,
    strengths: [
      "Strong communication skills and openness",
      "Aligned on family planning goals",
      "Shared vision for the future",
      "Faith-based foundation for marriage"
    ],
    improvementAreas: [
      "Financial management and planning",
      "Work-life balance expectations",
      "Conflict resolution strategies"
    ],
    totalEarned: 498,
    totalPossible: 600
  },
  profile: {
    id: 1,
    name: "Balanced Visionaries",
    description: "Balanced Visionaries approach marriage with a well-rounded perspective, demonstrating high scores across communication, family planning, and life vision areas. They exhibit a thoughtful approach to relationship challenges and possess the ability to maintain calm during conflict. Their relationships are characterized by mutual respect, clear communication, and a shared path forward that honors both partners' dreams.",
    genderSpecific: null,
    criteria: [
      { section: "Communication", min: 80 },
      { section: "Life Vision", min: 85 },
      { section: "Family Planning", min: 85 }
    ],
    iconPath: "/assets/BV_6.png"
  },
  genderProfile: {
    id: 5,
    name: "Steadfast Protectors",
    description: "Steadfast Protectors place a high value on family security and maintaining strong protective boundaries. As male partners, they demonstrate a particular devotion to ensuring their loved ones feel safe and provided for. They excel at conflict resolution and typically approach challenges with a pragmatic mindset. Their strong scores in faith and vision areas reveal a commitment to spiritual leadership within their relationship.",
    genderSpecific: "male",
    criteria: [
      { section: "Faith", min: 75 },
      { section: "Life Vision", min: 80 },
      { section: "Communication", min: 70 }
    ],
    iconPath: "/assets/SL_12.png"
  },
  responses: {
    "1": { option: "Strongly Agree", value: 4 },
    "2": { option: "Agree", value: 3 },
    // Simplified for brevity
  },
  demographics: {
    firstName: "John",
    lastName: "Smith",
    email: "john@example.com",
    phone: "123-456-7890",
    gender: "male",
    marriageStatus: "Single",
    desireChildren: "Yes",
    ethnicity: "White,Asian",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    lifeStage: "Dating",
    birthday: "1990-06-15",
    hasPurchasedBook: "Yes",
    purchaseDate: "2025-03-15",
    promoCode: "",
    hasPaid: true
  },
  timestamp: new Date().toISOString(),
  coupleId: "test-couple-" + Date.now(),
  coupleRole: "primary"
};

// Create sample assessment data for spouse
const spouseAssessment: AssessmentResult = {
  email: "sarah@example.com",
  name: "Sarah Johnson",
  scores: {
    sections: {
      "Communication": { earned: 82, possible: 100, percentage: 82 },
      "Compatibility": { earned: 88, possible: 100, percentage: 88 },
      "Faith": { earned: 75, possible: 100, percentage: 75 },
      "Financial Management": { earned: 72, possible: 100, percentage: 72 },
      "Family Planning": { earned: 90, possible: 100, percentage: 90 },
      "Life Vision": { earned: 85, possible: 100, percentage: 85 }
    },
    overallPercentage: 81,
    strengths: [
      "Family planning alignment",
      "Strong compatibility scores",
      "Shared life vision",
      "Effective communication"
    ],
    improvementAreas: [
      "Faith integration in relationship",
      "Financial decision-making",
      "Extended family boundaries"
    ],
    totalEarned: 492,
    totalPossible: 600
  },
  profile: {
    id: 2,
    name: "Balanced Partnership",
    description: "Balanced Partnership seekers value equality and mutual respect in relationships. Their high scores in compatibility and communication demonstrate their desire for a relationship where both partners have equal say and shared responsibility. They typically approach conflict with level-headedness and seek fair resolutions.",
    genderSpecific: null,
    criteria: [
      { section: "Compatibility", min: 85 },
      { section: "Communication", min: 80 },
      { section: "Life Vision", min: 80 }
    ],
    iconPath: "/assets/BP_13.png"
  },
  genderProfile: {
    id: 9,
    name: "Adaptive Nurturer",
    description: "Adaptive Nurturers bring an exceptional emotional intelligence to relationships. As female partners, they demonstrate a particular gift for understanding others' needs and creating harmonious environments. They value both tradition and progressive approaches, adapting as needed to support their relationship goals.",
    genderSpecific: "female",
    criteria: [
      { section: "Compatibility", min: 80 },
      { section: "Communication", min: 75 },
      { section: "Family Planning", min: 85 }
    ],
    iconPath: "/assets/IT_9.png"
  },
  responses: {
    "1": { option: "Strongly Agree", value: 4 },
    "2": { option: "Agree", value: 3 },
    // Simplified for brevity
  },
  demographics: {
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah@example.com",
    phone: "987-654-3210",
    gender: "female",
    marriageStatus: "Single",
    desireChildren: "Yes",
    ethnicity: "Black,Hispanic",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    lifeStage: "Dating",
    birthday: "1992-09-21",
    hasPurchasedBook: "No",
    promoCode: "",
    hasPaid: true
  },
  timestamp: new Date().toISOString(),
  coupleId: primaryAssessment.coupleId,
  coupleRole: "spouse"
};

// Create sample difference analysis
const differenceAnalysis: DifferenceAnalysis = {
  differentResponses: [
    {
      questionId: "12",
      questionText: "How important is it to plan finances together?",
      questionWeight: 4,
      section: "Financial Management",
      primaryResponse: "Very important, all financial decisions should be made together",
      spouseResponse: "Somewhat important, but we should maintain some financial independence"
    },
    {
      questionId: "27",
      questionText: "How do you prefer to resolve conflicts?",
      questionWeight: 3,
      section: "Communication",
      primaryResponse: "Address issues immediately and directly",
      spouseResponse: "Take time to cool off before discussing sensitive topics"
    },
    {
      questionId: "35",
      questionText: "What role should in-laws play in your marriage?",
      questionWeight: 3,
      section: "Extended Family",
      primaryResponse: "Limited involvement, with clear boundaries",
      spouseResponse: "Regular involvement and guidance from both families"
    }
  ],
  majorDifferences: [
    {
      questionId: "12",
      questionText: "How important is it to plan finances together?",
      questionWeight: 4,
      section: "Financial Management",
      primaryResponse: "Very important, all financial decisions should be made together",
      spouseResponse: "Somewhat important, but we should maintain some financial independence"
    },
    {
      questionId: "35",
      questionText: "What role should in-laws play in your marriage?",
      questionWeight: 3,
      section: "Extended Family",
      primaryResponse: "Limited involvement, with clear boundaries",
      spouseResponse: "Regular involvement and guidance from both families"
    }
  ],
  strengthAreas: [
    "Faith & Spirituality",
    "Family Planning",
    "Financial Priorities"
  ],
  vulnerabilityAreas: [
    "Extended Family",
    "Household Responsibilities"
  ]
};

// Create the couple assessment report
const coupleReport: CoupleAssessmentReport = {
  coupleId: primaryAssessment.coupleId as string,
  timestamp: new Date().toISOString(),
  primaryAssessment,
  spouseAssessment,
  differenceAnalysis,
  overallCompatibility: 78 // 78% compatibility
};

// Run the test for couple assessment report
async function runCoupleAssessmentTest() {
  console.log("Testing couple assessment report and email...");
  console.log(`Couple ID: ${coupleReport.coupleId}`);
  console.log(`Primary: ${primaryAssessment.name} (${primaryAssessment.email})`);
  console.log(`Spouse: ${spouseAssessment.name} (${spouseAssessment.email})`);
  console.log(`Compatibility: ${coupleReport.overallCompatibility}%`);
  console.log(`Number of differences: ${differenceAnalysis.differentResponses.length}`);
  console.log(`Major differences: ${differenceAnalysis.majorDifferences.length}`);
  
  try {
    const result = await sendCoupleAssessmentEmail(coupleReport, "admincc@example.com");
    
    if (result.success) {
      console.log("Couple assessment email sent successfully!");
      if (result.previewUrl) {
        console.log(`Preview URL: ${result.previewUrl}`);
        console.log("Open this URL in your browser to view the test email with couple assessment report");
      }
    } else {
      console.error("Failed to send couple assessment email");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Run the test
runCoupleAssessmentTest();