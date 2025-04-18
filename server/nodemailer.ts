import nodemailer from 'nodemailer';
import { AssessmentResult, CoupleAssessmentReport } from '../shared/schema';
import { generateIndividualAssessmentPDF } from './updated-individual-pdf';
import { generateCoupleAssessmentPDF } from './updated-couple-pdf';
import { formatCoupleAssessmentEmail } from './couple-email-template';
import { formatCoupleInvitationEmail } from './couple-invitation-template';

// Interface for referral email data
interface ReferralEmailData {
  to: string;
  referrerName: string;
  referrerEmail: string;
  recipientName: string;
}

// Interface for couple invitation email data
interface CoupleInvitationData {
  primaryEmail: string;
  primaryName?: string;
  spouseEmail: string;
  spouseName?: string;
  coupleId: string;
}

// Create a test account using Ethereal Email (for testing purposes)
async function createTestAccount() {
  const testAccount = await nodemailer.createTestAccount();
  return testAccount;
}

// Create reusable transporter
async function createTransporter() {
  // Always use Ethereal Email for testing
  console.log("Using Ethereal Email for test email delivery");
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
          
          ${assessment.genderProfile ? `
          <h3 style="color: #8e44ad; margin-top: 20px;">
            ${assessment.demographics.gender === 'male' ? 'Male' : 'Female'}-Specific Profile: ${assessment.genderProfile.name}
          </h3>
          <div class="profile-box" style="border-left: 4px solid #8e44ad; padding-left: 15px;">
            <p>${assessment.genderProfile.description}</p>
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

/**
 * Sends an assessment report email with PDF attachment using Nodemailer
 */
export async function sendAssessmentEmail(assessment: AssessmentResult, ccEmail: string = "la@lawrenceadjah.com"): Promise<{ success: boolean, previewUrl?: string }> {
  try {
    // Generate PDF report
    console.log('Generating PDF report...');
    const pdfBuffer = await generateIndividualAssessmentPDF(assessment);
    
    // Create transporter
    const { transporter, testAccount } = await createTransporter();
    
    // Format the email HTML content
    const emailHtml = formatAssessmentEmail(assessment);
    
    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"The 100 Marriage Assessment" <hello@wgodw.com>`,
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
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`Preview URL: ${previewUrl}`);
    
    return { 
      success: true,
      previewUrl: previewUrl ? previewUrl : undefined
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
            <li>Learn if you have traditional or less traditional views on marriage and relationships</li>
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
      from: `"The 100 Marriage Assessment" <hello@wgodw.com>`,
      to: data.to,
      subject: `${data.referrerName} invited you to take The 100 Marriage Assessment`,
      html: emailHtml,
    });

    console.log(`Referral invitation email sent: ${info.messageId}`);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`Preview URL: ${previewUrl}`);
    
    return { 
      success: true,
      previewUrl: previewUrl ? previewUrl : undefined
    };
  } catch (error) {
    console.error('Referral email error:', error);
    return { success: false };
  }
}

/**
 * Sends invitation emails to both partners for a couple assessment
 */
export async function sendCoupleInvitationEmails(
  data: CoupleInvitationData,
  ccEmail: string = "la@lawrenceadjah.com"
): Promise<{ success: boolean, previewUrls?: string[] }> {
  try {
    // Create transporter
    const { transporter, testAccount } = await createTransporter();
    
    // Format email content for primary partner
    const primaryEmailHtml = formatCoupleInvitationEmail(
      data.primaryName || "Primary Partner",
      data.spouseName || "Your significant other",
      data.coupleId,
      true // isForPrimary = true
    );
    
    // Format email content for spouse
    const spouseEmailHtml = formatCoupleInvitationEmail(
      data.primaryName || "Your significant other",
      data.spouseName || "Invited Partner",
      data.coupleId,
      false // isForPrimary = false
    );
    
    // Send email to primary partner
    const primaryInfo = await transporter.sendMail({
      from: `"The 100 Marriage Assessment" <hello@wgodw.com>`,
      to: data.primaryEmail,
      cc: ccEmail,
      subject: "Your Couple Assessment Has Been Started",
      html: primaryEmailHtml,
    });
    
    // Send email to spouse
    const spouseInfo = await transporter.sendMail({
      from: `"The 100 Marriage Assessment" <hello@wgodw.com>`,
      to: data.spouseEmail,
      cc: ccEmail,
      subject: "You've Been Invited to Take the 100 Marriage Assessment",
      html: spouseEmailHtml,
    });
    
    console.log(`Primary invitation email sent: ${primaryInfo.messageId}`);
    console.log(`Spouse invitation email sent: ${spouseInfo.messageId}`);
    
    const primaryPreviewUrl = nodemailer.getTestMessageUrl(primaryInfo);
    const spousePreviewUrl = nodemailer.getTestMessageUrl(spouseInfo);
    
    console.log(`Primary preview URL: ${primaryPreviewUrl}`);
    console.log(`Spouse preview URL: ${spousePreviewUrl}`);
    
    return { 
      success: true,
      previewUrls: [
        primaryPreviewUrl ? primaryPreviewUrl : undefined, 
        spousePreviewUrl ? spousePreviewUrl : undefined
      ].filter(Boolean) as string[]
    };
  } catch (error) {
    console.error('Couple invitation email error:', error);
    return { success: false };
  }
}

/**
 * Sends a couple assessment report email with PDF attachment
 */
export async function sendCoupleAssessmentEmail(
  report: CoupleAssessmentReport, 
  ccEmail: string = "la@lawrenceadjah.com"
): Promise<{ success: boolean, previewUrl?: string }> {
  try {
    // Generate PDF report
    console.log('Generating couple assessment PDF report...');
    const pdfBuffer = await generateCoupleAssessmentPDF(report);
    
    // Format couple email
    const emailHtml = formatCoupleAssessmentEmail(report);
    
    // Get emails from both partners
    const primaryEmail = report.primaryAssessment.email;
    const spouseEmail = report.spouseAssessment.email;
    
    // Format names for the email
    const primaryName = report.primaryAssessment.demographics.firstName;
    const spouseName = report.spouseAssessment.demographics.firstName;
    
    // Create transporter
    const { transporter, testAccount } = await createTransporter();
    
    // Send mail with defined transport object to both partners
    const info = await transporter.sendMail({
      from: `"The 100 Marriage Assessment" <hello@wgodw.com>`,
      to: [primaryEmail, spouseEmail].join(', '), // Send to both partners
      cc: ccEmail, // Always CC the administrator
      subject: `${primaryName} & ${spouseName} - Couple Assessment Report - The 100 Marriage`,
      html: emailHtml,
      attachments: [
        {
          filename: 'The-100-Marriage-Couple-Assessment-Report.pdf',
          content: pdfBuffer,
          contentType: 'application/pdf',
        },
      ],
    });

    console.log(`Couple assessment email with PDF attachment sent: ${info.messageId}`);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`Preview URL: ${previewUrl}`);
    
    return { 
      success: true,
      previewUrl: previewUrl ? previewUrl : undefined
    };
  } catch (error) {
    console.error('Couple email error:', error);
    return { success: false };
  }
}