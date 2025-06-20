/**
 * Updated Scoring Algorithm with Proper Declaration Weighting
 * Affirmative declaration choice = full weight points
 * Antithesis declaration choice = 25% weight points (significant penalty for non-commitment)
 */

export function calculateQuestionScore(question: any, response: any): number {
  const weight = question.weight;
  
  if (question.type === 'D') {
    // Declaration questions: First option (affirmative) gets full points, second (antithesis) gets 25%
    if (typeof response === 'object' && response.option) {
      const optionIndex = question.options.indexOf(response.option);
      if (optionIndex === 0) return weight; // Affirmative commitment
      if (optionIndex === 1) return weight * 0.25; // Antithesis (significant penalty)
      return 0;
    } else if (typeof response === 'string') {
      const optionIndex = question.options.indexOf(response);
      if (optionIndex === 0) return weight;
      if (optionIndex === 1) return weight * 0.25;
      return 0;
    }
  } else if (question.type === 'M') {
    // Multiple choice: graduated scoring
    if (typeof response === 'object' && response.option) {
      const optionIndex = question.options.indexOf(response.option);
      if (optionIndex !== -1) {
        const scoreMultiplier = Math.max(0.25, 1 - (optionIndex * 0.25));
        return scoreMultiplier * weight;
      }
    } else if (typeof response === 'string') {
      const optionIndex = question.options.indexOf(response);
      if (optionIndex !== -1) {
        const scoreMultiplier = Math.max(0.25, 1 - (optionIndex * 0.25));
        return scoreMultiplier * weight;
      }
    }
  } else if (question.type === 'I') {
    // Input questions: full points if answered
    return response ? weight : 0;
  }
  
  return 0;
}