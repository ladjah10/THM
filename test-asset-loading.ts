/**
 * Test script to verify asset loading functionality for profile icons and images
 */

import { ProfessionalPDFGenerator } from './server/pdfReportGenerator';
import fs from 'fs';
import path from 'path';

async function testAssetLoading() {
  console.log('Testing asset loading functionality...');
  
  // Check what profile icons are available in attached_assets
  const assetsDir = path.resolve(process.cwd(), 'attached_assets');
  console.log(`Checking assets directory: ${assetsDir}`);
  
  if (fs.existsSync(assetsDir)) {
    const files = fs.readdirSync(assetsDir);
    const imageFiles = files.filter(file => 
      /\.(png|jpg|jpeg|gif)$/i.test(file)
    );
    console.log(`Found ${imageFiles.length} image files:`, imageFiles.slice(0, 10));
  } else {
    console.log('Assets directory not found');
  }
  
  const generator = new ProfessionalPDFGenerator();
  
  // Test couple assessment with actual profile icons
  const coupleWithIcons = {
    primary: {
      id: 'test-primary-icons',
      email: 'test1@example.com',
      timestamp: new Date().toISOString(),
      demographics: JSON.stringify({
        firstName: 'John',
        lastName: 'Smith',
        gender: 'male'
      }),
      scores: JSON.stringify({
        overallPercentage: 85.2,
        sections: {
          'Foundation': { percentage: 88.5 },
          'Communication': { percentage: 82.1 }
        },
        strengths: ['Strong foundation'],
        improvementAreas: ['Communication']
      }),
      profile: JSON.stringify({
        name: 'Biblical Foundation Builder',
        description: 'Strong commitment to biblical principles and traditional marriage values.',
        icon: 'BV 6.png', // Reference to actual asset file
        characteristics: ['Faith-centered', 'Traditional values', 'Leadership qualities']
      }),
      genderProfile: JSON.stringify({
        name: 'The Protector Leader', 
        description: 'Traditional masculine leadership approach with protective family values.',
        icon: 'BP 13.png', // Reference to actual asset file
        traits: ['Protective nature', 'Spiritual leadership', 'Family-focused']
      })
    },
    spouse: {
      id: 'test-spouse-icons',
      email: 'test2@example.com',
      timestamp: new Date().toISOString(),
      demographics: JSON.stringify({
        firstName: 'Sarah',
        lastName: 'Smith',
        gender: 'female'
      }),
      scores: JSON.stringify({
        overallPercentage: 79.8,
        sections: {
          'Foundation': { percentage: 81.3 },
          'Communication': { percentage: 85.7 }
        },
        strengths: ['Excellent communication'],
        improvementAreas: ['Financial planning']
      }),
      profile: JSON.stringify({
        name: 'Harmonious Communicator',
        description: 'Balanced approach emphasizing communication and emotional connection.',
        icon: 'IS 5.png', // Reference to actual asset file
        characteristics: ['Communication skills', 'Emotional intelligence', 'Family-oriented']
      }),
      genderProfile: JSON.stringify({
        name: 'The Nurturing Partner',
        description: 'Caring approach emphasizing emotional connection and family support.',
        icon: 'FF 3.png', // Reference to actual asset file
        traits: ['Nurturing spirit', 'Emotional support', 'Home-building focus']
      })
    },
    compatibilityScore: 87.3,
    differenceAnalysis: {
      alignmentAreas: [
        { section: 'Foundation', analysis: 'Strong shared biblical values' }
      ],
      significantDifferences: [
        { section: 'Communication', analysis: 'Different communication styles' }
      ]
    },
    recommendations: [
      'Build on shared foundation',
      'Practice active listening techniques'
    ]
  };
  
  // Test with missing icons to verify fallback behavior
  const coupleWithMissingIcons = {
    primary: {
      id: 'test-missing-icons',
      email: 'missing1@example.com',
      timestamp: new Date().toISOString(),
      demographics: JSON.stringify({
        firstName: 'Alex',
        lastName: 'Johnson'
      }),
      scores: JSON.stringify({
        overallPercentage: 75.0,
        sections: {},
        strengths: [],
        improvementAreas: []
      }),
      profile: JSON.stringify({
        name: 'Test Profile',
        description: 'Test profile with missing icon.',
        icon: 'nonexistent-icon.png' // This file doesn't exist
      }),
      genderProfile: JSON.stringify({
        name: 'Test Gender Profile',
        description: 'Test gender profile with missing icon.',
        icon: 'another-missing-icon.jpg' // This file doesn't exist
      })
    },
    spouse: {
      id: 'test-missing-icons-2',
      email: 'missing2@example.com',
      timestamp: new Date().toISOString(),
      demographics: JSON.stringify({
        firstName: 'Jamie',
        lastName: 'Johnson'
      }),
      scores: JSON.stringify({
        overallPercentage: 72.0,
        sections: {},
        strengths: [],
        improvementAreas: []
      }),
      profile: JSON.stringify({
        name: 'Another Test Profile',
        description: 'Another test profile with missing icon.',
        icon: 'does-not-exist.png' // This file doesn't exist
      })
    },
    compatibilityScore: 73.5
  };
  
  try {
    console.log('Generating PDF with actual profile icons...');
    const pdfWithIcons = await generator.generateCoupleReport(coupleWithIcons);
    
    if (pdfWithIcons && pdfWithIcons.length > 0) {
      fs.writeFileSync('test-outputs/couple-with-icons-test.pdf', pdfWithIcons);
      console.log(`✓ PDF with icons generated: ${pdfWithIcons.length} bytes`);
    }
  } catch (error) {
    console.log(`✗ Failed to generate PDF with icons: ${error}`);
  }
  
  try {
    console.log('Generating PDF with missing icons (fallback test)...');
    const pdfWithMissingIcons = await generator.generateCoupleReport(coupleWithMissingIcons);
    
    if (pdfWithMissingIcons && pdfWithMissingIcons.length > 0) {
      fs.writeFileSync('test-outputs/couple-missing-icons-test.pdf', pdfWithMissingIcons);
      console.log(`✓ PDF with missing icons handled gracefully: ${pdfWithMissingIcons.length} bytes`);
    }
  } catch (error) {
    console.log(`✗ Failed to handle missing icons gracefully: ${error}`);
  }
  
  console.log('Asset loading testing completed.');
}

// Ensure test-outputs directory exists
if (!fs.existsSync('test-outputs')) {
  fs.mkdirSync('test-outputs');
}

testAssetLoading().catch(console.error);