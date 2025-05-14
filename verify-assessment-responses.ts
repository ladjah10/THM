/**
 * This script analyzes all assessment responses in the database
 * to identify if there really are duplicate responses or if the scoring is incorrect
 */

import { pool } from './server/db';
import fs from 'fs';
import path from 'path';

// Run the verification script
async function verifyAssessmentResponses() {
  console.log('Starting assessment response verification...');
  
  // First, get all assessment records
  const { rows: assessments } = await pool.query(`
    SELECT id, email, name, responses, demographics, scores
    FROM assessment_results
    ORDER BY timestamp DESC
  `);
  
  console.log(`Found ${assessments.length} assessments to analyze`);
  
  // Create a map to track unique response patterns
  const responsePatterns = new Map();
  const scoreDistribution = new Map();
  let sampleResponses = [];
  
  // Analyze each assessment
  assessments.forEach((assessment, index) => {
    try {
      let responses, scores;
      
      try {
        responses = JSON.parse(assessment.responses);
        scores = JSON.parse(assessment.scores);
      } catch (e) {
        console.error(`Error parsing JSON for assessment ${assessment.id} (${assessment.email}):`, e);
        return;
      }
      
      // Create a pattern key from the responses
      const pattern = Object.entries(responses)
        .sort(([keyA], [keyB]) => keyA.localeCompare(keyB))
        .map(([questionId, response]) => `${questionId}:${response.option}:${response.value}`)
        .join('|');
      
      // Track and count this pattern
      if (!responsePatterns.has(pattern)) {
        responsePatterns.set(pattern, {
          count: 0,
          emails: [],
          // Store a sample response for the first occurrence
          sampleResponse: index < 10 ? responses : null,
          score: scores.overallPercentage
        });
      }
      
      const patternData = responsePatterns.get(pattern);
      patternData.count++;
      patternData.emails.push(assessment.email);
      
      // Track score distribution
      const scoreKey = scores.overallPercentage.toFixed(1);
      if (!scoreDistribution.has(scoreKey)) {
        scoreDistribution.set(scoreKey, 0);
      }
      scoreDistribution.set(scoreKey, scoreDistribution.get(scoreKey) + 1);
      
      // Collect sample responses for the report
      if (index < 10) {
        sampleResponses.push({
          id: assessment.id,
          email: assessment.email,
          name: assessment.name,
          score: scores.overallPercentage,
          responses: Object.entries(responses).slice(0, 10) // Show first 10 responses only
        });
      }
    } catch (error) {
      console.error(`Error processing assessment ${assessment.id}:`, error);
    }
  });
  
  // Sort patterns by count
  const sortedPatterns = [...responsePatterns.entries()]
    .sort((a, b) => b[1].count - a[1].count);
  
  // Sort score distribution
  const sortedScores = [...scoreDistribution.entries()]
    .sort((a, b) => b[1] - a[1]);
  
  // Generate report
  const report = {
    totalAssessments: assessments.length,
    uniqueResponsePatterns: responsePatterns.size,
    patternDistribution: sortedPatterns.slice(0, 10).map(([pattern, data]) => ({
      count: data.count,
      percentage: Math.round((data.count / assessments.length) * 100),
      emails: data.emails.slice(0, 5), // Show first 5 emails only
      score: data.score
    })),
    scoreDistribution: sortedScores.map(([score, count]) => ({
      score,
      count,
      percentage: Math.round((count / assessments.length) * 100)
    })),
    sampleResponses
  };
  
  // Write report to file
  const reportPath = path.join(__dirname, 'assessment-response-analysis.json');
  fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
  
  console.log(`
    Analysis complete!
    - Total assessments: ${assessments.length}
    - Unique response patterns: ${responsePatterns.size}
    - Most common pattern appears ${sortedPatterns[0]?.[1]?.count || 0} times
    - Report saved to: ${reportPath}
  `);
  
  // Print score distribution
  console.log('\nScore Distribution:');
  sortedScores.slice(0, 10).forEach(([score, count]) => {
    console.log(`  ${score}%: ${count} assessments (${Math.round((count / assessments.length) * 100)}%)`);
  });
  
  // Print the most common response pattern
  if (sortedPatterns.length > 0) {
    const [_, mostCommonData] = sortedPatterns[0];
    console.log(`\nMost common response pattern (${mostCommonData.count} assessments):`)
    if (mostCommonData.sampleResponse) {
      console.log('Sample responses from this pattern:');
      console.log(JSON.stringify(mostCommonData.sampleResponse, null, 2).substring(0, 500) + '...');
    }
    console.log('Emails with this pattern:');
    mostCommonData.emails.slice(0, 5).forEach(email => console.log(`  - ${email}`));
  }
}

// Run the script
verifyAssessmentResponses()
  .then(() => {
    console.log('Verification completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Verification failed:', error);
    process.exit(1);
  });