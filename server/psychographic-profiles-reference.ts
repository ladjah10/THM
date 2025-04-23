/**
 * This file provides functionality for generating a comprehensive psychographic profiles
 * reference section to be included at the end of assessment reports
 */

import PDFDocument from 'pdfkit';
import path from 'path';
import fs from 'fs';

// Define the psychographic profiles data structure
interface ProfileReference {
  id: number;
  name: string;
  description: string;
  genderSpecific: string | null;
  iconPath: string;
  idealMatch?: string;
  nextBestMatches?: string[];
  idealGenderMatch?: string;
  nextBestGenderMatches?: string[];
  implications?: string;
}

// Complete list of all psychographic profiles with their details
const psychographicProfiles: ProfileReference[] = [
  // Unisex profiles
  {
    id: 1,
    name: "Steadfast Believers",
    description: "You have a strong commitment to faith as the foundation of your relationship. You value traditional marriage roles and have clear expectations for family life. Your decisions are firmly guided by your interpretation of scripture, and you're unwavering in your convictions.",
    genderSpecific: null,
    iconPath: "/attached_assets/SB 1.png",
    idealMatch: "Steadfast Believers",
    nextBestMatches: ["Harmonious Planners", "Balanced Visionaries"],
    idealGenderMatch: "Men: Faithful Protectors, Women: Faith-Centered Homemakers",
    nextBestGenderMatches: ["Men: Balanced Providers, Structured Leaders", "Women: Relational Nurturers, Independent Traditionalists"],
    implications: "Your strong faith and traditional values mean you'll thrive with someone who shares your spiritual commitment and family focus. Expectation alignment is highest with Steadfast Believers, but Harmonious Planners and Balanced Visionaries can complement your values if faith is discussed."
  },
  {
    id: 2,
    name: "Harmonious Planners",
    description: "You value structure and careful planning in your relationship while maintaining strong faith values. You're committed to establishing clear expectations and boundaries in your marriage while prioritizing your spiritual foundation.",
    genderSpecific: null,
    iconPath: "/attached_assets/HP.png",
    idealMatch: "Harmonious Planners",
    nextBestMatches: ["Steadfast Believers", "Balanced Visionaries"],
    idealGenderMatch: "Men: Structured Leaders, Women: Adaptive Communicators",
    nextBestGenderMatches: ["Men: Faithful Protectors, Balanced Providers", "Women: Faith-Centered Homemakers, Relational Nurturers"],
    implications: "You value structure and faith, so you'll connect best with partners who share your planning mindset. Harmonious Planners are ideal, while Steadfast Believers and Balanced Visionaries offer similar alignment with slight variations."
  },
  {
    id: 3,
    name: "Flexible Faithful",
    description: "While your faith is important to you, you balance spiritual conviction with practical adaptability. You value communication and compromise, seeking to honor your beliefs while remaining flexible in how you apply them to daily life.",
    genderSpecific: null,
    iconPath: "/attached_assets/FF 3.png",
    idealMatch: "Flexible Faithful",
    nextBestMatches: ["Balanced Visionaries", "Pragmatic Partners"],
    idealGenderMatch: "Men: Balanced Providers, Women: Adaptive Communicators",
    nextBestGenderMatches: ["Men: Structured Leaders, Faithful Protectors", "Women: Relational Nurturers, Independent Traditionalists"],
    implications: "Your balance of faith and adaptability makes you versatile. Flexible Faithful matches align best, but Balanced Visionaries and Pragmatic Partners complement your communication focus with mutual respect."
  },
  {
    id: 6,
    name: "Balanced Visionaries",
    description: "You have a thoughtful, balanced approach to marriage. You value both tradition and modern perspectives, seeking harmony between stability and flexibility. Your responses show a well-rounded understanding of marriage dynamics with a natural ability to adapt while maintaining core values.",
    genderSpecific: null,
    iconPath: "/attached_assets/BV 6.png",
    idealMatch: "Balanced Visionaries",
    nextBestMatches: ["Harmonious Planners", "Flexible Faithful"],
    idealGenderMatch: "Men: Faithful Protectors, Women: Faith-Centered Homemakers",
    nextBestGenderMatches: ["Men: Balanced Providers, Structured Leaders", "Women: Relational Nurturers, Adaptive Communicators"],
    implications: "Your balanced approach pairs well with similar mindsets. Balanced Visionaries are ideal, while Harmonious Planners and Flexible Faithful share your values with slight variations."
  },
  {
    id: 5,
    name: "Individualist Seekers",
    description: "You prioritize personal growth and autonomy within relationships. While respecting partnership, you maintain strong boundaries and expect independence. Your approach to marriage emphasizes equality, shared decision-making, and mutual support while preserving individual identity.",
    genderSpecific: null,
    iconPath: "/attached_assets/IS 5.png",
    idealMatch: "Individualist Seekers",
    nextBestMatches: ["Pragmatic Partners", "Flexible Faithful"],
    idealGenderMatch: "Men: Balanced Providers, Women: Independent Traditionalists",
    nextBestGenderMatches: ["Men: Structured Leaders, Faithful Protectors", "Women: Adaptive Communicators, Relational Nurturers"],
    implications: "Your focus on independence connects with partners who respect autonomy. Individualist Seekers are best, while Pragmatic Partners and Flexible Faithful offer complementary practicality and adaptability."
  },
  {
    id: 13,
    name: "Pragmatic Partners",
    description: "You approach marriage with a practical, results-oriented mindset. You value clear communication, mutual respect, and shared responsibility. Your decisions are based on what works best for both partners rather than rigid ideals or traditions.",
    genderSpecific: null,
    iconPath: "/attached_assets/BP 13.png",
    idealMatch: "Pragmatic Partners",
    nextBestMatches: ["Flexible Faithful", "Individualist Seekers"],
    idealGenderMatch: "Men: Balanced Providers, Women: Independent Traditionalists",
    nextBestGenderMatches: ["Men: Structured Leaders, Faithful Protectors", "Women: Adaptive Communicators, Relational Nurturers"],
    implications: "You prioritize practicality and communication, thriving with partners who value fairness. Pragmatic Partners are ideal, while Flexible Faithful and Individualist Seekers align on practicality with less faith intensity."
  },
  
  // Women-specific profiles
  {
    id: 7,
    name: "Relational Nurturers",
    description: "As a Relational Nurturer, you have a natural ability to create emotional security and connection in relationships. You prioritize family cohesion and emotional well-being, making you an empathetic and supportive partner who creates a warm, nurturing environment.",
    genderSpecific: "female",
    iconPath: "/attached_assets/RN 7.png",
    idealMatch: "Steadfast Believers",
    nextBestMatches: ["Harmonious Planners", "Balanced Visionaries"],
    idealGenderMatch: "Faithful Protectors",
    nextBestGenderMatches: ["Balanced Providers", "Structured Leaders"],
    implications: "Your nurturing nature thrives with a partner who values family and faith. A Faithful Protector's leadership aligns best, while Balanced Providers and Structured Leaders offer stability and structure."
  },
  {
    id: 8,
    name: "Adaptive Communicators",
    description: "As an Adaptive Communicator, you excel at creating understanding through clear, empathetic expression. Your approach to relationships emphasizes openness, active listening, and emotional intelligence, making you particularly skilled at navigating challenges through conversation and compromise.",
    genderSpecific: "female",
    iconPath: "/attached_assets/AC 8.png",
    idealMatch: "Harmonious Planners",
    nextBestMatches: ["Balanced Visionaries", "Flexible Faithful"],
    idealGenderMatch: "Structured Leaders",
    nextBestGenderMatches: ["Faithful Protectors", "Balanced Providers"],
    implications: "Your communication skills pair with a partner who values clarity. Structured Leaders are ideal, while Faithful Protectors and Balanced Providers complement your faith and balance."
  },
  {
    id: 10,
    name: "Faith-Centered Homemakers",
    description: "As a Faith-Centered Homemaker, your faith deeply informs your approach to home and family. You create a spiritually nurturing environment and value traditions that strengthen family bonds. Your commitment to faith-based living provides stability and moral guidance to your household.",
    genderSpecific: "female",
    iconPath: "/attached_assets/FCH 10.png",
    idealMatch: "Steadfast Believers",
    nextBestMatches: ["Harmonious Planners", "Balanced Visionaries"],
    idealGenderMatch: "Faithful Protectors",
    nextBestGenderMatches: ["Balanced Providers", "Structured Leaders"],
    implications: "Your spiritual home focus thrives with a faith-driven partner. Faithful Protectors are ideal, while Balanced Providers and Structured Leaders support your family values."
  },
  {
    id: 5,
    name: "Independent Traditionalists",
    description: "As an Independent Traditionalist, you balance respect for tradition with personal autonomy. You value conventional relationship structures while maintaining your independence and voice. Your approach combines the stability of traditional values with modern expectations for equality and respect.",
    genderSpecific: "female",
    iconPath: "/attached_assets/IS 5.png",
    idealMatch: "Pragmatic Partners",
    nextBestMatches: ["Flexible Faithful", "Individualist Seekers"],
    idealGenderMatch: "Balanced Providers",
    nextBestGenderMatches: ["Faithful Protectors", "Structured Leaders"],
    implications: "Your blend of tradition and independence matches with a stable partner. Balanced Providers align best, while Faithful Protectors and Structured Leaders share your traditional values."
  },
  
  // Men-specific profiles
  {
    id: 4,
    name: "Principled Provider",
    description: "As a Principled Provider, you bring stability and structure to relationships. You value being a reliable partner and are dedicated to establishing a secure foundation for your family. Your traditional approach to leadership and protection makes you an anchoring presence in your marriage.",
    genderSpecific: "male",
    iconPath: "/attached_assets/PP 4.png"
  },
  {
    id: 11,
    name: "Faithful Protectors",
    description: "As a Faithful Protector, you see spiritual leadership as central to your role in marriage. You value providing moral guidance, security, and stability for your family. Your commitment to faith-based principles guides your decisions and you take seriously your responsibility to protect and provide.",
    genderSpecific: "male",
    iconPath: "/attached_assets/FP 11.png",
    idealMatch: "Steadfast Believers",
    nextBestMatches: ["Harmonious Planners", "Balanced Visionaries"],
    idealGenderMatch: "Faith-Centered Homemakers",
    nextBestGenderMatches: ["Relational Nurturers", "Independent Traditionalists"],
    implications: "Your leadership and faith pair with a spiritually focused partner. Faith-Centered Homemakers align best, while Relational Nurturers and Independent Traditionalists share your family and traditional values."
  },
  {
    id: 12,
    name: "Structured Leaders",
    description: "As a Structured Leader, you bring organization, stability, and clear direction to relationships. You value planning, goal-setting, and establishing clear expectations. Your methodical approach to life and marriage creates a sense of security and purpose for your partnership.",
    genderSpecific: "male",
    iconPath: "/attached_assets/SL 12.png",
    idealMatch: "Harmonious Planners",
    nextBestMatches: ["Balanced Visionaries", "Flexible Faithful"],
    idealGenderMatch: "Adaptive Communicators",
    nextBestGenderMatches: ["Relational Nurturers", "Faith-Centered Homemakers"],
    implications: "Your clarity and structure match with a communicative partner. Adaptive Communicators are ideal, while Relational Nurturers and Faith-Centered Homemakers complement your family focus."
  },
  {
    id: 9,
    name: "Intuitive Teammate",
    description: "As an Intuitive Teammate, you excel at understanding your partner's needs and supporting them in meaningful ways. You have a natural ability to create harmony and connection. Your empathetic nature allows you to anticipate challenges and navigate them with grace.",
    genderSpecific: "male",
    iconPath: "/attached_assets/IT 9.png"
  },
  {
    id: 13,
    name: "Balanced Providers",
    description: "As a Balanced Provider, you combine practical support with emotional presence. You take responsibility for both financial and relational aspects of partnership, seeking balance in all areas. Your approach values equality, open communication, and shared decision-making while maintaining stability.",
    genderSpecific: "male",
    iconPath: "/attached_assets/BP 13.png",
    idealMatch: "Pragmatic Partners",
    nextBestMatches: ["Flexible Faithful", "Individualist Seekers"],
    idealGenderMatch: "Independent Traditionalists",
    nextBestGenderMatches: ["Faith-Centered Homemakers", "Relational Nurturers"],
    implications: "Your stability and balance pair with an independent partner. Independent Traditionalists align best, while Faith-Centered Homemakers and Relational Nurturers support your faith and family priorities."
  }
];

