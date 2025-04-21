import { AssessmentResult, CoupleAssessmentReport, DifferenceAnalysis } from './shared/schema';
import { MailService } from '@sendgrid/mail';
import { generateIndividualAssessmentPDF } from './server/updated-individual-pdf';
import { generateCoupleAssessmentPDF } from './server/updated-couple-pdf';
import fs from 'fs';
import path from 'path';

// Initialize SendGrid
if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * This script generates sample individual and couple assessment reports
 * and sends them via SendGrid email for testing
 */
async function sendSampleReports() {
  try {
    console.log('Preparing to send sample reports to la@lawrenceadjah.com via SendGrid...');
    
    // 1. First, send a sample individual assessment report
    const individualAssessment: AssessmentResult = {
      email: 'lawrence@lawrenceadjah.com',
      name: 'Matthew Johnson',
      timestamp: new Date().toISOString(),
      demographics: {
        firstName: 'Matthew',
        lastName: 'Johnson',
        email: 'lawrence@lawrenceadjah.com',
        phone: '212-555-1234',
        gender: 'male',
        ethnicity: 'Black, African, Caribbean',
        marriageStatus: 'Single',
        desireChildren: 'Yes',
        hasPaid: true,
        lifeStage: 'Established Adult',
        birthday: '1988-04-18',
        city: 'New York',
        state: 'NY',
        zipCode: '10001'
      },
      profile: {
        id: 2,
        name: 'Balanced Visionary',
        description: 'You have a thoughtful, balanced approach to marriage. You value both tradition and modern perspectives, seeking harmony between stability and flexibility. Your responses show a well-rounded understanding of marriage dynamics with a natural ability to adapt while maintaining core values.',
        genderSpecific: 'false',
        iconPath: '/attached_assets/BV 6.png',
        criteria: [
          { section: 'Your Foundation', min: 70 },
          { section: 'Your Parenting Life', min: 65 },
          { section: 'Your Marriage Life', min: 65 }
        ]
      },
      genderProfile: {
        id: 7,
        name: 'Structured Leader',
        description: 'As a Structured Leader, you bring organization and clarity to relationships. You value defined roles and clear communication. Your thoughtful approach to leadership means you provide stability while still valuing input from your spouse. You excel at creating systems that help marriages thrive.',
        genderSpecific: 'male',
        iconPath: '/attached_assets/SL 12.png',
        criteria: [
          { section: 'Your Marriage Life', min: 70 },
          { section: 'Your Finances', min: 65 },
          { section: 'Your Marriage and Boundaries', min: 75 }
        ]
      },
      responses: {
        '1': { option: 'StronglyAgree', value: 5 },
        '2': { option: 'Agree', value: 4 },
        // Additional responses would be here...
        '99': { option: 'StronglyAgree', value: 5 }
      },
      scores: {
        sections: {
          'Your Foundation': { earned: 92, possible: 100, percentage: 92 },
          'Your Faith Life': { earned: 84, possible: 100, percentage: 84 },
          'Your Marriage Life': { earned: 88, possible: 100, percentage: 88 },
          'Your Parenting Life': { earned: 78, possible: 100, percentage: 78 },
          'Your Family/Home Life': { earned: 82, possible: 100, percentage: 82 },
          'Your Finances': { earned: 76, possible: 100, percentage: 76 },
          'Your Health and Wellness': { earned: 86, possible: 100, percentage: 86 },
          'Your Marriage and Boundaries': { earned: 72, possible: 100, percentage: 72 }
        },
        totalEarned: 658,
        totalPossible: 800,
        overallPercentage: 82.25,
        strengths: ['Your Foundation', 'Your Faith Life', 'Your Marriage Life'],
        improvementAreas: ['Your Finances', 'Your Marriage and Boundaries', 'Your Health and Wellness']
      }
    };

    // Send individual assessment
    await sendIndividualAssessment(individualAssessment);

    // 2. Create sample couple assessment data
    const primaryAssessment: AssessmentResult = {
      email: 'lawrence@lawrenceadjah.com',
      name: 'Michael Thomas',
      timestamp: new Date().toISOString(),
      demographics: {
        firstName: 'Michael',
        lastName: 'Thomas',
        email: 'lawrence@lawrenceadjah.com',
        phone: '212-555-2345',
        gender: 'male',
        ethnicity: 'Black, African, Caribbean',
        marriageStatus: 'Engaged',
        desireChildren: 'Yes',
        hasPaid: true,
        lifeStage: 'Established Adult',
        birthday: '1990-08-11',
        city: 'Brooklyn',
        state: 'NY',
        zipCode: '11201'
      },
      profile: {
        id: 6,
        name: 'Faith-Centered Builder',
        description: 'You place faith at the center of your relationship values. You build relationships on spiritual foundations, believing that shared faith creates stronger marriages. You value consistency in spiritual practices and view marriage as a sacred covenant with clearly defined roles and responsibilities.',
        genderSpecific: 'false',
        iconPath: '/attached_assets/FF 3.png',
        criteria: [
          { section: 'Your Foundation', min: 80 },
          { section: 'Your Faith Life', min: 80 },
          { section: 'Your Marriage Life', min: 70 }
        ]
      },
      genderProfile: {
        id: 7,
        name: 'Structured Leader',
        description: 'As a Structured Leader, you bring organization and clarity to relationships. You value defined roles and clear communication. Your thoughtful approach to leadership means you provide stability while still valuing input from your spouse. You excel at creating systems that help marriages thrive.',
        genderSpecific: 'male',
        iconPath: '/attached_assets/SL 12.png',
        criteria: [
          { section: 'Your Marriage Life', min: 70 },
          { section: 'Your Finances', min: 65 },
          { section: 'Your Marriage and Boundaries', min: 75 }
        ]
      },
      responses: {
        '1': { option: 'StronglyAgree', value: 5 },
        '2': { option: 'Agree', value: 4 },
        // Additional responses...
        '99': { option: 'Agree', value: 4 }
      },
      scores: {
        sections: {
          'Your Foundation': { earned: 96, possible: 100, percentage: 96 },
          'Your Faith Life': { earned: 92, possible: 100, percentage: 92 },
          'Your Marriage Life': { earned: 84, possible: 100, percentage: 84 },
          'Your Parenting Life': { earned: 78, possible: 100, percentage: 78 },
          'Your Family/Home Life': { earned: 82, possible: 100, percentage: 82 },
          'Your Finances': { earned: 74, possible: 100, percentage: 74 },
          'Your Health and Wellness': { earned: 79, possible: 100, percentage: 79 },
          'Your Marriage and Boundaries': { earned: 80, possible: 100, percentage: 80 }
        },
        totalEarned: 665,
        totalPossible: 800,
        overallPercentage: 83.13,
        strengths: ['Your Foundation', 'Your Faith Life', 'Your Marriage and Boundaries'],
        improvementAreas: ['Your Finances', 'Your Parenting Life', 'Your Health and Wellness']
      }
    };

    const spouseAssessment: AssessmentResult = {
      email: 'lawrence@lawrenceadjah.com',
      name: 'Sarah Williams',
      timestamp: new Date().toISOString(),
      demographics: {
        firstName: 'Sarah',
        lastName: 'Williams',
        email: 'lawrence@lawrenceadjah.com',
        phone: '212-555-3456',
        gender: 'female',
        ethnicity: 'Black, African, Caribbean',
        marriageStatus: 'Engaged',
        desireChildren: 'Yes',
        hasPaid: true,
        lifeStage: 'Established Adult',
        birthday: '1991-04-23',
        city: 'Brooklyn',
        state: 'NY',
        zipCode: '11201'
      },
      profile: {
        id: 3,
        name: 'Relationship Nurturer',
        description: 'You are a natural nurturer who prioritizes emotional connections and healthy communication in relationships. You value creating a supportive environment where both partners can grow and flourish. You\'re intuitive about others\' needs and committed to building a partnership that adapts and evolves together.',
        genderSpecific: 'false',
        iconPath: '/attached_assets/RN 7.png',
        criteria: [
          { section: 'Your Marriage Life', min: 75 },
          { section: 'Your Family/Home Life', min: 70 },
          { section: 'Your Health and Wellness', min: 65 }
        ]
      },
      genderProfile: {
        id: 8,
        name: 'Intuitive Supporter',
        description: 'As an Intuitive Supporter, you have a natural ability to recognize and respond to emotional needs in relationships. You lead with empathy and create spaces where authentic communication thrives. You skillfully balance nurturing others while maintaining healthy boundaries, making you a deeply valued partner.',
        genderSpecific: 'female',
        iconPath: '/attached_assets/IS 5.png',
        criteria: [
          { section: 'Your Marriage Life', min: 65 },
          { section: 'Your Family/Home Life', min: 75 },
          { section: 'Your Health and Wellness', min: 70 }
        ]
      },
      responses: {
        '1': { option: 'Agree', value: 4 },
        '2': { option: 'StronglyAgree', value: 5 },
        // Additional responses...
        '99': { option: 'Agree', value: 4 }
      },
      scores: {
        sections: {
          'Your Foundation': { earned: 84, possible: 100, percentage: 84 },
          'Your Faith Life': { earned: 78, possible: 100, percentage: 78 },
          'Your Marriage Life': { earned: 88, possible: 100, percentage: 88 },
          'Your Parenting Life': { earned: 82, possible: 100, percentage: 82 },
          'Your Family/Home Life': { earned: 90, possible: 100, percentage: 90 },
          'Your Finances': { earned: 76, possible: 100, percentage: 76 },
          'Your Health and Wellness': { earned: 86, possible: 100, percentage: 86 },
          'Your Marriage and Boundaries': { earned: 74, possible: 100, percentage: 74 }
        },
        totalEarned: 658,
        totalPossible: 800,
        overallPercentage: 82.25,
        strengths: ['Your Family/Home Life', 'Your Marriage Life', 'Your Health and Wellness'],
        improvementAreas: ['Your Marriage and Boundaries', 'Your Faith Life', 'Your Finances']
      }
    };

    // Define differences for couple assessment
    const differenceAnalysis: DifferenceAnalysis = {
      differentResponses: [
        {
          questionId: '15',
          questionText: 'A spouse\'s faith should align with their partner\'s.',
          questionWeight: 4,
          section: 'Your Faith Life',
          primaryResponse: 'StronglyAgree',
          spouseResponse: 'Neutral'
        },
        {
          questionId: '27',
          questionText: 'Traditional gender roles are important in a marriage.',
          questionWeight: 3,
          section: 'Your Foundation',
          primaryResponse: 'Agree',
          spouseResponse: 'Disagree'
        }
      ],
      majorDifferences: [
        {
          questionId: '12',
          questionText: 'Regular religious practices are vital to a successful marriage.',
          questionWeight: 5,
          section: 'Your Faith Life',
          primaryResponse: 'StronglyAgree',
          spouseResponse: 'Neutral'
        }
      ],
      strengthAreas: [
        'Financial compatibility and shared values',
        'Similar views on marriage dynamics',
        'Mutual appreciation for emotional and physical wellbeing'
      ],
      vulnerabilityAreas: [
        'Different expectations around faith practices',
        'Divergent views on family roles and traditions',
        'Varying perspectives on home environment'
      ]
    };

    // Create couple assessment report
    const coupleReport: CoupleAssessmentReport = {
      coupleId: 'SAMPLE-COUPLE-2025',
      timestamp: new Date().toISOString(),
      primaryAssessment: primaryAssessment,
      spouseAssessment: spouseAssessment,
      differenceAnalysis: differenceAnalysis,
      overallCompatibility: 84
    };

    // Send couple assessment
    await sendCoupleAssessment(coupleReport);

    console.log('Sample reports sent successfully via SendGrid. Check lawrence@lawrenceadjah.com for the reports.');

  } catch (error) {
    console.error('Error in send-sendgrid-samples.ts:', error);
  }
}

