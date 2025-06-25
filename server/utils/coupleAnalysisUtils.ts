// Import the improved assessment calculation function
// Note: This uses the enhanced scoring algorithm with 660-point system
import { calculateFullAssessment } from "../../client/src/utils/scoringUtils";

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

type CoupleAssessmentReport = {
  coupleId: string;
  primaryAssessment: AssessmentResult;
  spouseAssessment: AssessmentResult;
  compatibilityScore: number;
  sectionComparisons: Record<string, {
    primaryScore: number;
    spouseScore: number;
    difference: number;
    compatibility: 'High' | 'Moderate' | 'Low';
  }>;
  overallCompatibility: 'High' | 'Moderate' | 'Low';
  recommendations: string[];
  strengthAreas: string[];
  growthAreas: string[];
};

// Wrapper: Regenerates scores before comparing if needed
export async function prepareAndCompareCoupleAssessments(
  primary: AssessmentResult,
  spouse: AssessmentResult,
  email: string,
  demographicsPrimary: any,
  responsesPrimary: any,
  demographicsSpouse: any,
  responsesSpouse: any,
  coupleId: string
): Promise<CoupleAssessmentReport> {
  // Use existing scores if available, otherwise recalculate with improved algorithm
  let updatedPrimary = primary;
  let updatedSpouse = spouse;
  
  if (!primary.scores?.overallPercentage && responsesPrimary) {
    const recalculatedPrimary = calculateFullAssessment(responsesPrimary, demographicsPrimary);
    updatedPrimary = {
      ...primary,
      scores: recalculatedPrimary.scores,
      profile: recalculatedPrimary.profile,
      genderProfile: recalculatedPrimary.genderProfile
    };
  }
  
  if (!spouse.scores?.overallPercentage && responsesSpouse) {
    const recalculatedSpouse = calculateFullAssessment(responsesSpouse, demographicsSpouse);
    updatedSpouse = {
      ...spouse,
      scores: recalculatedSpouse.scores,
      profile: recalculatedSpouse.profile,
      genderProfile: recalculatedSpouse.genderProfile
    };
  }

  return generateCoupleReport(updatedPrimary, updatedSpouse, coupleId);
}

// Generate comprehensive couple compatibility report
function generateCoupleReport(
  primary: AssessmentResult,
  spouse: AssessmentResult,
  coupleId: string
): CoupleAssessmentReport {
  const sectionComparisons: Record<string, any> = {};
  let totalCompatibilityScore = 0;
  let sectionCount = 0;

  // Compare each section
  Object.keys(primary.scores.sections).forEach(section => {
    const primaryScore = primary.scores.sections[section] || 0;
    const spouseScore = spouse.scores.sections[section] || 0;
    const difference = Math.abs(primaryScore - spouseScore);
    
    // Calculate compatibility based on score difference
    let compatibility: 'High' | 'Moderate' | 'Low';
    let compatibilityValue: number;
    
    if (difference <= 10) {
      compatibility = 'High';
      compatibilityValue = 100 - difference;
    } else if (difference <= 25) {
      compatibility = 'Moderate';
      compatibilityValue = 85 - difference;
    } else {
      compatibility = 'Low';
      compatibilityValue = Math.max(50 - difference, 0);
    }
    
    sectionComparisons[section] = {
      primaryScore,
      spouseScore,
      difference,
      compatibility
    };
    
    totalCompatibilityScore += compatibilityValue;
    sectionCount++;
  });

  // Calculate overall compatibility
  const compatibilityScore = Math.round(totalCompatibilityScore / sectionCount);
  let overallCompatibility: 'High' | 'Moderate' | 'Low';
  
  if (compatibilityScore >= 80) {
    overallCompatibility = 'High';
  } else if (compatibilityScore >= 60) {
    overallCompatibility = 'Moderate';
  } else {
    overallCompatibility = 'Low';
  }

  // Generate recommendations
  const recommendations = generateRecommendations(sectionComparisons, overallCompatibility);
  const strengthAreas = generateStrengthAreas(sectionComparisons);
  const growthAreas = generateGrowthAreas(sectionComparisons);

  return {
    coupleId,
    primaryAssessment: primary,
    spouseAssessment: spouse,
    compatibilityScore,
    sectionComparisons,
    overallCompatibility,
    recommendations,
    strengthAreas,
    growthAreas
  };
}

function generateRecommendations(
  sectionComparisons: Record<string, any>,
  overallCompatibility: 'High' | 'Moderate' | 'Low'
): string[] {
  const recommendations: string[] = [];
  
  if (overallCompatibility === 'High') {
    recommendations.push("You demonstrate strong overall compatibility across key marriage areas.");
    recommendations.push("Continue building on your shared values and communication patterns.");
  } else if (overallCompatibility === 'Moderate') {
    recommendations.push("You have good foundational compatibility with areas for growth.");
    recommendations.push("Focus on strengthening communication in areas where you differ.");
  } else {
    recommendations.push("Consider pre-marital counseling to address significant differences.");
    recommendations.push("Work together to align your expectations and values.");
  }

  // Add section-specific recommendations
  Object.entries(sectionComparisons).forEach(([section, data]) => {
    if (data.compatibility === 'Low') {
      recommendations.push(`Address differences in ${section.replace('Section ', '').replace(':', '')} through open dialogue and mutual understanding.`);
    }
  });

  return recommendations;
}

function generateStrengthAreas(sectionComparisons: Record<string, any>): string[] {
  return Object.entries(sectionComparisons)
    .filter(([, data]) => data.compatibility === 'High')
    .map(([section]) => section.replace('Section ', '').replace(':', ''));
}

function generateGrowthAreas(sectionComparisons: Record<string, any>): string[] {
  return Object.entries(sectionComparisons)
    .filter(([, data]) => data.compatibility === 'Low')
    .map(([section]) => section.replace('Section ', '').replace(':', ''));
}

// Helper function to recalculate couple assessment with new algorithm
export async function recalculateCoupleAssessment(
  primaryEmail: string,
  spouseEmail: string,
  coupleId: string
): Promise<CoupleAssessmentReport | null> {
  try {
    // This would typically fetch from database
    // For now, return null - implement based on your data storage
    console.log(`Recalculating couple assessment for ${coupleId}`);
    return null;
  } catch (error) {
    console.error('Error recalculating couple assessment:', error);
    return null;
  }
}