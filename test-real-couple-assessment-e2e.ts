import { AssessmentResult, CoupleAssessmentReport, DifferenceAnalysis } from './shared/schema';
import { sendCoupleAssessmentEmail } from './server/sendgrid';
import { Question } from './temp/questions'; // Import the actual question structure
import { questions as realQuestions } from './temp/questions'; // Import the real questions

/**
 * This script provides an end-to-end test of the 100 Marriage Assessment couple system
 * using the actual assessment questions from the application
 */
async function runRealCoupleAssessmentE2ETest() {
  console.log("🧪 Starting a real end-to-end test of the 100 Marriage Couple Assessment");
  console.log(`📋 Testing with ${realQuestions.length} actual assessment questions`);
  
  // Create unique coupleId
  const coupleId = "real-e2e-test-" + Date.now();
  
  // Primary partner (husband) demographic data
  const primaryDemographicData = {
    firstName: "Michael",
    lastName: "Johnson",
    email: "lawrence@lawrenceadjah.com", // Updated email per your request
    phone: "555-123-4567",
    gender: "male",
    marriageStatus: "Dating",
    desireChildren: "Yes",
    ethnicity: "Black/African American",
    city: "Atlanta",
    state: "GA",
    zipCode: "30305",
    lifeStage: "Dating Seriously",
    birthday: "1988-06-12",
    hasPurchasedBook: "Yes",
    promoCode: "",
    hasPaid: true
  };

  // Spouse (wife) demographic data
  const spouseDemographicData = {
    firstName: "Sarah",
    lastName: "Williams",
    email: "lawrence@lawrenceadjah.com", // Updated email per your request
    phone: "555-987-6543",
    gender: "female",
    marriageStatus: "Dating",
    desireChildren: "Yes",
    ethnicity: "White/Caucasian",
    city: "Atlanta",
    state: "GA",
    zipCode: "30305",
    lifeStage: "Dating Seriously",
    birthday: "1990-03-21",
    hasPurchasedBook: "No",
    promoCode: "",
    hasPaid: true
  };

  // Generate husband responses (more traditional)
  console.log("\n📝 Generating husband (primary) responses to actual assessment questions...");
  const husbandResponses = generateResponses(realQuestions, 'traditional');
  
  // Generate wife responses (more moderate)
  console.log("📝 Generating wife (spouse) responses to actual assessment questions...");
  const wifeResponses = generateResponses(realQuestions, 'moderate');
  
  // Calculate scores and profiles
  console.log("\n🧮 Calculating assessment scores and profiles...");
  
  // Process husband assessment
  const husbandResults = processResponses(realQuestions, husbandResponses, "male");
  const husbandAssessment: AssessmentResult = {
    email: primaryDemographicData.email,
    name: `${primaryDemographicData.firstName} ${primaryDemographicData.lastName}`,
    scores: husbandResults.scores,
    profile: husbandResults.profile,
    genderProfile: husbandResults.genderProfile,
    responses: husbandResponses as any,
    demographics: primaryDemographicData,
    timestamp: new Date().toISOString(),
    coupleId: coupleId,
    coupleRole: "primary"
  };
  
  // Process wife assessment
  const wifeResults = processResponses(realQuestions, wifeResponses, "female");
  const wifeAssessment: AssessmentResult = {
    email: spouseDemographicData.email,
    name: `${spouseDemographicData.firstName} ${spouseDemographicData.lastName}`,
    scores: wifeResults.scores,
    profile: wifeResults.profile,
    genderProfile: wifeResults.genderProfile,
    responses: wifeResponses as any,
    demographics: spouseDemographicData,
    timestamp: new Date().toISOString(),
    coupleId: coupleId,
    coupleRole: "spouse"
  };
  
  // Generate a difference analysis
  console.log("\n🔄 Analyzing differences between partner responses...");
  const differenceAnalysis = analyzeDifferences(realQuestions, husbandResponses, wifeResponses);
  
  // Calculate compatibility score
  const compatibilityScore = calculateCompatibility(
    husbandAssessment,
    wifeAssessment,
    differenceAnalysis
  );
  
  // Create couple assessment report
  const coupleReport: CoupleAssessmentReport = {
    coupleId: coupleId,
    primaryAssessment: husbandAssessment,
    spouseAssessment: wifeAssessment,
    differenceAnalysis: differenceAnalysis,
    compatibilityScore: compatibilityScore,
    timestamp: new Date().toISOString()
  };

  // Log a summary of the couple assessment
  console.log("\n📋 Couple Assessment Summary:");
  console.log(`Couple ID: ${coupleId}`);
  console.log(`Primary Partner: ${husbandAssessment.name} (${Math.round(husbandAssessment.scores.overallPercentage)}%)`);
  console.log(`Spouse: ${wifeAssessment.name} (${Math.round(wifeAssessment.scores.overallPercentage)}%)`);
  console.log(`Compatibility Score: ${compatibilityScore}%`);
  console.log(`Major Differences: ${differenceAnalysis.majorDifferences.length}`);
  console.log(`Strength Areas: ${differenceAnalysis.strengthAreas.join(", ")}`);
  console.log(`Vulnerability Areas: ${differenceAnalysis.vulnerabilityAreas.join(", ")}`);
  
  // Send the couple assessment email
  console.log("\n📧 Sending real couple assessment email with SendGrid...");
  const sendResult = await sendCoupleAssessmentEmail(coupleReport);
  
  if (sendResult) {
    console.log("✅ Couple assessment email sent successfully!");
    console.log("Check your inbox for the real couple assessment report");
  } else {
    console.error("❌ Failed to send couple assessment email");
    console.error("Check the logs above for error details");
  }
}

