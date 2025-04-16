import React from 'react';
import { CoupleAssessmentReport } from '@shared/schema';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  ArrowRight, 
  CheckCircle2, 
  AlertTriangle, 
  BarChart2,
  ArrowUpDown,
  HelpCircle
} from 'lucide-react';

interface CoupleReportProps {
  report: CoupleAssessmentReport;
}

export const CoupleReport: React.FC<CoupleReportProps> = ({ report }) => {
  const formatPercentage = (value: number) => {
    return `${Math.round(value)}%`;
  };

  // Determine compatibility level based on percentage
  const getCompatibilityLevel = (percentage: number) => {
    if (percentage >= 80) return 'High';
    if (percentage >= 60) return 'Moderate';
    if (percentage >= 40) return 'Fair';
    return 'Low';
  };

  // Determine color class based on compatibility level
  const getCompatibilityColorClass = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-blue-600';
    if (percentage >= 40) return 'text-amber-600';
    return 'text-red-600';
  };

  // Sort major differences by weight (most significant first)
  const sortedMajorDifferences = [...report.differenceAnalysis.majorDifferences]
    .sort((a, b) => b.questionWeight - a.questionWeight);

  return (
    <div className="space-y-8">
      {/* Overall Compatibility Score */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-xl">Couple Compatibility Assessment</CardTitle>
          <CardDescription>
            Based on the responses from both {report.primaryAssessment.demographics.firstName} and {report.spouseAssessment.demographics.firstName}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center mb-6">
            <div className="text-4xl font-bold mb-2 flex items-center">
              <span className={getCompatibilityColorClass(report.overallCompatibility)}>
                {formatPercentage(report.overallCompatibility)}
              </span>
              <span className="text-lg ml-2 text-gray-500">
                {getCompatibilityLevel(report.overallCompatibility)} Compatibility
              </span>
            </div>
            <Progress 
              value={report.overallCompatibility} 
              className="h-2 w-full max-w-md" 
            />
            <p className="mt-4 text-sm text-gray-600 max-w-xl text-center">
              This score represents how well your responses match and how similar your perspectives are on key marriage topics. 
              The closer your responses, the higher your compatibility score.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <Card className="border bg-blue-50 border-blue-100">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                    <span className="text-blue-800 font-bold">{report.primaryAssessment.demographics.firstName.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="font-bold">{report.primaryAssessment.demographics.firstName} {report.primaryAssessment.demographics.lastName}</h3>
                    <p className="text-sm text-gray-600">{formatPercentage(report.primaryAssessment.scores.overallPercentage)} Overall Score</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p className="mb-2">Profile: <Badge variant="outline">{report.primaryAssessment.profile.name}</Badge></p>
                  {report.primaryAssessment.genderProfile && (
                    <p>Gender Profile: <Badge variant="outline" className="bg-purple-50">{report.primaryAssessment.genderProfile.name}</Badge></p>
                  )}
                </div>
              </CardContent>
            </Card>
            
            <Card className="border bg-green-50 border-green-100">
              <CardHeader className="pb-2">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <span className="text-green-800 font-bold">{report.spouseAssessment.demographics.firstName.charAt(0)}</span>
                  </div>
                  <div>
                    <h3 className="font-bold">{report.spouseAssessment.demographics.firstName} {report.spouseAssessment.demographics.lastName}</h3>
                    <p className="text-sm text-gray-600">{formatPercentage(report.spouseAssessment.scores.overallPercentage)} Overall Score</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <p className="mb-2">Profile: <Badge variant="outline">{report.spouseAssessment.profile.name}</Badge></p>
                  {report.spouseAssessment.genderProfile && (
                    <p>Gender Profile: <Badge variant="outline" className="bg-purple-50">{report.spouseAssessment.genderProfile.name}</Badge></p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* Key Relationship Strengths */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Relationship Strengths
          </CardTitle>
          <CardDescription>
            Areas where you and your spouse have the most alignment
          </CardDescription>
        </CardHeader>
        <CardContent>
          {report.differenceAnalysis.strengthAreas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.differenceAnalysis.strengthAreas.map((area, index) => (
                <div key={index} className="bg-green-50 p-4 rounded-lg border border-green-100">
                  <h4 className="font-medium text-green-800 mb-1">{area}</h4>
                  <p className="text-sm text-gray-600">
                    You have strong alignment in this area, which provides a solid foundation for your relationship.
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No specific strength areas identified. This may happen if your responses differ across most categories.</p>
          )}
        </CardContent>
      </Card>

      {/* Areas for Growth */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-600" /> 
            Potential Vulnerability Areas
          </CardTitle>
          <CardDescription>
            Areas with significant differences that may require intentional discussion
          </CardDescription>
        </CardHeader>
        <CardContent>
          {report.differenceAnalysis.vulnerabilityAreas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {report.differenceAnalysis.vulnerabilityAreas.map((area, index) => (
                <div key={index} className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                  <h4 className="font-medium text-amber-800 mb-1">{area}</h4>
                  <p className="text-sm text-gray-600">
                    This area shows notable differences in perspective that may benefit from open discussion and mutual understanding.
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 italic">No significant vulnerability areas identified. You appear to have good alignment across most categories.</p>
          )}
        </CardContent>
      </Card>

      {/* Key Differences Analysis */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpDown className="h-5 w-5 text-blue-600" />
            Major Differences Analysis
          </CardTitle>
          <CardDescription>
            Key questions where you had different responses (sorted by significance)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {sortedMajorDifferences.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-[40%]">Question</TableHead>
                    <TableHead className="w-[25%]">{report.primaryAssessment.demographics.firstName}'s Response</TableHead>
                    <TableHead className="w-[25%]">{report.spouseAssessment.demographics.firstName}'s Response</TableHead>
                    <TableHead className="text-right">Weight</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sortedMajorDifferences.map((difference, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        <div className="flex flex-col">
                          <span>{difference.questionText}</span>
                          <span className="text-xs text-gray-500">{difference.section}</span>
                        </div>
                      </TableCell>
                      <TableCell>{difference.primaryResponse}</TableCell>
                      <TableCell>{difference.spouseResponse}</TableCell>
                      <TableCell className="text-right">{difference.questionWeight}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <p className="text-gray-500 italic">No major differences identified in high-weight questions. This is a positive sign for your relationship compatibility!</p>
          )}
        </CardContent>
      </Card>

      {/* Section Comparison */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart2 className="h-5 w-5 text-indigo-600" />
            Section Score Comparison
          </CardTitle>
          <CardDescription>
            How your scores compare across different assessment areas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Object.keys(report.primaryAssessment.scores.sections).map((section) => {
              const primaryScore = report.primaryAssessment.scores.sections[section].percentage;
              const spouseScore = report.spouseAssessment.scores.sections[section]?.percentage || 0;
              const difference = Math.abs(primaryScore - spouseScore);
              
              let differenceColor = 'text-green-600';
              if (difference > 20) differenceColor = 'text-amber-600';
              if (difference > 35) differenceColor = 'text-red-600';
              
              return (
                <div key={section}>
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{section}</span>
                    <span className={`font-medium ${differenceColor}`}>
                      {difference.toFixed(1)}% difference
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm w-6 text-blue-700">{formatPercentage(primaryScore)}</span>
                    <div className="flex-1 h-4 rounded-full bg-blue-100 relative">
                      <div 
                        className="absolute top-0 left-0 h-full bg-blue-600 rounded-full" 
                        style={{ width: `${primaryScore}%` }}
                      ></div>
                    </div>
                    <ArrowRight className="h-4 w-4 text-gray-500" />
                    <div className="flex-1 h-4 rounded-full bg-green-100 relative">
                      <div 
                        className="absolute top-0 left-0 h-full bg-green-600 rounded-full" 
                        style={{ width: `${spouseScore}%` }}
                      ></div>
                    </div>
                    <span className="text-sm w-6 text-green-700">{formatPercentage(spouseScore)}</span>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-6 pt-4 border-t">
            <div className="flex items-start gap-2">
              <HelpCircle className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-gray-600">
                <strong>Understanding these scores:</strong> Higher percentages indicate more traditional marriage viewpoints, while lower percentages suggest less traditional approaches. Neither is inherently better—just different expectations. The important factor is how close your scores are to each other, which indicates alignment in your relationship expectations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recommendation for Discussion */}
      <Card className="bg-blue-50">
        <CardHeader>
          <CardTitle>Recommendations for Ongoing Growth</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <p className="text-gray-700">
              Based on your assessment results, we recommend setting aside time to discuss the following:
            </p>
            
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Review the major differences identified in this report, particularly focusing on the highly weighted questions where your perspectives differ the most.</li>
              <li>Discuss your different perspectives on the vulnerability areas highlighted above. These are potential growth opportunities for your relationship.</li>
              <li>Celebrate and continue building on your relationship strengths, which provide a solid foundation.</li>
              <li>Consider a consultation with Lawrence E. Adjah to discuss your results in depth and receive personalized guidance.</li>
            </ul>
            
            <div className="bg-white p-4 rounded-lg border border-blue-100 mt-4">
              <h4 className="font-medium text-blue-800 mb-1">Next Steps</h4>
              <p className="text-sm text-gray-600 mb-3">
                Schedule a consultation to discuss your assessment results and receive personalized guidance on strengthening your relationship.
              </p>
              <a 
                href="https://lawrence-adjah.clientsecure.me/request/service" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                Book a Consultation
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};