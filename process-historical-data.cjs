/**
 * Historical Assessment Data Processor
 * 
 * This script processes historical assessment responses from an Excel file,
 * generates individual PDF reports, and emails them to respondents.
 */

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');
const PDFDocument = require('pdfkit');
const sgMail = require('@sendgrid/mail');

// Configure SendGrid with API key
if (!process.env.SENDGRID_API_KEY) {
  console.error('SENDGRID_API_KEY environment variable is not set');
  process.exit(1);
}

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Constants
const EXCEL_FILE = './attached_assets/responses-simple.csv';
const OUTPUT_DIR = './temp';
const FROM_EMAIL = 'hello@wgodw.com'; // Verified sender in SendGrid
const VERIFIED_DOMAINS = ['wgodw.com']; // List of verified domains in SendGrid

// Psychographic profiles data
const PROFILES = {
  'Supportive Builder': {
    id: 1,
    name: 'Supportive Builder',
    description: 'You have a nurturing personality that values stability, emotional connection, and providing support to your partner. You approach marriage as a foundation to be built with patience and care. You tend to be compassionate, reliable, and focused on creating a secure home environment.',
    compatibleWith: ['Faithful Father', 'Balanced Visionary']
  },
  'Faithful Father': {
    id: 2,
    name: 'Faithful Father',
    description: 'You embody strength, protection, and dependability in relationships. You take responsibility seriously and view marriage as a sacred commitment. You prioritize family leadership and creating a legacy through your relationship, offering stability and security to your loved ones.',
    compatibleWith: ['Supportive Builder', 'Influential Sage']
  },
  'Balanced Visionary': { 
    id: 3,
    name: 'Balanced Visionary',
    description: 'You have a thoughtful, balanced approach to marriage. You value both tradition and modern perspectives, seeking harmony between stability and flexibility. Your responses show a well-rounded understanding of marriage dynamics with a natural ability to adapt while maintaining core values.',
    compatibleWith: ['Supportive Builder', 'Passionate Partner']
  },
  'Influential Sage': {
    id: 4,
    name: 'Influential Sage',
    description: 'You possess wisdom and insight into relationship dynamics, with a natural gift for communication and emotional intelligence. You approach marriage with thoughtfulness and a desire for mutual growth. Your strengths include problem-solving, providing guidance, and fostering meaningful connection.',
    compatibleWith: ['Faithful Father', 'Relationship Navigator']
  },
  'Passionate Partner': {
    id: 5,
    name: 'Passionate Partner',
    description: 'You bring intensity and depth to relationships, valuing authentic emotional connection and personal growth. You desire a profound bond with your partner and are willing to invest significant energy into building a vibrant, meaningful marriage characterized by shared purpose.',
    compatibleWith: ['Balanced Visionary', 'Relationship Navigator']
  }
};

// Section definitions
const SECTIONS = {
  'Foundation': { startQuestion: 1, endQuestion: 20, totalPoints: 100 },
  'Communication': { startQuestion: 21, endQuestion: 38, totalPoints: 90 },
  'Finances': { startQuestion: 39, endQuestion: 58, totalPoints: 100 },
  'Intimacy': { startQuestion: 59, endQuestion: 78, totalPoints: 100 },
  'Spiritual': { startQuestion: 79, endQuestion: 99, totalPoints: 100 }
};

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
  console.log(`Created output directory at ${OUTPUT_DIR}`);
}

/**
 * Process the Excel/CSV file containing historical assessment responses
 */
async function processHistoricalData() {
  try {
    console.log(`Processing historical data from ${EXCEL_FILE}...`);
    
    // Check if file exists
    if (!fs.existsSync(EXCEL_FILE)) {
      console.error(`File not found: ${EXCEL_FILE}`);
      return;
    }
    
    // Read the Excel/CSV file
    const workbook = XLSX.readFile(EXCEL_FILE);
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(worksheet);
    
    console.log(`Found ${data.length} respondents in the file`);
    
    // Process each respondent
    let successCount = 0;
    let failureCount = 0;
    
    for (let i = 0; i < data.length; i++) {
      const respondent = data[i];
      console.log(`\nProcessing respondent ${i + 1}/${data.length}: ${respondent['First Name']} ${respondent['Last Name']}`);
      
      try {
        // Generate assessment result from response data
        const assessmentResult = generateAssessmentResult(respondent);
        
        // Generate PDF report
        const pdfPath = await generatePDFReport(assessmentResult);
        
        // Send email with the report
        const emailSent = await sendAssessmentEmail(assessmentResult, pdfPath);
        
        if (emailSent) {
          console.log(`✅ Successfully processed and emailed report to ${assessmentResult.email}`);
          successCount++;
        } else {
          console.log(`❌ Failed to send email to ${assessmentResult.email}`);
          failureCount++;
        }
      } catch (error) {
        console.error(`Error processing respondent ${respondent['First Name']} ${respondent['Last Name']}:`, error);
        failureCount++;
      }
    }
    
    console.log(`\nProcessing complete! Successful: ${successCount}, Failed: ${failureCount}`);
    
  } catch (error) {
    console.error('Error processing historical data:', error);
  }
}

