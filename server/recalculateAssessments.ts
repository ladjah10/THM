import { calculateAssessmentWithResponses } from "../attached_assets/improved_calculateAssessmentWithResponses";
import { pool } from "./db";

export const recalculateAssessmentById = async (assessmentId: string) => {
  try {
    // 1. Fetch assessment metadata
    const assessmentRes = await pool.query("SELECT * FROM assessments WHERE id = $1", [assessmentId]);
    const assessment = assessmentRes.rows[0];
    if (!assessment) throw new Error("Assessment not found");

    // 2. Fetch responses
    const responsesRes = await pool.query(
      "SELECT question_id, option, value FROM responses WHERE assessment_id = $1",
      [assessmentId]
    );

    const responses: Record<string, { option: string; value: number }> = {};
    responsesRes.rows.forEach(({ question_id, option, value }) => {
      responses[question_id] = { option, value };
    });

    // 3. Fetch demographics (if needed by algorithm)
    const demoRes = await pool.query("SELECT * FROM demographics WHERE assessment_id = $1", [assessmentId]);
    const demographics = demoRes.rows[0] || {};

    // 4. Run updated calculation
    const result = await calculateAssessmentWithResponses(
      assessment.email,
      demographics,
      responses
    );

    // 5. Optional: Update DB with new score
    // await pool.query("UPDATE assessments SET score = $1 WHERE id = $2", [result.scores.overallPercentage, assessmentId]);

    return result;
  } catch (err) {
    console.error("❌ Failed to recalculate:", err);
    throw err;
  }
};

export const recalculateAllAssessments = async () => {
  try {
    const assessmentsRes = await pool.query("SELECT id FROM assessments");
    const assessmentIds = assessmentsRes.rows.map(row => row.id);
    
    console.log(`📊 Recalculating ${assessmentIds.length} assessments...`);
    
    const results = [];
    for (const id of assessmentIds) {
      try {
        const result = await recalculateAssessmentById(id);
        results.push({ id, success: true, result });
        console.log(`✅ Recalculated assessment ${id}`);
      } catch (err) {
        results.push({ id, success: false, error: err.message });
        console.log(`❌ Failed to recalculate assessment ${id}: ${err.message}`);
      }
    }
    
    return results;
  } catch (err) {
    console.error("❌ Failed to recalculate all assessments:", err);
    throw err;
  }
};