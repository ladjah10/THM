import React from 'react';
import { CoupleAssessmentReport, AssessmentResult } from '@shared/schema';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Check, AlertTriangle, Users, Info, AlertCircle, Heart } from 'lucide-react';

interface CoupleReportProps {
  report: CoupleAssessmentReport;
}

export const CoupleReport: React.FC<CoupleReportProps> = ({ report }) => {
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
  
  // Get percentage difference between scores
  const getScoreDifference = (section: string) => {
    const primaryScore = primaryAssessment.scores.sections[section]?.percentage || 0;
    const spouseScore = spouseAssessment.scores.sections[section]?.percentage || 0;
    return Math.abs(primaryScore - spouseScore);
  };
  
  // Get difference level for severity indication
  const getDifferenceLevel = (difference: number) => {
    if (difference <= 10) return { color: 'bg-green-100 text-green-800', text: 'Very Close' };
    if (difference <= 20) return { color: 'bg-blue-100 text-blue-800', text: 'Close' };
    if (difference <= 35) return { color: 'bg-amber-100 text-amber-800', text: 'Moderate Difference' };
    return { color: 'bg-red-100 text-red-800', text: 'Significant Difference' };
  };
  
  return (
    <div className="space-y-8">
      {/* Overall Compatibility Card */}
      <Card className={`${getCompatibilityBgColor(overallCompatibility)}`}>
        <CardHeader className="pb-3">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl font-bold">Couple Compatibility Report</CardTitle>
            <Badge variant="outline" className="text-sm font-normal px-3 py-1">
              {new Date(report.timestamp).toLocaleDateString()}
            </Badge>
          </div>
          <CardDescription>
            {primaryName} & {spouseName}'s relationship dynamics assessment
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row items-center gap-6">
            {/* Compatibility Score */}
            <div className="w-40 h-40 rounded-full flex flex-col items-center justify-center border-8 border-blue-500 relative shadow-lg bg-white">
              <div className={`text-4xl font-bold ${getCompatibilityColor(overallCompatibility)}`}>
                {overallCompatibility}%
              </div>
              <div className="text-sm font-medium text-gray-700 mt-1">Compatibility</div>
            </div>
            
            <div className="flex-1">
              <h3 className="text-xl font-semibold mb-2">Overall Compatibility Analysis</h3>
              <p className="text-gray-700 mb-4">
                {overallCompatibility >= 80 && (
                  "You have excellent compatibility! Your relationship benefits from highly aligned views on marriage, family, and relationship dynamics. Continue building on this strong foundation."
                )}
                {overallCompatibility >= 60 && overallCompatibility < 80 && (
                  "You have good compatibility. While you align well on many important aspects, there are some areas where your perspectives differ. Focus on understanding these differences."
                )}
                {overallCompatibility >= 40 && overallCompatibility < 60 && (
                  "You have moderate compatibility. Your relationship has both areas of strong alignment and significant differences. Success will require intentional communication about expectations."
                )}
                {overallCompatibility < 40 && (
                  "You have notable differences in your marriage expectations. This doesn't mean a relationship cannot work, but it will require consistent effort to bridge these gaps through communication."
                )}
              </p>
              
              <div className="flex flex-wrap gap-2">
                <div className="flex items-center bg-white px-3 py-1 rounded-full border shadow-sm">
                  <span className="mr-1 text-sm text-gray-600">{primaryName}:</span>
                  <span className="font-medium">{primaryAssessment.scores.overallPercentage}%</span>
                </div>
                <div className="flex items-center bg-white px-3 py-1 rounded-full border shadow-sm">
                  <span className="mr-1 text-sm text-gray-600">{spouseName}:</span>
                  <span className="font-medium">{spouseAssessment.scores.overallPercentage}%</span>
                </div>
                <div className="flex items-center bg-white px-3 py-1 rounded-full border shadow-sm">
                  <span className="mr-1 text-sm text-gray-600">Difference:</span>
                  <span className="font-medium">
                    {Math.abs(primaryAssessment.scores.overallPercentage - spouseAssessment.scores.overallPercentage)}%
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Relationship Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Relationship Insights
          </CardTitle>
          <CardDescription>
            Key observations about your relationship compatibility
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Strength Areas */}
            <Alert className="bg-green-50 border-green-200">
              <Check className="h-4 w-4 text-green-600" />
              <AlertTitle className="text-green-800">Areas of Strong Alignment</AlertTitle>
              <AlertDescription className="text-green-700">
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  {differenceAnalysis.strengthAreas.length > 0 ? (
                    differenceAnalysis.strengthAreas.map((area, index) => (
                      <li key={index}>{area}</li>
                    ))
                  ) : (
                    <li>No significant areas of strong alignment identified</li>
                  )}
                </ul>
              </AlertDescription>
            </Alert>
            
            {/* Book Discussion Section - New Addition */}
            <Card className="bg-purple-50 border-purple-200 mb-4">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Heart className="h-5 w-5 text-purple-600" />
                  <span className="text-purple-800">Discussion Guide</span>
                </CardTitle>
                <CardDescription className="text-purple-700">
                  Use "The 100 Marriage" book as your companion to address these key differences
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <p className="text-sm text-purple-700">
                    These are the top {Math.min(5, differenceAnalysis.majorDifferences.length)} most significant areas where your answers differed. 
                    We recommend scheduling a dedicated time to discuss these topics together using "The 100 Marriage" book as your guide.
                  </p>
                  
                  <div className="space-y-3 mt-2">
                    {differenceAnalysis.majorDifferences.slice(0, 5).map((diff, idx) => (
                      <div key={idx} className={`p-3 rounded-lg ${idx % 2 === 0 ? 'bg-purple-100' : 'bg-purple-50'} border border-purple-200`}>
                        <h4 className="font-medium text-purple-900 mb-1">Question {diff.questionId}: {diff.questionText}</h4>
                        <div className="grid grid-cols-2 gap-3 mt-2 text-sm">
                          <div>
                            <span className="block text-purple-700 font-medium">{primaryName}'s Response:</span>
                            <span className="text-purple-800">{diff.primaryResponse}</span>
                          </div>
                          <div>
                            <span className="block text-purple-700 font-medium">{spouseName}'s Response:</span>
                            <span className="text-purple-800">{diff.spouseResponse}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-4 p-3 bg-white rounded-lg border border-purple-200 flex">
                    <div className="mr-3 flex-shrink-0">
                      <img 
                        src="https://lawrenceadjah.com/wp-content/uploads/2023/12/The-100-Marriage-Lawrence-Adjah-Christian-Faith-Based-Books-Marriage-Books-on-Amazon-Relationship-Books-Best-Sellers.png"
                        alt="The 100 Marriage Book Cover"
                        className="w-16 h-auto rounded-md shadow-sm"
                      />
                    </div>
                    <div>
                      <h4 className="font-medium text-purple-900">The 100 Marriage</h4>
                      <p className="text-sm text-purple-700 mt-1">
                        This book provides guidance for discussing these important topics. Use it as a framework to navigate your conversations.
                      </p>
                      <a href="https://www.amazon.com/100-MARRIAGE-Lawrence-Adjah-ebook/dp/B09S3FBLN7" target="_blank" rel="noopener noreferrer" 
                        className="inline-block mt-2 text-xs font-medium px-2 py-1 rounded bg-purple-600 text-white hover:bg-purple-700">
                        Get the Book
                      </a>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            {/* Vulnerability Areas */}
            <Alert className="bg-amber-50 border-amber-200">
              <AlertTriangle className="h-4 w-4 text-amber-600" />
              <AlertTitle className="text-amber-800">Areas for Growth</AlertTitle>
              <AlertDescription className="text-amber-700">
                <ul className="mt-2 space-y-1 list-disc list-inside">
                  {differenceAnalysis.vulnerabilityAreas.length > 0 ? (
                    differenceAnalysis.vulnerabilityAreas.map((area, index) => (
                      <li key={index}>{area}</li>
                    ))
                  ) : (
                    <li>No significant areas of vulnerability identified</li>
                  )}
                </ul>
              </AlertDescription>
            </Alert>
            
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-800 mb-1">Recommendation</h4>
                  <p className="text-blue-700 text-sm">
                    Focus your discussions on the areas of significant difference. These represent the most important 
                    opportunities to align expectations and strengthen your relationship. Use the detailed comparison 
                    tab to identify specific topics for conversation.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Psychographic Profile Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Psychographic Profile Comparison</CardTitle>
          <CardDescription>
            How your personality types complement each other
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            {/* Primary Person */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="font-semibold text-blue-700">{primaryName.charAt(0)}</span>
                </div>
                <h3 className="font-medium">{primaryName}</h3>
              </div>
              
              {/* Primary profile */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">Primary Profile:</span>
                  <Badge variant="outline" className="bg-blue-50">
                    {primaryAssessment.profile.name}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{primaryAssessment.profile.description.substring(0, 120)}...</p>
                
                {/* Added ideal match information */}
                <div className="mt-2 bg-blue-50 rounded p-2 text-xs">
                  <p className="text-blue-800 font-medium">Ideal Match: {primaryAssessment.profile.name}</p>
                  <p className="text-blue-700 mt-1">Next Best Matches: Harmonious Planners, Balanced Visionaries</p>
                </div>
              </div>
              
              {/* Gender-specific profile if available */}
              {primaryAssessment.genderProfile && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Gender-Specific Profile:</span>
                    <Badge variant="outline" className="bg-purple-50">
                      {primaryAssessment.genderProfile.name}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {primaryAssessment.genderProfile.description.substring(0, 120)}...
                  </p>
                </div>
              )}
            </div>
            
            {/* Spouse */}
            <div className="border rounded-lg p-4">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                  <span className="font-semibold text-blue-700">{spouseName.charAt(0)}</span>
                </div>
                <h3 className="font-medium">{spouseName}</h3>
              </div>
              
              {/* Primary profile */}
              <div className="mb-3">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-gray-700">Primary Profile:</span>
                  <Badge variant="outline" className="bg-blue-50">
                    {spouseAssessment.profile.name}
                  </Badge>
                </div>
                <p className="text-sm text-gray-600">{spouseAssessment.profile.description.substring(0, 120)}...</p>
                
                {/* Added ideal match information */}
                <div className="mt-2 bg-purple-50 rounded p-2 text-xs">
                  <p className="text-purple-800 font-medium">Ideal Match: {spouseAssessment.profile.name}</p>
                  <p className="text-purple-700 mt-1">Next Best Matches: Flexible Faithful, Pragmatic Partners</p>
                </div>
              </div>
              
              {/* Gender-specific profile if available */}
              {spouseAssessment.genderProfile && (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-gray-700">Gender-Specific Profile:</span>
                    <Badge variant="outline" className="bg-purple-50">
                      {spouseAssessment.genderProfile.name}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600">
                    {spouseAssessment.genderProfile.description.substring(0, 120)}...
                  </p>
                </div>
              )}
            </div>
          </div>
          
          {/* Compatibility analysis */}
          <div className="mt-6 pt-4 border-t">
            <h3 className="font-medium mb-2 flex items-center gap-2">
              <Heart className="h-4 w-4 text-pink-500" />
              Compatibility Analysis
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              {primaryAssessment.profile.name === spouseAssessment.profile.name ? (
                <span>
                  You share the same primary profile ({primaryAssessment.profile.name}), which suggests 
                  strong alignment in your general approach to relationships and marriage. This is a positive 
                  indicator for compatibility.
                </span>
              ) : (
                <span>
                  You have different primary profiles, which means you may approach relationships with different 
                  perspectives. This diversity can be a strength if you learn to appreciate and leverage your 
                  complementary approaches.
                </span>
              )}
            </p>
            
            {primaryAssessment.genderProfile && spouseAssessment.genderProfile && (
              <div className="bg-slate-50 p-3 rounded-md">
                <p className="text-sm text-gray-700">
                  <span className="font-medium">{primaryName}</span>'s {primaryAssessment.demographics.gender === 'male' ? 'male' : 'female'}-specific 
                  profile as a <span className="font-medium">{primaryAssessment.genderProfile.name}</span> typically matches well with 
                  a <span className="font-medium">{spouseAssessment.genderProfile.name}</span> {spouseAssessment.demographics.gender === 'male' ? 'male' : 'female'} profile. Your specific 
                  combination suggests {overallCompatibility >= 70 ? 'strong potential for compatibility' : 'opportunity for growth through intentional communication'}.
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
      
      {/* Section Score Comparison */}
      <Card>
        <CardHeader>
          <CardTitle>Section Score Comparison</CardTitle>
          <CardDescription>
            How your perspectives align across different relationship areas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Object.entries(primaryAssessment.scores.sections).map(([section, { percentage: primaryPercentage }]) => {
              const spousePercentage = spouseAssessment.scores.sections[section]?.percentage || 0;
              const difference = Math.abs(primaryPercentage - spousePercentage);
              const { color, text } = getDifferenceLevel(difference);
              
              return (
                <div key={section} className="border p-4 rounded-lg">
                  <div className="flex flex-wrap justify-between items-center mb-3">
                    <h4 className="font-medium text-gray-800">{section}</h4>
                    <Badge className={color}>
                      {text} ({difference}% difference)
                    </Badge>
                  </div>
                  
                  <div className="grid gap-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{primaryName}</span>
                        <span className="text-sm font-medium">{primaryPercentage}%</span>
                      </div>
                      <Progress value={primaryPercentage} className="h-2 bg-slate-100" />
                    </div>
                    
                    <div>
                      <div className="flex justify-between mb-1">
                        <span className="text-sm">{spouseName}</span>
                        <span className="text-sm font-medium">{spousePercentage}%</span>
                      </div>
                      <Progress value={spousePercentage} className="h-2 bg-slate-100" />
                    </div>
                  </div>
                  
                  {difference > 20 && (
                    <div className="mt-3 text-sm bg-amber-50 p-2 rounded border border-amber-100">
                      <p className="text-amber-800">
                        This area shows a noteworthy difference in perspectives that may benefit from discussion.
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
      
      {/* Response Differences Tab Interface */}
      <Card>
        <CardHeader>
          <CardTitle>Response Differences</CardTitle>
          <CardDescription>
            Specific questions where your answers differed
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="major">
            <TabsList className="mb-4">
              <TabsTrigger value="major">Major Differences</TabsTrigger>
              <TabsTrigger value="all">All Differences</TabsTrigger>
            </TabsList>
            
            <TabsContent value="major" className="space-y-4">
              {differenceAnalysis.majorDifferences.length > 0 ? (
                differenceAnalysis.majorDifferences.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4 bg-red-50 border-red-100">
                    <div className="flex items-start gap-2 mb-2">
                      <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                      <div>
                        <h4 className="font-medium">{item.questionText}</h4>
                        <p className="text-sm text-gray-500 mt-1">Category: {item.section} • Weight: {item.questionWeight}</p>
                      </div>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-3 mt-3">
                      <div className="bg-white p-3 rounded border">
                        <p className="text-sm font-medium mb-1">{primaryName}'s Response:</p>
                        <p className="text-gray-700">{item.primaryResponse}</p>
                      </div>
                      <div className="bg-white p-3 rounded border">
                        <p className="text-sm font-medium mb-1">{spouseName}'s Response:</p>
                        <p className="text-gray-700">{item.spouseResponse}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>No Major Differences</AlertTitle>
                  <AlertDescription>
                    You don't have any major differences in your responses. This is a positive sign!
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
            
            <TabsContent value="all" className="space-y-4">
              {differenceAnalysis.differentResponses.length > 0 ? (
                differenceAnalysis.differentResponses.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="mb-2">
                      <h4 className="font-medium">{item.questionText}</h4>
                      <p className="text-sm text-gray-500 mt-1">Category: {item.section} • Weight: {item.questionWeight}</p>
                    </div>
                    
                    <div className="grid md:grid-cols-2 gap-3 mt-3">
                      <div className="bg-slate-50 p-3 rounded border">
                        <p className="text-sm font-medium mb-1">{primaryName}'s Response:</p>
                        <p className="text-gray-700">{item.primaryResponse}</p>
                      </div>
                      <div className="bg-slate-50 p-3 rounded border">
                        <p className="text-sm font-medium mb-1">{spouseName}'s Response:</p>
                        <p className="text-gray-700">{item.spouseResponse}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <Alert>
                  <Info className="h-4 w-4" />
                  <AlertTitle>No Differences</AlertTitle>
                  <AlertDescription>
                    You don't have any differences in your responses. This is a very positive sign!
                  </AlertDescription>
                </Alert>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      {/* Next Steps */}
      <Card>
        <CardHeader>
          <CardTitle>Next Steps for Your Relationship</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
              <h4 className="font-medium text-blue-800 mb-2">Recommended Actions</h4>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Discuss the areas where you have significant differences to better understand each other's perspectives</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Celebrate and build upon the areas where you have strong alignment</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-4 w-4 text-blue-600 mt-0.5 mr-2 flex-shrink-0" />
                  <span>Consider scheduling regular check-ins to discuss relationship expectations</span>
                </li>
              </ul>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
              <Button onClick={() => window.open('https://lawrenceadjah.com/the100marriagebook', '_blank')} variant="outline">
                Explore The 100 Marriage Book
              </Button>
              <Button onClick={() => window.open('https://lawrence-adjah.clientsecure.me/request/service', '_blank')}>
                Schedule Relationship Consultation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};