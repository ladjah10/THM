import { sendCoupleInvitationEmails } from './server/nodemailer';

// Test data for couple invitation
const coupleInvitationData = {
  primaryEmail: "primary@example.com",
  primaryName: "John Smith",
  spouseEmail: "spouse@example.com",
  spouseName: "Sarah Smith",
  coupleId: "test-couple-" + Date.now()
};

// Run the couple invitation test
async function runCoupleInvitationTest() {
  console.log("Testing couple invitation emails process...");
  console.log(`Primary: ${coupleInvitationData.primaryName} (${coupleInvitationData.primaryEmail})`);
  console.log(`Spouse: ${coupleInvitationData.spouseName} (${coupleInvitationData.spouseEmail})`);
  console.log(`Couple ID: ${coupleInvitationData.coupleId}`);
  
  try {
    const result = await sendCoupleInvitationEmails(coupleInvitationData);
    
    if (result.success) {
      console.log("Couple invitation emails sent successfully!");
      if (result.previewUrl) {
        console.log(`Preview URL: ${result.previewUrl}`);
        console.log("Open this URL in your browser to view the test email");
      }
    } else {
      console.error("Failed to send couple invitation emails");
    }
  } catch (error) {
    console.error("Error:", error);
  }
}

// Run the test
runCoupleInvitationTest();