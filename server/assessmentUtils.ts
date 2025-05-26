// Utility functions for processing assessment data
import { AssessmentResult } from "@shared/schema";

/**
 * Calculate assessment results from raw responses
 * This function processes completed assessments and prepares them for storage in the results table
 */
export async function calculateAssessmentWithResponses(
  email: string,
  demographicData: any,
  responses: Record<string, { option: string, value: number }>
): Promise<AssessmentResult | null> {
  try {
    // Import the necessary modules directly from their paths
    // We can't use relative imports from client, so we'll get the raw questions
    // and create simplified versions of the scoring functions
    
    // Get the assessment questions from database
    const { pool } = await import('./db');
    const questionsResult = await pool.query(`
      SELECT * FROM assessment_questions
      ORDER BY section, "order"
    `);
    
    const questions = questionsResult.rows.map(q => ({
      id: q.id,
      section: q.section,
      subsection: q.subsection,
      text: q.text,
      options: q.options,
      type: q.type,
      weight: q.weight,
      order: q.order
    }));
    
    // Corrected scoring calculation using proper question mapping
    function calculateScores(questions: any[], responses: Record<string, any>) {
      // Create question mapping by order/position (1-99)
      const questionMap: Record<number, any> = {};
      questions.forEach((q, index) => {
        questionMap[index + 1] = q; // Questions are numbered 1-99
      });
      
      // Section definitions matching the original assessment
      const sectionRanges = {
        "Your Foundation": [1, 10],
        "Your Faith Life": [11, 13],
        "Your Marriage Life": [14, 27],
        "Your Marriage and Boundaries": [28, 36],
        "Your Family/Home Life": [37, 52],
        "Your Parenting Life": [53, 62],
        "Your Finances": [63, 77],
        "Other": [78, 89],
        "Your Health and Wellness": [90, 99]
      };
      
      // Calculate scores per section
      const sections: Record<string, {earned: number, possible: number, percentage: number}> = {};
      let totalEarned = 0;
      let totalPossible = 0;
      
      Object.entries(sectionRanges).forEach(([section, [start, end]]) => {
        let sectionEarned = 0;
        let sectionPossible = 0;
        
        for (let qNum = start; qNum <= end; qNum++) {
          const response = responses[qNum.toString()];
          if (response && response.value !== undefined) {
            sectionEarned += response.value;
            // Use maximum possible value (12) for each question
            sectionPossible += 12;
          }
        }
        
        const percentage = sectionPossible > 0 ? (sectionEarned / sectionPossible) * 100 : 0;
        
        sections[section] = {
          earned: sectionEarned,
          possible: sectionPossible,
          percentage: Math.round(percentage * 10) / 10
        };
        
        totalEarned += sectionEarned;
        totalPossible += sectionPossible;
      });
      
      const overallPercentage = totalPossible > 0 
        ? Math.round((totalEarned / totalPossible) * 1000) / 10 
        : 0;
      
      // Determine strengths and improvement areas based on highest/lowest percentages
      const sectionPercentages = Object.entries(sections)
        .map(([section, data]) => ({ section, percentage: data.percentage }))
        .sort((a, b) => b.percentage - a.percentage);
      
      const strengths = sectionPercentages
        .slice(0, 3)
        .map(s => `Strong ${s.section} compatibility (${s.percentage}%)`);
        
      const improvementAreas = sectionPercentages
        .slice(-2)
        .map(s => `${s.section} alignment can be improved (${s.percentage}%)`);
      
      return {
        sections,
        overallPercentage,
        strengths,
        improvementAreas,
        totalEarned,
        totalPossible
      };
    }
    
    // Simplified profile determination
    function determineProfiles(scores: any, gender: string | undefined) {
      // Get profiles from database
      const defaultProfile = {
        id: "balanced",
        name: "Balanced Individual",
        description: "You have a balanced approach to relationships and marriage.",
        characteristics: ["Adaptable", "Balanced", "Flexible"],
        idealFor: ["Most personalities", "Growth-oriented individuals"],
        matchesWellWith: ["Most profiles"],
        managementStyle: "Balanced",
        leadershipStyle: "Adaptable",
        communicationStyle: "Flexible",
        primaryMotivation: "Harmony"
      };
      
      // Return default profile for now - this will be enhanced later
      return {
        primaryProfile: defaultProfile,
        genderProfile: gender ? defaultProfile : null
      };
    }
    
    console.log(`Calculating scores for completed assessment: ${email}`);
    
    // Calculate scores based on the responses
    const scores = calculateScores(questions, responses);
    
    // Determine primary profile
    const { primaryProfile, genderProfile } = determineProfiles(
      scores, 
      demographicData.gender
    );
    
    // Create the assessment result
    const assessmentResult: AssessmentResult = {
      email: email,
      name: `${demographicData.firstName || ''} ${demographicData.lastName || ''}`.trim(),
      scores: scores,
      profile: primaryProfile,
      genderProfile: genderProfile || undefined,
      responses: responses,
      demographics: demographicData,
      timestamp: new Date().toISOString()
    };
    
    return assessmentResult;
  } catch (error) {
    console.error(`Error calculating assessment for ${email}:`, error);
    return null;
  }
}