/**
 * This file serves as a bridge to integrate our updated PDF generators with the main server code.
 * It exports the same interface as the original pdf-generator.ts but uses the updated implementations.
 */

import { AssessmentResult, CoupleAssessmentReport } from '../shared/schema';
import { generateIndividualAssessmentPDF } from './updated-individual-pdf';
import { generateCoupleAssessmentPDF } from './updated-couple-pdf';

// These are the same function signatures as in the original pdf-generator.ts
export async function generateAssessmentPDF(assessment: AssessmentResult): Promise<Buffer> {
  return generateIndividualAssessmentPDF(assessment);
}

export async function generateCoupleAssessmentPDF(report: CoupleAssessmentReport): Promise<Buffer> {
  return generateCoupleAssessmentPDF(report);
}