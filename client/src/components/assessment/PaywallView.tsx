import { useState } from "react";
import { Link } from "wouter";
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
import ReferralForm from "@/components/payment/ReferralForm";

import { useToast } from "@/hooks/use-toast";

interface PaywallViewProps {
  demographicData: DemographicData;
  onChange: (field: keyof DemographicData, value: string | boolean) => void;
  onPaymentComplete: () => void;
  assessmentType?: 'individual' | 'couple';
}

export default function PaywallView({
  demographicData,
  onChange,
  onPaymentComplete,
  assessmentType = 'individual'
}: PaywallViewProps) {
  const { toast } = useToast();
  // Handle successful payment
  const handlePaymentSuccess = async () => {
    onChange("hasPaid", true);
    
    // If user is interested in arranged marriage, mark them as applied when payment succeeds
    if (demographicData.interestedInArrangedMarriage) {
      onChange("thmPoolApplied", true);
    }
    
    onPaymentComplete();
  };
  
  // Handle successful promo code
  const handlePromoSuccess = () => {
    onChange("hasPaid", true);
    onPaymentComplete();
  };

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center">
      {/* Navigation Links */}
      <div className="w-full max-w-lg mb-4 p-2 bg-white rounded-md shadow-sm flex justify-center space-x-6">
        <Link href="/">
          <span className="text-gray-700 hover:text-blue-700 font-medium cursor-pointer">Home</span>
        </Link>
        <a 
          href="https://lawrenceadjah.com/about" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-700 hover:text-blue-700 font-medium"
        >
          About
        </a>
        <a 
          href="https://lawrenceadjah.com/the100marriagebook" 
          target="_blank" 
          rel="noopener noreferrer"
          className="text-gray-700 hover:text-blue-700 font-medium"
        >
          Purchase Book
        </a>
        <Link href="/invite">
          <span className="text-amber-600 hover:text-amber-500 font-medium cursor-pointer">Invite Friends</span>
        </Link>
      </div>
      
      <Card className="w-full max-w-lg border-primary-200 shadow-lg">
        <CardHeader className="text-center pb-6 bg-gradient-to-b from-blue-50 to-white">
          <CardTitle className="text-2xl text-blue-900">The 100 Marriage Assessment - Series 1</CardTitle>
          
          {assessmentType === 'individual' ? (
            <>
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
              </div>
            </>
          ) : (
            <>
              <div className="inline-block bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-medium mb-2">
                Couple Assessment ($79)
              </div>
              <CardDescription className="text-lg mt-2 text-gray-700">
                Discover Your Compatibility—One Assessment for You, One for Your Spouse
              </CardDescription>
              <div className="mt-3 px-3 py-2 bg-purple-50 rounded-md text-left border border-purple-100">
                <p className="text-sm text-purple-800 mb-1">
                  <strong>What's Included:</strong> Two full assessments with comprehensive compatibility analysis
                </p>
                <p className="text-xs text-purple-700">
                  Get a detailed analysis of where you align and differ, with recommendations for growing together
                </p>
              </div>
            </>
          )}
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
            <div className={`${assessmentType === 'individual' ? 'bg-blue-50' : 'bg-purple-50'} p-4 rounded-md space-y-3`}>
              <ul className="space-y-3 text-gray-700">
                {assessmentType === 'individual' ? (
                  <>
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
                  </>
                ) : (
                  <>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 mr-2 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>Two Complete Assessments - One for You and One for Your Spouse</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 mr-2 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>Comprehensive Comparison Analysis Showing Your Alignment and Differences</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 mr-2 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>Joint PDF Report with Customized Recommendation for Growth Together</span>
                    </li>
                    <li className="flex items-start">
                      <svg className="h-5 w-5 mr-2 text-purple-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                      <span>Priority Access to Book a Couple's Consultation with Marriage Expert Lawrence Adjah</span>
                    </li>
                  </>
                )}
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
            
            {/* Explanation for couple assessment flow */}
            {assessmentType === 'couple' && (
              <div className="p-4 bg-purple-50 rounded-md border border-purple-100 mb-4">
                <h4 className="font-medium text-purple-800 mb-2">Couple Assessment Information</h4>
                <p className="text-sm text-purple-700 mb-2">
                  You've selected the couple assessment option. After payment, you'll enter your demographic information and be able to invite your significant other.
                </p>
                <p className="text-xs text-purple-600">
                  The invite will be sent via email once you provide your information, and you'll both be able to complete the assessment separately, at your own pace.
                </p>
              </div>
            )}
            
            <Tabs defaultValue="card" className="w-full mt-4">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="card">Pay with Card</TabsTrigger>
                <TabsTrigger value="promo">Use Promo Code</TabsTrigger>
                <TabsTrigger value="referral">Invite Friends</TabsTrigger>
              </TabsList>
              <TabsContent value="card" className="mt-4">
                <StripePaymentForm 
                  onPaymentSuccess={handlePaymentSuccess} 
                  thmPoolApplied={demographicData.thmPoolApplied}
                  assessmentType={assessmentType}
                />
                
                {assessmentType === 'couple' && (
                  <div className="mt-4 px-3 py-2 bg-purple-50 rounded-md border border-purple-100">
                    <h4 className="text-sm font-medium text-purple-800 mb-1">How the Couple Assessment Works:</h4>
                    <ul className="text-xs text-purple-700 space-y-1 list-disc pl-4">
                      <li>You'll invite your significant other during the demographic information step</li>
                      <li>Both of you will receive email invitations to complete the assessment</li>
                      <li>You can each take the assessment at your own pace from anywhere</li>
                      <li>Once both assessments are complete, you'll receive a comprehensive compatibility report</li>
                      <li>The report analyzes where you align and differ across all areas of the assessment</li>
                    </ul>
                  </div>
                )}
              </TabsContent>
              <TabsContent value="promo" className="mt-4">
                <PromoCodeForm 
                  promoCode={demographicData.promoCode}
                  onChange={(value) => onChange("promoCode", value)}
                  onSuccess={handlePromoSuccess}
                  assessmentType={assessmentType}
                />
                <div className="mt-4 text-xs text-gray-500">
                  <p>Enter a promo code if you were provided one</p>
                  <p className="mt-1">* Contact us if you need assistance with promo codes.</p>
                </div>
              </TabsContent>
              <TabsContent value="referral" className="mt-4">
                <ReferralForm
                  onSuccess={handlePaymentSuccess}
                  userFirstName={demographicData.firstName}
                  userLastName={demographicData.lastName}
                  userEmail={demographicData.email}
                />
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