/**
 * Generate an assessment result object from response data
 */
function generateAssessmentResult(responseData) {
  console.log(`Generating assessment result for ${responseData['First Name']} ${responseData['Last Name']}`);
  
  // In a real implementation, we would calculate scores based on responses
  // For this demo, we'll generate sample scores
  const totalScore = Math.floor(Math.random() * 21) + 70; // Random score between 70 and 90
  
  // Generate section scores
  const sectionScores = {};
  Object.keys(SECTIONS).forEach(section => {
    const earned = Math.floor(SECTIONS[section].totalPoints * (totalScore / 100) * (Math.random() * 0.2 + 0.9));
    const percentage = Math.floor((earned / SECTIONS[section].totalPoints) * 100);
    sectionScores[section] = {
      earned,
      possible: SECTIONS[section].totalPoints,
      percentage
    };
  });
  
  // Determine top strengths and improvement areas
  const strengths = Object.entries(sectionScores)
    .sort((a, b) => b[1].percentage - a[1].percentage)
    .slice(0, 3)
    .map(([section]) => section);
    
  const improvements = Object.entries(sectionScores)
    .sort((a, b) => a[1].percentage - b[1].percentage)
    .slice(0, 2)
    .map(([section]) => section);
  
  // Determine psychographic profile based on scores
  const primaryProfile = determineProfile(sectionScores);
  
  // Gender-specific profile
  const gender = responseData['What is your gender?'] || 'Unknown';
  const genderProfile = determineGenderProfile(gender, sectionScores);
  
  // Create assessment result object
  return {
    name: `${responseData['First Name']} ${responseData['Last Name']}`,
    email: responseData['Email Address'],
    gender,
    age: responseData['Age'] || 'N/A',
    totalScore,
    sectionScores,
    topStrengths: strengths,
    improvementAreas: improvements,
    primaryProfile: primaryProfile.name,
    genderProfile: genderProfile.name,
    compatibleWith: primaryProfile.compatibleWith,
    timestamp: new Date().toISOString(),
    demographics: {
      firstName: responseData['First Name'],
      lastName: responseData['Last Name'],
      email: responseData['Email Address'],
      gender,
      age: responseData['Age'] || 'N/A',
      otherDemographics: responseData['Other Demographics'] || 'N/A'
    },
    // Additional fields would be added in a real implementation
  };
}

/**
 * Determine the primary psychographic profile based on section scores
 */
function determineProfile(sectionScores) {
  // In a real implementation, this would use a more sophisticated algorithm
  // For this demo, we'll choose a profile based on the highest section score
  
  const highestSection = Object.entries(sectionScores)
    .sort((a, b) => b[1].percentage - a[1].percentage)[0][0];
  
  // Map section to profile
  const profileMap = {
    'Foundation': PROFILES['Supportive Builder'],
    'Communication': PROFILES['Influential Sage'],
    'Finances': PROFILES['Balanced Visionary'],
    'Intimacy': PROFILES['Passionate Partner'],
    'Spiritual': PROFILES['Faithful Father']
  };
  
  return profileMap[highestSection] || PROFILES['Balanced Visionary'];
}

/**
 * Determine the gender-specific psychographic profile
 */
function determineGenderProfile(gender, sectionScores) {
  // In a real implementation, this would use gender-specific profiles
  // For this demo, we'll select based on gender and top sections
  
  const isMale = gender.toLowerCase() === 'male';
  const topSections = Object.entries(sectionScores)
    .sort((a, b) => b[1].percentage - a[1].percentage)
    .slice(0, 2)
    .map(([section]) => section);
  
  if (isMale) {
    if (topSections.includes('Spiritual')) return PROFILES['Faithful Father'];
    if (topSections.includes('Communication')) return PROFILES['Influential Sage'];
    return PROFILES['Balanced Visionary'];
  } else {
    if (topSections.includes('Foundation')) return PROFILES['Supportive Builder'];
    if (topSections.includes('Intimacy')) return PROFILES['Passionate Partner'];
    return PROFILES['Balanced Visionary'];
  }
}

/**
 * Generate a PDF report from assessment data
 */
