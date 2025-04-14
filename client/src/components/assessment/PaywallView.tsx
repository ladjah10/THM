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
        <CardHeader className="text-center pb-6 bg-gradient-to-b from-blue-50 to-white">
          <CardTitle className="text-2xl text-blue-900">The 100 Marriage Assessment - Series 1</CardTitle>
          <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
            Individual Assessment ($49)
          </div>
          <CardDescription className="text-lg mt-2 text-gray-700">
            Misaligned Expectations Can Destroy Relationships—Align Yours for Only $49
          </CardDescription>
          <div className="mt-3 px-3 py-2 bg-blue-50 rounded-md text-left border border-blue-100">
            <p className="text-sm text-blue-800 mb-1">
              <strong>For Couples:</strong> Each spouse can take their own assessment and compare scores.
            </p>
            <p className="text-xs text-blue-700">
              The closer your percentage scores align, the more aligned your expectations will be in marriage.
            </p>
            <p className="text-xs mt-2 text-blue-600">
              Enhanced couples assessment with detailed comparison analysis coming soon ($79).
            </p>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center px-6">
            <h3 className="font-semibold text-blue-900 text-lg mb-2">
              Why Take The 100 Marriage Assessment?
            </h3>
            <p className="text-gray-700">
              Discover How to Uncover Hidden Expectations, Prepare for a God-Centered Future, and Thrive—Whether You're Dating, Engaged, or Building a Stronger Bond.
            </p>
          </div>
          
          <div className="space-y-4 mt-6">
            <h3 className="font-semibold text-blue-900 text-lg">Here's What You'll Gain:</h3>
            <div className="bg-blue-50 p-4 rounded-md space-y-3">
              <ul className="space-y-3 text-gray-700">
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>In-Depth ~100 Question Assessment to Uncover Expectations for Dating, Engagement, or Marriage</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Personalized PDF Report with Insights to Guide Your Journey to a Lasting Relationship</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Custom Profile to Clarify Your Expectations and Dynamics—Perfect for Dating or Deepening Commitment</span>
                </li>
                <li className="flex items-start">
                  <svg className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                  <span>Exclusive Access to Book a 1:1 Consultation with Marriage Expert Lawrence Adjah for Personalized Guidance</span>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 rounded-md border border-gray-100">
            <h3 className="text-center text-gray-700 font-medium mb-2">
              Secure Payment with Card | Apply a Promo Code to Save
            </h3>
            <p className="text-center text-sm text-gray-500 mb-4">
              Your Payment is Securely Processed by Stripe for Peace of Mind.
            </p>
            
            <Tabs defaultValue="card" className="w-full">
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
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-2 bg-gray-50">
          <p className="text-sm text-center text-gray-600">
            By proceeding, you agree to our Terms of Service and Privacy Policy. Get ready—your personalized report will be emailed to you right after completion, guiding you toward a thriving future!
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}