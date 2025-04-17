/**
 * Formats a couple assessment invitation email
 * @param primaryPartnerName The name of the primary spouse who initiated the assessment
 * @param spouseName The name of the spouse being invited (if known)
 * @param coupleId The unique identifier for the couple's assessment
 * @param isForPrimary Whether this email is for the primary spouse or the invited spouse
 * @returns HTML email content
 */
export function formatCoupleInvitationEmail(
  primaryName?: string, 
  spouseName?: string, 
  coupleId: string = '',
  isForPrimary: boolean = false
): string {
  // Generate a link that the spouse can use to start their assessment
  const baseUrl = process.env.BASE_URL || 'http://localhost:5000';
  const invitationLink = `${baseUrl}/couple-assessment/invite/${coupleId}`;
  
  // Format names with defaults if not provided
  const formattedPrimaryName = primaryName || 'Your significant other';
  const secondaryName = spouseName || 'your significant other';
  
  // Different content based on recipient
  if (isForPrimary) {
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Couple Assessment Has Been Started</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            padding: 20px 0;
            background: linear-gradient(135deg, #6B46C1 0%, #9F7AEA 100%);
            border-radius: 8px 8px 0 0;
            margin: -20px -20px 20px;
          }
          .header h1 {
            color: white;
            margin: 0;
            padding: 0;
            font-size: 24px;
          }
          .content {
            padding: 0 20px;
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #888;
            font-size: 12px;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #6B46C1;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            margin-top: 20px;
          }
          .callout {
            background-color: #FAF5FF;
            border-left: 4px solid #9F7AEA;
            padding: 15px;
            margin: 20px 0;
            border-radius: 0 4px 4px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Your Couple Assessment Has Been Started</h1>
          </div>
          <div class="content">
            <p>You have successfully initiated a couple assessment for you and ${secondaryName}.</p>
            
            <div class="callout">
              <p><strong>What happens next:</strong></p>
              <p>- Your significant other will receive an email with a link to complete their assessment</p>
              <p>- Once both of you have completed the assessment, you'll receive a comprehensive compatibility report</p>
              <p>- The report will show areas where you align and differ, with insights for relationship growth</p>
            </div>
            
            <p>If you haven't completed your assessment yet, click the button below to start or continue:</p>
            
            <div style="text-align: center;">
              <a href="${baseUrl}/assessment?coupleId=${coupleId}&role=primary" class="button">Continue My Assessment</a>
            </div>
            
            <p style="margin-top: 30px;">Thank you for using The 100 Marriage Assessment - Series 1 to strengthen your relationship!</p>
            
            <p>Sincerely,<br>The 100 Marriage Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} The 100 Marriage. All rights reserved.</p>
            <p>This email was sent to you as part of the couple assessment process.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  } else {
    // Email for spouse
    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>You've Been Invited to Take the 100 Marriage Assessment</title>
        <style>
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background-color: #f9f9f9;
            margin: 0;
            padding: 0;
          }
          .container {
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
          }
          .header {
            text-align: center;
            padding: 20px 0;
            background: linear-gradient(135deg, #6B46C1 0%, #9F7AEA 100%);
            border-radius: 8px 8px 0 0;
            margin: -20px -20px 20px;
          }
          .header h1 {
            color: white;
            margin: 0;
            padding: 0;
            font-size: 24px;
          }
          .content {
            padding: 0 20px;
          }
          .footer {
            text-align: center;
            padding: 20px;
            color: #888;
            font-size: 12px;
          }
          .button {
            display: inline-block;
            padding: 12px 24px;
            background-color: #6B46C1;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            font-weight: bold;
            margin-top: 20px;
          }
          .callout {
            background-color: #FAF5FF;
            border-left: 4px solid #9F7AEA;
            padding: 15px;
            margin: 20px 0;
            border-radius: 0 4px 4px 0;
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>You've Been Invited to Take the 100 Marriage Assessment</h1>
          </div>
          <div class="content">
            <p>${formattedPrimaryName} has invited you to take the 100 Marriage Assessment - Series 1 as a couple.</p>
            
            <div class="callout">
              <p><strong>What is this?</strong></p>
              <p>The 100 Marriage Assessment is a comprehensive questionnaire that helps couples understand their expectations, values, and potential areas for growth in their relationship.</p>
              <p>Both of you will take the assessment separately, and then receive a detailed compatibility report that can help strengthen your relationship.</p>
            </div>
            
            <p><strong>What to expect:</strong></p>
            <ul>
              <li>The assessment takes about 15-20 minutes to complete</li>
              <li>Your answers will be private until both of you have completed it</li>
              <li>You'll receive insights into your relationship alignment</li>
              <li>There's no cost to you - ${formattedPrimaryName} has already covered the fee</li>
            </ul>
            
            <p>Click the button below to start your assessment:</p>
            
            <div style="text-align: center;">
              <a href="${invitationLink}" class="button">Start My Assessment</a>
            </div>
            
            <p style="margin-top: 30px;">Thank you for taking this important step to strengthen your relationship!</p>
            
            <p>Sincerely,<br>The 100 Marriage Team</p>
          </div>
          <div class="footer">
            <p>© ${new Date().getFullYear()} The 100 Marriage. All rights reserved.</p>
            <p>This email was sent to you because ${primaryName} invited you to take the couple assessment.</p>
          </div>
        </div>
      </body>
      </html>
    `;
  }
}