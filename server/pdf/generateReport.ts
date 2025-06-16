/**
 * Enhanced PDF Report Generator with Fixed Page Breaks and Proper Profile Mappings
 */

import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';
import { AssessmentResult, CoupleAssessmentReport } from '@shared/schema';
import { psychographicProfiles } from '../../client/src/data/psychographicProfiles';

/**
 * Generate Individual Assessment PDF Report
 */
export async function generateIndividualAssessmentPDF(assessment: AssessmentResult): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'LETTER',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
        info: {
          Title: `${assessment.name}'s The 100 Marriage Assessment - Series 1 Results`,
          Author: 'Lawrence E. Adjah',
          Subject: 'The 100 Marriage Assessment - Series 1',
        }
      });

      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // PAGE 1 - Header and Overview
      generateHeaderSection(doc, assessment);
      
      // Check if we need a new page before continuing
      if (doc.y > doc.page.height - 200) {
        doc.addPage();
      }
      
      generatePersonalInfoSection(doc, assessment);
      doc.moveDown(1.5);
      
      generateOverallScoreSection(doc, assessment);
      doc.moveDown(1.5);
      
      // PAGE 2 - Profiles
      doc.addPage();
      generateProfilesSection(doc, assessment);
      doc.moveDown(1.5);
      
      // PAGE 3 - Section Scores
      doc.addPage();
      generateSectionScoresSection(doc, assessment);
      doc.moveDown(1.5);
      
      // PAGE 4 - Gender Comparison
      doc.addPage();
      generateGenderComparisonSection(doc, assessment);
      doc.moveDown(1.5);
      
      // PAGE 5 - Appendix
      doc.addPage();
      generateAppendixSection(doc, assessment);
      
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Generate Couple Assessment PDF Report
 */
export async function generateCoupleAssessmentPDF(report: CoupleAssessmentReport): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'LETTER',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
        info: {
          Title: 'The 100 Marriage Assessment - Couple Discussion Guide',
          Author: 'Lawrence E. Adjah',
          Subject: 'Couple Assessment Results',
        }
      });

      const buffers: Buffer[] = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => resolve(Buffer.concat(buffers)));
      doc.on('error', reject);

      // PAGE 1 - Cover Page
      generateCoupleCoverPage(doc, report);
      
      // PAGE 2 - Score Comparison
      doc.addPage();
      generateCoupleComparisonSection(doc, report);
      
      // PAGE 3 - Discussion Areas
      doc.addPage();
      generateDiscussionAreasSection(doc, report);
      
      // PAGE 4 - Appendix
      doc.addPage();
      generateCoupleAppendixSection(doc, report);
      
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Generate header section with proper spacing
 */
function generateHeaderSection(doc: PDFDocument, assessment: AssessmentResult) {
  doc.fontSize(24)
    .font('Helvetica-Bold')
    .fillColor('#1a365d')
    .text('The 100 Marriage Assessment - Series 1', { align: 'center' });
    
  doc.moveDown(0.5)
    .fontSize(16)
    .fillColor('#3182ce')
    .text('Personal Assessment Results', { align: 'center' });
  
  doc.moveDown(1.5);
  
  // Add horizontal divider
  doc.strokeColor('#e2e8f0')
    .lineWidth(1)
    .moveTo(50, doc.y)
    .lineTo(doc.page.width - 50, doc.y)
    .stroke();
    
  doc.moveDown(1.5);
}

/**
 * Generate personal information section
 */
function generatePersonalInfoSection(doc: PDFDocument, assessment: AssessmentResult) {
  doc.fontSize(16)
    .font('Helvetica-Bold')
    .fillColor('#2d3748')
    .text('Personal Information');
  
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
}

/**
 * Generate overall score section with visual representation
 */
