import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle2, Loader2, AlertCircle } from 'lucide-react';
import { registerEarlyCoupleAssessment, sendCoupleInvitations } from '@/utils/coupleUtils';
import { useToast } from '@/hooks/use-toast';

interface EarlySpouseInviteProps {
  primaryEmail: string;
  onSpouseEmailChange: (email: string) => void;
  spouseEmail: string;
  isInviteSent: boolean;
  setIsInviteSent: (sent: boolean) => void;
}

export const EarlySpouseInvite: React.FC<EarlySpouseInviteProps> = ({
  primaryEmail,
  onSpouseEmailChange,
  spouseEmail,
  isInviteSent,
  setIsInviteSent
}) => {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const handleInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!spouseEmail || !spouseEmail.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    if (spouseEmail === primaryEmail) {
      setError('You cannot invite yourself. Please enter your significant other\'s email.');
      return;
    }
    
    if (!primaryEmail || !primaryEmail.includes('@')) {
      setError('Your email is not valid. Please enter your email in the demographic section first.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Extract first name from primary email for better personalization
      // Format: If email is john.doe@example.com, use "John" as the name
      const primaryNameGuess = primaryEmail.split('@')[0].split('.')[0];
      const primaryNameFormatted = primaryNameGuess ? 
        primaryNameGuess.charAt(0).toUpperCase() + primaryNameGuess.slice(1) : 
        "Your significant other";
      
      // Register the couple assessment early
      const { coupleId } = await registerEarlyCoupleAssessment(primaryEmail, spouseEmail);
      
      // Send invitations to both partners - include the guessed name for better personalization
      const { success } = await sendCoupleInvitations(
        coupleId, 
        primaryEmail, 
        spouseEmail,
        primaryNameFormatted
      );
      
      if (success) {
        setIsInviteSent(true);
        toast({
          title: "Invitation Sent!",
          description: `An email has been sent to ${spouseEmail} with instructions to take their assessment.`,
          variant: "default",
        });
      } else {
        throw new Error("Failed to send invitation");
      }
    } catch (err) {
      console.error("Error inviting spouse:", err);
      setError('Failed to send invitation. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="mt-4 p-4 border border-purple-200 rounded-md bg-purple-50">
      <h3 className="font-medium text-purple-800 mb-2">Invite Your Significant Other Now</h3>
      
      {isInviteSent ? (
        <Alert className="bg-green-50 border-green-200 text-green-800">
          <CheckCircle2 className="h-4 w-4 mr-2" />
          <AlertDescription>
            Invitation sent to {spouseEmail}! They'll receive instructions to complete their assessment.
          </AlertDescription>
        </Alert>
      ) : (
        <>
          <p className="text-sm text-purple-700 mb-3">
            Enter your significant other's email to invite them to take their assessment now. 
            You can both complete your assessments at your own pace.
          </p>
          
          <form onSubmit={handleInvite} className="space-y-3">
            <div className="space-y-1">
              <Label htmlFor="spouseEmail" className="text-sm text-purple-800">
                Your Significant Other's Email
              </Label>
              <Input
                id="spouseEmail"
                type="email"
                placeholder="partner@example.com"
                value={spouseEmail}
                onChange={(e) => onSpouseEmailChange(e.target.value)}
                className="border-purple-200 focus:border-purple-400"
              />
            </div>
            
            {error && (
              <Alert variant="destructive" className="bg-red-50 border-red-200 py-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertDescription className="text-red-600 text-xs">{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="flex justify-between items-center">
              <p className="text-xs text-purple-600">
                How it works: They'll receive an email with instructions to take their assessment. Once both of you have completed the assessment, you'll both receive a comprehensive compatibility report.
              </p>
              <Button 
                type="submit" 
                size="sm"
                disabled={isLoading}
                className="ml-4 bg-purple-600 hover:bg-purple-700"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  'Send Invite'
                )}
              </Button>
            </div>
          </form>
        </>
      )}
    </div>
  );
};