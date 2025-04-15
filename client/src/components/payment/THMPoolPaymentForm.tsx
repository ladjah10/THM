import { useState, useEffect } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { toast } from "@/hooks/use-toast";
import type { 
  StripeElementsOptions, 
  StripeElementsOptionsClientSecret, 
  Appearance 
} from '@stripe/stripe-js';

if (!import.meta.env.VITE_STRIPE_PUBLIC_KEY) {
  console.error('Missing Stripe public key');
}

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Define styling with proper typing for Stripe Elements
const stripeElementsOptions: Partial<StripeElementsOptions> = {
  appearance: {
    theme: 'stripe',
    variables: {
      colorPrimary: '#0d6efd',
      colorBackground: '#ffffff',
      colorText: '#32325d',
      colorDanger: '#fa755a',
    }
  }
};

// Internal payment form component for THM Pool fee
function THMFeeForm({ 
  onPaymentSuccess,
  clientSecret
}: { 
  onPaymentSuccess: () => void;
  clientSecret: string;
}) {
  const stripe = useStripe();
  const elements = useElements();
  const [processing, setProcessing] = useState<boolean>(false);
  const [cardError, setCardError] = useState<string | null>(null);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }
    
    setProcessing(true);
    
    try {
      // Don't use return_url to avoid page redirects, just handle it in-page
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
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
  
  // Use div instead of form to avoid form nesting issues
  return (
    <div>
      <div className="mb-4">
        <div className="bg-blue-50 p-4 rounded-md text-sm text-blue-800 mb-4">
          <p className="font-medium mb-2">THM Arranged Marriage Pool Application Fee: $25</p>
          <p>This one-time fee is required to be considered for the THM Arranged Marriage Pool.</p>
          <a 
            href="https://lawrenceadjah.com/the-100-marriage-arranged" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-blue-700 hover:text-blue-900 inline-flex items-center mt-2 font-medium"
          >
            Learn More
            <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"></path>
            </svg>
          </a>
        </div>
        
        <PaymentElement id="payment-element" />
        
        {cardError && (
          <div className="mt-2 text-red-500 text-sm">{cardError}</div>
        )}
      </div>
      
      <Button 
        type="button" 
        onClick={handleSubmit}
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
    </div>
  );
}

// Main component that wraps the form with the Stripe Elements provider
export default function THMPoolPaymentForm({ onPaymentSuccess }: { onPaymentSuccess: () => void }) {
  const [ready, setReady] = useState(false);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Get the payment intent when component mounts
  useEffect(() => {
    const getPaymentIntent = async () => {
      try {
        const response = await apiRequest('POST', '/api/create-thm-payment-intent', {});
        const data = await response.json();
        setClientSecret(data.clientSecret);
        setReady(true);
      } catch (error) {
        console.error('Error fetching THM payment intent:', error);
        setError('Could not set up payment. Please try again later.');
        toast({
          title: "Payment Setup Error",
          description: "Could not set up the THM pool application fee payment. Please try again later.",
          variant: "destructive"
        });
      }
    };

    getPaymentIntent();
  }, []);
  
  if (error) {
    return (
      <div className="p-4 bg-red-50 text-red-700 rounded-md">
        {error}
      </div>
    );
  }
  
  if (!ready || !clientSecret) {
    return (
      <div className="p-4 text-center">
        <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
        <p>Preparing payment form...</p>
      </div>
    );
  }
  
  // Configure Stripe Elements with the client secret
  const elementOptions: StripeElementsOptionsClientSecret = {
    clientSecret,
    appearance: stripeElementsOptions.appearance as Appearance
  };
  
  return (
    <div className="thm-payment-container">
      <Elements stripe={stripePromise} options={elementOptions}>
        <THMFeeForm 
          onPaymentSuccess={onPaymentSuccess}
          clientSecret={clientSecret}
        />
      </Elements>
    </div>
  );
}