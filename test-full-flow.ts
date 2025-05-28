// 📌 Simulates a full test submission for The 100 Marriage Assessment

import { questions } from './client/src/data/questionsData';
import { calculateScores, determineProfiles } from './client/src/utils/scoringUtils';
import { ProfessionalPDFGenerator } from './server/pdfReportGenerator';
import { sendAssessmentEmail } from './server/nodemailer';
import fs from 'fs';
import path from 'path';

const testUser = {
  email: "la@lawrenceadjah.com",
  firstName: "Test",
  lastName: "User THM",
  gender: "male" as const,
  promoCode: "FREE100"
};

// Weighted randomness for selecting answers
function generateWeightedResponse(options: string[]): string {
  const weights = options.map((_, i) => options.length - i);
  const total = weights.reduce((sum, w) => sum + w, 0);
  const rand = Math.floor(Math.random() * total);
  let cumulative = 0;
  for (let i = 0; i < options.length; i++) {
    cumulative += weights[i];
    if (rand < cumulative) return options[i];
  }
  return options[0];
}

// Generate fake responses
const responses: Record<number, { option: string; value: number }> = {};
questions.forEach(question => {
  const selectedOption = generateWeightedResponse(question.options);
  const value = question.type === "D" 
    ? (selectedOption === question.options[0] ? 1 : 0)
    : question.options.indexOf(selectedOption) + 1;
  
  responses[question.id] = {
    option: selectedOption,
    value: value
  };
});

async function runTestFlow() {
  console.log("🚀 Running simulated assessment flow...");

  try {
    // Calculate scores and profiles
    const scores = calculateScores(questions, responses);
    const { primaryProfile, genderProfile } = determineProfiles(scores, testUser.gender);

    // Create assessment object
    const assessment = {
      email: testUser.email,
      name: `${testUser.firstName} ${testUser.lastName}`,
      demographics: {
        firstName: testUser.firstName,
        lastName: testUser.lastName,
        email: testUser.email,
        gender: testUser.gender,
        birthday: '1990-01-01',
        lifeStage: 'single',
        marriageStatus: 'no',
        desireChildren: 'yes',
        ethnicity: 'Other',
        city: 'Test City',
        state: 'Test State',
        zipCode: '12345',
        hasPurchasedBook: 'false'
      },
      responses,
      scores,
      profile: primaryProfile,
      genderProfile,
      timestamp: new Date().toISOString()
    };

    console.log(`Assessment Score: ${scores.overallPercentage}%`);
    console.log(`Primary Profile: ${primaryProfile.name}`);

    // Generate PDF report
    const pdfGenerator = new ProfessionalPDFGenerator();
    const pdfBuffer = await pdfGenerator.generateIndividualReport(assessment);
    
    // Ensure test-outputs directory exists
    const outputDir = path.join(process.cwd(), 'test-outputs');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const reportPath = path.join(outputDir, `report-${Date.now()}.pdf`);
    fs.writeFileSync(reportPath, pdfBuffer);
    console.log("✅ PDF report generated:", reportPath);

    // Send email
    const emailStatus = await sendAssessmentEmail(testUser.email, assessment);
    console.log("📩 Email sent status:", emailStatus);

    console.log("🎉 Full test flow completed successfully!");

  } catch (error) {
    console.error("❌ Test flow failed:", error);
  }
}

runTestFlow().catch(console.error);