async function sendIndividualAssessment(assessment: AssessmentResult): Promise<void> {
  try {
    console.log('Generating and sending individual assessment via SendGrid...');
    
    // Generate PDF report
    console.log('Generating PDF report...');
    const pdfBuffer = await generateIndividualAssessmentPDF(assessment);
    
    // Save PDF locally for inspection
    const pdfPath = path.join(process.cwd(), 'individual-assessment-sample.pdf');
    fs.writeFileSync(pdfPath, pdfBuffer);
    console.log(`Individual assessment PDF saved to ${pdfPath} for inspection`);
    
    // Format email HTML
    const emailHtml = formatIndividualEmail(assessment);
    
    // Create the email message
    const message = {
      to: 'lawrence@lawrenceadjah.com', 
      from: 'hello@wgodw.com', // This should be a verified sender in SendGrid
      subject: `${assessment.demographics.firstName} ${assessment.demographics.lastName} - The 100 Marriage Assessment Results`,
      html: emailHtml,
      // No CC since it's the same as "to" address
      attachments: [
        {
          content: pdfBuffer.toString('base64'),
          filename: 'The-100-Marriage-Assessment-Report.pdf',
          type: 'application/pdf',
          disposition: 'attachment'
        }
      ]
    };
    
    console.log('Sending individual assessment email via SendGrid...');
    const result = await mailService.send(message);
    console.log('SendGrid response:', result);
    console.log('Individual assessment email sent successfully!');
    
  } catch (error) {
    console.error('Error sending individual assessment via SendGrid:', error);
    // More detailed error information
    if (error.response) {
      console.error('Error response body:', error.response.body);
    }
    throw error;
  }
}

