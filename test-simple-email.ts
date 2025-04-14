import { MailService } from '@sendgrid/mail';

if (!process.env.SENDGRID_API_KEY) {
  console.error('SENDGRID_API_KEY is not set.');
  process.exit(1);
}

const mailService = new MailService();
mailService.setApiKey(process.env.SENDGRID_API_KEY);

console.log('Sending a simple test email to check SendGrid API...');

const msg = {
  to: 'la@lawrenceadjah.com',
  from: 'la@lawrenceadjah.com', // Using the same email for testing
  subject: 'Testing SendGrid API',
  text: 'This is a test email to validate the SendGrid API integration.',
  html: '<strong>This is a test email to validate the SendGrid API integration.</strong>'
};

mailService.send(msg)
  .then(() => {
    console.log('Simple test email sent successfully!');
  })
  .catch((error) => {
    console.error('Error sending simple test email:', error);
    if (error.response && error.response.body) {
      console.error('Error details:', JSON.stringify(error.response.body, null, 2));
    }
  });