import PDFDocument from 'pdfkit';
import { CoupleAssessmentReport, AssessmentResult } from '@shared/schema';
import { EnhancedIndividualPDFGenerator } from './updated-individual-pdf';
import fs from 'fs';
import path from 'path';

// Enhanced Layout Constants matching the sample design
const LAYOUT = {
  MARGIN: 50,
  CONTENT_WIDTH: 495,
  PAGE_HEIGHT: 792,
  PAGE_WIDTH: 612,
  SECTION_SPACING: 25,
  PARAGRAPH_SPACING: 12,
  COLUMN_WIDTH: 235,
  COLUMN_SPACING: 25
};

const COLORS = {
  PRIMARY: '#2c3e50',
  SECONDARY: '#3498db',
  SUCCESS: '#27ae60',
  WARNING: '#f39c12',
  DANGER: '#e74c3c',
  TEXT: '#2c3e50',
  MUTED: '#7f8c8d',
  LIGHT_GRAY: '#ecf0f1',
  MEDIUM_GRAY: '#bdc3c7',
  COUPLE_PRIMARY: '#8e44ad',
  COUPLE_SECONDARY: '#e8d5f0'
};

const FONTS = {
  TITLE: { font: 'Helvetica-Bold', size: 24 },
  SUBTITLE: { font: 'Helvetica-Bold', size: 18 },
  SECTION: { font: 'Helvetica-Bold', size: 16 },
  SUBSECTION: { font: 'Helvetica-Bold', size: 14 },
  BODY: { font: 'Helvetica', size: 11 },
  SMALL: { font: 'Helvetica', size: 9 }
};

export class EnhancedCouplePDFGenerator {
  private doc: PDFKit.PDFDocument;
  private currentY: number = LAYOUT.MARGIN;

  constructor() {
    this.doc = new PDFDocument({ 
      size: 'LETTER',
      margins: { top: LAYOUT.MARGIN, bottom: LAYOUT.MARGIN, left: LAYOUT.MARGIN, right: LAYOUT.MARGIN }
    });
  }

  private drawHeader(title: string, subtitle?: string): void {
    // Main title
    this.doc.fill(COLORS.COUPLE_PRIMARY)
      .font(FONTS.TITLE.font)
      .fontSize(FONTS.TITLE.size)
      .text(title, LAYOUT.MARGIN, this.currentY, {
        width: LAYOUT.CONTENT_WIDTH,
        align: 'center'
      });

    this.currentY += 35;

    // Subtitle if provided
    if (subtitle) {
      this.doc.fill(COLORS.SECONDARY)
        .font(FONTS.SUBTITLE.font)
        .fontSize(FONTS.SUBTITLE.size)
        .text(subtitle, LAYOUT.MARGIN, this.currentY, {
          width: LAYOUT.CONTENT_WIDTH,
          align: 'center'
        });
      this.currentY += 30;
    }
  }

  private drawSectionHeader(text: string): void {
    this.checkPageBreak(50);
    
    this.doc.fill(COLORS.COUPLE_PRIMARY)
      .font(FONTS.SECTION.font)
      .fontSize(FONTS.SECTION.size)
      .text(text, LAYOUT.MARGIN, this.currentY);
    
    this.currentY += 25;
  }

  private drawParagraph(text: string, options: { indent?: boolean, bold?: boolean, fontSize?: number, align?: string } = {}): void {
    const xPosition = LAYOUT.MARGIN + (options.indent ? 20 : 0);
    const fontSize = options.fontSize || FONTS.BODY.size;
    const align = options.align || 'left';
    
    this.doc.fill(COLORS.TEXT)
      .font(options.bold ? FONTS.SUBSECTION.font : FONTS.BODY.font)
      .fontSize(fontSize)
      .text(text, xPosition, this.currentY, {
        width: LAYOUT.CONTENT_WIDTH - (options.indent ? 20 : 0),
        align: align as any
      });
    
    this.currentY += this.doc.heightOfString(text, {
      width: LAYOUT.CONTENT_WIDTH - (options.indent ? 20 : 0)
    }) + LAYOUT.PARAGRAPH_SPACING;
  }

  private drawCompatibilityScore(score: number): void {
    this.checkPageBreak(120);
    
    // Background box for compatibility score
    this.doc.rect(LAYOUT.MARGIN, this.currentY, LAYOUT.CONTENT_WIDTH, 80)
      .fill(COLORS.COUPLE_SECONDARY);
    
    this.currentY += 20;
    
    // Compatibility score
    this.doc.fill(COLORS.COUPLE_PRIMARY)
      .font(FONTS.TITLE.font)
      .fontSize(28)
      .text(`${score}% Compatible`, LAYOUT.MARGIN, this.currentY, {
        width: LAYOUT.CONTENT_WIDTH,
        align: 'center'
      });
    
    this.currentY += 60;
  }

