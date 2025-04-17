import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'wouter';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, AlertTriangle, CheckCircle } from 'lucide-react';
import { apiRequest } from '@/lib/queryClient';
import { AssessmentResult } from '@/types/assessment';

/**
 * This page is accessed when a spouse clicks on their invitation link
 * The URL format is: /couple-assessment/:coupleId
 * 
 * It validates the coupleId and allows the spouse to begin their assessment
 */
export default function CoupleAssessmentInvite() {
  const [, setLocation] = useLocation();
  const params = useParams<{ coupleId: string }>();
  const coupleId = params?.coupleId;
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [primaryPartner, setPrimaryPartner] = useState<{
    name?: string;
    email?: string;
    completed: boolean;
  }>({ completed: false });
  
  // Fetch the status of this couple assessment
  useEffect(() => {
    if (!coupleId) {
      setError('Invalid invitation link. Please contact your significant other for a new invitation.');
      setIsLoading(false);
      return;
    }
    
    const checkCoupleStatus = async () => {
      try {
        const response = await apiRequest('GET', `/api/couple-assessment/${coupleId}`);
        
        if (!response.ok) {
          // If 404, the primary assessment hasn't been completed yet
          if (response.status === 404) {
            setError('Your significant other has not completed their assessment yet. Please wait for them to finish, or contact them for a new invitation.');
            setIsLoading(false);
            return;
          }
          
          throw new Error('Failed to validate couple assessment');
        }
        
        const data = await response.json();
        
        if (data.coupleReport) {
          // Both partners have already completed the assessment
          setPrimaryPartner({
            name: data.coupleReport.primaryAssessment.demographics.firstName,
            email: data.coupleReport.primaryAssessment.email,
            completed: true
          });
          
          setError('Both assessments have already been completed. You can view your compatibility report below.');
        } else if (data.primaryAssessment) {
          // Only primary partner has completed their assessment
          setPrimaryPartner({
            name: data.primaryAssessment.demographics.firstName,
            email: data.primaryAssessment.email,
            completed: true
          });
        }
        
        setIsLoading(false);
      } catch (err) {
        console.error("Error validating couple assessment:", err);
        setError('Failed to validate your invitation. Please try again later or contact your significant other for a new invitation.');
        setIsLoading(false);
      }
    };
    
    checkCoupleStatus();
  }, [coupleId]);
  
  const startSpouseAssessment = () => {
    // Redirect to the assessment page with the coupleId parameter
    setLocation(`/assessment?coupleId=${coupleId}&role=spouse`);
  };
  
  const viewCoupleReport = () => {
    // Redirect to the couple report page
    setLocation(`/couple-report/${coupleId}`);
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-gradient-to-b from-purple-50 to-white">
      <Card className="w-full max-w-lg shadow-lg border-purple-200">
        <CardHeader className="text-center bg-gradient-to-r from-purple-100 to-purple-50">
          <CardTitle className="text-2xl text-purple-900">The 100 Marriage Assessment - Series 1</CardTitle>
          <CardDescription className="text-purple-700 text-lg font-medium">
            Couple Assessment Invitation
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6 space-y-6">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-8">
              <Loader2 className="h-12 w-12 text-purple-600 animate-spin mb-4" />
              <p className="text-purple-800">Validating your invitation...</p>
            </div>
          ) : error ? (
            <Alert variant="destructive" className="bg-amber-50 border-amber-200 text-amber-800">
              <AlertTriangle className="h-5 w-5 text-amber-600" />
              <AlertDescription className="ml-2">{error}</AlertDescription>
              
              {primaryPartner.completed && (
                <div className="mt-4">
                  <Button 
                    onClick={viewCoupleReport} 
                    className="bg-purple-600 hover:bg-purple-700 mt-2"
                  >
                    View Compatibility Report
                  </Button>
                </div>
              )}
            </Alert>
          ) : (
            <>
              <div className="text-center">
                <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-green-800 mb-2">Your Invitation is Valid!</h3>
                <p className="text-gray-600">
                  {primaryPartner.name 
                    ? `${primaryPartner.name} has invited you to take the 100 Marriage Assessment.` 
                    : 'Your significant other has invited you to take the 100 Marriage Assessment.'}
                </p>
              </div>
              
              <div className="bg-purple-50 p-4 rounded-md border border-purple-100">
                <h4 className="font-medium text-purple-800 mb-2">What to Expect:</h4>
                <ul className="space-y-2 text-sm text-purple-700">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 mr-2 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>You'll complete a ~100 question assessment (takes about 15-20 minutes)</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 mr-2 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Once completed, you'll both receive a comprehensive compatibility report</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 mr-2 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Your answers will be private until both of you have completed the assessment</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 mr-2 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>You'll get insights into your relationship alignment and potential growth areas</span>
                  </li>
                </ul>
              </div>
            </>
          )}
        </CardContent>
        
        <CardFooter className="flex justify-center pb-6">
          {!isLoading && !error && (
            <Button 
              onClick={startSpouseAssessment} 
              size="lg"
              className="bg-purple-600 hover:bg-purple-700 mt-4"
            >
              Start My Assessment
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}