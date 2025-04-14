import { sendAssessmentEmail } from './server/nodemailer';
import { AssessmentResult } from './shared/schema';

// Define a sample assessment result with both profiles for testing
const testAssessment: AssessmentResult = {
  email: "test@example.com",
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
    ]
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
    ]
  },
  responses: {
    "1": { option: "Strongly Agree", value: 4 },
    "2": { option: "Agree", value: 3 },
    // Simplified for brevity
  },
  demographics: {
    firstName: "John",
    lastName: "Smith",
    email: "test@example.com",
    phone: "123-456-7890",
    gender: "male",
    marriageStatus: "Single",
    desireChildren: "Yes",
    ethnicity: "White,Asian",
    hasPurchasedBook: "Yes",
    purchaseDate: "2025-03-15",
    promoCode: "",
    hasPaid: true
  },
  timestamp: new Date().toISOString()
};

// Run the email test
async function runTest() {
  console.log("Sending sample assessment email with both profiles...");
  
  try {
    const result = await sendAssessmentEmail(testAssessment);
    
    if (result.success) {
      console.log("Email sent successfully!");
      if (result.previewUrl) {
        console.log(`Preview URL: ${result.previewUrl}`);
        console.log("Open this URL in your browser to view the test email with both profiles");
      }
    } else {
      console.error("Failed to send email");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

runTest();