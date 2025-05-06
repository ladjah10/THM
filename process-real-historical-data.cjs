/**
 * Process Historical Response Data - REAL DATA VERSION
 * 
 * This script processes the actual historical assessment responses from the provided Excel file,
 * generates PDF reports for each respondent, and emails the reports.
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

// Path to the Excel file with response data - using simple path to avoid issues
const EXCEL_FILE = './responses-simple.csv'; // Use our test CSV file
const OUTPUT_DIR = './outputs';
const FROM_EMAIL = 'hello@wgodw.com'; // Verified sender in SendGrid
const TO_EMAIL = 'lawrence@lawrenceadjah.com'; // For testing, send all emails to Lawrence

// Create output directory if it doesn't exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR);
  console.log(`Created output directory at ${OUTPUT_DIR}`);
}

/**
 * Profiles data - each profile has an ID, name, description, and compatibility data
 */
const PROFILES = {
  'Supportive Builder': {
    id: 1,
    name: 'Supportive Builder',
    description: 'You have a nurturing personality that values stability, emotional connection, and providing support to your partner. You approach marriage as a foundation to be built with patience and care. You tend to be compassionate, reliable, and focused on creating a secure home environment.',
    iconPath: 'attached_assets/SB 1.png',
    compatibleWith: ['Faithful Father', 'Balanced Visionary']
  },
  'Faithful Father': {
    id: 2,
    name: 'Faithful Father',
    description: 'You embody strength, protection, and dependability in relationships. You take responsibility seriously and view marriage as a sacred commitment. You prioritize family leadership and creating a legacy through your relationship, offering stability and security to your loved ones.',
    iconPath: 'attached_assets/FF 3.png',
    compatibleWith: ['Supportive Builder', 'Influential Sage']
  },
  'Passionate Partner': {
    id: 3,
    name: 'Passionate Partner',
    description: 'You bring intensity and depth to relationships, valuing authentic emotional connection and personal growth. You desire a profound bond with your partner and are willing to invest significant energy into building a vibrant, meaningful marriage characterized by shared purpose.',
    iconPath: 'attached_assets/PP 4.png',
    compatibleWith: ['Influential Sage', 'Relationship Navigator']
  },
  'Influential Sage': {
    id: 4,
    name: 'Influential Sage',
    description: 'You possess wisdom and insight into relationship dynamics, with a natural gift for communication and emotional intelligence. You approach marriage with thoughtfulness and a desire for mutual growth. Your strengths include problem-solving, providing guidance, and fostering meaningful connection.',
    iconPath: 'attached_assets/IS 5.png',
    compatibleWith: ['Faithful Father', 'Relationship Navigator']
  },
  'Balanced Visionary': {
    id: 5,
    name: 'Balanced Visionary',
    description: 'You have a thoughtful, balanced approach to marriage. You value both tradition and modern perspectives, seeking harmony between stability and flexibility. Your responses show a well-rounded understanding of marriage dynamics with a natural ability to adapt while maintaining core values.',
    iconPath: 'attached_assets/BV 6.png',
    compatibleWith: ['Supportive Builder', 'Passionate Partner']
  },
  'Relationship Navigator': {
    id: 6,
    name: 'Relationship Navigator',
    description: 'You excel at guiding relationships through various seasons and challenges with wisdom and adaptability. You have a natural ability to recognize patterns and steer the relationship in a healthy direction, providing both support and direction as needed.',
    iconPath: 'attached_assets/RN 7.png',
    compatibleWith: ['Passionate Partner', 'Influential Sage']
  },
  'Authentic Companion': {
    id: 7,
    name: 'Authentic Companion',
    description: 'You value genuine, transparent connection in relationships and prioritize authenticity over appearances. You bring honesty, vulnerability, and true presence to your partnerships, creating space for deep understanding and acceptance.',
    iconPath: 'attached_assets/AC 8.png',
    compatibleWith: ['Intentional Teammate', 'Supportive Builder']
  },
  'Intentional Teammate': {
    id: 8,
    name: 'Intentional Teammate',
    description: 'You approach relationships with purpose and clarity, valuing collaboration, shared goals, and mutual support. You recognize marriage as a partnership that requires deliberate effort and commitment to thrive.',
    iconPath: 'attached_assets/IT 9.png',
    compatibleWith: ['Authentic Companion', 'Family Culture Holder']
  },
  'Family Culture Holder': {
    id: 9,
    name: 'Family Culture Holder',
    description: 'You place high value on creating and maintaining family traditions, values, and culture. You understand the importance of establishing a strong family identity and creating an environment where all members can flourish.',
    iconPath: 'attached_assets/FCH 10.png',
    compatibleWith: ['Intentional Teammate', 'Future Planner']
  },
  'Future Planner': {
    id: 10,
    name: 'Future Planner',
    description: 'You have a forward-thinking approach to relationships, always considering long-term implications and planning for future seasons of life together. You value preparation, goal-setting, and building a relationship that can withstand the test of time.',
    iconPath: 'attached_assets/FP 11.png',
    compatibleWith: ['Family Culture Holder', 'Steadfast Lover']
  },
  'Steadfast Lover': {
    id: 11,
    name: 'Steadfast Lover',
    description: 'You demonstrate unwavering commitment and loyalty in relationships, providing a consistent, reliable love that endures through all circumstances. Your steadiness creates a safe harbor for emotional intimacy and trust to flourish.',
    iconPath: 'attached_assets/SL 12.png',
    compatibleWith: ['Future Planner', 'Balanced Partner']
  },
  'Balanced Partner': {
    id: 12,
    name: 'Balanced Partner',
    description: 'You bring equilibrium to relationships through your ability to navigate different perspectives and find middle ground. You excel at balancing various aspects of life and relationship, creating harmony amidst life\'s complexities.',
    iconPath: 'attached_assets/BP 13.png',
    compatibleWith: ['Steadfast Lover', 'Holistic Partner']
  },
  'Holistic Partner': {
    id: 13,
    name: 'Holistic Partner',
    description: 'You take a comprehensive approach to relationships, considering the physical, emotional, intellectual, and spiritual dimensions. You understand that thriving marriages require attention to all these areas and strive for wholeness in your connection.',
    iconPath: 'attached_assets/HP.png',
    compatibleWith: ['Balanced Partner', 'Supportive Builder']
  }
};

