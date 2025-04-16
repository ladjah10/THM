import React, { useState } from 'react';
import { CoupleAssessmentReport, AssessmentResult } from '@shared/schema';
import { CoupleReport } from './CoupleAssessmentReport';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { Mail, ArrowRight, Copy, CheckCircle } from 'lucide-react';

interface CoupleAssessmentViewProps {
  assessment: AssessmentResult;
  onBack: () => void;
}

export const CoupleAssessmentView: React.FC<CoupleAssessmentViewProps> = ({ 
  assessment, 
  onBack 
}) => {
  const { toast } = useToast();
  const [step, setStep] = useState<'invite' | 'pending' | 'viewing'>('invite');
  const [spouseEmail, setSpouseEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [coupleId, setCoupleId] = useState<string | null>(null);
  const [inviteLink, setInviteLink] = useState<string | null>(null);
  const [linkCopied, setLinkCopied] = useState(false);
  const [coupleReport, setCoupleReport] = useState<CoupleAssessmentReport | null>(null);

  // Function to start the couple assessment process
  const startCoupleAssessment = async () => {
    if (!spouseEmail) {
      toast({
        title: "Email Required",
        description: "Please enter your spouse's email address.",
        variant: "destructive"
      });
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(spouseEmail)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive"
      });
      return;
    }

    // Don't allow using the same email
    if (spouseEmail.toLowerCase() === assessment.email.toLowerCase()) {
      toast({
        title: "Invalid Email",
        description: "Please use a different email address for your spouse.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await apiRequest('POST', '/api/couple-assessment/start', {
        primaryAssessment: assessment,
        spouseEmail
      });

      if (!response.ok) {
        throw new Error('Failed to start couple assessment');
      }

      const data = await response.json();
      setCoupleId(data.coupleId);
      
      // Create invite link
      const baseUrl = window.location.origin;
      const inviteUrl = `${baseUrl}/couple-assessment/${data.coupleId}`;
      setInviteLink(inviteUrl);
      
      // Move to pending step
      setStep('pending');
      
      toast({
        title: "Couple Assessment Started",
        description: "Your assessment has been saved. Share the link with your spouse to complete the couple assessment.",
      });
    } catch (error) {
      console.error('Error starting couple assessment:', error);
      toast({
        title: "Error",
        description: "There was a problem starting the couple assessment. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to copy invite link to clipboard
  const copyInviteLink = () => {
    if (inviteLink) {
      navigator.clipboard.writeText(inviteLink)
        .then(() => {
          setLinkCopied(true);
          setTimeout(() => setLinkCopied(false), 2000);
          toast({
            title: "Link Copied",
            description: "Assessment link copied to clipboard",
          });
        })
        .catch(err => {
          console.error('Failed to copy link: ', err);
          toast({
            title: "Copy Failed",
            description: "Could not copy the link. Please try again.",
            variant: "destructive"
          });
        });
    }
  };

  // Function to check if spouse has completed assessment
  const checkCoupleAssessment = async () => {
    if (!coupleId) return;

    try {
      const response = await apiRequest('GET', `/api/couple-assessment/${coupleId}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success && data.coupleReport) {
          setCoupleReport(data.coupleReport);
          setStep('viewing');
          return true;
        }
      }
      
      return false;
    } catch (error) {
      console.error('Error checking couple assessment:', error);
      return false;
    }
  };

  // Poll for spouse completion
  React.useEffect(() => {
    let intervalId: number;
    
    if (step === 'pending' && coupleId) {
      // Check immediately first
      checkCoupleAssessment();
      
      // Then poll every 30 seconds
      intervalId = window.setInterval(async () => {
        const completed = await checkCoupleAssessment();
        if (completed) {
          clearInterval(intervalId);
        }
      }, 30000);
    }
    
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [step, coupleId]);

  // Rendering different views based on the current step
  if (step === 'viewing' && coupleReport) {
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <Button variant="outline" onClick={onBack}>
            Back to Results
          </Button>
          
          <h2 className="text-xl font-semibold">Couple Assessment Report</h2>
        </div>
        
        <CoupleReport report={coupleReport} />
      </div>
    );
  }

  if (step === 'pending') {
    return (
      <div className="max-w-2xl mx-auto space-y-6">
        <Button variant="outline" onClick={onBack}>
          Back to Results
        </Button>
        
        <Card className="border-blue-200">
          <CardHeader className="bg-blue-50">
            <CardTitle className="text-xl">Couple Assessment Pending</CardTitle>
            <CardDescription>
              Waiting for your spouse to complete their assessment
            </CardDescription>
          </CardHeader>
          
          <CardContent className="pt-6">
            <Alert className="mb-6 bg-amber-50 border-amber-200">
              <AlertTitle className="flex items-center text-amber-800 gap-2">
                <Mail className="h-4 w-4" />
                Invitation Sent
              </AlertTitle>
              <AlertDescription className="text-amber-700">
                Share the link below with your spouse so they can complete their assessment.
                Once they've submitted their responses, your couple assessment report will be available.
              </AlertDescription>
            </Alert>
            
            <div className="flex items-center gap-2 mb-6">
              <Input 
                value={inviteLink || ''} 
                readOnly 
                className="font-mono text-sm"
              />
              <Button 
                variant="outline" 
                size="icon" 
                onClick={copyInviteLink}
                className="flex-shrink-0"
              >
                {linkCopied ? (
                  <CheckCircle className="h-4 w-4 text-green-600" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
            
            <div className="rounded-md bg-muted p-4">
              <h4 className="font-medium mb-2">What happens next?</h4>
              <ol className="list-decimal list-inside space-y-2 text-sm text-muted-foreground">
                <li>Your spouse will receive the link to take their assessment</li>
                <li>Once they complete it, your couple report will be automatically generated</li>
                <li>You'll be able to view your compatibility analysis and areas for discussion</li>
                <li>This page will update automatically when your spouse completes their assessment</li>
              </ol>
            </div>
          </CardContent>
          
          <CardFooter className="bg-gray-50 border-t flex justify-between">
            <div className="text-sm text-gray-500">
              Assessment ID: {coupleId}
            </div>
            <Button 
              variant="default" 
              onClick={checkCoupleAssessment}
            >
              Check Status
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  // Default: invite step
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Button variant="outline" onClick={onBack}>
        Back to Results
      </Button>
      
      <Card className="border-blue-200">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-xl">Start Couple Assessment</CardTitle>
          <CardDescription>
            Compare your assessment with your spouse to identify strengths and areas for growth
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-6">
          <div className="space-y-6">
            <p className="text-gray-700">
              The couple assessment allows you to see how your perspectives align with your spouse's. 
              You'll get personalized insights on your compatibility, strengths, and areas that may 
              benefit from deeper discussion.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
              <Card className="border-green-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-green-800">Strengths Analysis</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-gray-600">
                  Identify areas where you and your spouse align well
                </CardContent>
              </Card>
              
              <Card className="border-amber-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-amber-800">Differences Highlight</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-gray-600">
                  Pinpoint questions where your responses differ significantly
                </CardContent>
              </Card>
              
              <Card className="border-blue-100">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-blue-800">Growth Opportunities</CardTitle>
                </CardHeader>
                <CardContent className="text-xs text-gray-600">
                  Recommendations for focused discussions and growth
                </CardContent>
              </Card>
            </div>
            
            <Separator />
            
            <div className="space-y-3">
              <label className="text-sm font-medium">
                Enter your spouse's email address:
              </label>
              <div className="flex gap-2">
                <Input 
                  type="email" 
                  placeholder="spouse@example.com" 
                  value={spouseEmail}
                  onChange={(e) => setSpouseEmail(e.target.value)}
                  disabled={isSubmitting}
                  className="flex-1"
                />
                <Button 
                  onClick={startCoupleAssessment} 
                  disabled={isSubmitting || !spouseEmail}
                  className="gap-2"
                >
                  {isSubmitting ? 'Sending...' : 'Send Invite'}
                  {!isSubmitting && <ArrowRight className="h-4 w-4" />}
                </Button>
              </div>
              <p className="text-xs text-gray-500">
                Your spouse will receive a link to take their assessment. Once completed, 
                you'll both have access to your couple assessment report.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};