/**
 * Generate responses to the provided questions based on a response style
 */
function generateResponses(questions: Question[], style: 'traditional' | 'moderate' | 'progressive'): Record<string, { option: string, value: number }> {
  const responses: Record<string, { option: string, value: number }> = {};
  
  questions.forEach(question => {
    const questionId = question.id.toString();
    
    if (question.type === 'M') { // Multiple choice questions
      let selectedIndex = 0; // Default to first option (usually most traditional)
      
      if (style === 'moderate') {
        // More balanced responses for "moderate" style
        const randomFactor = Math.random();
        if (randomFactor > 0.6 && question.options.length > 1) {
          selectedIndex = 1;
        } else if (randomFactor > 0.85 && question.options.length > 2) {
          selectedIndex = 2;
        }
      } else if (style === 'progressive') {
        // More progressive/non-traditional responses
        const randomFactor = Math.random();
        if (question.options.length > 1) {
          selectedIndex = randomFactor > 0.3 ? 1 : 0;
          if (randomFactor > 0.7 && question.options.length > 2) {
            selectedIndex = 2;
          }
        }
      }
      
      // Make sure we don't select an index that doesn't exist
      selectedIndex = Math.min(selectedIndex, question.options.length - 1);
      
      const selectedOption = question.options[selectedIndex];
      responses[questionId] = {
        option: selectedOption.value,
        value: selectedOption.points
      };
      
    } else if (question.type === 'D') { // Agree/Disagree questions
      let agreeChance = 0.9; // 90% chance to agree for traditional
      
      if (style === 'moderate') {
        agreeChance = 0.7; // 70% chance to agree for moderate
      } else if (style === 'progressive') {
        agreeChance = 0.5; // 50% chance to agree for progressive
      }
      
      const selectedIndex = Math.random() < agreeChance ? 0 : 1;
      const selectedOption = question.options[selectedIndex];
      
      responses[questionId] = {
        option: selectedOption.value,
        value: selectedOption.points
      };
    }
  });
  
  return responses;
}

/**
 * Process responses into assessment scores and profiles
 */
