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

    // Map questions by their actual ID for improved reliability
    const questionMap: Record<string, any> = {};
    questions.forEach(q => {
      questionMap[q.id] = q;
    });

    let totalEarned = 0;
    let totalPossible = 0;
    let matchedResponses = 0;

    // Enhanced response processing with better error handling
    for (const key in responses) {
      const question = questionMap[key];
      const response = responses[key];

      if (!question) {
        console.warn(`⚠️ No question found for response key: ${key}`);
        continue;
      }

      if (typeof response.value !== 'number') {
        console.warn(`⚠️ Invalid response value for key ${key}:`, response);
        continue;
      }

      totalEarned += response.value;
      totalPossible += question.weight ?? 12; // Use 12 as default weight
      matchedResponses++;
    }

    // Ensure sufficient responses for reliable scoring
    if (matchedResponses < 10) {
      console.warn(`⚠️ Only ${matchedResponses} matched responses found for ${email}. Skipping.`);
      return null;
    }

    const overallPercentage = totalPossible > 0 
      ? Math.round((totalEarned / totalPossible) * 1000) / 10 
      : 0;

    // Calculate section scores using the original algorithm
    function calculateSectionScores(questions: any[], responses: Record<string, any>) {
      const sections: Record<string, {earned: number, possible: number, percentage: number}> = {};
      
      // Group questions by section
      const sectionGroups: Record<string, any[]> = {};
      questions.forEach(q => {
        if (!sectionGroups[q.section]) {
          sectionGroups[q.section] = [];
        }
        sectionGroups[q.section].push(q);
      });

      // Calculate scores for each section
      Object.entries(sectionGroups).forEach(([section, sectionQuestions]) => {
        let sectionEarned = 0;
        let sectionPossible = 0;
        
        sectionQuestions.forEach(question => {
          const response = responses[question.id];
          if (response && response.value !== undefined) {
            sectionEarned += response.value;
            sectionPossible += question.weight ?? 12;
          }
        });
        
        const percentage = sectionPossible > 0 ? (sectionEarned / sectionPossible) * 100 : 0;
        
        sections[section] = {
          earned: sectionEarned,
          possible: sectionPossible,
          percentage: Math.round(percentage * 10) / 10
        };
      });

      return sections;
    }

    const sections = calculateSectionScores(questions, responses);

    // Determine strengths and improvement areas
    const sectionPercentages = Object.entries(sections)
      .map(([section, data]) => ({ section, percentage: data.percentage }))
      .sort((a, b) => b.percentage - a.percentage);
    
    const strengths = sectionPercentages
      .slice(0, 3)
      .map(s => `Strong ${s.section} compatibility (${s.percentage}%)`);
      
    const improvementAreas = sectionPercentages
      .slice(-2)
      .map(s => `${s.section} alignment can be improved (${s.percentage}%)`);

    // Simple profile determination
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

    const result: AssessmentResult = {
      email,
      name: `${demographicData.firstName || ''} ${demographicData.lastName || ''}`.trim(),
      demographics: demographicData,
      scores: {
        overallPercentage,
        totalEarned,
        totalPossible,
        strengths,
        improvementAreas,
        sections
      },
      profile: defaultProfile,
      genderProfile: demographicData.gender ? defaultProfile : undefined,
      responses,
      timestamp: new Date().toISOString()
    };

    console.log(`✅ Successfully calculated assessment for ${email} - Score: ${overallPercentage}%`);
    return result;

  } catch (err) {
    console.error(`❌ Error calculating assessment for ${email}:`, err);
    return null;
  }
}