import fs from 'fs';
import { sendCoupleAssessmentEmail } from './server/nodemailer';
import { AssessmentResult, CoupleAssessmentReport, DifferenceAnalysis, UserProfile } from './shared/schema';
import { questions, sections } from './client/src/data/questionsData';
import { psychographicProfiles } from './client/src/data/psychographicProfiles';
import { generateCoupleAssessmentPDF } from './server/pdf-generator';

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
      sectionScores[section].earned += responses[questionId].value * question.points;
      sectionScores[section].possible += 4 * question.points; // 4 is max value
    }
  });
  
  // Calculate percentages
  let totalEarned = 0;
  let totalPossible = 0;
  
  for (const section in sectionScores) {
    sectionScores[section].percentage = (sectionScores[section].earned / sectionScores[section].possible) * 100;
    totalEarned += sectionScores[section].earned;
    totalPossible += sectionScores[section].possible;
  }
  
  return {
    sections: sectionScores,
    overallPercentage: (totalEarned / totalPossible) * 100,
    strengths: determineStrengthsAndImprovements(sectionScores).strengths,
    improvementAreas: determineStrengthsAndImprovements(sectionScores).improvements,
    totalEarned,
    totalPossible
  };
}

function determineStrengthsAndImprovements(sectionScores: Record<string, { earned: number, possible: number, percentage: number }>) {
  // Sort sections by percentage
  const sortedSections = Object.entries(sectionScores)
    .sort((a, b) => b[1].percentage - a[1].percentage);
  
  // Get top 3 as strengths and bottom 3 as improvement areas
  const strengths = sortedSections.slice(0, 3).map(([section]) => section);
  const improvements = sortedSections.slice(-2).map(([section]) => section).reverse();
  
  return { strengths, improvements };
}

function determineProfile(sectionScores: Record<string, { earned: number, possible: number, percentage: number }>, gender: string): {
  profile: UserProfile,
  genderProfile: UserProfile | null
} {
  // Determine general profile (not gender specific)
  let selectedProfile: UserProfile | null = null;
  
  // Check each profile's criteria
  for (const profile of psychographicProfiles.filter(p => p.genderSpecific === null)) {
    let matches = true;
    
    for (const criterion of profile.criteria) {
      const sectionScore = sectionScores[criterion.section]?.percentage || 0;
      
      if ((criterion.min !== undefined && sectionScore < criterion.min) ||
          (criterion.max !== undefined && sectionScore > criterion.max)) {
        matches = false;
        break;
      }
    }
    
    if (matches) {
      selectedProfile = profile;
      break;
    }
  }
  
  // If no profile matched, use default (Balanced Visionaries)
  if (!selectedProfile) {
    selectedProfile = psychographicProfiles.find(p => p.name === "Balanced Visionaries") || psychographicProfiles[0];
  }
  
  // Determine gender-specific profile if available
  let selectedGenderProfile: UserProfile | null = null;
  
  // Find gender-specific profiles
  const genderProfiles = psychographicProfiles.filter(p => p.genderSpecific === gender);
  
  if (genderProfiles.length > 0) {
    // Check each gender profile's criteria
    for (const profile of genderProfiles) {
      let matches = true;
      
      for (const criterion of profile.criteria) {
        const sectionScore = sectionScores[criterion.section]?.percentage || 0;
        
        if ((criterion.min !== undefined && sectionScore < criterion.min) ||
            (criterion.max !== undefined && sectionScore > criterion.max)) {
          matches = false;
          break;
        }
      }
      
      if (matches) {
        selectedGenderProfile = profile;
        break;
      }
    }
    
    // If no gender profile matched, use default based on gender
    if (!selectedGenderProfile) {
      if (gender === 'male') {
        selectedGenderProfile = psychographicProfiles.find(p => p.name === "Faithful Protectors") || genderProfiles[0];
      } else {
        selectedGenderProfile = psychographicProfiles.find(p => p.name === "Relational Nurturers") || genderProfiles[0];
      }
    }
  }
  
  return {
    profile: selectedProfile,
    genderProfile: selectedGenderProfile
  };
}

// Generate realistic responses with more significant differences
function generateHusbandResponses() {
  const husbandResponses: Record<string, { option: string, value: number }> = {};
  
  // Logic to generate responses
  questions.forEach(question => {
    const id = question.id.toString();
    let value = 0;
    let option = '';
    
    // Higher scores for faith, foundation, and parenting questions
    if (question.section === 'Your Faith Life' || question.section === 'Your Foundation' || question.section === 'Your Parenting Life') {
      value = Math.random() > 0.3 ? 4 : 3; // Strongly agree or agree most of the time
      option = value === 4 ? 'Strongly Agree' : 'Agree';
    } 
    // Average scores for most other sections
    else if (question.section === 'Your Health and Wellness' || question.section === 'Your Family/Home Life') {
      const rand = Math.random();
      if (rand > 0.7) {
        value = 4;
        option = 'Strongly Agree';
      } else if (rand > 0.3) {
        value = 3;
        option = 'Agree';
      } else {
        value = 2;
        option = 'Neutral';
      }
    } 
    // Lower scores for finances and partnership to create differences
    else {
      const rand = Math.random();
      if (rand > 0.7) {
        value = 3;
        option = 'Agree';
      } else if (rand > 0.4) {
        value = 2;
        option = 'Neutral';
      } else {
        value = 1;
        option = 'Disagree';
      }
    }
    
    husbandResponses[id] = { option, value };
  });
  
  return husbandResponses;
}

