import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

// Load stripe outside of component render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Payment card styling for Stripe elements
const cardStyle = {
  style: {
    base: {
      color: '#32325d',
      fontFamily: 'Arial, sans-serif',
      fontSmoothing: 'antialiased',
      fontSize: '16px',
      '::placeholder': {
        color: '#aab7c4'
      },
    },
    invalid: {
      color: '#fa755a',
      iconColor: '#fa755a'
    }
  }
};

// Internal payment form component
function PaymentForm({ 
  onPaymentSuccess, 
  thmPoolApplied,
  assessmentType = 'individual'
}: { 
  onPaymentSuccess: () => void;
  thmPoolApplied: boolean;
  assessmentType?: 'individual' | 'couple';
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [processing, setProcessing] = useState<boolean>(false);
  const [cardError, setCardError] = useState<string | null>(null);

  // Get the payment intent when component mounts
  useEffect(() => {
    const getPaymentIntent = async () => {
      try {
        // Include assessment type and THM pool option in the request to determine price
        const response = await apiRequest('POST', '/api/create-payment-intent', { 
          thmPoolApplied,
          assessmentType 
        });
        const { clientSecret, amount } = await response.json();
        setClientSecret(clientSecret);
        setAmount(amount);
      } catch (error) {
        console.error('Error fetching payment intent:', error);
        toast({
          title: "Payment Setup Error",
          description: "Could not set up the payment process. Please try again or use a promo code.",
          variant: "destructive"
        });
      }
    };

    getPaymentIntent();
  }, [thmPoolApplied, assessmentType]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setCardError(null);

    // Get card element
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setProcessing(false);
      return;
    }

    // Confirm card payment
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          // You can add more billing details here if required
          // name: "Customer name",
          // email: "customer@example.com",
        }
      }
    });

    if (error) {
      setCardError(error.message || 'An error occurred with your payment.');
      setProcessing(false);
    } else if (paymentIntent.status === 'succeeded') {
      setProcessing(false);
      toast({
        title: "Payment Successful",
        description: "Thank you for your purchase. You can now access the assessment.",
        variant: "default"
      });
      onPaymentSuccess();
    } else {
      setProcessing(false);
      setCardError('Payment status: ' + paymentIntent.status);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <p className="mb-2 font-medium text-gray-700">Amount: ${amount}</p>
        <div className="p-4 border border-gray-300 rounded-md bg-white">
          <CardElement options={cardStyle} />
        </div>
        {cardError && (
          <p className="mt-2 text-sm text-red-600">{cardError}</p>
        )}
        <div className="text-xs text-gray-500 mt-2">
          * Your card information is securely processed by Stripe.
        </div>
      </div>
      
      <Button 
        type="submit" 
        className="w-full py-6 text-base" 
        disabled={!stripe || processing}
      >
        {processing ? (
          <div className="flex items-center gap-2">
            <span className="animate-spin w-4 h-4 border-2 border-t-transparent rounded-full"></span>
            Processing...
          </div>
        ) : (
          assessmentType === 'individual' ? (
            thmPoolApplied 
              ? "Pay $74 for Assessment + THM Pool Application" 
              : "Pay to Experience Clarity ($49)"
          ) : (
            thmPoolApplied 
              ? "Pay $104 for Couple Assessment + THM Pool" 
              : "Pay to Experience Clarity Together ($79)"
          )
        )}
      </Button>
    </form>
  );
}

// Exported wrapper component that provides Stripe context
export default function StripePaymentForm({ 
  onPaymentSuccess, 
  thmPoolApplied = false,
  assessmentType = 'individual'
}: { 
  onPaymentSuccess: () => void;
  thmPoolApplied?: boolean;
  assessmentType?: 'individual' | 'couple';
}) {
  return (
    <div className="w-full">
      {stripePromise && (
        <Elements stripe={stripePromise}>
          <PaymentForm 
            onPaymentSuccess={onPaymentSuccess} 
            thmPoolApplied={thmPoolApplied} 
            assessmentType={assessmentType}
          />
        </Elements>
      )}
    </div>
  );
}