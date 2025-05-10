import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { CoupleAssessmentReport } from '@shared/schema';
import { CoupleReportSummary } from './CoupleReportSummary';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { 
  Loader2, 
  Mail, 
  FileText, 
  ArrowLeft, 
  ChevronDown, 
  ChevronUp,
  Download,
  Share2,
  Heart,
  UserCircle2,
  HeartHandshake
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { apiRequest } from '@/lib/queryClient';

interface CoupleAssessmentViewProps {
  coupleId: string;
  onBack?: () => void;
}

export const CoupleAssessmentView: React.FC<CoupleAssessmentViewProps> = ({ 
  coupleId,
  onBack 
}) => {
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(true);
  const [showDetailedView, setShowDetailedView] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [sendingEmail, setSendingEmail] = useState(false);

  // Fetch couple assessment data
  const { data: report, isLoading, error } = useQuery({
    queryKey: ['/api/couple-assessment', coupleId],
    queryFn: () => apiRequest('GET', `/api/couple-assessment/${coupleId}`).then(res => res.json()),
    enabled: !!coupleId
  });

  const handleSendEmail = async () => {
    if (emailSent || !report) return;

    try {
      setSendingEmail(true);
      const response = await apiRequest('POST', '/api/couple-assessment/email', { coupleId });
      
      if (response.ok) {
        setEmailSent(true);
        toast({
          title: "Email Sent",
          description: "Your couple assessment report has been sent to both email addresses.",
          variant: "default",
        });
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      toast({
        title: "Email Send Failed",
        description: "There was an error sending your assessment report. Please try again.",
        variant: "destructive",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  const handleShare = () => {
    // For now, just show a toast indicating the feature is available
    toast({
      title: "Share Report",
      description: "Share functionality will be implemented in a future update.",
      variant: "default",
    });
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
        <p className="text-gray-500">Loading your couple assessment results...</p>
      </div>
    );
  }

  if (error || !report) {
    return (
      <Card className="w-full max-w-3xl mx-auto my-8 border-red-200">
        <CardHeader className="bg-red-50">
          <CardTitle className="text-red-700">Error Loading Assessment</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <p className="text-gray-700">
            We couldn't load your couple assessment report. This could be because:
          </p>
          <ul className="list-disc pl-6 mt-2 text-gray-700 space-y-1">
            <li>The coupleId provided is incorrect</li>
            <li>Your spouse hasn't completed their assessment yet</li>
            <li>There was a technical error with the assessment data</li>
          </ul>
          {onBack && (
            <Button 
              variant="outline" 
              className="mt-6" 
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4 mr-2" /> Go Back
            </Button>
          )}
        </CardContent>
      </Card>
    );
  }

  // We have a valid report
  const { primaryAssessment, spouseAssessment } = report as CoupleAssessmentReport;

  return (
    <div className="max-w-4xl mx-auto mb-12">
      {/* Header and actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Couple Assessment Report</h1>
          <p className="text-gray-600 mt-1">
            {primaryAssessment.demographics.firstName} & {spouseAssessment.demographics.firstName}'s Marriage Compatibility Results
          </p>
        </div>
        
        <div className="flex space-x-2 mt-4 md:mt-0">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4 mr-1" /> Share
          </Button>

          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleSendEmail}
            disabled={emailSent || sendingEmail}
          >
            {sendingEmail ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Mail className="h-4 w-4 mr-1" />
            )}
            {emailSent ? "Email Sent" : "Email Report"}
          </Button>
          
          {onBack && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onBack}
            >
              <ArrowLeft className="h-4 w-4 mr-1" /> Back
            </Button>
          )}
        </div>
      </div>

      {/* Couple Report Summary */}
      <div className="mb-6">
        <div 
          className="flex items-center justify-between cursor-pointer p-2 hover:bg-gray-50 rounded-lg"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <h2 className="text-lg font-medium text-gray-900">Couple Compatibility Summary</h2>
          <Button variant="ghost" size="sm">
            {isExpanded ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </Button>
        </div>
        
        {isExpanded && (
          <div className="mt-2">
            <CoupleReportSummary report={report as CoupleAssessmentReport} isExpanded={showDetailedView} />
            
            <div className="text-center mt-4">
              <Button
                variant="outline"
                onClick={() => setShowDetailedView(!showDetailedView)}
              >
                {showDetailedView ? "Show Less Details" : "Show More Details"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Assessment Tabs */}
      <Tabs defaultValue="combined">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="combined">Combined Analysis</TabsTrigger>
          <TabsTrigger value="primary">{primaryAssessment.demographics.firstName}'s Assessment</TabsTrigger>
          <TabsTrigger value="spouse">{spouseAssessment.demographics.firstName}'s Assessment</TabsTrigger>
        </TabsList>
        
        <TabsContent value="combined" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>Compatibility Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">
                  This combined view provides insights into how your relationship expectations align. Understanding areas of both agreement and difference 
                  is crucial for building a strong foundation for marriage.
                </p>
                
                <h3 className="text-lg font-medium mt-6">What Your Compatibility Score Means</h3>
                <p className="text-gray-700">
                  Your compatibility score of <span className="font-medium">{report.overallCompatibility.toFixed(1).replace('.0', '')}%</span> indicates 
                  {report.overallCompatibility >= 80 ? (
                    " a very high level of alignment in your marriage expectations. You share many of the same values and perspectives on important relationship areas."
                  ) : report.overallCompatibility >= 60 ? (
                    " a good level of alignment in your marriage expectations. You have alignment in many key areas, with some differences to be aware of."
                  ) : report.overallCompatibility >= 40 ? (
                    " a moderate level of alignment in your marriage expectations. You have some shared perspectives, but also significant areas where you may need to grow in understanding each other."
                  ) : (
                    " areas that need attention in your marriage expectations. You may have different perspectives on several key areas that would benefit from discussion and mutual understanding."
                  )}
                </p>
                
                <h3 className="text-lg font-medium mt-6">Next Steps for Your Relationship</h3>
                <ul className="list-disc pl-6 space-y-2 text-gray-700">
                  <li>
                    <span className="font-medium">Review your areas of difference</span> - Pay special attention to the "Areas Needing Alignment" and discuss these topics openly.
                  </li>
                  <li>
                    <span className="font-medium">Build on your strengths</span> - Your common ground forms a solid foundation; acknowledge and celebrate these shared values.
                  </li>
                  <li>
                    <span className="font-medium">Consider a consultation</span> - Speaking with Lawrence E. Adjah can provide valuable insights on navigating your specific differences.
                  </li>
                  <li>
                    <span className="font-medium">Read "The 100 Marriage"</span> - The book provides deeper context on the principles behind this assessment and practical guidance.
                  </li>
                </ul>
                
                <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-md flex items-start gap-4">
                  <FileText className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-medium text-blue-800">Download or Email Your Report</h4>
                    <p className="text-sm text-blue-700 mt-1">
                      For a complete assessment with more detailed analysis, we recommend saving or emailing your full report. 
                      Use the "Email Report" button at the top of the page.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="primary" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{primaryAssessment.demographics.firstName}'s Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center bg-blue-100 border-4 border-blue-300">
                    <span className="text-2xl font-bold text-blue-600">{primaryAssessment.scores.overallPercentage.toFixed(1).replace('.0', '')}%</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-blue-800">Overall Score</h3>
                    <p className="text-sm text-gray-600">
                      Based on responses across all assessment areas
                    </p>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium">Psychographic Profiles</h3>
                <div className="p-4 border border-blue-200 rounded-md bg-blue-50 mb-4">
                  <h4 className="font-medium text-blue-800">{primaryAssessment.profile.name} (General Profile)</h4>
                  <p className="text-sm text-gray-700 mt-1">{primaryAssessment.profile.description}</p>
                  
                  {/* Added ideal match information */}
                  <div className="mt-3 bg-blue-100 rounded p-2">
                    <h5 className="text-sm font-medium text-blue-800">Compatibility Information</h5>
                    <p className="text-xs text-blue-700 mt-1">
                      <span className="font-medium">Ideal Match:</span> {primaryAssessment.profile.name}
                    </p>
                    <p className="text-xs text-blue-700 mt-1">
                      <span className="font-medium">Next Best Matches:</span> Harmonious Planners, Balanced Visionaries
                    </p>
                  </div>
                </div>
                
                {primaryAssessment.genderProfile && (
                  <div className="p-4 border border-purple-200 rounded-md bg-purple-50">
                    <h4 className="font-medium text-purple-800">
                      {primaryAssessment.genderProfile.name} 
                      ({primaryAssessment.demographics.gender === 'male' ? 'Male' : 'Female'}-Specific Profile)
                    </h4>
                    <p className="text-sm text-gray-700 mt-1">{primaryAssessment.genderProfile.description}</p>
                  </div>
                )}
                
                <h3 className="text-lg font-medium mt-6">Section Scores</h3>
                <div className="space-y-3">
                  {Object.entries(primaryAssessment.scores.sections).map(([section, score]) => (
                    <div key={section} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-700">{section}</span>
                        <span className="text-sm font-medium text-blue-600">{(score as any).percentage.toFixed(1).replace('.0', '')}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${(score as any).percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="spouse" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{spouseAssessment.demographics.firstName}'s Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-24 h-24 rounded-full flex items-center justify-center bg-purple-100 border-4 border-purple-300">
                    <span className="text-2xl font-bold text-purple-600">{spouseAssessment.scores.overallPercentage.toFixed(1).replace('.0', '')}%</span>
                  </div>
                  <div>
                    <h3 className="text-lg font-medium text-purple-800">Overall Score</h3>
                    <p className="text-sm text-gray-600">
                      Based on responses across all assessment areas
                    </p>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium">Psychographic Profiles</h3>
                <div className="p-4 border border-purple-200 rounded-md bg-purple-50 mb-4">
                  <h4 className="font-medium text-purple-800">{spouseAssessment.profile.name} (General Profile)</h4>
                  <p className="text-sm text-gray-700 mt-1">{spouseAssessment.profile.description}</p>
                  
                  {/* Added ideal match information */}
                  <div className="mt-3 bg-purple-100 rounded p-2">
                    <h5 className="text-sm font-medium text-purple-800">Compatibility Information</h5>
                    <p className="text-xs text-purple-700 mt-1">
                      <span className="font-medium">Ideal Match:</span> {spouseAssessment.profile.name}
                    </p>
                    <p className="text-xs text-purple-700 mt-1">
                      <span className="font-medium">Next Best Matches:</span> Flexible Faithful, Pragmatic Partners
                    </p>
                  </div>
                </div>
                
                {spouseAssessment.genderProfile && (
                  <div className="p-4 border border-purple-200 rounded-md bg-purple-50">
                    <h4 className="font-medium text-purple-800">
                      {spouseAssessment.genderProfile.name} 
                      ({spouseAssessment.demographics.gender === 'male' ? 'Male' : 'Female'}-Specific Profile)
                    </h4>
                    <p className="text-sm text-gray-700 mt-1">{spouseAssessment.genderProfile.description}</p>
                  </div>
                )}
                
                <h3 className="text-lg font-medium mt-6">Section Scores</h3>
                <div className="space-y-3">
                  {Object.entries(spouseAssessment.scores.sections).map(([section, score]) => (
                    <div key={section} className="space-y-1">
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-700">{section}</span>
                        <span className="text-sm font-medium text-purple-600">{(score as any).percentage.toFixed(1).replace('.0', '')}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-purple-600 h-2 rounded-full" 
                          style={{ width: `${(score as any).percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};