import * as fs from 'fs';
import * as path from 'path';
import { MailService } from '@sendgrid/mail';

const mailService = new MailService();

const apiKey = process.env.SENDGRID_API_KEY;
const senderEmail = process.env.EMAIL_SENDER || "hello@wgodw.com";

if (!apiKey) {
  console.warn("⚠️ SendGrid API key not set.");
} else {
  mailService.setApiKey(apiKey);
}

export const sendAssessmentEmail = async (to: string, subject: string, text: string, pdfBuffer: Buffer, htmlContent?: string) => {
  if (!senderEmail) {
    throw new Error("Sender email not configured in EMAIL_SENDER");
  }

  const msg = {
    to,
    from: senderEmail,
    subject,
    text,
    html: htmlContent,
    attachments: [
      {
        content: pdfBuffer.toString("base64"),
        filename: "AssessmentReport.pdf",
        type: "application/pdf",
        disposition: "attachment",
      },
    ],
  };

  try {
    await mailService.send(msg);
    console.log("✅ Email sent to", to);
    return { success: true };
  } catch (err) {
    console.error("❌ Email failed:", err);
    return { success: false, error: err };
  }
};

export const sendCoupleAssessmentEmail = async (to: string, subject: string, text: string, pdfBuffer: Buffer, htmlContent?: string) => {
  if (!senderEmail) {
    throw new Error("Sender email not configured in EMAIL_SENDER");
  }

  const msg = {
    to,
    from: senderEmail,
    subject,
    text,
    html: htmlContent,
    attachments: [
      {
        content: pdfBuffer.toString("base64"),
        filename: "CoupleAssessmentReport.pdf",
        type: "application/pdf",
        disposition: "attachment",
      },
    ],
  };

  try {
    await mailService.send(msg);
    console.log("✅ Couple email sent to", to);
    return { success: true };
  } catch (err) {
    console.error("❌ Couple email failed:", err);
    return { success: false, error: err };
  }
};