async function sendCoupleAssessment(report: CoupleAssessmentReport): Promise<void> {
  try {
    console.log('Generating and sending couple assessment via SendGrid...');
    
    // Generate PDF report
    console.log('Generating couple PDF report...');
    const pdfBuffer = await generateCoupleAssessmentPDF(report);
    
    // Save PDF locally for inspection
    const pdfPath = path.join(process.cwd(), 'couple-assessment-sample.pdf');
    fs.writeFileSync(pdfPath, pdfBuffer);
    console.log(`Couple assessment PDF saved to ${pdfPath} for inspection`);
    
    // Format email HTML
    const emailHtml = formatCoupleEmail(report);
    
    // Create the email message
    const message = {
      to: 'lawrence@lawrenceadjah.com',
      from: 'hello@wgodw.com', // This should be a verified sender in SendGrid
      subject: `${report.primaryAssessment.demographics.firstName} & ${report.spouseAssessment.demographics.firstName} - The 100 Marriage Couple Assessment Results`,
      html: emailHtml,
      // No CC since it's the same as "to" address
      attachments: [
        {
          content: pdfBuffer.toString('base64'),
          filename: 'The-100-Marriage-Couple-Assessment-Report.pdf',
          type: 'application/pdf',
          disposition: 'attachment'
        }
      ]
    };
    
    console.log('Sending couple assessment email via SendGrid...');
    const result = await mailService.send(message);
    console.log('SendGrid response:', result);
    console.log('Couple assessment email sent successfully!');
    
  } catch (error) {
    console.error('Error sending couple assessment via SendGrid:', error);
    // More detailed error information
    if (error.response) {
      console.error('Error response body:', error.response.body);
    }
    throw error;
  }
}

