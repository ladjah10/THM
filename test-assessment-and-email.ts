import { AssessmentResult } from './shared/schema';
import { sendAssessmentEmail } from './server/nodemailer';

async function runTestAssessment() {
  // Sample demographic data
  const demographicData = {
    firstName: "Lawrence",
    lastName: "Adjah",
    email: "la@lawrenceadjah.com", // This will be both the recipient and CC'd
    phone: "555-123-4567",
    gender: "Male",
    marriageStatus: "Single",
    desireChildren: "Yes",
    ethnicity: "Black/African American",
    hasPurchasedBook: "Yes",
    purchaseDate: "2025-01-01",
    hasPaid: true
  };

  // Sample psychographic profile
  const profile = {
    id: 4,
    name: "The Balanced Visionary",
    description: "You have a strong foundation of faith-centered expectations paired with practical wisdom. You value clear communication, mutual respect, and shared spiritual growth. Your balanced approach to relationships positions you well for a fulfilling marriage built on aligned expectations and shared values.",
    genderSpecific: null,
    criteria: [
      { section: "Faith & Spirituality", min: 75 },
      { section: "Communication", min: 70 },
      { section: "Relationship Dynamics", min: 65 }
    ]
  };

  // Sample assessment scores
  const scores = {
    sections: {
      "Faith & Spirituality": { earned: 85, possible: 100, percentage: 85 },
      "Communication": { earned: 75, possible: 100, percentage: 75 },
      "Relationship Dynamics": { earned: 80, possible: 100, percentage: 80 },
      "Conflict Resolution": { earned: 70, possible: 100, percentage: 70 },
      "Children & Family": { earned: 72, possible: 100, percentage: 72 }
    },
    overallPercentage: 76.4,
    strengths: [
      "Faith-centered relationship foundation",
      "Open and honest communication",
      "Balanced expectations for relationship roles"
    ],
    improvementAreas: [
      "Conflict resolution strategies",
      "Financial planning discussions",
      "Long-term family planning"
    ],
    totalEarned: 382,
    totalPossible: 500
  };

  // Sample responses (simplified for demonstration)
  const responses = {
    "1": { option: "Strongly Agree", value: 5 },
    "2": { option: "Agree", value: 4 },
    "3": { option: "Strongly Agree", value: 5 },
    // ... additional responses would be here
  };

  // Create the assessment result
  const testAssessment: AssessmentResult = {
    email: demographicData.email,
    name: `${demographicData.firstName} ${demographicData.lastName}`,
    scores,
    profile,
    responses: responses as any,
    demographics: demographicData,
    timestamp: new Date().toISOString()
  };

  console.log("✅ Created test assessment data");
  console.log("\n📋 Assessment Summary:");
  console.log(`Name: ${testAssessment.name}`);
  console.log(`Email: ${testAssessment.email}`);
  console.log(`Overall Score: ${scores.overallPercentage.toFixed(1)}%`);
  console.log(`Profile: ${profile.name}`);
  
  console.log("\n📧 Sending test email...");
  const emailResult = await sendAssessmentEmail(testAssessment);
  
  if (emailResult.success) {
    console.log("✅ Email sent successfully!");
    if (emailResult.previewUrl) {
      console.log(`📧 Email Preview URL: ${emailResult.previewUrl}`);
      console.log("Open this URL in your browser to view the test email with PDF attachment");
    }
  } else {
    console.error("❌ Failed to send email");
  }
}

// Run the test
runTestAssessment().catch(console.error);