
export async function calculateAssessmentWithResponses(
  email: string,
  demographicData: any,
  responses: Record<string, { option: string, value: number }>
): Promise<AssessmentResult | null> {
  try {
    const { pool } = await import('./db');
    const questionsResult = await pool.query(\`
      SELECT * FROM assessment_questions
      ORDER BY section, "order"
    \`);

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

    // Map questions by their actual ID, not index
    const questionMap: Record<string, any> = {};
    questions.forEach(q => {
      questionMap[q.id] = q;
    });

    let totalEarned = 0;
    let totalPossible = 0;
    let matchedResponses = 0;

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
      totalPossible += question.weight ?? 1;
      matchedResponses++;
    }

    if (matchedResponses < 10) {
      console.warn(`⚠️ Only ${matchedResponses} matched responses found for ${email}. Skipping.`);
      return null;
    }

    const overallPercentage = (totalEarned / totalPossible) * 100;

    const result: AssessmentResult = {
      email,
      demographics: demographicData,
      scores: {
        overallPercentage,
        totalEarned,
        totalPossible,
        strengths: [],
        improvementAreas: [],
        sections: {}  // placeholder for detailed section scoring
      }
    };

    return result;

  } catch (err) {
    console.error(`❌ Error calculating assessment for ${email}:`, err);
    return null;
  }
}
