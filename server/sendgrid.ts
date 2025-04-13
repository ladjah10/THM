import { MailService } from '@sendgrid/mail';
import { AssessmentResult } from '../shared/schema';

// Initialize SendGrid
if (!process.env.SENDGRID_API_KEY) {
  console.warn("SENDGRID_API_KEY environment variable is not set.");
}

const mailService = new MailService();
if (process.env.SENDGRID_API_KEY) {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

interface EmailMessage {
  to: string;
  cc?: string;
  from: string;
  subject: string;
  text?: string;
  html: string;
}

/**
 * Formats assessment data into a nice HTML email
 */
function formatAssessmentEmail(assessment: AssessmentResult): string {
  const { name, scores, profile, demographics } = assessment;
  
  const strengthsList = scores.strengths.map(s => `<li>${s}</li>`).join('');
  const improvementsList = scores.improvementAreas.map(s => `<li>${s}</li>`).join('');
  
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
      <title>100 Marriage Assessment Results</title>
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
          <h1>100 Marriage Assessment Results</h1>
        </div>
        
        <div class="section">
          <p>Dear ${demographics.firstName},</p>
          <p>Thank you for completing the 100 Marriage Assessment. Below are your detailed results.</p>
        </div>
        
        <div class="section">
          <h2>Your Overall Score</h2>
          <p class="overall-score">${scores.overallPercentage.toFixed(1)}%</p>
          <p>Total Score: ${scores.totalEarned}/${scores.totalPossible}</p>
        </div>
        
        <div class="section">
          <h2>Your Detailed Scores</h2>
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
          <h2>Your Profile: ${profile.name}</h2>
          <div class="profile-box">
            <p>${profile.description}</p>
          </div>
        </div>
        
        <div class="section">
          <h2>Your Strengths</h2>
          <ul>
            ${strengthsList}
          </ul>
        </div>
        
        <div class="section">
          <h2>Areas for Growth</h2>
          <ul>
            ${improvementsList}
          </ul>
        </div>
        
        <div class="footer">
          <p>© 2023 Lawrence E. Adjah - The 100 Marriage Assessment</p>
          <p>This assessment is designed to help you understand your readiness for marriage and identify areas for growth.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Sends an assessment report email
 */
export async function sendAssessmentEmail(assessment: AssessmentResult, ccEmail?: string): Promise<boolean> {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      console.error('Missing SendGrid API key');
      return false;
    }

    const emailHtml = formatAssessmentEmail(assessment);
    
    const message: EmailMessage = {
      to: assessment.email,
      from: 'assessment@100marriage.com', // This should be a verified sender in SendGrid
      subject: `${assessment.name}'s 100 Marriage Assessment Results`,
      html: emailHtml,
    };
    
    // Add CC if provided
    if (ccEmail) {
      message.cc = ccEmail;
    }
    
    await mailService.send(message);
    console.log(`Email sent to ${assessment.email} ${ccEmail ? `with CC to ${ccEmail}` : ''}`);
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}