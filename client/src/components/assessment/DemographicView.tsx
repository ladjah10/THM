import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/hooks/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { DemographicData } from "@/types/assessment";
import { demographicQuestions } from "@/data/demographicQuestions";
import THMPoolPaymentForm from "@/components/payment/THMPoolPaymentForm";
import SpouseInvite from "@/components/couple/SpouseInvite";

interface DemographicViewProps {
  demographicData: DemographicData;
  onChange: (field: keyof DemographicData, value: string | boolean) => void;
  onSubmit: (data: DemographicData) => void;
  onBack: () => void;
  assessmentType?: 'individual' | 'couple';
}

export default function DemographicView({
  demographicData,
  onChange,
  onSubmit,
  onBack,
  assessmentType = 'individual'
}: DemographicViewProps) {
  const { toast } = useToast();
  const [selectedEthnicities, setSelectedEthnicities] = useState<string[]>(
    demographicData.ethnicity ? demographicData.ethnicity.split(',').filter(e => e) : []
  );
  const [showPaywall, setShowPaywall] = useState<boolean>(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [isVerifyingPromo, setIsVerifyingPromo] = useState<boolean>(false);
  const [showTHMPoolPayment, setShowTHMPoolPayment] = useState<boolean>(false);
  
  // We don't need these state variables anymore since we're using the SpouseInvite component
  
  // Valid promo codes (in a real app, these would be stored in a database or validated through an API)
  const validPromoCodes = ["FREE100", "LA2025", "MARRIAGE100"]; // Keep for functionality, not displayed to users

  // Handle book purchase change
  useEffect(() => {
    if (demographicData.hasPurchasedBook === "no") {
      setShowPaywall(true);
    } else {
      setShowPaywall(false);
    }
  }, [demographicData.hasPurchasedBook]);

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate the form
    if (!validateForm()) {
      return;
    }
    
    // If showing paywall and not paid, prevent submission
    if (showPaywall && !demographicData.hasPaid) {
      toast({
        title: "Payment Required",
        description: "Please complete the payment or use a valid promo code to continue.",
        variant: "destructive"
      });
      return;
    }
    
    // Check if user needs to pay THM Pool application fee
    if (demographicData.interestedInArrangedMarriage && demographicData.hasPaid && demographicData.promoCode && !demographicData.thmPoolApplied) {
      // User has entered a promo code to bypass the main payment but needs to pay for THM
      setShowTHMPoolPayment(true);
      toast({
        title: "THM Pool Application Fee Required",
        description: "You need to pay the $25 THM Pool application fee to proceed.",
        variant: "destructive"
      });
      return;
    }
    
    // We've validated all payment requirements, so proceed
    onSubmit(demographicData);
  };

  // Handle ethnicity checkbox changes
  const handleEthnicityChange = (value: string, isChecked: boolean) => {
    setSelectedEthnicities(prev => {
      const updatedValues = isChecked 
        ? [...prev, value] 
        : prev.filter(item => item !== value);
      
      // Update the parent component with joined string
      onChange("ethnicity", updatedValues.join(','));
      return updatedValues;
    });
  };
  
  // Validate form before submission
  const validateForm = () => {
    // Check if at least one ethnicity is selected
    if (selectedEthnicities.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select at least one ethnicity option.",
        variant: "destructive"
      });
      return false;
    }
    return true;
  };
  
  // Handle promo code verification
  const handleVerifyPromoCode = () => {
    setIsVerifyingPromo(true);
    
    // Simulate API call to verify promo code
    setTimeout(() => {
      const isValid = validPromoCodes.includes(demographicData.promoCode);
      
      if (isValid) {
        // Convert to boolean since our type requires hasPaid to be boolean
        onChange("hasPaid", true as any);
        toast({
          title: "Promo Code Applied",
          description: "Your promo code has been accepted. You can now take the assessment.",
          variant: "default"
        });
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
      onChange("hasPaid", true as any);
      setIsProcessingPayment(false);
      toast({
        title: "Payment Successful",
        description: "Thank you for your purchase. You can now take the assessment.",
        variant: "default"
      });
    }, 1500);
  };
  
  // We've moved spouse invitation functionality to the SpouseInvite component

  return (
    <div className="bg-white shadow-md rounded-lg p-6 mb-6 border border-gray-100">
      <div className="mb-6 text-center pb-4 border-b border-gray-100">
        <h3 className="text-2xl font-semibold text-blue-900 mb-2">About You</h3>
        <p className="text-gray-600">
          Please provide your information below to personalize your assessment experience
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium text-gray-700">
              {demographicQuestions.firstName.label}
            </Label>
            <Input
              id="firstName"
              type="text"
              placeholder={demographicQuestions.firstName.placeholder}
              value={demographicData.firstName}
              onChange={(e) => onChange("firstName", e.target.value)}
              required={demographicQuestions.firstName.required}
              className="mt-1 block w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium text-gray-700">
              {demographicQuestions.lastName.label}
            </Label>
            <Input
              id="lastName"
              type="text"
              placeholder={demographicQuestions.lastName.placeholder}
              value={demographicData.lastName}
              onChange={(e) => onChange("lastName", e.target.value)}
              required={demographicQuestions.lastName.required}
              className="mt-1 block w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-gray-700">
              {demographicQuestions.email.label}
            </Label>
            {demographicQuestions.email.helpText && (
              <p className="text-xs text-gray-500">{demographicQuestions.email.helpText}</p>
            )}
            <Input
              id="email"
              type="email"
              placeholder={demographicQuestions.email.placeholder}
              value={demographicData.email}
              onChange={(e) => onChange("email", e.target.value)}
              required={demographicQuestions.email.required}
              className="mt-1 block w-full"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium text-gray-700">
              {demographicQuestions.phone.label}
            </Label>
            <Input
              id="phone"
              type="tel"
              placeholder={demographicQuestions.phone.placeholder}
              value={demographicData.phone}
              onChange={(e) => onChange("phone", e.target.value)}
              required={demographicQuestions.phone.required}
              className="mt-1 block w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="lifeStage" className="text-sm font-medium text-gray-700">
              {demographicQuestions.lifeStage.label}
            </Label>
            <Select
              value={demographicData.lifeStage}
              onValueChange={(value) => onChange("lifeStage", value)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select your life stage" />
              </SelectTrigger>
              <SelectContent>
                {demographicQuestions.lifeStage.options.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="birthday" className="text-sm font-medium text-gray-700">
              {demographicQuestions.birthday.label}
            </Label>
            {demographicQuestions.birthday.helpText && (
              <p className="text-xs text-gray-500">{demographicQuestions.birthday.helpText}</p>
            )}
            <Input
              id="birthday"
              type="date"
              value={demographicData.birthday}
              onChange={(e) => onChange("birthday", e.target.value)}
              required={demographicQuestions.birthday.required}
              className="mt-1 block w-full"
            />
          </div>
        </div>
        
        {/* Location Information */}
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-gray-700 border-b pb-2 mb-2">Your Location</h4>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="city" className="text-sm font-medium text-gray-700">
                {demographicQuestions.city.label}
              </Label>
              <Input
                id="city"
                type="text"
                placeholder={demographicQuestions.city.placeholder}
                value={demographicData.city}
                onChange={(e) => onChange("city", e.target.value)}
                required={demographicQuestions.city.required}
                className="mt-1 block w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="state" className="text-sm font-medium text-gray-700">
                {demographicQuestions.state.label}
              </Label>
              <Input
                id="state"
                type="text"
                placeholder={demographicQuestions.state.placeholder}
                value={demographicData.state}
                onChange={(e) => onChange("state", e.target.value)}
                required={demographicQuestions.state.required}
                className="mt-1 block w-full"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="zipCode" className="text-sm font-medium text-gray-700">
                {demographicQuestions.zipCode.label}
              </Label>
              <Input
                id="zipCode"
                type="text"
                placeholder={demographicQuestions.zipCode.placeholder}
                value={demographicData.zipCode}
                onChange={(e) => onChange("zipCode", e.target.value)}
                required={demographicQuestions.zipCode.required}
                className="mt-1 block w-full"
              />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="desireChildren" className="text-sm font-medium text-gray-700">
            {demographicQuestions.desireChildren.label}
          </Label>
          <Select
            value={demographicData.desireChildren}
            onValueChange={(value) => onChange("desireChildren", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your preference" />
            </SelectTrigger>
            <SelectContent>
              {demographicQuestions.desireChildren.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender" className="text-sm font-medium text-gray-700">
            {demographicQuestions.gender.label}
          </Label>
          <Select
            value={demographicData.gender}
            onValueChange={(value) => {
              // Normalize gender value for consistent processing
              const normalizedGender = value.toLowerCase().trim();
              console.log(`Gender selected: original="${value}", normalized="${normalizedGender}"`);
              onChange("gender", normalizedGender);
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your gender" />
            </SelectTrigger>
            <SelectContent>
              {demographicQuestions.gender.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="marriageStatus" className="text-sm font-medium text-gray-700">
            {demographicQuestions.marriageStatus.label}
          </Label>
          <Select
            value={demographicData.marriageStatus}
            onValueChange={(value) => onChange("marriageStatus", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select your status" />
            </SelectTrigger>
            <SelectContent>
              {demographicQuestions.marriageStatus.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium text-gray-700">
            {demographicQuestions.ethnicity.label}
          </Label>
          {demographicQuestions.ethnicity.helpText && (
            <p className="text-xs text-gray-500">{demographicQuestions.ethnicity.helpText}</p>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-1">
            {demographicQuestions.ethnicity.options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <Checkbox
                  id={`ethnicity-${option.value}`}
                  checked={selectedEthnicities.includes(option.value)}
                  onCheckedChange={(checked) => 
                    handleEthnicityChange(option.value, checked as boolean)
                  }
                />
                <Label 
                  htmlFor={`ethnicity-${option.value}`}
                  className="text-sm font-normal text-gray-700"
                >
                  {option.label}
                </Label>
              </div>
            ))}
          </div>
        </div>
        
        {/* Book Purchase Question */}
        <div className="space-y-2">
          <Label htmlFor="hasPurchasedBook" className="text-sm font-medium text-gray-700">
            {demographicQuestions.hasPurchasedBook.label}
          </Label>
          <Select
            value={demographicData.hasPurchasedBook}
            onValueChange={(value) => onChange("hasPurchasedBook", value)}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {demographicQuestions.hasPurchasedBook.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Conditional Purchase Date Field */}
        {demographicData.hasPurchasedBook === "yes" && (
          <div className="space-y-2">
            <Label htmlFor="purchaseDate" className="text-sm font-medium text-gray-700">
              {demographicQuestions.purchaseDate.label}
            </Label>
            <Input
              id="purchaseDate"
              type="date"
              value={demographicData.purchaseDate}
              onChange={(e) => onChange("purchaseDate", e.target.value)}
              required={true}
              className="mt-1 block w-full"
            />
          </div>
        )}
        
        {/* THM Arranged Marriage Pool Question */}
        <div className="space-y-2">
          <Label htmlFor="interestedInArrangedMarriage" className="text-sm font-medium text-gray-700">
            {demographicQuestions.interestedInArrangedMarriage.label}
          </Label>
          <div className="flex items-center gap-2">
            <p className="text-xs text-gray-500">
              {demographicQuestions.interestedInArrangedMarriage.helpText}
            </p>
            <a 
              href="https://lawrenceadjah.com/the-100-marriage-arranged" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-800 inline-flex items-center"
            >
              Learn More
              <svg className="w-3 h-3 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
              </svg>
            </a>
          </div>
          <Select
            value={demographicData.interestedInArrangedMarriage ? "yes" : "no"}
            onValueChange={(value) => {
              // Set both the interest and whether they've applied
              const isInterested = value === "yes";
              onChange("interestedInArrangedMarriage", isInterested);
              
              // If they select yes, we'll charge them $25 more in the payment step
              if (isInterested) {
                // Mark that they need to pay the extra fee
                onChange("thmPoolApplied", true);
                
                // If they already have access via promo code but need to pay for THM,
                // show the THM payment section
                if (demographicData.hasPaid && demographicData.promoCode) {
                  setShowTHMPoolPayment(true);
                }
              } else {
                // If they're not interested, they don't need to pay the fee
                onChange("thmPoolApplied", false);
                setShowTHMPoolPayment(false);
              }
            }}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select an option" />
            </SelectTrigger>
            <SelectContent>
              {demographicQuestions.interestedInArrangedMarriage.options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        {/* Payment Wall */}
        {showPaywall && !demographicData.hasPaid && (
          <Card className="mt-6 border border-blue-100 shadow-md">
            <CardHeader className="pb-4 bg-gradient-to-b from-blue-50 to-white">
              <CardTitle className="text-xl text-blue-900">Unlock Your Complete Assessment</CardTitle>
              <CardDescription className="text-gray-700">
                Misaligned Expectations Can Destroy Relationships—Align Yours for Only $49
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="mb-4 px-2">
                <p className="text-gray-700 text-sm">
                  Discover insights from <em>The 100 Marriage</em> by Lawrence E. Adjah—helping you uncover hidden expectations and prepare for a thriving future.
                </p>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-md mb-4">
                <h4 className="font-medium text-blue-900 mb-2">Here's What You'll Gain:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>In-Depth Assessment with Personalized Results</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>PDF Report with Insights to Guide Your Journey</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Exclusive Access to Book Consultation with Lawrence Adjah</span>
                  </li>
                </ul>
              </div>
              
              <div className="space-y-4 p-4 bg-gray-50 rounded-md border border-gray-100">
                <div className="space-y-2">
                  <Label htmlFor="demoPromoCode" className="text-sm font-medium text-gray-700">
                    Enter Your Promo Code to Save
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="demoPromoCode"
                      type="text"
                      placeholder="Enter promo code"
                      value={demographicData.promoCode}
                      onChange={(e) => onChange("promoCode", e.target.value)}
                      className="flex-1"
                    />
                    <Button 
                      type="button"
                      variant="outline" 
                      onClick={handleVerifyPromoCode}
                      disabled={!demographicData.promoCode || isVerifyingPromo}
                      className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                    >
                      {isVerifyingPromo ? "Verifying..." : "Apply Code"}
                    </Button>
                  </div>
                  <p className="text-xs text-gray-500 mt-1">
                    Enter your promo code if you were provided one
                  </p>
                </div>
                
                <div className="flex items-center gap-2 justify-center text-sm text-gray-500 my-2">
                  <div className="h-px bg-gray-200 flex-1"></div>
                  <span>or</span>
                  <div className="h-px bg-gray-200 flex-1"></div>
                </div>
                
                <Button
                  type="button"
                  className="w-full bg-amber-500 hover:bg-amber-400 text-white"
                  onClick={handleProcessPayment}
                  disabled={isProcessingPayment}
                >
                  {isProcessingPayment ? "Processing..." : "Pay to Experience Clarity"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Book Reference */}
        <div className="mt-6 pt-5 border-t border-gray-100 flex flex-col sm:flex-row items-center gap-4">
          <div className="w-32 flex-shrink-0">
            <img 
              src="/attached_assets/image_1744661653587.png" 
              alt="The 100 Marriage Book Cover" 
              className="h-auto w-full shadow-sm rounded-sm"
            />
          </div>
          <div>
            <h4 className="text-sm font-medium text-blue-900">Based on the Best-Selling Book</h4>
            <p className="text-xs text-gray-600 mt-1">
              Inspired by <em>The 100 Marriage</em> by Lawrence E. Adjah, this assessment brings the book's proven framework to life.
            </p>
            <a 
              href="https://lawrenceadjah.com/the100marriagebook" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-blue-600 hover:text-blue-800 mt-1 inline-block"
            >
              Learn more about the book →
            </a>
          </div>
        </div>
        
        {/* THM Pool Application Fee Payment */}
        {showTHMPoolPayment && (
          <Card className="mt-6 border border-blue-100 shadow-md">
            <CardHeader className="pb-4 bg-gradient-to-b from-blue-50 to-white">
              <CardTitle className="text-xl text-blue-900">THM Arranged Marriage Pool Application</CardTitle>
              <CardDescription className="text-gray-700">
                Complete your $25 application fee to join the THM Arranged Marriage Pool
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="mb-4 px-2">
                <p className="text-gray-700 text-sm">
                  You've indicated interest in the THM Arranged Marriage Pool. This requires a one-time $25 application fee.
                </p>
                <a 
                  href="https://lawrenceadjah.com/the-100-marriage-arranged" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:text-blue-800 inline-flex items-center mt-2 text-sm"
                >
                  Learn More About THM Arranged Marriage
                  <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
                  </svg>
                </a>
              </div>
              
              <div className="bg-blue-50 p-4 rounded-md mb-4">
                <h4 className="font-medium text-blue-900 mb-2">What You'll Receive:</h4>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li className="flex items-start">
                    <svg className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Consideration for the THM Arranged Marriage Pool</span>
                  </li>
                  <li className="flex items-start">
                    <svg className="h-5 w-5 mr-2 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                    </svg>
                    <span>Special matching opportunities with compatible prospects</span>
                  </li>
                </ul>
              </div>
              
              <THMPoolPaymentForm 
                onPaymentSuccess={() => {
                  // Update that they've paid the THM pool fee
                  onChange("thmPoolApplied", true);
                  // Hide the payment form now that they've paid
                  setShowTHMPoolPayment(false);
                  toast({
                    title: "THM Pool Fee Processed",
                    description: "Your application to the THM Arranged Marriage Pool has been submitted successfully.",
                    variant: "default"
                  });
                }} 
              />
            </CardContent>
          </Card>
        )}

        {/* Spouse Invite Component - Only shown for couple assessments and after email is provided */}
        {assessmentType === 'couple' && demographicData.email && (
          <div className="mt-6 mb-3">
            <SpouseInvite
              primaryEmail={demographicData.email}
              primaryName={demographicData.firstName ? `${demographicData.firstName} ${demographicData.lastName || ''}`.trim() : undefined}
            />
          </div>
        )}

        <div className="flex justify-end pt-6">
          <Button
            type="submit"
            className="px-6 py-3 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white"
          >
            Begin Assessment Questions →
          </Button>
        </div>
      </form>
    </div>
  );
}
