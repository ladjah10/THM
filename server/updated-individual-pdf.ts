import PDFDocument from 'pdfkit';
import { AssessmentResult } from '../shared/schema';
import fs from 'fs';
import path from 'path';
import { 
  baselineStatistics, 
  getPercentileDescription 
} from '../client/src/utils/statisticsUtils';

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

// Function to create a PDF buffer from an assessment result that matches our sample visualization
export async function generateIndividualAssessmentPDF(assessment: AssessmentResult): Promise<Buffer> {
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

      // ---------- PAGE 1 ----------
      
      // Header
      doc.fontSize(24)
        .font('Helvetica-Bold')
        .fillColor('#1a365d')
        .text('The 100 Marriage Assessment - Series 1', { align: 'center' });
        
      doc.moveDown(0.5)
        .fontSize(16)
        .fillColor('#3182ce')
        .text('Personal Assessment Results', { align: 'center' });
      
      // Add a horizontal line
      doc.strokeColor('#e2e8f0')
        .lineWidth(1)
        .moveTo(50, doc.y + 10)
        .lineTo(doc.page.width - 50, doc.y + 10)
        .stroke();
      
      // Personal Information section
      doc.moveDown(1)
        .fontSize(16)
        .font('Helvetica-Bold')
        .fillColor('#2d3748')
        .text('Personal Information');
      
      // Basic user information
      doc.moveDown(0.5)
        .fontSize(12)
        .font('Helvetica')
        .fillColor('#4a5568')
        .text(`Name: ${assessment.name}`)
        .text(`Gender: ${assessment.demographics.gender}`)
        .text(`Life Stage: ${assessment.demographics.lifeStage || 'Not specified'}`)
        .text(`Birthday: ${assessment.demographics.birthday || 'Not specified'}`)
        .text(`THM Arranged Marriage Pool: ${assessment.demographics.interestedInArrangedMarriage ? 'Applied' : 'Not applied'}`)
        .text(`Date: ${new Date(assessment.timestamp).toLocaleDateString()}`);
      
      // Overall Score section with a visual representation
      doc.moveDown(1.5)
        .fontSize(16)
        .font('Helvetica-Bold')
        .fillColor('#2d3748')
        .text('Overall Assessment Score', { align: 'center' });

      // Draw score circle
      const scoreRadius = 45;
      const centerX = doc.page.width / 2;
      const circleY = doc.y + 50;
      const scoreText = `${Math.round(assessment.scores.overallPercentage)}%`;
      
      doc.circle(centerX, circleY, scoreRadius)
        .fillAndStroke('#3182ce', '#3182ce');
        
      // Position text in the center of the circle
      doc.fillColor('white')
        .font('Helvetica-Bold')
        .fontSize(24);
      
      // Calculate width of the score text to center it
      const scoreTextWidth = doc.widthOfString(scoreText);
      const textHeight = doc.currentLineHeight();
      
      doc.text(scoreText, centerX - scoreTextWidth / 2, circleY - textHeight / 2);
      
      // Move past the circle
      doc.moveDown(6);
      
      // Add score explanation with better width constraints
      doc.fontSize(12)
        .font('Helvetica')
        .fillColor('#4a5568')
        .text('Understanding Your Score: Your assessment score reflects your perspectives on marriage, not a judgment of readiness. Higher percentages indicate alignment with traditional marriage values, while lower percentages suggest less traditional approaches. Neither is inherently better—just different expectations.', {
          width: doc.page.width - 100,
          align: 'left'
        });
        
      doc.moveDown(0.5);
      
      // Add comparison explanation in bullet points
      doc.fontSize(12)
        .font('Helvetica')
        .fillColor('#4a5568')
        .text('• The most important consideration is how your assessment and approach compares with someone you are married to or discerning marriage with.', {
          width: doc.page.width - 120,
          indent: 10,
          align: 'left'
        });
        
      doc.moveDown(0.3);
        
      doc.fontSize(12)
        .font('Helvetica')
        .fillColor('#4a5568')
        .text('• The closer the percentage (with your spouse), overall, the more aligned and successful you will be.', {
          width: doc.page.width - 120,
          indent: 10,
          align: 'left'
        });
        
      doc.moveDown(1.5);
      
      // Profile section
      doc.fontSize(16)
        .font('Helvetica-Bold')
        .fillColor('#2d3748')
        .text('Your Psychographic Profiles');
      
      // Primary Profile
      doc.moveDown(0.5);
      
      // No image support for now - use text only
      doc.fontSize(14)
        .fillColor('#3182ce')
        .text(`${assessment.profile.name} (General Profile)`);
        
      doc.moveDown(0.5)
        .fontSize(12)
        .fillColor('#4a5568')
        .font('Helvetica')
        .text(assessment.profile.description, {
          align: 'left',
          width: doc.page.width - 100,
        });
      
      // ---------- PAGE 2 ----------
      
      doc.addPage();
      
      // Gender-specific profile if available
      if (assessment.genderProfile) {
        doc.fontSize(16)
          .font('Helvetica-Bold')
          .fillColor('#2d3748')
          .text('Your Gender-Specific Profile');
          
        doc.moveDown(0.5);
        
        // No image support for now - use text only
        doc.fontSize(14)
          .fillColor('#805ad5') // Purple color for gender profile
          .text(`${assessment.genderProfile.name} (${assessment.demographics.gender === 'male' ? 'Male' : 'Female'}-Specific Profile)`);
          
        doc.moveDown(0.5)
          .fontSize(12)
          .fillColor('#4a5568')
          .font('Helvetica')
          .text(assessment.genderProfile.description, {
            align: 'left',
            width: doc.page.width - 100,
          });
        
        doc.moveDown(1.5);
      }
      
      // Section scores
      doc.fontSize(16)
        .font('Helvetica-Bold')
        .fillColor('#2d3748')
        .text('Section Scores');
        
      doc.moveDown(0.5)
        .fontSize(12)
        .fillColor('#4a5568')
        .text('Each section score represents your perspective in a specific relationship area. These scores determine your psychographic profiles. Higher percentages typically indicate more traditional views, while lower percentages suggest less traditional approaches.', {
          width: doc.page.width - 100,
          align: 'left'
        });
        
      doc.moveDown(1);
      
      // Calculate the maximum width available for the bars
      const maxBarWidth = doc.page.width - 200;
      
      // Draw scores for each section
      Object.entries(assessment.scores.sections).forEach(([sectionName, score]) => {
        // Draw section name and score with improved alignment
        doc.fontSize(12)
          .font('Helvetica')
          .fillColor('#4a5568');
          
        // First draw the section name aligned left
        doc.text(`${sectionName}:`, 50, doc.y, { 
          continued: false
        });
        
        // Then draw the score right-aligned
        doc.fillColor('#3182ce')
          .text(`${Math.round(score.percentage)}%`, 250, doc.y - doc.currentLineHeight(), {
            align: 'left'
          });
        
        // Calculate the bar width based on the percentage
        const barWidth = (score.percentage / 100) * maxBarWidth;
        
        // Draw the background bar
        doc.rect(50, doc.y + 5, maxBarWidth, 10)
          .fillColor('#f0f0f0');
          
        // Draw the score bar
        doc.rect(50, doc.y + 5, barWidth, 10)
          .fillColor('#3182ce');
          
        doc.moveDown(1);
      });
      
      // ---------- PAGE 3 ----------
      
      doc.addPage();
      
      const genderKey = assessment.demographics.gender === 'male' ? 'male' : 'female';
      const genderText = assessment.demographics.gender === 'male' ? 'men' : 'women';
      
      // Add gender-specific header with background
      doc.rect(0, 0, doc.page.width, 80).fill('#f0f7ff');
      
      doc.fontSize(18)
        .font('Helvetica-Bold')
        .fillColor('#2c5282')
        .text(`How You Compare to Other ${genderText.charAt(0).toUpperCase() + genderText.slice(1)}`, 50, 30, { 
          align: 'center',
          width: doc.page.width - 100
        });
      
      // Position text with proper parameters
      doc.fontSize(12)
        .font('Helvetica')
        .fillColor('#4a5568')
        .text(`Based on responses from other ${genderText} who have taken this assessment, we've prepared gender-specific comparisons to help you understand your results in context.`, 
          50, 55, {
            width: doc.page.width - 100,
            align: 'center'
          });
      
      // Calculate percentile for overall score
      const overallScore = Math.round(assessment.scores.overallPercentage);
      const { mean, standardDeviation } = baselineStatistics.overall.byGender[genderKey];
      
      // Simplified z-score to percentile calculation
      const zScore = (overallScore - mean) / standardDeviation;
      const percentile = Math.min(99, Math.max(1, Math.round(50 + (zScore * 30))));
      const percentileDesc = getPercentileDescription(percentile);
      
      // Draw overall percentile section with box
      doc.rect(50, 100, doc.page.width - 100, 160)
        .fillAndStroke('white', '#e2e8f0');
      
      doc.fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#2d3748')
        .text('Overall Score Comparison', 70, 115);
      
      // Draw the actual comparison visualization
      const overallBoxY = 145;
      
      // Your score info box
      doc.rect(70, overallBoxY, 150, 60).fillAndStroke('#f8fafc', '#e2e8f0');
      doc.fontSize(12)
        .font('Helvetica-Bold')
        .fillColor('#2d3748')
        .text('Your Score:', 85, overallBoxY + 10);
      
      doc.fontSize(22)
        .font('Helvetica-Bold')
        .fillColor('#3182ce')
        .text(`${Math.round(overallScore)}%`, 85, overallBoxY + 30);
      
      // Average score info box
      doc.rect(250, overallBoxY, 150, 60).fillAndStroke('#f8fafc', '#e2e8f0');
      doc.fontSize(12)
        .font('Helvetica-Bold')
        .fillColor('#2d3748')
        .text(`${genderText.charAt(0).toUpperCase() + genderText.slice(1)} Average:`, 265, overallBoxY + 10);
      
      doc.fontSize(22)
        .font('Helvetica-Bold')
        .fillColor('#718096')
        .text(`${Math.round(mean)}%`, 265, overallBoxY + 30);
      
      // Percentile visualization
      doc.rect(70, overallBoxY + 70, 330, 10).fillAndStroke('#f0f5fa', '#e2e8f0');
      
      // Draw percentile indicator
      const percentileWidth = 330;
      const arrowPosition = Math.min(percentileWidth - 10, Math.max(10, (percentile / 100) * percentileWidth));
      
      // Draw percentile scale
      doc.fontSize(9)
        .font('Helvetica')
        .fillColor('#718096');
      
      // Scale markers
      for (let i = 0; i <= 100; i += 25) {
        const markerX = 70 + (i / 100) * percentileWidth;
        doc.moveTo(markerX, overallBoxY + 95)
           .lineTo(markerX, overallBoxY + 100)
           .stroke('#cbd5e0');
        
        doc.text(`${i}%`, markerX - 8, overallBoxY + 102);
      }
      
      // Draw triangle pointer
      const triangleY = overallBoxY + 85;
      doc.polygon(
        [70 + arrowPosition, triangleY],
        [70 + arrowPosition - 8, triangleY - 8], 
        [70 + arrowPosition + 8, triangleY - 8]
      ).fill('#3182ce');
      
      // Percentile text
      doc.fontSize(10)
        .font('Helvetica-Bold')
        .fillColor('#3182ce')
        .text(`${percentile}th Percentile`, 70 + arrowPosition - 35, triangleY - 25, { width: 70, align: 'center' });
      
      // Explanation text below visualization
      doc.fontSize(11)
        .font('Helvetica')
        .fillColor('#4a5568')
        .text(`Your overall score of ${Math.round(overallScore)}% is ${percentileDesc} compared to other ${genderText}.`, 70, overallBoxY + 125);
        
      // Book promotion
      doc.moveDown(2)
        .fontSize(16)
        .font('Helvetica-Bold')
        .fillColor('#2d3748')
        .text('Continue Your Journey');
        
      // Create a box for the book promotion
      const bookboxY = doc.y + 10;
      doc.rect(50, bookboxY, doc.page.width - 100, 120)
        .fillAndStroke('#f8f9fa', '#e2e8f0');
        
      // Book cover placeholder
      doc.rect(70, bookboxY + 10, 70, 100)
        .fillAndStroke('#3182ce', '#2b6cb0');
      doc.fontSize(12)
        .fillColor('white')
        .text('BOOK\nCOVER', 70 + 15, bookboxY + 45, { align: 'center', width: 40 });
      
      // Book promo text
      doc.fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#2c5282')
        .text("The 100 Marriage", 160, bookboxY + 20);
        
      doc.fontSize(12)
        .font('Helvetica')
        .fillColor('#4a5568')
        .text("Lawrence Adjah's best-selling book provides a comprehensive framework for building a strong foundation for marriage based on shared expectations and understanding.", 
          160, bookboxY + 45, { width: doc.page.width - 230 });
          
      doc.fontSize(12)
        .fillColor('#3182ce')
        .text("Purchase the book to deepen your understanding of the results in this assessment.",
          160, bookboxY + 85, { width: doc.page.width - 230 });
          
      // Consultation link
      doc.moveDown(2)
        .fontSize(12)
        .font('Helvetica-Bold')
        .fillColor('#2d3748')
        .text('For a more personalized discussion of your results:', 50, doc.y + 10);
        
      doc.fontSize(12)
        .fillColor('#3182ce')
        .text('https://lawrence-adjah.clientsecure.me/request/service', 50, doc.y + 5, { link: 'https://lawrence-adjah.clientsecure.me/request/service' });
      
      // Finish the PDF
      doc.end();
    } catch (error) {
      console.error('Error generating PDF:', error);
      reject(error);
    }
  });
}