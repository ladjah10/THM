import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface PromoCodeValidationResult {
  isValid: boolean;
  discount?: number;
  message?: string;
}

export function usePromoCodeValidation() {
  const [isVerifying, setIsVerifying] = useState(false);
  const [validationResult, setValidationResult] = useState<PromoCodeValidationResult | null>(null);
  const { toast } = useToast();

  const validatePromoCode = useCallback(async (promoCode: string): Promise<PromoCodeValidationResult> => {
    if (!promoCode.trim()) {
      return { isValid: false, message: 'Please enter a promo code' };
    }

    setIsVerifying(true);
    
    try {
      const response = await fetch('/api/validate-promo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ promoCode: promoCode.trim().toUpperCase() })
      });

      const result = await response.json();
      
      if (response.ok && result.success) {
        const validationResult = {
          isValid: true,
          discount: result.discount,
          message: result.message
        };
        
        setValidationResult(validationResult);
        toast({
          title: "Promo Code Applied!",
          description: result.message,
          variant: "default"
        });
        
        return validationResult;
      } else {
        const invalidResult = {
          isValid: false,
          message: result.message || 'Invalid promo code'
        };
        
        setValidationResult(invalidResult);
        toast({
          title: "Invalid Promo Code",
          description: invalidResult.message,
          variant: "destructive"
        });
        
        return invalidResult;
      }
    } catch (error) {
      const errorResult = {
        isValid: false,
        message: 'Error validating promo code. Please try again.'
      };
      
      setValidationResult(errorResult);
      toast({
        title: "Validation Error",
        description: errorResult.message,
        variant: "destructive"
      });
      
      return errorResult;
    } finally {
      setIsVerifying(false);
    }
  }, [toast]);

  const clearValidation = useCallback(() => {
    setValidationResult(null);
  }, []);

  return {
    isVerifying,
    validationResult,
    validatePromoCode,
    clearValidation
  };
}