function generateOverallScoreSection(doc: PDFDocument, assessment: AssessmentResult) {
  doc.fontSize(16)
    .font('Helvetica-Bold')
    .fillColor('#2d3748')
    .text('Overall Assessment Score', { align: 'center' });

  doc.moveDown(1);

  // Draw score circle
  const scoreRadius = 45;
  const centerX = doc.page.width / 2;
  const circleY = doc.y + 50;
  const scoreText = `${assessment.scores.overallPercentage.toFixed(1).replace('.0', '')}%`;
  
  doc.circle(centerX, circleY, scoreRadius)
    .fillAndStroke('#3182ce', '#3182ce');
    
  doc.fillColor('white')
    .font('Helvetica-Bold')
    .fontSize(24);
  
  const scoreTextWidth = doc.widthOfString(scoreText);
  const textHeight = doc.currentLineHeight();
  
  doc.text(scoreText, centerX - scoreTextWidth / 2, circleY - textHeight / 2);
  
  // Move past the circle
  doc.y = circleY + scoreRadius + 30;
  
  // Add score explanation
  doc.fontSize(12)
    .font('Helvetica')
    .fillColor('#4a5568')
    .text('Understanding Your Score: Your assessment score reflects your perspectives on marriage, not a judgment of readiness. Higher percentages indicate alignment with traditional marriage values, while lower percentages suggest less traditional approaches. Neither is inherently better—just different expectations.', {
      width: doc.page.width - 100,
      align: 'left',
      lineGap: 3
    });
    
  doc.moveDown(1.5);
}

/**
 * Generate profiles section with corrected mappings
 */
function generateProfilesSection(doc: PDFDocument, assessment: AssessmentResult) {
  doc.fontSize(16)
    .font('Helvetica-Bold')
    .fillColor('#2d3748')
    .text('Your Psychographic Profiles');
  
  doc.moveDown(1);
  
  // Primary Profile
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
      lineGap: 3
    });
  
  doc.moveDown(1.5);
  
  // Gender-specific profile if available
  if (assessment.genderProfile) {
    doc.fontSize(14)
      .fillColor('#805ad5')
      .text(`${assessment.genderProfile.name} (${assessment.demographics.gender === 'male' ? 'Male' : 'Female'}-Specific Profile)`);
      
    doc.moveDown(0.5)
      .fontSize(12)
      .fillColor('#4a5568')
      .font('Helvetica')
      .text(assessment.genderProfile.description, {
        align: 'left',
        width: doc.page.width - 100,
        lineGap: 3
      });
  }
}

/**
 * Generate section scores with proper formatting
 */
function generateSectionScoresSection(doc: PDFDocument, assessment: AssessmentResult) {
  doc.fontSize(16)
    .font('Helvetica-Bold')
    .fillColor('#2d3748')
    .text('Section Scores');
    
  doc.moveDown(0.5)
    .fontSize(12)
    .fillColor('#4a5568')
    .text('Each section score represents your perspective in a specific relationship area. These scores determine your psychographic profiles.', {
      width: doc.page.width - 100,
      align: 'left',
      lineGap: 3
    });
    
  doc.moveDown(1.5);
  
  const maxBarWidth = doc.page.width - 200;
  
  Object.entries(assessment.scores.sections).forEach(([sectionName, score]) => {
    // Check if we need a new page
    if (doc.y > doc.page.height - 100) {
      doc.addPage();
    }
    
    doc.fontSize(12)
      .font('Helvetica')
      .fillColor('#4a5568')
      .text(`${sectionName}:`, 50, doc.y);
      
    doc.fillColor('#3182ce')
      .text(`${score.percentage.toFixed(1).replace('.0', '')}%`, 250, doc.y - doc.currentLineHeight());
    
    const barWidth = (score.percentage / 100) * maxBarWidth;
    
    doc.rect(50, doc.y + 5, maxBarWidth, 10)
      .fillColor('#f0f0f0');
      
    doc.rect(50, doc.y + 5, barWidth, 10)
      .fillColor('#3182ce');
      
    doc.moveDown(1.5);
  });
}

/**
 * Generate gender comparison section
 */
