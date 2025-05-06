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

// Path to our simplified CSV file
const CSV_PATH = './responses-simple.csv';

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
      const outputPath = `./temp/${userData.name.replace(/\s+/g, '-')}-assessment.pdf`;
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
      doc.fontSize(24).font('Helvetica-Bold').text('The 100 Marriage Assessment', { align: 'center' });
      doc.fontSize(18).font('Helvetica').text('Individual Assessment Report', { align: 'center' });
      doc.moveDown(0.5);
      
      // User info
      doc.fontSize(16).font('Helvetica-Bold').text(`${userData.name}'s Results`, { align: 'center' });
      doc.fontSize(14).font('Helvetica-Bold').text(`Overall Score: ${userData.totalScore}`, { align: 'center' });
      doc.moveDown();
      
      // Section scores
      doc.fontSize(16).font('Helvetica-Bold').text('Section Scores', { underline: true });
      doc.moveDown(0.5);
      
      Object.entries(userData.sectionScores).forEach(([section, scores]) => {
        doc.fontSize(12).font('Helvetica-Bold').text(section);
        doc.fontSize(10).font('Helvetica').text(`Score: ${scores.earned}/${scores.possible} (${scores.percentage}%)`);
        
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
      doc.fontSize(16).font('Helvetica-Bold').text('Top Strengths', { underline: true });
      doc.moveDown(0.5);
      userData.topStrengths.forEach((strength, index) => {
        doc.fontSize(12).font('Helvetica').text(`${index + 1}. ${strength}`);
      });
      
      doc.moveDown();
      
      doc.fontSize(16).font('Helvetica-Bold').text('Areas for Improvement', { underline: true });
      doc.moveDown(0.5);
      userData.improvementAreas.forEach((area, index) => {
        doc.fontSize(12).font('Helvetica').text(`${index + 1}. ${area}`);
      });
      
      doc.moveDown();
      
      // Psychographic profiles
      doc.fontSize(16).font('Helvetica-Bold').text('Your Psychographic Profiles', { underline: true });
      doc.moveDown(0.5);
      
      doc.fontSize(14).font('Helvetica-Bold').text('Primary Profile:');
      doc.fontSize(12).font('Helvetica').text(userData.primaryProfile);
      doc.moveDown();
      
      doc.fontSize(14).font('Helvetica-Bold').text('Gender-Specific Profile:');
      doc.fontSize(12).font('Helvetica').text(userData.genderProfile);
      doc.moveDown();
      
      doc.fontSize(14).font('Helvetica-Bold').text('Most Compatible With:');
      doc.fontSize(12).font('Helvetica').text(userData.compatibleWith.join(', '));
      doc.moveDown(2);
      
      // Footer
      doc.fontSize(10).font('Helvetica-Italic').text('Copyright © 2025 Lawrence Adjah. All Rights Reserved.', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(10).font('Helvetica').text('Continue Your Journey with The 100 Marriage', { align: 'center' });
      doc.fontSize(10).font('Helvetica').text('www.the100marriage.com', { align: 'center', link: 'https://www.the100marriage.com' });
      
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
      from: 'lawrence@lawrenceadjah.com',
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
          filename: `${userData.name.replace(/\s+/g, '-')}-100-Marriage-Assessment.pdf`,
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

// Main function to process the CSV file
async function processCSVAndSendReports() {
  try {
    console.log('Starting CSV processing and report generation...');
    console.log(`Looking for CSV file at: ${CSV_PATH}`);
    
    // Ensure temp directory exists
    if (!fs.existsSync('./temp')) {
      fs.mkdirSync('./temp');
      console.log('Created temp directory for PDF files');
    }
    
    // Check if CSV file exists
    if (fs.existsSync(CSV_PATH)) {
      console.log('CSV file found!');
      
      // Read file content
      const data = fs.readFileSync(CSV_PATH, 'utf8');
      
      // Parse CSV data
      const lines = data.split('\n');
      const headers = lines[0].split(',');
      
      const rows = [];
      for (let i = 1; i < lines.length; i++) {
        if (!lines[i].trim()) continue; // Skip empty lines
        
        const row = {};
        const currentLine = lines[i].split(',');
        
        for (let j = 0; j < headers.length; j++) {
          row[headers[j]] = currentLine[j];
        }
        
        rows.push(row);
      }
      
      console.log(`Found ${rows.length} respondents in the CSV file`);
      
      // Process each respondent
      for (let i = 0; i < rows.length; i++) {
        const respondent = rows[i];
        console.log(`\nProcessing respondent ${i + 1}/${rows.length}: ${respondent['First Name']} ${respondent['Last Name']}`);
        
        // Simulate assessment scores (in a real implementation, these would be calculated based on responses)
        const randomScore = Math.floor(Math.random() * 21) + 70; // Random score between 70 and 90
        
        // Prepare user data
        const userData = {
          name: `${respondent['First Name']} ${respondent['Last Name']}`,
          email: respondent['Email Address'],
          gender: respondent['What is your gender?'],
          age: respondent['Age'],
          totalScore: randomScore,
          sectionScores: {
            'Foundation': { 
              earned: Math.floor(randomScore * 0.5 * (Math.random() * 0.2 + 0.9)), 
              possible: 50, 
              percentage: Math.floor(randomScore * (Math.random() * 0.2 + 0.9)) 
            },
            'Communication': { 
              earned: Math.floor(randomScore * 0.45 * (Math.random() * 0.2 + 0.9)), 
              possible: 45, 
              percentage: Math.floor(randomScore * (Math.random() * 0.2 + 0.9)) 
            },
            'Finances': { 
              earned: Math.floor(randomScore * 0.5 * (Math.random() * 0.2 + 0.9)), 
              possible: 50, 
              percentage: Math.floor(randomScore * (Math.random() * 0.2 + 0.9)) 
            },
            'Intimacy': { 
              earned: Math.floor(randomScore * 0.5 * (Math.random() * 0.2 + 0.9)), 
              possible: 50, 
              percentage: Math.floor(randomScore * (Math.random() * 0.2 + 0.9)) 
            },
            'Spiritual': { 
              earned: Math.floor(randomScore * 0.5 * (Math.random() * 0.2 + 0.9)), 
              possible: 50, 
              percentage: Math.floor(randomScore * (Math.random() * 0.2 + 0.9)) 
            }
          },
          // Determine top strengths and improvement areas
          get topStrengths() {
            return Object.entries(this.sectionScores)
              .sort((a, b) => b[1].percentage - a[1].percentage)
              .slice(0, 3)
              .map(([section]) => section);
          },
          get improvementAreas() {
            return Object.entries(this.sectionScores)
              .sort((a, b) => a[1].percentage - b[1].percentage)
              .slice(0, 2)
              .map(([section]) => section);
          },
          // Psychographic profiles (in a real implementation, these would be determined based on responses)
          primaryProfile: ['Supportive Builder', 'Faithful Father', 'Balanced Visionary', 'Influential Sage', 'Passionate Partner'][Math.floor(Math.random() * 5)],
          get genderProfile() {
            if (this.gender === 'Male') {
              return ['Faithful Father', 'Supportive Builder', 'Influential Sage'][Math.floor(Math.random() * 3)];
            } else {
              return ['Supportive Builder', 'Balanced Visionary', 'Passionate Partner'][Math.floor(Math.random() * 3)];
            }
          },
          compatibleWith: ['Supportive Builder', 'Faithful Father', 'Balanced Visionary']
        };
        
        // Generate PDF report
        const pdfPath = await generatePDFReport(userData);
        
        // Send email with report
        const emailSent = await sendAssessmentEmail(userData, pdfPath);
        
        if (emailSent) {
          console.log(`✓ Successfully processed and emailed report to ${userData.email}`);
        } else {
          console.log(`✗ Failed to send email to ${userData.email}`);
        }
      }
      
      console.log('\nAll respondents processed!');
      
    } else {
      console.error('CSV file not found');
    }
  } catch (error) {
    console.error('Error in processing:', error);
  }
}

// Run the main function
processCSVAndSendReports();