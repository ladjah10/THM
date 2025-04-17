import fs from 'fs';
import path from 'path';
import { AssessmentResult } from './shared/schema';
import { generateAssessmentPDF } from './server/pdf-generator';
// Import the formatAssessmentEmail function
function formatAssessmentEmail(assessment: AssessmentResult): string {
  const { name, scores, profile, demographics } = assessment;
  
  // Format sections scores
  const sectionsHtml = Object.entries(scores.sections)
    .map(([section, score]) => `
      <tr>
        <td style="padding: 8px; border: 1px solid #ddd;">${section}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${score.earned}/${score.possible}</td>
        <td style="padding: 8px; border: 1px solid #ddd;">${Math.round(score.percentage)}%</td>
      </tr>
    `).join('');

  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>The 100 Marriage Assessment - Series 1 Results</title>
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
          <h1>The 100 Marriage Assessment - Series 1 Results</h1>
        </div>
        
        <div class="section">
          <p>Dear ${demographics.firstName},</p>
          <p>Thank you for completing The 100 Marriage Assessment - Series 1. Below are your detailed results. We've also attached a beautifully designed PDF report of your results that you can download, print, or share.</p>
        </div>
        
        <div class="section">
          <h2>Your Overall Assessment Score</h2>
          <p class="overall-score">${Math.round(scores.overallPercentage)}%</p>
          <p>Total Score: ${scores.overallEarned}/${scores.overallPossible}</p>
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
        
        <div class="section">
          <h2>Your Psychographic Profiles</h2>
          
          <h3 style="color: #3498db;">General Profile: ${profile.name}</h3>
          <div class="profile-box" style="border-left: 4px solid #3498db; padding-left: 15px;">
            <p>${profile.description}</p>
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
          <p>(c) 2025 Lawrence E. Adjah - The 100 Marriage Assessment - Series 1</p>
          <p>This assessment is designed to help you understand your readiness for marriage and identify areas for growth.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}

/**
 * This script generates a realistic individual assessment PDF report and email
 * Uses realistic data to showcase layout and design
 */
