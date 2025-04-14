import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { DemographicData } from "@/types/assessment";
import StripePaymentForm from "@/components/payment/StripePaymentForm";
import PromoCodeForm from "@/components/payment/PromoCodeForm";

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
  // Handle successful payment
  const handlePaymentSuccess = () => {
    onChange("hasPaid", true);
    onPaymentComplete();
  };
  
  // Handle successful promo code
  const handlePromoSuccess = () => {
    onChange("hasPaid", true);
    onPaymentComplete();
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
          
          <Tabs defaultValue="card" className="w-full mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="card">Pay with Card</TabsTrigger>
              <TabsTrigger value="promo">Use Promo Code</TabsTrigger>
            </TabsList>
            <TabsContent value="card" className="mt-4">
              <StripePaymentForm onPaymentSuccess={handlePaymentSuccess} />
            </TabsContent>
            <TabsContent value="promo" className="mt-4">
              <PromoCodeForm 
                promoCode={demographicData.promoCode}
                onChange={(value) => onChange("promoCode", value)}
                onSuccess={handlePromoSuccess}
              />
              <div className="mt-4 text-xs text-gray-500">
                <p>Valid promo codes: FREE100, LA2025, MARRIAGE100</p>
                <p className="mt-1">* For demonstration purposes only.</p>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Separator className="my-2" />
          <p className="text-xs text-center text-gray-500">
            By proceeding, you agree to our Terms of Service and Privacy Policy.
            Your report will be delivered to your email immediately after completion.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}