import { AssessmentResult, CoupleAssessmentReport, DifferenceAnalysis } from '@shared/schema';

/**
 * Generates a full couple assessment report by comparing two individual assessments
 */
export function generateCoupleReport(
  primaryAssessment: AssessmentResult,
  spouseAssessment: AssessmentResult,
  coupleId: string
): CoupleAssessmentReport {
  // Analyze differences between assessments
  const differenceAnalysis = analyzeResponseDifferences(primaryAssessment, spouseAssessment);
  
  // Calculate overall compatibility score
  const overallCompatibility = calculateOverallCompatibility(primaryAssessment, spouseAssessment, differenceAnalysis);
  
  return {
    coupleId,
    timestamp: new Date().toISOString(),
    primaryAssessment,
    spouseAssessment,
    differenceAnalysis,
    overallCompatibility
  };
}

/**
 * Calculates the overall compatibility score between two assessments
 * This takes into account:
 * 1. Overall score similarity (40%)
 * 2. Section score similarities (40%)
 * 3. Number of major differences (20%)
 */
function calculateOverallCompatibility(
  primaryAssessment: AssessmentResult,
  spouseAssessment: AssessmentResult,
  differenceAnalysis: DifferenceAnalysis
): number {
  // Calculate similarity of overall scores (closeness)
  const overallScoreDifference = Math.abs(
    primaryAssessment.scores.overallPercentage - spouseAssessment.scores.overallPercentage
  );
  const overallScoreSimilarity = Math.max(0, 100 - overallScoreDifference);
  
  // Calculate similarity across all sections
  const sectionSimilarities: number[] = [];
  
  for (const section in primaryAssessment.scores.sections) {
    if (section in spouseAssessment.scores.sections) {
      const primaryPercentage = primaryAssessment.scores.sections[section].percentage;
      const spousePercentage = spouseAssessment.scores.sections[section].percentage;
      const difference = Math.abs(primaryPercentage - spousePercentage);
      const similarity = Math.max(0, 100 - difference);
      sectionSimilarities.push(similarity);
    }
  }
  
  const averageSectionSimilarity = sectionSimilarities.length > 0
    ? sectionSimilarities.reduce((sum, val) => sum + val, 0) / sectionSimilarities.length
    : 0;
  
  // Calculate score based on major differences
  // Less differences = higher score
  const totalQuestions = Object.keys(primaryAssessment.responses).length;
  const majorDifferencePercentage = (differenceAnalysis.majorDifferences.length / totalQuestions) * 100;
  const majorDifferenceScore = Math.max(0, 100 - majorDifferencePercentage * 3); // Scale the impact
  
  // Calculate final weighted score
  const weightedScore = 
    (overallScoreSimilarity * 0.4) + 
    (averageSectionSimilarity * 0.4) + 
    (majorDifferenceScore * 0.2);
  
  // Round to nearest integer
  return Math.round(weightedScore);
}

/**
 * Analyzes the differences between two assessment responses
 * Identifies all differences and major differences (weighted questions or questions with large value gaps)
 */
