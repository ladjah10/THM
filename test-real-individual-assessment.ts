/**
 * This script generates and sends a realistic individual assessment
 * using the updated formatting and real data
 */

import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import sgMail from '@sendgrid/mail';
import { AssessmentResult } from './shared/schema';
import { fileURLToPath } from 'url';

// Get current directory (ESM equivalent of __dirname)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Disable image loading for this test to avoid format issues
const INCLUDE_IMAGES = false;

// Initialize SendGrid API
if (!process.env.SENDGRID_API_KEY) {
  throw new Error('SENDGRID_API_KEY environment variable is required');
}
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

// Create a realistic individual assessment
async function generateRealisticIndividualAssessment() {
  const realisticAssessment: AssessmentResult = {
    email: 'lawrence@lawrenceadjah.com', // Using the specified email
    name: 'Lawrence Adjah',
    timestamp: new Date().toISOString(),
    demographics: {
      firstName: 'Lawrence',
      lastName: 'Adjah',
      email: 'lawrence@lawrenceadjah.com',
      lifeStage: 'adult',
      birthday: '1985-06-15',
      gender: 'male',
      marriageStatus: 'married',
      desireChildren: 'yes',
      ethnicity: 'Black/African American',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      hasPurchasedBook: 'yes',
      purchaseDate: '2022-10-15'
    },
    profile: {
      id: 1,
      name: 'Balanced Visionary',
      description: 'You have a thoughtful, balanced approach to marriage. You value both tradition and modern perspectives, seeking harmony between stability and flexibility. Your approach to relationships is both grounded and forward-thinking. You demonstrate wisdom in balancing competing priorities and can typically find common ground with a wide range of personalities.',
      genderSpecific: null,
      criteria: [
        { section: 'Your Foundation', min: 75 },
        { section: 'Your Faith Life', min: 80 }
      ],
      iconPath: './attached_assets/BV 6.png'
    },
    genderProfile: {
      id: 5, 
      name: 'Steadfast Leader',
      description: 'As a male Steadfast Leader, you bring strength, vision, and stability to your relationships. You value commitment deeply and approach marriage with a sense of responsibility and purpose. You tend to be protective of your loved ones and strive to provide security and guidance. Your leadership style is principled yet adaptive to your partner\'s needs.',
      genderSpecific: 'male',
      criteria: [
        { section: 'Your Faith Life', min: 85 },
        { section: 'Your Family Life', min: 80 }
      ],
      iconPath: './attached_assets/SL 12.png'
    },
    scores: {
      overallPercentage: 87,
      totalEarned: 435,
      totalPossible: 500,
      strengths: [
        'Strong faith foundation',
        'Clear communication style',
        'Financial management',
        'Family prioritization',
        'Long-term commitment'
      ],
      improvementAreas: [
        'Work-life balance',
        'Patience during conflicts',
        'Quality time management'
      ],
      sections: {
        'Your Foundation': { earned: 90, possible: 100, percentage: 90 },
        'Your Faith Life': { earned: 95, possible: 100, percentage: 95 },
        'Your Family Life': { earned: 85, possible: 100, percentage: 85 },
        'Your Finances': { earned: 80, possible: 100, percentage: 80 },
        'Your Future': { earned: 85, possible: 100, percentage: 85 }
      }
    },
    // Gender comparison data for male respondents
    genderComparison: {
      'Your Foundation': { value: 90, average: 75, percentile: 92 },
      'Your Faith Life': { value: 95, average: 82, percentile: 97 },
      'Your Family Life': { value: 85, average: 79, percentile: 84 },
      'Your Finances': { value: 80, average: 72, percentile: 78 },
      'Your Future': { value: 85, average: 74, percentile: 86 }
    },
    responses: {
      // Sample responses to key questions
      '1': { option: 'Strongly Agree', value: 5 },
      '5': { option: 'Agree', value: 4 },
      '10': { option: 'Strongly Agree', value: 5 },
      '15': { option: 'Strongly Agree', value: 5 },
      '20': { option: 'Agree', value: 4 }
      // Additional responses would be included in a real assessment
    }
  };

  // Generate PDF
  const pdfPath = await generateIndividualPDF(realisticAssessment);
  console.log(`PDF generated at: ${pdfPath}`);

  // Send email with the PDF attachment
  await sendAssessmentEmail(realisticAssessment, pdfPath);
  console.log(`Email sent to: ${realisticAssessment.email}`);

  return { assessment: realisticAssessment, pdfPath };
}

