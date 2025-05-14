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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
  Form
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";

// Load stripe outside of component render
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY);

// Validation schema for customer information
const customerInfoSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  phone: z.string().optional(),
});

type CustomerInfo = z.infer<typeof customerInfoSchema>;

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
  const [step, setStep] = useState<'info' | 'payment'>('info');

  // Check for pre-filled demographic data to use as defaults
  const savedDemographicData = localStorage.getItem('demographicData');
  let parsedDemographics = {};
  
  if (savedDemographicData) {
    try {
      parsedDemographics = JSON.parse(savedDemographicData);
    } catch (error) {
      console.error('Error parsing saved demographic data:', error);
    }
  }
  
  // Initialize form for customer information with pre-filled data if available
  const form = useForm<CustomerInfo>({
    resolver: zodResolver(customerInfoSchema),
    defaultValues: {
      email: (parsedDemographics as any)?.email || '',
      firstName: (parsedDemographics as any)?.firstName || '',
      lastName: (parsedDemographics as any)?.lastName || '',
      phone: (parsedDemographics as any)?.phone || ''
    }
  });

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

  // Handle customer info submission
  const onCustomerInfoSubmit = (data: CustomerInfo) => {
    // Store customer info in local storage for persistence
    localStorage.setItem('customerInfo', JSON.stringify(data));
    
    // Proceed to payment step
    setStep('payment');
  };

  // Handle payment submission
  const handlePaymentSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    
    if (!stripe || !elements) {
      return;
    }

    setProcessing(true);
    setCardError(null);

    // Get customer info from form
    const customerInfo = form.getValues();

    // Get card element
    const cardElement = elements.getElement(CardElement);
    if (!cardElement) {
      setProcessing(false);
      return;
    }

    // Confirm card payment with customer info
    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: cardElement,
        billing_details: {
          name: `${customerInfo.firstName} ${customerInfo.lastName}`,
          email: customerInfo.email,
          phone: customerInfo.phone || undefined
        }
      }
    });

    if (error) {
      setCardError(error.message || 'An error occurred with your payment.');
      setProcessing(false);
    } else if (paymentIntent.status === 'succeeded') {
      setProcessing(false);
      
      // Store payment information with customer details
      try {
        await apiRequest('POST', '/api/update-payment-metadata', {
          paymentIntentId: paymentIntent.id,
          customerInfo: {
            email: customerInfo.email,
            firstName: customerInfo.firstName,
            lastName: customerInfo.lastName,
            phone: customerInfo.phone || '',
            thmPoolApplied: thmPoolApplied,
            assessmentType: assessmentType
          }
        });
      } catch (error) {
        console.error('Error updating payment metadata:', error);
        // Continue even if this fails - the payment was successful
      }
      
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

  // Render customer info form
  if (step === 'info') {
    return (
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onCustomerInfoSubmit)} className="space-y-4">
          <div className="text-sm font-medium mb-4 text-blue-800 p-3 bg-blue-50 rounded-md">
            Please provide your contact information before proceeding to payment
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="John" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Smith" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email Address</FormLabel>
                <FormControl>
                  <Input {...field} type="email" placeholder="your@email.com" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone Number (Optional)</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="555-123-4567" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <Button type="submit" className="w-full mt-4">Continue to Payment</Button>
        </form>
      </Form>
    );
  }

  // Render payment form
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <p className="font-medium text-gray-700">Amount: ${(amount/100).toFixed(2)}</p>
        <Button 
          type="button" 
          variant="outline" 
          size="sm" 
          onClick={() => setStep('info')}
        >
          Edit Contact Info
        </Button>
      </div>
      
      <div className="bg-gray-50 p-3 rounded-md text-sm">
        <p className="font-medium text-gray-800">Contact Information:</p>
        <p className="text-gray-600">
          {form.getValues().firstName} {form.getValues().lastName} • {form.getValues().email}
          {form.getValues().phone ? ` • ${form.getValues().phone}` : ''}
        </p>
      </div>
      
      <form onSubmit={handlePaymentSubmit} className="space-y-4">
        <div>
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
    </div>
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