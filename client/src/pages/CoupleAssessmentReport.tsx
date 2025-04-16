import { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';
import { HeartHandshake, Clock, AlertCircle, Users, CheckCircle2, ArrowDownToLine } from 'lucide-react';
import { CoupleAssessmentReport as CoupleReport } from '@shared/schema';

export default function CoupleAssessmentReportPage() {
  const { coupleId } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [report, setReport] = useState<CoupleReport | null>(null);
  const [pendingStatus, setPendingStatus] = useState<{
    primaryComplete: boolean;
    spouseComplete: boolean;
    spouseEmail?: string;
  } | null>(null);
  
  // Load the couple assessment data
  useEffect(() => {
    if (!coupleId) {
      setError('Invalid couple assessment ID');
      setLoading(false);
      return;
    }
    
    const fetchCoupleAssessment = async () => {
      try {
        const response = await apiRequest('GET', `/api/couple-assessment/${coupleId}`);
        const data = await response.json();
        
        if (response.ok) {
          if (data.coupleReport) {
            // Both assessments are complete, show the report
            setReport(data.coupleReport);
          } else if (data.primaryAssessment) {
            // Only primary assessment is complete, show pending status
            setPendingStatus({
              primaryComplete: true,
              spouseComplete: false,
              spouseEmail: data.spouseEmail
            });
          } else {
            setError('Couple assessment data not found');
          }
        } else {
          setError(data.message || 'Failed to load couple assessment');
        }
      } catch (error) {
        console.error('Error fetching couple assessment:', error);
        setError('Failed to load couple assessment data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchCoupleAssessment();
  }, [coupleId]);
  
  // Render loading state
  if (loading) {
    return (
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-2/3 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent className="space-y-6">
            <Skeleton className="h-40 w-full" />
            <div className="space-y-4">
              <Skeleton className="h-6 w-48" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Skeleton className="h-32 w-full" />
                <Skeleton className="h-32 w-full" />
              </div>
            </div>
            <div className="space-y-4">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-32 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <Card className="border-red-200">
          <CardHeader className="bg-red-50">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <CardTitle>Error Loading Couple Assessment</CardTitle>
            </div>
            <CardDescription>
              There was a problem retrieving the couple assessment data
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
            
            <div className="mt-6 text-center">
              <Button onClick={() => setLocation('/')}>
                Return to Home
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Render pending spouse assessment view
  if (pendingStatus && !report) {
    return (
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <Card className="border-amber-200">
          <CardHeader className="bg-amber-50">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-600" />
              <CardTitle>Couple Assessment Pending</CardTitle>
            </div>
            <CardDescription>
              Waiting for your spouse to complete their assessment
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <Alert className="bg-blue-50 border-blue-200">
                <Users className="h-4 w-4 text-blue-500" />
                <AlertTitle className="text-blue-800">Assessment Status</AlertTitle>
                <AlertDescription className="text-blue-700">
                  <div className="space-y-4 mt-2">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="h-4 w-4 text-green-500" />
                      <span>Your assessment has been completed</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-amber-500" />
                      <span>
                        Your spouse's assessment is pending
                        {pendingStatus.spouseEmail && (
                          <span className="font-medium"> (Invitation sent to {pendingStatus.spouseEmail})</span>
                        )}
                      </span>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">What happens next?</h4>
                <p className="text-gray-600 mb-4">
                  Once your spouse completes their assessment, your couple assessment report will be automatically generated.
                  You can check back on this page to view your results.
                </p>
                <div className="flex items-center gap-2">
                  <Progress value={50} className="flex-1" />
                  <span className="text-sm font-medium text-gray-600">50% Complete</span>
                </div>
              </div>
              
              <div className="border border-dashed border-gray-300 p-4 rounded-md bg-gray-50">
                <h4 className="font-medium mb-2 flex items-center gap-2">
                  <HeartHandshake className="h-4 w-4 text-blue-600" />
                  <span>Reminder</span>
                </h4>
                <p className="text-sm text-gray-600">
                  You can send a reminder to your spouse by sharing this link with them directly:
                </p>
                <div className="mt-2 p-2 bg-white rounded border text-xs break-all">
                  {window.location.origin}/couple-assessment/invite/{coupleId}
                </div>
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-between bg-gray-50 border-t">
            <Button variant="outline" onClick={() => setLocation('/')}>
              Back to Home
            </Button>
            
            <Button
              className="bg-blue-600 hover:bg-blue-700"
              onClick={() => {
                navigator.clipboard.writeText(`${window.location.origin}/couple-assessment/invite/${coupleId}`);
                toast({
                  title: "Link Copied",
                  description: "The invite link has been copied to your clipboard.",
                });
              }}
            >
              Copy Invite Link
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  // Render complete couple assessment report
  if (report) {
    const { primaryAssessment, spouseAssessment, differenceAnalysis, overallCompatibility } = report;
    
    return (
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <Card className="border-green-200 mb-8">
          <CardHeader className="bg-green-50">
            <div className="flex items-center gap-2">
              <HeartHandshake className="h-6 w-6 text-green-600" />
              <CardTitle>Couple Assessment Report</CardTitle>
            </div>
            <CardDescription>
              Your comprehensive compatibility analysis based on The 100 Marriage Assessment
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <div className="space-y-8">
              {/* Overall Compatibility Score */}
              <div className="flex flex-col items-center justify-center p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Overall Compatibility</h3>
                
                <div className="w-48 h-48 rounded-full flex flex-col items-center justify-center border-8 border-green-500 relative my-4">
                  <span className="text-5xl font-bold text-green-700">{overallCompatibility}%</span>
                  <span className="text-sm text-gray-500">Compatibility</span>
                </div>
                
                <div className="text-center max-w-md mt-4">
                  <p className="text-gray-700">
                    {overallCompatibility >= 85 ? (
                      "You and your spouse have exceptional alignment in your marriage values and priorities."
                    ) : overallCompatibility >= 70 ? (
                      "You and your spouse have strong alignment in most areas, with some opportunities for growth."
                    ) : overallCompatibility >= 50 ? (
                      "You and your spouse have moderate alignment with several key areas that need discussion."
                    ) : (
                      "You and your spouse have significant differences in your marriage values and priorities that need attention."
                    )}
                  </p>
                </div>
              </div>
              
              {/* Individual Scores Comparison */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Individual Assessment Scores</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Primary Score */}
                  <div className="bg-blue-50 border border-blue-100 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <h4 className="font-medium">{primaryAssessment.name}</h4>
                    </div>
                    <div className="flex items-center mb-2">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center border-4 border-blue-500">
                        <span className="text-xl font-bold text-blue-700">
                          {Math.round(primaryAssessment.scores.overallPercentage)}%
                        </span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-600 mb-1">Primary Profile:</p>
                        <p className="font-medium">{primaryAssessment.profile.name}</p>
                        {primaryAssessment.genderProfile && (
                          <>
                            <p className="text-sm text-gray-600 mt-2 mb-1">Gender-Specific Profile:</p>
                            <p className="font-medium">{primaryAssessment.genderProfile.name}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Spouse Score */}
                  <div className="bg-purple-50 border border-purple-100 p-4 rounded-lg">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-purple-600" />
                      <h4 className="font-medium">{spouseAssessment.name}</h4>
                    </div>
                    <div className="flex items-center mb-2">
                      <div className="w-16 h-16 rounded-full flex items-center justify-center border-4 border-purple-500">
                        <span className="text-xl font-bold text-purple-700">
                          {Math.round(spouseAssessment.scores.overallPercentage)}%
                        </span>
                      </div>
                      <div className="ml-4">
                        <p className="text-sm text-gray-600 mb-1">Primary Profile:</p>
                        <p className="font-medium">{spouseAssessment.profile.name}</p>
                        {spouseAssessment.genderProfile && (
                          <>
                            <p className="text-sm text-gray-600 mt-2 mb-1">Gender-Specific Profile:</p>
                            <p className="font-medium">{spouseAssessment.genderProfile.name}</p>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Strength Areas */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Relationship Strengths</h3>
                
                {differenceAnalysis.strengthAreas.length > 0 ? (
                  <div className="bg-green-50 border border-green-100 p-4 rounded-lg">
                    <p className="text-gray-700 mb-3">
                      You and your spouse have strong alignment in these areas:
                    </p>
                    <ul className="space-y-2">
                      {differenceAnalysis.strengthAreas.map((area, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0" />
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <Alert className="bg-amber-50 border-amber-200">
                    <AlertCircle className="h-4 w-4 text-amber-600" />
                    <AlertTitle className="text-amber-800">No Strong Alignment Areas</AlertTitle>
                    <AlertDescription className="text-amber-700">
                      You and your spouse don't have any areas with exceptionally strong alignment.
                      This suggests an opportunity to work on developing shared perspectives.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              
              {/* Vulnerability Areas */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Areas for Discussion</h3>
                
                {differenceAnalysis.vulnerabilityAreas.length > 0 ? (
                  <div className="bg-amber-50 border border-amber-100 p-4 rounded-lg">
                    <p className="text-gray-700 mb-3">
                      You and your spouse may benefit from discussing these areas:
                    </p>
                    <ul className="space-y-2">
                      {differenceAnalysis.vulnerabilityAreas.map((area, index) => (
                        <li key={index} className="flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-amber-600 flex-shrink-0" />
                          <span>{area}</span>
                        </li>
                      ))}
                    </ul>
                    
                    <div className="mt-4 pt-4 border-t border-amber-200">
                      <p className="text-sm text-amber-800">
                        These areas show significant differences in how you and your spouse approach 
                        marriage. Open communication about these topics can strengthen your relationship.
                      </p>
                    </div>
                  </div>
                ) : (
                  <Alert className="bg-green-50 border-green-200">
                    <CheckCircle2 className="h-4 w-4 text-green-600" />
                    <AlertTitle className="text-green-800">Strong Alignment</AlertTitle>
                    <AlertDescription className="text-green-700">
                      You and your spouse don't have any areas with significant differences.
                      This suggests strong alignment in your marriage values and priorities.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              
              {/* Major Differences */}
              {differenceAnalysis.majorDifferences.length > 0 && (
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Key Differences</h3>
                  
                  <div className="bg-gray-50 border p-4 rounded-lg">
                    <p className="text-gray-700 mb-3">
                      These specific questions revealed significant differences in your perspectives:
                    </p>
                    
                    <div className="space-y-4">
                      {differenceAnalysis.majorDifferences.slice(0, 5).map((diff, index) => (
                        <div key={index} className="border-b pb-3">
                          <h5 className="font-medium mb-2">{diff.questionText}</h5>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            <div className="bg-blue-50 p-2 rounded text-sm">
                              <span className="font-medium block">{primaryAssessment.name}:</span>
                              {diff.primaryResponse}
                            </div>
                            <div className="bg-purple-50 p-2 rounded text-sm">
                              <span className="font-medium block">{spouseAssessment.name}:</span>
                              {diff.spouseResponse}
                            </div>
                          </div>
                        </div>
                      ))}
                      
                      {differenceAnalysis.majorDifferences.length > 5 && (
                        <p className="text-sm text-gray-600 italic">
                          {differenceAnalysis.majorDifferences.length - 5} more differences not shown
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              )}
              
              {/* Book and Consultation */}
              <div className="bg-blue-50 border border-blue-100 p-6 rounded-lg">
                <h3 className="text-xl font-semibold text-gray-900 mb-3">Next Steps for Your Relationship</h3>
                <p className="text-gray-600 mb-4">
                  Strengthen your relationship by exploring Lawrence E. Adjah's teachings on marriage
                </p>
                
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button
                    onClick={() => window.open('https://lawrenceadjah.com/the100marriagebook', '_blank')}
                    className="flex items-center gap-2 bg-amber-600 hover:bg-amber-500"
                  >
                    <ArrowDownToLine className="h-4 w-4" />
                    <span>Purchase The 100 Marriage Book</span>
                  </Button>
                  
                  <Button
                    onClick={() => window.open('https://lawrence-adjah.clientsecure.me/request/service', '_blank')}
                    variant="outline"
                    className="border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    Schedule a Consultation
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex justify-center pt-6 pb-4">
            <Button
              variant="outline"
              onClick={() => setLocation('/')}
            >
              Return to Home
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }
  
  return null;
}