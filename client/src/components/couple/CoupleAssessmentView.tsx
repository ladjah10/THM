import { useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Progress } from '@/components/ui/progress';
import { InfoIcon, UsersIcon, Mail, User, HeartHandshake } from 'lucide-react';

interface CoupleAssessmentViewProps {
  primaryEmail: string;
  spouseEmail: string;
  onSpouseEmailChange: (email: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
  loading: boolean;
}

export function CoupleAssessmentView({
  primaryEmail,
  spouseEmail,
  onSpouseEmailChange,
  onSubmit,
  onCancel,
  loading
}: CoupleAssessmentViewProps) {
  // State to validate email format
  const [emailError, setEmailError] = useState<string | null>(null);

  // Validate email format and ensure it's different from primary email
  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email) {
      setEmailError("Please enter your spouse's email address");
      return false;
    }
    
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      return false;
    }
    
    if (email.toLowerCase() === primaryEmail.toLowerCase()) {
      setEmailError("Please enter a different email address than your own");
      return false;
    }
    
    setEmailError(null);
    return true;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateEmail(spouseEmail)) {
      onSubmit();
    }
  };

  return (
    <Card className="w-full border-blue-200">
      <CardHeader className="bg-blue-50 border-b border-blue-100">
        <div className="flex items-center gap-2">
          <HeartHandshake className="h-6 w-6 text-blue-600" />
          <CardTitle>Couple Assessment Invitation</CardTitle>
        </div>
        <CardDescription>
          Invite your spouse to complete their assessment for a detailed compatibility report
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6 space-y-6">
        {/* Explanation */}
        <div className="rounded-lg bg-blue-50 p-4 text-sm text-blue-800">
          <div className="flex items-start gap-3">
            <InfoIcon className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
            <div>
              <p className="font-medium mb-1">How the Couple Assessment Works</p>
              <ol className="list-decimal list-inside space-y-1 text-blue-700">
                <li>You'll provide your spouse's email address</li>
                <li>They'll receive an invitation to complete the same assessment</li>
                <li>Once they finish, you'll both receive a comprehensive compatibility report</li>
              </ol>
            </div>
          </div>
        </div>
        
        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="primaryEmail" className="text-gray-600">Your Email</Label>
              <div className="flex items-center mt-1.5 border rounded-md bg-gray-50 px-3 py-2 text-gray-600">
                <User className="h-4 w-4 text-gray-400 mr-2" />
                <span>{primaryEmail}</span>
              </div>
            </div>
            
            <div>
              <Label htmlFor="spouseEmail" className="text-gray-600">
                Spouse's Email <span className="text-red-500">*</span>
              </Label>
              <div className="flex items-center mt-1.5">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <Mail className="h-4 w-4 text-gray-400" />
                  </div>
                  <Input
                    id="spouseEmail"
                    type="email"
                    placeholder="partner@example.com"
                    value={spouseEmail}
                    onChange={(e) => {
                      onSpouseEmailChange(e.target.value);
                      validateEmail(e.target.value);
                    }}
                    className={`pl-10 ${emailError ? 'border-red-300 focus:ring-red-500' : ''}`}
                    disabled={loading}
                  />
                </div>
              </div>
              {emailError && (
                <p className="mt-1.5 text-sm text-red-600">{emailError}</p>
              )}
            </div>
          </div>
          
          {/* Additional info */}
          <Alert className="bg-amber-50 border-amber-200">
            <AlertTitle className="text-amber-800">Couple Assessment Fee</AlertTitle>
            <AlertDescription className="text-amber-700">
              The couple assessment costs $79 (instead of $98 for two individual assessments).
              This fee covers both your completed assessment and your spouse's assessment.
            </AlertDescription>
          </Alert>
        </form>
      </CardContent>
      
      <CardFooter className="flex justify-between bg-gray-50 border-t gap-4 flex-wrap">
        <Button 
          variant="outline"
          onClick={onCancel}
          disabled={loading}
        >
          Cancel
        </Button>
        
        <div className="flex items-center gap-3">
          {loading && (
            <div className="flex items-center gap-2">
              <Progress value={80} className="w-20 h-2" />
              <span className="text-sm text-gray-600">Processing...</span>
            </div>
          )}
          
          <Button 
            type="submit"
            onClick={handleSubmit}
            disabled={loading}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <UsersIcon className="mr-2 h-4 w-4" />
            Send Invitation
          </Button>
        </div>
      </CardFooter>
    </Card>
  );
}