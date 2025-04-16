import React from "react";
import { 
  AssessmentScores, 
  DemographicData 
} from "@/types/assessment";
import { 
  baselineStatistics, 
  getPercentileDescription 
} from "@/utils/statisticsUtils";

interface ComparativeStatsProps {
  scores: AssessmentScores;
  demographics: DemographicData;
}

export function ComparativeStats({ scores, demographics }: ComparativeStatsProps) {
  const genderKey = demographics.gender === 'male' ? 'male' : 'female';
  
  // Calculate "percentile" for overall score (simulated until we have real stats)
  const overallScore = scores.overallPercentage;
  const { mean, standardDeviation } = baselineStatistics.overall.byGender[genderKey];
  
  // Simplified z-score to percentile calculation
  // This gives us a percentile based on standard deviations from the mean
  const zScore = (overallScore - mean) / standardDeviation;
  const percentile = Math.min(99, Math.max(1, Math.round(50 + (zScore * 30))));
  
  // Calculate "percentiles" for each section
  const sectionPercentiles: Record<string, number> = {};
  Object.entries(scores.sections).forEach(([sectionName, sectionScore]) => {
    // Map section names to our baseline statistic keys
    const statsKey = sectionName.replace(/\s+/g, '').toLowerCase();
    const sectionStats = baselineStatistics.sections[statsKey as keyof typeof baselineStatistics.sections];
    
    if (!sectionStats) return;
    
    const sectionMean = sectionStats.byGender[genderKey].mean;
    const sectionStdDev = sectionStats.byGender[genderKey].standardDeviation;
    
    // Calculate percentile for this section
    const sectionZScore = (sectionScore.percentage - sectionMean) / sectionStdDev;
    sectionPercentiles[sectionName] = Math.min(99, Math.max(1, Math.round(50 + (sectionZScore * 30))));
  });

  const genderText = demographics.gender === 'male' ? 'men' : 'women';
  
  return (
    <div className="bg-slate-50 rounded-lg p-6 border border-slate-200 space-y-6">
      <div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">
          How You Compare to Other {genderText.charAt(0).toUpperCase() + genderText.slice(1)}
        </h3>
        <p className="text-gray-600 text-sm mb-2">
          Based on responses from other {genderText} who have taken this assessment,
          here's how your scores compare.
        </p>
        <p className="text-gray-700 text-sm font-semibold mb-4">
          These gender-specific statistics provide insight into how your perspectives align with others of your gender.
        </p>
      </div>
      
      {/* Overall Percentile */}
      <div className="bg-white p-5 rounded-lg shadow-sm border border-gray-100 mb-6">
        <h4 className="font-medium text-gray-800 text-lg mb-4 border-b pb-2">Overall Score Comparison</h4>
        
        <div className="flex flex-col md:flex-row md:items-center gap-4 mb-4">
          {/* Your score box */}
          <div className="flex-1 bg-blue-50 rounded-lg p-4 border border-blue-100">
            <div className="text-sm text-gray-600 mb-1">Your Score:</div>
            <div className="text-2xl font-bold text-blue-600">
              {scores.overallPercentage.toFixed(1)}%
            </div>
          </div>
          
          {/* Gender average box */}
          <div className="flex-1 bg-gray-50 rounded-lg p-4 border border-gray-100">
            <div className="text-sm text-gray-600 mb-1">{genderText.charAt(0).toUpperCase() + genderText.slice(1)} Average:</div>
            <div className="text-2xl font-bold text-gray-600">
              {mean.toFixed(1)}%
            </div>
          </div>
          
          {/* Percentile box */}
          <div className="w-32 text-center bg-blue-100 p-3 rounded-lg">
            <div className="text-2xl font-bold text-blue-700">{percentile}%</div>
            <div className="text-xs text-gray-600">Percentile Rank<br/>among {genderText}</div>
          </div>
        </div>
        
        {/* Percentile Visualization */}
        <div className="mb-3">
          <div className="relative w-full h-8 bg-gray-200 rounded-full overflow-hidden">
            <div
              className="absolute h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full"
              style={{ width: `${percentile}%` }}
            />
            <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white drop-shadow-sm">
              {getPercentileDescription(percentile)}
            </div>
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 mt-1">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
        
        <p className="text-sm text-gray-700 mt-3 bg-blue-50 p-3 rounded border-l-4 border-blue-300">
          Your overall score of <span className="font-semibold">{scores.overallPercentage.toFixed(1)}%</span> is <span className="font-semibold">
          {percentile > 60 ? 'significantly higher than' : 
           percentile > 50 ? 'higher than' : 
           percentile > 40 ? 'close to' : 
           percentile > 25 ? 'lower than' : 
           'significantly lower than'}</span> the average 
          of <span className="font-semibold">{mean.toFixed(1)}%</span> for {genderText} respondents. 
          This places you in the <span className="font-semibold">{percentile}th percentile</span>.
        </p>
      </div>
      
      {/* Section Percentiles */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-800 text-lg border-b pb-2">
          Section Comparisons ({genderText.charAt(0).toUpperCase() + genderText.slice(1)}-specific)
        </h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {Object.entries(scores.sections).map(([sectionName, sectionScore]) => {
            const sectionPercentile = sectionPercentiles[sectionName] || 50;
            const statsKey = sectionName.replace(/\s+/g, '').toLowerCase();
            const sectionStats = baselineStatistics.sections[statsKey as keyof typeof baselineStatistics.sections];
            
            if (!sectionStats) return null;
            
            const sectionMean = sectionStats.byGender[genderKey].mean;
            const scoreDiff = Math.abs(sectionScore.percentage - sectionMean).toFixed(1);
            const scoreComparison = sectionScore.percentage > sectionMean ? 'higher' : 'lower';
            
            return (
              <div key={sectionName} className="bg-white p-5 rounded-lg border shadow-sm">
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-gray-800">{sectionName}</span>
                  <div>
                    <span className="text-blue-600 font-semibold">{sectionScore.percentage.toFixed(1)}%</span>
                    <span className="text-gray-500 text-xs ml-1">({sectionPercentile}th percentile)</span>
                  </div>
                </div>
                
                <div className="relative w-full h-3 bg-gray-100 rounded-full overflow-hidden mb-2">
                  <div
                    className="absolute h-full bg-blue-500 rounded-full"
                    style={{ width: `${sectionPercentile}%` }}
                  />
                </div>
                
                <div className="flex justify-between text-xs text-gray-500 mb-2">
                  <span>0%</span>
                  <span>{genderText.charAt(0).toUpperCase() + genderText.slice(1)} average: {sectionMean.toFixed(1)}%</span>
                  <span>100%</span>
                </div>
                
                <p className="text-xs text-gray-700 mt-2">
                  <span className="font-medium">{getPercentileDescription(sectionPercentile)}:</span> {scoreDiff}% {scoreComparison} than 
                  the average {genderText} respondent
                </p>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Interpretation Guide */}
      <div className="mt-6 bg-blue-50 p-5 rounded-lg border border-blue-200">
        <h4 className="font-medium text-blue-800 mb-2">Understanding These Gender-Specific Comparisons</h4>
        <p className="text-sm text-blue-900">
          <span className="font-semibold">These statistics compare your results specifically with other {genderText}.</span>{' '}
          Higher or lower scores indicate different approaches to marriage, not better or worse ones.
          The most important consideration is how your assessment compares with your spouse or
          future spouse, as closer percentages typically indicate better alignment in expectations.
        </p>
      </div>
    </div>
  );
}