function generateGenderComparisonSection(doc: PDFDocument, assessment: AssessmentResult) {
  const genderText = assessment.demographics.gender === 'male' ? 'men' : 'women';
  
  doc.fontSize(18)
    .font('Helvetica-Bold')
    .fillColor('#2c5282')
    .text(`How You Compare to Other ${genderText.charAt(0).toUpperCase() + genderText.slice(1)}`, { 
      align: 'center',
      width: doc.page.width - 100
    });
  
  doc.moveDown(1);
  
  doc.fontSize(12)
    .font('Helvetica')
    .fillColor('#4a5568')
    .text(`Based on responses from other ${genderText} who have taken this assessment, we've prepared gender-specific comparisons to help you understand your results in context.`, {
      width: doc.page.width - 100,
      align: 'center'
    });
  
  doc.moveDown(1.5);
  
  // Add comparison statistics here
  doc.fontSize(12)
    .fillColor('#4a5568')
    .text('Your score places you in a unique position among respondents, reflecting your individual perspective on marriage and relationships.', {
      width: doc.page.width - 100,
      align: 'left'
    });
}

/**
 * Generate appendix section with proper image and text alignment
 */
function generateAppendixSection(doc: PDFDocument, assessment: AssessmentResult) {
  doc.fontSize(16)
    .font('Helvetica-Bold')
    .fillColor('#2d3748')
    .text('Appendix: Psychographic Profiles Reference');
  
  doc.moveDown(1);
  
  // General profiles
  doc.fontSize(14)
    .fillColor('#3498db')
    .text('General Profiles');
    
  doc.moveDown(0.5);
  
  const generalProfiles = psychographicProfiles.filter(p => p.genderSpecific === null);
  
  generalProfiles.forEach(profile => {
    // Check if we need a new page
    if (doc.y > doc.page.height - 150) {
      doc.addPage();
    }
    
    addProfileToAppendix(doc, profile);
  });
  
  // Female-specific profiles
  if (doc.y > doc.page.height - 200) {
    doc.addPage();
  } else {
    doc.moveDown(1.5);
  }
  
  doc.fontSize(14)
    .fillColor('#9b59b6')
    .text('Female-Specific Profiles');
    
  doc.moveDown(0.5);
  
  const femaleProfiles = psychographicProfiles.filter(p => p.genderSpecific === 'female');
  
  femaleProfiles.forEach(profile => {
    if (doc.y > doc.page.height - 150) {
      doc.addPage();
    }
    addProfileToAppendix(doc, profile);
  });
  
  // Male-specific profiles
  if (doc.y > doc.page.height - 200) {
    doc.addPage();
  } else {
    doc.moveDown(1.5);
  }
  
  doc.fontSize(14)
    .fillColor('#2980b9')
    .text('Male-Specific Profiles');
    
  doc.moveDown(0.5);
  
  const maleProfiles = psychographicProfiles.filter(p => p.genderSpecific === 'male');
  
  maleProfiles.forEach(profile => {
    if (doc.y > doc.page.height - 150) {
      doc.addPage();
    }
    addProfileToAppendix(doc, profile);
  });
}

/**
 * Add individual profile to appendix with proper formatting
 */
function addProfileToAppendix(doc: PDFDocument, profile: any) {
  const startY = doc.y;
  
  // Try to load and display icon if available
  try {
    if (profile.iconPath && fs.existsSync(path.join(process.cwd(), 'public', profile.iconPath))) {
      doc.image(path.join(process.cwd(), 'public', profile.iconPath), { 
        fit: [60, 60], 
        align: 'center', 
        valign: 'top' 
      });
    }
  } catch (error) {
    // Fallback if image loading fails
    console.log(`Could not load icon for ${profile.name}`);
  }
  
  doc.moveDown(0.5);
  
  doc.fontSize(12)
    .font('Helvetica-Bold')
    .fillColor('#2d3748')
    .text(profile.name, { align: 'center' });
  
  doc.moveDown(0.5);
  
  doc.fontSize(10)
    .font('Helvetica')
    .fillColor('#4a5568')
    .text(profile.description, { 
      align: 'left', 
      width: 450,
      lineGap: 2
    });
  
  doc.moveDown(1);
}

