import { CoupleAssessmentReport } from '../shared/schema';

/**
 * Formats a couple assessment report into HTML for email
 */
export function formatCoupleAssessmentEmail(report: CoupleAssessmentReport): string {
  // Extract assessment data
  const primary = report.primaryAssessment || report.primary;
  const spouse = report.spouseAssessment || report.spouse;
  const analysis = report.differenceAnalysis || report.analysis;
  const compatibility = report.overallCompatibility || report.compatibilityScore;
  
  // Format names using appropriate property paths
  const primaryName = primary?.demographics?.firstName || primary?.name?.split(' ')[0] || 'Partner 1';
  const spouseName = spouse?.demographics?.firstName || spouse?.name?.split(' ')[0] || 'Partner 2';
  
  // Map compatibility level
  const getCompatibilityLevel = (score: number) => {
    if (score >= 80) return 'Very High';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Moderate';
    return 'Areas Needing Attention';
  };
  
  // Get compatibility color
  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return '#15803d'; // green-700
    if (score >= 60) return '#2563eb'; // blue-600
    if (score >= 40) return '#d97706'; // amber-600
    return '#dc2626'; // red-600
  };
  
  // Map section differences into HTML
  const getSectionComparisonHtml = () => {
    let sectionsHtml = '';
    
    // Make sure primary and spouse objects and their scores exist
    if (!primary?.scores?.sections || !spouse?.scores?.sections) {
      return '<tr><td colspan="4" style="padding: 10px; text-align: center; color: #6b7280;">Section data not available</td></tr>';
    }
    
    Object.entries(primary.scores.sections).forEach(([section, sectionData]) => {
      // Safely access percentage values
      const primaryPercentage = sectionData?.percentage || 0;
      const spousePercentage = spouse.scores.sections[section]?.percentage || 0;
      const difference = Math.abs(primaryPercentage - spousePercentage);
      
      let differenceColor = '#15803d'; // green
      if (difference > 20) differenceColor = '#dc2626'; // red
      else if (difference > 10) differenceColor = '#d97706'; // amber
      
      // Format all percentages with 1 decimal place, removing trailing zeros
      const roundedPrimaryPercentage = primaryPercentage.toFixed(1).replace('.0', '');
      const roundedSpousePercentage = spousePercentage.toFixed(1).replace('.0', '');
      const roundedDifference = difference.toFixed(1).replace('.0', '');
      
      sectionsHtml += `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb;">${section}</td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${roundedPrimaryPercentage}%</td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center;">${roundedSpousePercentage}%</td>
          <td style="padding: 10px; border-bottom: 1px solid #e5e7eb; text-align: center; color: ${differenceColor}; font-weight: ${difference > 10 ? 'bold' : 'normal'};">
            ${roundedDifference}%
          </td>
        </tr>
      `;
    });
    
    return sectionsHtml;
  };
  
  // Generate HTML for major differences
  const getMajorDifferencesHtml = () => {
    let differencesHtml = '';
    
    // Get top 5 major differences
    const topDifferences = analysis.majorDifferences.slice(0, 5);
    
    topDifferences.forEach((diff: any) => {
      differencesHtml += `
        <div style="margin-bottom: 15px; padding-bottom: 15px; border-bottom: 1px solid #f3f4f6;">
          <div style="font-weight: 500; color: #1f2937; margin-bottom: 8px;">${diff.questionText}</div>
          <div style="display: flex; justify-content: space-between; font-size: 14px;">
            <div style="color: #1d4ed8;">
              ${primaryName}: <span style="font-weight: 500;">${diff.primaryResponse}</span>
            </div>
            <div style="color: #7e22ce;">
              ${spouseName}: <span style="font-weight: 500;">${diff.spouseResponse}</span>
            </div>
          </div>
        </div>
      `;
    });
    
    return differencesHtml;
  };
  
  // Generate HTML for strengths and vulnerabilities
  const getStrengthsAndVulnerabilitiesHtml = () => {
    let strengthsHtml = '';
    let vulnerabilitiesHtml = '';
    
    analysis.strengthAreas.forEach((area: any) => {
      strengthsHtml += `
        <li style="margin-bottom: 8px;">
          <span style="color: #15803d; margin-right: 8px;">✓</span> ${area}
        </li>
      `;
    });
    
    analysis.vulnerabilityAreas.forEach((area: any) => {
      vulnerabilitiesHtml += `
        <li style="margin-bottom: 8px;">
          <span style="color: #d97706; margin-right: 8px;">⚠</span> ${area}
        </li>
      `;
    });
    
    return `
      <table width="100%" cellpadding="0" cellspacing="0" style="margin-top: 20px;">
        <tr>
          <td width="48%" valign="top" style="background-color: #f0fdf4; border: 1px solid #dcfce7; border-radius: 8px; padding: 15px;">
            <h3 style="margin-top: 0; color: #15803d; font-size: 16px;">Areas of Strength</h3>
            <ul style="padding-left: 10px; list-style-type: none;">
              ${strengthsHtml}
            </ul>
          </td>
          <td width="4%"></td>
          <td width="48%" valign="top" style="background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 15px;">
            <h3 style="margin-top: 0; color: #d97706; font-size: 16px;">Areas Needing Alignment</h3>
            <ul style="padding-left: 10px; list-style-type: none;">
              ${vulnerabilitiesHtml}
            </ul>
          </td>
        </tr>
      </table>
    `;
  };
  
  // Format the email HTML
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Your Couple Assessment Report</title>
    </head>
    <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #374151; background-color: #f9fafb; margin: 0; padding: 0;">
      <div style="max-width: 700px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
        <!-- Header -->
        <div style="background: linear-gradient(to right, #1e40af, #3b82f6); color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0; font-size: 24px; font-weight: 600;">The 100 Marriage Assessment - Series 1</h1>
          <p style="margin: 5px 0 0; opacity: 0.9;">Couple Assessment Report for ${primaryName} & ${spouseName}</p>
        </div>
        
        <!-- Main Content -->
        <div style="padding: 25px;">
          <!-- Couple Compatibility Score -->
          <div style="text-align: center; margin-bottom: 30px;">
            <div style="font-size: 18px; font-weight: 600; color: #1f2937; margin-bottom: 15px;">Your Couple Compatibility Score</div>
            <div style="width: 150px; height: 150px; border-radius: 50%; background-color: white; border: 8px solid ${getCompatibilityColor(compatibility || 0)}; margin: 0 auto; display: flex; align-items: center; justify-content: center; flex-direction: column; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              <div style="font-size: 36px; font-weight: 700; color: ${getCompatibilityColor(compatibility || 0)};">${(compatibility || 0).toFixed(1).replace('.0', '')}%</div>
              <div style="font-size: 14px; color: #4b5563;">${getCompatibilityLevel(compatibility || 0)} Compatibility</div>
            </div>
            <p style="margin-top: 15px; font-size: 15px; color: #4b5563;">
              This score represents how well aligned your marriage expectations are. A higher score means you have more similar views on marriage.
            </p>
          </div>
          
          <!-- Strengths and Areas for Alignment -->
          ${getStrengthsAndVulnerabilitiesHtml()}
          
          <!-- Individual Scores Comparison -->
          <div style="margin-top: 30px; background-color: #f3f4f6; border-radius: 8px; padding: 20px;">
            <h2 style="margin-top: 0; font-size: 18px; color: #1f2937;">Individual Assessment Score Comparison</h2>
            <p style="margin-bottom: 20px; font-size: 14px; color: #6b7280;">
              Compare your individual assessment scores to see where you align and where your perspectives differ.
            </p>
            
            <div style="display: flex; justify-content: space-around; margin-bottom: 20px;">
              <div style="text-align: center;">
                <div style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">${primaryName}'s Score</div>
                <div style="width: 100px; height: 100px; border-radius: 50%; background-color: #eff6ff; border: 4px solid #3b82f6; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                  <div style="font-size: 24px; font-weight: 700; color: #2563eb;">${primary.scores.overallPercentage.toFixed(1).replace('.0', '')}%</div>
                </div>
              </div>
              <div style="text-align: center;">
                <div style="font-size: 14px; color: #6b7280; margin-bottom: 8px;">${spouseName}'s Score</div>
                <div style="width: 100px; height: 100px; border-radius: 50%; background-color: #f5f3ff; border: 4px solid #8b5cf6; margin: 0 auto; display: flex; align-items: center; justify-content: center;">
                  <div style="font-size: 24px; font-weight: 700; color: #7c3aed;">${spouse.scores.overallPercentage.toFixed(1).replace('.0', '')}%</div>
                </div>
              </div>
            </div>
            
            <!-- Section Scores Table -->
            <table width="100%" cellpadding="0" cellspacing="0" style="border-collapse: collapse; margin-top: 20px; font-size: 14px;">
              <thead>
                <tr style="background-color: #e5e7eb;">
                  <th style="padding: 10px; text-align: left; border-bottom: 2px solid #d1d5db;">Section</th>
                  <th style="padding: 10px; text-align: center; border-bottom: 2px solid #d1d5db;">${primaryName}</th>
                  <th style="padding: 10px; text-align: center; border-bottom: 2px solid #d1d5db;">${spouseName}</th>
                  <th style="padding: 10px; text-align: center; border-bottom: 2px solid #d1d5db;">Difference</th>
                </tr>
              </thead>
              <tbody>
                ${getSectionComparisonHtml()}
              </tbody>
            </table>
          </div>
          
          <!-- Major Differences Section -->
          <div style="margin-top: 30px; background-color: #fff7ed; border: 1px solid #ffedd5; border-radius: 8px; padding: 20px;">
            <h2 style="margin-top: 0; font-size: 18px; color: #c2410c;">Top Differences to Discuss</h2>
            <p style="margin-bottom: 20px; font-size: 14px; color: #78716c;">
              These are the key areas where you have significant differences in expectations. We recommend discussing these topics together.
            </p>
            
            ${getMajorDifferencesHtml()}
          </div>
          
          <!-- Discussion Guide Section -->
          <div style="margin-top: 30px; background-color: #f5f3ff; border: 1px solid #e9d5ff; border-radius: 8px; padding: 20px;">
            <h2 style="margin-top: 0; font-size: 18px; color: #7e22ce;">Discussion Guide: Where Your Perspectives Differ</h2>
            <p style="margin-bottom: 15px; font-size: 14px; color: #374151;">
              These are the most significant areas where your answers differed. We recommend scheduling dedicated time to discuss these topics
              together using "The 100 Marriage" book as your guide. The book provides valuable context and discussion points that will help you align your expectations more effectively.
            </p>
            
            <!-- Top Different Questions -->
            <div style="margin-bottom: 20px;">
              ${analysis?.majorDifferences && analysis.majorDifferences.length > 0 
                ? analysis.majorDifferences.slice(0, 5).map((diff, idx) => `
                    <div style="background-color: ${idx % 2 === 0 ? '#f5f3ff' : '#faf5ff'}; border: 1px solid #e9d5ff; border-radius: 6px; padding: 15px; margin-bottom: 10px;">
                      <h3 style="margin-top: 0; font-size: 16px; color: #6b21a8; margin-bottom: 10px;">Question ${diff?.questionId || 'N/A'}: ${diff?.questionText || 'Question text unavailable'}</h3>
                      <div style="display: flex; flex-wrap: wrap; gap: 12px;">
                        <div style="flex: 1; min-width: 250px; background-color: white; padding: 12px; border-radius: 6px; border: 1px solid #ddd6fe;">
                          <p style="margin-top: 0; margin-bottom: 5px; font-weight: 500; color: #7e22ce; font-size: 14px;">${primaryName}'s Response:</p>
                          <p style="margin: 0; color: #4b5563; font-size: 14px;">${diff?.primaryResponse || 'Response unavailable'}</p>
                        </div>
                        <div style="flex: 1; min-width: 250px; background-color: white; padding: 12px; border-radius: 6px; border: 1px solid #ddd6fe;">
                          <p style="margin-top: 0; margin-bottom: 5px; font-weight: 500; color: #7e22ce; font-size: 14px;">${spouseName}'s Response:</p>
                          <p style="margin: 0; color: #4b5563; font-size: 14px;">${diff?.spouseResponse || 'Response unavailable'}</p>
                        </div>
                      </div>
                    </div>
                  `).join('')
                : '<div style="text-align: center; padding: 15px; background-color: #f5f3ff; border: 1px solid #e9d5ff; border-radius: 6px; color: #6b7280;">No significant differences found</div>'
              }
            </div>
            
            <!-- Book and Discussion Guide -->
            <div style="background-color: white; border: 1px solid #e9d5ff; border-radius: 6px; padding: 15px; margin-bottom: 20px; display: flex; gap: 15px; align-items: center;">
              <div style="flex-shrink: 0; width: 100px; text-align: center;">
                <img src="https://lawrenceadjah.com/wp-content/uploads/2023/12/The-100-Marriage-Lawrence-Adjah-Christian-Faith-Based-Books-Marriage-Books-on-Amazon-Relationship-Books-Best-Sellers.png" 
                  alt="The 100 Marriage Book" style="width: 80px; height: auto; border-radius: 4px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
              </div>
              <div>
                <h3 style="margin-top: 0; font-size: 16px; color: #7e22ce; margin-bottom: 8px;">Use The 100 Marriage Book as Your Discussion Companion</h3>
                <p style="margin-bottom: 10px; font-size: 14px; color: #4b5563;">
                  This book provides the perfect framework to navigate important conversations about marriage expectations and alignment.
                </p>
                <a href="https://www.amazon.com/100-MARRIAGE-Lawrence-Adjah-ebook/dp/B09S3FBLN7" style="display: inline-block; background-color: #7e22ce; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; font-size: 14px; font-weight: 500;">Get the Book</a>
              </div>
            </div>
            
            <!-- Key Sections for Discussion -->
            <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 6px; padding: 15px; margin-bottom: 20px;">
              <h3 style="margin-top: 0; font-size: 16px; color: #0f172a;">Key Sections for Additional Discussion:</h3>
              <ul style="list-style-type: none; padding-left: 0; margin-bottom: 0;">
                ${analysis?.vulnerabilityAreas && analysis.vulnerabilityAreas.length > 0 
                  ? analysis.vulnerabilityAreas.map(area => `
                      <li style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
                        <span style="color: #7e22ce; font-weight: 500;">Section: ${area || 'Untitled Section'}</span><br>
                        <span style="font-size: 13px; color: #64748b;">Walk through the questions in this section together with the book as your companion.</span>
                      </li>
                    `).join('')
                  : `<li style="padding: 8px 0; text-align: center; color: #64748b;">No specific vulnerability areas identified</li>`
                }
              </ul>
            </div>
            
            <div style="display: flex; align-items: center; gap: 16px; background-color: #fff6e9; border: 1px solid #fee4b6; border-radius: 6px; padding: 12px;">
              <div style="flex-shrink: 0;">
                <img src="https://lawrenceadjah.com/wp-content/uploads/2023/12/The-100-Marriage-Lawrence-Adjah-Christian-Faith-Based-Books-Marriage-Books-on-Amazon-Relationship-Books-Best-Sellers.png" 
                     alt="The 100 Marriage Book" 
                     style="width: 60px; height: auto; border-radius: 3px; box-shadow: 0 1px 2px rgba(0,0,0,0.1);">
              </div>
              <div>
                <p style="margin: 0 0 5px; font-size: 13px; color: #92400e; font-weight: 500;">
                  Don't have the book yet?
                </p>
                <p style="margin: 0; font-size: 12px; color: #78350f;">
                  <a href="https://lawrenceadjah.com/the100marriagebook" 
                     style="color: #b45309; text-decoration: underline; font-weight: 500;">
                    Get your copy here
                  </a> 
                  to deepen your discussions and strengthen your relationship.
                </p>
              </div>
            </div>
          </div>
          
          <!-- Next Steps and Consultation -->
          <div style="margin-top: 30px; background-color: #f0f9ff; border: 1px solid #e0f2fe; border-radius: 8px; padding: 20px;">
            <h2 style="margin-top: 0; font-size: 18px; color: #0369a1;">Next Steps for Your Relationship</h2>
            <ol style="margin-bottom: 15px; padding-left: 25px; color: #374151;">
              <li style="margin-bottom: 8px;">Review this report together and discuss the key areas of difference.</li>
              <li style="margin-bottom: 8px;">Focus on understanding each other's perspectives rather than trying to change them.</li>
              <li style="margin-bottom: 8px;">Use "The 100 Marriage" book to guide your discussions on areas needing alignment.</li>
              <li style="margin-bottom: 8px;">Consider scheduling a consultation with Lawrence E. Adjah for additional support.</li>
              <li style="margin-bottom: 8px;">Revisit the assessment after 6-12 months to track your alignment progress.</li>
            </ol>
            
            <div style="text-align: center; margin-top: 25px;">
              <a href="https://lawrence-adjah.clientsecure.me/request/service" style="display: inline-block; background-color: #0369a1; color: white; padding: 12px 20px; text-decoration: none; border-radius: 6px; font-weight: 500;">Schedule a Consultation</a>
            </div>
          </div>
          
          <!-- Book Promotion -->
          <div style="margin-top: 30px; background-color: #fffbeb; border: 1px solid #fef3c7; border-radius: 8px; padding: 20px; display: flex; align-items: center; gap: 20px;">
            <div>
              <img src="https://lawrenceadjah.com/wp-content/uploads/2023/12/The-100-Marriage-Lawrence-Adjah-Christian-Faith-Based-Books-Marriage-Books-on-Amazon-Relationship-Books-Best-Sellers.png" alt="The 100 Marriage Book" style="width: 120px; height: auto; border-radius: 4px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);">
            </div>
            <div>
              <h3 style="margin-top: 0; font-size: 16px; color: #854d0e;">Deepen Your Understanding with The 100 Marriage Book</h3>
              <p style="margin-bottom: 10px; font-size: 14px; color: #78716c;">
                For more insights on building a strong marriage foundation, get your copy of The 100 Marriage by Lawrence E. Adjah.
              </p>
              <a href="https://lawrenceadjah.com/the100marriagebook" style="display: inline-block; background-color: #ca8a04; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; font-size: 14px; font-weight: 500;">Get the Book</a>
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div style="background-color: #f3f4f6; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
          <p>This report was generated by The 100 Marriage Assessment - Series 1</p>
          <p>Based on the best-selling book "The 100 Marriage" by Lawrence E. Adjah</p>
          <p>© ${new Date().getFullYear()} Lawrence E. Adjah. All rights reserved.</p>
        </div>
      </div>
    </body>
    </html>
  `;
}