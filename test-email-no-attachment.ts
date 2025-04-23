import { MailService } from '@sendgrid/mail';

// Initialize SendGrid
if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

async function sendAssessmentEmailWithoutAttachment() {
  try {
    console.log('Sending assessment email without PDF attachment...');
    
    // Create sample HTML content similar to assessment results but without attachment
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>100 Marriage Assessment Results</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { text-align: center; margin-bottom: 30px; }
          h1 { color: #2c3e50; }
          h2 { color: #3498db; margin-top: 20px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>100 Marriage Assessment Results</h1>
          </div>
          
          <div>
            <p>Dear Lawrence,</p>
            <p>This is a test email to verify that email delivery is working correctly. This email mimics the assessment results email but does not include any PDF attachments.</p>
          </div>
          
          <div>
            <h2>Your Overall Assessment Score</h2>
            <p>92%</p>
            <p>This is simply test data.</p>
          </div>
          
          <div>
            <h2>Next Steps</h2>
            <p>If you receive this email, please let us know so we can determine if the issue is with attachments or general email delivery.</p>
          </div>
          
          <div style="margin-top: 30px; text-align: center; font-size: 12px; color: #7f8c8d;">
            © 2025 Lawrence Adjah - The 100 Marriage Assessment
          </div>
        </div>
      </body>
      </html>
    `;
    
    // Create message
    const message = {
      to: 'lawrence@lawrenceadjah.com',
      from: 'hello@wgodw.com',
      subject: 'Test Assessment Results (No Attachment)',
      html: htmlContent
    };
    
    console.log(`Sending to: ${message.to} from: ${message.from}`);
    
    // Send the email without attachment
    const [response] = await mailService.send(message);
    
    console.log('SendGrid Response:', {
      statusCode: response.statusCode
    });
    
    console.log('✅ Assessment email (without attachment) sent successfully!');
    return true;
  } catch (error: any) {
    console.error('Error sending email:', error);
    
    if (error.response) {
      console.error('SendGrid API error details:', error.response.body);
    }
    
    return false;
  }
}

// Run the test
sendAssessmentEmailWithoutAttachment();