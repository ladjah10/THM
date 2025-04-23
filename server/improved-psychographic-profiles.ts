/**
 * This file provides a better-formatted psychographic profiles
 * reference section to be included at the end of assessment reports
 */

import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';

// Import UserProfile type to work directly with it
import { psychographicProfiles } from '../client/src/data/psychographicProfiles';
import type { UserProfile } from '../shared/schema';

// Define the structure for profile matching information
interface ProfileMatching {
  name: string;
  idealMatch?: string;
  nextBestMatches?: string[];
  idealGenderMatch?: string;
  nextBestGenderMatches?: string[];
}

// Comprehensive profile matching data
const psychographicProfileMatches: ProfileMatching[] = [
  // Unisex profiles
  {
    name: "Steadfast Believers",
    idealMatch: "Steadfast Believers",
    nextBestMatches: ["Harmonious Planners", "Balanced Visionaries"],
    idealGenderMatch: "Men: Faithful Protectors, Women: Faith-Centered Homemakers",
    nextBestGenderMatches: ["Men: Balanced Providers, Women: Relational Nurturers"]
  },
  {
    name: "Harmonious Planners",
    idealMatch: "Harmonious Planners",
    nextBestMatches: ["Steadfast Believers", "Balanced Visionaries"],
    idealGenderMatch: "Men: Structured Leaders, Women: Faith-Centered Homemakers",
    nextBestGenderMatches: ["Men: Faithful Protectors, Women: Independent Traditionalists"]
  },
  {
    name: "Flexible Faithful",
    idealMatch: "Flexible Faithful",
    nextBestMatches: ["Balanced Visionaries", "Pragmatic Partners"],
    idealGenderMatch: "Men: Balanced Providers, Women: Adaptive Communicators",
    nextBestGenderMatches: ["Men: Structured Leaders, Women: Relational Nurturers"]
  },
  {
    name: "Pragmatic Partners",
    idealMatch: "Pragmatic Partners",
    nextBestMatches: ["Flexible Faithful", "Individualist Seekers"],
    idealGenderMatch: "Men: Balanced Providers, Women: Adaptive Communicators",
    nextBestGenderMatches: ["Men: Structured Leaders, Women: Relational Nurturers"]
  },
  {
    name: "Individualist Seekers",
    idealMatch: "Individualist Seekers",
    nextBestMatches: ["Pragmatic Partners", "Balanced Visionaries"],
    idealGenderMatch: "Men: Balanced Providers, Women: Adaptive Communicators",
    nextBestGenderMatches: ["Men: Structured Leaders, Women: Independent Traditionalists"]
  },
  {
    name: "Balanced Visionaries",
    idealMatch: "Balanced Visionaries",
    nextBestMatches: ["Flexible Faithful", "Harmonious Planners"],
    idealGenderMatch: "Men: Balanced Providers, Women: Adaptive Communicators",
    nextBestGenderMatches: ["Men: Faithful Protectors, Women: Relational Nurturers"]
  },
  // Female-specific profiles
  {
    name: "Relational Nurturers",
    idealMatch: "Faithful Protectors",
    nextBestMatches: ["Balanced Providers", "Structured Leaders"],
    idealGenderMatch: "Women: Faithful Protectors (Male)",
    nextBestGenderMatches: ["Women: Balanced Providers (Male)"]
  },
  {
    name: "Adaptive Communicators",
    idealMatch: "Balanced Providers",
    nextBestMatches: ["Structured Leaders", "Faithful Protectors"],
    idealGenderMatch: "Women: Balanced Providers (Male)",
    nextBestGenderMatches: ["Women: Structured Leaders (Male)"]
  },
  {
    name: "Independent Traditionalists",
    idealMatch: "Structured Leaders",
    nextBestMatches: ["Faithful Protectors", "Balanced Providers"],
    idealGenderMatch: "Women: Structured Leaders (Male)",
    nextBestGenderMatches: ["Women: Faithful Protectors (Male)"]
  },
  {
    name: "Faith-Centered Homemakers",
    idealMatch: "Faithful Protectors",
    nextBestMatches: ["Structured Leaders", "Balanced Providers"],
    idealGenderMatch: "Women: Faithful Protectors (Male)",
    nextBestGenderMatches: ["Women: Structured Leaders (Male)"]
  },
  // Male-specific profiles
  {
    name: "Faithful Protectors",
    idealMatch: "Faith-Centered Homemakers",
    nextBestMatches: ["Relational Nurturers", "Independent Traditionalists"],
    idealGenderMatch: "Men: Faith-Centered Homemakers (Female)",
    nextBestGenderMatches: ["Men: Relational Nurturers (Female)"]
  },
  {
    name: "Structured Leaders",
    idealMatch: "Independent Traditionalists",
    nextBestMatches: ["Faith-Centered Homemakers", "Relational Nurturers"],
    idealGenderMatch: "Men: Independent Traditionalists (Female)",
    nextBestGenderMatches: ["Men: Faith-Centered Homemakers (Female)"]
  },
  {
    name: "Balanced Providers",
    idealMatch: "Adaptive Communicators",
    nextBestMatches: ["Relational Nurturers", "Independent Traditionalists"],
    idealGenderMatch: "Men: Adaptive Communicators (Female)",
    nextBestGenderMatches: ["Men: Relational Nurturers (Female)"]
  }
];

