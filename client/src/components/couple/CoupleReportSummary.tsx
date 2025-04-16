import React from 'react';
import { CoupleAssessmentReport } from '@shared/schema';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AlertCircle, CheckCircle2, Heart, AlertTriangle } from 'lucide-react';

interface CoupleReportSummaryProps {
  report: CoupleAssessmentReport;
  isExpanded?: boolean;
}

export const CoupleReportSummary: React.FC<CoupleReportSummaryProps> = ({ 
  report,
  isExpanded = true 
}) => {
  const { primaryAssessment, spouseAssessment, differenceAnalysis, overallCompatibility } = report;
  
  // Calculate color based on compatibility score
  const getCompatibilityColor = (score: number) => {
    if (score >= 80) return 'bg-green-100 text-green-800 border-green-300';
    if (score >= 60) return 'bg-blue-100 text-blue-800 border-blue-300';
    if (score >= 40) return 'bg-yellow-100 text-yellow-800 border-yellow-300';
    return 'bg-red-100 text-red-800 border-red-300';
  };
  
  // Get progress color based on percentage
  const getProgressColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-600';
    if (percentage >= 60) return 'bg-blue-600';
    if (percentage >= 40) return 'bg-yellow-600';
    return 'bg-red-600';
  };
  
  // Format percentage for display
  const formatPercentage = (value: number) => `${Math.round(value)}%`;
  
  // Get icon based on percentage
  const getIcon = (percentage: number) => {
    if (percentage >= 80) return <CheckCircle2 className="h-4 w-4 text-green-600" />;
    if (percentage >= 60) return <Heart className="h-4 w-4 text-blue-600" />;
    if (percentage >= 40) return <AlertTriangle className="h-4 w-4 text-yellow-600" />;
    return <AlertCircle className="h-4 w-4 text-red-600" />;
  };
  
  return (
    <div className="space-y-6">
      {/* Overall Compatibility Card */}
      <Card className={`border-2 ${getCompatibilityColor(overallCompatibility)}`}>
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center justify-between">
            <span>Overall Compatibility</span>
            <Badge variant="outline" className={getCompatibilityColor(overallCompatibility)}>
              {formatPercentage(overallCompatibility)}
            </Badge>
          </CardTitle>
          <CardDescription>
            Based on your combined assessment results
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Progress 
            value={overallCompatibility} 
            className="h-3"
            style={{ 
              '--progress-foreground': getProgressColor(overallCompatibility) 
            } as React.CSSProperties}
          />
          
          <div className="mt-4">
            <p className="text-sm font-medium mb-2">What this means:</p>
            <p className="text-sm text-gray-600">
              {overallCompatibility >= 80 && "You have excellent compatibility! Your values and expectations align well."}
              {overallCompatibility >= 60 && overallCompatibility < 80 && "You have good compatibility. While you align on many important areas, there are some differences to discuss."}
              {overallCompatibility >= 40 && overallCompatibility < 60 && "You have moderate compatibility. Important differences exist that would benefit from open discussion."}
              {overallCompatibility < 40 && "You have significant differences in key areas. Consider discussing these with a marriage counselor."}
            </p>
          </div>
        </CardContent>
      </Card>
      
      {/* Strength Areas and Vulnerabilities */}
      {isExpanded && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Strength Areas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                Strength Areas
              </CardTitle>
              <CardDescription>You both align well in these areas</CardDescription>
            </CardHeader>
            <CardContent>
              {differenceAnalysis.strengthAreas.length > 0 ? (
                <ul className="space-y-2">
                  {differenceAnalysis.strengthAreas.map((area, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-600 mt-0.5" />
                      <span className="text-sm">{area}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic">No major strength areas identified</p>
              )}
            </CardContent>
          </Card>
          
          {/* Vulnerability Areas */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-600" />
                Vulnerability Areas
              </CardTitle>
              <CardDescription>Areas that may need more discussion</CardDescription>
            </CardHeader>
            <CardContent>
              {differenceAnalysis.vulnerabilityAreas.length > 0 ? (
                <ul className="space-y-2">
                  {differenceAnalysis.vulnerabilityAreas.map((area, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5" />
                      <span className="text-sm">{area}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-gray-500 italic">No significant vulnerability areas identified</p>
              )}
            </CardContent>
          </Card>
        </div>
      )}
      
      {/* Profiles Comparison */}
      {isExpanded && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Psychographic Profiles</CardTitle>
            <CardDescription>How your personality types compare</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="font-medium text-sm">{primaryAssessment.demographics.firstName}'s Profiles:</p>
                <div className="p-3 bg-blue-50 rounded-md">
                  <p className="font-medium">{primaryAssessment.profile.name}</p>
                  <p className="text-xs text-gray-600">{primaryAssessment.profile.description.substring(0, 120)}...</p>
                </div>
                {primaryAssessment.genderProfile && (
                  <div className="p-3 bg-purple-50 rounded-md">
                    <p className="font-medium">{primaryAssessment.genderProfile.name}</p>
                    <p className="text-xs text-gray-600">{primaryAssessment.genderProfile.description.substring(0, 120)}...</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-2">
                <p className="font-medium text-sm">{spouseAssessment.demographics.firstName}'s Profiles:</p>
                <div className="p-3 bg-blue-50 rounded-md">
                  <p className="font-medium">{spouseAssessment.profile.name}</p>
                  <p className="text-xs text-gray-600">{spouseAssessment.profile.description.substring(0, 120)}...</p>
                </div>
                {spouseAssessment.genderProfile && (
                  <div className="p-3 bg-purple-50 rounded-md">
                    <p className="font-medium">{spouseAssessment.genderProfile.name}</p>
                    <p className="text-xs text-gray-600">{spouseAssessment.genderProfile.description.substring(0, 120)}...</p>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Major Differences */}
      {isExpanded && differenceAnalysis.majorDifferences.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              Major Differences
            </CardTitle>
            <CardDescription>Questions where you had significant disagreement</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4 divide-y">
              {differenceAnalysis.majorDifferences.slice(0, 5).map((diff, index) => (
                <li key={index} className={index > 0 ? 'pt-4' : ''}>
                  <p className="font-medium text-sm">{diff.questionText}</p>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div className="p-2 bg-blue-50 rounded-md">
                      <p className="text-xs font-medium text-blue-800">{primaryAssessment.demographics.firstName}:</p>
                      <p className="text-xs">{diff.primaryResponse}</p>
                    </div>
                    <div className="p-2 bg-pink-50 rounded-md">
                      <p className="text-xs font-medium text-pink-800">{spouseAssessment.demographics.firstName}:</p>
                      <p className="text-xs">{diff.spouseResponse}</p>
                    </div>
                  </div>
                </li>
              ))}
              {differenceAnalysis.majorDifferences.length > 5 && (
                <li className="pt-4 text-center">
                  <p className="text-sm text-gray-500">
                    + {differenceAnalysis.majorDifferences.length - 5} more differences
                  </p>
                </li>
              )}
            </ul>
          </CardContent>
        </Card>
      )}
    </div>
  );
};