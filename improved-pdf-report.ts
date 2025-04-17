import fs from 'fs';
import path from 'path';
import PDFDocument from 'pdfkit';
import { AssessmentResult } from './shared/schema';
import { baselineStatistics } from './client/src/utils/statisticsUtils';

/**
 * This script generates an improved PDF report that matches the design
 * shown in the sample reports provided by the client.
 */
async function generateImprovedPDF(): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      // Create a PDF document with letter size
      const doc = new PDFDocument({
        size: 'LETTER',
        margin: 50,
        info: {
          Title: 'The 100 Marriage Assessment - Series 1',
          Author: 'Lawrence E. Adjah',
          Subject: 'Individual Assessment Report',
        }
      });

      // Create a buffer to store the PDF
      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });

      // Sample assessment data 
      const assessment = {
        name: 'John Smith',
        email: 'john.smith@example.com',
        timestamp: new Date().toISOString(),
        demographics: {
          firstName: 'John',
          lastName: 'Smith',
          email: 'john.smith@example.com',
          phone: '212-555-1234',
          gender: 'male',
          ethnicity: 'White, Caucasian',
          desireChildren: 'Yes',
          hasPaid: true,
          lifeStage: 'Established Adult',
          birthday: '1985-06-15',
          interestedInArrangedMarriage: false,
          city: 'New York',
          state: 'NY',
          zipCode: '10001'
        },
        profile: {
          id: 2,
          name: 'Balanced Visionary',
          description: 'You have a thoughtful, balanced approach to marriage. You value both tradition and modern perspectives, seeking harmony between stability and flexibility. Your responses show a well-rounded understanding of marriage dynamics with a natural ability to adapt while maintaining core values.',
          genderSpecific: 'false',
          iconPath: 'attached_assets/BV 6.png',
          criteria: [
            { section: 'Spiritual Beliefs', min: 70 },
            { section: 'Family Planning', min: 65 },
            { section: 'Role Expectations', min: 65 }
          ]
        },
        genderProfile: {
          id: 7,
          name: 'Structured Leader',
          description: 'As a Structured Leader, you bring organization and clarity to relationships. You value defined roles and clear communication. Your thoughtful approach to leadership means you provide stability while still valuing input from your spouse. You excel at creating systems that help marriages thrive.',
          genderSpecific: 'male',
          iconPath: 'attached_assets/SL 12.png',
          criteria: [
            { section: 'Role Expectations', min: 70 },
            { section: 'Financial Values', min: 65 },
            { section: 'Communication', min: 75 }
          ]
        },
        scores: {
          sections: {
            'Spiritual Beliefs': { earned: 92, possible: 100, percentage: 92 },
            'Family Planning': { earned: 84, possible: 100, percentage: 84 },
            'Role Expectations': { earned: 88, possible: 100, percentage: 88 },
            'Physical Intimacy': { earned: 78, possible: 100, percentage: 78 },
            'Conflict Resolution': { earned: 82, possible: 100, percentage: 82 },
            'Financial Values': { earned: 76, possible: 100, percentage: 76 },
            'Communication': { earned: 86, possible: 100, percentage: 86 },
            'Support Networks': { earned: 72, possible: 100, percentage: 72 },
            'Recreation & Leisure': { earned: 68, possible: 100, percentage: 68 }
          },
          totalEarned: 726,
          totalPossible: 900,
          overallPercentage: 80.67,
          strengths: ['Spiritual Beliefs', 'Role Expectations', 'Communication'],
          improvementAreas: ['Recreation & Leisure', 'Support Networks', 'Financial Values']
        }
      };

      // Define gender key for statistics
      const genderKey = assessment.demographics.gender?.toLowerCase() === 'female' ? 'female' : 'male';
      const genderText = genderKey === 'female' ? 'women' : 'men';
      
      // ---------- PAGE 1 ----------
      
      // Header
      doc.fontSize(24)
        .font('Helvetica-Bold')
        .fillColor('#2c3e50')
        .text('The 100 Marriage Assessment - Series 1', { align: 'center' });
        
      doc.moveDown(0.5)
        .fontSize(18)
        .fillColor('#3498db')
        .text('Personal Assessment Results', { align: 'center' });
      
      // Add a horizontal line
      doc.strokeColor('#ddd')
        .lineWidth(1)
        .moveTo(50, doc.y + 10)
        .lineTo(doc.page.width - 50, doc.y + 10)
        .stroke();
      
      // Personal Information section
      doc.moveDown(1)
        .fontSize(16)
        .font('Helvetica-Bold')
        .fillColor('#2c3e50')
        .text('Personal Information');
      
      // Basic user information
      doc.moveDown(0.5)
        .fontSize(12)
        .font('Helvetica')
        .fillColor('#333')
        .text(`Name: ${assessment.name}`)
        .text(`Gender: ${assessment.demographics.gender}`)
        .text(`Life Stage: ${assessment.demographics.lifeStage}`)
        .text(`Birthday: ${assessment.demographics.birthday}`)
        .text(`THM Arranged Marriage Pool: ${assessment.demographics.interestedInArrangedMarriage ? 'Applied' : 'Not applied'}`)
        .text(`Date: ${new Date().toLocaleDateString()}`);
      
      // Overall Score section
      doc.moveDown(1.5)
        .fontSize(16)
        .font('Helvetica-Bold')
        .fillColor('#2c3e50')
        .text('Overall Assessment Score');
      
      // Score circle
      const centerX = doc.page.width / 2;
      const circleY = doc.y + 50;
      const circleRadius = 45;
      
      doc.circle(centerX, circleY, circleRadius)
        .fillAndStroke('#3498db', '#3498db');
      
      // Score text
      doc.fillColor('white')
        .fontSize(24)
        .font('Helvetica-Bold');
      
      const scoreText = `${Math.round(assessment.scores.overallPercentage)}%`;
      const textWidth = doc.widthOfString(scoreText);
      const textHeight = doc.currentLineHeight();
      
      doc.text(scoreText, centerX - textWidth / 2, circleY - textHeight / 2);
      
      // Score explanation
      doc.moveDown(6)
        .fontSize(12)
        .fillColor('#333')
        .font('Helvetica')
        .text('Understanding Your Score: Your assessment score reflects your perspectives, not a judgment of readiness. Higher percentages indicate alignment with more traditional views, while lower percentages suggest less traditional approaches. Neither is inherently better—these simply reflect different expectations.', {
          width: doc.page.width - 100,
          align: 'left'
        });
      
      doc.moveDown(0.5)
        .text('• The most important consideration is how your assessment and profile align with someone you are married to or discerning marriage with.', {
          width: doc.page.width - 100,
          align: 'left'
        });
        
      doc.moveDown(0.5)
        .text('• The closer the percentage (with your spouse), overall, the more aligned your expectations will be.', {
          width: doc.page.width - 100,
          align: 'left'
        });
      
      // Psychographic Profiles section
      doc.moveDown(1)
        .fontSize(16)
        .font('Helvetica-Bold')
        .fillColor('#2c3e50')
        .text('Your Psychographic Profiles');
      
      // General Profile
      doc.moveDown(0.5)
        .fontSize(14)
        .fillColor('#3498db')
        .text(`${assessment.profile.name} (General Profile)`);
      
      doc.moveDown(0.5)
        .fontSize(11)
        .fillColor('#333')
        .font('Helvetica')
        .text(assessment.profile.description, {
          width: doc.page.width - 100,
          align: 'left'
        });
      
      // Gender-specific Profile
      doc.moveDown(1)
        .fontSize(14)
        .fillColor('#8e44ad')
        .text(`${assessment.genderProfile.name} (Male-Specific Profile)`);
      
      // ---------- PAGE 2 ----------
      
      doc.addPage();
      
      // Continue description from previous page
      doc.fontSize(11)
        .fillColor('#333')
        .font('Helvetica')
        .text(assessment.genderProfile.description, {
          width: doc.page.width - 100,
          align: 'left'
        });
      
      // Section Scores
      doc.moveDown(1.5)
        .fontSize(16)
        .font('Helvetica-Bold')
        .fillColor('#2c3e50')
        .text('Section Scores');
      
      doc.moveDown(0.5)
        .fontSize(11)
        .fillColor('#333')
        .text('Each section score represents your perspective in a specific relationship area. These scores are used to determine your psychographic profiles. Higher percentages typically indicate more traditional views, while lower percentages suggest less traditional approaches to relationships.', {
          width: doc.page.width - 100,
          align: 'left'
        });
      
      doc.moveDown(1);
      
      // Draw the section scores with horizontal bars
      const maxBarWidth = doc.page.width - 200;
      
      Object.entries(assessment.scores.sections).forEach(([sectionName, score]) => {
        doc.fontSize(12)
          .fillColor('#333')
          .text(`${sectionName}:`, 50, doc.y, { continued: false });
        
        doc.fillColor('#3498db')
          .text(`${Math.round(score.percentage)}%`, 200, doc.y - doc.currentLineHeight());
        
        // Draw background bar
        doc.rect(50, doc.y + 5, maxBarWidth, 10)
          .fillColor('#f0f0f0');
        
        // Draw score bar
        const barWidth = (score.percentage / 100) * maxBarWidth;
        doc.rect(50, doc.y + 5, barWidth, 10)
          .fillColor('#3498db');
        
        doc.moveDown(1);
      });
      
      // ---------- PAGE 3 ----------
      
      doc.addPage();
      
      // Gender-specific comparisons header with blue background
      doc.rect(0, 0, doc.page.width, 80).fill('#f0f7ff');
      
      doc.fontSize(18)
        .font('Helvetica-Bold')
        .fillColor('#2c5282')
        .text('How You Compare to Other Men', 50, 30, { 
          align: 'center',
          width: doc.page.width - 100
        });
      
      doc.fontSize(11)
        .font('Helvetica')
        .fillColor('#4a5568')
        .text('Based on responses from other men who have taken this assessment, we\'ve prepared gender-specific comparisons to help you understand your results in context.', 
          50, 55, {
            width: doc.page.width - 100,
            align: 'center'
          });
      
      // Overall score comparison
      doc.rect(50, 100, doc.page.width - 100, 140)
        .fillAndStroke('white', '#e2e8f0');
      
      doc.fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#2c3e50')
        .text('Overall Score Comparison', 70, 115);
      
      // Score boxes
      doc.rect(70, 145, 150, 60).fillAndStroke('#f8fafc', '#e2e8f0');
      doc.fontSize(12)
        .font('Helvetica-Bold')
        .fillColor('#2d3748')
        .text('Your Score:', 85, 155);
      
      doc.fontSize(22)
        .font('Helvetica-Bold')
        .fillColor('#3498db')
        .text(`${Math.round(assessment.scores.overallPercentage)}%`, 85, 175);
      
      doc.rect(250, 145, 150, 60).fillAndStroke('#f8fafc', '#e2e8f0');
      doc.fontSize(12)
        .font('Helvetica-Bold')
        .fillColor('#2d3748')
        .text('Men Average:', 265, 155);
      
      doc.fontSize(22)
        .font('Helvetica-Bold')
        .fillColor('#718096')
        .text('81%', 265, 175);
      
      // Percentile visualization
      doc.rect(70, 215, 330, 10).fillColor('#f0f0f0');
      
      // Add percentile marker
      const percentile = 49; // Example percentile
      const percentilePosition = 70 + (percentile / 100) * 330;
      
      // Draw triangle pointer
      doc.polygon(
        [percentilePosition, 212],
        [percentilePosition - 6, 205], 
        [percentilePosition + 6, 205]
      ).fill('#3498db');
      
      // Add scale text
      doc.fontSize(9)
        .fillColor('#718096')
        .text('0%', 70, 230)
        .text('25%', 70 + 330 * 0.25, 230)
        .text('50%', 70 + 330 * 0.5, 230)
        .text('75%', 70 + 330 * 0.75, 230)
        .text('100%', 70 + 330, 230);
      
      // Add percentile text
      doc.fontSize(10)
        .fillColor('#3498db')
        .text(`${percentile}th Percentile`, percentilePosition - 35, 185, { 
          width: 70, 
          align: 'center' 
        });
      
      // Add explanation
      doc.fontSize(11)
        .fillColor('#333')
        .font('Helvetica')
        .text(`Your overall score of ${Math.round(assessment.scores.overallPercentage)}% is close to the average of 81% for men.`, 70, 250)
        .text(`This places you in the ${percentile}th percentile.`, 70, 265);
      
      // Section comparisons title
      doc.moveDown(1)
        .fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#2c3e50')
        .text('Section Comparisons (Men-specific)', 50, 290);
      
      // Show all 9 section comparisons with 2-column layout
      // Define section data with percentiles
      const sectionData = [
        { name: 'Spiritual Beliefs', percentile: 74, diff: 6, higher: true },
        { name: 'Family Planning', percentile: 64, diff: 3, higher: true },
        { name: 'Role Expectations', percentile: 72, diff: 5, higher: true },
        { name: 'Physical Intimacy', percentile: 56, diff: 2, higher: true },
        { name: 'Conflict Resolution', percentile: 68, diff: 4, higher: true },
        { name: 'Financial Values', percentile: 54, diff: 2, higher: false },
        { name: 'Communication', percentile: 67, diff: 4, higher: true },
        { name: 'Support Networks', percentile: 52, diff: 3, higher: false },
        { name: 'Recreation & Leisure', percentile: 45, diff: 5, higher: false }
      ];
      
      // Add new page for section comparisons to have enough space
      doc.addPage();
      
      // Section comparisons title on new page
      doc.fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#2c3e50')
        .text('Section Comparisons (Men-specific)', 50, 50);
      
      let currentY = 80;
      const boxHeight = 90;
      const boxSpace = 15;
      
      // Draw all sections
      sectionData.forEach((section, index) => {
        // Check if we need to add a new page
        if (currentY + boxHeight > doc.page.height - 50) {
          doc.addPage();
          currentY = 50;
        }
        
        doc.rect(50, currentY, doc.page.width - 100, boxHeight)
          .fillAndStroke('white', '#e2e8f0');
        
        doc.fontSize(14)
          .font('Helvetica-Bold')
          .fillColor('#2c3e50')
          .text(section.name, 70, currentY + 15);
        
        doc.fontSize(10)
          .fillColor('#718096')
          .text(`(${section.percentile}th percentile)`, 70, currentY + 35);
        
        // Draw percentile bar
        doc.rect(70, currentY + 55, 330, 10).fillColor('#f0f0f0');
        doc.rect(70, currentY + 55, (section.percentile / 100) * 330, 10).fillColor('#3498db');
        
        // Comparison text
        const comparisonText = section.higher 
          ? `Higher than most men: ${section.diff}% higher than average`
          : `Lower than most men: ${section.diff}% lower than average`;
          
        doc.fontSize(10)
          .fillColor('#4a5568')
          .text(comparisonText, 70, currentY + 70);
        
        // Move to next position
        currentY += boxHeight + boxSpace;
      });
      
      // Add new page for Understanding Gender Comparisons box if needed
      if (currentY + 100 > doc.page.height - 50) {
        doc.addPage();
        currentY = 50;
      } else {
        currentY += 20; // Add some spacing
      }
      
      // Understanding gender comparisons box
      doc.rect(50, currentY, doc.page.width - 100, 80)
        .fillAndStroke('#f0f7ff', '#90cdf4');
      
      doc.fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#2c5282')
        .text('Understanding These Gender-Specific Comparisons', 70, currentY + 15);
      
      doc.fontSize(11)
        .font('Helvetica')
        .fillColor('#333')
        .text('These statistics compare your results specifically with other men. Higher or lower scores indicate different approaches to marriage, not better or worse ones. The most important consideration is how your assessment compares with your spouse or future spouse, as closer percentages typically indicate better alignment in expectations.', 
          70, currentY + 35, {
            width: doc.page.width - 140,
            align: 'left'
          });
          
      currentY += 100; // Update position after the box
      
      // Add new page for Compatibility Profile if needed
      if (currentY + 180 > doc.page.height - 50) {
        doc.addPage();
        currentY = 50;
      } else {
        currentY += 30; // Add spacing
      }
      
      // Compatibility profile
      doc.fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#2c3e50')
        .text('Your Compatibility Profile', 50, currentY);
      
      currentY += 25;
      
      doc.rect(50, currentY, doc.page.width - 100, 60)
        .fillAndStroke('#f8f9fa', '#e2e8f0');
      
      doc.fontSize(11)
        .fillColor('#333')
        .font('Helvetica')
        .text('Based on your psychographic profile, we\'ve identified the types of people you\'d likely be most compatible with. Closer alignment in expectations suggests better compatibility, but isn\'t mandatory for a successful relationship.', 70, currentY + 15, {
          width: doc.page.width - 140,
          align: 'left'
        });
      
      currentY += 80; // Move position after compatibility box
      
      // Add new page for Next Steps if needed
      if (currentY + 100 > doc.page.height - 50) {
        doc.addPage();
        currentY = 50;
      } else {
        currentY += 20; // Add spacing
      }
      
      // Next steps
      doc.fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#2c3e50')
        .text('Next Steps', 50, currentY);
      
      currentY += 25;
      
      doc.rect(50, currentY, doc.page.width - 100, 60)
        .fillAndStroke('#f0f7ff', '#90cdf4');
      
      doc.fontSize(11)
        .fillColor('#333')
        .font('Helvetica')
        .text('If you would like to discuss your results further, you can schedule a 1-on-1 consultation session.', 70, currentY + 15, {
          width: doc.page.width - 140,
          align: 'left'
        });
      
      doc.fontSize(11)
        .fillColor('#3498db')
        .text('Schedule at: https://lawrence-adjah.clientsecure.me/request/service', 70, currentY + 40, {
          link: 'https://lawrence-adjah.clientsecure.me/request/service',
          underline: true
        });
      
      // Footer
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

