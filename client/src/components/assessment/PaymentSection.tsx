import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";
import { DemographicData } from "@/types/assessment";
import { usePromoCodeValidation } from "@/hooks/usePromoCodeValidation";
import THMPoolPaymentForm from "@/components/payment/THMPoolPaymentForm";

interface PaymentSectionProps {
  demographicData: DemographicData;
  onChange: (field: keyof DemographicData, value: string | boolean) => void;
  assessmentType: 'individual' | 'couple';
  showPaywall: boolean;
  onPaywallToggle: (show: boolean) => void;
  isProcessingPayment: boolean;
  onPaymentProcessing: (processing: boolean) => void;
}

export default function PaymentSection({
  demographicData,
  onChange,
  assessmentType,
  showPaywall,
  onPaywallToggle,
  isProcessingPayment,
  onPaymentProcessing
}: PaymentSectionProps) {
  const [promoCode, setPromoCode] = useState(demographicData.promoCode || '');
  const { isVerifying, validationResult, validatePromoCode, clearValidation } = usePromoCodeValidation();

  const handlePromoCodeChange = (value: string) => {
    setPromoCode(value);
    onChange('promoCode', value);
    if (validationResult) {
      clearValidation();
    }
  };

  const handlePromoValidation = async () => {
    const result = await validatePromoCode(promoCode);
    if (result.isValid) {
      onChange('hasPaid', true);
      onPaywallToggle(false);
    }
  };

  const getAssessmentPrice = () => {
    if (validationResult?.isValid && validationResult.discount) {
      const originalPrice = assessmentType === 'individual' ? 49 : 79;
      const discountedPrice = originalPrice * (1 - validationResult.discount / 100);
      return {
        original: originalPrice,
        discounted: discountedPrice,
        discount: validationResult.discount
      };
    }
    return {
      original: assessmentType === 'individual' ? 49 : 79,
      discounted: assessmentType === 'individual' ? 49 : 79,
      discount: 0
    };
  };

  const pricing = getAssessmentPrice();

  if (demographicData.hasPaid) {
    return (
      <Alert className="border-green-200 bg-green-50">
        <CheckCircle2 className="h-4 w-4 text-green-600" />
        <AlertDescription className="text-green-800">
          Payment confirmed! You can now proceed with your assessment.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="space-y-4">
      {/* Promo Code Section */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <Label htmlFor="promoCode" className="text-sm font-medium text-blue-900">
          Promo Code (Optional)
        </Label>
        <div className="flex gap-2 mt-2">
          <Input
            id="promoCode"
            value={promoCode}
            onChange={(e) => handlePromoCodeChange(e.target.value.toUpperCase())}
            placeholder="Enter promo code"
            className="flex-1"
            disabled={isVerifying}
          />
          <Button
            type="button"
            variant="outline"
            onClick={handlePromoValidation}
            disabled={!promoCode.trim() || isVerifying}
            className="whitespace-nowrap"
          >
            {isVerifying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                Verifying...
              </>
            ) : (
              'Apply Code'
            )}
          </Button>
        </div>

        {validationResult && (
          <Alert className={`mt-3 ${validationResult.isValid ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
            {validationResult.isValid ? (
              <CheckCircle2 className="h-4 w-4 text-green-600" />
            ) : (
              <AlertCircle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={validationResult.isValid ? 'text-green-800' : 'text-red-800'}>
              {validationResult.message}
            </AlertDescription>
          </Alert>
        )}
      </div>

      {/* Pricing Display */}
      <div className="bg-gray-50 p-4 rounded-lg border">
        <div className="flex justify-between items-center">
          <span className="font-medium">
            {assessmentType === 'individual' ? 'Individual Assessment' : 'Couple Assessment'}
          </span>
          <div className="text-right">
            {pricing.discount > 0 ? (
              <div>
                <span className="text-sm line-through text-gray-500">${pricing.original}</span>
                <span className="ml-2 text-lg font-bold text-green-600">${pricing.discounted}</span>
                <div className="text-xs text-green-600">({pricing.discount}% off)</div>
              </div>
            ) : (
              <span className="text-lg font-bold">${pricing.original}</span>
            )}
          </div>
        </div>
      </div>

      {/* Payment Button */}
      {!validationResult?.isValid && (
        <Button
          type="button"
          onClick={() => onPaywallToggle(true)}
          disabled={isProcessingPayment}
          className="w-full bg-blue-600 hover:bg-blue-700"
        >
          {isProcessingPayment ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Processing Payment...
            </>
          ) : (
            `Pay $${pricing.discounted} - Continue to Assessment`
          )}
        </Button>
      )}

      {/* Payment Form Modal */}
      {showPaywall && (
        <THMPoolPaymentForm
          isOpen={showPaywall}
          onClose={() => onPaywallToggle(false)}
          onPaymentSuccess={() => {
            onChange('hasPaid', true);
            onPaywallToggle(false);
            onPaymentProcessing(false);
          }}
          amount={pricing.discounted}
          title={`${assessmentType === 'individual' ? 'Individual' : 'Couple'} Assessment Payment`}
          description={`Complete your payment to access the ${assessmentType} assessment`}
        />
      )}
    </div>
  );
}