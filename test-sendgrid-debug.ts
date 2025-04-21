import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  throw new Error("SENDGRID_API_KEY environment variable must be set");
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

async function testSendGridEmail() {
  try {
    console.log('Testing SendGrid email with minimal configuration...');
    
    const message = {
      to: 'lawrence@lawrenceadjah.com',
      from: 'hello@wgodw.com', // This should be a verified sender in SendGrid
      subject: 'Test SendGrid Email',
      text: 'This is a test email from the 100 Marriage Assessment platform.',
      html: '<p>This is a test email from the <strong>100 Marriage Assessment</strong> platform.</p>'
    };
    
    // Enable detailed debug logging
    console.log('Full message being sent:', JSON.stringify(message, null, 2));
    
    // Send the email
    const result = await mailService.send(message);
    console.log('SendGrid response:', result);
    console.log('Email sent successfully!');
    
    return true;
  } catch (error) {
    console.error('SendGrid error details:', error);
    
    // Print more detailed error information if available
    if (error.response) {
      console.error('Error response body:', error.response.body);
    }
    
    return false;
  }
}

// Test with simple email sending
async function testSimpleEmailSending() {
  try {
    console.log('\nTesting simple email sending...');
    
    const recipient = 'lawrence@lawrenceadjah.com';
    
    const message = {
      to: recipient,
      from: 'hello@wgodw.com',
      subject: 'Test SendGrid Email (No CC)',
      html: '<p>This is a test email without CC handling.</p>'
    };
    
    console.log('Message for simple test:', JSON.stringify(message, null, 2));
    
    // Send the email
    const result = await mailService.send(message);
    console.log('SendGrid response (simple test):', result);
    console.log('Email sent successfully!');
    
    return true;
  } catch (error) {
    console.error('SendGrid error in CC test:', error);
    
    if (error.response) {
      console.error('Error response body:', error.response.body);
    }
    
    return false;
  }
}

// Run the test function
testSendGridEmail()
  .then(success => {
    console.log('Test completed with result:', success ? 'Success' : 'Failed');
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  });