/**
 * PDF generation functionality for assessment reports
 */

import * as fs from 'fs';
import * as path from 'path';
import PDFDocument from 'pdfkit';
import type { AssessmentResult, UserProfile } from '../shared/schema';

// Directory to save generated PDFs
const PDF_OUTPUT_DIR = path.join(__dirname, '../temp');

// Ensure output directory exists
if (!fs.existsSync(PDF_OUTPUT_DIR)) {
  fs.mkdirSync(PDF_OUTPUT_DIR, { recursive: true });
}

/**
 * Generates a PDF for an individual assessment result
 * @param assessment The assessment result to generate a PDF for
 * @returns Path to the generated PDF file
 */
export async function generateIndividualPDF(assessment: AssessmentResult): Promise<string> {
  // Create a filename based on the user's name and timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const sanitizedName = assessment.name.replace(/[^a-zA-Z0-9]/g, '-');
  const filename = `${sanitizedName}-${timestamp}.pdf`;
  const outputPath = path.join(PDF_OUTPUT_DIR, filename);
  
  // Create a new PDF document
  const doc = new PDFDocument({
    size: 'letter',
    margins: {
      top: 72,
      bottom: 72,
      left: 72,
      right: 72
    },
    info: {
      Title: `The 100 Marriage Assessment Report - ${assessment.name}`,
      Author: 'The 100 Marriage',
      Subject: 'Individual Assessment Report'
    }
  });
  
  // Pipe the PDF to a file
  const stream = fs.createWriteStream(outputPath);
  doc.pipe(stream);
  
  // Add content to the PDF
  addHeaderPage(doc, assessment);
  
  // Add score breakdown page
  doc.addPage();
  addScoreBreakdown(doc, assessment);
  
  // Add psychographic profile page
  doc.addPage();
  addProfilePage(doc, assessment);
  
  // Add recommendations page
  doc.addPage();
  addRecommendationsPage(doc, assessment);
  
  // Finalize the PDF
  doc.end();
  
  // Return a promise that resolves when the PDF is written
  return new Promise((resolve, reject) => {
    stream.on('finish', () => resolve(outputPath));
    stream.on('error', reject);
  });
}

/**
 * Add the header page with basic information
 */
function addHeaderPage(doc: PDFKit.PDFDocument, assessment: AssessmentResult) {
  // Add title
  doc.fontSize(24)
     .font('Helvetica-Bold')
     .text('The 100 Marriage Assessment', { align: 'center' });
  
  doc.moveDown();
  doc.fontSize(18)
     .text('Individual Assessment Report', { align: 'center' });
  
  doc.moveDown(0.5);
  doc.fontSize(16)
     .text(`${assessment.scores.overallPercentage.toFixed(1)}% Overall Score`, { align: 'center' });

  doc.moveDown(2);
  
  // Add name and date
  doc.fontSize(14)
     .font('Helvetica-Bold')
     .text(`${assessment.name}'s Report`, { align: 'left' });
  
  doc.moveDown(0.5);
  const dateStr = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
  doc.fontSize(12)
     .font('Helvetica')
     .text(`Generated on: ${dateStr}`, { align: 'left' });
  
  doc.moveDown(2);
  
  // Introduction
  doc.fontSize(12)
     .text('This report provides insights into your relationship preferences, values, and priorities based on your responses to The 100 Marriage Assessment. Understanding your psychographic profile can help you make informed decisions about relationships and identify compatible partners.', {
       align: 'left'
     });
  
  doc.moveDown(1);
  
  // Add a summary of their results
  doc.fontSize(14)
     .font('Helvetica-Bold')
     .text('Summary of Results', { align: 'left' });
  
  doc.moveDown(0.5);
  doc.fontSize(12)
     .font('Helvetica')
     .text(`Your responses indicate that you are a ${assessment.profile.name}. ${assessment.profile.description}`, {
       align: 'left'
     });
  
  doc.moveDown(1);
  
  // Add strengths section
  doc.fontSize(14)
     .font('Helvetica-Bold')
     .text('Your Relationship Strengths', { align: 'left' });
  
  doc.moveDown(0.5);
  doc.fontSize(12)
     .font('Helvetica');
  
  assessment.scores.strengths.forEach((strength, index) => {
    doc.text(`${index + 1}. ${strength}`, {
      align: 'left',
      indent: 20
    });
  });
  
  doc.moveDown(1);
  
  // Add improvement areas
  doc.fontSize(14)
     .font('Helvetica-Bold')
     .text('Areas for Growth', { align: 'left' });
  
  doc.moveDown(0.5);
  doc.fontSize(12)
     .font('Helvetica');
  
  assessment.scores.improvementAreas.forEach((area, index) => {
    doc.text(`${index + 1}. ${area}`, {
      align: 'left',
      indent: 20
    });
  });
}