// Function to generate individual PDF report
async function generateIndividualPDF(assessment: AssessmentResult): Promise<string> {
  return new Promise((resolve, reject) => {
    try {
      const outputPath = path.join(__dirname, 'individual-assessment.pdf');
      const doc = new PDFDocument({
        size: 'LETTER',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
        info: {
          Title: 'The 100 Marriage - Individual Assessment',
          Author: 'Lawrence Adjah',
          Subject: 'Marriage Assessment Results',
          Keywords: 'marriage, assessment, relationship, compatibility'
        }
      });

      // Create a write stream to save the PDF
      const stream = fs.createWriteStream(outputPath);
      doc.pipe(stream);

      // Add PDF header
      if (INCLUDE_IMAGES) {
        doc.image('public/100-marriage-book-cover.jpg', 50, 50, { width: 100 });
      }
      
      doc.fontSize(24)
        .font('Helvetica-Bold')
        .text('THE 100 MARRIAGE', 170, 70)
        .fontSize(16)
        .font('Helvetica')
        .text('Individual Assessment Report', 170, 100);

      // Add recipient information
      doc.moveDown(2)
        .fontSize(12)
        .text(`Report for: ${assessment.demographics.firstName} ${assessment.demographics.lastName}`, { align: 'left' })
        .text(`Date: ${new Date(assessment.timestamp).toLocaleDateString()}`, { align: 'left' });

      // Add overall score
      doc.moveDown(2)
        .fontSize(16)
        .font('Helvetica-Bold')
        .text('Assessment Overview', { underline: true });
      
      doc.moveDown()
        .fontSize(14)
        .text(`Overall Score: ${assessment.scores.overallPercentage}%`);

      // Primary Psychographic Profile
      doc.moveDown(1.5)
        .fontSize(16)
        .font('Helvetica-Bold')
        .text('Your Psychographic Profile');

      doc.moveDown(0.5)
        .fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#3366cc')
        .text(assessment.profile.name);
      
      doc.moveDown(0.5)
        .fontSize(12)
        .font('Helvetica')
        .fillColor('black')
        .text(assessment.profile.description, { align: 'left', width: 500 });

      // Add compatibility information for primary profile
      doc.moveDown(0.5)
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Compatibility Information:');
        
      doc.fontSize(11)
        .font('Helvetica')
        .text(`Ideal Match: ${assessment.profile.name}`, { continued: false })
        .text('Next Best Matches: Harmonious Planners, Balanced Visionaries', { continued: false });

      // Gender-specific profile if available
      if (assessment.genderProfile) {
        doc.moveDown(1.5)
          .fontSize(14)
          .font('Helvetica-Bold')
          .fillColor('#993399')
          .text(`${assessment.demographics.gender === 'male' ? 'Male' : 'Female'}-Specific Profile: ${assessment.genderProfile.name}`);
        
        doc.moveDown(0.5)
          .fontSize(12)
          .font('Helvetica')
          .fillColor('black')
          .text(assessment.genderProfile.description, { align: 'left', width: 500 });
          
        // Add compatibility information for gender-specific profile
        doc.moveDown(0.5)
          .fontSize(12)
          .font('Helvetica-Bold')
          .text('Compatibility Information:');
          
        doc.fontSize(11)
          .font('Helvetica')
          .text(`Ideal Match: ${assessment.genderProfile.name}`, { continued: false })
          .text('Next Best Matches: Flexible Faithful, Pragmatic Partners', { continued: false });
      }

      // Section scores with gender comparison
      doc.moveDown(1.5)
        .fontSize(16)
        .font('Helvetica-Bold')
        .text('Section Scores Compared to Other ' + (assessment.demographics.gender === 'male' ? 'Men' : 'Women'));

      // Create a section score table with gender comparison
      if (assessment.genderComparison) {
        Object.entries(assessment.scores.sections).forEach(([section, score]) => {
          const genderData = assessment.genderComparison?.[section];
          
          doc.moveDown(0.5)
            .fontSize(12)
            .font('Helvetica-Bold')
            .text(`${section}: ${score.percentage}%`);
          
          // Draw progress bar for the user's score
          const barWidth = 400;
          const filledWidth = (score.percentage / 100) * barWidth;
          
          doc.rect(50, doc.y + 5, barWidth, 10).stroke();
          doc.rect(50, doc.y, filledWidth, 10).fill('#3366cc');
          
          // Add gender comparison information if available
          if (genderData) {
            doc.moveDown(0.5)
              .fontSize(10)
              .font('Helvetica')
              .text(`Average score for ${assessment.demographics.gender === 'male' ? 'men' : 'women'}: ${genderData.average}%`, { continued: true })
              .text(`    |    You scored higher than ${genderData.percentile}% of ${assessment.demographics.gender === 'male' ? 'men' : 'women'}`, { align: 'left' });
          }
          
          doc.moveDown(1);
        });
      } else {
        // Fallback if gender comparison data is not available
        Object.entries(assessment.scores.sections).forEach(([section, score]) => {
          doc.moveDown(0.5)
            .fontSize(12)
            .font('Helvetica-Bold')
            .text(`${section}: ${score.percentage}%`);
          
          // Draw progress bar
          const barWidth = 400;
          const filledWidth = (score.percentage / 100) * barWidth;
          
          doc.rect(50, doc.y + 5, barWidth, 10).stroke();
          doc.rect(50, doc.y, filledWidth, 10).fill('#3366cc');
          doc.moveDown(1);
        });
      }

      // Strengths and areas for improvement
      doc.moveDown(1.5)
        .fontSize(16)
        .font('Helvetica-Bold')
        .text('Your Strengths');

      assessment.scores.strengths.forEach(strength => {
        doc.moveDown(0.5)
          .fontSize(12)
          .font('Helvetica')
          .text(`• ${strength}`);
      });

      doc.moveDown(1.5)
        .fontSize(16)
        .font('Helvetica-Bold')
        .text('Areas for Growth');

      assessment.scores.improvementAreas.forEach(area => {
        doc.moveDown(0.5)
          .fontSize(12)
          .font('Helvetica')
          .text(`• ${area}`);
      });

      // Recommendations section removed to avoid duplication with PDF content

      // Continue Your Journey section
      doc.moveDown(1.5)
        .fontSize(18)
        .font('Helvetica-Bold')
        .text('Continue Your Journey with The 100 Marriage', { align: 'center' });

      doc.moveDown(1)
        .fontSize(12)
        .font('Helvetica')
        .text('Thank you for completing The 100 Marriage Assessment. Your journey towards a fulfilling relationship is just beginning. Here are some ways to continue:');

      // Book information
      doc.moveDown(1);
      
      doc.fontSize(14)
        .font('Helvetica-Bold')
        .text('The 100 Marriage Book')
        .moveDown(0.3)
        .fontSize(12)
        .font('Helvetica')
        .text('Deepen your understanding with the bestselling book by Lawrence Adjah, available on Amazon and other retailers.', { width: 350 })
        .moveDown(0.3)
        .text('Purchase at: https://lawrenceadjah.com/the100marriagebook', { width: 350 });

      // Counseling information
      doc.moveDown(1.5)
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('Relationship Counseling')
        .moveDown(0.3)
        .fontSize(12)
        .font('Helvetica')
        .text('For personalized guidance, schedule a consultation with Lawrence Adjah to discuss your assessment results and receive tailored advice for your relationship journey.')
        .moveDown(0.3)
        .text('Book at: https://lawrence-adjah.clientsecure.me');

      // Add psychographic profiles reference section
      doc.addPage();
      
      doc.fontSize(16)
        .font('Helvetica-Bold')
        .text('Psychographic Profiles Reference', { align: 'center' });
      
      doc.moveDown(1)
        .fontSize(12)
        .font('Helvetica')
        .text('The 100 Marriage psychographic profiles represent different relationship styles and tendencies. Below are brief descriptions of each profile for your reference.', { align: 'left', width: 500 });
      
      // Border for the profiles box
      const boxTop = doc.y + 20;
      doc.lineWidth(2)
        .strokeColor('#e83e8c') // Pink/red border
        .rect(30, boxTop, doc.page.width - 60, 400)
        .stroke();
        
      doc.y = boxTop + 15;
      
      // Add profile 1 with icon
      if (assessment.profile.iconPath) {
        try {
          // Use path.resolve to get the absolute path
          const absolutePath = path.resolve(assessment.profile.iconPath);
          console.log('Attempting to load profile icon from:', absolutePath);
          doc.image(absolutePath, 50, doc.y, { width: 50 });
        } catch (err) {
          console.error('Error loading profile icon:', err);
        }
      }
      
      doc.fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#3366cc')
        .text(assessment.profile.name, 120, doc.y);
        
      doc.moveDown(0.3)
        .fontSize(11)
        .font('Helvetica')
        .fillColor('black')
        .text(assessment.profile.description, 120, doc.y, { width: 400 });
      
      // Add gender-specific profile with icon if available
      if (assessment.genderProfile) {
        doc.moveDown(2);
        
        if (assessment.genderProfile.iconPath) {
          try {
            // Use path.resolve to get the absolute path
            const absolutePath = path.resolve(assessment.genderProfile.iconPath);
            console.log('Attempting to load gender profile icon from:', absolutePath);
            doc.image(absolutePath, 50, doc.y, { width: 50 });
          } catch (err) {
            console.error('Error loading gender profile icon:', err);
          }
        }
        
        doc.fontSize(14)
          .font('Helvetica-Bold')
          .fillColor('#993399')
          .text(assessment.genderProfile.name, 120, doc.y);
          
        doc.moveDown(0.3)
          .fontSize(11)
          .font('Helvetica')
          .fillColor('black')
          .text(assessment.genderProfile.description, 120, doc.y, { width: 400 });
      }
      
      // Add a few more sample profiles
      doc.moveDown(2);
      
      doc.fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#3366cc')
        .text('Harmonious Planner', 120, doc.y);
        
      const plannerDesc = 'The Harmonious Planner approaches relationships with a focus on peace, harmony, and careful preparation. They value emotional security and invest in creating a stable home environment. They approach decisions methodically, weighing all sides before committing, and excel at creating a life of balance and intentional living.';
      
      doc.moveDown(0.3)
        .fontSize(11)
        .font('Helvetica')
        .fillColor('black')
        .text(plannerDesc, 120, doc.y, { width: 400 });
      
      doc.moveDown(2);
      
      doc.fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#3366cc')
        .text('Relationship Navigator', 120, doc.y);
        
      const navigatorDesc = 'The Relationship Navigator has exceptional skills in guidance, direction, and emotional intelligence. They can sense relational dynamics and negotiate complex interpersonal situations with wisdom. They prioritize emotional connections and can adapt their approach to meet relationship needs effectively.';
        
      doc.moveDown(0.3)
        .fontSize(11)
        .font('Helvetica')
        .fillColor('black')
        .text(navigatorDesc, 120, doc.y, { width: 400 });
      
      // Footer with contact information
      doc.fontSize(10)
        .font('Helvetica')
        .text(
          'The 100 Marriage | hello@wgodw.com | https://lawrenceadjah.com',
          50,
          doc.page.height - 50,
          { align: 'center' }
        )
        .text(
          'Page 2 of 2',
          50,
          doc.page.height - 35,
          { align: 'center' }
        );

      doc.end();

      stream.on('finish', () => {
        console.log('PDF created successfully');
        resolve(outputPath);
      });

      stream.on('error', (err) => {
        console.error('Error creating PDF:', err);
        reject(err);
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      reject(error);
    }
  });
}

// Send email with assessment results
async function sendAssessmentEmail(assessment: AssessmentResult, pdfPath: string) {
  try {
    // Format HTML email content
    const emailHTML = formatAssessmentEmail(assessment);
    
    // Create email with attachment
    const attachment = fs.readFileSync(pdfPath).toString('base64');
    
    const msg = {
      to: assessment.email,
      from: 'hello@wgodw.com', // Using the verified sender email
      subject: 'Your 100 Marriage Assessment Results',
      html: emailHTML,
      attachments: [
        {
          content: attachment,
          filename: 'The100Marriage-Individual-Assessment.pdf',
          type: 'application/pdf',
          disposition: 'attachment',
        },
      ],
    };
    
    // Send email
    await sgMail.send(msg);
    console.log('Email sent successfully');
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    return false;
  }
}

// Format assessment email HTML
function formatAssessmentEmail(assessment: AssessmentResult): string {
  const { demographics, profile, genderProfile, scores } = assessment;
  
  // Calculate color for overall score
  let scoreColor = '#28a745'; // green by default
  if (scores.overallPercentage < 60) {
    scoreColor = '#dc3545'; // red
  } else if (scores.overallPercentage < 80) {
    scoreColor = '#fd7e14'; // orange
  }
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your 100 Marriage Assessment Results</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          line-height: 1.6; 
          color: #333; 
          max-width: 600px; 
          margin: 0 auto;
          padding: 20px;
        }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { max-width: 120px; margin-bottom: 15px; }
        h1 { color: #333; font-size: 24px; margin-bottom: 10px; }
        h2 { color: #444; font-size: 20px; margin-top: 25px; margin-bottom: 15px; }
        h3 { color: #555; font-size: 18px; margin-top: 20px; margin-bottom: 10px; }
        .score-circle {
          width: 120px;
          height: 120px;
          border-radius: 50%;
          background-color: white;
          border: 8px solid ${scoreColor};
          margin: 20px auto;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        .score { font-size: 32px; font-weight: bold; color: ${scoreColor}; }
        .score-label { font-size: 14px; color: #666; }
        .profile-box {
          background-color: #f5f5ff;
          border: 1px solid #ddd;
          border-radius: 8px;
          padding: 15px;
          margin: 15px 0;
        }
        .gender-profile-box {
          background-color: #faf5ff;
          border: 1px solid #e6d5f5;
          border-radius: 8px;
          padding: 15px;
          margin: 15px 0;
        }
        .profile-name { color: #3366cc; font-weight: bold; margin-bottom: 10px; }
        .gender-profile-name { color: #993399; font-weight: bold; margin-bottom: 10px; }
        .match-info {
          background-color: #e6f0ff;
          border-radius: 6px;
          padding: 10px;
          margin-top: 12px;
          font-size: 14px;
        }
        .section-score {
          margin-bottom: 15px;
        }
        .section-name {
          font-weight: bold;
          margin-bottom: 5px;
        }
        .bar-container {
          background-color: #e9ecef;
          height: 10px;
          border-radius: 5px;
          margin-bottom: 5px;
        }
        .bar-fill {
          background-color: #3366cc;
          height: 10px;
          border-radius: 5px;
        }
        .bar-label {
          font-size: 14px;
          color: #666;
          text-align: right;
        }
        .strengths { margin-bottom: 20px; }
        .improvements { margin-bottom: 30px; }
        .list-item { margin-bottom: 8px; }
        .cta-button {
          display: inline-block;
          background-color: #3366cc;
          color: white;
          padding: 12px 25px;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
          margin: 20px 0;
        }
        .footer {
          margin-top: 40px;
          text-align: center;
          font-size: 14px;
          color: #666;
          border-top: 1px solid #eee;
          padding-top: 20px;
        }
      </style>
    </head>
    <body>
      <div class="header">
        <img src="https://lawrenceadjah.com/wp-content/uploads/2023/12/The-100-Marriage-Lawrence-Adjah-Christian-Faith-Based-Books-Marriage-Books-on-Amazon-Relationship-Books-Best-Sellers.png" alt="The 100 Marriage" class="logo">
        <h1>Your 100 Marriage Assessment Results</h1>
      </div>
      
      <p>Dear ${demographics.firstName},</p>
      
      <p>Thank you for completing The 100 Marriage Assessment. Your personalized results are ready! Attached to this email, you'll find your comprehensive assessment report in PDF format, which you can download and refer to as you continue your relationship journey.</p>
      
      <div class="score-circle">
        <span class="score">${scores.overallPercentage}%</span>
        <span class="score-label">Overall Score</span>
      </div>
      
      <h2>Your Psychographic Profile</h2>
      <div class="profile-box">
        <div class="profile-name">${profile.name}</div>
        <p>${profile.description}</p>
        
        <div class="match-info">
          <strong>Compatibility Information:</strong><br>
          Ideal Match: ${profile.name}<br>
          Next Best Matches: Harmonious Planners, Balanced Visionaries
        </div>
      </div>
      
      ${genderProfile ? `
        <h3>${demographics.gender === 'male' ? 'Male' : 'Female'}-Specific Profile</h3>
        <div class="gender-profile-box">
          <div class="gender-profile-name">${genderProfile.name}</div>
          <p>${genderProfile.description}</p>
          
          <div class="match-info">
            <strong>Compatibility Information:</strong><br>
            Ideal Match: ${genderProfile.name}<br>
            Next Best Matches: Flexible Faithful, Pragmatic Partners
          </div>
        </div>
      ` : ''}
      
      <h2>Section Scores</h2>
      ${Object.entries(scores.sections).map(([section, score]) => `
        <div class="section-score">
          <div class="section-name">${section}: ${score.percentage}%</div>
          <div class="bar-container">
            <div class="bar-fill" style="width: ${score.percentage}%;"></div>
          </div>
        </div>
      `).join('')}
      
      <h2>Your Strengths</h2>
      <div class="strengths">
        ${scores.strengths.map(strength => `
          <div class="list-item">• ${strength}</div>
        `).join('')}
      </div>
      
      <h2>Areas for Growth</h2>
      <div class="improvements">
        ${scores.improvementAreas.map(area => `
          <div class="list-item">• ${area}</div>
        `).join('')}
      </div>
      
      <h2>Continue Your Journey</h2>
      <p>To explore these insights further and apply them to your relationship journey, we recommend:</p>
      
      <p><strong>The 100 Marriage Book</strong><br>
      Deepen your understanding with Lawrence Adjah's bestselling book, available on Amazon and other retailers.</p>
      
      <a href="https://lawrenceadjah.com/the100marriagebook" class="cta-button">Get the Book</a>
      
      <p><strong>Individual or Couple Consultation</strong><br>
      Schedule time with Lawrence Adjah to discuss your results and receive personalized guidance.</p>
      
      <a href="https://lawrence-adjah.clientsecure.me" class="cta-button">Book a Consultation</a>
      
      <div class="footer">
        <p>The 100 Marriage | <a href="mailto:hello@wgodw.com">hello@wgodw.com</a> | <a href="https://lawrenceadjah.com">lawrenceadjah.com</a></p>
      </div>
    </body>
    </html>
  `;
}

// Run the test
generateRealisticIndividualAssessment()
  .then(result => {
    console.log('Success! Individual assessment generated and sent.');
    console.log('PDF saved at:', result.pdfPath);
  })
  .catch(error => {
    console.error('Error in test:', error);
  });