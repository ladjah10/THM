import { sendAssessmentEmail } from './server/sendgrid.js';

// Simple test to validate email functionality
async function testEmailDelivery() {
  console.log("🧪 Starting email delivery test...");
  
  // Create a minimal PDF buffer for testing
  const testPdfBuffer = Buffer.from("PDF test content - this would be a real PDF in production");
  
  try {
    const result = await sendAssessmentEmail(
      'la@lawrenceadjah.com',
      'Test Email from THM Assessment System',
      'This is a test email to validate the email delivery system functionality.',
      testPdfBuffer,
      '<h2>Test Email</h2><p>This is a test email from the THM Assessment System to validate email delivery.</p>'
    );
    
    console.log("📧 Email test result:", result);
    
    if (result.success) {
      console.log("✅ Email test successful - delivery system is working");
    } else {
      console.log("❌ Email test failed:", result.error);
    }
  } catch (error) {
    console.error("🚨 Email test error:", error);
  }
}

testEmailDelivery();