/**
 * Add score breakdown page
 */
function addScoreBreakdown(doc: PDFKit.PDFDocument, assessment: AssessmentResult) {
  doc.fontSize(18)
     .font('Helvetica-Bold')
     .text('Score Breakdown', { align: 'center' });
  
  doc.moveDown(1);
  
  // Add overall score visualization
  doc.fontSize(14)
     .font('Helvetica-Bold')
     .text('Overall Score', { align: 'left' });
  
  doc.moveDown(0.5);
  const overallScore = assessment.scores.overallPercentage;
  doc.fontSize(24)
     .text(`${overallScore.toFixed(1)}%`, { align: 'center' });
  
  // Add progress bar for overall score
  const barWidth = 400;
  const barHeight = 20;
  const x = (doc.page.width - barWidth) / 2;
  const y = doc.y + 10;
  
  // Draw bar background
  doc.rect(x, y, barWidth, barHeight)
     .fillAndStroke('#e0e0e0', '#cccccc');
  
  // Draw filled portion
  doc.rect(x, y, barWidth * (overallScore / 100), barHeight)
     .fill('#4A86E8');
  
  doc.moveDown(3);
  
  // Add section scores
  doc.fontSize(14)
     .font('Helvetica-Bold')
     .text('Section Scores', { align: 'left' });
  
  doc.moveDown(1);
  
  // Get sorted section scores
  const sectionScores = Object.entries(assessment.scores.sections)
    .map(([section, score]) => ({ section, percentage: score.percentage }))
    .sort((a, b) => b.percentage - a.percentage);
  
  // Draw section score bars
  sectionScores.forEach(({ section, percentage }, index) => {
    const sectionY = doc.y + 5;
    
    doc.fontSize(10)
       .font('Helvetica')
       .text(section, { continued: true })
       .text(`${percentage.toFixed(1)}%`, { align: 'right' });
    
    // Draw bar background
    doc.rect(72, sectionY + 15, barWidth, 15)
       .fillAndStroke('#e0e0e0', '#cccccc');
    
    // Draw filled portion
    doc.rect(72, sectionY + 15, barWidth * (percentage / 100), 15)
       .fill(getScoreColor(percentage));
    
    doc.moveDown(1.5);
  });
}

/**
 * Add psychographic profile page
 */
function addProfilePage(doc: PDFKit.PDFDocument, assessment: AssessmentResult) {
  doc.fontSize(18)
     .font('Helvetica-Bold')
     .text('Your Psychographic Profile', { align: 'center' });
  
  doc.moveDown(0.5);
  
  doc.fontSize(16)
     .font('Helvetica-Bold')
     .text(assessment.profile.name, { align: 'center' });
  
  doc.moveDown(1);
  
  // Add profile description
  doc.fontSize(12)
     .font('Helvetica')
     .text(assessment.profile.description, { align: 'left' });
  
  doc.moveDown(2);
  
  // Add compatibility information
  doc.fontSize(14)
     .font('Helvetica-Bold')
     .text('Compatibility Insights', { align: 'left' });
  
  doc.moveDown(0.5);
  
  doc.fontSize(12)
     .font('Helvetica')
     .text('The 100 Marriage Assessment identifies patterns of compatibility based on psychographic profiles. While compatibility exists across profiles, some combinations naturally align better than others.', {
       align: 'left'
     });
  
  doc.moveDown(1);
  
  // Compatible profiles section
  doc.fontSize(12)
     .font('Helvetica-Bold')
     .text('Most Compatible With:', { align: 'left' });
  
  doc.moveDown(0.5);
  
  doc.fontSize(12)
     .font('Helvetica')
     .text('• Balanced Visionary - Values harmony and shares your commitment to future planning.\n• Relationship Nurturer - Provides emotional support and complements your approach.\n• Focused Protector - Shares your practical mindset and commitment to security.', {
       align: 'left'
     });
  
  doc.moveDown(1);
  
  // Add considerations
  doc.fontSize(14)
     .font('Helvetica-Bold')
     .text('Important Considerations', { align: 'left' });
  
  doc.moveDown(0.5);
  
  doc.fontSize(12)
     .font('Helvetica')
     .text('Psychographic profiles are not deterministic of relationship success. Healthy relationships depend on mutual respect, communication, and commitment. Your profile represents tendencies and preferences rather than fixed traits. Growth and adaptation are always possible.', {
       align: 'left'
     });
}

