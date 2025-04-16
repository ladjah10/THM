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

  return (
    <div className="bg-slate-50 rounded-lg p-6 border border-slate-200 space-y-6">
      <div>
        <h3 className="text-xl font-medium text-gray-900 mb-2">How You Compare to Others</h3>
        <p className="text-gray-600 text-sm mb-6">
          Based on responses from others who have taken this assessment,
          here's how your scores compare.
        </p>
      </div>
      
      {/* Overall Percentile */}
      <div className="space-y-2">
        <div className="flex justify-between items-center mb-1">
          <h4 className="font-medium text-gray-800">Overall Score</h4>
          <span className="text-lg font-semibold text-primary">
            {scores.overallPercentage.toFixed(1)}% 
            <span className="text-gray-500 text-sm ml-1 font-normal">
              (higher than {percentile}% of respondents)
            </span>
          </span>
        </div>
        
        {/* Percentile Visualization */}
        <div className="relative w-full h-8 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="absolute h-full bg-gradient-to-r from-blue-300 to-blue-500 rounded-full"
            style={{ width: `${percentile}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-sm font-medium text-white drop-shadow-sm">
            {getPercentileDescription(percentile)}
          </div>
        </div>
        
        <p className="text-sm text-gray-500 mt-1">
          Your overall score of {scores.overallPercentage.toFixed(1)}% is {percentile > 50 ? 'above' : 'below'} the average 
          of {mean.toFixed(1)}% for {demographics.gender === 'male' ? 'men' : 'women'} who have taken this assessment.
        </p>
      </div>
      
      {/* Section Percentiles */}
      <div className="space-y-4 pt-4">
        <h4 className="font-medium text-gray-800 border-b pb-2">Section Comparisons</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(scores.sections).map(([sectionName, sectionScore]) => {
            const sectionPercentile = sectionPercentiles[sectionName] || 50;
            return (
              <div key={sectionName} className="bg-white p-4 rounded border">
                <div className="flex justify-between mb-1">
                  <span className="font-medium text-gray-800">{sectionName}</span>
                  <span className="text-primary font-medium">{sectionScore.percentage.toFixed(1)}%</span>
                </div>
                <div className="relative w-full h-4 bg-gray-100 rounded-full overflow-hidden mb-1">
                  <div
                    className="absolute h-full bg-blue-400 rounded-full"
                    style={{ width: `${sectionPercentile}%` }}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  {sectionPercentile > 75 ? 'Higher' : sectionPercentile > 40 ? 'Average' : 'Lower'} 
                  {' '}than most {demographics.gender === 'male' ? 'men' : 'women'}
                </p>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* Interpretation Guide */}
      <div className="mt-6 bg-blue-50 p-4 rounded-md border border-blue-100">
        <h4 className="font-medium text-blue-800 mb-2">Understanding These Comparisons</h4>
        <p className="text-sm text-blue-900">
          <span className="font-semibold">These statistics are comparative, not evaluative.</span>{' '}
          Higher or lower scores indicate different approaches to marriage, not better or worse ones.
          The most important consideration is how your assessment compares with your spouse or
          future spouse, as closer percentages typically indicate better alignment in expectations.
        </p>
      </div>
    </div>
  );
}