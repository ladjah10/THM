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
    
    // Simplified scoring calculation
    function calculateScores(questions: any[], responses: Record<string, any>) {
      // Group questions by section
      const sectionQuestions: Record<string, any[]> = {};
      
      questions.forEach(q => {
        if (!sectionQuestions[q.section]) {
          sectionQuestions[q.section] = [];
        }
        sectionQuestions[q.section].push(q);
      });
      
      // Calculate scores per section
      const sections: Record<string, {earned: number, possible: number, percentage: number}> = {};
      let totalEarned = 0;
      let totalPossible = 0;
      
      Object.entries(sectionQuestions).forEach(([section, sectionQs]) => {
        let sectionEarned = 0;
        let sectionPossible = 0;
        
        sectionQs.forEach(q => {
          const response = responses[q.id];
          if (response) {
            sectionEarned += response.value;
            sectionPossible += q.weight || 1;
          }
        });
        
        const percentage = sectionPossible > 0 ? (sectionEarned / sectionPossible) * 100 : 0;
        
        sections[section] = {
          earned: sectionEarned,
          possible: sectionPossible,
          percentage: Math.round(percentage * 10) / 10 // Round to 1 decimal place
        };
        
        totalEarned += sectionEarned;
        totalPossible += sectionPossible;
      });
      
      const overallPercentage = totalPossible > 0 
        ? Math.round((totalEarned / totalPossible) * 1000) / 10 
        : 0;
      
      // Determine strengths and improvement areas
      const strengths = Object.entries(sections)
        .sort((a, b) => b[1].percentage - a[1].percentage)
        .slice(0, 3)
        .map(([section]) => section);
        
      const improvementAreas = Object.entries(sections)
        .sort((a, b) => a[1].percentage - b[1].percentage)
        .slice(0, 3)
        .map(([section]) => section);
      
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