async function generateRealisticIndividualAssessment() {
  console.log('Generating realistic individual assessment report...');

  // Sample individual assessment with realistic data
  const realisticAssessment: AssessmentResult = {
    email: 'john.smith@example.com',
    name: 'John Smith',
    timestamp: new Date().toISOString(),
    demographics: {
      firstName: 'John',
      lastName: 'Smith',
      email: 'john.smith@example.com',
      phone: '212-555-1234',
      gender: 'Male',
      ethnicity: 'White, Caucasian',
      marriageStatus: 'Single',
      desireChildren: 'Yes',
      hasPaid: true,
      coupleId: null,
      coupleRole: null
    },
    profile: {
      id: 2,
      name: 'Balanced Visionary',
      description: 'You have a thoughtful, balanced approach to marriage. You value both tradition and modern perspectives, seeking harmony between stability and flexibility. Your responses show a well-rounded understanding of marriage dynamics with a natural ability to adapt while maintaining core values.',
      genderSpecific: false,
      criteria: [
        { section: 'Spiritual Beliefs', min: 70 },
        { section: 'Family Planning', min: 65 },
        { section: 'Role Expectations', min: 65 }
      ]
    },
    genderSpecificProfile: {
      id: 8,
      name: 'Intentional Traditionalist',
      description: 'As a male with intentional traditional values, you place high emphasis on family leadership roles and clear expectations in a marriage. You value stability, structure and clearly defined responsibilities, preferring established gender roles while still respecting your partner\'s opinions and growth.',
      genderSpecific: true,
      criteria: [
        { section: 'Role Expectations', min: 75 },
        { section: 'Family Planning', min: 70 },
        { section: 'Spiritual Beliefs', min: 70 }
      ]
    },
    responses: {
      '1': { option: 'StronglyAgree', value: 32 },
      '2': { option: 'Agree', value: 4 },
      '3': { option: 'StronglyAgree', value: 5 },
      '4': { option: 'Agree', value: 4 },
      '5': { option: 'StronglyAgree', value: 5 },
      '6': { option: 'Neutral', value: 3 },
      '7': { option: 'StronglyAgree', value: 5 },
      '8': { option: 'Disagree', value: 2 },
      '9': { option: 'Agree', value: 4 },
      '10': { option: 'StronglyAgree', value: 5 },
      '11': { option: 'Disagree', value: 2 },
      '12': { option: 'Agree', value: 4 },
      '13': { option: 'StronglyAgree', value: 5 },
      '14': { option: 'Agree', value: 4 },
      '15': { option: 'Neutral', value: 3 },
      '16': { option: 'StronglyAgree', value: 5 },
      '17': { option: 'StronglyAgree', value: 5 },
      '18': { option: 'Agree', value: 4 },
      '19': { option: 'StronglyAgree', value: 5 },
      '20': { option: 'Neutral', value: 3 },
      '21': { option: 'Agree', value: 4 },
      '22': { option: 'StronglyAgree', value: 5 },
      '23': { option: 'Agree', value: 4 },
      '24': { option: 'Disagree', value: 2 },
      '25': { option: 'StronglyAgree', value: 5 },
      '26': { option: 'Agree', value: 4 },
      '27': { option: 'StronglyAgree', value: 5 },
      '28': { option: 'Agree', value: 4 },
      '29': { option: 'Neutral', value: 3 },
      '30': { option: 'StronglyAgree', value: 5 },
      '31': { option: 'Agree', value: 4 },
      '32': { option: 'StronglyAgree', value: 5 },
      '33': { option: 'Neutral', value: 3 },
      '34': { option: 'Agree', value: 4 },
      '35': { option: 'StronglyAgree', value: 5 },
      '36': { option: 'Agree', value: 4 },
      '37': { option: 'StronglyAgree', value: 5 },
      '38': { option: 'Neutral', value: 3 },
      '39': { option: 'Agree', value: 4 },
      '40': { option: 'StronglyAgree', value: 5 },
      // Continue with all 99 questions...
      '41': { option: 'Agree', value: 4 },
      '42': { option: 'Neutral', value: 3 },
      '43': { option: 'StronglyAgree', value: 5 },
      '44': { option: 'Agree', value: 4 },
      '45': { option: 'Neutral', value: 3 },
      '46': { option: 'StronglyAgree', value: 5 },
      '47': { option: 'Agree', value: 4 },
      '48': { option: 'StronglyAgree', value: 5 },
      '49': { option: 'Neutral', value: 3 },
      '50': { option: 'Agree', value: 4 },
      '51': { option: 'StronglyAgree', value: 5 },
      '52': { option: 'Agree', value: 4 },
      '53': { option: 'Neutral', value: 3 },
      '54': { option: 'StronglyAgree', value: 5 },
      '55': { option: 'Agree', value: 4 },
      '56': { option: 'StronglyAgree', value: 5 },
      '57': { option: 'Neutral', value: 3 },
      '58': { option: 'Agree', value: 4 },
      '59': { option: 'StronglyAgree', value: 5 },
      '60': { option: 'Agree', value: 4 },
      '61': { option: 'Neutral', value: 3 },
      '62': { option: 'StronglyAgree', value: 5 },
      '63': { option: 'Agree', value: 4 },
      '64': { option: 'StronglyAgree', value: 5 },
      '65': { option: 'Neutral', value: 3 },
      '66': { option: 'Agree', value: 4 },
      '67': { option: 'StronglyAgree', value: 5 },
      '68': { option: 'Agree', value: 4 },
      '69': { option: 'Neutral', value: 3 },
      '70': { option: 'StronglyAgree', value: 5 },
      '71': { option: 'Agree', value: 4 },
      '72': { option: 'StronglyAgree', value: 5 },
      '73': { option: 'Neutral', value: 3 },
      '74': { option: 'Agree', value: 4 },
      '75': { option: 'StronglyAgree', value: 5 },
      '76': { option: 'Agree', value: 4 },
      '77': { option: 'Neutral', value: 3 },
      '78': { option: 'StronglyAgree', value: 5 },
      '79': { option: 'Agree', value: 4 },
      '80': { option: 'StronglyAgree', value: 5 },
      '81': { option: 'Neutral', value: 3 },
      '82': { option: 'Agree', value: 4 },
      '83': { option: 'StronglyAgree', value: 5 },
      '84': { option: 'Agree', value: 4 },
      '85': { option: 'Neutral', value: 3 },
      '86': { option: 'StronglyAgree', value: 5 },
      '87': { option: 'Agree', value: 4 },
      '88': { option: 'StronglyAgree', value: 5 },
      '89': { option: 'Neutral', value: 3 },
      '90': { option: 'Agree', value: 4 },
      '91': { option: 'StronglyAgree', value: 5 },
      '92': { option: 'Agree', value: 4 },
      '93': { option: 'Neutral', value: 3 },
      '94': { option: 'StronglyAgree', value: 5 },
      '95': { option: 'Agree', value: 4 },
      '96': { option: 'StronglyAgree', value: 5 },
      '97': { option: 'Neutral', value: 3 },
      '98': { option: 'Agree', value: 4 },
      '99': { option: 'StronglyAgree', value: 5 }
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
      overallEarned: 726,
      overallPossible: 900,
      overallPercentage: 80.67
    },
    strengths: ['Spiritual Beliefs', 'Role Expectations', 'Communication'],
    improvements: ['Recreation & Leisure', 'Support Networks', 'Financial Values']
  };

  try {
    // Generate PDF
    const pdfBuffer = await generateAssessmentPDF(realisticAssessment);
    
    // Create directory if it doesn't exist
    const publicDir = path.join(process.cwd(), 'client', 'public');
    
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }
    
    // Save PDF to file
    const pdfPath = path.join(publicDir, 'realistic-individual-assessment.pdf');
    fs.writeFileSync(pdfPath, pdfBuffer);
    console.log(`PDF saved successfully at: ${pdfPath}`);
    console.log('You can now view this PDF in your browser at /realistic-individual-assessment.pdf');
    
    // Generate HTML preview for viewing in browser
    const htmlPath = path.join(publicDir, 'realistic-individual-assessment.html');
    const htmlContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Individual Assessment PDF Viewer</title>
      <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 5px; box-shadow: 0 2px 4px rgba(0,0,0,0.1); }
        h1 { color: #7e22ce; }
        .pdf-container { width: 100%; height: 800px; border: 1px solid #ddd; margin-top: 20px; }
        .instructions { background: #f8f9fa; padding: 15px; border-radius: 5px; margin-bottom: 20px; }
        .email-preview { margin-top: 30px; border-top: 1px solid #ddd; padding-top: 20px; }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Individual Assessment Report</h1>
        
        <div class="instructions">
          <p><strong>View options:</strong></p>
          <ol>
            <li>View embedded PDF below</li>
            <li>Open <a href="/realistic-individual-assessment.pdf" target="_blank">direct PDF link</a> (opens in new tab)</li>
          </ol>
        </div>
        
        <iframe class="pdf-container" src="/realistic-individual-assessment.pdf"></iframe>
        
        <div class="email-preview">
          <h2>Email Format Preview</h2>
          ${formatAssessmentEmail(realisticAssessment)}
        </div>
      </div>
    </body>
    </html>
    `;
    
    fs.writeFileSync(htmlPath, htmlContent);
    console.log(`HTML viewer saved at: ${htmlPath}`);
    console.log('You can view this HTML page at /realistic-individual-assessment.html');
    
  } catch (error) {
    console.error('Error generating assessment:', error);
  }
}

// Run the script
generateRealisticIndividualAssessment();