/**
 * Add recommendations page
 */
function addRecommendationsPage(doc: PDFKit.PDFDocument, assessment: AssessmentResult) {
  doc.fontSize(18)
     .font('Helvetica-Bold')
     .text('Recommendations & Next Steps', { align: 'center' });
  
  doc.moveDown(1);
  
  // Personal growth
  doc.fontSize(14)
     .font('Helvetica-Bold')
     .text('Personal Growth Opportunities', { align: 'left' });
  
  doc.moveDown(0.5);
  
  doc.fontSize(12)
     .font('Helvetica')
     .text('Based on your assessment results, consider focusing on these areas:', { align: 'left' });
  
  doc.moveDown(0.5);
  
  // Add recommendations based on improvement areas
  assessment.scores.improvementAreas.forEach((area, index) => {
    let recommendation = '';
    
    switch(area) {
      case 'Behavior Values':
        recommendation = 'Reflect on your core values and how they align with your actions.';
        break;
      case 'Spirituality & Faith':
        recommendation = 'Explore how spiritual practices might enhance your relationships.';
        break;
      case 'Family & Children':
        recommendation = 'Consider how family dynamics influence your relationship expectations.';
        break;
      case 'Financial Priorities':
        recommendation = 'Develop clearer financial goals and communication strategies.';
        break;
      case 'Traditional Habits':
        recommendation = 'Reflect on which traditions you value most in relationships.';
        break;
      case 'Relationship Needs':
        recommendation = 'Practice expressing your emotional needs more clearly.';
        break;
      case 'Intellectual Style':
        recommendation = 'Seek opportunities for intellectual growth with your partner.';
        break;
      case 'Physical Priorities':
        recommendation = 'Consider how physical well-being contributes to relationship satisfaction.';
        break;
      case 'Social Lifestyle':
        recommendation = 'Reflect on how social connections enhance or challenge your relationships.';
        break;
      default:
        recommendation = 'Focus on self-awareness and growth in this area.';
    }
    
    doc.text(`${index + 1}. ${area}: ${recommendation}`, {
      align: 'left',
      indent: 20
    });
    
    doc.moveDown(0.5);
  });
  
  doc.moveDown(1);
  
  // Continue your journey section
  doc.fontSize(14)
     .font('Helvetica-Bold')
     .text('Continue Your Journey with The 100 Marriage', { align: 'left' });
  
  doc.moveDown(0.5);
  
  doc.fontSize(12)
     .font('Helvetica')
     .text('To deepen your understanding of relationship compatibility and psychographic profiles:', { align: 'left' });
  
  doc.moveDown(0.5);
  
  doc.fontSize(12)
     .list([
       'Purchase "The 100 Marriage" book for a comprehensive guide to relationship compatibility and psychographic profiles.',
       'Consider taking the Couple Assessment with a current or potential partner for deeper insights.',
       'Visit www.the100marriage.lawrenceadjah.com for additional resources and relationship tools.'
     ], {
       bulletRadius: 2,
       textIndent: 20,
       bulletIndent: 10,
       align: 'left'
     });
  
  doc.moveDown(2);
  
  // Add footer
  doc.fontSize(10)
     .font('Helvetica-Oblique')
     .text('This assessment is based on your self-reported responses and is intended for informational purposes only. It is not a substitute for professional relationship counseling or therapy.', {
       align: 'center'
     });
  
  doc.moveDown(0.5);
  
  doc.fontSize(10)
     .font('Helvetica')
     .text('© The 100 Marriage. All rights reserved.', {
       align: 'center'
     });
}

/**
 * Get color based on score percentage
 */
function getScoreColor(percentage: number): string {
  if (percentage >= 80) return '#4CAF50'; // Green
  if (percentage >= 60) return '#2196F3'; // Blue
  if (percentage >= 40) return '#FF9800'; // Orange
  return '#F44336'; // Red
}