  private drawSideBySideScores(primaryAssessment: any, spouseAssessment: any): void {
    this.checkPageBreak(300);
    
    const primaryDemo = typeof primaryAssessment.demographics === 'string' 
      ? JSON.parse(primaryAssessment.demographics) 
      : primaryAssessment.demographics;
    
    const spouseDemo = typeof spouseAssessment.demographics === 'string' 
      ? JSON.parse(spouseAssessment.demographics) 
      : spouseAssessment.demographics;

    const primaryScores = typeof primaryAssessment.scores === 'string' 
      ? JSON.parse(primaryAssessment.scores) 
      : primaryAssessment.scores;
    
    const spouseScores = typeof spouseAssessment.scores === 'string' 
      ? JSON.parse(spouseAssessment.scores) 
      : spouseAssessment.scores;

    // Column headers
    this.doc.fill(COLORS.COUPLE_PRIMARY)
      .font(FONTS.SUBSECTION.font)
      .fontSize(FONTS.SUBSECTION.size)
      .text(`${primaryDemo.firstName}'s Results`, LAYOUT.MARGIN, this.currentY)
      .text(`${spouseDemo.firstName}'s Results`, LAYOUT.MARGIN + LAYOUT.COLUMN_WIDTH + LAYOUT.COLUMN_SPACING, this.currentY);
    
    this.currentY += 30;

    // Overall scores
    this.doc.fill(COLORS.TEXT)
      .font(FONTS.BODY.font)
      .fontSize(FONTS.BODY.size)
      .text(`Overall Score: ${primaryScores.overallPercentage}%`, LAYOUT.MARGIN, this.currentY)
      .text(`Overall Score: ${spouseScores.overallPercentage}%`, LAYOUT.MARGIN + LAYOUT.COLUMN_WIDTH + LAYOUT.COLUMN_SPACING, this.currentY);
    
    this.currentY += 25;

    // Section scores side by side
    const sections = Object.keys(primaryScores.sections);
    sections.forEach(section => {
      this.checkPageBreak(25);
      
      const primarySectionScore = primaryScores.sections[section];
      const spouseSectionScore = spouseScores.sections[section];
      
      this.doc.fill(COLORS.TEXT)
        .font(FONTS.SMALL.font)
        .fontSize(FONTS.SMALL.size)
        .text(`${section}: ${primarySectionScore.percentage}%`, LAYOUT.MARGIN, this.currentY)
        .text(`${section}: ${spouseSectionScore.percentage}%`, LAYOUT.MARGIN + LAYOUT.COLUMN_WIDTH + LAYOUT.COLUMN_SPACING, this.currentY);
      
      this.currentY += 20;
    });
  }

  private drawCompatibilityAnalysis(differenceAnalysis: any): void {
    this.checkPageBreak(200);
    
    this.drawSectionHeader('Compatibility Analysis');
    
    // Significant differences
    if (differenceAnalysis.significantDifferences && differenceAnalysis.significantDifferences.length > 0) {
      this.drawParagraph('Areas of Difference:', { bold: true });
      differenceAnalysis.significantDifferences.forEach((diff: any) => {
        this.drawParagraph(`• ${diff.section}: ${diff.analysis}`, { indent: true });
      });
      this.currentY += 10;
    }

    // Alignment areas
    if (differenceAnalysis.alignmentAreas && differenceAnalysis.alignmentAreas.length > 0) {
      this.drawParagraph('Areas of Alignment:', { bold: true });
      differenceAnalysis.alignmentAreas.forEach((area: any) => {
        this.drawParagraph(`• ${area.section}: ${area.analysis}`, { indent: true });
      });
      this.currentY += 10;
    }

    // Recommendations
    if (differenceAnalysis.recommendations && differenceAnalysis.recommendations.length > 0) {
      this.drawParagraph('Recommendations:', { bold: true });
      differenceAnalysis.recommendations.forEach((rec: string) => {
        this.drawParagraph(`• ${rec}`, { indent: true });
      });
    }
  }

