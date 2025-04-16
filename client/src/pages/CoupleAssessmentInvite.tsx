import React, { useState, useEffect } from 'react';
import { useParams, useLocation } from 'wouter';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { DemographicData, AssessmentResult } from '@shared/schema';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, Check, XCircle } from 'lucide-react';
import DemographicView from '@/components/assessment/DemographicView';
import QuestionnaireView from '@/components/assessment/QuestionnaireView';
import ResultsView from '@/components/assessment/ResultsView';

const VIEWS = ['intro', 'demographics', 'questionnaire', 'results', 'complete'] as const;
type ViewType = typeof VIEWS[number];

export default function CoupleAssessmentInvite() {
  const { coupleId } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const [currentView, setCurrentView] = useState<ViewType>('intro');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [validInvite, setValidInvite] = useState(false);
  const [primaryAssessment, setPrimaryAssessment] = useState<AssessmentResult | null>(null);
  
  // Form state
  const [demographicData, setDemographicData] = useState<DemographicData>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    marriageStatus: '',
    desireChildren: '',
    ethnicity: '',
    hasPurchasedBook: '',
    purchaseDate: '',
    promoCode: '',
    hasPaid: true, // This is a spouse invite, so payment is not needed
    lifeStage: '',
    birthday: '',
    interestedInArrangedMarriage: false,
    thmPoolApplied: false,
    city: '',
    state: '',
    zipCode: ''
  });
  
  const [userResponses, setUserResponses] = useState<Record<number, { option: string, value: number }>>({});
  const [scores, setScores] = useState<any>(null);
  const [primaryProfile, setPrimaryProfile] = useState<any>(null);
  const [genderProfile, setGenderProfile] = useState<any>(null);
  
  // Check if the couple ID is valid and fetch primary assessment details
  useEffect(() => {
    if (!coupleId) {
      setError('Invalid invitation link');
      setLoading(false);
      return;
    }
    
    const fetchPrimaryAssessment = async () => {
      try {
        const response = await apiRequest('GET', `/api/couple-assessment/${coupleId}`);
        const data = await response.json();
        
        if (response.ok) {
          if (data.coupleReport) {
            // Spouse has already completed the assessment
            setError('This couple assessment has already been completed');
          } else {
            // We should receive the primary assessment data
            if (data.primaryAssessment) {
              setPrimaryAssessment(data.primaryAssessment);
              setValidInvite(true);
            } else {
              setError('Invalid couple assessment invitation');
            }
          }
        } else {
          if (data.message === "Couple assessment not found or incomplete") {
            // This is expected - it means the spouse hasn't completed their assessment yet
            setValidInvite(true);
          } else {
            setError(data.message || 'Failed to validate invitation');
          }
        }
      } catch (error) {
        console.error('Error validating couple assessment invitation:', error);
        setError('Failed to validate invitation. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchPrimaryAssessment();
  }, [coupleId]);
  
  // Handle completing demographics
  const handleCompleteDemographics = (data: DemographicData) => {
    setDemographicData(data);
    setCurrentView('questionnaire');
  };
  
  // Handle questionnaire completion
  const handleCompleteQuestionnaire = (
    responses: Record<number, { option: string, value: number }>,
    calculatedScores: any,
    mainProfile: any,
    genderSpecificProfile: any
  ) => {
    setUserResponses(responses);
    setScores(calculatedScores);
    setPrimaryProfile(mainProfile);
    setGenderProfile(genderSpecificProfile);
    setCurrentView('results');
  };
  
  // Handle submitting spouse assessment
  const handleSubmitSpouseAssessment = async () => {
    setLoading(true);
    
    try {
      // Prepare spouse assessment data
      const spouseAssessment: Partial<AssessmentResult> = {
        email: demographicData.email,
        name: `${demographicData.firstName} ${demographicData.lastName}`,
        scores: scores,
        profile: primaryProfile,
        genderProfile: genderProfile,
        responses: userResponses,
        demographics: demographicData,
        timestamp: new Date().toISOString()
      };
      
      // Submit spouse assessment
      const response = await apiRequest('POST', '/api/couple-assessment/submit-spouse', {
        coupleId,
        spouseAssessment
      });
      
      if (!response.ok) {
        throw new Error('Failed to submit spouse assessment');
      }
      
      // Success - show completion message
      setCurrentView('complete');
      
      toast({
        title: "Assessment Submitted",
        description: "Your assessment has been successfully submitted and the couple report is now available.",
      });
    } catch (error) {
      console.error('Error submitting spouse assessment:', error);
      toast({
        title: "Submission Error",
        description: "There was a problem submitting your assessment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Render loading state
  if (loading) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Render error state
  if (error) {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card className="border-red-200">
          <CardHeader className="bg-red-50">
            <div className="flex items-center gap-2">
              <XCircle className="h-5 w-5 text-red-500" />
              <CardTitle>Invalid Invitation</CardTitle>
            </div>
            <CardDescription>
              There was a problem with this couple assessment invitation
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
  
  // Render intro view
  if (currentView === 'intro' && validInvite) {
    const partnerName = primaryAssessment ? 
      `${primaryAssessment.demographics.firstName} ${primaryAssessment.demographics.lastName}` : 
      'Your partner';
    
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card className="border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle>The 100 Marriage Couple Assessment</CardTitle>
            <CardDescription>
              Complete your assessment to generate your couple compatibility report
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <Alert className="bg-blue-50 border-blue-200">
                <AlertTitle className="text-blue-800">Couple Assessment Invitation</AlertTitle>
                <AlertDescription className="text-blue-700">
                  {partnerName} has invited you to take the 100 Marriage Assessment.
                  Once you complete your assessment, you'll both receive a detailed couple compatibility report.
                </AlertDescription>
              </Alert>
              
              <h3 className="text-lg font-medium">What to expect:</h3>
              <ol className="list-decimal list-inside space-y-3 text-gray-700">
                <li>You'll provide some basic demographic information</li>
                <li>You'll answer 99 questions about your views on marriage</li>
                <li>Upon completion, a couple assessment report will be generated showing:
                  <ul className="list-disc list-inside ml-6 mt-2 space-y-1 text-gray-600">
                    <li>Your compatibility level with your partner</li>
                    <li>Areas where you have strong alignment</li>
                    <li>Key differences in your perspectives</li>
                    <li>Recommended areas for discussion</li>
                  </ul>
                </li>
              </ol>
              
              <div className="bg-gray-50 p-4 rounded-md mt-4">
                <p className="text-sm text-gray-600">
                  The assessment will take approximately 15-20 minutes to complete.
                  Your honest responses will provide the most valuable insights for your relationship.
                </p>
              </div>
              
              <div className="flex justify-center pt-4">
                <Button size="lg" onClick={() => setCurrentView('demographics')}>
                  Begin Assessment
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  // Render demographics view
  if (currentView === 'demographics') {
    return (
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <div className="demographic-wrapper">
          <h2 className="text-2xl font-bold mb-4">Tell Us About Yourself</h2>
          <p className="mb-6">As the spouse in this assessment, we need to gather some information about you.</p>
          <DemographicView 
            demographicData={demographicData}
            onChange={(field, value) => setDemographicData({...demographicData, [field]: value})}
            onSubmit={handleCompleteDemographics}
            onBack={() => setCurrentView('intro')}
          />
        </div>
      </div>
    );
  }
  
  // Render questionnaire view
  if (currentView === 'questionnaire') {
    return (
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <QuestionnaireView 
          onComplete={handleCompleteQuestionnaire}
          demographics={demographicData}
        />
      </div>
    );
  }
  
  // Render results view
  if (currentView === 'results') {
    return (
      <div className="container max-w-5xl mx-auto py-8 px-4">
        <ResultsView 
          scores={scores}
          primaryProfile={primaryProfile}
          genderProfile={genderProfile}
          userEmail={demographicData.email}
          emailSending={false}
          onSendEmail={() => {}} // Disable email sending for spouse view
          hideRetakeButton={true}
          additionalActions={
            <Button 
              size="lg" 
              onClick={handleSubmitSpouseAssessment}
              className="w-full sm:w-auto mt-4 bg-green-600 hover:bg-green-700"
            >
              Complete Couple Assessment
            </Button>
          }
        />
      </div>
    );
  }
  
  // Render completion view
  if (currentView === 'complete') {
    return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
        <Card className="border-green-200">
          <CardHeader className="bg-green-50">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-600" />
              <CardTitle>Assessment Completed!</CardTitle>
            </div>
            <CardDescription>
              Your couple assessment report is now available
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <p className="text-gray-700">
                Thank you for completing your assessment. Your results have been submitted and 
                a comprehensive couple compatibility report has been generated.
              </p>
              
              <Alert className="bg-green-50 border-green-200">
                <Check className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Success</AlertTitle>
                <AlertDescription className="text-green-700">
                  Both you and your partner can now view your couple assessment report.
                </AlertDescription>
              </Alert>
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h4 className="font-medium mb-2">What happens next?</h4>
                <ul className="list-disc list-inside space-y-2 text-sm text-gray-600">
                  <li>Review your couple report to understand your compatibility</li>
                  <li>Focus on discussing areas where you have significant differences</li>
                  <li>Consider scheduling a consultation with Lawrence E. Adjah for personalized guidance</li>
                </ul>
              </div>
              
              <div className="flex justify-center pt-4">
                <Button onClick={() => setLocation(`/couple-assessment/report/${coupleId}`)}>
                  View Couple Report
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  return null;
}