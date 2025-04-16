import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { AssessmentResult } from '@shared/schema';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Send, Info } from 'lucide-react';

interface CoupleAssessmentViewProps {
  assessment: AssessmentResult;
  onBack: () => void;
}

// Form schema for spouse invitation
const inviteFormSchema = z.object({
  spouseEmail: z
    .string()
    .email('Please enter a valid email address')
    .refine(val => val !== '', {
      message: 'Please enter your spouse or partner\'s email'
    })
});

export const CoupleAssessmentView: React.FC<CoupleAssessmentViewProps> = ({ 
  assessment,
  onBack
}) => {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [inviteSent, setInviteSent] = useState(false);
  const [coupleId, setCoupleId] = useState<string | null>(null);
  
  // Form setup
  const form = useForm<z.infer<typeof inviteFormSchema>>({
    resolver: zodResolver(inviteFormSchema),
    defaultValues: {
      spouseEmail: ''
    }
  });
  
  // Handle form submission
  const onSubmit = async (values: z.infer<typeof inviteFormSchema>) => {
    if (loading) return;
    
    setLoading(true);
    try {
      const response = await apiRequest('POST', '/api/couple-assessment/start', {
        primaryAssessment: assessment,
        spouseEmail: values.spouseEmail
      });
      
      if (!response.ok) {
        throw new Error('Failed to create couple assessment');
      }
      
      const data = await response.json();
      setCoupleId(data.coupleId);
      setInviteSent(true);
      
      toast({
        title: 'Invitation Sent',
        description: `An invitation has been sent to ${values.spouseEmail} to complete their assessment.`,
      });
    } catch (error) {
      console.error('Error starting couple assessment:', error);
      toast({
        title: 'Error',
        description: 'Failed to start couple assessment. Please try again.',
        variant: 'destructive'
      });
    } finally {
      setLoading(false);
    }
  };
  
  // Render success state after invitation is sent
  if (inviteSent && coupleId) {
    return (
      <Card className="border-green-200">
        <CardHeader className="bg-green-50">
          <CardTitle>Couple Assessment Started</CardTitle>
          <CardDescription>
            Your invitation has been sent successfully
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div className="flex items-center gap-4 p-4 bg-green-50 border border-green-100 rounded-lg">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                <Send className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <h3 className="font-medium text-green-800">Invitation Sent</h3>
                <p className="text-green-700 text-sm">
                  An email invitation has been sent to your spouse or partner to complete their assessment.
                </p>
              </div>
            </div>
            
            <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                <div>
                  <h4 className="font-medium text-blue-800">What happens next?</h4>
                  <ol className="mt-2 space-y-2 text-sm text-blue-700 list-decimal list-inside">
                    <li>Your spouse will receive an email with a link to complete their assessment</li>
                    <li>Once they complete it, a comprehensive couple report will be generated</li>
                    <li>You'll both be able to view the report showing your compatibility</li>
                  </ol>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div className="flex flex-col md:flex-row gap-3 pt-2">
              <Button 
                variant="outline" 
                onClick={onBack}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to My Results
              </Button>
              
              <Button 
                onClick={() => setLocation(`/couple-assessment/report/${coupleId}`)}
                className="bg-blue-600 hover:bg-blue-500"
              >
                Check Report Status
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }
  
  // Render form to invite spouse
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Start Couple Assessment</CardTitle>
            <CardDescription>
              Invite your spouse or partner to take the assessment
            </CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
            <h3 className="font-medium text-blue-800 mb-2">About Couple Assessments</h3>
            <p className="text-blue-700 text-sm mb-3">
              The 100 Marriage Couple Assessment compares your results with your spouse or significant other, 
              providing insights into your compatibility and differences in marriage expectations.
            </p>
            <ul className="space-y-2 text-sm text-blue-700">
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Your spouse will receive an email invitation to complete their own assessment</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Once they complete it, a comprehensive couple report will be generated</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>The report will highlight areas of strong alignment and potential differences</span>
              </li>
              <li className="flex items-start">
                <span className="text-blue-500 mr-2">•</span>
                <span>Use these insights to strengthen communication and understanding in your relationship</span>
              </li>
            </ul>
          </div>
          
          <Separator />
          
          <div>
            <h3 className="text-lg font-medium mb-4">Invite Your Spouse or Partner</h3>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="spouseEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Spouse/Partner's Email Address</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Enter their email address" 
                          {...field} 
                        />
                      </FormControl>
                      <FormDescription>
                        We'll send them an invitation to complete their assessment.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="pt-2">
                  <Button 
                    type="submit" 
                    className="w-full sm:w-auto bg-green-600 hover:bg-green-500"
                    disabled={loading}
                  >
                    {loading ? 'Sending...' : 'Send Invitation'}
                  </Button>
                </div>
              </form>
            </Form>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};