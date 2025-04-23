import { MailService } from '@sendgrid/mail';

// Initialize SendGrid
if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

async function sendSimpleTestEmail() {
  try {
    console.log('Sending a simple test email...');
    
    // Create a simple message with minimal formatting
    const message = {
      to: 'lawrence@lawrenceadjah.com',
      from: 'hello@wgodw.com', // The verified sender
      subject: 'Simple Test - 100 Marriage Assessment',
      text: 'This is a simple test email with minimal content to test deliverability.',
      html: '<p>This is a simple test email with minimal content to test deliverability.</p>'
    };
    
    console.log(`Sending to: ${message.to} from: ${message.from}`);
    
    // Send the email
    const [response] = await mailService.send(message);
    
    console.log('SendGrid Response:', {
      statusCode: response.statusCode,
      headers: response.headers,
    });
    
    console.log('✅ Test email sent successfully!');
    return true;
  } catch (error: any) {
    console.error('Error sending test email:', error);
    
    if (error.response) {
      console.error('SendGrid API error details:', error.response.body);
    }
    
    return false;
  }
}

// Run the test
sendSimpleTestEmail();