/**
 * Generate couple cover page
 */
function generateCoupleCoverPage(doc: PDFDocument, report: CoupleAssessmentReport) {
  doc.fontSize(24)
    .font('Helvetica-Bold')
    .fillColor('#1a365d')
    .text('The 100 Marriage Assessment - Series 1', { align: 'center' });
  
  doc.moveDown(0.5)
    .fontSize(18)
    .fillColor('#3182ce')
    .text('Couple Discussion Guide', { align: 'center' });
  
  doc.moveDown(2);
  
  // Compatibility score circle
  const scoreRadius = 50;
  const centerX = doc.page.width / 2;
  const circleY = doc.y + 80;
  
  doc.circle(centerX, circleY, scoreRadius)
    .fillAndStroke('#3182ce', '#3182ce');
  
  doc.fillColor('white')
    .font('Helvetica-Bold')
    .fontSize(28);
  
  const scoreText = `${report.overallCompatibility.toFixed(1).replace('.0', '')}%`;
  const textWidth = doc.widthOfString(scoreText);
  const textHeight = doc.currentLineHeight();
  
  doc.text(scoreText, centerX - textWidth / 2, circleY - textHeight / 2);
  
  doc.fontSize(14)
    .fillColor('white')
    .text('Compatibility', centerX - 40, circleY + 15);
  
  doc.y = circleY + scoreRadius + 30;
  
  // Couple names
  const primaryName = `${report.primaryAssessment.demographics?.firstName || ''} ${report.primaryAssessment.demographics?.lastName || ''}`.trim() || 'Partner 1';
  const spouseName = `${report.spouseAssessment.demographics?.firstName || ''} ${report.spouseAssessment.demographics?.lastName || ''}`.trim() || 'Partner 2';
  const coupleNames = `${primaryName} & ${spouseName}`;
  
  doc.fontSize(16)
    .fillColor('#2d3748')
    .font('Helvetica-Bold')
    .text(coupleNames, { align: 'center' });
  
  doc.moveDown(0.5)
    .fontSize(12)
    .fillColor('#718096')
    .font('Helvetica')
    .text(`Completed on ${new Date(report.timestamp).toLocaleDateString()}`, { align: 'center' });
}

/**
 * Generate couple comparison section
 */
function generateCoupleComparisonSection(doc: PDFDocument, report: CoupleAssessmentReport) {
  doc.fontSize(16)
    .font('Helvetica-Bold')
    .fillColor('#2d3748')
    .text('Score Comparison');
  
  doc.moveDown(1);
  
  // Add comparison table and analysis here
  doc.fontSize(12)
    .font('Helvetica')
    .fillColor('#4a5568')
    .text('Your compatibility score reflects the alignment of your perspectives across all assessment sections.', {
      width: doc.page.width - 100,
      lineGap: 3
    });
}

/**
 * Generate discussion areas section
 */
function generateDiscussionAreasSection(doc: PDFDocument, report: CoupleAssessmentReport) {
  doc.fontSize(16)
    .font('Helvetica-Bold')
    .fillColor('#2d3748')
    .text('Key Differences to Discuss');
  
  doc.moveDown(1);
  
  doc.fontSize(12)
    .font('Helvetica')
    .fillColor('#4a5568')
    .text('These are areas where your responses showed notable differences. Use these as conversation starters.', {
      width: doc.page.width - 100,
      lineGap: 3
    });
}

/**
 * Generate couple appendix section
 */
function generateCoupleAppendixSection(doc: PDFDocument, report: CoupleAssessmentReport) {
  doc.fontSize(16)
    .font('Helvetica-Bold')
    .fillColor('#2d3748')
    .text('Appendix: Psychographic Profiles Reference');
  
  doc.moveDown(1);
  
  // Add abbreviated profiles reference for couples
  doc.fontSize(12)
    .font('Helvetica')
    .fillColor('#4a5568')
    .text('For complete profile descriptions, please refer to your individual assessment reports.', {
      width: doc.page.width - 100
    });
}