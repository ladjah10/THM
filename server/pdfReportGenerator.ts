import PDFDocument from 'pdfkit';
import { AssessmentResult, CoupleAssessmentReport } from '@shared/schema';
import fs from 'fs';
import path from 'path';

// Layout Constants for Professional Formatting
const LAYOUT = {
  MARGIN: 50,
  COLUMN_WIDTH: 250,
  ROW_HEIGHT: 24,
  PAGE_WIDTH: 612,
  PAGE_HEIGHT: 792,
  CONTENT_WIDTH: 512, // PAGE_WIDTH - (MARGIN * 2)
  SECTION_SPACING: 30,
  PARAGRAPH_SPACING: 12
};

// Font Styles for Consistency
const FONTS = {
  TITLE: { font: 'Helvetica-Bold', size: 18 },
  SECTION_HEADER: { font: 'Helvetica-Bold', size: 14 },
  SUBSECTION: { font: 'Helvetica-Bold', size: 12 },
  BODY: { font: 'Helvetica', size: 11 },
  SMALL: { font: 'Helvetica', size: 9 },
  SCORE: { font: 'Helvetica-Bold', size: 16 }
};

// Color Palette
const COLORS = {
  PRIMARY: '#2B4C8C',
  ACCENT: '#8B4A9C',
  TEXT: '#333333',
  LIGHT_GRAY: '#F5F5F5',
  MEDIUM_GRAY: '#CCCCCC',
  SUCCESS: '#4CAF50',
  WARNING: '#FF9800'
};

export class ProfessionalPDFGenerator {
  private doc: PDFKit.PDFDocument;
  private currentY: number = LAYOUT.MARGIN;

  constructor() {
    this.doc = new PDFDocument({
      size: 'letter',
      margins: {
        top: LAYOUT.MARGIN,
        bottom: LAYOUT.MARGIN,
        left: LAYOUT.MARGIN,
        right: LAYOUT.MARGIN
      }
    });
  }

  // Reusable Layout Functions
  private drawHeader(title: string, subtitle?: string): void {
    this.currentY = LAYOUT.MARGIN;
    
    // Add header background
    this.doc.rect(0, 0, LAYOUT.PAGE_WIDTH, 80)
      .fill(COLORS.PRIMARY);
    
    // Main title
    this.doc.fill('white')
      .font(FONTS.TITLE.font)
      .fontSize(FONTS.TITLE.size)
      .text(title, LAYOUT.MARGIN, 25, {
        width: LAYOUT.CONTENT_WIDTH,
        align: 'center'
      });

    if (subtitle) {
      this.doc.font(FONTS.BODY.font)
        .fontSize(FONTS.BODY.size)
        .text(subtitle, LAYOUT.MARGIN, 50, {
          width: LAYOUT.CONTENT_WIDTH,
          align: 'center'
        });
    }

    this.currentY = 100;
  }

  private drawSectionHeader(text: string): void {
    this.currentY += LAYOUT.SECTION_SPACING;
    
    // Section background bar
    this.doc.rect(LAYOUT.MARGIN, this.currentY - 5, LAYOUT.CONTENT_WIDTH, 25)
      .fill(COLORS.LIGHT_GRAY);
    
    this.doc.fill(COLORS.TEXT)
      .font(FONTS.SECTION_HEADER.font)
      .fontSize(FONTS.SECTION_HEADER.size)
      .text(text, LAYOUT.MARGIN + 10, this.currentY, {
        width: LAYOUT.CONTENT_WIDTH - 20,
        align: 'left'
      });

    this.currentY += 35;
  }

  private drawParagraph(text: string, options: { indent?: boolean, bold?: boolean } = {}): void {
    const xPosition = LAYOUT.MARGIN + (options.indent ? 20 : 0);
    
    this.doc.fill(COLORS.TEXT)
      .font(options.bold ? FONTS.SUBSECTION.font : FONTS.BODY.font)
      .fontSize(FONTS.BODY.size)
      .text(text, xPosition, this.currentY, {
        width: LAYOUT.CONTENT_WIDTH - (options.indent ? 20 : 0),
        align: 'left',
        continued: false
      });

    this.currentY += this.doc.heightOfString(text, {
      width: LAYOUT.CONTENT_WIDTH - (options.indent ? 20 : 0)
    }) + LAYOUT.PARAGRAPH_SPACING;
  }