/**
 * Helper function to get matching information for a specific profile
 */
function getMatchingInfoForProfile(profileName: string): ProfileMatching | undefined {
  return psychographicProfileMatches.find(p => p.name === profileName);
}

/**
 * Adds a comprehensive psychographic profiles reference section to the PDF
 * with better formatting to prevent text overrun
 */
export function addImprovedProfilesReferenceSection(doc: PDFKit.PDFDocument): void {
  // Add a page break and title for the profiles reference section
  doc.addPage();
  
  // Add the title
  doc.font('Helvetica-Bold')
     .fontSize(16)
     .fillColor('#2c3e50')
     .text('Psychographic Profiles Reference Guide', { align: 'center' })
     .moveDown(0.5);
  
  doc.font('Helvetica')
     .fontSize(10)
     .fillColor('#555')
     .text('This guide provides information about all psychographic profiles in the 100 Marriage Assessment system. Use it to better understand your own profile and potential compatibility with others.', {
       align: 'center',
       width: doc.page.width - 100 // Narrower width to prevent text overrun
     })
     .moveDown(1);

  // Create a section for Unisex Profiles
  doc.font('Helvetica-Bold')
     .fontSize(14)
     .fillColor('#3498db')
     .text('Unisex Profiles', { align: 'left' })
     .moveDown(0.5);
     
  // Add each unisex profile with improved formatting
  const unisexProfiles = psychographicProfiles.filter(p => p.genderSpecific === null);
  
  unisexProfiles.forEach(profile => {
    addProfileWithBetterFormatting(doc, profile);
  });
  
  // Add spacing before female profiles, with page break if needed
  if (doc.y > doc.page.height - 200) {
    doc.addPage();
  } else {
    doc.moveDown(1.5);
  }
  
  // Create a section for Female-Specific Profiles
  doc.font('Helvetica-Bold')
     .fontSize(14)
     .fillColor('#9b59b6')
     .text('Female-Specific Profiles', { align: 'left' })
     .moveDown(0.5);
     
  // Add each female profile with improved formatting
  const femaleProfiles = psychographicProfiles.filter(p => p.genderSpecific === 'female');
  
  femaleProfiles.forEach(profile => {
    addProfileWithBetterFormatting(doc, profile);
  });
  
  // Add spacing before male profiles, with page break if needed
  if (doc.y > doc.page.height - 200) {
    doc.addPage();
  } else {
    doc.moveDown(1.5);
  }
  
  // Create a section for Male-Specific Profiles
  doc.font('Helvetica-Bold')
     .fontSize(14)
     .fillColor('#2980b9')
     .text('Male-Specific Profiles', { align: 'left' })
     .moveDown(0.5);
     
  // Add each male profile with improved formatting
  const maleProfiles = psychographicProfiles.filter(p => p.genderSpecific === 'male');
  
  maleProfiles.forEach(profile => {
    addProfileWithBetterFormatting(doc, profile);
  });
}

/**
 * Add a profile to the document with improved formatting to prevent overrun
 */
