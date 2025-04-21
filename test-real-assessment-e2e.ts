import { AssessmentResult } from './shared/schema';
import { sendAssessmentEmail } from './server/sendgrid';
import { Question } from './temp/questions'; // Import the actual question structure
import { questions as realQuestions } from './temp/questions'; // Import the real questions

/**
 * This script provides an end-to-end test of the 100 Marriage Assessment system
 * using the actual assessment questions from the application
 */
async function runRealAssessmentE2ETest() {
  console.log("🧪 Starting a real end-to-end test of the 100 Marriage Assessment");
  console.log(`📋 Testing with ${realQuestions.length} actual assessment questions`);
  
  // Sample demographic data
  const demographicData = {
    firstName: "Lawrence",
    lastName: "Adjah",
    email: "lawrence@lawrenceadjah.com", // Updated email per your request
    phone: "555-123-4567",
    gender: "male",
    marriageStatus: "Single",
    desireChildren: "Yes",
    ethnicity: "Black/African American",
    city: "New York",
    state: "NY",
    zipCode: "10001",
    lifeStage: "Established Adult",
    birthday: "1985-01-15",
    hasPurchasedBook: "Yes",
    purchaseDate: "2025-01-01",
    hasPaid: true
  };

  // Sample psychographic profile
  const profile = {
    id: 6,
    name: "Balanced Visionary",
    description: "You have a strong foundation of faith-centered expectations paired with practical wisdom. You value clear communication, mutual respect, and shared spiritual growth. Your balanced approach to relationships positions you well for a fulfilling marriage built on aligned expectations and shared values.",
    genderSpecific: null,
    iconPath: "/attached_assets/BV 6.png",
    criteria: [
      { section: "Your Faith Life", min: 75 },
      { section: "Your Marriage Life", min: 70 },
      { section: "Your Marriage and Boundaries", min: 65 }
    ]
  };

  // Gender-specific profile
  const genderProfile = {
    id: 4,
    name: "Principled Provider",
    description: "As a Principled Provider, you bring stability and structure to relationships. You value being a reliable partner and are dedicated to establishing a secure foundation for your family. Your traditional approach to leadership and protection makes you an anchoring presence in your marriage.",
    genderSpecific: "male",
    iconPath: "/attached_assets/PP 4.png",
    criteria: [
      { section: "Your Foundation", min: 80 },
      { section: "Your Finances", min: 75 },
      { section: "Your Marriage Life", min: 70 }
    ]
  };

  // Generate realistic responses to the actual questions
  console.log("\n📝 Generating realistic responses to actual assessment questions...");
  const responses: Record<string, { option: string, value: number }> = {};
  
  // Process each real question from the assessment
  realQuestions.forEach(question => {
    const questionId = question.id.toString();
    
    if (question.type === 'M') { // Multiple choice question
      // For most questions, select the first option (usually most traditional/highest points)
      // But randomly select other options sometimes for variety
      const randomFactor = Math.random();
      let selectedIndex = 0; // Default to first option
      
      if (randomFactor > 0.7 && question.options.length > 1) {
        selectedIndex = 1; // Sometimes select second option
      } else if (randomFactor > 0.9 && question.options.length > 2) {
        selectedIndex = 2; // Occasionally select third option if available
      }
      
      const selectedOption = question.options[selectedIndex];
      
      responses[questionId] = {
        option: selectedOption.value,
        value: selectedOption.points
      };
      
    } else if (question.type === 'D') { // Agree/Disagree question
      // For agree/disagree, mostly agree (80% of the time)
      const agreeChance = 0.8;
      const selectedIndex = Math.random() < agreeChance ? 0 : 1;
      const selectedOption = question.options[selectedIndex];
      
      responses[questionId] = {
        option: selectedOption.value,
        value: selectedOption.points
      };
    }
  });

  // Calculate section scores based on responses
  console.log("🧮 Calculating section scores based on responses...");
  const sectionScores: Record<string, { earned: number, possible: number, percentage: number }> = {};
  
  // Define the sections (based on question prefixes)
  const sections = [
    "Your Foundation",
    "Your Faith Life",
    "Your Marriage Life",
    "Your Parenting Life",
    "Your Family/Home Life", 
    "Your Finances",
    "Your Health and Wellness",
    "Your Marriage and Boundaries"
  ];
  
  // Initialize sections with zero values
  sections.forEach(section => {
    sectionScores[section] = { earned: 0, possible: 0, percentage: 0 };
  });
  
  // Calculate scores for each section based on the question text prefix
  realQuestions.forEach(question => {
    const questionId = question.id.toString();
    if (responses[questionId]) {
      // Determine which section this question belongs to by looking at its text prefix
      const questionText = question.text;
      let section = sections[0]; // Default to first section
      
      // Find which section prefix the question starts with
      for (const sectionName of sections) {
        if (questionText.startsWith(sectionName)) {
          section = sectionName;
          break;
        }
      }
      
      // Calculate points
      const earnedPoints = responses[questionId].value;
      const possiblePoints = question.points;
      
      // Add to section scores
      sectionScores[section].earned += earnedPoints;
      sectionScores[section].possible += possiblePoints;
    }
  });
  
  // Calculate percentages for each section
  Object.keys(sectionScores).forEach(section => {
    if (sectionScores[section].possible > 0) {
      sectionScores[section].percentage = Math.round((sectionScores[section].earned / sectionScores[section].possible) * 100);
    }
  });
  
  // Calculate total scores
  const totalEarned = Object.values(sectionScores).reduce((sum, section) => sum + section.earned, 0);
  const totalPossible = Object.values(sectionScores).reduce((sum, section) => sum + section.possible, 0);
  const overallPercentage = Math.round((totalEarned / totalPossible) * 100);
  
  // Determine strengths and improvement areas
  const sortedSections = Object.entries(sectionScores)
    .filter(([section, score]) => score.possible > 0) // Only include sections with questions
    .sort((a, b) => b[1].percentage - a[1].percentage);
  
  // Get top 3 strengths (highest percentages)
  const strengths = sortedSections
    .slice(0, 3)
    .map(([section]) => section);
  
  // Get bottom 2 areas for improvement (lowest percentages)
  const improvementAreas = sortedSections
    .slice(-2)
    .map(([section]) => section);
  
  // Create the final assessment result
  const testAssessment: AssessmentResult = {
    email: demographicData.email,
    name: `${demographicData.firstName} ${demographicData.lastName}`,
    scores: {
      sections: sectionScores,
      overallPercentage,
      strengths,
      improvementAreas,
      totalEarned,
      totalPossible
    },
    profile,
    genderProfile,
    responses: responses as any,
    demographics: demographicData,
    timestamp: new Date().toISOString()
  };

  // Log assessment summary
  console.log("\n📋 Assessment Summary:");
  console.log(`Name: ${testAssessment.name}`);
  console.log(`Email: ${testAssessment.email}`);
  console.log(`Overall Score: ${overallPercentage.toFixed(1)}%`);
  console.log(`Profile: ${profile.name}`);
  console.log(`Gender Profile: ${genderProfile.name}`);
  console.log("\nSection Scores:");
  Object.entries(sectionScores).forEach(([section, score]) => {
    if (score.possible > 0) {
      console.log(`- ${section}: ${score.earned}/${score.possible} (${score.percentage}%)`);
    }
  });
  console.log("\nStrengths:", strengths.join(", "));
  console.log("Improvement Areas:", improvementAreas.join(", "));
  
  // Send the assessment email
  console.log("\n📧 Sending real assessment email with SendGrid...");
  const sendResult = await sendAssessmentEmail(testAssessment);
  
  if (sendResult) {
    console.log("✅ Email sent successfully!");
    console.log("Check your inbox for the real assessment report");
  } else {
    console.error("❌ Failed to send email");
    console.error("Check the logs above for error details");
  }
}

// Run the test
runRealAssessmentE2ETest().catch(error => {
  console.error("❌ Test failed with error:", error);
});