function formatIndividualEmail(assessment: AssessmentResult): string {
  const { demographics, scores, profile, genderProfile } = assessment;
  
  // Format sections scores
  const sectionsHtml = Object.entries(scores.sections)
    .map(([section, score]) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${section}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${score.earned}/${score.possible}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${Math.round(score.percentage)}%</td>
      </tr>
    `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>The 100 Marriage Assessment - Series 1 Results</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 25px; }
        h1 { color: #2c3e50; }
        h2 { color: #3498db; margin-top: 20px; }
        .profile-box { background-color: #f8f9fa; border-left: 4px solid #3498db; padding: 15px; margin: 15px 0; }
        .scores-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .scores-table th { background-color: #3498db; color: white; text-align: left; padding: 10px; }
        .scores-table td, .scores-table th { border: 1px solid #ddd; padding: 8px; }
        .overall-score { font-size: 24px; font-weight: bold; color: #2c3e50; }
        .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #7f8c8d; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>The 100 Marriage Assessment - Series 1 Results</h1>
        </div>
        
        <div class="section">
          <p>Dear ${demographics.firstName},</p>
          <p>Thank you for completing The 100 Marriage Assessment - Series 1. Below are your detailed results. We've also attached a beautifully designed PDF report of your results that you can download, print, or share.</p>
        </div>
        
        <div class="section">
          <h2>Your Overall Assessment Score</h2>
          <p class="overall-score">${Math.round(scores.overallPercentage)}%</p>
          <p>Total Score: ${scores.totalEarned}/${scores.totalPossible}</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 10px; font-size: 14px; color: #555;">
            <strong>Understanding Your Score:</strong> Your score reflects your perspectives on marriage, not a judgment of readiness.
            Higher percentages indicate more traditional viewpoints on relationships, while lower percentages suggest less traditional approaches.
            Neither is inherently better—these are simply different approaches to relationship, and your scores help identify your psychographic profile.
          </div>
        </div>
        
        <div class="section">
          <h2>Your Detailed Scores</h2>
          <p style="margin-bottom: 15px; color: #555;">
            These scores show your responses to questions in each area. Each section reveals different aspects of your 
            relationship approach. Together, they form the basis for your psychographic profile assessment.
          </p>
          <table class="scores-table">
            <thead>
              <tr>
                <th>Section</th>
                <th>Score</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              ${sectionsHtml}
            </tbody>
          </table>
        </div>
        
        <div class="section">
          <h2>Your Psychographic Profiles</h2>
          
          <h3 style="color: #3498db;">General Profile: ${profile.name}</h3>
          <div class="profile-box" style="border-left: 4px solid #3498db; padding-left: 15px;">
            <p>${profile.description}</p>
          </div>

          ${genderProfile ? `
          <h3 style="color: #9b59b6; margin-top: 20px;">${demographics.gender === 'male' ? 'Male' : 'Female'}-Specific Profile: ${genderProfile.name}</h3>
          <div class="profile-box" style="border-left: 4px solid #9b59b6; padding-left: 15px;">
            <p>${genderProfile.description}</p>
          </div>
          ` : ''}
        </div>
        
        <div class="section" style="background-color: #edf7ff; padding: 20px; border-radius: 5px; border-left: 4px solid #3498db; margin-top: 25px;">
          <h2 style="margin-top: 0; color: #2980b9;">Get Personalized Guidance</h2>
          <p>Would you like expert help interpreting your results? Schedule a one-on-one consultation with Lawrence E. Adjah to discuss your assessment in detail and get personalized insights about your relationship expectations.</p>
          <div style="text-align: center; margin-top: 15px;">
            <a href="https://lawrence-adjah.clientsecure.me/request/service" style="display: inline-block; background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Book Your Consultation Now</a>
          </div>
        </div>
        
        <div class="footer">
          <p>(c) 2025 Lawrence E. Adjah - The 100 Marriage Assessment - Series 1</p>
          <p>This assessment is designed to help you understand your readiness for marriage and identify areas for growth.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

function formatCoupleEmail(report: CoupleAssessmentReport): string {
  const { primaryAssessment, spouseAssessment, differenceAnalysis, overallCompatibility } = report;
  
  // Format sections scores for primary partner
  const primarySectionsHtml = Object.entries(primaryAssessment.scores.sections)
    .map(([section, score]) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${section}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${score.earned}/${score.possible}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${Math.round(score.percentage)}%</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${Math.round(spouseAssessment.scores.sections[section].percentage)}%</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${Math.abs(Math.round(score.percentage - spouseAssessment.scores.sections[section].percentage))}%</td>
      </tr>
    `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>The 100 Marriage Couple Assessment Results</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 25px; }
        h1 { color: #2c3e50; }
        h2 { color: #8e44ad; margin-top: 20px; }
        .profile-box { background-color: #f8f9fa; border-left: 4px solid #8e44ad; padding: 15px; margin: 15px 0; }
        .scores-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .scores-table th { background-color: #8e44ad; color: white; text-align: left; padding: 10px; }
        .scores-table td, .scores-table th { border: 1px solid #ddd; padding: 8px; }
        .compatibility-score { font-size: 24px; font-weight: bold; color: #2c3e50; }
        .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #7f8c8d; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>The 100 Marriage Couple Assessment Results</h1>
        </div>
        
        <div class="section">
          <p>Dear ${primaryAssessment.demographics.firstName} and ${spouseAssessment.demographics.firstName},</p>
          <p>Thank you for completing The 100 Marriage Couple Assessment. This email contains a summary of your results, and we've attached a comprehensive PDF report that analyzes your compatibility in detail.</p>
        </div>
        
        <div class="section">
          <h2>Your Compatibility Score</h2>
          <p class="compatibility-score">${overallCompatibility}%</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 10px; font-size: 14px; color: #555;">
            <strong>Understanding Your Score:</strong> This percentage represents how closely your perspectives on marriage align. 
            A higher score indicates more similarity in your expectations and values, which can make navigating relationship 
            decisions easier. However, differences can also be complementary - the detailed report explains where your 
            perspectives align and where you may need additional communication.
          </div>
        </div>
        
        <div class="section">
          <h2>Comparison of Your Scores</h2>
          <p style="margin-bottom: 15px; color: #555;">
            This table shows how each of you scored across the different assessment areas and highlights the percentage difference in each section.
          </p>
          <table class="scores-table">
            <thead>
              <tr>
                <th>Section</th>
                <th>${primaryAssessment.demographics.firstName}'s Score</th>
                <th>${primaryAssessment.demographics.firstName}'s %</th>
                <th>${spouseAssessment.demographics.firstName}'s %</th>
                <th>Difference</th>
              </tr>
            </thead>
            <tbody>
              ${primarySectionsHtml}
            </tbody>
          </table>
        </div>
        
        <div class="section">
          <h2>Key Areas of Alignment</h2>
          <div class="profile-box">
            <ul>
              ${differenceAnalysis.strengthAreas.map(strength => `<li>${strength}</li>`).join('')}
            </ul>
          </div>
        </div>
        
        <div class="section">
          <h2>Growth Opportunities</h2>
          <div class="profile-box" style="border-left-color: #e74c3c;">
            <ul>
              ${differenceAnalysis.vulnerabilityAreas.map(area => `<li>${area}</li>`).join('')}
            </ul>
          </div>
        </div>
        
        <div class="section" style="background-color: #f0e6f6; padding: 20px; border-radius: 5px; border-left: 4px solid #8e44ad; margin-top: 25px;">
          <h2 style="margin-top: 0; color: #8e44ad;">Get Personalized Guidance</h2>
          <p>Would you like expert help interpreting your results together? Schedule a couple's consultation with Lawrence E. Adjah to discuss your assessment in detail and get personalized insights about strengthening your relationship.</p>
          <div style="text-align: center; margin-top: 15px;">
            <a href="https://lawrence-adjah.clientsecure.me/request/service" style="display: inline-block; background-color: #8e44ad; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Book Your Couple's Consultation</a>
          </div>
        </div>
        
        <div class="footer">
          <p>(c) 2025 Lawrence E. Adjah - The 100 Marriage Assessment - Series 1</p>
          <p>This assessment is designed to help you understand your relationship compatibility and identify areas for growth together.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

// Run the script
sendSampleReports();