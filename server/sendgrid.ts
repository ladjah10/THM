/**
 * SendGrid email functionality for sending assessment reports
 */

import * as fs from 'fs';
import * as path from 'path';
import { MailService } from '@sendgrid/mail';
import type { AssessmentResult, CoupleAssessmentReport, DemographicData } from '../shared/schema';

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
export async function sendAssessmentEmail(assessment: AssessmentResult, pdfPath: string): Promise<{ success: boolean, messageId?: string, error?: string }> {
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
    
    // Add more detailed error information
    if (error instanceof Error) {
      console.error('Error details:', error.message);
      if ('response' in error) {
        const responseData = (error as any).response?.body;
        if (responseData) {
          console.error('SendGrid error response:', responseData);
        }
      }
    }
    
    // Clean up temporary file if it exists
    try {
      fs.unlinkSync(pdfPath);
      console.log('Temporary PDF file cleaned up:', pdfPath);
    } catch (cleanupError) {
      console.warn('Could not clean up temporary PDF file:', cleanupError);
    }
    
    return { 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
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
  const compatibility = report.compatibilityScore || 0;
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

/**
 * Sends a notification email to admin when a user starts filling out the assessment form
 * @param demographicData The demographic data entered by the user
 * @param ipAddress Optional IP address of the user
 * @returns Object containing success status and messageId if successful
 */
export async function sendFormInitiationNotification(
  demographicData: Partial<DemographicData>, 
  ipAddress?: string
): Promise<{ success: boolean, messageId?: string }> {
  if (!process.env.SENDGRID_API_KEY) {
    console.error('Cannot send email: SENDGRID_API_KEY environment variable is not set.');
    return { success: false };
  }
  
  try {
    // Format date for display
    const date = new Date();
    const formattedDate = date.toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      timeZoneName: 'short'
    });
    
    // Create a string to display the demographic data that's been filled in
    const demographicDetails = Object.entries(demographicData)
      .filter(([_, value]) => value !== undefined && value !== '')
      .map(([key, value]) => {
        // Format the key for better readability
        const formattedKey = key
          .replace(/([A-Z])/g, ' $1')  // Add spaces before capital letters
          .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
        
        // Handle boolean values
        if (typeof value === 'boolean') {
          return `<tr><td><strong>${formattedKey}</strong></td><td>${value ? 'Yes' : 'No'}</td></tr>`;
        }
        
        return `<tr><td><strong>${formattedKey}</strong></td><td>${value}</td></tr>`;
      })
      .join('');
    
    // HTML content for the notification email
    const htmlContent = `
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
            background-color: #3b82f6;
            color: white;
            padding: 15px;
            text-align: center;
          }
          .content {
            padding: 20px;
          }
          h1 {
            margin: 0;
            font-size: 20px;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
          th, td {
            padding: 8px;
            text-align: left;
            border-bottom: 1px solid #ddd;
          }
          th {
            background-color: #f2f2f2;
          }
          .footer {
            font-size: 12px;
            text-align: center;
            margin-top: 20px;
            color: #666;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>New Assessment Form Initiated</h1>
        </div>
        
        <div class="content">
          <p>A user has started filling out an assessment form on The 100 Marriage website:</p>
          
          <p><strong>Date and Time:</strong> ${formattedDate}</p>
          ${ipAddress ? `<p><strong>IP Address:</strong> ${ipAddress}</p>` : ''}
          
          <h3>Demographic Information Provided:</h3>
          <table>
            <thead>
              <tr>
                <th>Field</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              ${demographicDetails || '<tr><td colspan="2">No data entered yet</td></tr>'}
            </tbody>
          </table>
          
          <div class="footer">
            <p>This is an automated notification from The 100 Marriage Assessment System.</p>
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Prepare the email
    const msg = {
      to: ADMIN_EMAIL,
      from: {
        email: SENDER_EMAIL,
        name: SENDER_NAME
      },
      subject: 'New Assessment Form Initiated - The 100 Marriage',
      html: htmlContent
    };
    
    // Send the email
    const response = await mailService.send(msg);
    
    if (response && response[0] && response[0].statusCode >= 200 && response[0].statusCode < 300) {
      console.log(`Form initiation notification email sent successfully to admin`);
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