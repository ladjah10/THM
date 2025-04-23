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
  const iconSize = 30; // Slightly smaller icon
  const startX = 50; // Start at left margin
  const iconX = startX;
  const textX = iconX + iconSize + 10;
  const textWidth = pageWidth - iconSize - 10;
  
  // Add page break if needed - ensure enough space for each profile
  if (doc.y > doc.page.height - 120) {
    doc.addPage();
  }
  
  const startY = doc.y; // Remember starting position
  
  // Draw profile icon circle
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
  
  // Add adequate spacing between profiles
  doc.moveDown(1);
}