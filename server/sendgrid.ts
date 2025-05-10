/**
 * SendGrid email functionality for sending assessment reports
 */

import * as fs from 'fs';
import * as path from 'path';
import { MailService } from '@sendgrid/mail';
import type { AssessmentResult, CoupleAssessmentReport } from '../shared/schema';

// Set up SendGrid
if (!process.env.SENDGRID_API_KEY) {
  console.warn('Warning: SENDGRID_API_KEY environment variable is not set.');
}

const mailService = new MailService();
if (process.env.SENDGRID_API_KEY) {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

const SENDER_EMAIL = 'hello@wgodw.com';
const SENDER_NAME = 'The 100 Marriage Assessment';

/**
 * Formats the HTML email content for an individual assessment
 */
function formatAssessmentEmail(assessment: AssessmentResult): string {
  const strengths = assessment.scores.strengths.map(s => `<li>${s}</li>`).join('');
  const improvement = assessment.scores.improvementAreas.map(a => `<li>${a}</li>`).join('');
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
        }
        .header {
          background-color: #4A86E8;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 20px;
        }
        .section {
          margin-bottom: 20px;
        }
        h1 {
          margin: 0;
          font-size: 24px;
        }
        h2 {
          font-size: 20px;
          color: #4A86E8;
          margin-top: 30px;
        }
        .score {
          font-size: 48px;
          font-weight: bold;
          color: #4A86E8;
          text-align: center;
          margin: 20px 0;
        }
        .footer {
          font-size: 12px;
          text-align: center;
          margin-top: 40px;
          color: #666;
        }
        .button {
          display: inline-block;
          background-color: #4A86E8;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 4px;
          font-weight: bold;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Your 100 Marriage Assessment Report</h1>
      </div>
      
      <div class="content">
        <p>Hello ${assessment.name},</p>
        
        <p>Thank you for taking The 100 Marriage Assessment. We're excited to provide you with insights into your relationship preferences and values.</p>
        
        <div class="section">
          <h2>Your Overall Score</h2>
          <div class="score">${assessment.scores.overallPercentage.toFixed(1)}%</div>
        </div>
        
        <div class="section">
          <h2>Your Psychographic Profile: ${assessment.profile.name}</h2>
          <p>${assessment.profile.description}</p>
        </div>
        
        <div class="section">
          <h2>Your Relationship Strengths</h2>
          <ul>
            ${strengths}
          </ul>
        </div>
        
        <p>Your complete assessment report is attached to this email. In it, you'll find detailed insights about your preferences, compatibility with other profiles, and personalized recommendations.</p>
        
        <p style="text-align: center;">
          <a href="https://the100marriage.lawrenceadjah.com" class="button">Learn More</a>
        </p>
        
        <div class="footer">
          <p>© The 100 Marriage. All rights reserved.</p>
          <p>This report is based on your self-reported responses and is intended for informational purposes only.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Sends an individual assessment report email with PDF attachment
 * @param assessment The assessment result to send
 * @param pdfPath The path to the PDF file to attach
 * @returns Object containing success status and messageId if successful
 */
export async function sendAssessmentEmail(assessment: AssessmentResult, pdfPath: string): Promise<{ success: boolean, messageId?: string }> {
  if (!process.env.SENDGRID_API_KEY) {
    console.error('Cannot send email: SENDGRID_API_KEY environment variable is not set.');
    return { success: false };
  }
  
  try {
    const pdfContent = fs.readFileSync(pdfPath);
    const pdfFilename = path.basename(pdfPath);
    
    const htmlContent = formatAssessmentEmail(assessment);
    
    const msg = {
      to: assessment.email,
      from: {
        email: SENDER_EMAIL,
        name: SENDER_NAME
      },
      subject: 'Your 100 Marriage Assessment Report',
      html: htmlContent,
      attachments: [
        {
          content: pdfContent.toString('base64'),
          filename: pdfFilename,
          type: 'application/pdf',
          disposition: 'attachment'
        }
      ]
    };
    
    const response = await mailService.send(msg);
    
    if (response && response[0] && response[0].statusCode >= 200 && response[0].statusCode < 300) {
      console.log(`Email sent successfully to ${assessment.email}`);
      return { 
        success: true,
        messageId: response[0].headers['x-message-id'] as string
      };
    } else {
      console.error('Error sending email:', response);
      return { success: false };
    }
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false };
  }
}

/**
 * Formats the HTML email content for a couple assessment
 */
function formatCoupleAssessmentEmail(report: CoupleAssessmentReport): string {
  // Get names for email
  const primaryName = report.primary.demographics.firstName;
  const spouseName = report.spouse.demographics.firstName;
  
  // Extract compatibility
  const compatibility = report.compatibility || 0;
  const compatibilityDisplay = compatibility.toFixed(1);
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1">
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
        }
        .header {
          background-color: #4A86E8;
          color: white;
          padding: 20px;
          text-align: center;
        }
        .content {
          padding: 20px;
        }
        .section {
          margin-bottom: 20px;
        }
        h1 {
          margin: 0;
          font-size: 24px;
        }
        h2 {
          font-size: 20px;
          color: #4A86E8;
          margin-top: 30px;
        }
        .score {
          font-size: 48px;
          font-weight: bold;
          color: #4A86E8;
          text-align: center;
          margin: 20px 0;
        }
        .footer {
          font-size: 12px;
          text-align: center;
          margin-top: 40px;
          color: #666;
        }
        .button {
          display: inline-block;
          background-color: #4A86E8;
          color: white;
          padding: 12px 24px;
          text-decoration: none;
          border-radius: 4px;
          font-weight: bold;
          margin-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Your Couple Assessment Report</h1>
      </div>
      
      <div class="content">
        <p>Hello ${primaryName} & ${spouseName},</p>
        
        <p>Thank you for completing The 100 Marriage Couple Assessment. Your detailed analysis is ready!</p>
        
        <div class="section">
          <h2>Your Compatibility Score</h2>
          <div class="score">${compatibilityDisplay}%</div>
          <p style="text-align: center;">Based on your responses to the assessment questions</p>
        </div>
        
        <p>Your complete couple assessment report is attached to this email. In it, you'll find:</p>
        
        <ul>
          <li>Individual assessment summaries for both partners</li>
          <li>An analysis of your similarities and differences</li>
          <li>Areas of alignment and potential growth opportunities</li>
          <li>Personalized insights based on your relationship dynamics</li>
        </ul>
        
        <p>We encourage you to review this report together and use it as a tool for deeper conversations about your expectations and values.</p>
        
        <p style="text-align: center;">
          <a href="https://the100marriage.lawrenceadjah.com" class="button">Learn More</a>
        </p>
        
        <div class="footer">
          <p>© The 100 Marriage. All rights reserved.</p>
          <p>This report is based on your self-reported responses and is intended for informational purposes only.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Sends a couple assessment report email with PDF attachment
 * @param report The couple assessment report
 * @param pdfPath The path to the PDF file to attach
 * @returns Object containing success status and messageId if successful
 */
export async function sendCoupleAssessmentEmail(report: CoupleAssessmentReport, pdfPath: string): Promise<{ success: boolean, messageId?: string }> {
  if (!process.env.SENDGRID_API_KEY) {
    console.error('Cannot send email: SENDGRID_API_KEY environment variable is not set.');
    return { success: false };
  }
  
  try {
    const pdfContent = fs.readFileSync(pdfPath);
    const pdfFilename = path.basename(pdfPath);
    
    // Get emails from both partners
    const primaryEmail = report.primary.email;
    const spouseEmail = report.spouse.email;
    
    // Format names for the email
    const primaryName = report.primary.demographics.firstName;
    const spouseName = report.spouse.demographics.firstName;
    
    const htmlContent = formatCoupleAssessmentEmail(report);
    
    const msg = {
      to: [primaryEmail, spouseEmail], // Send to both partners
      from: {
        email: SENDER_EMAIL,
        name: SENDER_NAME
      },
      subject: `${primaryName} & ${spouseName} - Couple Assessment Report - The 100 Marriage`,
      html: htmlContent,
      attachments: [
        {
          content: pdfContent.toString('base64'),
          filename: 'The-100-Marriage-Couple-Assessment-Report.pdf',
          type: 'application/pdf',
          disposition: 'attachment'
        }
      ]
    };
    
    const response = await mailService.send(msg);
    
    if (response && response[0] && response[0].statusCode >= 200 && response[0].statusCode < 300) {
      console.log(`Couple assessment email sent successfully to ${primaryEmail} and ${spouseEmail}`);
      return { 
        success: true,
        messageId: response[0].headers['x-message-id'] as string
      };
    } else {
      console.error('Error sending couple assessment email:', response);
      return { success: false };
    }
  } catch (error) {
    console.error('Error sending couple assessment email:', error);
    return { success: false };
  }
}