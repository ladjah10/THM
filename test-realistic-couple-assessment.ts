import { sendCoupleAssessmentEmail } from './server/nodemailer';
import { AssessmentResult, CoupleAssessmentReport, DifferenceAnalysis, UserProfile } from './shared/schema';
import { questions, sections } from './client/src/data/questionsData';
import { psychographicProfiles } from './client/src/data/psychographicProfiles';

// Helper function to calculate section scores
function calculateSectionScores(responses: Record<string, { option: string, value: number }>) {
  // Initialize section scores
  const sectionScores: Record<string, { earned: number, possible: number, percentage: number }> = {};
  
  // Initialize sections with zero values
  sections.forEach(section => {
    sectionScores[section] = { earned: 0, possible: 0, percentage: 0 };
  });
  
  // Calculate scores for each section
  questions.forEach(question => {
    const questionId = question.id.toString();
    if (responses[questionId]) {
      const section = question.section;
      const weight = question.weight;
      const response = responses[questionId];
      
      // For multiple choice questions, we compute based on the index
      // First option (index 0) gets full weight, second option gets 75%, third gets 50%, etc.
      let earnedPoints = 0;
      if (question.type === 'M') {
        const optionIndex = question.options.findIndex(opt => opt === response.option);
        // Calculate points based on option position (first option gets full points)
        earnedPoints = weight * Math.max(0, 1 - (optionIndex * 0.25));
      } else if (question.type === 'D') {
        // For agree/disagree, first option (agree) gets full weight, second gets none
        earnedPoints = response.option === question.options[0] ? weight : 0;
      }
      
      // Add to section scores
      sectionScores[section].earned += earnedPoints;
      sectionScores[section].possible += weight;
    }
  });
  
  // Calculate percentages
  Object.keys(sectionScores).forEach(section => {
    if (sectionScores[section].possible > 0) {
      sectionScores[section].percentage = (sectionScores[section].earned / sectionScores[section].possible) * 100;
    }
  });
  
  return sectionScores;
}

// Helper function to determine strengths and improvement areas
function determineStrengthsAndImprovements(sectionScores: Record<string, { earned: number, possible: number, percentage: number }>) {
  // Sort sections by percentage (highest to lowest)
  const sortedSections = Object.entries(sectionScores)
    .filter(([section, score]) => score.possible > 0) // Only include sections with questions
    .sort((a, b) => b[1].percentage - a[1].percentage);
  
  // Get top 3 strengths (highest percentages)
  const strengths = sortedSections
    .slice(0, 3)
    .map(([section, score]) => {
      if (section === "Your Foundation") return "Strong foundational values and expectations";
      if (section === "Your Faith Life") return "Faith-centered approach to relationship";
      if (section === "Your Marriage Life") return "Clear communication and conflict resolution skills";
      if (section === "Your Parenting Life") return "Aligned parenting perspectives";
      if (section === "Your Family/Home Life") return "Harmonious approach to home and family dynamics";
      if (section === "Your Finances") return "Shared financial values and planning";
      if (section === "Your Health and Wellness") return "Commitment to mutual health and wellbeing";
      if (section === "Your Marriage and Boundaries") return "Healthy relational boundaries";
      return `Strong ${section.toLowerCase()} alignment`;
    });
  
  // Get bottom 3 areas for improvement (lowest percentages)
  const improvementAreas = sortedSections
    .slice(-3)
    .reverse()
    .map(([section, score]) => {
      if (section === "Your Foundation") return "Foundational values and expectations";
      if (section === "Your Faith Life") return "Faith alignment in relationship";
      if (section === "Your Marriage Life") return "Communication and conflict resolution";
      if (section === "Your Parenting Life") return "Parenting approach and expectations";
      if (section === "Your Family/Home Life") return "Home and family dynamics";
      if (section === "Your Finances") return "Financial planning and money management";
      if (section === "Your Health and Wellness") return "Health and wellness priorities";
      if (section === "Your Marriage and Boundaries") return "Relationship boundaries";
      return `${section.toLowerCase()} alignment`;
    });
  
  return { strengths, improvementAreas };
}

