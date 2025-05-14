/**
 * SendGrid email functionality for sending assessment reports
 */

import * as fs from 'fs';
import * as path from 'path';
import { MailService } from '@sendgrid/mail';
import type { AssessmentResult, CoupleAssessmentReport, DemographicData } from '../shared/schema';
import { formatCoupleAssessmentEmail as formatSharedCoupleEmail } from './couple-email-template';

// Set up SendGrid
if (!process.env.SENDGRID_API_KEY) {
  console.warn('Warning: SENDGRID_API_KEY environment variable is not set.');
}

const mailService = new MailService();
if (process.env.SENDGRID_API_KEY) {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

// Make constants available for export/testing
export const SENDER_EMAIL = 'hello@wgodw.com';
export const SENDER_NAME = 'The 100 Marriage Assessment';
export const ADMIN_EMAIL = 'lawrence@lawrenceadjah.com'; // Admin email for notifications

/**
 * Sends an individual assessment report email with PDF attachment
 * @param assessment The assessment result to send
 * @param pdfPath The path to the PDF file to attach
 * @returns Object containing success status and messageId if successful
 */
export async function sendAssessmentEmail(assessment: AssessmentResult, pdfPath: string): Promise<{ success: boolean, messageId?: string, error?: string }> {
  if (!process.env.SENDGRID_API_KEY) {
    console.error('Cannot send email: SENDGRID_API_KEY environment variable is not set.');
    return { success: false, error: 'SendGrid API key not set' };
  }
  
  try {
    const pdfContent = fs.readFileSync(pdfPath);
    const pdfFilename = path.basename(pdfPath);
    
    // Handle missing or invalid email addresses
    if (!assessment.email && (!assessment.demographics || !assessment.demographics.email)) {
      console.error('Cannot send assessment email: no email address provided');
      return { success: false, error: 'No email address provided' };
    }
    
    // Get email from assessment (prefer assessment.email but fall back to demographics.email)
    const recipientEmail = assessment.email || (assessment.demographics && assessment.demographics.email);
    
    // Format name for email
    const name = assessment.name || (assessment.demographics && 
      (assessment.demographics.firstName + ' ' + (assessment.demographics.lastName || '')).trim()) || 
      'Valued Customer';
    
    const htmlContent = formatAssessmentEmail(assessment);
    
    const msg = {
      to: recipientEmail,
      from: {
        email: SENDER_EMAIL,
        name: SENDER_NAME
      },
      subject: `${name} - Your 100 Marriage Assessment Results`,
      html: htmlContent,
      attachments: [
        {
          content: pdfContent.toString('base64'),
          filename: 'The-100-Marriage-Individual-Assessment.pdf',
          type: 'application/pdf',
          disposition: 'attachment'
        }
      ]
    };
    
    const response = await mailService.send(msg);
    
    // Verify response and return success
    if (response && response[0] && response[0].statusCode >= 200 && response[0].statusCode < 300) {
      console.log(`Assessment email sent successfully to ${recipientEmail}`);
      return { 
        success: true,
        messageId: response[0].headers['x-message-id'] as string
      };
    } else {
      console.error('Error sending assessment email:', response);
      return { success: false, error: 'SendGrid API error' };
    }
  } catch (error: any) {
    console.error('Error sending assessment email:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Formats an individual assessment email
 */
function formatAssessmentEmail(assessment: AssessmentResult): string {
  // Extract key information
  const name = assessment.name || (assessment.demographics && 
    (assessment.demographics.firstName + ' ' + (assessment.demographics.lastName || '')).trim()) || 
    'Valued Customer';
  
  // Safe access to first name
  const firstName = assessment.demographics?.firstName || name.split(' ')[0] || 'there';
  
  const overallScore = assessment.overallScore || 0;
  const formattedScore = overallScore.toFixed(1);
  
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
          color: #666;
          padding: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>The 100 Marriage Assessment</h1>
      </div>
      
      <div class="content">
        <div class="section">
          <p>Hello ${firstName},</p>
          <p>Thank you for completing The 100 Marriage Assessment. Your personalized results are attached to this email as a PDF file.</p>
        </div>
        
        <div class="section">
          <h2>Your Overall Score</h2>
          <div class="score">${formattedScore}%</div>
        </div>
        
        <div class="section">
          <h2>What's Next?</h2>
          <p>We recommend you:</p>
          <ol>
            <li>Review your detailed report attached to this email</li>
            <li>Consider your key strengths and areas for growth</li>
            <li>Use "The 100 Marriage" book as a guide to explore areas where you want to improve</li>
          </ol>
        </div>
        
        <div class="section">
          <p>If you have any questions about your assessment results or would like further guidance, please don't hesitate to reach out.</p>
          <p>Wishing you the best on your journey!</p>
        </div>
      </div>
      
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} The 100 Marriage Assessment | <a href="https://the100marriage.lawrenceadjah.com">Visit Our Website</a></p>
      </div>
    </body>
    </html>
  `;
}

/**
 * Formats the HTML email content for a couple assessment
 */
function formatCoupleAssessmentEmail(report: CoupleAssessmentReport): string {
  try {
    // Use the shared email template for consistency
    return formatSharedCoupleEmail(report);
  } catch (error) {
    console.error('Error using shared email template, falling back to basic template:', error);
    
    // Handle both old and new property paths
    const primary = report.primaryAssessment || report.primary;
    const spouse = report.spouseAssessment || report.spouse;
    
    // Safe access to names
    const primaryName = primary?.demographics?.firstName || primary?.name?.split(' ')[0] || 'Partner 1';
    const spouseName = spouse?.demographics?.firstName || spouse?.name?.split(' ')[0] || 'Partner 2';
    
    // Extract compatibility with fallback
    const compatibility = report.overallCompatibility || report.compatibilityScore || 0;
    const compatibilityDisplay = compatibility.toFixed(1);
    
    // Fallback basic template
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
          color: #666;
          padding: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>The 100 Marriage Assessment</h1>
      </div>
      
      <div class="content">
        <div class="section">
          <p>Hello ${primaryName} & ${spouseName},</p>
          <p>Thank you for completing The 100 Marriage Couple Assessment. Your personalized results are attached to this email as a PDF file.</p>
        </div>
        
        <div class="section">
          <h2>Your Compatibility Score</h2>
          <div class="score">${compatibilityDisplay}%</div>
        </div>
        
        <div class="section">
          <h2>What's Next?</h2>
          <p>We recommend you:</p>
          <ol>
            <li>Review your detailed report attached to this email together</li>
            <li>Discuss your areas of alignment and differences</li>
            <li>Use "The 100 Marriage" book as a guide for meaningful conversations</li>
          </ol>
        </div>
        
        <div class="section">
          <p>If you have any questions about your assessment results or would like further guidance, please don't hesitate to reach out.</p>
          <p>Wishing you both the best on your journey together!</p>
        </div>
      </div>
      
      <div class="footer">
        <p>&copy; ${new Date().getFullYear()} The 100 Marriage Assessment | <a href="https://the100marriage.lawrenceadjah.com">Visit Our Website</a></p>
      </div>
    </body>
    </html>
  `;
  }
}

// In-memory cache to track when notifications were sent for each email address
// This prevents duplicate notifications in a short time window
const notificationTracker: Record<string, number> = {};

/**
 * Sends a notification email to admin when a user starts filling out the assessment form
 * Includes deduplication to prevent multiple notifications for the same user within 24 hours
 * 
 * @param demographicData The demographic data entered by the user
 * @param ipAddress Optional IP address of the user
 * @returns Object containing success status and messageId if successful
 */
export async function sendFormInitiationNotification(
  demographicData: Partial<DemographicData>, 
  ipAddress?: string
): Promise<{ success: boolean, messageId?: string, skipped?: boolean }> {
  if (!process.env.SENDGRID_API_KEY) {
    console.error('Cannot send email: SENDGRID_API_KEY environment variable is not set.');
    return { success: false };
  }
  
  try {
    // Format user-friendly details for the notification
    const name = (demographicData.firstName || '') + ' ' + (demographicData.lastName || '');
    const email = demographicData.email || 'Not provided';
    const gender = demographicData.gender || 'Not provided';
    const age = demographicData.age || 'Not provided';
    const maritalStatus = demographicData.maritalStatus || 'Not provided';
    const timestamp = new Date().toISOString();
    
    // Skip notification if we've already sent one for this email in the last 24 hours
    // Only do this check if we have a valid email to track
    if (email !== 'Not provided') {
      const lastNotificationTime = notificationTracker[email];
      const currentTime = Date.now();
      
      // Check if we've already sent a notification in the last 24 hours (86400000 ms)
      if (lastNotificationTime && (currentTime - lastNotificationTime) < 86400000) {
        console.log(`Skipping duplicate notification for ${email} - last sent ${new Date(lastNotificationTime).toISOString()}`);
        return { success: true, skipped: true };
      }
      
      // Update notification tracker with current time
      notificationTracker[email] = currentTime;
    }
    
    // Create HTML content for the notification email
    const htmlContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #4A86E8;">New Assessment Form Initiated</h2>
        <p>A new user has started filling out The 100 Marriage Assessment form.</p>
        
        <h3>User Details:</h3>
        <ul>
          <li><strong>Name:</strong> ${name.trim() || 'Not provided'}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Gender:</strong> ${gender}</li>
          <li><strong>Age:</strong> ${age}</li>
          <li><strong>Marital Status:</strong> ${maritalStatus}</li>
          <li><strong>Timestamp:</strong> ${timestamp}</li>
          ${ipAddress ? `<li><strong>IP Address:</strong> ${ipAddress}</li>` : ''}
        </ul>
        
        <p>This is an automated notification sent by The 100 Marriage Assessment system.</p>
      </div>
    `;
    
    // Configure the message
    const msg = {
      to: ADMIN_EMAIL,
      from: {
        email: SENDER_EMAIL,
        name: SENDER_NAME
      },
      subject: `New Assessment Form Started: ${name.trim() || 'Anonymous User'}`,
      html: htmlContent
    };
    
    // Send the email
    const response = await mailService.send(msg);
    
    if (response && response[0] && response[0].statusCode >= 200 && response[0].statusCode < 300) {
      console.log(`Form initiation notification email sent successfully to admin for ${email}`);
      return { 
        success: true,
        messageId: response[0].headers['x-message-id'] as string
      };
    } else {
      console.error('Error sending form initiation notification:', response);
      return { success: false };
    }
  } catch (error) {
    console.error('Error sending form initiation notification:', error);
    return { success: false };
  }
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
    
    // Get emails from both partners - handle both old and new property paths
    const primary = report.primaryAssessment || report.primary;
    const spouse = report.spouseAssessment || report.spouse;
    
    // Get emails with fallbacks
    const primaryEmail = primary?.email || primary?.demographics?.email;
    const spouseEmail = spouse?.email || spouse?.demographics?.email;
    
    // Safe access to names
    const primaryName = primary?.demographics?.firstName || primary?.name?.split(' ')[0] || 'Partner 1';
    const spouseName = spouse?.demographics?.firstName || spouse?.name?.split(' ')[0] || 'Partner 2';
    
    const htmlContent = formatCoupleAssessmentEmail(report);
    
    // Filter out undefined emails
    const recipients = [primaryEmail, spouseEmail].filter(email => email);
    
    // Make sure we have at least one recipient
    if (recipients.length === 0) {
      throw new Error('No valid email addresses found for sending couple assessment report');
    }
    
    const msg = {
      to: recipients, // Send to both partners (or at least one if only one has an email)
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