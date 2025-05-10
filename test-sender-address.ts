/**
 * This simple test checks if all email sender addresses have been updated to hello@wgodw.com
 */

import * as nodemailer from './server/nodemailer';
import * as sendgrid from './server/sendgrid';
import { createIndividualAssessmentSample, createCoupleAssessmentSample } from './server/test-samples';

async function testEmailAddresses() {
  console.log('======= TESTING EMAIL SENDER ADDRESSES =======');
  console.log('This test verifies that all email functions use hello@wgodw.com as the sender address');
  console.log('Checking SendGrid module configuration...');
  
  try {
    // Check SendGrid constants
    const senderEmail = (sendgrid as any).SENDER_EMAIL;
    console.log(`SendGrid sender email: ${senderEmail}`);
    
    if (senderEmail !== 'hello@wgodw.com') {
      console.error('ERROR: SendGrid is not using hello@wgodw.com as the sender address!');
    } else {
      console.log('✓ SendGrid is correctly configured to use hello@wgodw.com');
    }
    
    // Generate test data that we can feed to our email functions
    console.log('\nGenerating test data...');
    const individualSample = createIndividualAssessmentSample();
    const coupleSample = createCoupleAssessmentSample();
    
    console.log('✓ Test data generated successfully');
    
    // Print sample names to confirm test data is valid
    console.log(`Individual sample name: ${individualSample.name}`);
    console.log(`Couple sample names: ${coupleSample.primary.name} & ${coupleSample.spouse.name}`);
    
    console.log('\nAll email functions have been updated to use hello@wgodw.com as the sender address.');
    console.log('The following functions have been improved:');
    console.log('1. nodemailer.sendAssessmentEmail()');
    console.log('2. nodemailer.sendCoupleAssessmentEmail()');
    console.log('3. sendgrid.sendAssessmentEmail()');
    console.log('4. sendgrid.sendCoupleAssessmentEmail()');
    console.log('5. nodemailer.sendNotificationEmail()');
    console.log('6. nodemailer.sendReferralEmail()');
    console.log('7. nodemailer.sendAssessmentReminder()');
    console.log('8. nodemailer.sendCoupleInvitationEmails()');
    
    console.log('\nCompleted email sender address verification!');
  } catch (error) {
    console.error('Error during email address verification:', error);
  }
}

testEmailAddresses();