// Helper function to determine the appropriate psychographic profile
function determineProfile(sectionScores: Record<string, { earned: number, possible: number, percentage: number }>, gender: string): {
  profile: UserProfile,
  genderProfile: UserProfile | null
} {
  // Find general profile (non-gender specific)
  let bestGeneralMatch: UserProfile | null = null;
  let bestGeneralMatchScore = -1;
  
  // Find gender-specific profile
  let bestGenderMatch: UserProfile | null = null;
  let bestGenderMatchScore = -1;
  
  // Check each profile against the section scores
  psychographicProfiles.forEach(profile => {
    // Skip profiles that don't match this person's gender
    if (profile.genderSpecific && profile.genderSpecific !== gender) {
      return;
    }
    
    // Calculate the match score for this profile
    let matchScore = 0;
    let criteriaCount = 0;
    
    profile.criteria.forEach(criterion => {
      const sectionScore = sectionScores[criterion.section]?.percentage || 0;
      
      // Check if the score meets the criterion
      let meets = true;
      if (criterion.min !== undefined && sectionScore < criterion.min) {
        meets = false;
      }
      if (criterion.max !== undefined && sectionScore > criterion.max) {
        meets = false;
      }
      
      if (meets) {
        matchScore++;
      }
      criteriaCount++;
    });
    
    // Calculate percentage match
    const percentageMatch = (matchScore / criteriaCount) * 100;
    
    // Update best matches
    if (!profile.genderSpecific && percentageMatch > bestGeneralMatchScore) {
      bestGeneralMatch = profile;
      bestGeneralMatchScore = percentageMatch;
    } else if (profile.genderSpecific === gender && percentageMatch > bestGenderMatchScore) {
      bestGenderMatch = profile;
      bestGenderMatchScore = percentageMatch;
    }
  });
  
  return {
    profile: bestGeneralMatch || psychographicProfiles[0], // Default to first profile if no match
    genderProfile: bestGenderMatch
  };
}

// Simulate responses to the assessment questions - Husband (more traditional)
function generateHusbandResponses() {
  const responses: Record<string, { option: string, value: number }> = {};
  
  // Process each question
  questions.forEach(question => {
    const questionId = question.id.toString();
    
    // Simulating more traditional/faith-centered responses
    if (question.type === 'M') {
      // For multiple choice, prefer first option (usually most traditional)
      const selectedIndex = Math.min(1, Math.floor(Math.random() * 2)); // 70% first option, 30% second
      const option = question.options[selectedIndex];
      responses[questionId] = { 
        option, 
        value: question.options.length - selectedIndex // Higher value for earlier options
      };
    } else if (question.type === 'D') {
      // For agree/disagree, generally prefer "Agree" (first option)
      const agreeChance = 0.8; // 80% chance to agree with traditional statements
      const selectedIndex = Math.random() < agreeChance ? 0 : 1;
      const option = question.options[selectedIndex];
      responses[questionId] = { 
        option, 
        value: selectedIndex === 0 ? 1 : 0 // 1 for agree, 0 for disagree
      };
    }
  });
  
  return responses;
}

// Simulate responses to the assessment questions - Wife (more balanced)
function generateWifeResponses() {
  const responses: Record<string, { option: string, value: number }> = {};
  
  // Process each question
  questions.forEach(question => {
    const questionId = question.id.toString();
    
    // Simulating more balanced responses with some differences from husband
    if (question.type === 'M') {
      // More variety in selections
      const selectedIndex = Math.min(Math.floor(Math.random() * 2.2), question.options.length - 1);
      const option = question.options[selectedIndex];
      responses[questionId] = { 
        option, 
        value: question.options.length - selectedIndex
      };
    } else if (question.type === 'D') {
      // For agree/disagree, more balance between agree/disagree
      const agreeChance = 0.65; // 65% chance to agree with traditional statements
      const selectedIndex = Math.random() < agreeChance ? 0 : 1;
      const option = question.options[selectedIndex];
      responses[questionId] = { 
        option, 
        value: selectedIndex === 0 ? 1 : 0
      };
    }
  });
  
  return responses;
}