function generateWifeResponses() {
  const wifeResponses: Record<string, { option: string, value: number }> = {};
  
  // Logic to generate responses with meaningful differences
  questions.forEach(question => {
    const id = question.id.toString();
    let value = 0;
    let option = '';
    
    // Lower scores for faith and foundation to create differences
    if (question.section === 'Your Faith Life' || question.section === 'Your Foundation') {
      const rand = Math.random();
      if (rand > 0.6) {
        value = 3;
        option = 'Agree';
      } else if (rand > 0.3) {
        value = 2;
        option = 'Neutral';
      } else {
        value = 1;
        option = 'Disagree';
      }
    } 
    // Higher scores for health, family, and partnership
    else if (question.section === 'Your Health and Wellness' || question.section === 'Your Family/Home Life' || question.section === 'Your Partnership') {
      value = Math.random() > 0.3 ? 4 : 3; // Strongly agree or agree most of the time
      option = value === 4 ? 'Strongly Agree' : 'Agree';
    } 
    // Average scores for other sections
    else {
      const rand = Math.random();
      if (rand > 0.7) {
        value = 4;
        option = 'Strongly Agree';
      } else if (rand > 0.3) {
        value = 3;
        option = 'Agree';
      } else if (rand > 0.2) {
        value = 2;
        option = 'Neutral';
      } else {
        value = 1;
        option = 'Disagree';
      }
    }
    
    wifeResponses[id] = { option, value };
  });
  
  return wifeResponses;
}

function generateDifferenceAnalysis(primaryResponses: Record<string, { option: string, value: number }>, 
                                   spouseResponses: Record<string, { option: string, value: number }>): DifferenceAnalysis {
  const differentResponses = [];
  const majorDifferences = [];
  
  // Compare responses and find differences
  questions.forEach(question => {
    const questionId = question.id.toString();
    const primaryResponse = primaryResponses[questionId];
    const spouseResponse = spouseResponses[questionId];
    
    if (primaryResponse && spouseResponse) {
      // Only count actual differences in responses
      const valueDifference = Math.abs(primaryResponse.value - spouseResponse.value);
      
      if (valueDifference > 0) {
        const difference = {
          questionId,
          questionText: question.text,
          questionWeight: question.points,
          section: question.section,
          primaryResponse: primaryResponse.option,
          spouseResponse: spouseResponse.option
        };
        
        differentResponses.push(difference);
        
        // Major differences are those with a value difference > 1 or high weight questions with any difference
        if (valueDifference > 1 || (question.points >= 3 && valueDifference > 0)) {
          majorDifferences.push(difference);
        }
      }
    }
  });
  
  // Categorize vulnerability areas
  const differencesBySections = differentResponses.reduce((acc, diff) => {
    acc[diff.section] = (acc[diff.section] || 0) + diff.questionWeight;
    return acc;
  }, {} as Record<string, number>);
  
  // Sort sections by total difference weight
  const sortedSections = Object.entries(differencesBySections)
    .sort((a, b) => b[1] - a[1])
    .map(([section]) => section);
  
  // Take top 2 sections with most differences as vulnerability areas
  const vulnerabilityAreas = sortedSections.slice(0, 2);
  
  // Strength areas are those with fewest differences
  const strengthAreas = sortedSections.length > 2 ? 
    sortedSections.slice(-3).reverse() : 
    sections.filter(s => !sortedSections.includes(s)).slice(0, 3);
  
  return {
    differentResponses,
    majorDifferences,
    strengthAreas,
    vulnerabilityAreas
  };
}

function calculateCompatibility(primaryAssessment: AssessmentResult, spouseAssessment: AssessmentResult, differenceAnalysis: DifferenceAnalysis): number {
  // Base compatibility score from different responses
  const totalQuestions = questions.length;
  const differentQuestions = differenceAnalysis.differentResponses.length;
  
  // Calculate percentage of agreement (as decimal)
  const agreementPercentage = (totalQuestions - differentQuestions) / totalQuestions;
  
  // Weight the agreement percentage heavily
  let compatibilityScore = agreementPercentage * 100;
  
  // Adjust based on number of major differences - each major difference reduces compatibility
  const majorDifferenceImpact = (differenceAnalysis.majorDifferences.length / totalQuestions) * 80;
  compatibilityScore -= majorDifferenceImpact;
  
  // Adjust further based on section score similarities (profile alignment)
  let sectionDifferenceTotal = 0;
  let sectionCount = 0;
  
  for (const section in primaryAssessment.scores.sections) {
    const primaryScore = primaryAssessment.scores.sections[section].percentage;
    const spouseScore = spouseAssessment.scores.sections[section].percentage;
    sectionDifferenceTotal += Math.abs(primaryScore - spouseScore);
    sectionCount++;
  }
  
  // Average percentage difference across sections
  const avgSectionDifference = sectionDifferenceTotal / (sectionCount || 1);
  
  // Convert to a compatibility adjustment (bigger differences reduce compatibility)
  const sectionAlignmentImpact = (avgSectionDifference / 10); // Each 10% avg difference reduces score by 1%
  compatibilityScore -= sectionAlignmentImpact;
  
  // Ensure compatibility is between 0-100%
  return Math.max(1, Math.min(99, Math.round(compatibilityScore)));
}