async function runTest() {
  try {
    console.log('Generating improved PDF report...');
    
    // Generate the PDF
    const pdfBuffer = await generateImprovedPDF();
    
    // Save PDF to file
    const publicDir = path.join(process.cwd(), 'client', 'public');
    
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    const pdfPath = path.join(publicDir, 'improved-report.pdf');
    fs.writeFileSync(pdfPath, pdfBuffer);
    
    console.log(`PDF saved successfully at: ${pdfPath}`);
    console.log('You can now view this PDF in your browser at /improved-report.pdf');
    
    // Create HTML viewer for easy access
    const htmlPath = path.join(publicDir, 'improved-report.html');
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Improved Report Viewer</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        h1 { color: #3498db; }
        .pdf-container { width: 100%; height: 800px; border: 1px solid #ddd; margin-top: 20px; }
        .instructions { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>The 100 Marriage Assessment Report</h1>
        
        <div class="instructions">
          <p><strong>View options:</strong></p>
          <ol>
            <li>View embedded PDF below</li>
            <li>Open <a href="/improved-report.pdf" target="_blank">direct PDF link</a> (opens in new tab)</li>
          </ol>
        </div>
        
        <iframe class="pdf-container" src="/improved-report.pdf"></iframe>
      </div>
    </body>
    </html>
    `;
    
    fs.writeFileSync(htmlPath, htmlContent);
    console.log(`HTML viewer saved at: ${htmlPath}`);
    console.log('You can view this HTML page at /improved-report.html');
    
  } catch (error) {
    console.error('Error running test:', error);
  }
}

// Run the test
runTest();