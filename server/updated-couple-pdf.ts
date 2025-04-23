import PDFDocument from 'pdfkit';
import { CoupleAssessmentReport } from '../shared/schema';
import fs from 'fs';
import path from 'path';
import { addImprovedProfilesReferenceSection } from './improved-psychographic-profiles';

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

// Function to create a PDF buffer from a couple assessment report
export async function generateCoupleAssessmentPDF(report: CoupleAssessmentReport): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      // Create a PDF document
      const doc = new PDFDocument({
        size: 'LETTER',
        margin: 50,
        info: {
          Title: 'The 100 Marriage Assessment - Series 1',
          Author: 'Lawrence E. Adjah',
          Subject: 'Couple Discussion Guide',
        }
      });

      // Create a buffer to store the PDF
      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      // Extract the data we need
      const { primaryAssessment, spouseAssessment, differenceAnalysis, overallCompatibility } = report;
      const primary = primaryAssessment;
      const spouse = spouseAssessment;
      const completionDate = new Date(report.timestamp).toLocaleDateString();

      // ---------- PAGE 1 (Cover Page) ----------
      
      // PDF heading - keep centered for title
      doc.fontSize(24)
        .font('Helvetica-Bold')
        .fillColor('#1a365d')
        .text('The 100 Marriage Assessment - Series 1', { align: 'center' });
      
      doc.moveDown(0.5)
        .fontSize(18)
        .fillColor('#3182ce')
        .text('Couple Discussion Guide', { align: 'center' });
      
      // Compatibility score circle
      const scoreRadius = 50;
      const centerX = doc.page.width / 2;
      const circleY = doc.y + 80;
      
      doc.circle(centerX, circleY, scoreRadius)
        .fillAndStroke('#3182ce', '#3182ce');
      
      doc.fillColor('white')
        .font('Helvetica-Bold')
        .fontSize(28);
      
      const scoreText = `${Math.round(overallCompatibility)}%`;
      const textWidth = doc.widthOfString(scoreText);
      const textHeight = doc.currentLineHeight();
      
      doc.text(scoreText, centerX - textWidth / 2, circleY - textHeight / 2);
      
      doc.fontSize(14)
        .fillColor('white')
        .text('Compatibility', centerX - 40, circleY + 15);
      
      // Move past the circle
      doc.y = circleY + scoreRadius + 30;
      
      // Couple names - properly centered
      doc.fontSize(16)
        .fillColor('#2d3748')
        .font('Helvetica-Bold');
      
      // Calculate exact position for true centering
      const coupleNames = `${primary.name} & ${spouse.name}`;
      const coupleNamesWidth = doc.widthOfString(coupleNames);
      doc.text(coupleNames, (doc.page.width / 2) - (coupleNamesWidth / 2), doc.y);
      
      // Completion date
      doc.moveDown(0.5)
        .fontSize(12)
        .fillColor('#718096')
        .font('Helvetica')
        .text(`Completed on ${completionDate}`, { align: 'center' });
      
      doc.moveDown(1.5);
      
      // Introduction - move much closer to left margin with narrower width
      const leftMargin = 50; // Standard page margin
      doc.fontSize(12)
        .fillColor('#4a5568')
        .font('Helvetica');
        
      // Position text at left margin with proper width
      doc.text('Thank you for completing The 100 Marriage Assessment - Series 1 as a couple. This discussion guide provides insights into your perspectives on marriage and highlights areas where further conversation may strengthen your relationship.', 
        leftMargin, doc.y, {
          width: doc.page.width - 150 // Narrower width to prevent text overrun
        });
      
      doc.moveDown(1.5); // Increased spacing
      
      // Section heading - also start at left margin
      doc.fontSize(13) // Slightly larger font
        .fillColor('#2d3748') // Darker color for better visibility
        .font('Helvetica-Bold');
        
      // Position heading at left margin
      doc.text('Understanding Your Compatibility Score:', 
        leftMargin, doc.y, {
          width: doc.page.width - 150 // Narrower width to prevent overrun
        });
      
      doc.moveDown(0.5)
        .fontSize(12)
        .fillColor('#4a5568')
        .font('Helvetica');
        
      // Position explanation text at left margin
      doc.text('Your compatibility score reflects the alignment of your perspectives across all assessment sections. A higher score indicates greater similarity in your views on key marriage dimensions, while a lower score highlights areas where your expectations differ. This is not a judgment of relationship quality, but rather a tool to identify areas for meaningful discussion.', 
        leftMargin, doc.y, {
          width: doc.page.width - 150 // Narrower width to prevent text overrun
        });
      
      // ---------- PAGE 2 (Score Comparison) ----------
      
      doc.addPage();
      
      doc.fontSize(16)
        .font('Helvetica-Bold')
        .fillColor('#2d3748')
        .text('Score Comparison');
      
      doc.moveDown(0.5)
        .fontSize(12)
        .font('Helvetica')
        .fillColor('#4a5568')
        .text('Understanding Your Scores', {
          align: 'left',
          width: doc.page.width - 100
        });
        
      doc.moveDown(0.3)  
        .fontSize(11)
        .fillColor('#4a5568')
        .font('Helvetica')
        .text('The scores below reflect how each of you answered the assessment, with your individual percentages showing your unique perspective in each section, based on the specific weight of your responses. These aren\'t "good" or "bad" scores—they\'re simply a mirror of your personal expectations and priorities. What matters most is the "Difference" column, which highlights how closely your responses and expectations align in each section and overall. Why does this matter? We believe that the more aligned your expectations are, the stronger foundation you\'ll build for a thriving, healthy marriage.', {
          width: doc.page.width - 100,
          align: 'left'
        });
        
      doc.moveDown(1);
      
      // Create the comparison table
      const tableTop = doc.y + 10;
      const colWidth = (doc.page.width - 100) / 4;
      
      // Table headers
      doc.rect(50, tableTop, doc.page.width - 100, 30)
        .fillAndStroke('#f8fafc', '#e2e8f0');
      
      doc.fontSize(12)
        .font('Helvetica-Bold')
        .fillColor('#4a5568')
        .text('Section', 60, tableTop + 10)
        .text(`${primary.name.split(' ')[0]}'s Score`, 60 + colWidth, tableTop + 10)
        .text(`${spouse.name.split(' ')[0]}'s Score`, 60 + colWidth * 2, tableTop + 10)
        .text('Difference', 60 + colWidth * 3, tableTop + 10);
      
      // Draw separator line
      doc.lineWidth(1)
        .moveTo(50, tableTop + 30)
        .lineTo(doc.page.width - 50, tableTop + 30)
        .stroke('#e2e8f0');
      
      // Initialize vertical position for the first row
      let currentRowY = tableTop + 30;
      const rowHeight = 35; // Increase row height to prevent text overflow
      
      // Helper to draw a single row
      const drawRow = (section: string, primaryScore: number, spouseScore: number, rowY: number) => {
        const diff = Math.abs(Math.round(primaryScore) - Math.round(spouseScore));
        
        // Draw the row background
        doc.rect(50, rowY, doc.page.width - 100, rowHeight)
          .fillAndStroke('white', '#e2e8f0');
        
        // Calculate vertical center of row for better text alignment
        const textY = rowY + (rowHeight / 2) - 6;
        
        // Use smaller font size to prevent overflow
        doc.fontSize(11)
          .font('Helvetica')
          .fillColor('#4a5568')
          .text(section, 60, textY, {
            width: colWidth - 15, // Limit width to prevent overlap
            align: 'left'
          });
        
        doc.fillColor('#3182ce')
          .text(`${Math.round(primaryScore)}%`, 60 + colWidth, textY);
        
        doc.fillColor('#805ad5')
          .text(`${Math.round(spouseScore)}%`, 60 + colWidth * 2, textY);
        
        doc.fillColor('#4a5568')
          .text(`${diff}%`, 60 + colWidth * 3, textY);
        
        return rowY + rowHeight;
      };
      
      // Draw each section row
      Object.entries(primary.scores.sections).forEach(([sectionName, score]) => {
        const primaryScore = score.percentage;
        const spouseScore = spouse.scores.sections[sectionName]?.percentage || 0;
        currentRowY = drawRow(sectionName, primaryScore, spouseScore, currentRowY);
      });
      
      // Overall row with bold font
      doc.rect(50, currentRowY, doc.page.width - 100, rowHeight)
        .fillAndStroke('#f8fafc', '#e2e8f0');
      
      const primaryOverall = Math.round(primary.scores.overallPercentage);
      const spouseOverall = Math.round(spouse.scores.overallPercentage);
      const overallDiff = Math.abs(primaryOverall - spouseOverall);
      
      doc.fontSize(12)
        .font('Helvetica-Bold')
        .fillColor('#2d3748')
        .text('Overall', 60, currentRowY + 10);
      
      doc.fillColor('#3182ce')
        .text(`${primaryOverall}%`, 60 + colWidth, currentRowY + 10);
      
      doc.fillColor('#805ad5')
        .text(`${spouseOverall}%`, 60 + colWidth * 2, currentRowY + 10);
      
      doc.fillColor('#2d3748')
        .text(`${overallDiff}%`, 60 + colWidth * 3, currentRowY + 10);
      
      // Move down after the table
      doc.y = currentRowY + rowHeight + 30;
      
      // Areas of alignment and conversation
      const areasY = doc.y;
      
      // Create two columns for strengths and vulnerabilities
      const colX1 = 50;
      const colX2 = doc.page.width / 2 + 10;
      const colBoxWidth = (doc.page.width - 100) / 2 - 10;
      
      // Areas of Strong Alignment
      doc.rect(colX1, areasY, colBoxWidth, 100)
        .fillAndStroke('#f0fff4', '#c6f6d5')
        .lineWidth(0)
        .rect(colX1, areasY, 4, 100)
        .fill('#38a169');
      
      doc.fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#2d3748')
        .text('Areas of Strong Alignment', colX1 + 15, areasY + 15);
      
      doc.fontSize(12)
        .font('Helvetica')
        .fillColor('#4a5568')
        .text(differenceAnalysis.strengthAreas.join('\n'), colX1 + 15, areasY + 40, {
          width: colBoxWidth - 30,
          bulletRadius: 2
        });
      
      // Areas for Additional Conversation
      doc.rect(colX2, areasY, colBoxWidth, 100)
        .fillAndStroke('#fff5f5', '#fed7d7')
        .lineWidth(0)
        .rect(colX2, areasY, 4, 100)
        .fill('#e53e3e');
      
      doc.fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#2d3748')
        .text('Areas for Additional Conversation', colX2 + 15, areasY + 15);
      
      doc.fontSize(12)
        .font('Helvetica')
        .fillColor('#4a5568')
        .text(differenceAnalysis.vulnerabilityAreas.join('\n'), colX2 + 15, areasY + 40, {
          width: colBoxWidth - 30,
          bulletRadius: 2
        });
      
      // ---------- PAGE 3 (Differences to Discuss) ----------
      
      doc.addPage();
      
      doc.fontSize(16)
        .font('Helvetica-Bold')
        .fillColor('#2d3748')
        .text('Key Differences to Discuss');
      
      doc.moveDown(0.5)
        .fontSize(12)
        .font('Helvetica')
        .fillColor('#4a5568')
        .text('These are questions where your responses showed notable differences. Using these as conversation starters can help strengthen your understanding of each other\'s perspectives.', {
          width: doc.page.width - 100
        });
      
      doc.moveDown(1);
      
      // Display top 3 major differences (or less if there aren't that many)
      const differencesToShow = differenceAnalysis.majorDifferences.slice(0, 3);
      
      differencesToShow.forEach((diff, index) => {
        // Box for each difference
        const boxY = doc.y;
        doc.rect(50, boxY, doc.page.width - 100, 150)
          .fillAndStroke('#fff9db', '#feebc8')
          .lineWidth(0)
          .rect(50, boxY, 4, 150)
          .fill('#f9a825');
        
        // Question text
        doc.fontSize(12)
          .font('Helvetica-Bold')
          .fillColor('#2d3748')
          .text(`${diff.questionText} (${diff.section})`, 70, boxY + 15, {
            width: doc.page.width - 140
          });
        
        // Responses
        doc.moveDown(0.5)
          .fontSize(12)
          .font('Helvetica-Bold')
          .fillColor('#2c5282')
          .text(`${primary.name.split(' ')[0]}:`, 70, doc.y + 5);
        
        doc.fontSize(12)
          .font('Helvetica')
          .fillColor('#4a5568')
          .text(diff.primaryResponse, 150, doc.y - doc.currentLineHeight(), {
            width: doc.page.width - 220
          });
        
        doc.moveDown(0.5)
          .font('Helvetica-Bold')
          .fillColor('#553c9a')
          .text(`${spouse.name.split(' ')[0]}:`, 70, doc.y + 5);
        
        doc.fontSize(12)
          .font('Helvetica')
          .fillColor('#4a5568')
          .text(diff.spouseResponse, 150, doc.y - doc.currentLineHeight(), {
            width: doc.page.width - 220
          });
        
        // Discussion guide box
        doc.rect(70, doc.y + 10, doc.page.width - 140, 60)
          .fillAndStroke('#ebf8ff', '#bee3f8');
        
        doc.fontSize(12)
          .font('Helvetica-Bold')
          .fillColor('#2c5282')
          .text('Discussion Guide:', 80, doc.y + 20);
        
        // Generate a unique discussion prompt based on the difference
        let discussionPrompt = 'Consider discussing how your different perspectives might complement each other.';
        
        if (diff.section === 'Your Finances') {
          discussionPrompt = 'How might you create a financial approach that respects both viewpoints?';
        } else if (diff.section === 'Your Faith Life') {
          discussionPrompt = 'How can you honor each other\'s faith perspectives while growing together?';
        } else if (diff.section === 'Your Family/Home Life') {
          discussionPrompt = 'What family boundaries would make both of you comfortable?';
        } else if (diff.section === 'Your Marriage and Boundaries') {
          discussionPrompt = 'How can you establish relationship boundaries that feel right to both of you?';
        }
        
        doc.fontSize(12)
          .font('Helvetica')
          .fillColor('#4a5568')
          .text(discussionPrompt, 80, doc.y + 5, {
            width: doc.page.width - 160
          });
        
        doc.fontSize(10)
          .fillColor('#2c5282')
          .text(`Reference: See "The 100 Marriage" for more guidance on ${diff.section.toLowerCase()}.`, 80, doc.y + 10, {
            width: doc.page.width - 160
          });
        
        // Move down for next difference or section
        doc.y = boxY + 160;
        
        // Add a page break if needed
        if (index < differencesToShow.length - 1 && doc.y > doc.page.height - 180) {
          doc.addPage();
        }
      });
      
      // If we have less than 3 differences shown, make sure we still have room for profiles
      if (differencesToShow.length < 3 || doc.y <= doc.page.height - 240) {
        // Continue on this page
        doc.moveDown(1.5);
      } else {
        // Add a new page for profiles
        doc.addPage();
      }
      
      // ---------- PAGE 4 (Psychographic Profiles & Book Promotion) ----------
      
      doc.fontSize(16)
        .font('Helvetica-Bold')
        .fillColor('#2d3748')
        .text('Your Psychographic Profiles');
      
      doc.moveDown(0.5);
      
      // Create profile summary box
      const summaryBoxY = doc.y + 10;
      doc.rect(50, summaryBoxY, doc.page.width - 100, 90)
        .fillAndStroke('#f8fafc', '#e2e8f0');
      
      // Primary partner profile
      doc.fontSize(12)
        .font('Helvetica-Bold')
        .fillColor('#3182ce')
        .text(`${primary.name.split(' ')[0]}: ${primary.profile.name} (General), ${primary.genderProfile?.name || 'No gender profile'} (${primary.demographics.gender === 'male' ? 'Male' : 'Female'}-Specific)`, 
          70, summaryBoxY + 15, {
            width: doc.page.width - 140
          });
      
      // Spouse profile  
      doc.fontSize(12)
        .font('Helvetica-Bold')
        .fillColor('#805ad5')
        .text(`${spouse.name.split(' ')[0]}: ${spouse.profile.name} (General), ${spouse.genderProfile?.name || 'No gender profile'} (${spouse.demographics.gender === 'male' ? 'Male' : 'Female'}-Specific)`, 
          70, summaryBoxY + 40, {
            width: doc.page.width - 140
          });
      
      // Profile compatibility explanation
      doc.fontSize(12)
        .font('Helvetica')
        .fillColor('#4a5568')
        .text('Your complementary profiles suggest a relationship with unique strengths and growth areas. Refer to your individual assessment reports for detailed explanations of each profile.', 
          70, summaryBoxY + 65, {
            width: doc.page.width - 140
          });
      
      doc.y = summaryBoxY + 110;
      
      // Book promotion box - expanded with no book cover placeholder
      const bookBoxY = doc.y;
      doc.rect(50, bookBoxY, doc.page.width - 100, 140) // Increase height to prevent text overrun
        .fillAndStroke('#f9f7ff', '#e9d8fd');
      
      // Book promo text - starts at left margin with more space
      doc.fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#553c9a')
        .text("Continue Your Journey with \"The 100 Marriage\"", 70, bookBoxY + 20);
        
      doc.fontSize(12)
        .font('Helvetica')
        .fillColor('#4a5568')
        .text("If you do not already own the book, purchase your copy of the bestselling book, The 100 Marriage, so you and your significant other have the opportunity to go back through each question together at your own pace.", 
          70, bookBoxY + 45, { width: doc.page.width - 140 }); // Full width without book cover
          
      doc.moveDown(0.8);
      
      doc.fontSize(12)
        .font('Helvetica')
        .fillColor('#4a5568')
        .text("Alternatively, you can follow the path of many couples who complete The 100 Marriage and decide they would like to walk through their points of misaligned with counsel.", 
          70, doc.y, { width: doc.page.width - 140 }); // Full width without book cover
      
      // Consultation link
      doc.moveDown(2)
        .fontSize(12)
        .font('Helvetica-Bold')
        .fillColor('#2d3748')
        .text('For a personal consultation to discuss your results:', { align: 'center' });
        
      doc.fontSize(12)
        .fillColor('#3182ce')
        .text('https://lawrence-adjah.clientsecure.me/request/service', { align: 'center', link: 'https://lawrence-adjah.clientsecure.me/request/service' });
      
      // Add the psychographic profiles reference section
      addImprovedProfilesReferenceSection(doc);
      
      // Finish the PDF
      doc.end();
    } catch (error) {
      console.error('Error generating couple PDF:', error);
      reject(error);
    }
  });
}