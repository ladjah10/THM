import { MailService } from '@sendgrid/mail';
import { AssessmentResult } from '../shared/schema';
import { generateAssessmentPDF } from './pdf-generator';
import { 
  baselineStatistics, 
  getPercentileDescription 
} from '../client/src/utils/statisticsUtils';

// Initialize SendGrid
if (!process.env.SENDGRID_API_KEY) {
  console.warn("SENDGRID_API_KEY environment variable is not set.");
}

const mailService = new MailService();
if (process.env.SENDGRID_API_KEY) {
  mailService.setApiKey(process.env.SENDGRID_API_KEY);
}

interface EmailMessage {
  to: string;
  cc?: string;
  from: string;
  subject: string;
  text?: string;
  html: string;
  attachments?: {
    content: string;
    filename: string;
    type: string;
    disposition: string;
  }[];
}

/**
 * Generates a comparative statistics HTML section for email reporting
 */
function generateComparativeStatsHtml(scores: any, demographics: any): string {
  const genderKey = demographics.gender === 'male' ? 'male' : 'female';
  const genderText = demographics.gender === 'male' ? 'men' : 'women';
  
  // Calculate overall percentile (simulated until we have real stats)
  const overallScore = scores.overallPercentage;
  const { mean, standardDeviation } = baselineStatistics.overall.byGender[genderKey];
  
  // Simplified z-score to percentile calculation
  const zScore = (overallScore - mean) / standardDeviation;
  const percentile = Math.min(99, Math.max(1, Math.round(50 + (zScore * 30))));
  const percentileDesc = getPercentileDescription(percentile);
  
  // Calculate section percentiles
  const sectionPercentiles = Object.entries(scores.sections).map(([sectionName, sectionScore]: [string, any]) => {
    // Map section names to baseline statistic keys
    const statsKey = sectionName.replace(/\s+/g, '').toLowerCase();
    const sectionStats = baselineStatistics.sections[statsKey as keyof typeof baselineStatistics.sections];
    
    if (!sectionStats) return null;
    
    const sectionMean = sectionStats.byGender[genderKey].mean;
    const sectionStdDev = sectionStats.byGender[genderKey].standardDeviation;
    
    // Calculate percentile for this section
    const sectionZScore = (sectionScore.percentage - sectionMean) / sectionStdDev;
    const sectionPercentile = Math.min(99, Math.max(1, Math.round(50 + (sectionZScore * 30))));
    
    return {
      name: sectionName,
      score: sectionScore.percentage,
      mean: sectionMean,
      percentile: sectionPercentile,
      description: getPercentileDescription(sectionPercentile)
    };
  }).filter(Boolean);
  
  // Create the HTML for statistics
  return `
    <div class="section" style="background-color: #f5faff; border-radius: 5px; padding: 20px; margin: 25px 0; border-left: 4px solid #3498db;">
      <h2 style="color: #2980b9; margin-top: 0;">How You Compare to Other ${genderText.charAt(0).toUpperCase() + genderText.slice(1)}</h2>
      <p style="margin-bottom: 20px;">
        Based on responses from other ${genderText} who have taken this assessment, here's how your scores compare.
        <span style="font-weight: bold;">These gender-specific statistics provide insight into how your perspectives align with others of your gender.</span>
      </p>
      
      <div style="margin-bottom: 25px; background-color: white; padding: 15px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.05);">
        <h3 style="color: #34495e; font-size: 18px; margin-bottom: 12px; border-bottom: 1px solid #e0e0e0; padding-bottom: 8px;">
          Overall Score Comparison
        </h3>
        
        <div style="display: flex; align-items: center; margin-bottom: 15px;">
          <div style="flex: 1; margin-right: 20px;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-weight: bold; font-size: 16px;">Your Score: ${overallScore.toFixed(1)}%</span>
              <span style="color: #7f8c8d; font-size: 16px;">Average for ${genderText}: ${mean.toFixed(1)}%</span>
            </div>
            
            <div style="position: relative; height: 24px; background-color: #ecf0f1; border-radius: 12px; overflow: hidden; margin-bottom: 10px;">
              <div style="position: absolute; height: 100%; width: ${percentile}%; background: linear-gradient(to right, #3498db, #2980b9); border-radius: 12px;"></div>
              <div style="position: absolute; width: 100%; height: 100%; display: flex; align-items: center; justify-content: center; color: white; font-weight: bold; text-shadow: 0px 1px 2px rgba(0,0,0,0.2);">
                ${percentileDesc}
              </div>
            </div>
          </div>
          
          <div style="min-width: 120px; text-align: center; background-color: ${percentile > 75 ? '#daf1ff' : percentile > 40 ? '#e8f4f8' : '#f2f7fa'}; padding: 10px; border-radius: 8px;">
            <span style="font-size: 22px; font-weight: bold; color: #2980b9;">${percentile}%</span>
            <div style="font-size: 12px; color: #555; margin-top: 4px;">Percentile Rank<br>among ${genderText}</div>
          </div>
        </div>
        
        <p style="font-size: 14px; color: #4a5568; margin: 8px 0 0; line-height: 1.5;">
          Your overall score of <b>${overallScore.toFixed(1)}%</b> is <b>${percentile > 60 ? 'significantly higher than' : percentile > 50 ? 'higher than' : percentile > 40 ? 'close to' : percentile > 25 ? 'lower than' : 'significantly lower than'}</b> 
          the average of <b>${mean.toFixed(1)}%</b> for ${genderText} respondents. This places you in the <b>${percentile}th percentile</b>.
        </p>
      </div>
      
      <h3 style="color: #34495e; font-size: 18px; margin: 15px 0; border-bottom: 1px solid #e0e0e0; padding-bottom: 8px;">
        Section Comparisons (${genderText.charAt(0).toUpperCase() + genderText.slice(1)}-specific)
      </h3>
      
      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
        ${sectionPercentiles.map((section: any) => {
          const scoreComparison = section.score > section.mean ? 'higher' : 'lower';
          const scoreDiff = Math.abs(section.score - section.mean).toFixed(1);
          return `
          <div style="background-color: white; padding: 15px; border-radius: 8px; border: 1px solid #e0e0e0;">
            <div style="display: flex; justify-content: space-between; margin-bottom: 8px;">
              <span style="font-weight: bold; color: #2d3748; font-size: 15px;">${section.name}</span>
              <div>
                <span style="color: #3182ce; font-weight: bold;">${section.score.toFixed(1)}%</span>
                <span style="color: #718096; font-size: 12px; margin-left: 4px;">(${section.percentile}th percentile)</span>
              </div>
            </div>
            
            <div style="position: relative; height: 10px; background-color: #edf2f7; border-radius: 5px; overflow: hidden; margin-bottom: 10px;">
              <div style="position: absolute; height: 100%; width: ${section.percentile}%; background-color: #3182ce; border-radius: 5px;"></div>
            </div>
            
            <div style="display: flex; justify-content: space-between; margin-bottom: 5px; font-size: 12px;">
              <span style="color: #718096;">0%</span>
              <span style="color: #718096; font-weight: 500;">${genderText.charAt(0).toUpperCase() + genderText.slice(1)} average: ${section.mean.toFixed(1)}%</span>
              <span style="color: #718096;">100%</span>
            </div>
            
            <p style="font-size: 13px; color: #4a5568; margin: 8px 0 0;">
              <span style="font-weight: 500;">${section.description}:</span> 
              ${scoreDiff}% ${scoreComparison} than the average ${genderText} respondent
            </p>
          </div>
        `}).join('')}
      </div>
      
      <div style="background-color: #edf8ff; padding: 15px; border-radius: 8px; margin-top: 20px; border: 1px solid #bee3f8;">
        <h4 style="margin-top: 0; color: #2c5282; font-size: 16px; margin-bottom: 8px;">Understanding These Gender-Specific Comparisons</h4>
        <p style="margin-bottom: 0; color: #2d3748; line-height: 1.5;">
          <span style="font-weight: bold;">These statistics compare your results specifically with other ${genderText}.</span> 
          Higher or lower scores indicate different approaches to marriage, not better or worse ones.
          The most important consideration is how your assessment compares with your spouse or
          future spouse, as closer percentages typically indicate better alignment in expectations.
        </p>
      </div>
    </div>
  `;
}

