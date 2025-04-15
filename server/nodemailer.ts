import nodemailer from 'nodemailer';
import { AssessmentResult } from '../shared/schema';
import { generateAssessmentPDF } from './pdf-generator';

// Interface for referral email data
interface ReferralEmailData {
  to: string;
  referrerName: string;
  referrerEmail: string;
  recipientName: string;
}

// Create a test account using Ethereal Email (for testing purposes)
async function createTestAccount() {
  const testAccount = await nodemailer.createTestAccount();
  return testAccount;
}

// Create reusable transporter
async function createTransporter() {
  const testAccount = await createTestAccount();
  
  // Create a SMTP transporter using Ethereal Email
  const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
      user: testAccount.user,
      pass: testAccount.pass,
    },
  });
  
  return { transporter, testAccount };
}

// Format the email HTML
function formatAssessmentEmail(assessment: AssessmentResult): string {
  const { name, scores, profile, demographics } = assessment;
  
  // Format sections scores
  const sectionsHtml = Object.entries(scores.sections)
    .map(([section, score]) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${section}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${score.earned}/${score.possible}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${score.percentage.toFixed(1)}%</td>
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
          <p class="overall-score">${scores.overallPercentage.toFixed(1)}%</p>
          <p>Total Score: ${scores.totalEarned}/${scores.totalPossible}</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 10px; font-size: 14px; color: #555;">
            <strong>Understanding Your Score:</strong> Your score reflects your perspectives on marriage, not a judgment of readiness.
            Higher percentages indicate more traditional viewpoints on relationships, while lower percentages suggest more progressive approaches.
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
          
          ${assessment.genderProfile ? `
          <h3 style="color: #8e44ad; margin-top: 20px;">
            ${assessment.demographics.gender === 'male' ? 'Male' : 'Female'}-Specific Profile: ${assessment.genderProfile.name}
          </h3>
          <div class="profile-box" style="border-left: 4px solid #8e44ad; padding-left: 15px;">
            <p>${assessment.genderProfile.description}</p>
          </div>
          ` : ''}
        </div>
        
        <div class="section" style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 25px;">
          <h2 style="margin-top: 0;">Next Steps</h2>
          <p>If you'd like to discuss your results further, you can schedule a 1-on-1 session here:</p>
          <p><a href="https://lawrence-adjah.clientsecure.me/request/service" style="color: #3498db; font-weight: bold; text-decoration: none;">Schedule a Consultation</a></p>
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

/**
 * Sends an assessment report email with PDF attachment using Nodemailer
 */
export async function sendAssessmentEmail(assessment: AssessmentResult, ccEmail: string = "la@lawrenceadjah.com"): Promise<{ success: boolean, previewUrl?: string }> {
  try {
    // Generate PDF report
    console.log('Generating PDF report...');
    const pdfBuffer = await generateAssessmentPDF(assessment);
    
    // Create transporter
    const { transporter, testAccount } = await createTransporter();
    
    // Format the email HTML content
    const emailHtml = formatAssessmentEmail(assessment);
    
    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"The 100 Marriage Assessment" <${testAccount.user}>`,
      to: assessment.email,
      cc: ccEmail, // Always CC the administrator by default
      subject: `${assessment.name} - The 100 Marriage Assessment - Series 1 Results`,
      html: emailHtml,
      attachments: [
        {
          filename: 'The-100-Marriage-Assessment-Series-1-Report.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    console.log(`Email with PDF attachment sent: ${info.messageId}`);
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    
    return { 
      success: true,
      previewUrl: nodemailer.getTestMessageUrl(info)
    };
  } catch (error) {
    console.error('Email error:', error);
    return { success: false };
  }
}

/**
 * Format the referral invitation email 
 */
function formatReferralEmail(data: ReferralEmailData): string {
  const { referrerName, recipientName } = data;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>You've Been Invited to The 100 Marriage Assessment</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 25px; }
        h1 { color: #2c3e50; }
        h2 { color: #3498db; margin-top: 20px; }
        .cta-button { 
          display: inline-block; 
          background-color: #e67e22; 
          color: white; 
          padding: 12px 24px; 
          text-decoration: none; 
          border-radius: 4px; 
          font-weight: bold; 
          margin: 15px 0;
        }
        .highlight-box { 
          background-color: #f8f9fa; 
          border-left: 4px solid #3498db; 
          padding: 15px; 
          margin: 15px 0; 
        }
        .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #7f8c8d; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>You've Been Invited to The 100 Marriage Assessment</h1>
        </div>
        
        <div class="section">
          <p>Dear ${recipientName},</p>
          <p>${referrerName} thought you might benefit from taking <strong>The 100 Marriage Assessment - Series 1</strong>, an innovative tool designed to help you understand your expectations in relationships and marriage.</p>
        </div>
        
        <div class="highlight-box">
          <h2 style="margin-top: 0;">What is The 100 Marriage Assessment?</h2>
          <p>
            Based on the best-selling book by Lawrence E. Adjah, this individual assessment helps you:
          </p>
          <ul>
            <li>Understand your expectations for dating, engagement, and marriage</li>
            <li>Discover your unique relationship approach and psychographic profile</li>
            <li>Identify potential areas of misalignment with your spouse or future spouse</li>
            <li>Gain clarity on what truly matters to you in a lifelong commitment</li>
            <li>Learn if you have traditional or progressive views on marriage and relationships</li>
            <li>Receive a personalized analysis of your results via email</li>
          </ul>
          <p><strong>Note:</strong> This is currently an individual assessment. The couples assessment option will be available soon!</p>
        </div>
        
        <div class="section" style="text-align: center;">
          <p>The assessment normally costs $49, but as an invited guest, you'll receive a special discount:</p>
          <h3 style="color: #e67e22; font-size: 24px;">Your Special Invitation Price: $39</h3>
          <p>Use code <strong>INVITED10</strong> at checkout</p>
          <a href="https://100marriage.com/assessment" class="cta-button">Take The Assessment Now</a>
          <p style="font-size: 14px; color: #7f8c8d; margin-top: 15px;">
            <strong>Couples Tip:</strong> Both you and your significant other can take your individual assessments and compare results to strengthen your relationship. Higher matching percentages indicate better alignment in your expectations!
          </p>
        </div>
        
        <div class="section">
          <h2>Why This Assessment Matters</h2>
          <p>
            The #1 reason relationships fail is misaligned expectations. This assessment helps you identify and address 
            potential misalignments before they become problems. Whether you're single, dating, engaged, or married, 
            clarity about your expectations is the first step toward a fulfilling relationship.
          </p>
        </div>
        
        <div class="footer">
          <p>(c) 2025 Lawrence E. Adjah - The 100 Marriage Assessment - Series 1</p>
          <p>You're receiving this because ${referrerName} invited you. If you believe this was sent in error, please disregard.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Sends a referral invitation email
 */
export async function sendReferralEmail(data: ReferralEmailData): Promise<{ success: boolean, previewUrl?: string }> {
  try {
    // Create transporter
    const { transporter, testAccount } = await createTransporter();
    
    // Format the email HTML content
    const emailHtml = formatReferralEmail(data);
    
    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"The 100 Marriage Assessment" <${testAccount.user}>`,
      to: data.to,
      subject: `${data.referrerName} invited you to take The 100 Marriage Assessment`,
      html: emailHtml,
    });

    console.log(`Referral invitation email sent: ${info.messageId}`);
    console.log(`Preview URL: ${nodemailer.getTestMessageUrl(info)}`);
    
    return { 
      success: true,
      previewUrl: nodemailer.getTestMessageUrl(info)
    };
  } catch (error) {
    console.error('Referral email error:', error);
    return { success: false };
  }
}