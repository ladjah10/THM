import React from 'react';
import { CoupleAssessmentReport } from '@shared/schema';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check, AlertTriangle, Heart, ArrowRight } from 'lucide-react';

interface CoupleReportSummaryProps {
  report: CoupleAssessmentReport;
  showDetailedView?: boolean;
}

export const CoupleReportSummary: React.FC<CoupleReportSummaryProps> = ({ 
  report,
  showDetailedView = false
}) => {
  const { primaryAssessment, spouseAssessment, differenceAnalysis, overallCompatibility } = report;
  
  // Format names
  const primaryName = primaryAssessment.demographics.firstName;
  const spouseName = spouseAssessment.demographics.firstName;
  
  // Calculate color class based on compatibility score
  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-blue-600';
    if (score >= 40) return 'text-amber-600';
    return 'text-red-600';
  };
  
  // Calculate background color class based on compatibility score
  const getCompatibilityBgColor = (score: number) => {
    if (score >= 80) return 'bg-green-50 border-green-200';
    if (score >= 60) return 'bg-blue-50 border-blue-200';
    if (score >= 40) return 'bg-amber-50 border-amber-200';
    return 'bg-red-50 border-red-200';
  };
  
  // Get compatibility level text
  const getCompatibilityLevel = (score: number) => {
    if (score >= 80) return 'Very High Compatibility';
    if (score >= 60) return 'Good Compatibility';
    if (score >= 40) return 'Moderate Compatibility';
    return 'Areas Needing Attention';
  };

  return (
    <div className="space-y-6">
      {/* Overall Compatibility Score */}
      <Card className={`${getCompatibilityBgColor(overallCompatibility)} border`}>
        <CardHeader className="pb-2">
          <CardTitle className="text-xl flex items-center gap-2">
            <Heart className="h-5 w-5" />
            Couple Compatibility Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center py-3">
            <div className="relative w-48 h-48 rounded-full flex flex-col items-center justify-center border-8 border-white bg-white shadow-md mb-4">
              <div className={`text-5xl font-bold ${getCompatibilityColor(overallCompatibility)}`}>
                {Math.round(overallCompatibility)}%
              </div>
              <div className="text-base font-medium text-gray-700 mt-1">
                {getCompatibilityLevel(overallCompatibility)}
              </div>
            </div>
            
            <h3 className="text-lg font-medium mb-2 text-center">
              {primaryName} & {spouseName}'s Marriage Expectations
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mt-4">
              {/* Strength Areas */}
              <div className="space-y-3">
                <h4 className="font-medium text-green-800 flex items-center gap-1">
                  <Check className="h-4 w-4" /> Strength Areas
                </h4>
                <ul className="space-y-2 pl-6">
                  {differenceAnalysis.strengthAreas.slice(0, 3).map((area, index) => (
                    <li key={index} className="text-sm text-gray-800">{area}</li>
                  ))}
                  {differenceAnalysis.strengthAreas.length > 3 && !showDetailedView && (
                    <li className="text-sm text-blue-600">+{differenceAnalysis.strengthAreas.length - 3} more areas</li>
                  )}
                </ul>
              </div>
              
              {/* Growth Areas */}
              <div className="space-y-3">
                <h4 className="font-medium text-amber-800 flex items-center gap-1">
                  <AlertTriangle className="h-4 w-4" /> Areas Needing Alignment
                </h4>
                <ul className="space-y-2 pl-6">
                  {differenceAnalysis.vulnerabilityAreas.slice(0, 3).map((area, index) => (
                    <li key={index} className="text-sm text-gray-800">{area}</li>
                  ))}
                  {differenceAnalysis.vulnerabilityAreas.length > 3 && !showDetailedView && (
                    <li className="text-sm text-blue-600">+{differenceAnalysis.vulnerabilityAreas.length - 3} more areas</li>
                  )}
                </ul>
              </div>
            </div>
            
            {/* Individual Scores Comparison */}
            <div className="w-full mt-6 border-t border-gray-200 pt-4">
              <h4 className="font-medium text-gray-700 mb-3">Individual Assessment Scores</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col items-center">
                  <div className="text-sm font-medium text-gray-500 mb-2">{primaryName}</div>
                  <div className="w-32 h-32 rounded-full flex flex-col items-center justify-center border-4 border-blue-200 bg-blue-50">
                    <div className="text-3xl font-bold text-blue-600">
                      {primaryAssessment.scores.overallPercentage}%
                    </div>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-sm font-medium text-gray-500 mb-2">{spouseName}</div>
                  <div className="w-32 h-32 rounded-full flex flex-col items-center justify-center border-4 border-purple-200 bg-purple-50">
                    <div className="text-3xl font-bold text-purple-600">
                      {spouseAssessment.scores.overallPercentage}%
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {showDetailedView && (
        <>
          {/* Major Differences Section */}
          <Card className="border-amber-200">
            <CardHeader className="bg-amber-50 pb-2">
              <CardTitle className="text-lg text-amber-800">Top Differences to Discuss</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4 mt-2">
                {differenceAnalysis.majorDifferences.slice(0, 5).map((diff, index) => (
                  <li key={index} className="border-b border-amber-100 pb-3">
                    <div className="font-medium text-gray-800 mb-1">{diff.questionText}</div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="text-blue-700">
                        {primaryName}: <span className="font-medium">{diff.primaryResponse}</span>
                      </div>
                      <ArrowRight className="h-4 w-4 text-amber-500 mx-2" />
                      <div className="text-purple-700">
                        {spouseName}: <span className="font-medium">{diff.spouseResponse}</span>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
              {differenceAnalysis.majorDifferences.length > 5 && (
                <div className="text-center text-sm text-gray-600 mt-4">
                  + {differenceAnalysis.majorDifferences.length - 5} more differences
                </div>
              )}
            </CardContent>
          </Card>
          
          {/* Section Score Comparison */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Section Score Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 mt-2">
                {Object.entries(primaryAssessment.scores.sections).map(([section, { percentage: primaryPercentage }]) => {
                  const spousePercentage = spouseAssessment.scores.sections[section]?.percentage || 0;
                  const difference = Math.abs(primaryPercentage - spousePercentage);
                  
                  let bgClass = 'bg-green-100';
                  if (difference > 20) bgClass = 'bg-red-100';
                  else if (difference > 10) bgClass = 'bg-amber-100';
                  
                  return (
                    <div key={section} className="space-y-2">
                      <div className="flex justify-between mb-1">
                        <span className="font-medium text-gray-800">{section}</span>
                        <span className="text-sm text-gray-600">
                          Difference: <span className={difference > 15 ? 'text-red-600 font-medium' : 'text-gray-800'}>
                            {difference}%
                          </span>
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="text-sm text-blue-700 w-10">{primaryPercentage}%</div>
                        <div className="h-4 flex-1 rounded-full bg-gray-100">
                          <div className="relative h-full w-full">
                            <div 
                              className="absolute h-full bg-blue-500 rounded-l-full" 
                              style={{ width: `${primaryPercentage}%` }}
                            ></div>
                            <div 
                              className="absolute h-full bg-purple-500 rounded-r-full" 
                              style={{ width: `${spousePercentage}%`, left: 0 }}
                            ></div>
                          </div>
                        </div>
                        <div className="text-sm text-purple-700 w-10">{spousePercentage}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>
              
              <div className="flex justify-between text-xs text-gray-500 mt-4 px-14">
                <div>{primaryName}</div>
                <div>{spouseName}</div>
              </div>
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};