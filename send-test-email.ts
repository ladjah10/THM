import sgMail from '@sendgrid/mail';

// Setting up SendGrid with API Key
if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable is required");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendTestEmail() {
  try {
    const msg = {
      to: 'la@lawrenceadjah.com',
      from: 'hello@wgodw.com', // This should be a verified sender in your SendGrid account
      subject: 'The 100 Marriage Assessment - Test Email',
      text: 'This is a test email from The 100 Marriage Assessment system.',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <h1 style="color: #1a365d; text-align: center;">The 100 Marriage Assessment - Series 1</h1>
          <p style="text-align: center; color: #4a5568;">Test Email from SendGrid Integration</p>
          
          <hr style="border: none; border-top: 1px solid #f0f0f0; margin: 20px 0;">
          
          <p><strong>Hello Lawrence,</strong></p>
          
          <p>This is a test email sent from the SendGrid integration in your 100 Marriage Assessment system. If you're receiving this email, it means our email functionality is working correctly.</p>
          
          <p>The system has been updated with:</p>
          <ul>
            <li>Standardized section names across all reports and visualizations</li>
            <li>Enhanced couple assessment visualizations</li>
            <li>Improved PDF report layout and styling</li>
          </ul>
          
          <p>You can view the sample pages at the following URLs:</p>
          <ul>
            <li><a href="https://8ed5d051-ce9f-4798-a0bc-e6401a356f7c-00-2q0xrpammib8b.janeway.replit.dev/sample-couple-results.html">Couple Results</a></li>
            <li><a href="https://8ed5d051-ce9f-4798-a0bc-e6401a356f7c-00-2q0xrpammib8b.janeway.replit.dev/sample-couple-email.html">Couple Email</a></li>
            <li><a href="https://8ed5d051-ce9f-4798-a0bc-e6401a356f7c-00-2q0xrpammib8b.janeway.replit.dev/sample-couple-report.html">Couple Discussion Guide</a></li>
          </ul>
          
          <div style="background-color: #ebf8ff; padding: 15px; border-radius: 5px; margin-top: 20px;">
            <p style="margin: 0; color: #2c5282;"><strong>Next Steps:</strong></p>
            <p style="margin-top: 10px;">Let us know if you'd like any further adjustments to the email templates, section naming, or other aspects of the system.</p>
          </div>
          
          <hr style="border: none; border-top: 1px solid #f0f0f0; margin: 20px 0;">
          
          <p style="text-align: center; color: #718096; font-size: 12px;">
            © 2025 Lawrence E. Adjah - The 100 Marriage Assessment - Series 1
          </p>
        </div>
      `
    };
    
    const response = await sgMail.send(msg);
    console.log('Email sent successfully!');
    console.log('Response:', response[0].statusCode);
    console.log('Headers:', response[0].headers);
    
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error('Error details:', error.response.body);
    }
    
    return { success: false, error };
  }
}

// Run the function
sendTestEmail()
  .then(result => {
    console.log('Operation completed with result:', result);
    process.exit(result.success ? 0 : 1);
  })
  .catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  });