function processResponses(questions: Question[], responses: Record<string, { option: string, value: number }>, gender: 'male' | 'female') {
  // Define sections based on question text prefixes
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
  
  // Calculate section scores
  const sectionScores: Record<string, { earned: number, possible: number, percentage: number }> = {};
  
  // Initialize sections with zero values
  sections.forEach(section => {
    sectionScores[section] = { earned: 0, possible: 0, percentage: 0 };
  });
  
  // Calculate scores for each section based on the question text prefix
  questions.forEach(question => {
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
  
  // Determine psychographic profile based on scores
  // For this test, we'll select simple profiles
  // In a real system, these would be determined by more complex matching algorithms
  const profile = gender === 'male'
    ? {
        id: 2,
        name: "Balanced Visionary",
        description: "You have a thoughtful, balanced approach to marriage. You value both tradition and modern perspectives, seeking harmony between stability and flexibility. Your responses show a well-rounded understanding of marriage dynamics with a natural ability to adapt while maintaining core values.",
        genderSpecific: null,
        iconPath: "/attached_assets/BV 6.png",
        criteria: [
          { section: "Your Faith Life", min: 75 },
          { section: "Your Marriage Life", min: 70 }
        ]
      }
    : {
        id: 3,
        name: "Faithful Companion",
        description: "You have a dedicated, supportive approach to relationships. You value loyalty, empathy, and mutual growth. Your perspective balances personal fulfillment with relationship harmony, creating space for both independence and deep connection.",
        genderSpecific: null,
        iconPath: "/attached_assets/FF 3.png",
        criteria: [
          { section: "Your Faith Life", min: 75 },
          { section: "Your Family/Home Life", min: 70 }
        ]
      };
      
  // Gender-specific profile
  const genderProfile = gender === 'male'
    ? {
        id: 4,
        name: "Principled Provider",
        description: "As a Principled Provider, you bring stability and structure to relationships. You value being a reliable partner and are dedicated to establishing a secure foundation for your family. Your traditional approach to leadership and protection makes you an anchoring presence in your marriage.",
        genderSpecific: "male",
        iconPath: "/attached_assets/PP 4.png",
        criteria: [
          { section: "Your Foundation", min: 80 },
          { section: "Your Finances", min: 75 }
        ]
      }
    : {
        id: 9,
        name: "Intuitive Teammate",
        description: "As an Intuitive Teammate, you excel at understanding your partner's needs and supporting them in meaningful ways. You have a natural ability to create harmony and connection. Your empathetic nature allows you to anticipate challenges and navigate them with grace.",
        genderSpecific: "female",
        iconPath: "/attached_assets/IT 9.png",
        criteria: [
          { section: "Your Marriage Life", min: 75 },
          { section: "Your Health and Wellness", min: 70 }
        ]
      };
  
  return {
    scores: {
      sections: sectionScores,
      overallPercentage,
      strengths,
      improvementAreas,
      totalEarned,
      totalPossible
    },
    profile,
    genderProfile
  };
}

/**
 * Analyze differences between two sets of responses
 */
function analyzeDifferences(questions: Question[], primaryResponses: Record<string, { option: string, value: number }>, spouseResponses: Record<string, { option: string, value: number }>): DifferenceAnalysis {
  const differentResponses: any[] = [];
  const majorDifferences: any[] = [];
  const sectionDifferenceCounts: Record<string, number> = {};
  const sectionTotalCounts: Record<string, number> = {};
  
  // Define sections
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
  
  // Count differences by section
  questions.forEach(question => {
    const questionId = question.id.toString();
    const primaryResponse = primaryResponses[questionId];
    const spouseResponse = spouseResponses[questionId];
    
    // Skip if either person didn't answer
    if (!primaryResponse || !spouseResponse) {
      return;
    }
    
    // Determine which section this question belongs to
    const questionText = question.text;
    let section = sections[0]; // Default to first section
    
    // Find which section prefix the question starts with
    for (const sectionName of sections) {
      if (questionText.startsWith(sectionName)) {
        section = sectionName;
        break;
      }
    }
    
    // Increment total count for this section
    sectionTotalCounts[section] = (sectionTotalCounts[section] || 0) + 1;
    
    // Check if responses differ
    if (primaryResponse.option !== spouseResponse.option) {
      // Add to general differences
      differentResponses.push({
        questionId,
        questionText: question.text,
        questionWeight: question.points,
        section,
        primaryResponse: primaryResponse.option,
        spouseResponse: spouseResponse.option
      });
      
      // Update section difference count
      sectionDifferenceCounts[section] = (sectionDifferenceCounts[section] || 0) + 1;
      
      // Determine if this is a major difference
      // Major differences are questions with high weight (>=8)
      if (question.points >= 8) {
        majorDifferences.push({
          questionId,
          questionText: question.text,
          questionWeight: question.points,
          section,
          primaryResponse: primaryResponse.option,
          spouseResponse: spouseResponse.option
        });
      }
    }
  });
  
  // Identify strength and vulnerability areas based on section differences
  const strengthAreas: string[] = [];
  const vulnerabilityAreas: string[] = [];
  
  // Calculate difference percentages for each section
  const sectionDifferencePercentages: Record<string, number> = {};
  
  Object.keys(sectionTotalCounts).forEach(section => {
    const totalQuestions = sectionTotalCounts[section];
    const differences = sectionDifferenceCounts[section] || 0;
    const differencePercentage = (differences / totalQuestions) * 100;
    sectionDifferencePercentages[section] = differencePercentage;
  });
  
  // Sort sections by difference percentage (ascending)
  const sortedSections = Object.entries(sectionDifferencePercentages)
    .sort(([, a], [, b]) => a - b);
  
  // Take top 2 sections with lowest difference percentage as strengths
  sortedSections.slice(0, 2).forEach(([section]) => {
    strengthAreas.push(section);
  });
  
  // Take bottom 2 sections with highest difference percentage as vulnerabilities
  sortedSections.slice(-2).forEach(([section]) => {
    vulnerabilityAreas.push(section);
  });
  
  return {
    differentResponses,
    majorDifferences,
    strengthAreas,
    vulnerabilityAreas
  };
}

/**
 * Calculate compatibility score between two assessments
 */
function calculateCompatibility(primaryAssessment: AssessmentResult, spouseAssessment: AssessmentResult, differenceAnalysis: DifferenceAnalysis): number {
  // Start with 100% compatibility
  let compatibility = 100;
  
  // Factor 1: Score difference (max 20% impact)
  const scoreDifference = Math.abs(primaryAssessment.scores.overallPercentage - spouseAssessment.scores.overallPercentage);
  compatibility -= (scoreDifference / 2); // Each percentage point of difference reduces by 0.5%
  
  // Factor 2: Proportion of different responses (max 40% impact)
  const differentResponsesCount = differenceAnalysis.differentResponses.length;
  const totalResponsesCount = Object.keys(primaryAssessment.responses).length;
  const differentResponsePercentage = (differentResponsesCount / totalResponsesCount) * 100;
  compatibility -= (differentResponsePercentage * 0.4);
  
  // Factor 3: Major differences (max 20% impact)
  compatibility -= (differenceAnalysis.majorDifferences.length * 2); // Each major difference reduces by 2%
  
  // Ensure compatibility is between 0-100
  return Math.max(0, Math.min(100, Math.round(compatibility)));
}

// Run the test
runRealCoupleAssessmentE2ETest().catch(error => {
  console.error("❌ Test failed with error:", error);
});