  private drawScoreBar(label: string, score: number, maxScore: number = 100): void {
    const barWidth = 300;
    const barHeight = 20;
    const percentage = Math.min((score / maxScore) * 100, 100);
    const fillWidth = (percentage / 100) * barWidth;

    // Label
    this.doc.fill(COLORS.TEXT)
      .font(FONTS.BODY.font)
      .fontSize(FONTS.BODY.size)
      .text(label, LAYOUT.MARGIN, this.currentY);

    this.currentY += 20;

    // Score bar background
    this.doc.rect(LAYOUT.MARGIN, this.currentY, barWidth, barHeight)
      .fill(COLORS.MEDIUM_GRAY);

    // Score bar fill
    const fillColor = percentage >= 80 ? COLORS.SUCCESS : 
                     percentage >= 60 ? COLORS.WARNING : COLORS.ACCENT;
    
    this.doc.rect(LAYOUT.MARGIN, this.currentY, fillWidth, barHeight)
      .fill(fillColor);

    // Score text
    this.doc.fill('white')
      .font(FONTS.SUBSECTION.font)
      .fontSize(FONTS.SUBSECTION.size)
      .text(`${percentage.toFixed(1)}%`, LAYOUT.MARGIN + barWidth + 10, this.currentY + 3);

    this.currentY += barHeight + LAYOUT.PARAGRAPH_SPACING;
  }

  private drawProfileSection(profile: any, title: string): void {
    this.drawSectionHeader(title);
    
    // Profile name with colored background
    this.doc.rect(LAYOUT.MARGIN, this.currentY, LAYOUT.CONTENT_WIDTH, 30)
      .fill(COLORS.ACCENT);
    
    this.doc.fill('white')
      .font(FONTS.SECTION_HEADER.font)
      .fontSize(FONTS.SECTION_HEADER.size)
      .text(profile.name, LAYOUT.MARGIN + 15, this.currentY + 8, {
        width: LAYOUT.CONTENT_WIDTH - 30,
        align: 'center'
      });

    this.currentY += 45;

    // Profile description
    this.drawParagraph(profile.description);
  }

  private checkPageBreak(requiredSpace: number = 100): void {
    if (this.currentY + requiredSpace > LAYOUT.PAGE_HEIGHT - LAYOUT.MARGIN) {
      this.doc.addPage();
      this.currentY = LAYOUT.MARGIN;
    }
  }

  private drawFooter(): void {
    const footerY = LAYOUT.PAGE_HEIGHT - 30;
    
    this.doc.fill(COLORS.MEDIUM_GRAY)
      .font(FONTS.SMALL.font)
      .fontSize(FONTS.SMALL.size)
      .text('The 100 Marriage Assessment - Series 1 | Lawrence Adjah', 
        LAYOUT.MARGIN, footerY, {
          width: LAYOUT.CONTENT_WIDTH,
          align: 'center'
        });
  }

  // Individual Assessment Report Generation
  async generateIndividualReport(assessment: AssessmentResult): Promise<Buffer> {
    // Header
    this.drawHeader(
      'The 100 Marriage Assessment - Individual Report',
      `Report for ${assessment.demographicData.firstName} ${assessment.demographicData.lastName}`
    );

    // Overall Score Section
    this.drawSectionHeader('Overall Assessment Score');
    this.doc.fill(COLORS.PRIMARY)
      .font(FONTS.SCORE.font)
      .fontSize(32)
      .text(`${assessment.scores.overallPercentage}%`, LAYOUT.MARGIN, this.currentY, {
        width: LAYOUT.CONTENT_WIDTH,
        align: 'center'
      });
    
    this.currentY += 50;

    // Section Scores
    this.drawSectionHeader('Section Performance');
    Object.entries(assessment.scores.sections).forEach(([section, data]) => {
      this.checkPageBreak(60);
      this.drawScoreBar(`${section}`, data.percentage);
    });

    // Primary Profile
    this.checkPageBreak(150);
    this.drawProfileSection(assessment.profile, 'Your Primary Profile');

    // Gender-Specific Profile (if available)
    if (assessment.genderProfile) {
      this.checkPageBreak(150);
      this.drawProfileSection(assessment.genderProfile, 'Your Gender-Specific Profile');
    }

    // Strengths and Improvements
    this.checkPageBreak(200);
    this.drawSectionHeader('Key Insights');
    
    this.drawParagraph('Your Strengths:', { bold: true });
    assessment.scores.strengths.forEach(strength => {
      this.drawParagraph(`• ${strength}`, { indent: true });
    });

    this.drawParagraph('Areas for Growth:', { bold: true });
    assessment.scores.improvementAreas.forEach(area => {
      this.drawParagraph(`• ${area}`, { indent: true });
    });

    // Footer on each page
    this.drawFooter();

    return new Promise((resolve) => {
      const chunks: Buffer[] = [];
      this.doc.on('data', chunks.push.bind(chunks));
      this.doc.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      this.doc.end();
    });
  }

