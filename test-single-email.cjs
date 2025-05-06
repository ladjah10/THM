const fs = require('fs');
const path = require('path');
const PDFDocument = require('pdfkit');
const sgMail = require('@sendgrid/mail');

// Configure SendGrid with API key
if (!process.env.SENDGRID_API_KEY) {
  console.error('SENDGRID_API_KEY environment variable is not set');
  process.exit(1);
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Prepare a directory for temporary files
if (!fs.existsSync('./temp')) {
  fs.mkdirSync('./temp');
  console.log('Created temp directory for PDF files');
}

// Test data for a single user
const userData = {
  name: "John Smith",
  email: "lawrence@lawrenceadjah.com", // Using the project owner's email for testing
  gender: "Male",
  age: "32",
  totalScore: 85,
  sectionScores: {
    'Foundation': { earned: 42, possible: 50, percentage: 84 },
    'Communication': { earned: 38, possible: 45, percentage: 84 },
    'Finances': { earned: 40, possible: 50, percentage: 80 },
    'Intimacy': { earned: 43, possible: 50, percentage: 86 },
    'Spiritual': { earned: 45, possible: 50, percentage: 90 }
  },
  topStrengths: ['Spiritual', 'Intimacy', 'Foundation'],
  improvementAreas: ['Finances', 'Communication'],
  primaryProfile: 'Supportive Builder',
  genderProfile: 'Faithful Father',
  compatibleWith: ['Faithful Father', 'Balanced Visionary']
};

// Process a single user's assessment data and generate a PDF report
async function generatePDFReport(userData) {
  return new Promise((resolve, reject) => {
    try {
      console.log(`Generating PDF report for ${userData.name}...`);
      
      // Create a PDF document
      const doc = new PDFDocument({
        size: 'letter',
        margins: { top: 72, left: 72, right: 72, bottom: 72 },
        info: {
          Title: 'The 100 Marriage Assessment - Individual Report',
          Author: 'Lawrence Adjah',
          Subject: 'Marriage Assessment Report',
        }
      });
      
      // Create a write stream for the PDF
      const outputPath = `./temp/${userData.name.replace(/\\s+/g, '-')}-assessment.pdf`;
      const writeStream = fs.createWriteStream(outputPath);
      
      // When the PDF is finished, resolve the promise with the file path
      doc.on('end', () => {
        console.log(`PDF saved to ${outputPath}`);
        resolve(outputPath);
      });
      
      // Pipe the PDF to the write stream
      doc.pipe(writeStream);
      
      // Add content to the PDF
      
      // Title
      doc.fontSize(24).text('The 100 Marriage Assessment', { align: 'center' });
      doc.fontSize(18).text('Individual Assessment Report', { align: 'center' });
      doc.moveDown(0.5);
      
      // User info
      doc.fontSize(16).text(`${userData.name}'s Results`, { align: 'center' });
      doc.fontSize(14).text(`Overall Score: ${userData.totalScore}`, { align: 'center' });
      doc.moveDown();
      
      // Section scores
      doc.fontSize(16).text('Section Scores', { underline: true });
      doc.moveDown(0.5);
      
      Object.entries(userData.sectionScores).forEach(([section, scores]) => {
        doc.fontSize(12).text(section);
        doc.fontSize(10).text(`Score: ${scores.earned}/${scores.possible} (${scores.percentage}%)`);
        
        // Add a progress bar
        const barWidth = 300;
        const barHeight = 15;
        const fillWidth = barWidth * (scores.percentage / 100);
        
        doc.rect(72, doc.y + 5, barWidth, barHeight).stroke();
        doc.rect(72, doc.y + 5, fillWidth, barHeight).fill('#4a7aff');
        doc.moveDown(1.5);
      });
      
      doc.moveDown();
      
      // Strengths and improvement areas
      doc.fontSize(16).text('Top Strengths', { underline: true });
      doc.moveDown(0.5);
      userData.topStrengths.forEach((strength, index) => {
        doc.fontSize(12).text(`${index + 1}. ${strength}`);
      });
      
      doc.moveDown();
      
      doc.fontSize(16).text('Areas for Improvement', { underline: true });
      doc.moveDown(0.5);
      userData.improvementAreas.forEach((area, index) => {
        doc.fontSize(12).text(`${index + 1}. ${area}`);
      });
      
      doc.moveDown();
      
      // Psychographic profiles
      doc.fontSize(16).text('Your Psychographic Profiles', { underline: true });
      doc.moveDown(0.5);
      
      doc.fontSize(14).text('Primary Profile:');
      doc.fontSize(12).text(userData.primaryProfile);
      doc.moveDown();
      
      doc.fontSize(14).text('Gender-Specific Profile:');
      doc.fontSize(12).text(userData.genderProfile);
      doc.moveDown();
      
      doc.fontSize(14).text('Most Compatible With:');
      doc.fontSize(12).text(userData.compatibleWith.join(', '));
      doc.moveDown(2);
      
      // Footer
      doc.fontSize(10).text('Copyright © 2025 Lawrence Adjah. All Rights Reserved.', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(10).text('Continue Your Journey with The 100 Marriage', { align: 'center' });
      doc.fontSize(10).text('www.the100marriage.com', { align: 'center', link: 'https://www.the100marriage.com' });
      
      // Finalize the PDF
      doc.end();
      
    } catch (error) {
      console.error('Error generating PDF:', error);
      reject(error);
    }
  });
}

// Send an email with the PDF report attached
async function sendAssessmentEmail(userData, pdfPath) {
  try {
    console.log(`Sending assessment email to ${userData.email}...`);
    
    // Read the PDF file
    const attachment = fs.readFileSync(pdfPath).toString('base64');
    
    // Prepare the email content
    const msg = {
      to: userData.email,
      from: 'hello@wgodw.com', // Using a verified sender in SendGrid based on previous test scripts
      subject: 'Your 100 Marriage Assessment Results',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4a7aff; text-align: center;">Your 100 Marriage Assessment</h1>
          <p>Dear ${userData.name},</p>
          <p>Thank you for completing The 100 Marriage Assessment. We're pleased to provide your personalized results.</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: #333;">Your Overall Score: ${userData.totalScore}</h2>
            <p>This score reflects your overall readiness for marriage based on our comprehensive assessment.</p>
          </div>
          <p>For your detailed results, please see the attached PDF report. It includes:</p>
          <ul>
            <li>Section-by-section scores</li>
            <li>Your top strengths</li>
            <li>Areas for potential improvement</li>
            <li>Your psychographic profiles</li>
          </ul>
          <p>Please review your results and consider how they might help you in your journey toward successful relationships.</p>
          <p>If you have any questions about your assessment, please don't hesitate to reach out.</p>
          <p>Warm regards,<br>Lawrence Adjah</p>
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eee; font-size: 12px; color: #666;">
            <p>Copyright © 2025 Lawrence Adjah. All Rights Reserved.</p>
            <p><a href="https://www.the100marriage.com" style="color: #4a7aff;">www.the100marriage.com</a></p>
          </div>
        </div>
      `,
      attachments: [
        {
          content: attachment,
          filename: `${userData.name.replace(/\\s+/g, '-')}-100-Marriage-Assessment.pdf`,
          type: 'application/pdf',
          disposition: 'attachment'
        }
      ]
    };
    
    // Send the email
    const response = await sgMail.send(msg);
    console.log(`Email sent successfully with status code: ${response[0].statusCode}`);
    return true;
    
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error('SendGrid API error:', error.response.body);
    }
    return false;
  }
}

// Main function
async function runTest() {
  try {
    // Generate the PDF
    const pdfPath = await generatePDFReport(userData);
    
    // Send the email
    const emailSent = await sendAssessmentEmail(userData, pdfPath);
    
    if (emailSent) {
      console.log(`✅ Successfully processed and emailed test report to ${userData.email}`);
    } else {
      console.log(`❌ Failed to send test email to ${userData.email}`);
    }
  } catch (error) {
    console.error('Error in test:', error);
  }
}

// Run the test
runTest();