function analyzeResponseDifferences(
  primaryAssessment: AssessmentResult,
  spouseAssessment: AssessmentResult
): DifferenceAnalysis {
  const differentResponses: {
    questionId: string;
    questionText: string;
    questionWeight: number;
    section: string;
    primaryResponse: string;
    spouseResponse: string;
  }[] = [];
  
  const majorDifferences: {
    questionId: string;
    questionText: string;
    questionWeight: number;
    section: string;
    primaryResponse: string;
    spouseResponse: string;
  }[] = [];
  
  // Get question map from the primary assessment
  const primaryResponses = primaryAssessment.responses;
  const spouseResponses = spouseAssessment.responses;
  
  // Track differences by section
  const sectionDifferenceCounts: Record<string, number> = {};
  const sectionTotalCounts: Record<string, number> = {};
  
  // For each question in primary responses
  for (const questionId in primaryResponses) {
    const primaryResponse = primaryResponses[questionId];
    const spouseResponse = spouseResponses[questionId];
    
    // Skip if spouse didn't answer this question
    if (!spouseResponse) continue;
    
    // Get question details
    const section = getQuestionSection(questionId, primaryAssessment);
    const questionText = getQuestionText(questionId);
    const questionWeight = getQuestionWeight(questionId);
    
    // Update section counters
    sectionTotalCounts[section] = (sectionTotalCounts[section] || 0) + 1;
    
    // Compare responses
    if (primaryResponse.option !== spouseResponse.option) {
      // Calculate value difference
      const valueDifference = Math.abs(primaryResponse.value - spouseResponse.value);
      
      // Add to general differences
      differentResponses.push({
        questionId,
        questionText,
        questionWeight,
        section,
        primaryResponse: primaryResponse.option,
        spouseResponse: spouseResponse.option
      });
      
      // Update section difference count
      sectionDifferenceCounts[section] = (sectionDifferenceCounts[section] || 0) + 1;
      
      // Determine if this is a major difference
      // Major differences are either:
      // 1. Questions with high weight (>=3)
      // 2. Questions with a large value gap (>=3)
      if (questionWeight >= 3 || valueDifference >= 3) {
        majorDifferences.push({
          questionId,
          questionText,
          questionWeight,
          section,
          primaryResponse: primaryResponse.option,
          spouseResponse: spouseResponse.option
        });
      }
    }
  }
  
  // Identify strength and vulnerability areas based on section differences
  const strengthAreas: string[] = [];
  const vulnerabilityAreas: string[] = [];
  
  for (const section in sectionTotalCounts) {
    const totalQuestions = sectionTotalCounts[section];
    const differences = sectionDifferenceCounts[section] || 0;
    const differencePercentage = (differences / totalQuestions) * 100;
    
    if (differencePercentage <= 20) {
      strengthAreas.push(section);
    }
    
    if (differencePercentage >= 50) {
      vulnerabilityAreas.push(section);
    }
  }
  
  return {
    differentResponses,
    majorDifferences,
    strengthAreas,
    vulnerabilityAreas
  };
}

/**
 * Extracts the section a question belongs to from the assessment data
 */
function getQuestionSection(questionId: string, assessment: AssessmentResult): string {
  // Try to find the section from the assessment scores
  for (const section in assessment.scores.sections) {
    // This is a simple approach - in a production system, you would 
    // have a proper mapping between question IDs and sections
    if (parseInt(questionId) % 7 === 0) return "Family Planning";
    if (parseInt(questionId) % 5 === 0) return "Financial Values";
    if (parseInt(questionId) % 3 === 0) return "Faith & Practice";
    if (parseInt(questionId) % 2 === 0) return "Relationship Roles";
  }
  
  return "General Values";
}

/**
 * Gets a human-readable text for a question ID
 * In a production system, this would come from a database or predefined mapping
 */
function getQuestionText(questionId: string): string {
  // This is a simplified mapping example
  // In production, you'd use a proper question database
  const questionMap: Record<string, string> = {
    "1": "Faith should be the foundation of a marriage.",
    "2": "Both spouses should contribute equally to household income.",
    "3": "Having children is essential for a fulfilling marriage.",
    "4": "One spouse should be the primary decision-maker in a household.",
    "5": "Joint finances are necessary for a successful marriage.",
    "6": "Regular religious practice is important in a family.",
    "7": "There is an ideal time to have children after marriage.",
    "8": "Career advancement should be prioritized over family time if necessary.",
    "9": "Religious education for children is essential.",
    "10": "The husband should be the primary provider for the family.",
    // In production, this would have all 99 questions mapped
  };
  
  return questionMap[questionId] || `Question ${questionId}`;
}

/**
 * Gets the weight of a question
 * In a production system, this would come from a database or predefined mapping
 */
function getQuestionWeight(questionId: string): number {
  // Simplified example - in production this would come from your question database
  // First question has the highest weight (36)
  if (questionId === "1") return 36;
  
  // Questions divisible by 10 are weighted higher (5)
  if (parseInt(questionId) % 10 === 0) return 5;
  
  // Questions divisible by 5 have weight 3
  if (parseInt(questionId) % 5 === 0) return 3;
  
  // All other questions have weight 1
  return 1;
}