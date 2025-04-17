import PDFDocument from 'pdfkit';
import { AssessmentResult, CoupleAssessmentReport } from '../shared/schema';
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
      const scoreTextWidth = doc.widthOfString(scoreText);
      const textHeight = doc.currentLineHeight();
      
      doc.text(scoreText, centerX - scoreTextWidth / 2, doc.y + scoreRadius - textHeight / 2);
      
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
      
      // Add comparative statistics section
      doc.addPage(); // Start on a new page
      
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
      
      // Position text manually with proper parameters
      doc.fontSize(11)
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
      
      // Draw overall percentile section with box (removed rounded corners)
      doc.rect(50, 100, doc.page.width - 100, 160)
        .fillAndStroke('white', '#e2e8f0');
      
      doc.fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#2c3e50')
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
      doc.rect(70, overallBoxY + 70, 330, 40).fillAndStroke('#f0f5fa', '#e2e8f0');
      
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
        .text(`Your overall score of ${Math.round(overallScore)}% is ${percentile > 60 ? 'significantly higher than' : percentile > 50 ? 'higher than' : percentile > 40 ? 'close to' : percentile > 25 ? 'lower than' : 'significantly lower than'} the average of ${Math.round(mean)}% for ${genderText}. This places you in the ${percentile}th percentile.`, 
          70, overallBoxY + 120, { width: 330 });
      
      // Section comparisons - start at new position
      doc.fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#2c3e50')
        .text(`Section Comparisons (${genderText.charAt(0).toUpperCase() + genderText.slice(1)}-specific)`, 50, 290);
      
      // Draw section percentiles in a better layout
      const sectionStartY = 320;
      const sectionWidth = (doc.page.width - 110) / 2;
      const sectionHeight = 90;
      let currentX = 50;
      let currentY = sectionStartY;
      let rowIndex = 0;
      
      Object.entries(assessment.scores.sections).forEach(([sectionName, sectionScore]) => {
        // Map section names to our baseline statistic keys
        const statsKey = sectionName.replace(/\s+/g, '').toLowerCase();
        const sectionStats = baselineStatistics.sections[statsKey as keyof typeof baselineStatistics.sections];
        
        if (!sectionStats) return;
        
        const sectionMean = sectionStats.byGender[genderKey].mean;
        const sectionStdDev = sectionStats.byGender[genderKey].standardDeviation;
        
        // Calculate percentile for this section
        const sectionZScore = (sectionScore.percentage - sectionMean) / sectionStdDev;
        const sectionPercentile = Math.min(99, Math.max(1, Math.round(50 + (sectionZScore * 30))));
        const scoreDiff = Math.round(Math.abs(sectionScore.percentage - sectionMean));
        const scoreComparison = sectionScore.percentage > sectionMean ? 'higher' : 'lower';
        
        // If we've done 2 sections in this row, move to new row
        if (rowIndex === 2) {
          rowIndex = 0;
          currentX = 50;
          currentY += sectionHeight + 15; // Move down for next row
          
          // Add new page if needed
          if (currentY + sectionHeight > doc.page.height - 50) {
            doc.addPage();
            currentY = 50;
          }
        }
        
        // Draw section card with rounded corners
        doc.rect(currentX, currentY, sectionWidth, sectionHeight)
          .fillAndStroke('white', '#e2e8f0');
        
        // Section title and score
        doc.fillColor('#2c3e50')
          .fontSize(12)
          .font('Helvetica-Bold')
          .text(sectionName, currentX + 15, currentY + 15, { continued: true })
          .fillColor('#3182ce')
          .text(` ${Math.round(sectionScore.percentage)}%`, { align: 'right', width: sectionWidth - 30 });
        
        // Add percentile info
        doc.fontSize(10)
          .font('Helvetica')
          .fillColor('#718096')
          .text(`(${sectionPercentile}th percentile)`, currentX + 15, currentY + 35);
        
        // Draw percentile bar
        const sectionBarY = currentY + 50;
        const sectionBarHeight = 10;
        const sectionBarWidth = sectionWidth - 30;
        
        // Background bar
        doc.rect(currentX + 15, sectionBarY, sectionBarWidth, sectionBarHeight)
          .fillColor('#f0f0f0');
        
        // Percentile bar
        doc.rect(currentX + 15, sectionBarY, (sectionPercentile / 100) * sectionBarWidth, sectionBarHeight)
          .fillColor('#3182ce');
        
        // Add comparative text with more detail
        doc.fillColor('#4a5568')
          .fontSize(9)
          .font('Helvetica')
          .text(`${sectionPercentile > 75 ? 'Higher' : sectionPercentile > 40 ? 'Average' : 'Lower'} than most ${genderText}: ${scoreDiff}% ${scoreComparison} than average`, 
            currentX + 15, sectionBarY + 15);
        
        // Move to next column
        rowIndex++;
        if (rowIndex < 2) {
          currentX += sectionWidth + 10;
        }
      });
      
      // Add interpretation guide - adjust position based on last section
      if (currentY + 180 > doc.page.height - 50) {
        doc.addPage();
        currentY = 50;
      } else {
        currentY += sectionHeight + 40;
      }
      
      // Draw blue box with rounded corners for interpretation guide
      doc.rect(50, currentY, doc.page.width - 100, 100).fillAndStroke('#ebf8ff', '#90cdf4');
      
      doc.fillColor('#2c5282')
        .fontSize(14)
        .font('Helvetica-Bold')
        .text('Understanding These Gender-Specific Comparisons', 70, currentY + 15);
      
      // Position text manually with correct parameters
      const interpretationText = `These statistics compare your results specifically with other ${genderText}. Higher or lower scores indicate different approaches to marriage, not better or worse ones. The most important consideration is how your assessment compares with your spouse or future spouse, as closer percentages typically indicate better alignment in expectations.`;
      
      doc.fillColor('#2c5282')
        .fontSize(11)
        .font('Helvetica')
        .text(interpretationText, 70, currentY + 40, {
          width: doc.page.width - 140
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

// Function to create a PDF buffer from a couple assessment report
export async function generateCoupleAssessmentPDF(report: CoupleAssessmentReport): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const { primaryAssessment, spouseAssessment, differenceAnalysis, overallCompatibility } = report;
      
      // Get names for better readability
      const primaryName = primaryAssessment.demographics.firstName;
      const primaryLastName = primaryAssessment.demographics.lastName;
      const spouseName = spouseAssessment.demographics.firstName;
      const spouseLastName = spouseAssessment.demographics.lastName;
      
      // Create a PDF document
      const doc = new PDFDocument({
        size: 'LETTER',
        margin: 50,
        info: {
          Title: `${primaryName} & ${spouseName} - The 100 Marriage Couple Assessment Report`,
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
        .text('Couple Assessment Report', { align: 'center' });
      
      // Add names of couple
      doc.moveDown(0.5)
        .fontSize(14)
        .fillColor('#555')
        .text(`${primaryName} ${primaryLastName} & ${spouseName} ${spouseLastName}`, { align: 'center' });
      
      // Add a horizontal line
      doc.moveDown(0.5)
        .strokeColor('#ddd')
        .lineWidth(1)
        .moveTo(50, doc.y)
        .lineTo(doc.page.width - 50, doc.y)
        .stroke();
        
      // Couple compatibility score section with visual representation
      doc.moveDown(1.5)
        .fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#2c3e50')
        .text('Couple Compatibility Score', { align: 'center' });
        
      // Draw score circle
      const scoreRadius = 50;
      const centerX = doc.page.width / 2;
      const scoreText = `${Math.round(overallCompatibility)}%`;
      
      // Get color based on score
      let scoreColor = '#dc2626'; // red-600
      if (overallCompatibility >= 80) scoreColor = '#15803d'; // green-700
      else if (overallCompatibility >= 60) scoreColor = '#2563eb'; // blue-600
      else if (overallCompatibility >= 40) scoreColor = '#d97706'; // amber-600
      
      // Get compatibility level
      let compatibilityText = 'Needs Attention';
      if (overallCompatibility >= 80) compatibilityText = 'Very High Compatibility';
      else if (overallCompatibility >= 60) compatibilityText = 'Good Compatibility';
      else if (overallCompatibility >= 40) compatibilityText = 'Moderate Compatibility';
      
      // Create a better-centered circle - positioned higher on the page
      const circleY = 250; // Higher position on page 1
      doc.circle(centerX, circleY, scoreRadius)
        .fillAndStroke(scoreColor, scoreColor);
        
      // Position text in the center of the circle - properly centered
      doc.fillColor('white')
        .font('Helvetica-Bold')
        .fontSize(24);
      
      // Calculate width of the score text to center it
      const scoreTextWidth = doc.widthOfString(scoreText);
      const textHeight = doc.currentLineHeight();
      
      // Place text exactly in circle center
      doc.text(scoreText, centerX - scoreTextWidth / 2, circleY - textHeight / 2);
      
      // Draw compatibility level text below - with consistent spacing
      doc.fontSize(16)
        .fillColor(scoreColor)
        .font('Helvetica-Bold')
        .text(compatibilityText, centerX - 100, circleY + scoreRadius + 20, { 
          align: 'center',
          width: 200 // Fixed width for better centering
        });
        
      // Add compatibility explanation with proper positioning and justified text
      doc.fontSize(12)
        .font('Helvetica')
        .fillColor('#555')
        .text(
          'This compatibility score represents how well aligned your expectations are as a couple. A higher score means you have more similar views on marriage-related topics, which can lead to greater harmony and understanding in your relationship.', 
          centerX - 160, circleY + scoreRadius + 60, // Position directly below compatibility text
          {
            width: 320, // Slightly wider for better text flow
            align: 'justify',
            lineGap: 2 // Add a bit more space between lines
          }
        );
          
      // Strengths and Areas for Alignment - centered heading with decorative line
      // Calculate exact center position on the page
      doc.y = circleY + scoreRadius + 170; // Better position to avoid overlapping with explanation text
      
      // Centered decorative line
      const relInsightsLineWidth = 220;
      const relInsightsLineStart = (doc.page.width - relInsightsLineWidth) / 2;
      doc.moveTo(relInsightsLineStart, doc.y)
        .lineTo(relInsightsLineStart + relInsightsLineWidth, doc.y)
        .strokeColor('#2c3e50')
        .lineWidth(1)
        .stroke();
      
      // Add centered heading with no text styling (PDFKit sometimes has issues with underline)
      doc.moveDown(0.5)
        .fontSize(18) 
        .font('Helvetica-Bold')
        .fillColor('#2c3e50');
      
      // Calculate exact center position for the text
      const relationshipInsightsText = 'Relationship Insights';
      const relationshipTextWidth = doc.widthOfString(relationshipInsightsText);
      const relationshipTextX = (doc.page.width - relationshipTextWidth) / 2;
      
      // Position text exactly at center X coordinates
      doc.text(relationshipInsightsText, relationshipTextX, doc.y);
      
      // Two columns for strengths and alignment areas
      const colWidth = (doc.page.width - 120) / 2;
      const colY = doc.y + 15; // Add more spacing
      
      // Left column: Strengths
      doc.fontSize(13)
        .font('Helvetica-Bold')
        .fillColor('#15803d')
        .text('Strength Areas', 50, colY);
        
      doc.fontSize(11)
        .font('Helvetica')
        .fillColor('#555');
        
      let strengthY = colY + 25;
      differenceAnalysis.strengthAreas.forEach((strength, idx) => {
        doc.text(`${idx + 1}. ${strength}`, 60, strengthY, {
          width: colWidth - 20
        });
        strengthY = doc.y + 10;
      });
      
      // Right column: Areas Needing Alignment
      doc.fontSize(13)
        .font('Helvetica-Bold')
        .fillColor('#d97706')
        .text('Areas Needing Alignment', doc.page.width / 2, colY);
        
      doc.fontSize(11)
        .font('Helvetica')
        .fillColor('#555');
        
      let vulnerabilityY = colY + 25;
      differenceAnalysis.vulnerabilityAreas.forEach((area, idx) => {
        doc.text(`${idx + 1}. ${area}`, doc.page.width / 2 + 10, vulnerabilityY, {
          width: colWidth - 20
        });
        vulnerabilityY = doc.y + 10;
      });
      
      // Move to maximum Y position from both columns
      doc.y = Math.max(doc.y, vulnerabilityY, strengthY);
      
      // Individual assessment scores section - starting a new page to ensure it's fully visible
      doc.addPage(); // Force a new page for the Individual Assessment scores
      
      // Centered decorative line
      const indAssessLineWidth = 250; // Wider for "Individual Assessment Scores"
      const indAssessLineStart = (doc.page.width - indAssessLineWidth) / 2;
      doc.moveTo(indAssessLineStart, doc.y + 30) // Position at top of page with margin
        .lineTo(indAssessLineStart + indAssessLineWidth, doc.y + 30)
        .strokeColor('#2c3e50')
        .lineWidth(1)
        .stroke();
      
      // Calculate exact center position for the text
      const individualAssessmentText = 'Individual Assessment Scores';
      doc.fontSize(18)
        .font('Helvetica-Bold')
        .fillColor('#2c3e50');
      
      const individualTextWidth = doc.widthOfString(individualAssessmentText);
      const individualTextX = (doc.page.width - individualTextWidth) / 2;
      
      // Position text exactly at center X coordinates with proper Y position
      doc.text(individualAssessmentText, individualTextX, doc.y + 45);
      
      // Create two columns for partner scores
      const scoreColY = doc.y + 15; // More space below heading
      
      // Left column: Primary Assessment - handle long profile names
      const primaryProfileText = `${primaryName}'s Profile: ${primaryAssessment.profile.name}`;
      const primaryProfileFontSize = primaryProfileText.length > 35 ? 11 : 13; // Use smaller font for longer text
      
      doc.fontSize(primaryProfileFontSize)
        .font('Helvetica-Bold')
        .fillColor('#2563eb') // blue
        .text(primaryProfileText, 50, scoreColY, {
          width: (doc.page.width / 2) - 60, // Limit width to prevent wrapping
          lineBreak: false
        });
        
      doc.fontSize(11)
        .font('Helvetica')
        .fillColor('#555')
        .text(`Overall Score: ${Math.round(primaryAssessment.scores.overallPercentage)}%`, 60, scoreColY + 25);
        
      // Gender-specific profile if available
      if (primaryAssessment.genderProfile) {
        doc.fontSize(11)
          .fillColor('#7e22ce') // purple
          .text(`${primaryAssessment.demographics.gender === 'male' ? 'Male' : 'Female'}-Specific Profile: ${primaryAssessment.genderProfile.name}`, 60, scoreColY + 45);
      }
      
      // Right column: Spouse Assessment - handle long profile names
      const spouseProfileText = `${spouseName}'s Profile: ${spouseAssessment.profile.name}`;
      const spouseProfileFontSize = spouseProfileText.length > 35 ? 11 : 13; // Use smaller font for longer text
      
      doc.fontSize(spouseProfileFontSize)
        .font('Helvetica-Bold')
        .fillColor('#7e22ce') // purple
        .text(spouseProfileText, doc.page.width / 2, scoreColY, {
          width: (doc.page.width / 2) - 60, // Limit width to prevent wrapping
          lineBreak: false
        });
        
      doc.fontSize(11)
        .font('Helvetica')
        .fillColor('#555')
        .text(`Overall Score: ${Math.round(spouseAssessment.scores.overallPercentage)}%`, doc.page.width / 2 + 10, scoreColY + 25);
        
      // Gender-specific profile if available
      if (spouseAssessment.genderProfile) {
        doc.fontSize(11)
          .fillColor('#7e22ce') // purple
          .text(`${spouseAssessment.demographics.gender === 'male' ? 'Male' : 'Female'}-Specific Profile: ${spouseAssessment.genderProfile.name}`, doc.page.width / 2 + 10, scoreColY + 45);
      }
      
      // Section Comparison Table (start new page)
      doc.addPage();
      
      doc.fontSize(16)
        .font('Helvetica-Bold')
        .fillColor('#2c3e50')
        .text('Section Score Comparison', { 
          align: 'center',
          width: doc.page.width - 100
        });
        
      doc.moveDown(0.5)
        .fontSize(12)
        .font('Helvetica')
        .fillColor('#555')
        .text('This table shows how your scores compare in each assessment section. Larger differences may indicate areas where you have different perspectives that could benefit from discussion.', {
          align: 'justify',
          width: doc.page.width - 150, // Slightly narrower for better-looking justified text
          lineGap: 2 // Add a bit more space between lines
        });
        
      // Draw table header
      doc.moveDown(1);
      const tableTop = doc.y;
      // Further increased column width for section names to handle long section titles like "Your Intimacy and Sex Life"
      const tableColWidths = [270, 60, 60, 60]; 
      const rowHeight = 30; // Increased row height for better readability
      
      doc.rect(50, tableTop, doc.page.width - 100, rowHeight)
        .fill('#3498db');
        
      doc.fontSize(12)
        .font('Helvetica-Bold')
        .fillColor('white')
        .text('Assessment Section', 60, tableTop + 7)
        .text(`${primaryName}`, 60 + tableColWidths[0], tableTop + 7)
        .text(`${spouseName}`, 60 + tableColWidths[0] + tableColWidths[1], tableTop + 7)
        .text('Difference', 60 + tableColWidths[0] + tableColWidths[1] + tableColWidths[2], tableTop + 7);
      
      // Draw table rows
      let rowY = tableTop + rowHeight;
      let rowColor = '#f8f9fa';
      
      Object.entries(primaryAssessment.scores.sections).forEach(([section, primaryScore], idx) => {
        const spouseScore = spouseAssessment.scores.sections[section];
        const difference = Math.abs(primaryScore.percentage - spouseScore.percentage);
        
        // Background color alternates for readability
        rowColor = idx % 2 === 0 ? '#f8f9fa' : '#ffffff';
        
        // Cell background
        doc.rect(50, rowY, doc.page.width - 100, rowHeight).fill(rowColor);
        
        // Draw border lines
        doc.strokeColor('#e2e8f0')
          .lineWidth(0.5)
          .rect(50, rowY, doc.page.width - 100, rowHeight)
          .stroke();
        
        // Set text color and visual indicator based on difference value
        let diffColor = '#15803d'; // green
        let diffIcon = '✓'; // check mark
        
        if (difference > 20) {
          diffColor = '#dc2626'; // red
          diffIcon = '!'; // exclamation mark
        } else if (difference > 10) {
          diffColor = '#d97706'; // amber
          diffIcon = '•'; // dot
        }
        
        // Ensure section names are never truncated - special handling for exceptionally long names
        const sectionDisplay = section;
        // More aggressive font size reduction for especially long names like "Your Intimacy and Sex Life"
        let fontSize = 10; // Default size
        if (section.length > 35) {
          fontSize = 7.5; // Very small for very long names
        } else if (section.length > 25) {
          fontSize = 8.5; // Smaller for long names
        }
        
        // Adjust vertical positioning based on font size for better alignment
        const verticalAdjust = fontSize === 7.5 ? 13 : (fontSize === 8.5 ? 12 : 10);
        
        doc.fontSize(fontSize)
          .font('Helvetica')
          .fillColor('#374151')
          .text(sectionDisplay, 60, rowY + verticalAdjust, { 
            width: tableColWidths[0] - 5,
            lineBreak: false, // Prevent line breaking
            characterSpacing: -0.2 // Slightly reduce character spacing for better fit
          });
          
        // Primary score
        doc.fillColor('#2563eb') // blue
          .text(`${Math.round(primaryScore.percentage)}%`, 60 + tableColWidths[0], rowY + 10);
          
        // Spouse score
        doc.fillColor('#7e22ce') // purple
          .text(`${Math.round(spouseScore.percentage)}%`, 60 + tableColWidths[0] + tableColWidths[1], rowY + 10);
          
        // Difference with color coding and icon
        doc.font('Helvetica-Bold')
          .fillColor(diffColor)
          .text(`${diffIcon} ${Math.round(difference)}%`, 60 + tableColWidths[0] + tableColWidths[1] + tableColWidths[2], rowY + 10);
          
        // Move to next row
        rowY += rowHeight;
      });
      
      // Major Differences Section - use a new page for cleaner layout
      doc.addPage()
        .fontSize(16)
        .font('Helvetica-Bold')
        .fillColor('#d97706') // amber
        .text('Key Differences to Discuss', {
          align: 'center'
        });
        
      doc.moveDown(0.5)
        .fontSize(12)
        .font('Helvetica')
        .fillColor('#555')
        .text('These questions highlight areas where you had significant differences in your responses. Discussing these topics can help you better understand each other\'s perspectives and expectations.', {
          width: doc.page.width - 150, // Adjusted width for better justified text appearance
          align: 'justify',
          paragraphGap: 5
        });
        
      // Show the top differences (up to 5)
      doc.moveDown(1);
      const topDifferences = differenceAnalysis.majorDifferences.slice(0, 5);
      
      topDifferences.forEach((diff, idx) => {
        // Calculate dynamic height based on content length
        const estimatedTextLength = diff.questionText.length + diff.primaryResponse.length + diff.spouseResponse.length;
        const dynamicHeight = Math.max(80, 50 + Math.ceil(estimatedTextLength / 100) * 15);
        
        // Check if we need a new page
        if (doc.y + dynamicHeight > doc.page.height - 50) {
          doc.addPage();
        }
        
        const bgColor = idx % 2 === 0 ? '#fff7ed' : '#ffffff';
        
        // Draw background rectangle with dynamic height
        doc.rect(50, doc.y, doc.page.width - 100, dynamicHeight).fill(bgColor);
        
        // Draw border
        doc.strokeColor('#fed7aa')
          .lineWidth(0.5)
          .rect(50, doc.y, doc.page.width - 100, dynamicHeight)
          .stroke();
          
        // Question text with more width
        doc.fontSize(12)
          .font('Helvetica-Bold')
          .fillColor('#9a3412')
          .text(`${idx + 1}. ${diff.questionText}`, 60, doc.y + 10, {
            width: doc.page.width - 120
          });
          
        // Primary response 
        doc.moveDown(0.5)
          .fontSize(11)
          .font('Helvetica')
          .fillColor('#2563eb') // blue
          .text(`${primaryName}: `, 60, undefined, { continued: true })
          .font('Helvetica-Bold')
          .text(diff.primaryResponse, { width: doc.page.width - 120 });
          
        // Spouse response
        doc.moveDown(0.5)
          .fontSize(11)
          .font('Helvetica')
          .fillColor('#7e22ce') // purple
          .text(`${spouseName}: `, 60, undefined, { continued: true })
          .font('Helvetica-Bold')
          .text(diff.spouseResponse, { width: doc.page.width - 120 });
          
        // Move past this container to ensure proper spacing
        doc.moveDown(0.8);
      });
      
      // Book-guided discussion section
      doc.addPage();
      doc.fontSize(20)
        .font('Helvetica-Bold')
        .fillColor('#7e22ce') // Updated to purple color
        .text('Discussion Guide: Where Your Perspectives Differ', {
          align: 'center'
        });
        
      // Add decorative line
      doc.moveDown(0.5);
      const discussLineWidth = 180;
      const discussLineStart = (doc.page.width - discussLineWidth) / 2;
      doc.moveTo(discussLineStart, doc.y)
        .lineTo(discussLineStart + discussLineWidth, doc.y)
        .strokeColor('#7e22ce')
        .stroke();
        
      doc.moveDown(1)
        .fontSize(12)
        .font('Helvetica')
        .fillColor('#374151')
        .text('These are the most significant areas where your answers differed. We recommend scheduling dedicated time to discuss these topics together using "The 100 Marriage" book as your guide. The book provides valuable context and discussion points that will help you align your expectations more effectively.', {
          align: 'justify',
          width: doc.page.width - 100
        });
      
      // Top differences for discussion - always start on a fresh page for consistency
      doc.addPage(); // Force a new page for better spacing and layout
      
      // Create a better centered title with decorative elements
      const titleText = 'Top Differences to Discuss Together:';
      
      // Calculate exact position for precise centering
      doc.fontSize(16)
        .font('Helvetica-Bold');
      
      const titleWidth = doc.widthOfString(titleText);
      const titleDecorLineWidth = 350; // Make lines wider for title
      const titleX = (doc.page.width - titleWidth) / 2;
      const titleLineStartX = (doc.page.width - titleDecorLineWidth) / 2;
      
      // Draw top decorative line
      doc.strokeColor('#7e22ce')
        .lineWidth(1.5) // Slightly thinner line
        .moveTo(titleLineStartX, doc.y + 10)
        .lineTo(titleLineStartX + titleDecorLineWidth, doc.y + 10)
        .stroke();
      
      // Add title exactly centered
      doc.fillColor('#7e22ce')
        .text(titleText, titleX, doc.y + 25); // Fixed position
      
      // Add bottom decorative line
      doc.strokeColor('#7e22ce')
        .lineWidth(1.5)
        .moveTo(titleLineStartX, doc.y + 15)  
        .lineTo(titleLineStartX + titleDecorLineWidth, doc.y + 15)
        .stroke();
      
      doc.moveDown(1); // More space after heading for visual separation
      
      // No need for border box around the entire differences section
      
      // Loop through top differences, showing more detail
      differenceAnalysis.majorDifferences.slice(0, 5).forEach((diff, idx) => {
        // Need to adjust box height based on content length
        let estimatedHeight = Math.max(
          120, // Increased minimum height 
          60 + Math.ceil(diff.primaryResponse.length / 60) * 12 + Math.ceil(diff.spouseResponse.length / 60) * 12
        );
        
        // Add a new page if we're near the bottom of the page
        if (doc.y + estimatedHeight > doc.page.height - 60) {
          doc.addPage();
        }
        
        const bgColor = idx % 2 === 0 ? '#f5f3ff' : '#faf5ff';
        
        // Background rectangle - using dynamic height
        doc.rect(50, doc.y, doc.page.width - 100, estimatedHeight)
          .fill(bgColor);
          
        // Border
        doc.strokeColor('#e9d5ff')
          .lineWidth(1)
          .rect(50, doc.y, doc.page.width - 100, estimatedHeight)
          .stroke();
          
        // Question text - moved down slightly for better positioning
        doc.font('Helvetica-Bold')
          .fontSize(12)
          .fillColor('#6b21a8')
          .text(`Question ${diff.questionId}: ${diff.questionText}`, 60, doc.y + 15, {
            width: doc.page.width - 120
          });
          
        // Responses in two columns - using better alignment with fixed Y positions
        const colWidth = (doc.page.width - 160) / 2;
        
        // Place responses at fixed position from the top of the box for consistent layout
        const headerY = doc.y + 10;
        
        // Response headers - positioned side by side at exact same Y coordinate
        doc.fontSize(11)
          .font('Helvetica-Bold')
          .fillColor('#7e22ce');
          
        // Primary partner response header
        doc.text(`${primaryName}'s Response:`, 60, headerY, { width: colWidth });
        
        // Spouse response header (same Y position)
        doc.text(`${spouseName}'s Response:`, 70 + colWidth, headerY, { width: colWidth });
          
        // Response content at fixed position with identical top margin
        const contentY = headerY + 20;
        
        // Primary response on left
        doc.fontSize(10)
          .font('Helvetica')
          .fillColor('#4b5563')
          .text(diff.primaryResponse, 60, contentY, { width: colWidth - 10 });
        
        // Spouse response on right (same Y coordinate)
        doc.text(diff.spouseResponse, 70 + colWidth, contentY, { width: colWidth - 10 });
      });
      
      // Book promotion section - Completely redesigned for better layout
      doc.moveDown(1.5);
      
      // Start with a fresh position - expanded height
      const bookBoxY = doc.y;
      const bookBoxHeight = 150; // Increased box height for better spacing
      
      // Create a nice box with purple border - use full width of page for more space
      doc.rect(50, bookBoxY, doc.page.width - 100, bookBoxHeight)
        .fillAndStroke('#faf5ff', '#e9d5ff');
      
      // Better spacing for content
      const bookImageX = 70;
      const bookImageWidth = 80; // Slightly larger book cover
      const bookTextX = bookImageX + bookImageWidth + 30;
      const bookTextWidth = doc.page.width - bookTextX - 80; // More space on right margin
      
      // Create stylized book cover since we can't reliably get the image
      // Draw a purple background for the book cover
      doc.rect(bookImageX, bookBoxY + 25, bookImageWidth, bookBoxHeight - 50)
        .fillAndStroke('#7e22ce', '#6b21a8');
      
      // Add a decorative border to the cover
      doc.lineWidth(2)
        .strokeColor('#e9d5ff')
        .rect(bookImageX + 3, bookBoxY + 28, bookImageWidth - 6, bookBoxHeight - 56)
        .stroke();
        
      // Add "THE 100 MARRIAGE BOOK" text with better styling
      doc.fontSize(13)
        .font('Helvetica-Bold')
        .fillColor('#ffffff')
        .text('THE 100', bookImageX, bookBoxY + 40, {
          align: 'center',
          width: bookImageWidth
        });
        
      doc.fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#ffffff')
        .text('MARRIAGE', bookImageX, bookBoxY + 60, {
          align: 'center',
          width: bookImageWidth
        });
        
      doc.fontSize(13)
        .font('Helvetica-Bold')
        .fillColor('#ffffff')
        .text('BOOK', bookImageX, bookBoxY + 85, {
          align: 'center',
          width: bookImageWidth
        });
        
      // Add author with smaller font
      doc.fontSize(8)
        .font('Helvetica')
        .fillColor('#f5f3ff')
        .text('By Lawrence Adjah', bookImageX, bookBoxY + 105, {
          align: 'center',
          width: bookImageWidth
        });
      
      // Add book promotion heading with better positioning - smaller font to fit better
      doc.fontSize(16) // Slightly larger
        .font('Helvetica-Bold')
        .fillColor('#7e22ce')
        .text('Use The 100 Marriage Book as Your Discussion Companion', bookTextX, bookBoxY + 25, {
          width: bookTextWidth,
          lineBreak: false
        });
      
      // Add description text with better formatting - width limited to prevent overlap with button
      doc.moveDown(0.8)
        .fontSize(11) // Slightly larger font
        .font('Helvetica')
        .fillColor('#4b5563')
        .text('This book provides the perfect framework to navigate important conversations about marriage expectations and alignment.', {
          width: bookTextWidth,
          align: 'left',
          lineGap: 3 // Add more spacing between lines
        });
        
      // Add the second part of the text with sufficient spacing from button
      doc.moveDown(0.5);
      
      // Add a better styled button on the right side of the content for cleaner layout
      const buttonWidth = 150; // Wider button
      const buttonHeight = 35; // Taller button
      
      // Position button at the bottom right of the text area
      const buttonX = doc.page.width - 150 - 50; // Right side of page with margin
      const buttonY = bookBoxY + bookBoxHeight - 45; // Position from bottom of box
      
      // Add the second part of text with no chance of overlap
      doc.fontSize(11)
        .font('Helvetica')
        .fillColor('#4b5563')
        .text('Get your copy today to strengthen your relationship.', {
          width: bookTextWidth - 180, // Limit width to prevent overlap with button area
          align: 'left',
          lineGap: 3
        });
      
      // Draw button
      doc.rect(buttonX, buttonY, buttonWidth, buttonHeight)
        .fillAndStroke('#7e22ce', '#6b21a8');
      
      // Center the button text
      doc.fontSize(14) // Larger text
        .font('Helvetica-Bold')
        .fillColor('#ffffff')
        .text('GET THE BOOK', buttonX + 25, buttonY + 10, {
          link: 'https://www.amazon.com/100-MARRIAGE-Lawrence-Adjah-ebook/dp/B09S3FBLN7'
        });
      
      // Start a new page for key sections and book recommendation for better layout
      doc.addPage();
      
      // Key sections heading
      doc.fontSize(16) // Larger font for consistency
        .font('Helvetica-Bold')
        .fillColor('#0f172a')
        .text('Additional Key Sections for Discussion', {
          align: 'center',
          width: doc.page.width - 100
        });
      
      doc.moveDown(1)
        .fontSize(12)
        .font('Helvetica')
        .fillColor('#334155');
      
      // List the vulnerability areas
      report.differenceAnalysis.vulnerabilityAreas.forEach((area, index) => {
        doc.moveDown(0.8) // More consistent spacing
          .font('Helvetica-Bold')
          .fillColor('#0e7490')
          .text(`Section: ${area}`, 60)
          .font('Helvetica')
          .fillColor('#64748b')
          .fontSize(11)
          .text('Walk through the questions in this section together with the book as your companion.', 60, doc.y, {
            width: doc.page.width - 120
          });
      });
      
      // Book recommendation box - completely redesigned with fixed positioning for better control
      // Calculate position to center the box
      const boxWidth = 500;    // Wider box for better text layout
      const boxHeight = 100;   // Taller box for better spacing
      const boxX = (doc.page.width - boxWidth) / 2; // Center the box
      
      // Check if we need a new page - add more space
      if (doc.y + 60 + boxHeight > doc.page.height - 50) {
        doc.addPage();
      } else {
        doc.moveDown(2); // More space above box
      }
      
      // Draw centered box (no rounded corners in PDFKit)
      const boxY = doc.y;
      doc.rect(boxX, boxY, boxWidth, boxHeight)
        .fillAndStroke('#fff7ed', '#fed7aa'); // Better cream color
      
      // Create stylized book cover with exact positioning
      const coverWidth = 60;
      const coverHeight = 75;
      const coverX = boxX + 20;
      const coverY = boxY + (boxHeight - coverHeight) / 2; // Center vertically in box
      
      // Main rectangle for book cover
      doc.rect(coverX, coverY, coverWidth, coverHeight)
        .fillAndStroke('#7e22ce', '#6b21a8');
      
      // Add a decorative border
      doc.lineWidth(1.5)
        .strokeColor('#e9d5ff')
        .rect(coverX + 2, coverY + 2, coverWidth - 4, coverHeight - 4)
        .stroke();
        
      // Add text for book cover with better vertical spacing
      doc.fontSize(11)
        .font('Helvetica-Bold')
        .fillColor('#ffffff')
        .text('THE 100', coverX, coverY + 10, {
          align: 'center',
          width: coverWidth
        });
        
      doc.fontSize(12)
        .text('MARRIAGE', coverX, coverY + 25, {
          align: 'center',
          width: coverWidth
        });
        
      doc.fontSize(11)
        .text('BOOK', coverX, coverY + 45, {
          align: 'center',
          width: coverWidth
        });
      
      // Add text content with precise positioning
      const textX = coverX + coverWidth + 25;
      const textWidth = boxWidth - textX - 20 + boxX;
      
      // Header text
      doc.fontSize(16)
        .font('Helvetica-Bold')
        .fillColor('#9a3412') // Darker orange/brown
        .text('Don\'t have the book yet?', textX, coverY + 5, {
          width: textWidth
        });
      
      // Link text with underlining and proper spacing
      doc.fontSize(13)
        .font('Helvetica-Bold')
        .fillColor('#78350f')
        .text('Get your copy at lawrenceadjah.com/the100marriagebook', textX, coverY + 30, {
          width: textWidth,
          link: 'https://lawrenceadjah.com/the100marriagebook',
          underline: true
        });
      
      // Description text with proper spacing
      doc.fontSize(12)
        .font('Helvetica')
        .fillColor('#78350f')
        .text('to deepen your discussions and strengthen your relationship.', textX, coverY + 50, {
          width: textWidth
        });
      
      // Always start Next Steps on a new page for consistent layout
      doc.addPage();
      
      // Next Steps section with centered heading
      doc.fontSize(16) // Larger font for consistency with other headings
        .font('Helvetica-Bold')
        .fillColor('#2c3e50')
        .text('Next Steps for Your Relationship', {
          align: 'center',
          width: doc.page.width - 100
        });
        
      doc.moveDown(0.5)
        .fontSize(11)
        .font('Helvetica')
        .fillColor('#555');
        
      // Numbered list of recommended steps - with narrower width for better readability
      doc.text('1. Review this report together and discuss the key areas of difference.', {
        width: doc.page.width - 150,
        align: 'left'
      });
      
      doc.moveDown(0.5)
        .text('2. Focus on understanding each other\'s perspectives rather than trying to change them.', {
          width: doc.page.width - 150,
          align: 'left'
        });
        
      doc.moveDown(0.5)
        .text('3. Use "The 100 Marriage" book to guide your discussions on areas needing alignment.', {
          width: doc.page.width - 150,
          align: 'left'
        });
        
      doc.moveDown(0.5)
        .text('4. Consider scheduling a consultation with Lawrence E. Adjah for additional support.', {
          width: doc.page.width - 150,
          align: 'left'
        });
        
      doc.moveDown(0.5)
        .text('5. Revisit the assessment after 6-12 months to track your alignment progress.', {
          width: doc.page.width - 150,
          align: 'left'
        });
      
      // Check if we need a new page for consultation section
      if (doc.y > doc.page.height - 100) {
        doc.addPage();
      } else {
        doc.moveDown(2);
      }
      
      // Create a highlighted consultation box
      const consultY = doc.y;
      doc.rect(50, consultY, doc.page.width - 100, 70)
        .fillAndStroke('#e6f2ff', '#bfdbfe');
        
      // Consultation link
      doc.moveUp()
        .fontSize(13)
        .font('Helvetica-Bold')
        .fillColor('#0369a1')
        .text('To schedule a consultation:', 70, consultY + 15, {
          width: doc.page.width - 140,
          align: 'center'
        });
        
      doc.moveDown(0.5)
        .fontSize(12)
        .font('Helvetica')
        .fillColor('#0369a1')
        .text('https://lawrence-adjah.clientsecure.me/request/service', 70, undefined, {
          width: doc.page.width - 140,
          align: 'center',
          link: 'https://lawrence-adjah.clientsecure.me/request/service',
          underline: true
        });
        
      // Add a bit of space before footer
      doc.moveDown(3);
        
      // Add footer
      doc.fontSize(10)
        .font('Helvetica')
        .fillColor('#6b7280')
        .text('(c) 2025 Lawrence E. Adjah - The 100 Marriage Assessment - Series 1', { align: 'center' });
        
      // Finalize the PDF
      doc.end();
    } catch (error) {
      console.error('Error generating couple assessment PDF:', error);
      reject(error);
    }
  });
}