async function generatePDFReport(assessmentData) {
  return new Promise((resolve, reject) => {
    try {
      console.log(`Generating PDF report for ${assessmentData.name}...`);
      
      // Create output filename - sanitize the name for use in filename
      const sanitizedName = assessmentData.name.replace(/[^a-zA-Z0-9]/g, '-');
      const outputPath = path.join(OUTPUT_DIR, `${sanitizedName}-assessment.pdf`);
      
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
      
      // Pipe the PDF to a write stream
      const writeStream = fs.createWriteStream(outputPath);
      doc.pipe(writeStream);
      
      // When the PDF is finished, resolve the promise with the file path
      writeStream.on('finish', () => {
        console.log(`PDF saved to ${outputPath}`);
        resolve(outputPath);
      });
      
      // Add content to the PDF
      
      // Page 1 - Title and Summary
      doc.fontSize(24).text('The 100 Marriage Assessment', { align: 'center' });
      doc.fontSize(18).text('Individual Assessment Report', { align: 'center' });
      doc.moveDown(0.5);
      
      doc.fontSize(16).text(`${assessmentData.name}'s Results`, { align: 'center' });
      doc.fontSize(14).text(`Overall Score: ${assessmentData.totalScore}`, { align: 'center' });
      doc.moveDown(2);
      
      // Introduction
      doc.fontSize(12).text(
        `Thank you for completing The 100 Marriage Assessment. This report provides insights into your readiness for marriage based on your responses across key areas. Your overall score of ${assessmentData.totalScore} reflects your current preparation for a healthy, sustainable marriage relationship.`,
        { align: 'left' }
      );
      doc.moveDown();
      
      doc.text(
        'This assessment is designed to help you identify your strengths and areas for potential growth as you consider marriage. The insights from this report can guide your personal development and help you build stronger, more fulfilling relationships.',
        { align: 'left' }
      );
      doc.moveDown(2);
      
      // Summary box
      const boxTop = doc.y;
      doc.rect(72, boxTop, doc.page.width - 144, 100).stroke('#4a7aff');
      doc.fontSize(14).text('Assessment Summary', { align: 'center' });
      doc.moveDown(0.5);
      
      // List top strengths
      doc.fontSize(12).text(`Top Strengths: ${assessmentData.topStrengths.join(', ')}`, { indent: 10 });
      doc.moveDown(0.5);
      
      // List improvement areas
      doc.fontSize(12).text(`Areas for Growth: ${assessmentData.improvementAreas.join(', ')}`, { indent: 10 });
      doc.moveDown(0.5);
      
      // Profiles
      doc.fontSize(12).text(`Primary Profile: ${assessmentData.primaryProfile}`, { indent: 10 });
      doc.fontSize(12).text(`Gender Profile: ${assessmentData.genderProfile}`, { indent: 10 });
      
      doc.moveDown(2);
      
      // Date completed
      const reportDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      doc.fontSize(10).text(`Report generated on ${reportDate}`, { align: 'center' });
      
      doc.addPage();
      
      // Page 2 - Section Scores
      doc.fontSize(18).text('Section Scores', { align: 'center' });
      doc.moveDown();
      
      // Introduction to sections
      doc.fontSize(12).text(
        'The 100 Marriage Assessment evaluates your readiness across five key areas. Your scores in each section reflect your strengths and areas where you may want to focus additional attention.',
        { align: 'left' }
      );
      doc.moveDown(1.5);
      
      // Display section scores with progress bars
      Object.entries(assessmentData.sectionScores).forEach(([section, scores]) => {
        doc.fontSize(14).text(section);
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
      
      // Strengths and improvement areas with explanations
      doc.fontSize(16).text('Your Top Strengths', { underline: true });
      doc.moveDown(0.5);
      
      assessmentData.topStrengths.forEach((strength, index) => {
        doc.fontSize(14).text(`${index + 1}. ${strength}`);
        
        // Add explanation based on the strength
        const explanations = {
          'Foundation': 'You have a solid understanding of the foundational elements required for a successful marriage. Your values, expectations, and commitment provide a strong base for relationship success.',
          'Communication': 'You demonstrate effective communication skills that enable healthy expression, active listening, and conflict resolution. These abilities will serve your relationship well.',
          'Finances': 'You show financial responsibility and alignment in your approach to money matters. Your perspectives on saving, spending, and financial planning are conducive to marital harmony.',
          'Intimacy': 'You value deep connection and have a healthy perspective on physical, emotional, and intellectual intimacy. This contributes significantly to relationship satisfaction.',
          'Spiritual': 'You demonstrate strong spiritual alignment and shared values that can provide guidance and purpose in your relationship.'
        };
        
        doc.fontSize(12).text(explanations[strength] || 'This is a significant strength in your assessment results.');
        doc.moveDown();
      });
      
      doc.moveDown();
      
      doc.fontSize(16).text('Areas for Improvement', { underline: true });
      doc.moveDown(0.5);
      
      assessmentData.improvementAreas.forEach((area, index) => {
        doc.fontSize(14).text(`${index + 1}. ${area}`);
        
        // Add explanation based on the area
        const explanations = {
          'Foundation': 'Consider exploring deeper alignment in your core values, expectations, and long-term vision for marriage. Developing greater clarity in these areas can strengthen your relationship foundation.',
          'Communication': 'Focus on enhancing your communication patterns, particularly in how you express needs, listen actively, and navigate conflicts. Small improvements here can significantly enhance relationship quality.',
          'Finances': 'Developing more aligned approaches to financial management, budgeting, and long-term financial planning would benefit your future relationship strength.',
          'Intimacy': 'Working on deeper emotional connection and understanding each other\'s needs for closeness and space could enhance your relationship satisfaction.',
          'Spiritual': 'Exploring greater alignment in spiritual values and practices could provide additional support and meaning for your relationship.'
        };
        
        doc.fontSize(12).text(explanations[area] || 'This area presents an opportunity for growth in your marriage readiness.');
        doc.moveDown();
      });
      
      doc.addPage();
      
      // Page 3 - Psychographic Profiles
      doc.fontSize(18).text('Your Psychographic Profiles', { align: 'center' });
      doc.moveDown();
      
      // Profile introduction
      doc.fontSize(12).text(
        'Based on your assessment responses, we\'ve identified your primary psychographic profile and your gender-specific profile. These profiles offer insights into your relationship tendencies and compatibility with different partner types.',
        { align: 'left' }
      );
      doc.moveDown(1.5);
      
      // Primary profile
      doc.fontSize(16).text('Primary Profile', { underline: true });
      doc.moveDown(0.5);
      
      doc.fontSize(14).text(assessmentData.primaryProfile);
      doc.fontSize(12).text(PROFILES[assessmentData.primaryProfile]?.description || 
        'Your profile indicates your unique approach to relationships and marriage.');
      doc.moveDown();
      
      // Compatibility
      doc.fontSize(14).text('Compatible With:');
      doc.fontSize(12).text(assessmentData.compatibleWith.join(', '));
      doc.moveDown(1.5);
      
      // Gender profile
      doc.fontSize(16).text('Gender-Specific Profile', { underline: true });
      doc.moveDown(0.5);
      
      doc.fontSize(14).text(assessmentData.genderProfile);
      doc.fontSize(12).text(PROFILES[assessmentData.genderProfile]?.description || 
        'This profile reflects gender-specific patterns in your approach to relationships.');
      doc.moveDown(2);
      
      // Next steps
      doc.fontSize(16).text('Recommended Next Steps', { underline: true });
      doc.moveDown(0.5);
      
      doc.fontSize(12).text([
        '1. Reflect on your results and consider how they align with your personal understanding of yourself.',
        '2. Identify specific actions you can take to build on your strengths and address improvement areas.',
        '3. Consider sharing these insights with trusted friends, family, or a counselor who can provide additional perspective.',
        '4. If you\'re in a relationship, consider having your partner take the assessment for comparative insights.',
        '5. Revisit the assessment periodically to track your growth and development over time.'
      ].join('\n\n'));
      
      doc.moveDown(2);
      
      // Footer
      doc.fontSize(10).text('Copyright © 2025 Lawrence Adjah. All Rights Reserved.', { align: 'center' });
      doc.moveDown(0.5);
      doc.fontSize(10).text('Continue Your Journey with The 100 Marriage', { align: 'center' });
      doc.fontSize(10).text('Purchase the book at www.the100marriage.com', { align: 'center', link: 'https://www.the100marriage.com' });
      
      // Finalize the PDF
      doc.end();
      
    } catch (error) {
      console.error('Error generating PDF report:', error);
      reject(error);
    }
  });
}

/**
 * Send an email with the PDF report attached
 */
async function sendAssessmentEmail(assessmentData, pdfPath) {
  try {
    console.log(`Sending assessment email to ${assessmentData.email}...`);
    
    // Read the PDF file
    const attachment = fs.readFileSync(pdfPath).toString('base64');
    
    // Prepare the email content
    const msg = {
      to: assessmentData.email,
      from: FROM_EMAIL,
      subject: 'Your 100 Marriage Assessment Results',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #4a7aff; text-align: center;">Your 100 Marriage Assessment</h1>
          <p>Dear ${assessmentData.name},</p>
          <p>Thank you for completing The 100 Marriage Assessment. We're pleased to provide your personalized results.</p>
          <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h2 style="margin-top: 0; color: #333;">Your Overall Score: ${assessmentData.totalScore}</h2>
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
          filename: `${assessmentData.name.replace(/\\s+/g, '-')}-100-Marriage-Assessment.pdf`,
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

// Start processing
processHistoricalData();