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
}

export default function PromoCodeForm({ 
  promoCode, 
  onChange, 
  onSuccess 
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
      // Make API call to verify promo code
      const response = await apiRequest('POST', '/api/verify-promo-code', { 
        promoCode: promoCode.trim() 
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
        Enter Your Individual Assessment Promo Code
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
          className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
        >
          {isVerifying ? "Verifying..." : "Apply Code"}
        </Button>
      </div>
      <div className="mt-3 px-3 py-2 bg-blue-50 rounded-md border border-blue-100">
        <p className="text-sm text-blue-800">
          <span className="font-bold">Individual Assessment Only:</span> This promo code is valid for the $49 individual assessment.
        </p>
      </div>
      <p className="text-xs text-gray-500 mt-2">
        Upon verification, your report will be available immediately.
      </p>
    </div>
  );
}