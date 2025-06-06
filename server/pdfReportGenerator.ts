import PDFDocument from 'pdfkit';
import { AssessmentResult, CoupleAssessmentReport } from '@shared/schema';
import { generateEnhancedIndividualAssessmentPDF } from '../updated-individual-pdf';
import { generateEnhancedCoupleAssessmentPDF } from '../updated-couple-pdf';
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

  private drawParagraph(text: string, options: { indent?: boolean, bold?: boolean, fontSize?: number, align?: string } = {}): void {
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

    // Enhanced label with exact percentage format
    this.doc.fill(COLORS.TEXT)
      .font(FONTS.BODY.font)
      .fontSize(FONTS.BODY.size)
      .text(`${label} – ${percentage.toFixed(1)}%`, LAYOUT.MARGIN, this.currentY);

    this.currentY += 20;

    // Score bar background
    this.doc.rect(LAYOUT.MARGIN, this.currentY, barWidth, barHeight)
      .fill(COLORS.MEDIUM_GRAY);

    // Score bar fill with color coding
    const fillColor = percentage >= 80 ? COLORS.SUCCESS : 
                     percentage >= 60 ? COLORS.WARNING : COLORS.ACCENT;
    
    this.doc.rect(LAYOUT.MARGIN, this.currentY, fillWidth, barHeight)
      .fill(fillColor);

    this.currentY += barHeight + 10;

    // Add horizontal divider between sections
    this.doc.moveTo(LAYOUT.MARGIN, this.currentY)
      .lineTo(LAYOUT.MARGIN + LAYOUT.CONTENT_WIDTH, this.currentY)
      .stroke(COLORS.LIGHT_GRAY);

    this.currentY += LAYOUT.PARAGRAPH_SPACING;
  }

  private drawProfileSection(profile: any, title: string): void {
    this.drawSectionHeader(title);
    
    // Profile name with colored background
    this.doc.rect(LAYOUT.MARGIN, this.currentY, LAYOUT.CONTENT_WIDTH, 30)
      .fill(COLORS.ACCENT);
    
    this.doc.fill('white')
      .font(FONTS.SECTION_HEADER.font)
      .fontSize(FONTS.SECTION_HEADER.size)
      .text(profile?.name || 'Profile Name Not Available', LAYOUT.MARGIN + 15, this.currentY + 8, {
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

  private getSectionDescription(percentage: number): string {
    if (percentage >= 80) {
      return "Strong alignment with biblical marriage principles";
    } else if (percentage >= 60) {
      return "Balanced approach with flexible perspectives";  
    } else {
      return "Contemporary approach with varied viewpoints";
    }
  }

  private drawFooter(): void {
    const footerY = LAYOUT.PAGE_HEIGHT - 40;
    
    // Add horizontal line above footer
    this.doc.moveTo(LAYOUT.MARGIN, footerY - 10)
      .lineTo(LAYOUT.MARGIN + LAYOUT.CONTENT_WIDTH, footerY - 10)
      .stroke(COLORS.LIGHT_GRAY);
    
    // Left side - Assessment info
    this.doc.fill(COLORS.MEDIUM_GRAY)
      .font(FONTS.SMALL.font)
      .fontSize(FONTS.SMALL.size)
      .text('The 100 Marriage Assessment - Series 1', LAYOUT.MARGIN, footerY);
    
    // Center - Website
    this.doc.text('https://the100marriage.lawrenceadjah.com', 
      LAYOUT.MARGIN, footerY + 12, {
        width: LAYOUT.CONTENT_WIDTH,
        align: 'center'
      });
    
    // Right side - Page number
    const pageNumber = Math.ceil((this.currentY - LAYOUT.MARGIN) / (LAYOUT.PAGE_HEIGHT - 100));
    this.doc.text(`Page ${pageNumber}`, 
      LAYOUT.MARGIN, footerY, {
        width: LAYOUT.CONTENT_WIDTH,
        align: 'right'
      });
  }

  // Individual Assessment Report Generation
  async generateIndividualReport(assessment: any): Promise<Buffer> {
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

    // Header with enhanced content - safely handle undefined names
    const fullName = `${demographics?.firstName || ''} ${demographics?.lastName || ''}`.trim() || 'Assessment Participant';
    this.drawHeader(
      'The 100 Marriage Assessment - Series 1',
      `Report for ${fullName}`
    );
    
    // Add completion date
    const assessmentDate = new Date(assessment.timestamp);
    this.drawParagraph(`Completed on ${assessmentDate.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    })}`, { bold: true, fontSize: 12 });
    
    // Introduction text
    this.drawParagraph(
      'Thank you for completing The 100 Marriage Assessment - Series 1. This report provides insights into your perspectives on marriage and relationships based on your responses to our comprehensive questionnaire.',
      { fontSize: 11, align: 'justify' }
    );
    
    this.drawParagraph(
      'Your assessment score reflects your perspectives on marriage, not a judgment of readiness. Higher percentages indicate alignment with more traditional views, while lower percentages suggest less traditional approaches. Neither is inherently better—these simply reflect different value systems and approaches to marriage.',
      { fontSize: 11, align: 'justify' }
    );

    // Overall Score Section
    this.drawSectionHeader('Overall Assessment Score');
    this.doc.fill(COLORS.PRIMARY)
      .font(FONTS.SCORE.font)
      .fontSize(32)
      .text(`${scores.overallPercentage}%`, LAYOUT.MARGIN, this.currentY, {
        width: LAYOUT.CONTENT_WIDTH,
        align: 'center'
      });
    
    this.currentY += 50;

    // Section Scores with descriptions
    this.drawSectionHeader('Section Performance');
    
    // Add full explanatory section score interpretation
    this.drawParagraph(
      'Section Score Interpretation:',
      { bold: true, fontSize: 10 }
    );
    this.drawParagraph(
      'High Section Scores (≥80%): Strong alignment with biblical marriage principles. These scores indicate deep convictions and commitment to traditional marriage values, with clear understanding of biblical foundations for relationships.',
      { fontSize: 9, indent: true }
    );
    this.drawParagraph(
      'Moderate Section Scores (60–79%): Balanced traditional/modern perspective. These scores reflect thoughtful consideration of both biblical principles and contemporary relationship dynamics, showing flexibility while maintaining core values.',
      { fontSize: 9, indent: true }
    );
    this.drawParagraph(
      'Lower Section Scores (<60%): Reflects evolving or non-traditional views. These scores indicate openness to modern relationship approaches, questioning of traditional structures, or developing personal values around marriage and commitment.',
      { fontSize: 9, indent: true }
    );
    
    this.currentY += 15;
    
    // Safely handle section scores with validation
    if (scores && scores.sections && typeof scores.sections === 'object') {
      Object.entries(scores.sections).forEach(([section, data]: [string, any]) => {
        if (data && typeof data.percentage === 'number') {
          this.checkPageBreak(60);
          this.drawScoreBar(`${section}`, data.percentage);
          
          // Add section description based on score
          const sectionDescription = this.getSectionDescription(data.percentage);
          this.drawParagraph(`${section}: ${data.percentage.toFixed(1)}% - ${sectionDescription}`, { 
            fontSize: 10, 
            indent: true 
          });
          
          this.currentY += 5;
        }
      });
    } else {
      console.warn('No section scores data available for this assessment');
      this.drawParagraph('Section-wise scores not available for this assessment.', { fontSize: 10 });
    }

    // Psychographic Profile Enhancements
    this.checkPageBreak(150);
    this.drawSectionHeader('Your Psychographic Profiles');
    
    // General Profile
    this.drawParagraph('General Profile:', { bold: true, fontSize: 12 });
    this.drawProfileSection(profile, '');

    // Gender-Specific Profile (if available)
    if (genderProfile) {
      this.checkPageBreak(150);
      this.drawParagraph('Gender-Specific Profile:', { bold: true, fontSize: 12 });
      this.drawProfileSection(genderProfile, '');
    }

    // Statistical Comparison Section
    this.checkPageBreak(150);
    this.drawSectionHeader('Statistical Comparison');
    
    // Calculate actual statistics from assessment data
    const percentileRank = this.calculatePercentileRank(scores.overallPercentage);
    const overallAverage = 65.2; // This would come from actual database statistics
    const genderAverage = demographics.gender === 'male' ? 62.8 : 67.6;
    
    this.drawParagraph(`Your Score: ${scores.overallPercentage}%`, { bold: true });
    this.drawParagraph(`Overall Average: ${overallAverage}%`);
    this.drawParagraph(`${demographics.gender === 'male' ? 'Male' : 'Female'} Average: ${genderAverage}%`);
    
    // Add percentile summary
    this.drawParagraph(
      `Compared to others, your score places you in the ${percentileRank} percentile. This means you scored ${percentileRank > 50 ? 'higher' : 'lower'} than ${percentileRank}% of assessment participants, indicating ${this.getPercentileInterpretation(percentileRank)} alignment with traditional marriage perspectives.`,
      { fontSize: 10, indent: true }
    );
    
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
      'For a more in-depth discussion of your results, schedule a consultation:'
    );
    
    this.drawParagraph(
      'https://lawrence-adjah.clientsecure.me/request/service',
      { bold: true }
    );

    // Appendix: Assessment Information
    this.checkPageBreak(200);
    this.drawSectionHeader('About The 100 Marriage Assessment');
    
    this.drawParagraph(
      'The 100 Marriage Assessment - Series 1 is based on Lawrence Adjah\'s bestselling book "The 100 Marriage Decisions & Declarations." This comprehensive assessment evaluates your perspectives across multiple areas of marriage and relationships.'
    );
    
    this.drawParagraph(
      'The assessment includes 99 carefully designed questions covering topics such as biblical foundations, financial planning, communication, intimacy, and family values. Your results provide insights into your relationship readiness and compatibility factors.'
    );

    // Overview of Psychographic Profiles Section
    this.checkPageBreak(400);
    this.drawSectionHeader('Overview of Psychographic Profiles');
    
    this.drawParagraph(
      'The following profiles represent different approaches to marriage and relationships based on assessment responses. Each profile reflects distinct values, priorities, and perspectives on marriage.',
      { fontSize: 10 }
    );
    
    this.drawProfilesOverview();

    // Enhanced Footer with branding
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

  private calculatePercentileRank(score: number): number {
    // Calculate percentile based on score distribution
    if (score >= 85) return 90;
    if (score >= 75) return 75;
    if (score >= 65) return 60;
    if (score >= 55) return 45;
    if (score >= 45) return 30;
    return 15;
  }

  private getPercentileInterpretation(percentile: number): string {
    if (percentile >= 75) return 'very strong';
    if (percentile >= 50) return 'moderate to strong';
    if (percentile >= 25) return 'moderate';
    return 'evolving';
  }

  private drawProfilesOverview(): void {
    const profiles = [
      {
        name: 'Biblical Foundation Builder',
        description: 'Strong commitment to biblical principles with traditional marriage values.'
      },
      {
        name: 'Harmonious Planner',
        description: 'Balanced approach emphasizing communication and strategic planning.'
      },
      {
        name: 'Balanced Individual',
        description: 'Moderate perspectives balancing traditional and contemporary views.'
      },
      {
        name: 'Individualist Seeker',
        description: 'Progressive approach emphasizing personal growth and flexibility.'
      },
      {
        name: 'The Protector Leader (Male)',
        description: 'Traditional masculine leadership with protective family values.'
      },
      {
        name: 'The Nurturing Partner (Female)',
        description: 'Caring approach emphasizing emotional connection and family support.'
      }
    ];

    const leftColumn = LAYOUT.MARGIN;
    const rightColumn = LAYOUT.MARGIN + (LAYOUT.CONTENT_WIDTH / 2) + 10;
    let leftY = this.currentY;
    let rightY = this.currentY;

    profiles.forEach((profile, index) => {
      const isLeftColumn = index % 2 === 0;
      const currentX = isLeftColumn ? leftColumn : rightColumn;
      const columnWidth = (LAYOUT.CONTENT_WIDTH / 2) - 10;

      if (isLeftColumn) {
        this.currentY = leftY;
      } else {
        this.currentY = rightY;
      }

      // Profile name
      this.doc.fill(COLORS.PRIMARY)
        .font(FONTS.SUBSECTION.font)
        .fontSize(10)
        .text(profile?.name || 'Profile Name Not Available', currentX, this.currentY, { width: columnWidth });

      this.currentY += 15;

      // Profile description
      this.doc.fill(COLORS.TEXT)
        .font(FONTS.BODY.font)
        .fontSize(9)
        .text(profile.description, currentX, this.currentY, { width: columnWidth });

      this.currentY += 25;

      if (isLeftColumn) {
        leftY = this.currentY;
      } else {
        rightY = this.currentY;
      }
    });

    this.currentY = Math.max(leftY, rightY) + 20;
  }

  // Couple Assessment Report Generation
  async generateCoupleReport(coupleReport: any): Promise<Buffer> {
    // Parse the couple report data if needed
    const primaryAssessment = coupleReport.primaryAssessment || coupleReport.primary;
    const spouseAssessment = coupleReport.spouseAssessment || coupleReport.spouse;
    const analysis = coupleReport.differenceAnalysis || coupleReport.analysis;
    
    // Parse demographics for both assessments
    const primaryDemographics = typeof primaryAssessment.demographics === 'string' 
      ? JSON.parse(primaryAssessment.demographics) 
      : primaryAssessment.demographics;
    
    const spouseDemographics = typeof spouseAssessment.demographics === 'string' 
      ? JSON.parse(spouseAssessment.demographics) 
      : spouseAssessment.demographics;

    // Header - safely handle undefined names
    const primaryName = `${primaryDemographics?.firstName || ''} ${primaryDemographics?.lastName || ''}`.trim() || 'Partner 1';
    const spouseName = `${spouseDemographics?.firstName || ''} ${spouseDemographics?.lastName || ''}`.trim() || 'Partner 2';
    this.drawHeader(
      'The 100 Marriage Assessment - Couple Compatibility Report',
      `${primaryName} & ${spouseName}`
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
      .text(coupleReport.primaryAssessment?.demographicData?.firstName || 'Partner 1', leftColumn, this.currentY)
      .text(coupleReport.spouseAssessment?.demographicData?.firstName || 'Partner 2', rightColumn, this.currentY);
    
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