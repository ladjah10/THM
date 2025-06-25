import { SECTION_WEIGHTS, SECTION_PERCENTAGES, TOTAL_WEIGHT } from "../client/src/config/sectionWeights";

type AssessmentResponse = {
  option: string;
  value: number;
};

type Question = {
  id: string;
  section: string;
  type: "D" | "M";
  faith?: boolean;
  baseWeight: number;
  weight: number;
};

type AssessmentResult = {
  email: string;
  demographics: any;
  scores: {
    overallPercentage: number;
    totalEarned: number;
    totalPossible: number;
    strengths: string[];
    improvementAreas: string[];
    sections: Record<string, number>;
  };
};

function getResponseScore(option: string, weight: number): number {
  switch (option) {
    case "Option 1": return weight * 1.0;
    case "Option 2": return weight * 0.75;
    case "Option 3": return weight * 0.40;
    case "Option 4": return weight * 0.15;
    default: return 0;
  }
}

export async function calculateAssessmentWithResponses(
  email: string,
  demographicData: any,
  responses: Record<string, AssessmentResponse>
): Promise<AssessmentResult | null> {
  try {
    const { pool } = await import('../server/db');
    const questionsResult = await pool.query(`
      SELECT * FROM assessment_questions
      ORDER BY section, "order"
    `);

    const questions: Question[] = questionsResult.rows.map(q => ({
      id: q.id,
      section: q.section,
      type: q.type,
      faith: q.faith,
      baseWeight: q.base_weight,
      weight: q.weight
    }));

    const questionMap: Record<string, Question> = {};
    questions.forEach(q => {
      questionMap[q.id] = q;
    });

    const sectionScores: Record<string, number> = {};
    const sectionEarned: Record<string, number> = {};
    let totalEarned = 0;

    for (const [id, response] of Object.entries(responses)) {
      const question = questionMap[id];
      if (!question) continue;

      const score = getResponseScore(response.option, question.weight);
      const section = question.section;

      sectionEarned[section] = (sectionEarned[section] ?? 0) + score;
      totalEarned += score;
    }

    Object.entries(SECTION_WEIGHTS).forEach(([section, weight]) => {
      const earned = sectionEarned[section] ?? 0;
      sectionScores[section] = (earned / weight) * 100;
    });

    let overallPercentage = 0;
    Object.entries(sectionScores).forEach(([section, score]) => {
      overallPercentage += score * (SECTION_PERCENTAGES[section] ?? 0);
    });

    return {
      email,
      demographics: demographicData,
      scores: {
        overallPercentage,
        totalEarned,
        totalPossible: TOTAL_WEIGHT,
        strengths: [],
        improvementAreas: [],
        sections: sectionScores
      }
    };
  } catch (err) {
    console.error("❌ Error calculating assessment:", err);
    return null;
  }
}