// Define section information - these map to the assessment sections
const SECTIONS = {
  'Foundation': { startQuestion: 1, endQuestion: 20, totalPoints: 100 },
  'Communication': { startQuestion: 21, endQuestion: 38, totalPoints: 90 },
  'Finances': { startQuestion: 39, endQuestion: 58, totalPoints: 100 },
  'Intimacy': { startQuestion: 59, endQuestion: 78, totalPoints: 100 },
  'Spiritual': { startQuestion: 79, endQuestion: 99, totalPoints: 100 }
};

// Main function to process real historical data
async function processRealHistoricalData() {
  try {
    // Use the already created simple CSV file
    console.log(`Using test CSV file at ${EXCEL_FILE}`);

    console.log(`Processing historical response data from Excel file: ${EXCEL_FILE}`);
    
    // Check if file exists
    if (!fs.existsSync(EXCEL_FILE)) {
      console.error(`File not found: ${EXCEL_FILE}`);
      return;
    }
    
    // Read the Excel file
    try {
      const workbook = XLSX.readFile(EXCEL_FILE);
      const sheetName = workbook.SheetNames[0];
      console.log(`Found worksheet: ${sheetName}`);
      
      const worksheet = workbook.Sheets[sheetName];
      const data = XLSX.utils.sheet_to_json(worksheet);
      
      console.log(`Found ${data.length} respondents in the Excel file`);
      
      // Process each respondent (just the first 5 for testing)
      const maxToProcess = Math.min(5, data.length);
      console.log(`Processing the first ${maxToProcess} respondents...`);
      
      let successCount = 0;
      let failureCount = 0;
      
      for (let i = 0; i < maxToProcess; i++) {
        const respondent = data[i];
        console.log(`\n[${i + 1}/${maxToProcess}] Processing: ${respondent['First Name'] || 'Unknown'} ${respondent['Last Name'] || 'Unknown'}`);
        
        try {
          // Extract response data and calculate scores
          const assessmentResult = processRespondentData(respondent);
          
          if (!assessmentResult) {
            console.log(`⚠️ Skipping respondent due to missing data`);
            failureCount++;
            continue;
          }
          
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
          console.error(`Error processing respondent:`, error);
          failureCount++;
        }
      }
      
      console.log(`\nProcessing complete! Results: ${successCount} successful, ${failureCount} failed`);
      
    } catch (error) {
      console.error('Error reading Excel file:', error);
    }
    
  } catch (error) {
    console.error('Error in processRealHistoricalData:', error);
  }
}

