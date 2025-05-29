import PDFDocument from 'pdfkit';
import { AssessmentResult } from '@shared/schema';
import fs from 'fs';
import path from 'path';

// Enhanced Layout Constants for Professional Formatting
const LAYOUT = {
  MARGIN: 50,
  CONTENT_WIDTH: 495,
  PAGE_HEIGHT: 792,
  PAGE_WIDTH: 612,
  SECTION_SPACING: 25,
  PARAGRAPH_SPACING: 12
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
  MEDIUM_GRAY: '#bdc3c7'
};

const FONTS = {
  TITLE: { font: 'Helvetica-Bold', size: 24 },
  SUBTITLE: { font: 'Helvetica-Bold', size: 18 },
  SECTION: { font: 'Helvetica-Bold', size: 16 },
  SUBSECTION: { font: 'Helvetica-Bold', size: 14 },
  BODY: { font: 'Helvetica', size: 11 },
  SMALL: { font: 'Helvetica', size: 9 }
};

export class EnhancedIndividualPDFGenerator {
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
    this.doc.fill(COLORS.PRIMARY)
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
    
    this.doc.fill(COLORS.PRIMARY)
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

  private drawScoreBar(label: string, score: number, maxScore: number = 100): void {
    this.checkPageBreak(60);
    
    // Label
    this.doc.fill(COLORS.TEXT)
      .font(FONTS.BODY.font)
      .fontSize(FONTS.BODY.size)
      .text(`${label}: ${score}%`, LAYOUT.MARGIN, this.currentY);
    
    this.currentY += 20;
    
    // Progress bar background
    this.doc.rect(LAYOUT.MARGIN, this.currentY, LAYOUT.CONTENT_WIDTH * 0.7, 12)
      .fill(COLORS.LIGHT_GRAY);
    
    // Progress bar fill
    const fillWidth = (score / maxScore) * (LAYOUT.CONTENT_WIDTH * 0.7);
    let fillColor = COLORS.DANGER;
    if (score >= 80) fillColor = COLORS.SUCCESS;
    else if (score >= 60) fillColor = COLORS.WARNING;
    
    this.doc.rect(LAYOUT.MARGIN, this.currentY, fillWidth, 12)
      .fill(fillColor);
    
    this.currentY += 25;
  }

