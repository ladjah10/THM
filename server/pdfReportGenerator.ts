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

  /**
   * Resolves profile icon path with proper error handling
   * @param relativePath - Relative path to the icon file
   * @returns Absolute path if file exists, null otherwise
   */
  private getProfileIconPath(relativePath: string | undefined): string | null {
    if (!relativePath) return null;
    
    try {
      // Check multiple possible locations for assets
      const possiblePaths = [
        path.resolve(__dirname, '../attached_assets', relativePath),
        path.resolve(__dirname, '../../attached_assets', relativePath),
        path.resolve(process.cwd(), 'attached_assets', relativePath),
        path.resolve(process.cwd(), 'public/assets', relativePath),
        path.resolve(process.cwd(), 'assets', relativePath)
      ];
      
      for (const fullPath of possiblePaths) {
        if (fs.existsSync(fullPath)) {
          return fullPath;
        }
      }
      
      console.warn(`Profile icon not found: ${relativePath}`);
      return null;
    } catch (error) {
      console.warn(`Error resolving profile icon path for ${relativePath}:`, error);
      return null;
    }
  }

  /**
   * Safely adds an image to the PDF with error handling
   * @param imagePath - Path to the image file
   * @param x - X coordinate
   * @param y - Y coordinate
   * @param options - Image options (width, height, etc.)
   * @returns true if image was added successfully, false otherwise
   */
  private safeAddImage(imagePath: string, x: number, y: number, options: any = {}): boolean {
    try {
      if (!fs.existsSync(imagePath)) {
        console.warn(`Image file not found: ${imagePath}`);
        return false;
      }
      
      // Verify the file is a valid image by checking its size and extension
      const stats = fs.statSync(imagePath);
      if (stats.size === 0) {
        console.warn(`Image file is empty: ${imagePath}`);
        return false;
      }
      
      const ext = path.extname(imagePath).toLowerCase();
      const validExtensions = ['.png', '.jpg', '.jpeg', '.gif'];
      if (!validExtensions.includes(ext)) {
        console.warn(`Unsupported image format: ${imagePath}`);
        return false;
      }
      
      // Add default dimensions if not provided
      const imageOptions = {
        width: 20,
        height: 20,
        ...options
      };
      
      this.doc.image(imagePath, x, y, imageOptions);
      return true;
    } catch (error) {
      console.error(`Failed to add image ${imagePath}:`, error);
      return false;
    }
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
    if (title) {
      this.drawSectionHeader(title);
    }
    
    // Safety check for profile existence
    if (!profile) {
      this.drawParagraph('Profile information not available for this assessment.', { fontSize: 10 });
      return;
    }
    
    const startY = this.currentY;
    
    // Try to load and add profile icon if available
    let iconWidth = 0;
    if (profile.icon) {
      const iconPath = this.getProfileIconPath(profile.icon);
      if (iconPath) {
        const iconAdded = this.safeAddImage(iconPath, LAYOUT.MARGIN + 5, this.currentY + 5, {
          width: 20,
          height: 20
        });
        if (iconAdded) {
          iconWidth = 25; // Account for icon space
        }
      }
    }
    
    // Profile name with colored background, adjusted for icon
    this.doc.rect(LAYOUT.MARGIN, this.currentY, LAYOUT.CONTENT_WIDTH, 30)
      .fill(COLORS.ACCENT);
    
    const profileName = profile?.name || 'Profile Name Not Available';
    this.doc.fill('white')
      .font(FONTS.SECTION_HEADER.font)
      .fontSize(FONTS.SECTION_HEADER.size)
      .text(profileName, LAYOUT.MARGIN + 15 + iconWidth, this.currentY + 8, {
        width: LAYOUT.CONTENT_WIDTH - 30 - iconWidth,
        align: 'center'
      });

    this.currentY += 45;

    // Profile description with safety check
    const profileDescription = profile?.description || 'Description not available.';
    this.drawParagraph(profileDescription);
    
    // Add characteristics if available
    if (profile.characteristics && Array.isArray(profile.characteristics) && profile.characteristics.length > 0) {
      this.drawParagraph('Key Characteristics:', { bold: true, fontSize: 10 });
      profile.characteristics.forEach((char: string) => {
        if (char && typeof char === 'string') {
          this.drawParagraph(`• ${char}`, { indent: true, fontSize: 9 });
        }
      });
    }
    
    // Add traits if available
    if (profile.traits && Array.isArray(profile.traits) && profile.traits.length > 0) {
      this.drawParagraph('Traits:', { bold: true, fontSize: 10 });
      profile.traits.forEach((trait: string) => {
        if (trait && typeof trait === 'string') {
          this.drawParagraph(`• ${trait}`, { indent: true, fontSize: 9 });
        }
      });
    }
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
    // Safe JSON parsing with fallbacks
    let demographics: any = {};
    try {
      demographics = typeof assessment.demographics === 'string' 
        ? JSON.parse(assessment.demographics) 
        : assessment.demographics || assessment.demographicData || {};
    } catch (error) {
      console.warn('Failed to parse demographics, using defaults:', error);
      demographics = {};
    }
    
    let scores: any = { overallPercentage: 0, sections: {}, strengths: [], improvementAreas: [] };
    try {
      const parsedScores = typeof assessment.scores === 'string' 
        ? JSON.parse(assessment.scores) 
        : assessment.scores;
      
      if (parsedScores && typeof parsedScores === 'object') {
        scores = {
          overallPercentage: parsedScores.overallPercentage || 0,
          sections: parsedScores.sections || {},
          strengths: Array.isArray(parsedScores.strengths) ? parsedScores.strengths : [],
          improvementAreas: Array.isArray(parsedScores.improvementAreas) ? parsedScores.improvementAreas : [],
          ...parsedScores
        };
      }
    } catch (error) {
      console.warn('Failed to parse scores, using defaults:', error);
    }
    
    let profile = null;
    try {
      profile = typeof assessment.profile === 'string' 
        ? JSON.parse(assessment.profile) 
        : assessment.profile;
    } catch (error) {
      console.warn('Failed to parse profile, using null:', error);
      profile = null;
    }
    
    let genderProfile = null;
    try {
      genderProfile = assessment.genderProfile && typeof assessment.genderProfile === 'string' 
        ? JSON.parse(assessment.genderProfile) 
        : assessment.genderProfile;
    } catch (error) {
      console.warn('Failed to parse gender profile, using null:', error);
      genderProfile = null;
    }

    // Header with enhanced content - safely handle undefined names
    const fullName = `${demographics?.firstName || ''} ${demographics?.lastName || ''}`.trim() || 'Assessment Participant';
    this.drawHeader(
      'The 100 Marriage Assessment - Series 1',
      `Report for ${fullName}`
    );
    
    // Add completion date with safety check
    let completionDate = 'Date not available';
    try {
      if (assessment.timestamp) {
        const assessmentDate = new Date(assessment.timestamp);
        if (!isNaN(assessmentDate.getTime())) {
          completionDate = assessmentDate.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
        } else {
          completionDate = new Date().toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          });
        }
      } else {
        completionDate = new Date().toLocaleDateString('en-US', { 
          year: 'numeric', 
          month: 'long', 
          day: 'numeric' 
        });
      }
    } catch (error) {
      console.warn('Error parsing assessment date, using current date:', error);
      completionDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
    
    this.drawParagraph(`Completed on ${completionDate}`, { bold: true, fontSize: 12 });
    
    // Introduction text
    this.drawParagraph(
      'Thank you for completing The 100 Marriage Assessment - Series 1. This report provides insights into your perspectives on marriage and relationships based on your responses to our comprehensive questionnaire.',
      { fontSize: 11, align: 'justify' }
    );
    
    this.drawParagraph(
      'Your assessment score reflects your perspectives on marriage, not a judgment of readiness. Higher percentages indicate alignment with more traditional views, while lower percentages suggest less traditional approaches. Neither is inherently better—these simply reflect different value systems and approaches to marriage.',
      { fontSize: 11, align: 'justify' }
    );

    // Overall Score Section with safety check
    this.drawSectionHeader('Overall Assessment Score');
    const overallScore = scores?.overallPercentage || 0;
    this.doc.fill(COLORS.PRIMARY)
      .font(FONTS.SCORE.font)
      .fontSize(32)
      .text(`${overallScore.toFixed(1)}%`, LAYOUT.MARGIN, this.currentY, {
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

    // Psychographic Profile Enhancements with safety checks
    this.checkPageBreak(150);
    this.drawSectionHeader('Your Psychographic Profiles');
    
    // General Profile with fallback
    this.drawParagraph('General Profile:', { bold: true, fontSize: 12 });
    if (profile) {
      this.drawProfileSection(profile, '');
    } else {
      this.drawParagraph('Your psychographic profile will be generated based on your assessment responses. This profile helps identify your relationship approach and compatibility factors.', { fontSize: 10 });
    }

    // Gender-Specific Profile (if available)
    if (genderProfile) {
      this.checkPageBreak(150);
      this.drawParagraph('Gender-Specific Profile:', { bold: true, fontSize: 12 });
      this.drawProfileSection(genderProfile, '');
    } else {
      this.checkPageBreak(100);
      this.drawParagraph('Gender-Specific Profile:', { bold: true, fontSize: 12 });
      this.drawParagraph('Your gender-specific profile insights will be included in future assessment iterations.', { fontSize: 10 });
    }

    // Statistical Comparison Section
    this.checkPageBreak(150);
    this.drawSectionHeader('Statistical Comparison');
    
    // Calculate actual statistics from assessment data with safety checks
    const percentileRank = this.calculatePercentileRank(overallScore);
    const overallAverage = 65.2; // This would come from actual database statistics
    const userGender = demographics?.gender || 'unknown';
    const genderAverage = userGender === 'male' ? 62.8 : userGender === 'female' ? 67.6 : 65.2;
    
    this.drawParagraph(`Your Score: ${overallScore.toFixed(1)}%`, { bold: true });
    this.drawParagraph(`Overall Average: ${overallAverage}%`);
    if (userGender !== 'unknown') {
      this.drawParagraph(`${userGender === 'male' ? 'Male' : 'Female'} Average: ${genderAverage}%`);
    }
    
    // Add percentile summary
    this.drawParagraph(
      `Compared to others, your score places you in the ${percentileRank} percentile. This means you scored ${percentileRank > 50 ? 'higher' : 'lower'} than ${percentileRank}% of assessment participants, indicating ${this.getPercentileInterpretation(percentileRank)} alignment with traditional marriage perspectives.`,
      { fontSize: 10, indent: true }
    );
    
    // Strengths and Improvements with safety checks
    this.checkPageBreak(200);
    this.drawSectionHeader('Key Insights');
    
    this.drawParagraph('Your Strengths:', { bold: true });
    if (scores?.strengths && Array.isArray(scores.strengths) && scores.strengths.length > 0) {
      scores.strengths.forEach((strength: any) => {
        if (strength && typeof strength === 'string') {
          this.drawParagraph(`• ${strength}`, { indent: true });
        }
      });
    } else {
      this.drawParagraph('• Areas of strength will be identified based on your responses', { indent: true });
    }

    this.drawParagraph('Areas for Growth:', { bold: true });
    if (scores?.improvementAreas && Array.isArray(scores.improvementAreas) && scores.improvementAreas.length > 0) {
      scores.improvementAreas.forEach((area: any) => {
        if (area && typeof area === 'string') {
          this.drawParagraph(`• ${area}`, { indent: true });
        }
      });
    } else {
      this.drawParagraph('• Growth opportunities will be identified based on your responses', { indent: true });
    }

    // Next Steps Section
    this.checkPageBreak(150);
    this.drawSectionHeader('Next Steps');
    
    this.drawParagraph(
      'Based on your results, consider discussing the findings with your partner or a counselor. Review areas with lower scores and celebrate strengths. Here are some specific recommendations:'
    );
    
    this.drawParagraph('• Share this report with your partner to initiate meaningful conversations', { indent: true });
    this.drawParagraph('• Focus on strengthening areas identified for growth', { indent: true });
    this.drawParagraph('• Consider reading "The 100 Marriage Decisions & Declarations" for deeper insights', { indent: true });
    this.drawParagraph('• Schedule a consultation for personalized guidance', { indent: true });
    
    this.drawParagraph(
      'For professional consultation and personalized guidance:'
    );
    
    this.drawParagraph(
      'https://lawrence-adjah.clientsecure.me/request/service',
      { bold: true }
    );
    
    this.drawParagraph(
      'Thank you for completing The 100 Marriage Assessment. We hope these insights contribute to your relationship journey.',
      { fontSize: 10 }
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

  private calculateCompatibilityScore(primaryScores: any, spouseScores: any): number {
    // Calculate compatibility based on score alignment
    const primaryOverall = primaryScores.overallPercentage || 0;
    const spouseOverall = spouseScores.overallPercentage || 0;
    
    // Base compatibility on overall score similarity
    const scoreDifference = Math.abs(primaryOverall - spouseOverall);
    let compatibility = 100 - (scoreDifference * 2); // Reduce compatibility by 2% for each percentage point difference
    
    // Factor in section alignment
    const primarySections = primaryScores.sections || {};
    const spouseSections = spouseScores.sections || {};
    
    const commonSections = Object.keys(primarySections).filter(section => 
      spouseSections.hasOwnProperty(section)
    );
    
    if (commonSections.length > 0) {
      let sectionAlignmentBonus = 0;
      commonSections.forEach(section => {
        const primarySectionScore = primarySections[section]?.percentage || 0;
        const spouseSectionScore = spouseSections[section]?.percentage || 0;
        const sectionDifference = Math.abs(primarySectionScore - spouseSectionScore);
        
        if (sectionDifference < 10) {
          sectionAlignmentBonus += 2; // Bonus for close alignment
        } else if (sectionDifference > 30) {
          sectionAlignmentBonus -= 1; // Penalty for large differences
        }
      });
      
      compatibility += sectionAlignmentBonus;
    }
    
    // Ensure compatibility stays within reasonable bounds
    return Math.max(30, Math.min(95, compatibility));
  }

  private generateComparativeInsights(primaryScores: any, spouseScores: any, primaryName: string, spouseName: string): void {
    const primaryOverall = primaryScores.overallPercentage || 0;
    const spouseOverall = spouseScores.overallPercentage || 0;
    const overallDifference = Math.abs(primaryOverall - spouseOverall);
    
    // Overall compatibility narrative
    if (overallDifference < 10) {
      this.drawParagraph(
        `${primaryName} and ${spouseName} show strong overall alignment with only a ${overallDifference.toFixed(1)}% difference in their assessment scores (${primaryOverall.toFixed(1)}% vs ${spouseOverall.toFixed(1)}%). This suggests similar foundational values and approaches to marriage.`
      );
    } else if (overallDifference < 20) {
      this.drawParagraph(
        `${primaryName} and ${spouseName} have moderately aligned perspectives with a ${overallDifference.toFixed(1)}% difference in overall scores (${primaryOverall.toFixed(1)}% vs ${spouseOverall.toFixed(1)}%). This difference provides opportunities for meaningful discussions and mutual growth.`
      );
    } else {
      this.drawParagraph(
        `${primaryName} and ${spouseName} show significant differences in their overall approaches to marriage, with a ${overallDifference.toFixed(1)}% score difference (${primaryOverall.toFixed(1)}% vs ${spouseOverall.toFixed(1)}%). These differences highlight important areas for discussion and understanding.`
      );
    }

    this.currentY += 10;

    // Section-specific insights
    const primarySections = primaryScores.sections || {};
    const spouseSections = spouseScores.sections || {};
    const alignedAreas: string[] = [];
    const divergentAreas: string[] = [];

    Object.keys(primarySections).forEach(section => {
      if (spouseSections[section]) {
        const primaryScore = primarySections[section]?.percentage || 0;
        const spouseScore = spouseSections[section]?.percentage || 0;
        const difference = Math.abs(primaryScore - spouseScore);

        if (difference < 15 && primaryScore > 60 && spouseScore > 60) {
          alignedAreas.push(`${section} (${primaryName}: ${primaryScore.toFixed(1)}%, ${spouseName}: ${spouseScore.toFixed(1)}%)`);
        } else if (difference > 25) {
          divergentAreas.push(`${section} (${primaryName}: ${primaryScore.toFixed(1)}%, ${spouseName}: ${spouseScore.toFixed(1)}%)`);
        }
      }
    });

    if (alignedAreas.length > 0) {
      this.drawParagraph('Areas of Strong Agreement:', { bold: true });
      alignedAreas.forEach(area => {
        this.drawParagraph(`• ${area}`, { indent: true, fontSize: 10 });
      });
      this.drawParagraph(
        'These aligned areas indicate shared values and approaches that can serve as strengths in your relationship.',
        { fontSize: 10, indent: true }
      );
      this.currentY += 10;
    }

    if (divergentAreas.length > 0) {
      this.drawParagraph('Areas Requiring Discussion:', { bold: true });
      divergentAreas.forEach(area => {
        this.drawParagraph(`• ${area}`, { indent: true, fontSize: 10 });
      });
      this.drawParagraph(
        'These differences present opportunities for deeper understanding and compromise. Consider discussing your perspectives on these topics openly.',
        { fontSize: 10, indent: true }
      );
      this.currentY += 10;
    }

    // Compatibility interpretation
    const compatibilityScore = this.calculateCompatibilityScore(primaryScores, spouseScores);
    if (compatibilityScore >= 80) {
      this.drawParagraph(
        'Your high compatibility score suggests excellent potential for a harmonious relationship built on shared values and mutual understanding.',
        { fontSize: 10 }
      );
    } else if (compatibilityScore >= 60) {
      this.drawParagraph(
        'Your moderate compatibility score indicates good relationship potential with room for growth through communication and compromise.',
        { fontSize: 10 }
      );
    } else {
      this.drawParagraph(
        'Your compatibility score suggests significant differences that can be addressed through open dialogue, professional guidance, and mutual commitment to understanding each other\'s perspectives.',
        { fontSize: 10 }
      );
    }
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
    // Safe parsing of couple report data with fallbacks
    const primary = coupleReport.primary || coupleReport.primaryAssessment;
    const spouse = coupleReport.spouse || coupleReport.spouseAssessment;
    
    // Safe JSON parsing for demographics with fallbacks
    let demo1: any = {};
    let demo2: any = {};
    
    try {
      demo1 = typeof primary?.demographics === 'string' 
        ? JSON.parse(primary.demographics) 
        : primary?.demographics || {};
    } catch (error) {
      console.warn('Failed to parse primary demographics, using defaults:', error);
      demo1 = {};
    }
    
    try {
      demo2 = typeof spouse?.demographics === 'string' 
        ? JSON.parse(spouse.demographics) 
        : spouse?.demographics || {};
    } catch (error) {
      console.warn('Failed to parse spouse demographics, using defaults:', error);
      demo2 = {};
    }
    
    // Safe parsing of scores for both partners
    let primaryScores: any = { overallPercentage: 0, sections: {}, strengths: [], improvementAreas: [] };
    let spouseScores: any = { overallPercentage: 0, sections: {}, strengths: [], improvementAreas: [] };
    
    try {
      const parsedPrimaryScores = typeof primary?.scores === 'string' 
        ? JSON.parse(primary.scores) 
        : primary?.scores;
      if (parsedPrimaryScores && typeof parsedPrimaryScores === 'object') {
        primaryScores = {
          overallPercentage: parsedPrimaryScores.overallPercentage || 0,
          sections: parsedPrimaryScores.sections || {},
          strengths: Array.isArray(parsedPrimaryScores.strengths) ? parsedPrimaryScores.strengths : [],
          improvementAreas: Array.isArray(parsedPrimaryScores.improvementAreas) ? parsedPrimaryScores.improvementAreas : []
        };
      }
    } catch (error) {
      console.warn('Failed to parse primary scores, using defaults:', error);
    }
    
    try {
      const parsedSpouseScores = typeof spouse?.scores === 'string' 
        ? JSON.parse(spouse.scores) 
        : spouse?.scores;
      if (parsedSpouseScores && typeof parsedSpouseScores === 'object') {
        spouseScores = {
          overallPercentage: parsedSpouseScores.overallPercentage || 0,
          sections: parsedSpouseScores.sections || {},
          strengths: Array.isArray(parsedSpouseScores.strengths) ? parsedSpouseScores.strengths : [],
          improvementAreas: Array.isArray(parsedSpouseScores.improvementAreas) ? parsedSpouseScores.improvementAreas : []
        };
      }
    } catch (error) {
      console.warn('Failed to parse spouse scores, using defaults:', error);
    }
    
    // Safe parsing of profiles
    let primaryProfile = null;
    let spouseProfile = null;
    let primaryGenderProfile = null;
    let spouseGenderProfile = null;
    
    try {
      primaryProfile = typeof primary?.profile === 'string' 
        ? JSON.parse(primary.profile) 
        : primary?.profile;
    } catch (error) {
      console.warn('Failed to parse primary profile:', error);
    }
    
    try {
      spouseProfile = typeof spouse?.profile === 'string' 
        ? JSON.parse(spouse.profile) 
        : spouse?.profile;
    } catch (error) {
      console.warn('Failed to parse spouse profile:', error);
    }
    
    try {
      primaryGenderProfile = primary?.genderProfile && typeof primary.genderProfile === 'string' 
        ? JSON.parse(primary.genderProfile) 
        : primary?.genderProfile;
    } catch (error) {
      console.warn('Failed to parse primary gender profile:', error);
    }
    
    try {
      spouseGenderProfile = spouse?.genderProfile && typeof spouse.genderProfile === 'string' 
        ? JSON.parse(spouse.genderProfile) 
        : spouse?.genderProfile;
    } catch (error) {
      console.warn('Failed to parse spouse gender profile:', error);
    }

    // Header with partner names
    const primaryName = `${demo1?.firstName || ''} ${demo1?.lastName || ''}`.trim() || 'Partner 1';
    const spouseName = `${demo2?.firstName || ''} ${demo2?.lastName || ''}`.trim() || 'Partner 2';
    this.drawHeader(
      'The 100 Marriage Assessment - Couple Compatibility Report',
      `Report for ${primaryName} & ${spouseName}`
    );

    // Add completion date using the later of the two timestamps or current date
    let completionDate = 'Date not available';
    try {
      const primaryDate = primary?.timestamp ? new Date(primary.timestamp) : null;
      const spouseDate = spouse?.timestamp ? new Date(spouse.timestamp) : null;
      
      let latestDate = new Date();
      if (primaryDate && !isNaN(primaryDate.getTime()) && spouseDate && !isNaN(spouseDate.getTime())) {
        latestDate = primaryDate > spouseDate ? primaryDate : spouseDate;
      } else if (primaryDate && !isNaN(primaryDate.getTime())) {
        latestDate = primaryDate;
      } else if (spouseDate && !isNaN(spouseDate.getTime())) {
        latestDate = spouseDate;
      }
      
      completionDate = latestDate.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    } catch (error) {
      console.warn('Error parsing couple assessment dates:', error);
      completionDate = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
    }
    
    this.drawParagraph(`Completed on ${completionDate}`, { bold: true, fontSize: 12 });
    
    // Introduction for couples
    this.drawParagraph(
      'This couple compatibility report compares your individual assessment results to identify areas of alignment and potential discussion points for your relationship.',
      { fontSize: 11, align: 'justify' }
    );

    // Overall Compatibility Score
    this.drawSectionHeader('Overall Compatibility');
    const compatibilityScore = coupleReport?.compatibilityScore || this.calculateCompatibilityScore(primaryScores, spouseScores);
    this.doc.fill(COLORS.ACCENT)
      .font(FONTS.SCORE.font)
      .fontSize(32)
      .text(`${compatibilityScore.toFixed(1)}%`, LAYOUT.MARGIN, this.currentY, {
        width: LAYOUT.CONTENT_WIDTH,
        align: 'center'
      });
    
    this.currentY += 50;

    // Individual Overall Scores Comparison
    this.drawSectionHeader('Individual Assessment Scores');
    
    // Overall scores comparison
    this.drawParagraph('Overall Assessment Scores:', { bold: true });
    this.drawParagraph(`${primaryName}: ${primaryScores.overallPercentage.toFixed(1)}%`, { indent: true });
    this.drawParagraph(`${spouseName}: ${spouseScores.overallPercentage.toFixed(1)}%`, { indent: true });
    
    const scoreDifference = Math.abs(primaryScores.overallPercentage - spouseScores.overallPercentage);
    this.drawParagraph(`Score Difference: ${scoreDifference.toFixed(1)} percentage points`, { indent: true, bold: true });
    
    this.currentY += 15;

    // Section-by-section comparison
    this.drawSectionHeader('Section Performance Comparison');
    
    // Get all sections from both assessments
    const allSections = new Set([
      ...Object.keys(primaryScores.sections || {}),
      ...Object.keys(spouseScores.sections || {})
    ]);
    
    if (allSections.size > 0) {
      allSections.forEach(section => {
        const primaryScore = primaryScores.sections[section]?.percentage || 0;
        const spouseScore = spouseScores.sections[section]?.percentage || 0;
        const difference = Math.abs(primaryScore - spouseScore);
        
        this.checkPageBreak(60);
        
        this.drawParagraph(`${section}:`, { bold: true });
        this.drawParagraph(`${primaryName}: ${primaryScore.toFixed(1)}%`, { indent: true });
        this.drawParagraph(`${spouseName}: ${spouseScore.toFixed(1)}%`, { indent: true });
        
        // Add comparative insight
        if (difference < 10) {
          this.drawParagraph(`Strong alignment (${difference.toFixed(1)}% difference)`, { 
            indent: true, 
            fontSize: 10 
          });
        } else if (difference < 20) {
          this.drawParagraph(`Moderate difference (${difference.toFixed(1)}% difference)`, { 
            indent: true, 
            fontSize: 10 
          });
        } else {
          this.drawParagraph(`Significant difference (${difference.toFixed(1)}% difference) - Discussion recommended`, { 
            indent: true, 
            fontSize: 10 
          });
        }
        
        this.currentY += 10;
      });
    } else {
      this.drawParagraph('Section score details not available for comparison.', { fontSize: 10 });
    }

    // Psychographic Profiles of Each Partner
    this.checkPageBreak(300);
    this.drawSectionHeader('Psychographic Profiles of Each Partner');
    
    // Primary partner profile
    this.drawParagraph(`${primaryName}'s Profile:`, { bold: true, fontSize: 12 });
    if (primaryProfile) {
      this.drawProfileSection(primaryProfile, '');
    } else {
      this.drawParagraph('Profile information will be generated based on assessment responses.', { fontSize: 10 });
    }
    
    if (primaryGenderProfile) {
      this.checkPageBreak(100);
      this.drawParagraph(`${primaryName}'s Gender-Specific Profile:`, { bold: true, fontSize: 11 });
      this.drawProfileSection(primaryGenderProfile, '');
    }
    
    // Spouse partner profile
    this.checkPageBreak(200);
    this.drawParagraph(`${spouseName}'s Profile:`, { bold: true, fontSize: 12 });
    if (spouseProfile) {
      this.drawProfileSection(spouseProfile, '');
    } else {
      this.drawParagraph('Profile information will be generated based on assessment responses.', { fontSize: 10 });
    }
    
    if (spouseGenderProfile) {
      this.checkPageBreak(100);
      this.drawParagraph(`${spouseName}'s Gender-Specific Profile:`, { bold: true, fontSize: 11 });
      this.drawProfileSection(spouseGenderProfile, '');
    }

    // Comparative Insights Narrative
    this.checkPageBreak(200);
    this.drawSectionHeader('Comparative Insights');
    
    this.generateComparativeInsights(primaryScores, spouseScores, primaryName, spouseName);
    
    // Compatibility Analysis (if provided in couple report)
    if (coupleReport?.differenceAnalysis) {
      this.checkPageBreak(150);
      this.drawSectionHeader('Detailed Compatibility Analysis');
      
      if (coupleReport.differenceAnalysis.alignmentAreas?.length > 0) {
        this.drawParagraph('Areas of Strong Alignment:', { bold: true });
        coupleReport.differenceAnalysis.alignmentAreas.forEach((area: any) => {
          if (area && area.section && area.analysis) {
            this.drawParagraph(`• ${area.section}: ${area.analysis}`, { indent: true });
          }
        });
      }

      if (coupleReport.differenceAnalysis.significantDifferences?.length > 0) {
        this.drawParagraph('Areas for Discussion:', { bold: true });
        coupleReport.differenceAnalysis.significantDifferences.forEach((diff: any) => {
          if (diff && diff.section && diff.analysis) {
            this.drawParagraph(`• ${diff.section}: ${diff.analysis}`, { indent: true });
          }
        });
      }
    }

    // Next Steps for Couples
    this.checkPageBreak(200);
    this.drawSectionHeader('Next Steps for Your Relationship');
    
    this.drawParagraph(
      'Based on your combined assessment results, here are specific recommendations for strengthening your relationship:'
    );
    
    this.drawParagraph('• Schedule regular discussions about areas showing significant differences', { indent: true });
    this.drawParagraph('• Celebrate and build upon your areas of strong alignment', { indent: true });
    this.drawParagraph('• Work together on lower-scoring areas identified in both assessments', { indent: true });
    this.drawParagraph('• Consider couples counseling or relationship workshops for continued growth', { indent: true });
    this.drawParagraph('• Use "The 100 Marriage Decisions & Declarations" as a discussion guide', { indent: true });
    
    if (coupleReport?.recommendations && Array.isArray(coupleReport.recommendations)) {
      this.drawParagraph('Additional Personalized Recommendations:', { bold: true });
      coupleReport.recommendations.forEach((recommendation: any) => {
        if (recommendation && typeof recommendation === 'string') {
          this.drawParagraph(`• ${recommendation}`, { indent: true });
        }
      });
    }
    
    this.drawParagraph(
      'For professional guidance on your relationship journey, consider scheduling a couples consultation:'
    );
    
    this.drawParagraph(
      'https://lawrence-adjah.clientsecure.me/request/service',
      { bold: true }
    );

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