/**
 * Formats assessment data into a nice HTML email
 */
function formatAssessmentEmail(assessment: AssessmentResult): string {
  const { name, scores, profile, genderProfile, demographics } = assessment;
  
  // Format sections scores
  const sectionsHtml = Object.entries(scores.sections)
    .map(([section, score]) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${section}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${score.earned}/${score.possible}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${score.percentage.toFixed(1)}%</td>
      </tr>
    `).join('');

  // URL for the profile icon
  const baseUrl = 'https://100marriage-assessment.replit.app';
  const primaryIconUrl = profile.iconPath ? `${baseUrl}${profile.iconPath}` : '';
  const genderIconUrl = genderProfile?.iconPath ? `${baseUrl}${genderProfile.iconPath}` : '';

  // Create profile HTML with icon if available
  const primaryProfileHtml = primaryIconUrl ? `
    <div class="profile-box" style="display: flex; align-items: flex-start;">
      <div style="margin-right: 15px; flex-shrink: 0;">
        <img src="${primaryIconUrl}" alt="${profile.name}" style="width: 80px; height: 80px; border-radius: 50%; border: 2px solid #3498db; object-fit: cover;" />
      </div>
      <div>
        <h3 style="margin-top: 0; color: #3498db;">${profile.name} (General Profile)</h3>
        <p>${profile.description}</p>
      </div>
    </div>
  ` : `
    <div class="profile-box">
      <h3 style="margin-top: 0; color: #3498db;">${profile.name} (General Profile)</h3>
      <p>${profile.description}</p>
    </div>
  `;

  // Create gender profile HTML with icon if available
  const genderProfileHtml = genderProfile ? (
    genderIconUrl ? `
      <div class="profile-box" style="display: flex; align-items: flex-start; background-color: #f8f4fa; border-left: 4px solid #8e44ad;">
        <div style="margin-right: 15px; flex-shrink: 0;">
          <img src="${genderIconUrl}" alt="${genderProfile.name}" style="width: 80px; height: 80px; border-radius: 50%; border: 2px solid #8e44ad; object-fit: cover;" />
        </div>
        <div>
          <h3 style="margin-top: 0; color: #8e44ad;">${genderProfile.name} (${demographics.gender === 'male' ? 'Male' : 'Female'}-Specific Profile)</h3>
          <p>${genderProfile.description}</p>
        </div>
      </div>
    ` : `
      <div class="profile-box" style="background-color: #f8f4fa; border-left: 4px solid #8e44ad;">
        <h3 style="margin-top: 0; color: #8e44ad;">${genderProfile.name} (${demographics.gender === 'male' ? 'Male' : 'Female'}-Specific Profile)</h3>
        <p>${genderProfile.description}</p>
      </div>
    `
  ) : '';

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>100 Marriage Assessment Results</title>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 25px; }
        h1 { color: #2c3e50; }
        h2 { color: #3498db; margin-top: 20px; }
        .profile-box { background-color: #f8f9fa; border-left: 4px solid #3498db; padding: 15px; margin: 15px 0; }
        .scores-table { width: 100%; border-collapse: collapse; margin: 15px 0; }
        .scores-table th { background-color: #3498db; color: white; text-align: left; padding: 10px; }
        .scores-table td, .scores-table th { border: 1px solid #ddd; padding: 8px; }
        .overall-score { font-size: 24px; font-weight: bold; color: #2c3e50; }
        .footer { margin-top: 30px; text-align: center; font-size: 12px; color: #7f8c8d; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>100 Marriage Assessment Results</h1>
        </div>
        
        <div class="section">
          <p>Dear ${demographics.firstName},</p>
          <p>Thank you for completing the 100 Marriage Assessment. Below are your detailed results. We've also attached a beautifully designed PDF report of your results that you can download, print, or share.</p>
        </div>
        
        <div class="section">
          <h2>Your Overall Assessment Score</h2>
          <p class="overall-score">${scores.overallPercentage.toFixed(1)}%</p>
          <p>Total Score: ${scores.totalEarned}/${scores.totalPossible}</p>
          <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin-top: 10px; font-size: 14px; color: #555;">
            <strong>Understanding Your Score:</strong> Your score reflects your perspectives on marriage, not a judgment of readiness.
            Higher percentages indicate more traditional viewpoints on relationships, while lower percentages suggest less traditional approaches.
            Neither is inherently better—these are simply different approaches to relationship, and your scores help identify your psychographic profile.
          </div>
        </div>
        
        <div class="section">
          <h2>Your Detailed Scores</h2>
          <p style="margin-bottom: 15px; color: #555;">
            These scores show your responses to questions in each area. Each section reveals different aspects of your 
            relationship approach. Together, they form the basis for your psychographic profile assessment.
          </p>
          <table class="scores-table">
            <thead>
              <tr>
                <th>Section</th>
                <th>Score</th>
                <th>Percentage</th>
              </tr>
            </thead>
            <tbody>
              ${sectionsHtml}
            </tbody>
          </table>
        </div>
        
        ${generateComparativeStatsHtml(scores, demographics)}
        
        <div class="section">
          <h2>Your Psychographic Profiles</h2>
          ${primaryProfileHtml}
          ${genderProfileHtml}
        </div>
        
        <div class="section">
          <h2>Your Compatibility Profile</h2>
          <p>Based on your psychographic profile, we've identified the types of people you'd likely be most compatible with. 
             Closer alignment in expectations suggests better compatibility, but isn't mandatory for a successful relationship.</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 15px 0; font-size: 14px;">
            <thead>
              <tr>
                <th style="padding: 10px; background-color: #f2f2f2; border: 1px solid #ddd; text-align: left; width: 30%;">Compatibility Type</th>
                <th style="padding: 10px; background-color: #f2f2f2; border: 1px solid #ddd; text-align: left; width: 30%;">Ideal Match</th>
                <th style="padding: 10px; background-color: #f2f2f2; border: 1px solid #ddd; text-align: left; width: 40%;">Next-Best Matches</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">Unisex Profile Match</td>
                <td style="padding: 10px; border: 1px solid #ddd; color: #3498db;">${profile.name}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">
                  ${profile.name === "Steadfast Believers" ? "Harmonious Planners, Balanced Visionaries" : ""}
                  ${profile.name === "Harmonious Planners" ? "Steadfast Believers, Balanced Visionaries" : ""}
                  ${profile.name === "Flexible Faithful" ? "Balanced Visionaries, Pragmatic Partners" : ""}
                  ${profile.name === "Pragmatic Partners" ? "Flexible Faithful, Individualist Seekers" : ""}
                  ${profile.name === "Individualist Seekers" ? "Pragmatic Partners, Flexible Faithful" : ""}
                  ${profile.name === "Balanced Visionaries" ? "Harmonious Planners, Flexible Faithful" : ""}
                </td>
              </tr>
              ${genderProfile ? `
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-weight: bold;">${demographics.gender === 'female' ? 'Female' : 'Male'}-Specific Match</td>
                <td style="padding: 10px; border: 1px solid #ddd; color: #8e44ad;">
                  ${demographics.gender === 'female' && genderProfile.name === "Relational Nurturers" ? "Faithful Protectors" : ""}
                  ${demographics.gender === 'female' && genderProfile.name === "Adaptive Communicators" ? "Structured Leaders" : ""}
                  ${demographics.gender === 'female' && genderProfile.name === "Independent Traditionalists" ? "Balanced Providers" : ""}
                  ${demographics.gender === 'female' && genderProfile.name === "Faith-Centered Homemakers" ? "Faithful Protectors" : ""}
                  ${demographics.gender === 'male' && genderProfile.name === "Faithful Protectors" ? "Faith-Centered Homemakers" : ""}
                  ${demographics.gender === 'male' && genderProfile.name === "Structured Leaders" ? "Adaptive Communicators" : ""}
                  ${demographics.gender === 'male' && genderProfile.name === "Balanced Providers" ? "Independent Traditionalists" : ""}
                </td>
                <td style="padding: 10px; border: 1px solid #ddd;">
                  ${demographics.gender === 'female' && genderProfile.name === "Relational Nurturers" ? "Balanced Providers, Structured Leaders" : ""}
                  ${demographics.gender === 'female' && genderProfile.name === "Adaptive Communicators" ? "Faithful Protectors, Balanced Providers" : ""}
                  ${demographics.gender === 'female' && genderProfile.name === "Independent Traditionalists" ? "Faithful Protectors, Structured Leaders" : ""}
                  ${demographics.gender === 'female' && genderProfile.name === "Faith-Centered Homemakers" ? "Balanced Providers, Structured Leaders" : ""}
                  ${demographics.gender === 'male' && genderProfile.name === "Faithful Protectors" ? "Relational Nurturers, Independent Traditionalists" : ""}
                  ${demographics.gender === 'male' && genderProfile.name === "Structured Leaders" ? "Relational Nurturers, Faith-Centered Homemakers" : ""}
                  ${demographics.gender === 'male' && genderProfile.name === "Balanced Providers" ? "Faith-Centered Homemakers, Relational Nurturers" : ""}
                </td>
              </tr>
              ` : ``}
            </tbody>
          </table>
          
          <div style="background-color: #f4f9ff; padding: 15px; border-left: 4px solid #3498db; margin-top: 15px;">
            <h3 style="margin-top: 0; color: #2980b9; font-size: 16px;">Implications for Your Relationships</h3>
            <p>
              ${profile.name === "Steadfast Believers" ? 
                "Your strong faith and traditional values mean you'll thrive with someone who shares your spiritual commitment and family focus. Expectation alignment is highest with other Steadfast Believers, but Harmonious Planners and Balanced Visionaries can also complement your values if faith is openly discussed." : ""}
              ${profile.name === "Harmonious Planners" ? 
                "You value structure and faith, so you'll connect best with partners who share your planning mindset. Harmonious Planners are your ideal match, while Steadfast Believers and Balanced Visionaries offer similar alignment with slight variations in emphasis." : ""}
              ${profile.name === "Flexible Faithful" ? 
                "Your balance of faith and adaptability makes you a versatile partner. Flexible Faithful matches align best, but Balanced Visionaries and Pragmatic Partners can complement your communication focus with mutual respect." : ""}
              ${profile.name === "Pragmatic Partners" ? 
                "You prioritize practicality and communication, so you'll thrive with partners who value fairness. Pragmatic Partners are ideal, while Flexible Faithful and Individualist Seekers can align on practicality with less faith intensity." : ""}
              ${profile.name === "Individualist Seekers" ? 
                "Your focus on independence means you'll connect with partners who respect autonomy. Individualist Seekers are your best match, while Pragmatic Partners and Flexible Faithful can offer complementary practicality and adaptability." : ""}
              ${profile.name === "Balanced Visionaries" ? 
                "Your balanced approach to faith and practicality pairs well with similar mindsets. Balanced Visionaries are ideal, while Harmonious Planners and Flexible Faithful share your values with slight variations." : ""}
            </p>
            
            ${genderProfile ? `
            <p style="margin-top: 10px; color: #8e44ad; font-weight: bold;">
              ${demographics.gender === 'female' && genderProfile.name === "Relational Nurturers" ? 
                "As a Relational Nurturer:" : ""}
              ${demographics.gender === 'female' && genderProfile.name === "Adaptive Communicators" ? 
                "As an Adaptive Communicator:" : ""}
              ${demographics.gender === 'female' && genderProfile.name === "Independent Traditionalists" ? 
                "As an Independent Traditionalist:" : ""}
              ${demographics.gender === 'female' && genderProfile.name === "Faith-Centered Homemakers" ? 
                "As a Faith-Centered Homemaker:" : ""}
              ${demographics.gender === 'male' && genderProfile.name === "Faithful Protectors" ? 
                "As a Faithful Protector:" : ""}
              ${demographics.gender === 'male' && genderProfile.name === "Structured Leaders" ? 
                "As a Structured Leader:" : ""}
              ${demographics.gender === 'male' && genderProfile.name === "Balanced Providers" ? 
                "As a Balanced Provider:" : ""}
            </p>
            <p style="color: #333;">
              ${demographics.gender === 'female' && genderProfile.name === "Relational Nurturers" ? 
                "Your nurturing nature thrives with a partner who values family and faith. A Faithful Protector's leadership aligns best, while Balanced Providers and Structured Leaders offer stability and structure to support your family focus." : ""}
              ${demographics.gender === 'female' && genderProfile.name === "Adaptive Communicators" ? 
                "Your communication skills pair well with a partner who values clarity. Structured Leaders are ideal, while Faithful Protectors and Balanced Providers complement your faith and balance." : ""}
              ${demographics.gender === 'female' && genderProfile.name === "Independent Traditionalists" ? 
                "Your blend of tradition and independence matches with a stable partner. Balanced Providers align best, while Faithful Protectors and Structured Leaders share your traditional values." : ""}
              ${demographics.gender === 'female' && genderProfile.name === "Faith-Centered Homemakers" ? 
                "Your spiritual home focus thrives with a faith-driven partner. Faithful Protectors are ideal, while Balanced Providers and Structured Leaders support your family values." : ""}
              ${demographics.gender === 'male' && genderProfile.name === "Faithful Protectors" ? 
                "Your leadership and faith pair well with a spiritually focused partner. Faith-Centered Homemakers align best, while Relational Nurturers and Independent Traditionalists share your family and traditional values." : ""}
              ${demographics.gender === 'male' && genderProfile.name === "Structured Leaders" ? 
                "Your clarity and structure match with a communicative partner. Adaptive Communicators are ideal, while Relational Nurturers and Faith-Centered Homemakers complement your family focus." : ""}
              ${demographics.gender === 'male' && genderProfile.name === "Balanced Providers" ? 
                "Your stability and balance pair well with an independent partner. Independent Traditionalists align best, while Faith-Centered Homemakers and Relational Nurturers support your faith and family priorities." : ""}
            </p>
            ` : ``}
          </div>
        </div>
        
        <div class="section" style="background-color: #edf7ff; padding: 20px; border-radius: 5px; border-left: 4px solid #3498db; margin-top: 25px;">
          <h2 style="margin-top: 0; color: #2980b9;">Get Personalized Guidance</h2>
          <p>Would you like expert help interpreting your results? Schedule a one-on-one consultation with Lawrence E. Adjah to discuss your assessment in detail and get personalized insights about your relationship expectations.</p>
          <div style="text-align: center; margin-top: 15px;">
            <a href="https://lawrence-adjah.clientsecure.me/request/service" style="display: inline-block; background-color: #3498db; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold;">Book Your Consultation Now</a>
          </div>
        </div>
        
        <div class="footer">
          <p>(c) 2025 Lawrence E. Adjah - The 100 Marriage Assessment</p>
          <p>This assessment is designed to help you understand your readiness for marriage and identify areas for growth.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * Sends an assessment report email with PDF attachment
 */
export async function sendAssessmentEmail(assessment: AssessmentResult, ccEmail: string = "la@lawrenceadjah.com"): Promise<boolean> {
  try {
    if (!process.env.SENDGRID_API_KEY) {
      console.error('Missing SendGrid API key');
      return false;
    }

    // Format the email HTML content
    const emailHtml = formatAssessmentEmail(assessment);
    
    // Generate PDF report
    console.log('Generating PDF report...');
    const pdfBuffer = await generateAssessmentPDF(assessment);
    
    // Create the email message
    const message: EmailMessage = {
      to: assessment.email,
      from: 'hello@wgodw.com', // This should be a verified sender in SendGrid
      subject: `${assessment.name} - 100 Marriage Assessment Results`,
      html: emailHtml,
      cc: ccEmail, // Always CC the administrator by default
      attachments: [
        {
          content: pdfBuffer.toString('base64'),
          filename: `100Marriage-Assessment-Report.pdf`,
          type: 'application/pdf',
          disposition: 'attachment'
        }
      ]
    };
    
    // Send the email with attachment
    await mailService.send(message);
    console.log(`Email with PDF attachment sent to ${assessment.email} with CC to ${ccEmail}`);
    
    return true;
  } catch (error) {
    console.error('SendGrid email error:', error);
    return false;
  }
}