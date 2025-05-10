import nodemailer from 'nodemailer';
import sgMail from '@sendgrid/mail';
import { AssessmentResult, CoupleAssessmentReport, PaymentTransaction } from '../shared/schema';
import { generateIndividualAssessmentPDF } from './updated-individual-pdf';
import { generateCoupleAssessmentPDF } from './updated-couple-pdf';
import { formatCoupleAssessmentEmail } from './couple-email-template';
import { formatCoupleInvitationEmail } from './couple-invitation-template';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';
import os from 'os';

// Initialize SendGrid if API key is available
if (process.env.SENDGRID_API_KEY) {
  console.log('Initializing SendGrid...');
  sgMail.setApiKey(process.env.SENDGRID_API_KEY);
}

// Interface for referral email data
interface ReferralEmailData {
  to: string;
  referrerName: string;
  referrerEmail: string;
  recipientName: string;
  promoCode?: string;
}

// Interface for couple invitation email data
interface CoupleInvitationData {
  primaryEmail: string;
  primaryName?: string;
  spouseEmail: string;
  spouseName?: string;
  coupleId: string;
}

// Create reusable transporter
async function createTransporter() {
  // Always create a fallback Ethereal Email account for testing
  console.log("Setting up email transport...");
  const testAccount = await nodemailer.createTestAccount();
  
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
  
  if (process.env.SENDGRID_API_KEY) {
    // We'll still prefer SendGrid when available, but we have a backup transporter
    console.log("SendGrid API key found - will attempt to use SendGrid first");
  } else {
    console.log("Using Ethereal Email for test email delivery (no SendGrid API key found)");
  }
  
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
        <td style="padding: 8px; border: 1px solid #ddd;">${score.percentage.toFixed(1).replace('.0', '')}%</td>
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
          <p class="overall-score">${scores.overallPercentage.toFixed(1).replace('.0', '')}%</p>
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
            <a href="https://the100marriage.lawrenceadjah.com/consultation" style="display: inline-block; background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Book Your Consultation Now</a>
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
 * Sends an assessment report email with PDF attachment
 * Uses SendGrid when available, falls back to Nodemailer
 */
export async function sendAssessmentEmail(assessment: AssessmentResult): Promise<{ success: boolean, previewUrl?: string }> {
  try {
    // Generate PDF report
    console.log('Generating PDF report...');
    const pdfBuffer = await generateIndividualAssessmentPDF(assessment);
    console.log('PDF generation successful, size: ', pdfBuffer.length);
    
    // Save PDF to a temporary file
    const tempDir = path.join(os.tmpdir(), 'the100marriage');
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }
    const pdfPath = path.join(tempDir, `${assessment.id || uuidv4()}-assessment.pdf`);
    fs.writeFileSync(pdfPath, pdfBuffer);
    console.log(`PDF saved to temporary file: ${pdfPath}`);
    
    // Use SendGrid for sending email
    if (process.env.SENDGRID_API_KEY) {
      console.log('Using SendGrid for assessment email');
      
      // Import and use the SendGrid module
      const sendGridResult = await import('./sendgrid').then(module => 
        module.sendAssessmentEmail(assessment, pdfPath)
      );
      
      // Clean up temporary file
      try {
        fs.unlinkSync(pdfPath);
      } catch (e) {
        console.warn('Could not remove temporary PDF file:', e);
      }
      
      return { 
        success: sendGridResult.success,
        messageId: sendGridResult.messageId
      };
    }
    
    // Fallback to Nodemailer (test emails) ONLY if SendGrid is not available
    console.warn('SENDGRID_API_KEY not set, falling back to Nodemailer (test only)');
    const { transporter, testAccount } = await createTransporter();
    
    if (!transporter) {
      console.error('No email transport available');
      return { success: false };
    }
    
    // Format the email HTML content
    const emailHtml = formatAssessmentEmail(assessment);
    
    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"The 100 Marriage Assessment" <hello@wgodw.com>`,
      to: assessment.email,
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
    
    // Clean up temporary file
    try {
      fs.unlinkSync(pdfPath);
    } catch (e) {
      console.warn('Could not remove temporary PDF file:', e);
    }
    
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
 * Format a payment notification email
 */
function formatPaymentNotificationEmail(transaction: PaymentTransaction): string {
  // Extract product type and format it nicely
  const productType = transaction.productType === 'couple' ? 'Couple Assessment' : 'Individual Assessment';
  
  // Format amount as dollars
  const amount = (transaction.amount / 100).toFixed(2);
  
  // Format date
  const date = new Date(transaction.created);
  const formattedDate = date.toLocaleString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  });
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>New Payment Notification - The 100 Marriage Assessment</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 25px; }
        h1 { color: #2c3e50; }
        h2 { color: #3498db; margin-top: 20px; }
        .highlight-box { 
          background-color: #f8f9fa; 
          border-left: 4px solid #3498db; 
          padding: 15px; 
          margin: 15px 0; 
        }
        .details-table { 
          width: 100%; 
          border-collapse: collapse; 
          margin: 15px 0; 
        }
        .details-table th { 
          background-color: #3498db; 
          color: white; 
          text-align: left; 
          padding: 10px; 
        }
        .details-table td, .details-table th { 
          border: 1px solid #ddd; 
          padding: 8px; 
        }
        .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #7f8c8d; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>New Payment Notification</h1>
        </div>
        
        <div class="section">
          <p>A new payment has been processed for The 100 Marriage Assessment.</p>
        </div>
        
        <div class="highlight-box">
          <h2 style="margin-top: 0;">Payment Details</h2>
          <table class="details-table">
            <tr>
              <td><strong>Product:</strong></td>
              <td>${productType}</td>
            </tr>
            <tr>
              <td><strong>Amount:</strong></td>
              <td>$${amount} ${transaction.currency.toUpperCase()}</td>
            </tr>
            <tr>
              <td><strong>Date:</strong></td>
              <td>${formattedDate}</td>
            </tr>
            <tr>
              <td><strong>Status:</strong></td>
              <td>${transaction.status.toUpperCase()}</td>
            </tr>
            <tr>
              <td><strong>Customer Email:</strong></td>
              <td>${transaction.customerEmail || 'Not provided'}</td>
            </tr>
            <tr>
              <td><strong>Stripe Transaction ID:</strong></td>
              <td>${transaction.stripeId}</td>
            </tr>
          </table>
        </div>
        
        <div class="section">
          <p>
            You can view the full transaction details in your admin dashboard at
            <a href="https://the100marriage.lawrenceadjah.com/admin">https://the100marriage.lawrenceadjah.com/admin</a>
          </p>
        </div>
        
        <div class="footer">
          <p>(c) 2025 Lawrence E. Adjah - The 100 Marriage Assessment - Series 1</p>
          <p>This is an automated notification. Please do not reply to this email.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Sends a payment notification email
 * Uses SendGrid when available, falls back to Nodemailer
 */
export async function sendNotificationEmail(transaction: PaymentTransaction): Promise<{ success: boolean, previewUrl?: string }> {
  try {
    // Format the email HTML content
    const emailHtml = formatPaymentNotificationEmail(transaction);
    
    // Use SendGrid for sending email (primary method)
    if (process.env.SENDGRID_API_KEY) {
      console.log('Using SendGrid for payment notification email');
      
      // Create and send message directly with SendGrid
      const msg = {
        to: 'lawrence@lawrenceadjah.com', // Always send to Lawrence
        from: {
          email: 'hello@wgodw.com',
          name: 'The 100 Marriage Assessment'
        },
        subject: `New Payment: $${(transaction.amount / 100).toFixed(2)} - ${transaction.productType} Assessment`,
        html: emailHtml,
      };
      
      try {
        const response = await sgMail.send(msg);
        
        if (response && response[0] && response[0].statusCode >= 200 && response[0].statusCode < 300) {
          console.log(`Payment notification email sent successfully to Lawrence`);
          return { 
            success: true,
            messageId: response[0].headers['x-message-id'] as string
          };
        } else {
          console.error('Error sending payment notification email with SendGrid:', response);
          // Fall through to nodemailer fallback
        }
      } catch (sendGridError) {
        console.error('SendGrid payment notification email error:', sendGridError);
        // Fall through to nodemailer fallback
      }
    }
    
    console.warn('SENDGRID_API_KEY not set or SendGrid failed, falling back to Nodemailer (test only)');
    
    // Fallback to Nodemailer (test emails)
    const { transporter, testAccount } = await createTransporter();
    
    if (!transporter) {
      console.error('No email transport available');
      return { success: false };
    }
    
    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"The 100 Marriage Assessment" <hello@wgodw.com>`,
      to: 'lawrence@lawrenceadjah.com', // Always send to Lawrence
      subject: `New Payment: $${(transaction.amount / 100).toFixed(2)} - ${transaction.productType} Assessment`,
      html: emailHtml,
    });

    console.log(`Payment notification email sent: ${info.messageId}`);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`Preview URL: ${previewUrl}`);
    
    return { 
      success: true,
      previewUrl: previewUrl ? previewUrl : undefined
    };
  } catch (error) {
    console.error('Payment notification email error:', error);
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
          <p>Use code <strong>${data.promoCode || 'INVITED10'}</strong> at checkout</p>
          <a href="https://the100marriage.lawrenceadjah.com/assessment" class="cta-button">Take The Assessment Now</a>
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
 * Uses SendGrid when available, falls back to Nodemailer
 */
export async function sendReferralEmail(data: ReferralEmailData): Promise<{ success: boolean, previewUrl?: string }> {
  try {
    // Format the email HTML content
    const emailHtml = formatReferralEmail(data);
    
    // If we have a SendGrid API key, use SendGrid directly
    if (process.env.SENDGRID_API_KEY) {
      try {
        console.log('Using SendGrid for referral email');
        
        // Send mail with SendGrid using the initialized instance
        const verifiedSender = {
          email: 'hello@wgodw.com',
          name: 'The 100 Marriage Assessment'
        };
        
        const msg = {
          to: data.to,
          from: verifiedSender,
          subject: `${data.referrerName} invited you to take The 100 Marriage Assessment`,
          html: emailHtml
        };
        
        await sgMail.send(msg);
        console.log(`SendGrid referral email sent to ${data.to}`);
        
        return { 
          success: true
        };
      } catch (sendgridError) {
        console.error('SendGrid referral email error:', sendgridError);
        console.log('Falling back to Nodemailer...');
        // Continue with Nodemailer fallback
      }
    }
    
    // Fallback to Nodemailer (test emails)
    // Create transporter
    const { transporter, testAccount } = await createTransporter();
    
    if (!transporter) {
      console.error('No email transport available');
      return { success: false };
    }
    
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
// Interface for assessment reminder email
interface AssessmentReminderData {
  to: string;
  customerName: string;
  assessmentType: 'individual' | 'couple';
  purchaseDate: string;
  transactionId: string;
}

/**
 * Format the assessment reminder email for users who haven't completed their assessment
 */
function formatAssessmentReminderEmail(data: AssessmentReminderData): string {
  const { customerName, assessmentType, purchaseDate } = data;
  
  // Format purchase date
  const date = new Date(purchaseDate);
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  
  // Customize message based on assessment type
  const assessmentTypeText = assessmentType === 'couple' ? 'Couple Assessment' : 'Individual Assessment';
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Complete Your 100 Marriage Assessment</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; }
        .container { padding: 20px; }
        .header { margin-bottom: 30px; }
        .section { margin-bottom: 25px; }
        h1 { color: #2c3e50; }
        h2 { color: #3498db; margin-top: 20px; }
        .cta-button { 
          display: inline-block; 
          background-color: #3498db; 
          color: white !important; 
          padding: 12px 24px; 
          text-decoration: none; 
          border-radius: 4px; 
          font-weight: bold; 
          margin: 15px 0;
        }
        .reminder-box { 
          background-color: #fff8e1; 
          border-left: 4px solid #ffc107; 
          padding: 15px; 
          margin: 15px 0; 
        }
        .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #7f8c8d; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Your 100 Marriage Assessment Is Waiting For You</h1>
        </div>
        
        <div class="section">
          <p>Dear ${customerName},</p>
          <p>We noticed that you purchased The 100 Marriage Assessment - Series 1 (${assessmentTypeText}) on ${formattedDate}, but you haven't completed the assessment yet.</p>
        </div>
        
        <div class="reminder-box">
          <h2 style="margin-top: 0; color: #f39c12;">Your Assessment is Ready to Complete</h2>
          <p>You've already paid for this valuable assessment, and we're excited for you to experience the clarity and insights it provides.</p>
          <p><strong>Benefits of completing your assessment:</strong></p>
          <ul>
            <li>Discover your unique psychographic profile</li>
            <li>Understand your expectations in relationships and marriage</li>
            <li>Identify your relationship strengths and areas for growth</li>
            <li>Receive a beautiful, detailed PDF report of your results</li>
          </ul>
        </div>
        
        <div class="section" style="text-align: center;">
          <a href="https://the100marriage.lawrenceadjah.com/assessment" class="cta-button">Complete My Assessment Now</a>
          <p style="font-size: 14px; color: #7f8c8d; margin-top: 5px;">Takes just 15-20 minutes to complete</p>
        </div>
        
        <div class="section">
          <p>If you have any questions or need assistance, please reply to this email or contact us at <a href="mailto:support@the100marriage.lawrenceadjah.com">support@the100marriage.lawrenceadjah.com</a>.</p>
          <p>We're looking forward to providing you with valuable insights about your relationship expectations!</p>
          <p>Warmly,<br>The 100 Marriage Assessment Team</p>
        </div>
        
        <div class="footer">
          <p>(c) 2025 Lawrence E. Adjah - The 100 Marriage Assessment - Series 1</p>
          <p>This email was sent because you purchased The 100 Marriage Assessment but haven't completed it yet.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Sends an assessment reminder email to users who haven't completed their assessment
 * Uses SendGrid when available, falls back to Nodemailer
 */
export async function sendAssessmentReminder(data: AssessmentReminderData): Promise<{ success: boolean, previewUrl?: string }> {
  try {
    // Format the email HTML content
    const emailHtml = formatAssessmentReminderEmail(data);
    
    // If we have a SendGrid API key, use SendGrid directly
    if (process.env.SENDGRID_API_KEY) {
      try {
        console.log('Using SendGrid for assessment reminder email');
        
        // Send mail with SendGrid using the initialized instance
        const verifiedSender = {
          email: 'hello@wgodw.com',
          name: 'The 100 Marriage Assessment'
        };
        
        const msg = {
          to: data.to,
          from: verifiedSender,
          subject: `Don't Miss Out - Complete Your 100 Marriage Assessment`,
          html: emailHtml
        };
        
        await sgMail.send(msg);
        console.log(`SendGrid assessment reminder email sent to ${data.to}`);
        
        return { 
          success: true
        };
      } catch (sendgridError) {
        console.error('SendGrid assessment reminder email error:', sendgridError);
        console.log('Falling back to Nodemailer...');
        // Continue with Nodemailer fallback
      }
    }
    
    // Fallback to Nodemailer (test emails)
    // Create transporter
    const { transporter, testAccount } = await createTransporter();
    
    if (!transporter) {
      console.error('No email transport available');
      return { success: false };
    }
    
    // Send mail with defined transport object
    const info = await transporter.sendMail({
      from: `"The 100 Marriage Assessment" <reminders@wgodw.com>`,
      to: data.to,
      subject: `Don't Miss Out - Complete Your 100 Marriage Assessment`,
      html: emailHtml,
    });

    console.log(`Assessment reminder email sent: ${info.messageId}`);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    console.log(`Preview URL: ${previewUrl}`);
    
    return { 
      success: true,
      previewUrl: previewUrl ? previewUrl : undefined
    };
  } catch (error) {
    console.error('Assessment reminder email error:', error);
    return { success: false };
  }
}

/**
 * Sends invitation emails to both partners for a couple assessment
 * Uses SendGrid when available, falls back to Nodemailer
 */
export async function sendCoupleInvitationEmails(
  data: CoupleInvitationData
): Promise<{ success: boolean, previewUrls?: string[] }> {
  try {
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
    
    // If we have a SendGrid API key, use SendGrid directly
    if (process.env.SENDGRID_API_KEY) {
      try {
        console.log('Using SendGrid for couple invitation emails');
        
        // Send emails with SendGrid using the initialized instance
        const verifiedSender = {
          email: 'hello@wgodw.com',
          name: 'The 100 Marriage Assessment'
        };
        
        const primaryMsg = {
          to: data.primaryEmail,
          from: verifiedSender,
          subject: "Your Couple Assessment Has Been Started",
          html: primaryEmailHtml
        };
        
        const spouseMsg = {
          to: data.spouseEmail,
          from: verifiedSender,
          subject: "You've Been Invited to Take the 100 Marriage Assessment",
          html: spouseEmailHtml
        };
        
        await sgMail.send(primaryMsg);
        await sgMail.send(spouseMsg);
        
        console.log(`SendGrid primary invitation email sent to ${data.primaryEmail}`);
        console.log(`SendGrid spouse invitation email sent to ${data.spouseEmail}`);
        
        return { 
          success: true
        };
      } catch (sendgridError) {
        console.error('SendGrid couple invitation email error:', sendgridError);
        console.log('Falling back to Nodemailer...');
        // Continue with Nodemailer fallback
      }
    }
    
    // Fallback to Nodemailer (test emails)
    // Create transporter
    const { transporter, testAccount } = await createTransporter();
    
    if (!transporter) {
      console.error('No email transport available');
      return { success: false };
    }
    
    // Send email to primary partner
    const primaryInfo = await transporter.sendMail({
      from: `"The 100 Marriage Assessment" <hello@wgodw.com>`,
      to: data.primaryEmail,
      subject: "Your Couple Assessment Has Been Started",
      html: primaryEmailHtml,
    });
    
    // Send email to spouse
    const spouseInfo = await transporter.sendMail({
      from: `"The 100 Marriage Assessment" <hello@wgodw.com>`,
      to: data.spouseEmail,
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
 * Uses SendGrid when available, falls back to Nodemailer
 */
export async function sendCoupleAssessmentEmail(
  report: CoupleAssessmentReport
): Promise<{ success: boolean, previewUrl?: string }> {
  try {
    // Generate PDF report
    console.log('Generating couple assessment PDF report...');
    const pdfBuffer = await generateCoupleAssessmentPDF(report);
    
    // Format couple email
    const emailHtml = formatCoupleAssessmentEmail(report);
    
    // Get emails from both partners
    const primaryEmail = report.primary.email;
    const spouseEmail = report.spouse.email;
    
    // Format names for the email
    const primaryName = report.primary.demographics.firstName;
    const spouseName = report.spouse.demographics.firstName;
    
    // If we have a SendGrid API key, use SendGrid directly
    if (process.env.SENDGRID_API_KEY) {
      try {
        console.log('Using SendGrid for couple assessment email');
        
        // Send mail with SendGrid using the initialized instance
        const verifiedSender = {
          email: 'hello@wgodw.com',
          name: 'The 100 Marriage Assessment'
        };
        
        const msg = {
          to: [primaryEmail, spouseEmail], // Send to both partners
          from: verifiedSender,
          subject: `${primaryName} & ${spouseName} - Couple Assessment Report - The 100 Marriage`,
          html: emailHtml,
          attachments: [
            {
              content: pdfBuffer.toString('base64'),
              filename: 'The-100-Marriage-Couple-Assessment-Report.pdf',
              type: 'application/pdf',
              disposition: 'attachment'
            }
          ]
        };
        
        await sgMail.send(msg);
        console.log(`SendGrid couple assessment email with PDF attachment sent to ${primaryEmail} and ${spouseEmail}`);
        
        return { 
          success: true
        };
      } catch (sendgridError) {
        console.error('SendGrid couple assessment email error:', sendgridError);
        console.log('Falling back to Nodemailer...');
        // Continue with Nodemailer fallback
      }
    }
    
    // Fallback to Nodemailer (test emails)
    // Create transporter
    const { transporter, testAccount } = await createTransporter();
    
    if (!transporter) {
      console.error('No email transport available');
      return { success: false };
    }
    
    // Send mail with defined transport object to both partners
    const info = await transporter.sendMail({
      from: `"The 100 Marriage Assessment" <hello@wgodw.com>`,
      to: [primaryEmail, spouseEmail].join(', '), // Send to both partners
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