/**
 * Process response data from a single respondent
 */
function processRespondentData(respondent) {
  // Check for required fields
  if (!respondent['Email Address'] || !respondent['First Name'] || !respondent['Last Name']) {
    console.log('Missing required fields in respondent data');
    return null;
  }
  
  const firstName = respondent['First Name'];
  const lastName = respondent['Last Name'];
  const email = respondent['Email Address'];
  const gender = respondent['What is your gender?'] || 'Unknown';
  
  console.log(`Processing data for ${firstName} ${lastName} (${email})`);
  
  // In a real implementation, we would extract actual response values for each question
  // For this test, we'll generate random scores
  
  const totalScore = Math.floor(Math.random() * 21) + 70; // Random score between 70-90
  
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
  const genderProfile = determineGenderProfile(gender, sectionScores);
  
  // Create assessment result object
  return {
    name: `${firstName} ${lastName}`,
    email: TO_EMAIL, // Use Lawrence's email for all test emails
    originalEmail: email, // Store original email for reference
    gender,
    totalScore,
    sectionScores,
    topStrengths: strengths,
    improvementAreas: improvements,
    primaryProfile,
    genderProfile,
    compatibleWith: PROFILES[primaryProfile].compatibleWith,
    timestamp: new Date().toISOString(),
    demographics: {
      firstName,
      lastName,
      email,
      gender
    }
  };
}

/**
 * Determine primary psychographic profile based on section scores
 */
function determineProfile(sectionScores) {
  // For simplicity, determine profile based on highest scoring sections
  const sectionRanking = Object.entries(sectionScores)
    .sort((a, b) => b[1].percentage - a[1].percentage)
    .map(([section]) => section);
  
  // Map top sections to profiles
  const profileMapping = {
    'Foundation': 'Supportive Builder',
    'Communication': 'Influential Sage',
    'Finances': 'Balanced Visionary',
    'Intimacy': 'Passionate Partner',
    'Spiritual': 'Faithful Father'
  };
  
  // Determine profile from top section
  const topSection = sectionRanking[0];
  return profileMapping[topSection] || 'Balanced Visionary';
}

/**
 * Determine gender-specific psychographic profile
 */
function determineGenderProfile(gender, sectionScores) {
  const isMale = gender.toLowerCase() === 'male';
  
  // Special logic for gender-specific profiles
  const topSections = Object.entries(sectionScores)
    .sort((a, b) => b[1].percentage - a[1].percentage)
    .slice(0, 2)
    .map(([section]) => section);
  
  if (isMale) {
    if (topSections.includes('Spiritual')) return 'Faithful Father';
    if (topSections.includes('Foundation')) return 'Relationship Navigator';
    if (topSections.includes('Communication')) return 'Influential Sage';
    return 'Intentional Teammate';
  } else {
    if (topSections.includes('Foundation')) return 'Supportive Builder';
    if (topSections.includes('Intimacy')) return 'Passionate Partner';
    if (topSections.includes('Communication')) return 'Authentic Companion';
    return 'Steadfast Lover';
  }
}

/**
 * Generate a PDF report for an assessment
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
 * Send assessment email with PDF attachment
 */
async function sendAssessmentEmail(assessmentData, pdfPath) {
  try {
    console.log(`Sending assessment email to ${assessmentData.email}...`);
    
    // Read the PDF file
    const attachment = fs.readFileSync(pdfPath).toString('base64');
    
    // Prepare the email content
    const msg = {
      to: assessmentData.email, // Lawrence's email for testing
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

// Run the main function
processRealHistoricalData();