  private drawCoupleProfiles(primaryAssessment: any, spouseAssessment: any): void {
    this.checkPageBreak(200);
    
    this.drawSectionHeader('Your Relationship Profiles');
    
    const primaryDemo = typeof primaryAssessment.demographics === 'string' 
      ? JSON.parse(primaryAssessment.demographics) 
      : primaryAssessment.demographics;
    
    const spouseDemo = typeof spouseAssessment.demographics === 'string' 
      ? JSON.parse(spouseAssessment.demographics) 
      : spouseAssessment.demographics;

    const primaryProfile = typeof primaryAssessment.profile === 'string' 
      ? JSON.parse(primaryAssessment.profile) 
      : primaryAssessment.profile;
    
    const spouseProfile = typeof spouseAssessment.profile === 'string' 
      ? JSON.parse(spouseAssessment.profile) 
      : spouseAssessment.profile;

    // Primary profile
    this.drawParagraph(`${primaryDemo.firstName}'s Profile: ${primaryProfile.name}`, { bold: true });
    this.drawParagraph(primaryProfile.description.substring(0, 200) + '...', { indent: true });
    this.currentY += 15;

    // Spouse profile
    this.drawParagraph(`${spouseDemo.firstName}'s Profile: ${spouseProfile.name}`, { bold: true });
    this.drawParagraph(spouseProfile.description.substring(0, 200) + '...', { indent: true });
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
      .text('The 100 Marriage Assessment - Couple Report | Lawrence Adjah', 
        LAYOUT.MARGIN, footerY, {
          width: LAYOUT.CONTENT_WIDTH,
          align: 'center'
        });
  }

  async generateCoupleReport(coupleReport: CoupleAssessmentReport): Promise<Buffer> {
    const primaryDemo = typeof coupleReport.primaryDemographics === 'string' 
      ? JSON.parse(coupleReport.primaryDemographics) 
      : coupleReport.primaryDemographics;
    
    const spouseDemo = typeof coupleReport.spouseDemographics === 'string' 
      ? JSON.parse(coupleReport.spouseDemographics) 
      : coupleReport.spouseDemographics;

    // Header
    this.drawHeader(
      'The 100 Marriage Assessment - Couple Report',
      `${primaryDemo.firstName} & ${spouseDemo.firstName}`
    );
    
    // Add completion date
    const completionDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    this.doc.fontSize(12)
      .fill(COLORS.TEXT)
      .text(`Completed on ${completionDate}`, LAYOUT.MARGIN, this.currentY, {
        width: LAYOUT.CONTENT_WIDTH,
        align: 'center'
      });
    
    this.currentY += 40;

    // Compatibility Score
    this.drawCompatibilityScore(coupleReport.compatibilityScore);

    // Side-by-side scores
    this.drawSideBySideScores(coupleReport.primaryAssessment, coupleReport.spouseAssessment);

    // Compatibility analysis
    this.drawCompatibilityAnalysis(coupleReport.differenceAnalysis);

    // Couple profiles
    this.drawCoupleProfiles(coupleReport.primaryAssessment, coupleReport.spouseAssessment);

    // Next steps for couples
    this.checkPageBreak(150);
    this.drawSectionHeader('Next Steps for Your Relationship');
    
    this.drawParagraph(
      'Congratulations on completing this assessment together! Use these results as a foundation for meaningful conversations about your relationship goals and values.'
    );
    
    this.drawParagraph(
      'We recommend scheduling regular discussions about your results and considering couples consultation for deeper guidance:'
    );
    
    this.drawParagraph(
      'https://lawrence-adjah.clientsecure.me/request/service',
      { bold: true }
    );

    // Draw footer for couple section
    this.drawFooter();

    // BONUS: Append individual reports
    this.doc.addPage();
    this.currentY = LAYOUT.MARGIN;
    
    // Add primary person's individual report
    const individualGenerator = new EnhancedIndividualPDFGenerator();
    const primaryIndividualBuffer = await individualGenerator.generateIndividualReport(coupleReport.primaryAssessment);
    
    // Note: In a real implementation, you would merge the PDF buffers here
    // For now, we'll add a placeholder page indicating where the individual report would go
    this.drawHeader('Individual Report', `${primaryDemo.firstName}'s Personal Assessment`);
    this.drawParagraph(
      'Your individual assessment report follows on the next pages, providing detailed insights into your personal perspectives on marriage and relationships.'
    );

    return new Promise((resolve) => {
      const chunks: Buffer[] = [];
      this.doc.on('data', chunks.push.bind(chunks));
      this.doc.on('end', () => resolve(Buffer.concat(chunks)));
      this.doc.end();
    });
  }
}

// Export function for easy use
export async function generateEnhancedCoupleAssessmentPDF(coupleReport: CoupleAssessmentReport): Promise<Buffer> {
  const generator = new EnhancedCouplePDFGenerator();
  return await generator.generateCoupleReport(coupleReport);
}