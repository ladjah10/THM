import sgMail from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY is not set. Please set this environment variable.");
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendTestEmail() {
  const msg = {
    to: 'la@lawrenceadjah.com',
    from: 'la@lawrenceadjah.com', // Use your verified sender
    subject: 'The 100 Marriage - Test Email',
    text: 'This is a test email from The 100 Marriage Assessment using SendGrid.',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h1 style="color: #3498db;">The 100 Marriage Assessment - Test Email</h1>
        <p>This is a test email sent directly using SendGrid.</p>
        <p>If you received this, it means our email configuration is working properly.</p>
        <hr>
        <p style="color: #7f8c8d; font-size: 12px; text-align: center;">
          © 2025 Lawrence E. Adjah - The 100 Marriage Assessment - Series 1
        </p>
      </div>
    `,
  };

  try {
    console.log("Sending test email to la@lawrenceadjah.com...");
    const response = await sgMail.send(msg);
    console.log("Email sent successfully!");
    console.log(`Status code: ${response[0].statusCode}`);
    console.log(`Headers: ${JSON.stringify(response[0].headers)}`);
  } catch (error: any) {
    console.error("Error sending email:", error);
    if (error.response) {
      console.error("SendGrid API response:", error.response.body);
    }
  }
}

// Run the test
sendTestEmail();