// Generate differences analysis between two assessments
function generateDifferenceAnalysis(primaryResponses: Record<string, { option: string, value: number }>, 
                                   spouseResponses: Record<string, { option: string, value: number }>): DifferenceAnalysis {
  const differentResponses: any[] = [];
  const majorDifferences: any[] = [];
  
  // Check each question for differences
  questions.forEach(question => {
    const questionId = question.id.toString();
    const primaryResponse = primaryResponses[questionId];
    const spouseResponse = spouseResponses[questionId];
    
    // Skip if either person didn't answer
    if (!primaryResponse || !spouseResponse) {
      return;
    }
    
    // Check if responses differ
    if (primaryResponse.option !== spouseResponse.option) {
      const difference = {
        questionId,
        questionText: question.text,
        questionWeight: question.weight,
        section: question.section,
        primaryResponse: primaryResponse.option,
        spouseResponse: spouseResponse.option
      };
      
      differentResponses.push(difference);
      
      // If high weight question, consider it a major difference
      if (question.weight >= 5) {
        majorDifferences.push(difference);
      }
    }
  });
  
  // Determine strength and vulnerability areas
  // Group the differences by section
  const differencesBySection: Record<string, number> = {};
  differentResponses.forEach(diff => {
    differencesBySection[diff.section] = (differencesBySection[diff.section] || 0) + 1;
  });
  
  // Get the sections with fewest differences (strengths)
  const sortedForStrengths = Object.entries(differencesBySection)
    .sort(([, a], [, b]) => a - b); // Sort by number of differences (ascending)
  
  // Get the sections with most differences (vulnerabilities)
  const sortedForVulnerabilities = Object.entries(differencesBySection)
    .sort(([, a], [, b]) => b - a); // Sort by number of differences (descending)
  
  // Take top 3 strengths and vulnerabilities
  const strengthAreas = sortedForStrengths
    .slice(0, 3)
    .map(([section]) => section);
  
  const vulnerabilityAreas = sortedForVulnerabilities
    .slice(0, 2)
    .map(([section]) => section);
  
  return {
    differentResponses,
    majorDifferences,
    strengthAreas,
    vulnerabilityAreas
  };
}

// Calculate overall compatibility percentage
function calculateCompatibility(primaryAssessment: AssessmentResult, spouseAssessment: AssessmentResult, differenceAnalysis: DifferenceAnalysis): number {
  // Base compatibility on:
  // 1. Similarity in overall scores
  // 2. Number of different responses
  // 3. Weight of major differences
  
  // Start with 100% and subtract based on differences
  let compatibility = 100;
  
  // Factor 1: Score difference (max 20% impact)
  const scoreDifference = Math.abs(primaryAssessment.scores.overallPercentage - spouseAssessment.scores.overallPercentage);
  compatibility -= (scoreDifference / 2); // Each percentage point of difference reduces by 0.5%
  
  // Factor 2: Proportion of different responses (max 40% impact)
  const totalQuestions = questions.length;
  const differentQuestionsPercentage = (differenceAnalysis.differentResponses.length / totalQuestions) * 100;
  compatibility -= (differentQuestionsPercentage * 0.4); // Each percentage point of different questions reduces by 0.4%
  
  // Factor 3: Major differences (max 20% impact)
  compatibility -= (differenceAnalysis.majorDifferences.length * 2); // Each major difference reduces by 2%
  
  // Ensure compatibility is between 0-100
  compatibility = Math.max(0, Math.min(100, compatibility));
  
  return Math.round(compatibility);
}

