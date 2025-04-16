import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

interface PromoCodeFormProps {
  promoCode: string;
  onChange: (value: string) => void;
  onSuccess: () => void;
  assessmentType?: 'individual' | 'couple';
}

export default function PromoCodeForm({ 
  promoCode, 
  onChange, 
  onSuccess,
  assessmentType = 'individual'
}: PromoCodeFormProps) {
  const [isVerifying, setIsVerifying] = useState<boolean>(false);
  
  const handleVerifyPromoCode = async () => {
    if (!promoCode.trim()) {
      toast({
        title: "Missing Promo Code",
        description: "Please enter a promo code to verify.",
        variant: "destructive"
      });
      return;
    }

    setIsVerifying(true);
    
    try {
      // Make API call to verify promo code, include assessment type
      const response = await apiRequest('POST', '/api/verify-promo-code', { 
        promoCode: promoCode.trim(),
        assessmentType
      });
      
      const result = await response.json();
      
      if (result.valid) {
        toast({
          title: "Promo Code Applied",
          description: "Your promo code has been accepted. You can now proceed to the assessment.",
          variant: "default"
        });
        onSuccess();
      } else {
        toast({
          title: "Invalid Promo Code",
          description: "The promo code you entered is not valid.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error verifying promo code:", error);
      toast({
        title: "Verification Error",
        description: "There was a problem verifying your promo code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsVerifying(false);
    }
  };

  return (
    <div className="space-y-3">
      <Label htmlFor="promoCode" className="text-sm font-medium">
        {assessmentType === 'individual' 
          ? 'Enter Your Individual Assessment Promo Code'
          : 'Enter Your Couple Assessment Promo Code'
        }
      </Label>
      <div className="flex gap-2">
        <Input
          id="promoCode"
          type="text"
          placeholder="Enter promo code"
          value={promoCode}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1"
        />
        <Button 
          type="button"
          variant="outline" 
          onClick={handleVerifyPromoCode}
          disabled={!promoCode || isVerifying}
          className={assessmentType === 'individual'
            ? "bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
            : "bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200"
          }
        >
          {isVerifying ? "Verifying..." : "Apply Code"}
        </Button>
      </div>

      {assessmentType === 'individual' ? (
        <div className="mt-3 px-3 py-2 bg-blue-50 rounded-md border border-blue-100">
          <p className="text-sm text-blue-800 mb-1">
            <span className="font-bold">Individual Assessment:</span> This promo code is valid for the $49 individual assessment.
          </p>
          <p className="text-xs text-blue-700">
            <strong>Couples Tip:</strong> Each spouse can take their own assessment and compare overall scores to gauge alignment.
          </p>
        </div>
      ) : (
        <div className="mt-3 px-3 py-2 bg-purple-50 rounded-md border border-purple-100">
          <p className="text-sm text-purple-800 mb-1">
            <span className="font-bold">Couple Assessment:</span> This promo code is valid for the $79 couple assessment.
          </p>
          <p className="text-xs text-purple-700">
            <strong>What's Included:</strong> Two complete assessments with comprehensive compatibility analysis.
          </p>
        </div>
      )}
      
      <p className="text-xs text-gray-500 mt-2">
        Upon verification, your report will be available immediately after completing the assessment.
      </p>
    </div>
  );
}