  private drawProfileSection(profile: any): void {
    this.checkPageBreak(120);
    
    // Profile name
    this.doc.fill(COLORS.PRIMARY)
      .font(FONTS.SUBSECTION.font)
      .fontSize(FONTS.SUBSECTION.size)
      .text(profile.name, LAYOUT.MARGIN, this.currentY);
    
    this.currentY += 20;
    
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

  private drawAllPsychographicProfiles(): void {
    this.doc.addPage();
    this.currentY = LAYOUT.MARGIN;
    
    this.drawSectionHeader('Appendix: All Psychographic Profiles');
    
    // Sample profiles - in a real implementation, these would come from your data
    const allProfiles = [
      {
        name: "Steadfast Builder",
        description: "You are someone who values stability, security, and building lasting foundations. You approach marriage with a practical mindset and believe in creating solid structures for long-term success."
      },
      {
        name: "Faithful Partner", 
        description: "Your faith is central to your relationship approach. You seek a partner who shares your spiritual values and you prioritize building a marriage centered on biblical principles."
      },
      {
        name: "Balanced Companion",
        description: "You bring balance to relationships, valuing both tradition and modern approaches. You're adaptable and seek harmony between different perspectives in marriage."
      },
      {
        name: "Devoted Leader",
        description: "You naturally take initiative in relationships while remaining committed to your partner's growth. You balance leadership with partnership in your approach to marriage."
      },
      {
        name: "Nurturing Supporter",
        description: "You excel at creating supportive environments and prioritize your partner's emotional well-being. You believe in the power of encouragement and consistent care."
      }
    ];
    
    allProfiles.forEach(profile => {
      this.checkPageBreak(80);
      this.drawParagraph(`${profile.name}:`, { bold: true });
      this.drawParagraph(profile.description, { indent: true });
      this.currentY += 10;
    });
  }

  async generateIndividualReport(assessment: AssessmentResult): Promise<Buffer> {
    // Parse JSON strings if needed
    const demographics = typeof assessment.demographics === 'string' 
      ? JSON.parse(assessment.demographics) 
      : assessment.demographics || assessment.demographicData;
    
    const scores = typeof assessment.scores === 'string' 
      ? JSON.parse(assessment.scores) 
      : assessment.scores;

    const profile = typeof assessment.profile === 'string' 
      ? JSON.parse(assessment.profile) 
      : assessment.profile;

    const genderProfile = assessment.genderProfile && typeof assessment.genderProfile === 'string' 
      ? JSON.parse(assessment.genderProfile) 
      : assessment.genderProfile;

    // Header with enhanced content
    this.drawHeader(
      'The 100 Marriage Assessment - Series 1',
      `Report for ${demographics.firstName} ${demographics.lastName}`
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
    
    this.currentY += 30;
    
    // Introduction text
    this.drawParagraph(
      'Thank you for completing The 100 Marriage Assessment - Series 1. This report provides insights into your perspectives on marriage and relationships based on your responses to our comprehensive questionnaire.'
    );
    
    this.drawParagraph(
      'Your assessment score reflects your perspectives on marriage, not a judgment of readiness. Higher percentages indicate alignment with more traditional views, while lower percentages suggest less traditional approaches. Neither is inherently better—these simply reflect different value systems and approaches to marriage.'
    );

    // Overall Score Section
    this.drawSectionHeader('Overall Assessment Score');
    this.doc.fill(COLORS.PRIMARY)
      .font(FONTS.TITLE.font)
      .fontSize(32)
      .text(`${scores.overallPercentage}%`, LAYOUT.MARGIN, this.currentY, {
        width: LAYOUT.CONTENT_WIDTH,
        align: 'center'
      });
    
    this.currentY += 50;

    // Section Scores with enhanced descriptions
    this.drawSectionHeader('Section Performance');
    
    // Add section score interpretation
    this.drawParagraph('Section Score Interpretation:', { bold: true });
    this.drawParagraph('• High (≥80%): Strong biblical alignment', { indent: true });
    this.drawParagraph('• Moderate (60–79%): Balanced/moderate approach', { indent: true });
    this.drawParagraph('• Lower (<60%): More individualized approach', { indent: true });
    
    this.currentY += 15;
    
    Object.entries(scores.sections).forEach(([section, data]: [string, any]) => {
      this.checkPageBreak(60);
      this.drawScoreBar(`${section}`, data.percentage);
    });

    // Statistical Comparison Section
    this.checkPageBreak(150);
    this.drawSectionHeader('Statistical Comparison');
    
    // Mock comparison data - would be replaced with real statistics
    const overallAverage = 65.2;
    const genderAverage = demographics.gender === 'male' ? 62.8 : 67.6;
    
    this.drawParagraph(`Your Score: ${scores.overallPercentage}%`, { bold: true });
    this.drawParagraph(`Overall Average: ${overallAverage}%`);
    this.drawParagraph(`${demographics.gender === 'male' ? 'Male' : 'Female'} Average: ${genderAverage}%`);

    // Psychographic Profile Enhancements
    this.checkPageBreak(150);
    this.drawSectionHeader('Your Psychographic Profiles');
    
    // General Profile
    this.drawParagraph('General Psychographic Profile:', { bold: true, fontSize: 12 });
    this.drawProfileSection(profile);

    // Gender-Specific Profile (if available)
    if (genderProfile) {
      this.checkPageBreak(150);
      this.drawParagraph('Gender-Specific Profile:', { bold: true, fontSize: 12 });
      this.drawProfileSection(genderProfile);
    }
    
    // Strengths and Improvements
    this.checkPageBreak(200);
    this.drawSectionHeader('Key Insights');
    
    this.drawParagraph('Your Strengths:', { bold: true });
    scores.strengths.forEach((strength: string) => {
      this.drawParagraph(`• ${strength}`, { indent: true });
    });

    this.drawParagraph('Areas for Growth:', { bold: true });
    scores.improvementAreas.forEach((area: string) => {
      this.drawParagraph(`• ${area}`, { indent: true });
    });

    // Next Steps Section
    this.checkPageBreak(150);
    this.drawSectionHeader('Next Steps');
    
    this.drawParagraph(
      'We recommend discussing these results with your significant other or potential spouse to better understand how your perspectives align. The 100 Marriage book can serve as an excellent companion to this assessment.'
    );
    
    this.drawParagraph(
      'For a more in-depth discussion of your results, you can schedule a consultation at:'
    );
    
    this.drawParagraph(
      'https://lawrence-adjah.clientsecure.me/request/service',
      { bold: true }
    );

    // Appendix: All Psychographic Profiles
    this.drawAllPsychographicProfiles();

    // Enhanced Footer with branding
    this.drawFooter();

    return new Promise((resolve) => {
      const chunks: Buffer[] = [];
      this.doc.on('data', chunks.push.bind(chunks));
      this.doc.on('end', () => resolve(Buffer.concat(chunks)));
      this.doc.end();
    });
  }
}

// Export function for easy use
export async function generateEnhancedIndividualAssessmentPDF(assessment: AssessmentResult): Promise<Buffer> {
  const generator = new EnhancedIndividualPDFGenerator();
  return await generator.generateIndividualReport(assessment);
}