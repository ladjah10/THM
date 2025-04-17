import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Loader2, Heart, Mail, ArrowLeft } from 'lucide-react';

interface CoupleInviteFormProps {
  primaryEmail: string;
  spouseEmail: string;
  onSpouseEmailChange: (email: string) => void;
  onSubmit: () => Promise<void>;
  onCancel: () => void;
  loading: boolean;
}

export const CoupleInviteForm: React.FC<CoupleInviteFormProps> = ({
  primaryEmail,
  spouseEmail,
  onSpouseEmailChange,
  onSubmit,
  onCancel,
  loading
}) => {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit();
  };

  return (
    <div className="max-w-md mx-auto">
      <Card className="border-blue-200">
        <CardHeader className="bg-blue-50">
          <CardTitle className="text-xl flex items-center gap-2 text-blue-800">
            <Heart className="h-5 w-5" />
            Invite Your Significant Other
          </CardTitle>
          <CardDescription className="text-gray-600">
            Complete a couple's assessment to see how your marriage expectations align
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit}>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Your Email (already completed)
                </label>
                <Input
                  type="email"
                  value={primaryEmail}
                  disabled
                  className="bg-gray-50 text-gray-500"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">
                  Your Significant Other's Email
                </label>
                <Input
                  type="email"
                  placeholder="spouse@example.com"
                  value={spouseEmail}
                  onChange={(e) => onSpouseEmailChange(e.target.value)}
                  required
                  className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                />
                <p className="text-xs text-gray-500 mt-1">
                  We'll send an invitation to take the same assessment
                </p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-md">
                <h4 className="font-medium text-blue-800 flex items-center gap-1 text-sm">
                  <Mail className="h-4 w-4" />
                  How It Works
                </h4>
                <ul className="text-xs text-gray-600 mt-2 space-y-1 list-disc pl-5">
                  <li>Your significant other will receive an email invitation to take the assessment</li>
                  <li>Once they complete it, you'll both receive a comprehensive compatibility report</li>
                  <li>The report will highlight areas of alignment and potential differences</li>
                  <li>Both of you will be able to view the results online and receive them by email</li>
                </ul>
              </div>
            </div>
            
            <div className="flex justify-between mt-6">
              <Button 
                type="button" 
                variant="ghost" 
                onClick={onCancel}
                disabled={loading}
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </Button>
              
              <Button 
                type="submit"
                disabled={!spouseEmail || loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Sending Invitation...
                  </>
                ) : (
                  <>Send Invitation</>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};