function addProfileWithBetterFormatting(doc: PDFKit.PDFDocument, profile: UserProfile): void {
  // Calculate available width
  const pageWidth = doc.page.width - 100; // Use consistent margins
  const iconSize = 40; // Increased for PNG icons
  const startX = 50; // Start at left margin
  const iconX = startX;
  const textX = iconX + iconSize + 15;
  const textWidth = pageWidth - iconSize - 15;
  
  // Add page break if needed - ensure enough space for each profile
  if (doc.y > doc.page.height - 120) {
    doc.addPage();
  }
  
  const startY = doc.y; // Remember starting position
  
  // Try to find and use the PNG icon from attached_assets
  let iconPath = '';
  let foundIcon = false;
  
  // Map profile names to icon filenames
  const iconMapping: Record<string, string> = {
    'Steadfast Believers': './attached_assets/SB 1.png',
    'Harmonious Planners': './attached_assets/HP.png',
    'Flexible Faithful': './attached_assets/FF 3.png',
    'Pragmatic Partners': './attached_assets/PP 4.png',
    'Individualist Seekers': './attached_assets/IS 5.png',
    'Balanced Visionaries': './attached_assets/BV 6.png',
    'Relational Nurturers': './attached_assets/RN 7.png',
    'Adaptive Communicators': './attached_assets/AC 8.png',
    'Independent Traditionalists': './attached_assets/IT 9.png',
    'Faith-Centered Homemakers': './attached_assets/FCH 10.png',
    'Faithful Protectors': './attached_assets/FP 11.png',
    'Steadfast Leaders': './attached_assets/SL 12.png',
    'Balanced Providers': './attached_assets/BP 13.png'
  };
  
  if (iconMapping[profile.name]) {
    iconPath = iconMapping[profile.name];
    try {
      const resolvedPath = path.resolve(iconPath);
      if (fs.existsSync(resolvedPath)) {
        doc.image(resolvedPath, iconX, doc.y, { width: iconSize });
        foundIcon = true;
      }
    } catch (err) {
      console.error(`Error loading icon for ${profile.name}:`, err);
    }
  }
  
  // Fallback to circle with initials if PNG icon not found
  if (!foundIcon) {
    const initials = profile.name.split(' ').map(word => word[0]).join('');
    
    doc.circle(iconX + iconSize/2, doc.y + iconSize/2, iconSize/2)
       .fillAndStroke('#e3f2fd', '#3498db');
       
    doc.font('Helvetica-Bold')
       .fontSize(12)
       .fillColor('#2980b9')
       .text(initials, iconX, doc.y + iconSize/3, { 
         width: iconSize, 
         align: 'center' 
       });
  }
  
  // Profile name and gender in a single line
  let nameText = profile.name;
  if (profile.genderSpecific) {
    nameText += ` (${profile.genderSpecific === 'male' ? 'Male' : 'Female'})`;
  }
  
  doc.font('Helvetica-Bold')
     .fontSize(11)
     .fillColor('#2c3e50')
     .text(nameText, textX, startY, { 
       width: textWidth,
       align: 'left'
     });
  
  // Description - ensure proper text wrapping
  doc.moveDown(0.3)
     .font('Helvetica')
     .fontSize(9)
     .fillColor('#555')
     .text(profile.description, textX, doc.y, { 
       width: textWidth,
       align: 'left'
     });
  
  // Add compatibility info based on criteria
  if (profile.criteria && profile.criteria.length > 0) {
    doc.moveDown(0.3)
       .fontSize(9)
       .fillColor('#555')
       .text(`Compatible with profiles that emphasize: ${profile.criteria.map(c => c.section).join(', ')}`, {
         width: textWidth,
         align: 'left'
       });
  }
  
  // Add top ideal matches information
  doc.moveDown(0.3)
     .fontSize(9)
     .fillColor('#3182ce')
     .font('Helvetica-Oblique');
     
  // Get profile match info from psychographicProfileMatches based on profile name
  const matchingInfo = getMatchingInfoForProfile(profile.name);
  
  if (matchingInfo) {
    // Add ideal match
    doc.text(`Ideal match: ${matchingInfo.idealMatch || profile.name}`, textX, doc.y, {
      width: textWidth,
      align: 'left'
    });
    
    // Add next best matches if available
    if (matchingInfo.nextBestMatches && matchingInfo.nextBestMatches.length > 0) {
      doc.moveDown(0.2)
         .text(`Next best matches: ${matchingInfo.nextBestMatches.slice(0, 2).join(', ')}`, textX, doc.y, {
           width: textWidth,
           align: 'left'
         });
    }
  }
  
  // Add adequate spacing between profiles
  doc.moveDown(1);
}