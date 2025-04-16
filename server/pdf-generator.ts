import PDFDocument from 'pdfkit';
import { AssessmentResult } from '../shared/schema';
import fs from 'fs';
import path from 'path';

// Function to get the absolute path of profile icons
function getProfileIconPath(relativePath: string | undefined): string | null {
  if (!relativePath) return null;
  
  try {
    // Remove leading slash if present
    const cleanPath = relativePath.startsWith('/') ? relativePath.substring(1) : relativePath;
    // Create absolute path to the public directory
    const absPath = path.join(process.cwd(), 'client', 'public', cleanPath);
    
    // Check if file exists
    if (fs.existsSync(absPath)) {
      return absPath;
    }
    return null;
  } catch (error) {
    console.error('Error finding profile icon:', error);
    return null;
  }
}

// Function to create a PDF buffer from an assessment result
export async function generateAssessmentPDF(assessment: AssessmentResult): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      // Create a PDF document
      const doc = new PDFDocument({
        size: 'LETTER',
        margin: 50,
        info: {
          Title: `${assessment.name}'s The 100 Marriage Assessment - Series 1 Results`,
          Author: 'Lawrence E. Adjah',
          Subject: 'The 100 Marriage Assessment - Series 1',
        }
      });

      // Create a buffer to store the PDF
      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      // Set up the document
      // Logo and header
      doc.fontSize(24)
        .font('Helvetica-Bold')
        .fillColor('#2c3e50')
        .text('The 100 Marriage Assessment - Series 1', { align: 'center' });

      doc.moveDown(0.5)
        .fontSize(16)
        .fillColor('#3498db')
        .text('Personal Assessment Results', { align: 'center' });
      
      // Add a horizontal line
      doc.moveDown(0.5)
        .strokeColor('#ddd')
        .lineWidth(1)
        .moveTo(50, doc.y)
        .lineTo(doc.page.width - 50, doc.y)
        .stroke();

      // Personal information section
      doc.moveDown(1)
        .fontSize(14)
        .fillColor('#2c3e50')
        .font('Helvetica-Bold')
        .text('Personal Information');
      
      doc.moveDown(0.5)
        .fontSize(12)
        .font('Helvetica')
        .fillColor('#555')
        .text(`Name: ${assessment.name}`)
        .text(`Gender: ${assessment.demographics.gender}`)
        .text(`Life Stage: ${assessment.demographics.lifeStage || 'Not specified'}`)
        .text(`Birthday: ${assessment.demographics.birthday || 'Not specified'}`)
        .text(`Marriage Status: ${assessment.demographics.marriageStatus}`)
        .text(`THM Arranged Marriage Pool: ${assessment.demographics.interestedInArrangedMarriage ? 'Applied' : 'Not applied'}`)
        .text(`Date: ${new Date(assessment.timestamp).toLocaleDateString()}`);

      // Overall score section with a visual representation
      doc.moveDown(1.5)
        .fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#2c3e50')
        .text('Overall Assessment Score');

      // Draw score circle
      const scoreRadius = 40;
      const centerX = doc.page.width / 2;
      const scoreText = `${Math.round(assessment.scores.overallPercentage)}%`;
      
      doc.moveDown(0.5)
        .circle(centerX, doc.y + scoreRadius, scoreRadius)
        .fillAndStroke('#3498db', '#2980b9');
        
      // Position text in the center of the circle
      doc.fillColor('white')
        .font('Helvetica-Bold')
        .fontSize(20);
      
      // Calculate width of the score text to center it
      const textWidth = doc.widthOfString(scoreText);
      const textHeight = doc.currentLineHeight();
      
      doc.text(scoreText, centerX - textWidth / 2, doc.y + scoreRadius - textHeight / 2);
      
      // Move past the circle
      doc.moveDown(4);
      
      // Add score explanation
      doc.fontSize(11)
        .font('Helvetica')
        .fillColor('#555')
        .text('Understanding Your Score: Your assessment score reflects your perspectives on relationship, not a judgment of readiness. Higher percentages indicate alignment with traditional marriage values, while lower percentages suggest less traditional approaches. Neither is inherently better—just different expectations.', {
          width: doc.page.width - 100,
          align: 'justify'
        });
        
      doc.moveDown(0.5);
      
      // Add comparison explanation in bullet points
      doc.fontSize(11)
        .font('Helvetica')
        .fillColor('#555')
        .text('• The most important consideration is how your assessment and approach compares with someone you are married to or discerning marriage with.', {
          width: doc.page.width - 120,
          indent: 10,
        });
        
      doc.moveDown(0.3);
        
      doc.fontSize(11)
        .font('Helvetica')
        .fillColor('#555')
        .text('• The closer the percentage (with your spouse), overall, the more aligned and successful you will be.', {
          width: doc.page.width - 120,
          indent: 10,
        });
        
      doc.moveDown(1);
      
      // Profile section
      doc.fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#2c3e50')
        .text('Your Psychographic Profiles');
      
      // Primary Profile
      doc.moveDown(0.5);
      
      // Try to add profile icon if available
      const primaryIconPath = getProfileIconPath(assessment.profile.iconPath);
      if (primaryIconPath) {
        const iconSize = 60;
        const iconY = doc.y;
        const textX = 120; // Space for the icon plus some margin
        
        // Add the icon
        doc.image(primaryIconPath, 50, iconY, { 
          width: iconSize,
          height: iconSize,
          fit: [iconSize, iconSize]
        });
        
        // Add profile name with adjusted position
        doc.fontSize(16)
          .fillColor('#3498db')
          .text(assessment.profile.name + ' (General Profile)', textX, iconY);
        
        // Add profile description with adjusted position
        doc.moveDown(0.5)
          .fontSize(12)
          .fillColor('#555')
          .font('Helvetica')
          .text(assessment.profile.description, textX, doc.y, {
            align: 'justify',
            width: doc.page.width - 150 // Adjust width to account for icon
          });
          
        // Ensure we move past the icon
        const newY = Math.max(doc.y, iconY + iconSize + 10);
        doc.y = newY;
      } else {
        // Fallback if icon is not available
        doc.fontSize(16)
          .fillColor('#3498db')
          .text(assessment.profile.name + ' (General Profile)');
          
        doc.moveDown(0.5)
          .fontSize(12)
          .fillColor('#555')
          .font('Helvetica')
          .text(assessment.profile.description, {
            align: 'justify',
            width: doc.page.width - 100
          });
      }
      
      // Gender-specific profile if available
      if (assessment.genderProfile) {
        doc.moveDown(1.5);
        
        // Try to add gender profile icon if available
        const genderIconPath = getProfileIconPath(assessment.genderProfile.iconPath);
        if (genderIconPath) {
          const iconSize = 60;
          const iconY = doc.y;
          const textX = 120; // Space for the icon plus some margin
          
          // Add the icon
          doc.image(genderIconPath, 50, iconY, { 
            width: iconSize,
            height: iconSize,
            fit: [iconSize, iconSize]
          });
          
          // Add gender profile name with adjusted position
          doc.fontSize(16)
            .fillColor('#8e44ad') // Purple color for gender profile
            .text(assessment.genderProfile.name + 
              (assessment.demographics.gender === 'male' ? ' (Male-Specific Profile)' : ' (Female-Specific Profile)'), 
              textX, iconY);
          
          // Add gender profile description with adjusted position
          doc.moveDown(0.5)
            .fontSize(12)
            .fillColor('#555')
            .font('Helvetica')
            .text(assessment.genderProfile.description, textX, doc.y, {
              align: 'justify',
              width: doc.page.width - 150 // Adjust width to account for icon
            });
            
          // Ensure we move past the icon
          const newY = Math.max(doc.y, iconY + iconSize + 10);
          doc.y = newY;
        } else {
          // Fallback if icon is not available
          doc.fontSize(16)
            .fillColor('#8e44ad') // Purple color for gender profile
            .text(assessment.genderProfile.name + 
              (assessment.demographics.gender === 'male' ? ' (Male-Specific Profile)' : ' (Female-Specific Profile)'));
            
          doc.moveDown(0.5)
            .fontSize(12)
            .fillColor('#555')
            .font('Helvetica')
            .text(assessment.genderProfile.description, {
              align: 'justify',
              width: doc.page.width - 100
            });
        }
      }

      // Section scores
      doc.moveDown(1.5)
        .fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#2c3e50')
        .text('Section Scores');
        
      doc.moveDown(0.5);
      
      // Add explanation for section scores
      doc.fontSize(11)
        .font('Helvetica')
        .fillColor('#555')
        .text('Each section score represents your perspective in a specific relationship area. These scores are used to determine your psychographic profiles. Higher percentages typically indicate more traditional views, while lower percentages suggest less traditional approaches to relationships.', {
          width: doc.page.width - 100,
          align: 'justify'
        });
        
      doc.moveDown(1);
      
      // Calculate the maximum width available
      const maxBarWidth = doc.page.width - 200;
      
      // Draw scores for each section
      Object.entries(assessment.scores.sections).forEach(([sectionName, score]) => {
        // Draw section name
        doc.fontSize(12)
          .font('Helvetica')
          .fillColor('#555')
          .text(`${sectionName}:`, { continued: true })
          .fillColor('#3498db')
          .text(` ${Math.round(score.percentage)}%`, { align: 'right' });
          
        // Calculate the bar width based on the percentage
        const barWidth = (score.percentage / 100) * maxBarWidth;
        
        // Draw the background bar
        doc.rect(70, doc.y, maxBarWidth, 10)
          .fillColor('#f0f0f0');
          
        // Draw the score bar
        doc.rect(70, doc.y, barWidth, 10)
          .fillColor('#3498db');
          
        doc.moveDown(1);
      });

      // Add compatibility section
      doc.moveDown(1)
        .fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#2c3e50')
        .text('Your Compatibility Profile');
      
      // Add compatibility explanation
      doc.moveDown(0.5)
        .fontSize(11)
        .font('Helvetica')
        .fillColor('#555')
        .text('Based on your psychographic profile, we\'ve identified the types of people you\'d likely be most compatible with. Closer alignment in expectations suggests better compatibility, but isn\'t mandatory for a successful relationship.', {
          width: doc.page.width - 100,
          align: 'justify'
        });
        
      doc.moveDown(1);
      
      // Create compatibility table
      const tableTop = doc.y;
      const colWidth1 = 150;
      const colWidth2 = 150;
      const colWidth3 = 200;
      const rowHeight = 25;
      
      // Table headers
      doc.rect(50, tableTop, colWidth1, rowHeight).fillAndStroke('#f8f9fa', '#e2e8f0');
      doc.rect(50 + colWidth1, tableTop, colWidth2, rowHeight).fillAndStroke('#f8f9fa', '#e2e8f0');
      doc.rect(50 + colWidth1 + colWidth2, tableTop, colWidth3, rowHeight).fillAndStroke('#f8f9fa', '#e2e8f0');
      
      doc.fontSize(10)
        .fillColor('#2c3e50')
        .text('Compatibility Type', 60, tableTop + 8)
        .text('Ideal Match', 60 + colWidth1, tableTop + 8)
        .text('Next-Best Matches', 60 + colWidth1 + colWidth2, tableTop + 8);
      
      // Unisex row
      const unisexRowTop = tableTop + rowHeight;
      doc.rect(50, unisexRowTop, colWidth1, rowHeight).stroke('#e2e8f0');
      doc.rect(50 + colWidth1, unisexRowTop, colWidth2, rowHeight).stroke('#e2e8f0');
      doc.rect(50 + colWidth1 + colWidth2, unisexRowTop, colWidth3, rowHeight).stroke('#e2e8f0');
      
      doc.fontSize(10)
        .fillColor('#333')
        .text('Unisex Profile Match', 60, unisexRowTop + 8)
        .fillColor('#3498db')
        .text(assessment.profile.name, 60 + colWidth1, unisexRowTop + 8);
      
      // Determine next best matches based on profile
      let nextBestMatches = '';
      if (assessment.profile.name === "Steadfast Believers") {
        nextBestMatches = "Harmonious Planners, Balanced Visionaries";
      } else if (assessment.profile.name === "Harmonious Planners") {
        nextBestMatches = "Steadfast Believers, Balanced Visionaries";
      } else if (assessment.profile.name === "Flexible Faithful") {
        nextBestMatches = "Balanced Visionaries, Pragmatic Partners";
      } else if (assessment.profile.name === "Pragmatic Partners") {
        nextBestMatches = "Flexible Faithful, Individualist Seekers";
      } else if (assessment.profile.name === "Individualist Seekers") {
        nextBestMatches = "Pragmatic Partners, Flexible Faithful";
      } else if (assessment.profile.name === "Balanced Visionaries") {
        nextBestMatches = "Harmonious Planners, Flexible Faithful";
      }
      
      doc.fillColor('#555')
        .text(nextBestMatches, 60 + colWidth1 + colWidth2, unisexRowTop + 8);
      
      // Gender-specific row (if available)
      if (assessment.genderProfile) {
        const genderRowTop = unisexRowTop + rowHeight;
        doc.rect(50, genderRowTop, colWidth1, rowHeight).stroke('#e2e8f0');
        doc.rect(50 + colWidth1, genderRowTop, colWidth2, rowHeight).stroke('#e2e8f0');
        doc.rect(50 + colWidth1 + colWidth2, genderRowTop, colWidth3, rowHeight).stroke('#e2e8f0');
        
        const genderLabel = assessment.demographics.gender === 'female' ? 'Female-Specific Match' : 'Male-Specific Match';
        doc.fontSize(10)
          .fillColor('#333')
          .text(genderLabel, 60, genderRowTop + 8);
        
        // Determine ideal and next-best matches based on gender profile
        let idealMatch = '';
        let nextBestGenderMatches = '';
        
        if (assessment.demographics.gender === 'female') {
          if (assessment.genderProfile.name === "Relational Nurturers") {
            idealMatch = "Faithful Protectors";
            nextBestGenderMatches = "Balanced Providers, Structured Leaders";
          } else if (assessment.genderProfile.name === "Adaptive Communicators") {
            idealMatch = "Structured Leaders";
            nextBestGenderMatches = "Faithful Protectors, Balanced Providers";
          } else if (assessment.genderProfile.name === "Independent Traditionalists") {
            idealMatch = "Balanced Providers";
            nextBestGenderMatches = "Faithful Protectors, Structured Leaders";
          } else if (assessment.genderProfile.name === "Faith-Centered Homemakers") {
            idealMatch = "Faithful Protectors";
            nextBestGenderMatches = "Balanced Providers, Structured Leaders";
          }
        } else if (assessment.demographics.gender === 'male') {
          if (assessment.genderProfile.name === "Faithful Protectors") {
            idealMatch = "Faith-Centered Homemakers";
            nextBestGenderMatches = "Relational Nurturers, Independent Traditionalists";
          } else if (assessment.genderProfile.name === "Structured Leaders") {
            idealMatch = "Adaptive Communicators";
            nextBestGenderMatches = "Relational Nurturers, Faith-Centered Homemakers";
          } else if (assessment.genderProfile.name === "Balanced Providers") {
            idealMatch = "Independent Traditionalists";
            nextBestGenderMatches = "Faith-Centered Homemakers, Relational Nurturers";
          }
        }
        
        doc.fillColor('#8e44ad')
          .text(idealMatch, 60 + colWidth1, genderRowTop + 8)
          .fillColor('#555')
          .text(nextBestGenderMatches, 60 + colWidth1 + colWidth2, genderRowTop + 8);
        
        doc.moveDown(3);
      } else {
        doc.moveDown(2);
      }
      
      // Add implications box
      doc.rect(50, doc.y, doc.page.width - 100, 80).fillAndStroke('#ebf8ff', '#3498db');
      
      doc.fillColor('#1e40af')
        .fontSize(12)
        .font('Helvetica-Bold')
        .text('Implications for Your Relationships', 60, doc.y - 70);
      
      // Determine implications text based on primary profile
      let implicationsText = '';
      if (assessment.profile.name === "Steadfast Believers") {
        implicationsText = "Your strong faith and traditional values mean you'll thrive with someone who shares your spiritual commitment and family focus. Expectation alignment is highest with other Steadfast Believers, but Harmonious Planners and Balanced Visionaries can also complement your values if faith is openly discussed.";
      } else if (assessment.profile.name === "Harmonious Planners") {
        implicationsText = "You value structure and faith, so you'll connect best with partners who share your planning mindset. Harmonious Planners are your ideal match, while Steadfast Believers and Balanced Visionaries offer similar alignment with slight variations in emphasis.";
      } else if (assessment.profile.name === "Flexible Faithful") {
        implicationsText = "Your balance of faith and adaptability makes you a versatile partner. Flexible Faithful matches align best, but Balanced Visionaries and Pragmatic Partners can complement your communication focus with mutual respect.";
      } else if (assessment.profile.name === "Pragmatic Partners") {
        implicationsText = "You prioritize practicality and communication, so you'll thrive with partners who value fairness. Pragmatic Partners are ideal, while Flexible Faithful and Individualist Seekers can align on practicality with less faith intensity.";
      } else if (assessment.profile.name === "Individualist Seekers") {
        implicationsText = "Your focus on independence means you'll connect with partners who respect autonomy. Individualist Seekers are your best match, while Pragmatic Partners and Flexible Faithful can offer complementary practicality and adaptability.";
      } else if (assessment.profile.name === "Balanced Visionaries") {
        implicationsText = "Your balanced approach to faith and practicality pairs well with similar mindsets. Balanced Visionaries are ideal, while Harmonious Planners and Flexible Faithful share your values with slight variations.";
      }
      
      doc.fillColor('#333')
        .fontSize(10)
        .font('Helvetica')
        .text(implicationsText, 60, doc.y - 50, {
          width: doc.page.width - 120
        });
      
      // Add gender implications if applicable
      if (assessment.genderProfile) {
        let genderImplicationsText = '';
        
        if (assessment.demographics.gender === 'female') {
          if (assessment.genderProfile.name === "Relational Nurturers") {
            genderImplicationsText = "As a Relational Nurturer: Your nurturing nature thrives with a partner who values family and faith. A Faithful Protector's leadership aligns best, while Balanced Providers and Structured Leaders offer stability and structure to support your family focus.";
          } else if (assessment.genderProfile.name === "Adaptive Communicators") {
            genderImplicationsText = "As an Adaptive Communicator: Your communication skills pair well with a partner who values clarity. Structured Leaders are ideal, while Faithful Protectors and Balanced Providers complement your faith and balance.";
          } else if (assessment.genderProfile.name === "Independent Traditionalists") {
            genderImplicationsText = "As an Independent Traditionalist: Your blend of tradition and independence matches with a stable partner. Balanced Providers align best, while Faithful Protectors and Structured Leaders share your traditional values.";
          } else if (assessment.genderProfile.name === "Faith-Centered Homemakers") {
            genderImplicationsText = "As a Faith-Centered Homemaker: Your spiritual home focus thrives with a faith-driven partner. Faithful Protectors are ideal, while Balanced Providers and Structured Leaders support your family values.";
          }
        } else if (assessment.demographics.gender === 'male') {
          if (assessment.genderProfile.name === "Faithful Protectors") {
            genderImplicationsText = "As a Faithful Protector: Your leadership and faith pair well with a spiritually focused partner. Faith-Centered Homemakers align best, while Relational Nurturers and Independent Traditionalists share your family and traditional values.";
          } else if (assessment.genderProfile.name === "Structured Leaders") {
            genderImplicationsText = "As a Structured Leader: Your clarity and structure match with a communicative partner. Adaptive Communicators are ideal, while Relational Nurturers and Faith-Centered Homemakers complement your family focus.";
          } else if (assessment.genderProfile.name === "Balanced Providers") {
            genderImplicationsText = "As a Balanced Provider: Your stability and balance pair well with an independent partner. Independent Traditionalists align best, while Faith-Centered Homemakers and Relational Nurturers support your faith and family priorities.";
          }
        }
        
        doc.rect(50, doc.y + 10, doc.page.width - 100, 50).fillAndStroke('#f5f0ff', '#8e44ad');
        
        doc.fillColor('#333')
          .fontSize(10)
          .font('Helvetica')
          .text(genderImplicationsText, 60, doc.y + 20, {
            width: doc.page.width - 120
          });
      }

      // Add a divider
      doc.moveDown(3)
        .strokeColor('#ddd')
        .lineWidth(1)
        .moveTo(50, doc.y)
        .lineTo(doc.page.width - 50, doc.y)
        .stroke();

      // Next steps and footer
      doc.moveDown(1)
        .fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#2c3e50')
        .text('Next Steps');
        
      doc.moveDown(0.5)
        .fontSize(12)
        .font('Helvetica')
        .fillColor('#555')
        .text('If you would like to discuss your results further, you can schedule a 1-on-1 consultation session.', {
          width: doc.page.width - 100,
          align: 'justify'
        });
        
      doc.moveDown(0.5)
        .fillColor('#3498db')
        .text('Schedule at: https://lawrence-adjah.clientsecure.me/request/service', {
          link: 'https://lawrence-adjah.clientsecure.me/request/service',
          underline: true
        });

      // End the document
      doc.moveDown(2)
        .fontSize(10)
        .fillColor('#999')
        .text('(c) 2025 Lawrence E. Adjah - The 100 Marriage Assessment - Series 1', { align: 'center' });

      // Finalize the PDF
      doc.end();
    } catch (error) {
      console.error('Error generating PDF:', error);
      reject(error);
    }
  });
}