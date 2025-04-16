import { AssessmentResult, DifferenceAnalysis, CoupleAssessmentReport } from "@shared/schema";
import { questions } from "../data/questionsData";

/**
 * Calculate the compatibility percentage between two assessments
 * based on matching responses and section scores
 */
export function calculateCompatibility(
  primaryAssessment: AssessmentResult,
  spouseAssessment: AssessmentResult
): number {
  // Calculate response match percentage (weighted by question importance)
  let totalWeight = 0;
  let matchedWeight = 0;

  // Get all question IDs that both partners answered
  const allQuestionIds = new Set([
    ...Object.keys(primaryAssessment.responses),
    ...Object.keys(spouseAssessment.responses)
  ]);

  // Calculate matched weight for each question
  allQuestionIds.forEach(qId => {
    const primaryResponse = primaryAssessment.responses[qId];
    const spouseResponse = spouseAssessment.responses[qId];
    
    // Find the question to get its weight
    const question = questions.find(q => q.id.toString() === qId);
    
    if (question && primaryResponse && spouseResponse) {
      const weight = question.weight;
      totalWeight += weight;
      
      // Check if responses match
      if (primaryResponse.option === spouseResponse.option) {
        matchedWeight += weight;
      }
    }
  });

  // Calculate response match percentage
  const responseMatchPercentage = totalWeight > 0 
    ? (matchedWeight / totalWeight) * 100 
    : 0;

  // Calculate section score similarity 
  // (how close the partners' section scores are to each other)
  let sectionSimilaritySum = 0;
  let sectionCount = 0;

  Object.keys(primaryAssessment.scores.sections).forEach(sectionName => {
    if (spouseAssessment.scores.sections[sectionName]) {
      const primaryPercentage = primaryAssessment.scores.sections[sectionName].percentage;
      const spousePercentage = spouseAssessment.scores.sections[sectionName].percentage;
      
      // Calculate how similar the percentages are (0-100)
      // 100% means identical scores, 0% means maximally different (100% vs 0%)
      const similarity = 100 - Math.abs(primaryPercentage - spousePercentage);
      sectionSimilaritySum += similarity;
      sectionCount++;
    }
  });

  const sectionSimilarityPercentage = sectionCount > 0 
    ? sectionSimilaritySum / sectionCount 
    : 0;

  // Overall compatibility is a weighted average of response matches and section similarity
  // with response matches weighted more heavily
  return (responseMatchPercentage * 0.7) + (sectionSimilarityPercentage * 0.3);
}

/**
 * Compare two assessments and generate a difference analysis
 * highlighting areas where the partners differ
 */
export function generateDifferenceAnalysis(
  primaryAssessment: AssessmentResult,
  spouseAssessment: AssessmentResult
): DifferenceAnalysis {
  const differentResponses: DifferenceAnalysis['differentResponses'] = [];
  const majorDifferences: DifferenceAnalysis['majorDifferences'] = [];
  
  // Track differences by section to identify strength and vulnerability areas
  const sectionDifferences: Record<string, { count: number, weight: number }> = {};
  
  // Compare all question responses
  questions.forEach(question => {
    const questionId = question.id.toString();
    const primaryResponse = primaryAssessment.responses[questionId];
    const spouseResponse = spouseAssessment.responses[questionId];
    
    // Initialize section tracking if not exists
    if (!sectionDifferences[question.section]) {
      sectionDifferences[question.section] = { count: 0, weight: 0 };
    }
    
    if (primaryResponse && spouseResponse && primaryResponse.option !== spouseResponse.option) {
      // Create a difference entry
      const difference = {
        questionId,
        questionText: question.text,
        questionWeight: question.weight,
        section: question.section,
        primaryResponse: primaryResponse.option,
        spouseResponse: spouseResponse.option
      };
      
      // Add to all differences list
      differentResponses.push(difference);
      
      // Track section differences
      sectionDifferences[question.section].count++;
      sectionDifferences[question.section].weight += question.weight;
      
      // Check if this is a major difference (high weight question)
      if (question.weight >= 5) { // Consider questions with weight >= 5 as major
        majorDifferences.push(difference);
      }
    }
  });
  
  // Identify strength and vulnerability areas based on section differences
  const strengthAreas: string[] = [];
  const vulnerabilityAreas: string[] = [];
  
  Object.entries(sectionDifferences).forEach(([section, data]) => {
    // Get the total number of questions in this section
    const sectionQuestions = questions.filter(q => q.section === section);
    
    if (sectionQuestions.length > 0) {
      // Calculate difference ratio for this section
      const differenceRatio = data.count / sectionQuestions.length;
      
      if (differenceRatio <= 0.2) {
        // Less than 20% different responses - consider a strength area
        strengthAreas.push(section);
      } else if (differenceRatio >= 0.5 || data.weight >= 10) {
        // More than 50% different responses or high cumulative weight differences
        // Consider a vulnerability area
        vulnerabilityAreas.push(section);
      }
    }
  });
  
  return {
    differentResponses,
    majorDifferences,
    strengthAreas,
    vulnerabilityAreas
  };
}

/**
 * Generate a full couple assessment report by comparing two individual assessments
 */
export function generateCoupleReport(
  primaryAssessment: AssessmentResult,
  spouseAssessment: AssessmentResult,
  coupleId: string
): CoupleAssessmentReport {
  // Generate difference analysis
  const differenceAnalysis = generateDifferenceAnalysis(primaryAssessment, spouseAssessment);
  
  // Calculate overall compatibility percentage
  const overallCompatibility = calculateCompatibility(primaryAssessment, spouseAssessment);
  
  return {
    coupleId,
    timestamp: new Date().toISOString(),
    primaryAssessment,
    spouseAssessment,
    differenceAnalysis,
    overallCompatibility
  };
}