/**
 * Formats a couple assessment invitation email
 * @param primaryPartnerName The name of the primary partner who initiated the assessment
 * @param spouseName The name of the spouse being invited (if known)
 * @param coupleId The unique identifier for the couple's assessment
 * @param isForPrimary Whether this email is for the primary partner or the spouse
 * @returns HTML email content
 */
export function formatCoupleInvitationEmail(
  primaryPartnerName: string = "Your significant other",
  spouseName: string = "Your significant other",
  coupleId: string,
  isForPrimary: boolean = false
): string {
  const appUrl = process.env.APP_URL || 'https://100-marriage-assessment.replit.app';
  const assessmentUrl = `${appUrl}/couple-assessment/${coupleId}`;
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${isForPrimary ? 'Your' : 'You\'ve Been Invited to a'} Couple Assessment</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
        }
        .header {
          background-color: #6b46c1;
          color: white;
          padding: 20px;
          text-align: center;
          border-radius: 5px 5px 0 0;
        }
        .content {
          background-color: #f9f7ff;
          border: 1px solid #e6e1f9;
          border-top: none;
          padding: 20px;
          border-radius: 0 0 5px 5px;
        }
        .button {
          display: inline-block;
          background-color: #6b46c1;
          color: white;
          text-decoration: none;
          padding: 12px 25px;
          border-radius: 4px;
          margin: 20px 0;
          font-weight: bold;
        }
        .footer {
          text-align: center;
          color: #666;
          font-size: 12px;
          margin-top: 20px;
        }
        .highlight {
          background-color: #f0ebff;
          padding: 15px;
          border-radius: 4px;
          margin: 15px 0;
          border-left: 4px solid #6b46c1;
        }
        h2 {
          color: #6b46c1;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>The 100 Marriage Assessment - Series 1</h1>
        <p>${isForPrimary ? 'Your Couple Assessment' : 'Couple Assessment Invitation'}</p>
      </div>
      <div class="content">
        <p>Hello${isForPrimary ? '' : ` ${spouseName}`},</p>
        
        ${isForPrimary ? 
          `<p>You've successfully started a couple assessment! As the primary partner, you can now begin your portion of the assessment.</p>
           <p>We've also sent an invitation to <strong>${spouseName}</strong> to complete their portion of the assessment.</p>` 
          : 
          `<p><strong>${primaryPartnerName}</strong> has invited you to take the 100 Marriage Assessment together as a couple.</p>
           <p>This assessment will help both of you understand your expectations and compatibility for marriage or a long-term relationship.</p>`
        }
        
        <div class="highlight">
          <h2>How the Couple Assessment Works:</h2>
          <ol>
            <li>Each partner completes their own ~100 question assessment</li>
            <li>You can take the assessment at your own pace, from anywhere</li>
            <li>Once both assessments are complete, you'll receive a comprehensive compatibility report</li>
            <li>The report analyzes where you align and differ across all areas of the assessment</li>
          </ol>
        </div>
        
        <p>Ready to discover your compatibility?</p>
        
        <a href="${assessmentUrl}" class="button">Start Your Assessment</a>
        
        <p>If the button doesn't work, copy and paste this link into your browser:</p>
        <p><a href="${assessmentUrl}">${assessmentUrl}</a></p>
        
        ${isForPrimary ? 
          `<p>Once both you and your significant other have completed the assessment, you'll receive your compatibility report!</p>` 
          : 
          `<p>Your participation will provide valuable insights for both you and your significant other.</p>`
        }
        
        <p>Wishing you clarity in your relationship journey,</p>
        <p>Lawrence Adjah<br>
        Author, The 100 Marriage</p>
      </div>
      <div class="footer">
        <p>© ${new Date().getFullYear()} The 100 Marriage. All rights reserved.</p>
        <p>If you did not request this assessment, please disregard this email.</p>
      </div>
    </body>
    </html>
  `;
}