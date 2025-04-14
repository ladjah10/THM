import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { DemographicData } from "@/types/assessment";

interface PaywallViewProps {
  demographicData: DemographicData;
  onChange: (field: keyof DemographicData, value: string | boolean) => void;
  onPaymentComplete: () => void;
}

export default function PaywallView({
  demographicData,
  onChange,
  onPaymentComplete
}: PaywallViewProps) {
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [isVerifyingPromo, setIsVerifyingPromo] = useState<boolean>(false);
  
  // Valid promo codes (in a real app, these would be stored in a database or validated through an API)
  const validPromoCodes = ["FREE100", "LA2025", "MARRIAGE100"];
  
  // Handle promo code verification
  const handleVerifyPromoCode = () => {
    if (!demographicData.promoCode) {
      toast({
        title: "Missing Promo Code",
        description: "Please enter a promo code to verify.",
        variant: "destructive"
      });
      return;
    }

    setIsVerifyingPromo(true);
    
    // Simulate API call to verify promo code
    setTimeout(() => {
      const isValid = validPromoCodes.includes(demographicData.promoCode);
      
      if (isValid) {
        onChange("hasPaid", true);
        toast({
          title: "Promo Code Applied",
          description: "Your promo code has been accepted. You can now proceed to the assessment.",
          variant: "default"
        });
        onPaymentComplete();
      } else {
        toast({
          title: "Invalid Promo Code",
          description: "The promo code you entered is not valid.",
          variant: "destructive"
        });
      }
      
      setIsVerifyingPromo(false);
    }, 1000);
  };
  
  // Handle mock payment
  const handleProcessPayment = () => {
    setIsProcessingPayment(true);
    
    // Simulate payment processing
    setTimeout(() => {
      onChange("hasPaid", true);
      setIsProcessingPayment(false);
      toast({
        title: "Payment Successful",
        description: "Thank you for your purchase. You can now access the assessment.",
        variant: "default"
      });
      onPaymentComplete();
    }, 1500);
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      <Card className="w-full max-w-lg border-primary-200 shadow-lg">
        <CardHeader className="text-center pb-6">
          <CardTitle className="text-2xl text-primary-700">The 100 Marriage Assessment - Series 1</CardTitle>
          <CardDescription className="text-lg mt-2">
            Access our comprehensive marriage assessment for $49
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center px-6">
            <p className="text-gray-700">
              This assessment will help you understand your relationship compatibility, 
              strengths and potential growth areas better than ever before.
            </p>
          </div>
          
          <div className="space-y-4 mt-6">
            <div className="bg-primary-50 p-4 rounded-md space-y-2">
              <h3 className="font-medium text-primary-800">What you'll receive:</h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Comprehensive 99-question assessment</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Detailed PDF report with your results</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Personalized psychological profile</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Access to consultation booking with Lawrence Adjah</span>
                </li>
              </ul>
            </div>
          </div>
            
          <div className="space-y-3">
            <Label htmlFor="promoCode" className="text-sm font-medium">
              Have a promo code?
            </Label>
            <div className="flex gap-2">
              <Input
                id="promoCode"
                type="text"
                placeholder="Enter your promo code"
                value={demographicData.promoCode}
                onChange={(e) => onChange("promoCode", e.target.value)}
                className="flex-1"
              />
              <Button 
                type="button"
                variant="outline" 
                onClick={handleVerifyPromoCode}
                disabled={!demographicData.promoCode || isVerifyingPromo}
              >
                {isVerifyingPromo ? "Verifying..." : "Apply"}
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4">
          <Button
            type="button"
            className="w-full py-6 text-base"
            onClick={handleProcessPayment}
            disabled={isProcessingPayment}
          >
            {isProcessingPayment ? 
              <div className="flex items-center gap-2">
                <span className="animate-spin w-4 h-4 border-2 border-t-transparent rounded-full"></span>
                Processing...
              </div> : 
              "Pay $49 and Start Assessment"
            }
          </Button>
          <p className="text-xs text-center text-gray-500 mt-4">
            By proceeding, you agree to our Terms of Service and Privacy Policy.
            Your report will be delivered to your email immediately after completion.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}