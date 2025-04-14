import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "@/hooks/use-toast";
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
import { DemographicData } from "@/types/assessment";
import { demographicQuestions } from "@/data/demographicQuestions";

interface DemographicViewProps {
  demographicData: DemographicData;
  onChange: (field: keyof DemographicData, value: string) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export default function DemographicView({
  demographicData,
  onChange,
  onSubmit,
  onBack
}: DemographicViewProps) {
  const [selectedEthnicities, setSelectedEthnicities] = useState<string[]>(
    demographicData.ethnicity ? demographicData.ethnicity.split(',').filter(e => e) : []
  );
  const [showPaywall, setShowPaywall] = useState<boolean>(false);
  const [isProcessingPayment, setIsProcessingPayment] = useState<boolean>(false);
  const [isVerifyingPromo, setIsVerifyingPromo] = useState<boolean>(false);
  
  // Valid promo codes (in a real app, these would be stored in a database or validated through an API)
  const validPromoCodes = ["FREE100", "LA2025", "MARRIAGE100"];

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
    
    // Check if user has purchased the book or paid/used valid promo
    if (demographicData.hasPurchasedBook === "yes" || demographicData.hasPaid) {
      onSubmit();
    } else {
      setShowPaywall(true);
    }
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

  return (
    <div className="bg-white shadow-sm rounded-lg p-6 mb-6">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">About You</h3>
        <p className="text-sm text-gray-500">Please provide some information before taking the assessment</p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
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
            onValueChange={(value) => onChange("gender", value)}
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
        
        {/* Payment Wall */}
        {showPaywall && !demographicData.hasPaid && (
          <Card className="mt-6 border-primary-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-xl text-primary-700">Complete Your Assessment</CardTitle>
              <CardDescription>
                The 100 Marriage Assessment is available for $49. You can also use a promo code if you have one.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="promoCode" className="text-sm font-medium">
                    {demographicQuestions.promoCode.label}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="promoCode"
                      type="text"
                      placeholder={demographicQuestions.promoCode.placeholder}
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
                
                <div className="my-4 text-center">
                  <span className="px-2 text-sm text-gray-500">or</span>
                </div>
                
                <Button
                  type="button"
                  className="w-full"
                  onClick={handleProcessPayment}
                  disabled={isProcessingPayment}
                >
                  {isProcessingPayment ? "Processing..." : "Pay $49 and Continue"}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        <div className="flex justify-end pt-4">
          <Button
            type="submit"
            className="px-6 py-3 text-sm font-medium"
            disabled={demographicData.hasPurchasedBook === "no" && !demographicData.hasPaid}
          >
            Start Assessment Questions →
          </Button>
        </div>
      </form>
    </div>
  );
}