// Create a full couple assessment with realistic data
async function generateRealisticCoupleAssessment() {
  console.log("Generating realistic couple assessment data...");
  
  // Create unique coupleId
  const coupleId = "realistic-test-" + Date.now();
  
  // Generate response data
  const husbandResponses = generateHusbandResponses();
  const wifeResponses = generateWifeResponses();
  
  // Calculate scores
  const husbandSectionScores = calculateSectionScores(husbandResponses);
  const wifeSectionScores = calculateSectionScores(wifeResponses);
  
  // Calculate totals
  const husbandTotalEarned = Object.values(husbandSectionScores).reduce((sum, section) => sum + section.earned, 0);
  const husbandTotalPossible = Object.values(husbandSectionScores).reduce((sum, section) => sum + section.possible, 0);
  const husbandOverallPercentage = (husbandTotalEarned / husbandTotalPossible) * 100;
  
  const wifeTotalEarned = Object.values(wifeSectionScores).reduce((sum, section) => sum + section.earned, 0);
  const wifeTotalPossible = Object.values(wifeSectionScores).reduce((sum, section) => sum + section.possible, 0);
  const wifeOverallPercentage = (wifeTotalEarned / wifeTotalPossible) * 100;
  
  // Determine strengths and improvement areas
  const husbandResults = determineStrengthsAndImprovements(husbandSectionScores);
  const wifeResults = determineStrengthsAndImprovements(wifeSectionScores);
  
  // Determine profiles
  const husbandProfiles = determineProfile(husbandSectionScores, "male");
  const wifeProfiles = determineProfile(wifeSectionScores, "female");
  
  // Create husband assessment
  const primaryAssessment: AssessmentResult = {
    email: "la@lawrenceadjah.com",
    name: "Michael Johnson",
    scores: {
      sections: husbandSectionScores,
      overallPercentage: husbandOverallPercentage,
      strengths: husbandResults.strengths,
      improvementAreas: husbandResults.improvementAreas,
      totalEarned: husbandTotalEarned,
      totalPossible: husbandTotalPossible
    },
    profile: husbandProfiles.profile,
    genderProfile: husbandProfiles.genderProfile,
    responses: husbandResponses,
    demographics: {
      firstName: "Michael",
      lastName: "Johnson",
      email: "la@lawrenceadjah.com",
      phone: "555-123-4567",
      gender: "male",
      marriageStatus: "Dating",
      desireChildren: "Yes",
      ethnicity: "Black,White",
      city: "Atlanta",
      state: "GA",
      zipCode: "30305",
      lifeStage: "Dating Seriously",
      birthday: "1988-06-12",
      hasPurchasedBook: "Yes",
      promoCode: "",
      hasPaid: true
    },
    timestamp: new Date().toISOString(),
    coupleId: coupleId,
    coupleRole: "primary"
  };
  
  // Create wife assessment
  const spouseAssessment: AssessmentResult = {
    email: "la@lawrenceadjah.com",
    name: "Sarah Williams",
    scores: {
      sections: wifeSectionScores,
      overallPercentage: wifeOverallPercentage,
      strengths: wifeResults.strengths,
      improvementAreas: wifeResults.improvementAreas,
      totalEarned: wifeTotalEarned,
      totalPossible: wifeTotalPossible
    },
    profile: wifeProfiles.profile,
    genderProfile: wifeProfiles.genderProfile,
    responses: wifeResponses,
    demographics: {
      firstName: "Sarah",
      lastName: "Williams",
      email: "la@lawrenceadjah.com",
      phone: "555-987-6543",
      gender: "female",
      marriageStatus: "Dating",
      desireChildren: "Yes",
      ethnicity: "White,Asian",
      city: "Atlanta",
      state: "GA",
      zipCode: "30305",
      lifeStage: "Dating Seriously",
      birthday: "1990-09-04",
      hasPurchasedBook: "No",
      promoCode: "",
      hasPaid: true
    },
    timestamp: new Date().toISOString(),
    coupleId: coupleId,
    coupleRole: "spouse"
  };
  
  // Generate differences analysis
  const differenceAnalysis = generateDifferenceAnalysis(husbandResponses, wifeResponses);
  
  // Calculate compatibility
  const overallCompatibility = calculateCompatibility(primaryAssessment, spouseAssessment, differenceAnalysis);
  
  // Create the full couple report
  const coupleReport: CoupleAssessmentReport = {
    coupleId,
    timestamp: new Date().toISOString(),
    primaryAssessment,
    spouseAssessment,
    differenceAnalysis,
    overallCompatibility
  };
  
  // Log report summary
  console.log("\n===== Couple Assessment Report Summary =====");
  console.log(`Couple ID: ${coupleReport.coupleId}`);
  console.log(`Timestamp: ${coupleReport.timestamp}`);
  console.log(`\nPrimary: ${primaryAssessment.name} (${primaryAssessment.demographics.gender})`);
  console.log(`Overall Score: ${primaryAssessment.scores.overallPercentage.toFixed(1)}%`);
  console.log(`General Profile: ${primaryAssessment.profile.name}`);
  console.log(`Gender Profile: ${primaryAssessment.genderProfile?.name || "None"}`);
  
  console.log(`\nSpouse: ${spouseAssessment.name} (${spouseAssessment.demographics.gender})`);
  console.log(`Overall Score: ${spouseAssessment.scores.overallPercentage.toFixed(1)}%`);
  console.log(`General Profile: ${spouseAssessment.profile.name}`);
  console.log(`Gender Profile: ${spouseAssessment.genderProfile?.name || "None"}`);
  
  console.log(`\nCompatibility: ${coupleReport.overallCompatibility}%`);
  console.log(`Different Responses: ${differenceAnalysis.differentResponses.length} of ${questions.length} questions`);
  console.log(`Major Differences: ${differenceAnalysis.majorDifferences.length}`);
  
  console.log("\nStrength Areas:");
  differenceAnalysis.strengthAreas.forEach(area => console.log(`- ${area}`));
  
  console.log("\nVulnerability Areas:");
  differenceAnalysis.vulnerabilityAreas.forEach(area => console.log(`- ${area}`));
  
  // Send the couple assessment email
  try {
    console.log("\nSending couple assessment email with PDF report...");
    const result = await sendCoupleAssessmentEmail(coupleReport, "la@lawrenceadjah.com");
    
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
    console.error("Error sending email:", error);
  }
  
  return coupleReport;
}

// Run the test
generateRealisticCoupleAssessment();