/**
 * Add a profiles reference section to an existing PDF document
 * @param doc PDF document to add the profiles reference to
 */
export function addProfilesReferenceSection(doc: PDFKit.PDFDocument): void {
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
     .text('This guide provides information about all psychographic profiles in the 100 Marriage Assessment system. Use it to better understand your own profile and potential compatibility with others.', { align: 'center' })
     .moveDown(1);

  // Create a section for Unisex Profiles
  doc.font('Helvetica-Bold')
     .fontSize(14)
     .fillColor('#3498db')
     .text('Unisex Profiles', { align: 'left' })
     .moveDown(0.5);
     
  // Add each unisex profile with more compact formatting
  const unisexProfiles = psychographicProfiles.filter(p => p.genderSpecific === null);
  
  unisexProfiles.forEach(profile => {
    addProfileToDocument(doc, profile);
  });
  
  // Add a page break before the gender-specific profiles, making sure we have enough space
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
     
  // Add each female profile
  const femaleProfiles = psychographicProfiles.filter(p => p.genderSpecific === 'female');
  
  femaleProfiles.forEach(profile => {
    addProfileToDocument(doc, profile);
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
     
  // Add each male profile
  const maleProfiles = psychographicProfiles.filter(p => p.genderSpecific === 'male');
  
  maleProfiles.forEach(profile => {
    addProfileToDocument(doc, profile);
  });
  
  // Add a final note, making sure it won't be cut off at the bottom of the page
  if (doc.y > doc.page.height - 70) {
    doc.addPage();
  } else {
    doc.moveDown(1);
  }
  
  doc.font('Helvetica')
     .fontSize(9)
     .fillColor('#555')
     .text('Note: This profiles reference is provided to help you understand the different personality types identified by the 100 Marriage Assessment. Compatibility is based on similar values and complementary traits, but remember that awareness and communication are most important for relationship success.', { align: 'center' });
}

/**
 * Add a single profile to the PDF document with its icon and details
 * @param doc PDF document
 * @param profile The profile to add
 */
function addProfileToDocument(doc: PDFKit.PDFDocument, profile: ProfileReference): void {
  const pageWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
  const iconSize = 35; // Smaller icon size
  const iconX = doc.x;
  const textX = iconX + iconSize + 10;
  const textWidth = pageWidth - iconSize - 10;
  
  // Calculate if we need a page break, with less space required
  if (doc.y > doc.page.height - 130) {
    doc.addPage();
  }
  
  // Draw a circle with the profile initials
  const initials = profile.name.split(' ').map(word => word[0]).join('');
  
  doc.circle(iconX + iconSize/2, doc.y + iconSize/2, iconSize/2)
     .fillAndStroke('#e3f2fd', '#3498db');
     
  doc.font('Helvetica-Bold')
     .fontSize(14) // Smaller font
     .fillColor('#2980b9')
     .text(initials, iconX, doc.y + iconSize/3, { 
       width: iconSize, 
       align: 'center' 
     });
  
  // Add profile name
  doc.font('Helvetica-Bold')
     .fontSize(11) // Smaller font
     .fillColor('#2c3e50')
     .text(profile.name, textX, doc.y - iconSize, { 
       width: textWidth,
       continued: true
     });
     
  // Add gender specification if applicable
  if (profile.genderSpecific) {
    const genderText = profile.genderSpecific === 'male' ? ' (Male)' : ' (Female)';
    doc.font('Helvetica')
       .fontSize(9) // Smaller font
       .fillColor('#7f8c8d')
       .text(genderText);
  } else {
    doc.text(''); // End the line if no gender specification
  }
  
  // Add profile description - more compact
  doc.font('Helvetica')
     .fontSize(9) // Smaller font
     .fillColor('#555')
     .text(profile.description, textX, doc.y, { 
       width: textWidth 
     })
     .moveDown(0.3); // Less space
  
  // Add compatibility information if available - more compact
  if (profile.implications) {
    doc.font('Helvetica')
       .fontSize(8) // Smaller font
       .fillColor('#555')
       .text('Compatibility: ' + profile.implications, textX, doc.y, { 
         width: textWidth 
       });
  }
  
  // Add a dividing line with less space
  doc.moveDown(0.5); // Less space
  doc.moveTo(doc.page.margins.left, doc.y)
     .lineTo(doc.page.width - doc.page.margins.right, doc.y)
     .stroke('#e0e0e0')
     .moveDown(0.3); // Less space
}

/**
 * Generates a standalone PDF with all psychographic profiles
 * @returns Buffer containing the PDF
 */
export async function generateProfilesReferencePDF(): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    try {
      const buffers: Buffer[] = [];
      const doc = new PDFDocument({
        margin: 50,
        size: 'A4',
        bufferPages: true,
      });
      
      // Collect PDF data chunks
      doc.on('data', buffers.push.bind(buffers));
      
      // When document is done being created, resolve with the PDF buffer
      doc.on('end', () => {
        const pdfData = Buffer.concat(buffers);
        resolve(pdfData);
      });
      
      // Add a cover page
      doc.font('Helvetica-Bold')
         .fontSize(24)
         .fillColor('#2c3e50')
         .text('The 100 Marriage Assessment', { align: 'center' })
         .moveDown(0.5)
         .fontSize(18)
         .fillColor('#3498db')
         .text('Psychographic Profiles Reference Guide', { align: 'center' })
         .moveDown(2);
         
      // Add a brief introduction
      doc.font('Helvetica')
         .fontSize(12)
         .fillColor('#333')
         .text('This guide contains detailed information about all the psychographic profiles used in The 100 Marriage Assessment system. Each profile represents a distinct personality type based on responses to assessment questions about faith, family, finances, and other key areas of marriage expectations.', { align: 'left' })
         .moveDown(1)
         .text('Use this guide to better understand your own profile and explore potential compatibility with different personality types. Remember that while these profiles provide valuable insights, every relationship is unique and communication remains the most important factor for success.', { align: 'left' })
         .moveDown(2);
         
      // Add the profiles reference content
      addProfilesReferenceSection(doc);
      
      // Finalize the PDF
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}