export const generateIndividualEmailContent = (assessment: any) => {
  const demographics = typeof assessment.demographics === 'string' 
    ? JSON.parse(assessment.demographics) 
    : assessment.demographics || assessment.demographicData;
  
  const scores = typeof assessment.scores === 'string' 
    ? JSON.parse(assessment.scores) 
    : assessment.scores;

  const profile = typeof assessment.profile === 'string' 
    ? JSON.parse(assessment.profile) 
    : assessment.profile;

  const subject = `Your 100 Marriage Assessment Results - ${scores.overallPercentage}% Overall Score`;
  
  const textContent = `
Dear ${demographics.firstName},

Thank you for completing The 100 Marriage Assessment - Series 1. Your comprehensive report is attached to this email.

Your Overall Score: ${scores.overallPercentage}%

Key Highlights:
- Your assessment reflects your unique perspectives on marriage and relationships
- Higher percentages indicate alignment with traditional biblical principles
- Lower percentages suggest contemporary, flexible approaches
- Both perspectives have value and reflect different relationship philosophies

Your Primary Profile: ${profile.name}
${profile.description.substring(0, 200)}...

We encourage you to:
1. Review your detailed PDF report thoroughly
2. Consider discussing results with your significant other
3. Use insights for meaningful relationship conversations
4. Schedule a consultation if you'd like personalized guidance

For consultation bookings: https://lawrence-adjah.clientsecure.me/request/service

Best regards,
The 100 Marriage Assessment Team
Lawrence Adjah Ministries
  `;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #2c3e50; text-align: center;">Your 100 Marriage Assessment Results</h2>
      
      <p>Dear ${demographics.firstName},</p>
      
      <p>Thank you for completing <strong>The 100 Marriage Assessment - Series 1</strong>. Your comprehensive report is attached to this email.</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #2c3e50; margin-top: 0;">Your Overall Score: ${scores.overallPercentage}%</h3>
        
        <h4>Key Highlights:</h4>
        <ul>
          <li>Your assessment reflects your unique perspectives on marriage and relationships</li>
          <li>Higher percentages indicate alignment with traditional biblical principles</li>
          <li>Lower percentages suggest contemporary, flexible approaches</li>
          <li><strong>Both perspectives have value</strong> and reflect different relationship philosophies</li>
        </ul>
      </div>
      
      <div style="background-color: #e8f4fd; padding: 15px; border-radius: 8px; margin: 20px 0;">
        <h4 style="color: #2c3e50; margin-top: 0;">Your Primary Profile: ${profile.name}</h4>
        <p>${profile.description.substring(0, 300)}...</p>
      </div>
      
      <h4>We encourage you to:</h4>
      <ol>
        <li>Review your detailed PDF report thoroughly</li>
        <li>Consider discussing results with your significant other</li>
        <li>Use insights for meaningful relationship conversations</li>
        <li>Schedule a consultation if you'd like personalized guidance</li>
      </ol>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://lawrence-adjah.clientsecure.me/request/service" 
           style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Schedule a Consultation
        </a>
      </div>
      
      <p style="margin-top: 30px;">Best regards,<br>
      <strong>The 100 Marriage Assessment Team</strong><br>
      Lawrence Adjah Ministries</p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
      <p style="font-size: 12px; color: #666; text-align: center;">
        This assessment is based on "The 100 Marriage Decisions & Declarations" by Lawrence Adjah
      </p>
    </div>
  `;

  return { subject, textContent, htmlContent };
};

export const generateCoupleEmailContent = (coupleReport: any) => {
  const primaryDemo = typeof coupleReport.primaryDemographics === 'string' 
    ? JSON.parse(coupleReport.primaryDemographics) 
    : coupleReport.primaryDemographics;
  
  const spouseDemo = typeof coupleReport.spouseDemographics === 'string' 
    ? JSON.parse(coupleReport.spouseDemographics) 
    : coupleReport.spouseDemographics;

  const subject = `Your Couple Assessment Results - ${coupleReport.compatibilityScore}% Compatibility`;
  
  const textContent = `
Dear ${primaryDemo.firstName} and ${spouseDemo.firstName},

Congratulations on completing The 100 Marriage Assessment together! Your comprehensive couple's report is attached.

Compatibility Score: ${coupleReport.compatibilityScore}%
${primaryDemo.firstName}'s Score: ${coupleReport.primaryAssessment.scores.overallPercentage}%
${spouseDemo.firstName}'s Score: ${coupleReport.spouseAssessment.scores.overallPercentage}%

Key Insights:
- Compatibility reflects how well your perspectives align
- Differences can be strengths when handled with understanding
- Similar scores suggest shared values and approaches
- Your detailed report includes specific recommendations

We encourage you to:
1. Review your couple's report together
2. Discuss areas of alignment and differences
3. Use insights to strengthen your relationship
4. Consider couples consultation for deeper guidance

For consultation bookings: https://lawrence-adjah.clientsecure.me/request/service

Best regards,
The 100 Marriage Assessment Team
Lawrence Adjah Ministries
  `;

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
      <h2 style="color: #2c3e50; text-align: center;">Your Couple Assessment Results</h2>
      
      <p>Dear ${primaryDemo.firstName} and ${spouseDemo.firstName},</p>
      
      <p>Congratulations on completing <strong>The 100 Marriage Assessment</strong> together! Your comprehensive couple's report is attached.</p>
      
      <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #2c3e50; margin-top: 0;">Compatibility Score: ${coupleReport.compatibilityScore}%</h3>
        
        <div style="display: flex; justify-content: space-between; margin: 15px 0;">
          <div style="background-color: #e8f4fd; padding: 10px; border-radius: 6px; width: 45%;">
            <strong>${primaryDemo.firstName}'s Score:</strong> ${coupleReport.primaryAssessment.scores.overallPercentage}%
          </div>
          <div style="background-color: #e8f4fd; padding: 10px; border-radius: 6px; width: 45%;">
            <strong>${spouseDemo.firstName}'s Score:</strong> ${coupleReport.spouseAssessment.scores.overallPercentage}%
          </div>
        </div>
      </div>
      
      <h4>Key Insights:</h4>
      <ul>
        <li>Compatibility reflects how well your perspectives align</li>
        <li>Differences can be strengths when handled with understanding</li>
        <li>Similar scores suggest shared values and approaches</li>
        <li>Your detailed report includes specific recommendations</li>
      </ul>
      
      <h4>We encourage you to:</h4>
      <ol>
        <li>Review your couple's report together</li>
        <li>Discuss areas of alignment and differences</li>
        <li>Use insights to strengthen your relationship</li>
        <li>Consider couples consultation for deeper guidance</li>
      </ol>
      
      <div style="text-align: center; margin: 30px 0;">
        <a href="https://lawrence-adjah.clientsecure.me/request/service" 
           style="background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
          Schedule a Couples Consultation
        </a>
      </div>
      
      <p style="margin-top: 30px;">Best regards,<br>
      <strong>The 100 Marriage Assessment Team</strong><br>
      Lawrence Adjah Ministries</p>
      
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;">
      <p style="font-size: 12px; color: #666; text-align: center;">
        This assessment is based on "The 100 Marriage Decisions & Declarations" by Lawrence Adjah
      </p>
    </div>
  `;

  return { subject, textContent, htmlContent };
};