  // Couple Assessment Report Generation
  async generateCoupleReport(coupleReport: CoupleAssessmentReport): Promise<Buffer> {
    // Header
    this.drawHeader(
      'The 100 Marriage Assessment - Couple Compatibility Report',
      `${coupleReport.primaryAssessment.demographicData.firstName} & ${coupleReport.spouseAssessment.demographicData.firstName}`
    );

    // Compatibility Score
    this.drawSectionHeader('Overall Compatibility');
    this.doc.fill(COLORS.ACCENT)
      .font(FONTS.SCORE.font)
      .fontSize(32)
      .text(`${coupleReport.compatibilityScore}%`, LAYOUT.MARGIN, this.currentY, {
        width: LAYOUT.CONTENT_WIDTH,
        align: 'center'
      });
    
    this.currentY += 50;

    // Individual Scores Comparison
    this.drawSectionHeader('Individual Assessment Scores');
    
    // Side-by-side comparison
    const leftColumn = LAYOUT.MARGIN;
    const rightColumn = LAYOUT.MARGIN + LAYOUT.COLUMN_WIDTH + 20;
    
    this.doc.fill(COLORS.TEXT)
      .font(FONTS.SUBSECTION.font)
      .fontSize(FONTS.SUBSECTION.size)
      .text(coupleReport.primaryAssessment.demographicData.firstName, leftColumn, this.currentY)
      .text(coupleReport.spouseAssessment.demographicData.firstName, rightColumn, this.currentY);
    
    this.currentY += 30;

    Object.keys(coupleReport.primaryAssessment.scores.sections).forEach(section => {
      const primaryScore = coupleReport.primaryAssessment.scores.sections[section]?.percentage || 0;
      const spouseScore = coupleReport.spouseAssessment.scores.sections[section]?.percentage || 0;
      
      this.checkPageBreak(40);
      
      this.doc.fill(COLORS.TEXT)
        .font(FONTS.BODY.font)
        .fontSize(FONTS.BODY.size)
        .text(section, leftColumn, this.currentY, { width: LAYOUT.CONTENT_WIDTH });
      
      this.currentY += 15;
      
      this.doc.text(`${primaryScore.toFixed(1)}%`, leftColumn, this.currentY)
        .text(`${spouseScore.toFixed(1)}%`, rightColumn, this.currentY);
      
      this.currentY += 25;
    });

    // Compatibility Analysis
    this.checkPageBreak(200);
    this.drawSectionHeader('Compatibility Analysis');
    
    if (coupleReport.differenceAnalysis.alignmentAreas.length > 0) {
      this.drawParagraph('Areas of Strong Alignment:', { bold: true });
      coupleReport.differenceAnalysis.alignmentAreas.forEach(area => {
        this.drawParagraph(`• ${area.section}: ${area.analysis}`, { indent: true });
      });
    }

    if (coupleReport.differenceAnalysis.significantDifferences.length > 0) {
      this.drawParagraph('Areas for Discussion:', { bold: true });
      coupleReport.differenceAnalysis.significantDifferences.forEach(diff => {
        this.drawParagraph(`• ${diff.section}: ${diff.analysis}`, { indent: true });
      });
    }

    // Recommendations
    this.checkPageBreak(150);
    this.drawSectionHeader('Recommendations for Your Relationship');
    coupleReport.recommendations.forEach(recommendation => {
      this.drawParagraph(`• ${recommendation}`, { indent: true });
    });

    // Footer
    this.drawFooter();

    return new Promise((resolve) => {
      const chunks: Buffer[] = [];
      this.doc.on('data', chunks.push.bind(chunks));
      this.doc.on('end', () => {
        resolve(Buffer.concat(chunks));
      });
      this.doc.end();
    });
  }
}

// Convenience functions for backward compatibility
export async function generateIndividualAssessmentPDF(assessment: AssessmentResult): Promise<Buffer> {
  const generator = new ProfessionalPDFGenerator();
  return generator.generateIndividualReport(assessment);
}

export async function generateCoupleAssessmentPDF(coupleReport: CoupleAssessmentReport): Promise<Buffer> {
  const generator = new ProfessionalPDFGenerator();
  return generator.generateCoupleReport(coupleReport);
}