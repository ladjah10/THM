import fs from 'fs';
import path from 'path';
import { AssessmentResult, CoupleAssessmentReport, DifferenceAnalysis } from './shared/schema';
import { generateCoupleAssessmentPDF } from './server/updated-couple-pdf';

/**
 * This script generates a realistic couple assessment PDF report with actual data
 * It emphasizes proper layout and avoids text overflow issues
 */
async function generateRealCoupleAssessmentPDF() {
  // Create primary assessment data
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
        "Your Faith Life": { earned: 85, possible: 100, percentage: 85 },
        "Your Health and Wellness": { earned: 70, possible: 100, percentage: 70 },
        "Your Foundation": { earned: 92, possible: 100, percentage: 92 },
        "Your Finances": { earned: 65, possible: 100, percentage: 65 },
        "Your Marriage Life": { earned: 78, possible: 100, percentage: 78 },
        "Your Family/Home Life": { earned: 88, possible: 100, percentage: 88 },
        "Your Marriage and Boundaries": { earned: 72, possible: 100, percentage: 72 },
        "Your Parenting Life": { earned: 84, possible: 100, percentage: 84 }
      },
      overallPercentage: 80.8,
      strengths: ["Your Foundation", "Your Faith Life", "Your Marriage Life"],
      improvementAreas: ["Your Finances", "Your Health and Wellness"],
      totalEarned: 878,
      totalPossible: 1100
    },
    profile: {
      id: 1,
      name: "Balanced Visionaries",
      description: "You take a holistic approach to marriage, valuing both tradition and flexibility. You're thoughtful about balancing faith, family, and work priorities.",
      genderSpecific: null,
      criteria: [
        { section: "Your Foundation", min: 80 },
        { section: "Your Faith Life", min: 70 }
      ],
      iconPath: "/icons/balanced-visionaries.svg"
    },
    genderProfile: {
      id: 7,
      name: "Faithful Protectors",
      description: "As a man, you value your role as a provider and protector. Your faith influences your approach to marriage, and you take your responsibilities seriously.",
      genderSpecific: "male",
      criteria: [
        { section: "Your Faith Life", min: 75 },
        { section: "Your Foundation", min: 70 }
      ],
      iconPath: "/icons/faithful-protectors.svg"
    },
    responses: {
      // Sample key responses for comparison
      "1": { option: "Strongly Agree", value: 4 },
      "5": { option: "Strongly Agree", value: 4 },
      "12": { option: "Agree", value: 3 },
      "17": { option: "Strongly Agree", value: 4 },
      "25": { option: "Disagree", value: 1 },
      "30": { option: "Strongly Agree", value: 4 },
      "42": { option: "Neutral", value: 2 },
      "50": { option: "Agree", value: 3 },
      "63": { option: "Strongly Agree", value: 4 },
      "78": { option: "Disagree", value: 1 },
      "85": { option: "Agree", value: 3 }
    },
    timestamp: new Date().toISOString(),
    coupleId: `test-couple-${Date.now()}`,
    coupleRole: 'primary'
  };

  // Create spouse assessment data with some notable differences
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
        "Your Faith Life": { earned: 65, possible: 100, percentage: 65 },
        "Your Health and Wellness": { earned: 85, possible: 100, percentage: 85 },
        "Your Foundation": { earned: 75, possible: 100, percentage: 75 },
        "Your Finances": { earned: 88, possible: 100, percentage: 88 },
        "Your Marriage Life": { earned: 90, possible: 100, percentage: 90 },
        "Your Family/Home Life": { earned: 92, possible: 100, percentage: 92 },
        "Your Marriage and Boundaries": { earned: 82, possible: 100, percentage: 82 },
        "Your Parenting Life": { earned: 80, possible: 100, percentage: 80 }
      },
      overallPercentage: 81.4,
      strengths: ["Your Family/Home Life", "Your Marriage Life", "Your Finances"],
      improvementAreas: ["Your Faith Life", "Your Foundation"],
      totalEarned: 895,
      totalPossible: 1100
    },
    profile: {
      id: 2,
      name: "Faith-Centered Traditionalists",
      description: "Your approach to marriage is rooted in traditional values and spiritual guidance. You seek spiritual alignment in all your relationship decisions.",
      genderSpecific: null,
      criteria: [
        { section: "Your Faith Life", min: 60 },
        { section: "Your Foundation", min: 70 }
      ],
      iconPath: "/icons/faith-centered-traditionalists.svg"
    },
    genderProfile: {
      id: 9,
      name: "Relational Nurturers",
      description: "As a woman, you bring warmth and care to relationships. You value emotional connection and creating a nurturing home environment.",
      genderSpecific: "female",
      criteria: [
        { section: "Your Family/Home Life", min: 80 },
        { section: "Your Marriage Life", min: 75 }
      ],
      iconPath: "/icons/relational-nurturers.svg"
    },
    responses: {
      // Sample key responses for comparison (with some significant differences)
      "1": { option: "Agree", value: 3 },
      "5": { option: "Neutral", value: 2 },
      "12": { option: "Strongly Agree", value: 4 },
      "17": { option: "Neutral", value: 2 },
      "25": { option: "Strongly Agree", value: 4 },
      "30": { option: "Disagree", value: 1 },
      "42": { option: "Strongly Agree", value: 4 },
      "50": { option: "Disagree", value: 1 },
      "63": { option: "Agree", value: 3 },
      "78": { option: "Strongly Agree", value: 4 },
      "85": { option: "Neutral", value: 2 }
    },
    timestamp: new Date().toISOString(),
    coupleId: primaryAssessment.coupleId,
    coupleRole: 'spouse'
  };

  // Create difference analysis
  const differenceAnalysis: DifferenceAnalysis = {
    differentResponses: [
      {
        questionId: "1",
        questionText: "I believe faith should play a central role in our marriage and family decisions.",
        questionWeight: 5,
        section: "Your Faith Life",
        primaryResponse: "Strongly Agree",
        spouseResponse: "Agree"
      },
      {
        questionId: "5",
        questionText: "I believe regular worship and prayer together are essential for a strong marriage.",
        questionWeight: 4,
        section: "Your Faith Life",
        primaryResponse: "Strongly Agree",
        spouseResponse: "Neutral"
      },
      {
        questionId: "12",
        questionText: "I expect us to maintain healthy lifestyles and support each other's wellness goals.",
        questionWeight: 3,
        section: "Your Health and Wellness",
        primaryResponse: "Agree",
        spouseResponse: "Strongly Agree"
      },
      {
        questionId: "17",
        questionText: "I believe we should agree on our core values and life philosophy before marriage.",
        questionWeight: 5,
        section: "Your Foundation",
        primaryResponse: "Strongly Agree",
        spouseResponse: "Neutral"
      },
      {
        questionId: "25",
        questionText: "I think our financial decisions should be made together, even for small purchases.",
        questionWeight: 4,
        section: "Your Finances",
        primaryResponse: "Disagree",
        spouseResponse: "Strongly Agree"
      },
      {
        questionId: "30",
        questionText: "I expect my spouse to be my closest confidant and best friend.",
        questionWeight: 5,
        section: "Your Marriage Life",
        primaryResponse: "Strongly Agree",
        spouseResponse: "Disagree"
      },
      {
        questionId: "42",
        questionText: "I believe in splitting household responsibilities based on individual strengths rather than traditional gender roles.",
        questionWeight: 3,
        section: "Your Family/Home Life",
        primaryResponse: "Neutral",
        spouseResponse: "Strongly Agree"
      },
      {
        questionId: "50",
        questionText: "I believe a healthy sex life is critical to a successful marriage.",
        questionWeight: 4,
        section: "Your Marriage and Boundaries",
        primaryResponse: "Agree",
        spouseResponse: "Disagree"
      },
      {
        questionId: "63",
        questionText: "I prefer direct communication, even when it's uncomfortable.",
        questionWeight: 3,
        section: "Your Marriage and Boundaries",
        primaryResponse: "Strongly Agree",
        spouseResponse: "Agree"
      },
      {
        questionId: "78",
        questionText: "I believe maintaining separate friendships outside our marriage is important.",
        questionWeight: 3,
        section: "Your Marriage and Boundaries",
        primaryResponse: "Disagree",
        spouseResponse: "Strongly Agree"
      },
      {
        questionId: "85",
        questionText: "I expect career decisions to prioritize family needs over individual advancement.",
        questionWeight: 4,
        section: "Your Family/Home Life",
        primaryResponse: "Agree",
        spouseResponse: "Neutral"
      }
    ],
    majorDifferences: [
      {
        questionId: "5",
        questionText: "I believe regular worship and prayer together are essential for a strong marriage.",
        questionWeight: 4,
        section: "Your Faith Life",
        primaryResponse: "Strongly Agree",
        spouseResponse: "Neutral"
      },
      {
        questionId: "17",
        questionText: "I believe we should agree on our core values and life philosophy before marriage.",
        questionWeight: 5,
        section: "Your Foundation",
        primaryResponse: "Strongly Agree",
        spouseResponse: "Neutral"
      },
      {
        questionId: "25",
        questionText: "I think our financial decisions should be made together, even for small purchases.",
        questionWeight: 4,
        section: "Your Finances",
        primaryResponse: "Disagree",
        spouseResponse: "Strongly Agree"
      },
      {
        questionId: "30",
        questionText: "I expect my spouse to be my closest confidant and best friend.",
        questionWeight: 5,
        section: "Your Marriage Life",
        primaryResponse: "Strongly Agree",
        spouseResponse: "Disagree"
      },
      {
        questionId: "42",
        questionText: "I believe in splitting household responsibilities based on individual strengths rather than traditional gender roles.",
        questionWeight: 3,
        section: "Your Family/Home Life",
        primaryResponse: "Neutral",
        spouseResponse: "Strongly Agree"
      },
      {
        questionId: "50",
        questionText: "I believe a healthy sex life is critical to a successful marriage.",
        questionWeight: 4,
        section: "Your Marriage and Boundaries",
        primaryResponse: "Agree",
        spouseResponse: "Disagree"
      },
      {
        questionId: "78",
        questionText: "I believe maintaining separate friendships outside our marriage is important.",
        questionWeight: 3,
        section: "Your Marriage and Boundaries",
        primaryResponse: "Disagree",
        spouseResponse: "Strongly Agree"
      }
    ],
    strengthAreas: ["Your Parenting Life", "Your Marriage and Boundaries", "Your Family/Home Life"],
    vulnerabilityAreas: ["Your Faith Life", "Your Marriage Life", "Your Foundation"]
  };

  // Create the couple assessment report with the data
  const coupleReport: CoupleAssessmentReport = {
    coupleId: primaryAssessment.coupleId!,
    timestamp: new Date().toISOString(),
    primaryAssessment,
    spouseAssessment,
    differenceAnalysis,
    overallCompatibility: 72 // A reasonable compatibility score given the differences
  };

  try {
    console.log("Generating PDF report for a realistic couple assessment...");
    const pdfBuffer = await generateCoupleAssessmentPDF(coupleReport);
    
    // Define the output path
    const outputPath = path.join(process.cwd(), 'client/public/realistic-couple-assessment.pdf');
    
    // Write the PDF to the file
    fs.writeFileSync(outputPath, pdfBuffer);
    
    console.log(`PDF saved successfully at: ${outputPath}`);
    console.log("You can now view this PDF in your browser at /realistic-couple-assessment.pdf");
    
    // Create a simple HTML viewer page
    const viewerHtml = `
<!DOCTYPE html>
<html>
<head>
  <title>Realistic Couple Assessment Report</title>
  <style>
    body {
      font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      margin: 0;
      padding: 0;
      display: flex;
      flex-direction: column;
      align-items: center;
      background-color: #f5f5f5;
      min-height: 100vh;
    }
    header {
      background-color: #7e22ce;
      color: white;
      width: 100%;
      padding: 1rem;
      text-align: center;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 {
      margin: 0;
      font-size: 1.5rem;
    }
    main {
      padding: 2rem;
      max-width: 1000px;
      width: 100%;
      box-sizing: border-box;
    }
    .pdf-container {
      width: 100%;
      height: 800px;
      border: 1px solid #ddd;
      border-radius: 8px;
      overflow: hidden;
      background-color: white;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    p {
      text-align: center;
      margin-bottom: 1rem;
    }
    a {
      color: #7e22ce;
      text-decoration: none;
    }
    a:hover {
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <header>
    <h1>The 100 Marriage Assessment - Series 1</h1>
  </header>
  <main>
    <p>This is a realistic couple assessment report generated with improved PDF layout.</p>
    <p><a href="/realistic-couple-assessment.pdf" target="_blank">Open PDF in new tab</a></p>
    <div class="pdf-container">
      <iframe src="/realistic-couple-assessment.pdf" width="100%" height="100%" style="border: none;"></iframe>
    </div>
  </main>
</body>
</html>
    `;
    
    // Save the viewer HTML page
    const viewerPath = path.join(process.cwd(), 'client/public/realistic-couple-assessment.html');
    fs.writeFileSync(viewerPath, viewerHtml);
    console.log(`HTML viewer saved at: ${viewerPath}`);
    console.log("You can view this HTML page at /realistic-couple-assessment.html");
    
  } catch (error) {
    console.error("Error generating or saving PDF:", error);
  }
}

// Run the script
generateRealCoupleAssessmentPDF();