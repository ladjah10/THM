import { MailService } from '@sendgrid/mail';
import { AssessmentResult } from '../shared/schema';
import { generateAssessmentPDF } from './pdf-generator';

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
  attachments?: {
    content: string;
    filename: string;
    type: string;
    disposition: string;
  }[];
}

/**
 * Formats assessment data into a nice HTML email
 */
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
          <p>Thank you for completing the 100 Marriage Assessment. Below are your detailed results. We've also attached a beautifully designed PDF report of your results that you can download, print, or share.</p>
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
          <h2>Your Profile: ${profile.name}</h2>
          <div class="profile-box">
            <p>${profile.description}</p>
          </div>
        </div>
        
        <div class="section" style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 25px;">
          <h2 style="margin-top: 0;">Next Steps</h2>
          <p>If you'd like to discuss your results further, you can schedule a 1-on-1 session here:</p>
          <p><a href="https://lawrence-adjah.clientsecure.me/request/service" style="color: #3498db; font-weight: bold; text-decoration: none;">Schedule a Consultation</a></p>
        </div>
        
        <div class="footer">
          <p>(c) 2025 Lawrence E. Adjah - The 100 Marriage Assessment</p>
          <p>This assessment is designed to help you understand your readiness for marriage and identify areas for growth.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Sends an assessment report email with PDF attachment
 */
export async function sendAssessmentEmail(assessment: AssessmentResult, ccEmail: string = "la@lawrenceadjah.com"): Promise<boolean> {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      console.error('Missing SendGrid API key');
      return false;
    }

    // Format the email HTML content
    const emailHtml = formatAssessmentEmail(assessment);
    
    // Generate PDF report
    console.log('Generating PDF report...');
    const pdfBuffer = await generateAssessmentPDF(assessment);
    
    // Create the email message
    const message: EmailMessage = {
      to: assessment.email,
      from: 'assessment@100marriage.com', // This should be a verified sender in SendGrid
      subject: `${assessment.name} - 100 Marriage Assessment Results`,
      html: emailHtml,
      cc: ccEmail, // Always CC the administrator by default
      attachments: [
        {
          content: pdfBuffer.toString('base64'),
          filename: `100Marriage-Assessment-Report.pdf`,
          type: 'application/pdf',
          disposition: 'attachment'
        }
      ]
    };
    
    // Send the email with attachment
    await mailService.send(message);
    console.log(`Email with PDF attachment sent to ${assessment.email} with CC to ${ccEmail}`);
    
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}