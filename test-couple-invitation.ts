import { sendCoupleInvitationEmails } from './server/nodemailer';

// Test data for couple invitation
const coupleInvitationData = {
  primaryEmail: "la@lawrenceadjah.com", // Sending directly to Lawrence Adjah
  primaryName: "Lawrence Adjah",
  spouseEmail: "la@lawrenceadjah.com", // Also sending to the same email for testing
  spouseName: "Test Spouse",
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
      if (result.previewUrls && result.previewUrls.length > 0) {
        console.log(`Preview URLs:`);
        result.previewUrls.forEach((url, index) => {
          console.log(`${index === 0 ? 'Primary' : 'Spouse'}: ${url}`);
        });
        console.log("Open these URLs in your browser to view the test emails");
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