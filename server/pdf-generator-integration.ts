/**
 * This file serves as a bridge to integrate our updated PDF generators with the main server code.
 * It exports the same interface as the original pdf-generator.ts but uses the updated implementations.
 */

import { AssessmentResult, CoupleAssessmentReport } from '../shared/schema';
import { generateIndividualAssessmentPDF as generateIndividual } from './updated-individual-pdf';
import { generateCoupleAssessmentPDF as generateCouple } from './updated-couple-pdf';

// Export functions for route handlers to use
export async function generateAssessmentPDF(assessment: AssessmentResult): Promise<Buffer> {
  return generateIndividual(assessment);
}

export async function generateIndividualAssessmentPDF(assessment: AssessmentResult): Promise<Buffer> {
  return generateIndividual(assessment);
}

export async function generateCoupleAssessmentPDF(report: CoupleAssessmentReport): Promise<Buffer> {
  return generateCouple(report);
}