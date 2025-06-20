/**
 * Analyze Score Bands for Each Psychographic Profile
 * Determines the overall assessment score ranges that correlate with each profile
 */

import { psychographicProfiles } from './client/src/data/psychographicProfiles';
import { questions } from './client/src/data/questionsData';

interface SectionWeights {
  [sectionName: string]: {
    totalWeight: number;
    questionCount: number;
    averageWeight: number;
  };
}

interface ProfileScoreBand {
  profileId: number;
  profileName: string;
  genderSpecific: string | null;
  minTotalScore: number;
  maxTotalScore: number;
  scoreRange: string;
  criteriaBreakdown: Array<{
    section: string;
    minPercent: number;
    maxPercent?: number;
    minPoints: number;
    maxPoints?: number;
    sectionWeight: number;
  }>;
}

function analyzeSectionWeights(): SectionWeights {
  const sectionWeights: SectionWeights = {};
  
  questions.forEach(question => {
    const section = question.section;
    if (!sectionWeights[section]) {
      sectionWeights[section] = {
        totalWeight: 0,
        questionCount: 0,
        averageWeight: 0
      };
    }
    
    sectionWeights[section].totalWeight += question.weight;
    sectionWeights[section].questionCount += 1;
  });
  
  // Calculate averages
  Object.keys(sectionWeights).forEach(section => {
    const data = sectionWeights[section];
    data.averageWeight = data.totalWeight / data.questionCount;
  });
  
  return sectionWeights;
}

function calculateProfileScoreBands(): ProfileScoreBand[] {
  const sectionWeights = analyzeSectionWeights();
  const totalPossibleScore = Object.values(sectionWeights).reduce((sum, section) => sum + section.totalWeight, 0);
  
  console.log(`\n=== SECTION WEIGHTS ANALYSIS ===`);
  console.log(`Total Possible Score: ${totalPossibleScore} points\n`);
  
  Object.entries(sectionWeights).forEach(([section, data]) => {
    console.log(`${section}:`);
    console.log(`  Total Weight: ${data.totalWeight} points`);
    console.log(`  Questions: ${data.questionCount}`);
    console.log(`  Average Weight: ${data.averageWeight.toFixed(1)} points`);
    console.log('');
  });
  
  const profileScoreBands: ProfileScoreBand[] = [];
  
  psychographicProfiles.forEach(profile => {
    let minTotalScore = 0;
    let maxTotalScore = totalPossibleScore;
    const criteriaBreakdown: ProfileScoreBand['criteriaBreakdown'] = [];
    
    profile.criteria.forEach(criterion => {
      const sectionData = sectionWeights[criterion.section];
      if (!sectionData) {
        console.warn(`Section "${criterion.section}" not found in questions data`);
        return;
      }
      
      const minPoints = Math.round((criterion.min / 100) * sectionData.totalWeight);
      const maxPoints = criterion.max ? Math.round((criterion.max / 100) * sectionData.totalWeight) : sectionData.totalWeight;
      
      criteriaBreakdown.push({
        section: criterion.section,
        minPercent: criterion.min,
        maxPercent: criterion.max,
        minPoints,
        maxPoints,
        sectionWeight: sectionData.totalWeight
      });
      
      // Estimate overall score requirements based on section criteria
      minTotalScore += minPoints;
    });
    
    // Estimate realistic max score based on profile criteria
    // Profiles with stricter criteria typically have higher overall scores
    const strictnessScore = profile.criteria.reduce((sum, c) => sum + c.min, 0) / profile.criteria.length;
    maxTotalScore = Math.round(totalPossibleScore * (0.6 + (strictnessScore / 200))); // 60-90% range
    
    profileScoreBands.push({
      profileId: profile.id,
      profileName: profile.name,
      genderSpecific: profile.genderSpecific,
      minTotalScore,
      maxTotalScore,
      scoreRange: `${Math.round((minTotalScore / totalPossibleScore) * 100)}% - ${Math.round((maxTotalScore / totalPossibleScore) * 100)}%`,
      criteriaBreakdown
    });
  });
  
  return profileScoreBands;
}

function displayProfileScoreBands() {
  const scoreBands = calculateProfileScoreBands();
  
  console.log(`\n=== PSYCHOGRAPHIC PROFILE SCORE BANDS ===\n`);
  
  // Group by gender
  const unisexProfiles = scoreBands.filter(p => !p.genderSpecific);
  const femaleProfiles = scoreBands.filter(p => p.genderSpecific === 'female');
  const maleProfiles = scoreBands.filter(p => p.genderSpecific === 'male');
  
  console.log('🔄 UNISEX PROFILES:');
  unisexProfiles.forEach(profile => {
    console.log(`\n${profile.profileName}:`);
    console.log(`  Score Range: ${profile.scoreRange} (${profile.minTotalScore}-${profile.maxTotalScore} points)`);
    console.log(`  Criteria:`);
    profile.criteriaBreakdown.forEach(criterion => {
      const maxText = criterion.maxPercent ? `-${criterion.maxPercent}%` : '+';
      console.log(`    • ${criterion.section}: ${criterion.minPercent}${maxText} (${criterion.minPoints}${criterion.maxPoints !== criterion.sectionWeight ? `-${criterion.maxPoints}` : '+'} pts of ${criterion.sectionWeight})`);
    });
  });
  
  console.log('\n👩 FEMALE-SPECIFIC PROFILES:');
  femaleProfiles.forEach(profile => {
    console.log(`\n${profile.profileName}:`);
    console.log(`  Score Range: ${profile.scoreRange} (${profile.minTotalScore}-${profile.maxTotalScore} points)`);
    console.log(`  Criteria:`);
    profile.criteriaBreakdown.forEach(criterion => {
      const maxText = criterion.maxPercent ? `-${criterion.maxPercent}%` : '+';
      console.log(`    • ${criterion.section}: ${criterion.minPercent}${maxText} (${criterion.minPoints}${criterion.maxPoints !== criterion.sectionWeight ? `-${criterion.maxPoints}` : '+'} pts of ${criterion.sectionWeight})`);
    });
  });
  
  console.log('\n👨 MALE-SPECIFIC PROFILES:');
  maleProfiles.forEach(profile => {
    console.log(`\n${profile.profileName}:`);
    console.log(`  Score Range: ${profile.scoreRange} (${profile.minTotalScore}-${profile.maxTotalScore} points)`);
    console.log(`  Criteria:`);
    profile.criteriaBreakdown.forEach(criterion => {
      const maxText = criterion.maxPercent ? `-${criterion.maxPercent}%` : '+';
      console.log(`    • ${criterion.section}: ${criterion.minPercent}${maxText} (${criterion.minPoints}${criterion.maxPoints !== criterion.sectionWeight ? `-${criterion.maxPoints}` : '+'} pts of ${criterion.sectionWeight})`);
    });
  });
  
  console.log(`\n=== SCORE BAND SUMMARY ===`);
  console.log(`Total Assessment Score Range: 0-528 points (0-100%)`);
  console.log(`Profile Score Ranges:`);
  
  scoreBands.sort((a, b) => b.minTotalScore - a.minTotalScore).forEach(profile => {
    console.log(`  ${profile.profileName}: ${profile.scoreRange}`);
  });
}

displayProfileScoreBands();