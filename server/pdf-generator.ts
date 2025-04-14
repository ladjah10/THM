import PDFDocument from 'pdfkit';
import { AssessmentResult } from '../shared/schema';
import fs from 'fs';

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
        .text(`Marriage Status: ${assessment.demographics.marriageStatus}`)
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
        .text('Understanding Your Score: Your assessment score reflects your perspectives on relationship, not a judgment of readiness. Higher percentages indicate alignment with traditional marriage values, while lower percentages suggest more progressive viewpoints. Neither approach is inherently better—they simply represent different relationship styles.', {
          width: doc.page.width - 100,
          align: 'justify'
        });
        
      doc.moveDown(1);
      
      // Profile section
      doc.fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#2c3e50')
        .text('Your Psychographic Profiles');
      
      // Primary Profile
      doc.moveDown(0.5)
        .fontSize(16)
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
        
      // Gender-specific profile if available
      if (assessment.genderProfile) {
        doc.moveDown(1.5)
          .fontSize(16)
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
        .text('Each section score represents your perspective in a specific relationship area. These scores are used to determine your psychographic profiles. Higher percentages typically indicate more traditional views, while lower percentages suggest more progressive approaches to relationships.', {
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

      // Add a divider
      doc.moveDown(1)
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