// Entry point for generating a realistic couple assessment with meaningful data and differences
async function generateRealisticCoupleAssessment() {
  console.log("Generating realistic couple assessment data...");
  
  // Generate timestamp
  const timestamp = new Date().toISOString();
  const coupleId = `realistic-test-${Date.now()}`;
  
  // Generate husband's responses and assessment
  const husbandResponses = generateHusbandResponses();
  const husbandScores = calculateSectionScores(husbandResponses);
  const husbandProfiles = determineProfile(husbandScores.sections, 'male');
  
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
    scores: husbandScores,
    profile: husbandProfiles.profile,
    genderProfile: husbandProfiles.genderProfile,
    responses: husbandResponses,
    timestamp,
    coupleId,
    coupleRole: 'primary'
  };
  
  // Generate wife's responses and assessment
  const wifeResponses = generateWifeResponses();
  const wifeScores = calculateSectionScores(wifeResponses);
  const wifeProfiles = determineProfile(wifeScores.sections, 'female');
  
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
    scores: wifeScores,
    profile: wifeProfiles.profile,
    genderProfile: wifeProfiles.genderProfile,
    responses: wifeResponses,
    timestamp,
    coupleId,
    coupleRole: 'spouse'
  };
  
  // Generate difference analysis
  const differenceAnalysis = generateDifferenceAnalysis(husbandResponses, wifeResponses);
  
  // Calculate compatibility score
  const overallCompatibility = calculateCompatibility(primaryAssessment, spouseAssessment, differenceAnalysis);
  
  // Create the final couple report
  const coupleReport: CoupleAssessmentReport = {
    coupleId,
    timestamp,
    primaryAssessment,
    spouseAssessment,
    differenceAnalysis,
    overallCompatibility
  };
  
  // Print statistics for visual review
  console.log("\n===== Couple Assessment Report Summary =====");
  console.log(`Couple ID: ${coupleId}`);
  console.log(`Timestamp: ${timestamp}`);
  console.log("\nPrimary: Michael Johnson (male)");
  console.log(`Overall Score: ${Math.round(primaryAssessment.scores.overallPercentage)}%`);
  console.log(`General Profile: ${primaryAssessment.profile.name}`);
  console.log(`Gender Profile: ${primaryAssessment.genderProfile?.name}`);
  console.log("\nSpouse: Sarah Williams (female)");
  console.log(`Overall Score: ${Math.round(spouseAssessment.scores.overallPercentage)}%`);
  console.log(`General Profile: ${spouseAssessment.profile.name}`);
  console.log(`Gender Profile: ${spouseAssessment.genderProfile?.name}`);
  console.log("\nCompatibility: " + overallCompatibility + "%");
  console.log(`Different Responses: ${differenceAnalysis.differentResponses.length} of ${questions.length} questions`);
  console.log(`Major Differences: ${differenceAnalysis.majorDifferences.length}`);
  console.log("\nStrength Areas:");
  differenceAnalysis.strengthAreas.forEach(area => console.log(`- ${area}`));
  console.log("\nVulnerability Areas:");
  differenceAnalysis.vulnerabilityAreas.forEach(area => console.log(`- ${area}`));
  
  // Generate PDF and save it
  console.log("\nGenerating couple assessment PDF report...");
  try {
    const pdfBuffer = await generateCoupleAssessmentPDF(coupleReport);
    
    // Save the PDF to a file
    const pdfPath = `./client/public/real-couple-assessment.pdf`;
    fs.writeFileSync(pdfPath, pdfBuffer);
    console.log(`PDF saved successfully to: ${pdfPath}`);
    
    // Email the couple assessment report
    console.log("Sending couple assessment email with PDF report...");
    const emailResult = await sendCoupleAssessmentEmail(coupleReport);
    
    if (emailResult.success) {
      console.log(`Couple assessment email sent successfully!`);
      if (emailResult.previewUrl) {
        console.log(`Preview URL: ${emailResult.previewUrl}`);
        console.log(`Open this URL in your browser to view the test email with couple assessment report`);
      }
    } else {
      console.error("Failed to send couple assessment email");
    }
  } catch (error) {
    console.error("Error generating or sending couple assessment:", error);
  }
}

// Run the test
generateRealisticCoupleAssessment();