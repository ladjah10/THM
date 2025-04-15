import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  console.error('Missing Stripe public key');
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

const stripeElementsOptions = {
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

// Internal payment form component for THM Pool fee
function THMFeeForm({ 
  onPaymentSuccess
}: { 
  onPaymentSuccess: () => void;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [clientSecret, setClientSecret] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [processing, setProcessing] = useState<boolean>(false);
  const [cardError, setCardError] = useState<string | null>(null);

  // Get the payment intent specifically for THM Pool Fee
  useEffect(() => {
    const getPaymentIntent = async () => {
      try {
        const response = await apiRequest('POST', '/api/create-thm-payment-intent', {});
        const { clientSecret, amount } = await response.json();
        setClientSecret(clientSecret);
        setAmount(amount);
      } catch (error) {
        console.error('Error fetching THM payment intent:', error);
        toast({
          title: "Payment Setup Error",
          description: "Could not set up the THM pool application fee payment. Please try again later.",
          variant: "destructive"
        });
      }
    };

    getPaymentIntent();
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    setProcessing(true);
    
    try {
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: window.location.href,
        },
        redirect: 'if_required'
      });
      
      if (error) {
        setCardError(error.message || 'Payment failed. Please try again.');
        toast({
          title: "Payment Failed",
          description: error.message || "Your payment could not be processed. Please try again.",
          variant: "destructive"
        });
      } else if (paymentIntent && paymentIntent.status === 'succeeded') {
        toast({
          title: "Payment Successful",
          description: "Your THM Pool application fee has been processed successfully!",
          variant: "default"
        });
        onPaymentSuccess();
      }
    } catch (error) {
      console.error('Payment error:', error);
      toast({
        title: "Payment Error",
        description: "An unexpected error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setProcessing(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-4">
        <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-800 mb-4">
          <p className="font-medium mb-2">THM Arranged Marriage Pool Application Fee: $25</p>
          <p>This one-time fee is required to be considered for the THM Arranged Marriage Pool.</p>
        </div>
        
        {clientSecret && (
          <PaymentElement id="payment-element" />
        )}
        
        {cardError && (
          <div className="mt-2 text-red-500 text-sm">{cardError}</div>
        )}
      </div>
      
      <Button 
        type="submit" 
        disabled={!stripe || !elements || processing} 
        className="w-full bg-blue-600 hover:bg-blue-700 text-white"
      >
        {processing ? (
          <div className="flex items-center gap-2">
            <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full"></span>
            Processing...
          </div>
        ) : (
          "Pay $25 for THM Pool Application"
        )}
      </Button>
    </form>
  );
}

// Main component that wraps the form with the Stripe Elements provider
export default function THMPoolPaymentForm({ onPaymentSuccess }: { onPaymentSuccess: () => void }) {
  const [ready, setReady] = useState(false);
  
  // This ensures the component is mounted before trying to load Stripe
  useEffect(() => {
    setReady(true);
  }, []);
  
  if (!ready) return null;
  
  return (
    <div className="thm-payment-container">
      <Elements stripe={stripePromise} options={stripeElementsOptions}>
        <THMFeeForm onPaymentSuccess={onPaymentSuccess} />
      </Elements>
    </div>
  );
}