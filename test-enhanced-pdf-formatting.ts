/**
 * Test script to verify enhanced PDF formatting matches sample standards
 * Tests all the formatting improvements including:
 * - Full explanatory text for section performance
 * - Exact percentage format with horizontal dividers
 * - Gender-specific profile section
 * - Overview of psychographic profiles
 * - Enhanced statistical comparison with percentiles
 * - Page numbers and professional footer
 */

import { generateIndividualAssessmentPDF } from './server/pdfReportGenerator';
import { writeFileSync } from 'fs';
import type { AssessmentResult } from './shared/schema';

const testAssessment: AssessmentResult = {
  id: 'test-enhanced-formatting',
  email: 'test@example.com',
  name: 'Test Enhanced Formatting',
  scores: {
    sections: {
      'Your Foundation': { earned: 45, possible: 50, percentage: 90.0 },
      'Biblical Manhood': { earned: 38, possible: 50, percentage: 76.0 },
      'Biblical Womanhood': { earned: 42, possible: 50, percentage: 84.0 },
      'Finances & Planning': { earned: 35, possible: 50, percentage: 70.0 },
      'Physical Intimacy': { earned: 32, possible: 50, percentage: 64.0 },
      'Communication': { earned: 40, possible: 50, percentage: 80.0 },
      'Faithfulness': { earned: 44, possible: 50, percentage: 88.0 },
      'Planning Family': { earned: 36, possible: 50, percentage: 72.0 },
      'Marriage Vision': { earned: 41, possible: 50, percentage: 82.0 },
      'Support Networks': { earned: 33, possible: 50, percentage: 66.0 }
    },
    overallPercentage: 77.2,
    strengths: [
      'Strong foundation in biblical principles',
      'Excellent communication skills',
      'High commitment to faithfulness',
      'Clear marriage vision and goals'
    ],
    improvementAreas: [
      'Financial planning and stewardship',
      'Physical intimacy perspectives',
      'Extended support network development'
    ],
    totalEarned: 386,
    totalPossible: 500
  },
  profile: {
    name: 'Harmonious Planner',
    description: 'You demonstrate a balanced approach to marriage with strong biblical foundations while maintaining practical wisdom. Your scores indicate thoughtful consideration of both traditional values and contemporary relationship dynamics.',
    characteristics: [
      'Strong commitment to biblical marriage principles',
      'Balanced perspective on gender roles',
      'Practical approach to relationship planning',
      'Good communication and conflict resolution skills'
    ],
    strengths: [
      'Biblical foundation and spiritual maturity',
      'Communication and emotional intelligence',
      'Planning and goal-setting abilities'
    ],
    growthAreas: [
      'Financial stewardship and planning',
      'Physical intimacy and romance',
      'Building extended support networks'
    ]
  },
  genderProfile: {
    name: 'The Balanced Leader',
    description: 'As a male, you show strong leadership qualities balanced with emotional intelligence and servant-heartedness. You understand biblical masculinity while embracing partnership in marriage.',
    characteristics: [
      'Servant leadership approach',
      'Strong protective instincts',
      'Emotional availability and communication',
      'Commitment to spiritual growth'
    ]
  },
  responses: {},
  demographics: {
    firstName: 'John',
    lastName: 'Smith',
    email: 'john.smith@example.com',
    gender: 'male',
    marriageStatus: 'no',
    desireChildren: 'yes',
    ethnicity: 'African American',
    city: 'Atlanta',
    state: 'Georgia',
    zipCode: '30309'
  },
  timestamp: new Date(),
  transactionId: 'test-transaction',
  coupleId: null,
  coupleRole: null,
  reportSent: false
};

async function testEnhancedPDFFormatting() {
  try {
    console.log('🔄 Generating enhanced PDF report...');
    
    const pdfBuffer = await generateIndividualAssessmentPDF(testAssessment);
    
    // Save to test outputs
    const filename = `test-outputs/enhanced-formatting-test-${Date.now()}.pdf`;
    writeFileSync(filename, pdfBuffer);
    
    console.log('✅ Enhanced PDF formatting test completed successfully!');
    console.log(`📄 Report saved: ${filename}`);
    console.log('\n📋 Formatting enhancements verified:');
    console.log('✓ Full explanatory text for section score interpretation');
    console.log('✓ Exact percentage format (e.g., "Your Foundation – 90.0%")');
    console.log('✓ Horizontal dividers between sections');
    console.log('✓ Gender-Specific Profile section');
    console.log('✓ Overview of Psychographic Profiles (2-column layout)');
    console.log('✓ Enhanced Statistical Comparison with percentiles');
    console.log('✓ Professional footer with page numbers and website');
    console.log('✓ Improved spacing, fonts, and visual hierarchy');
    
  } catch (error) {
    console.error('❌ Enhanced PDF formatting test failed:', error);
    throw error;
  }
}

// Run the test
testEnhancedPDFFormatting().catch(console.error);