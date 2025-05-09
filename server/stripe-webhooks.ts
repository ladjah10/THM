import { Request, Response } from 'express';
import Stripe from 'stripe';
import { storage } from './storage';
import { v4 as uuidv4 } from 'uuid';
import { sendNotificationEmail } from './nodemailer';

// Initialize Stripe with the secret key
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY environment variable');
}

// Initialize Stripe with the latest available API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

/**
 * Handle Stripe webhook events to sync payment data with our database
 */
export async function handleStripeWebhook(req: Request, res: Response) {
  let event: Stripe.Event;
  
  const sig = req.headers['stripe-signature'];
  
  try {
    if (sig && process.env.STRIPE_WEBHOOK_SECRET) {
      // Verify the webhook signature if we have the secret
      event = stripe.webhooks.constructEvent(
        req.body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      console.log('✓ Webhook signature verified');
    } else {
      // For testing/development, parse the event directly
      // In production, always use signature verification
      console.warn('⚠️ Webhook signature verification skipped - for development only');
      event = req.body as Stripe.Event;
    }
  } catch (err: any) {
    console.error(`Webhook processing error: ${err.message}`);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }
  
  // Handle specific event types
  try {
    switch (event.type) {
      // When a payment intent succeeds
      case 'payment_intent.succeeded':
        await handlePaymentIntentSucceeded(event.data.object as Stripe.PaymentIntent);
        break;
        
      // When a payment intent fails
      case 'payment_intent.payment_failed':
        await handlePaymentIntentFailed(event.data.object as Stripe.PaymentIntent);
        break;
        
      // When a charge is refunded
      case 'charge.refunded':
        await handleChargeRefunded(event.data.object as Stripe.Charge);
        break;
        
      // Checkout session completed - alternative to payment_intent.succeeded for checkout
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
    }
    
    // Return a 200 response to acknowledge receipt of the event
    res.json({ received: true });
  } catch (err: any) {
    console.error(`Error processing webhook: ${err.message}`);
    res.status(500).send(`Webhook processing error: ${err.message}`);
  }
}

/**
 * Handle successful payment intents
 */
async function handlePaymentIntentSucceeded(paymentIntent: Stripe.PaymentIntent) {
  console.log(`💰 Payment succeeded: ${paymentIntent.id}`);
  
  // Check if we already have this transaction
  const existingTransaction = await storage.getPaymentTransactionByStripeId(paymentIntent.id);
  if (existingTransaction) {
    // Just update the status if needed
    if (existingTransaction.status !== 'succeeded') {
      await storage.updatePaymentTransactionStatus(paymentIntent.id, 'succeeded');
    }
    return;
  }
  
  // Fetch the associated charge for this payment intent to get customer info
  let customerEmail: string | undefined;
  let customerId: string | undefined;
  
  try {
    // Get the charges directly from Stripe API
    const charges = await stripe.charges.list({ payment_intent: paymentIntent.id });
    
    if (charges.data.length > 0) {
      const charge = charges.data[0];
      customerEmail = charge.billing_details.email || undefined;
      customerId = typeof charge.customer === 'string' ? charge.customer : 
                  charge.customer ? charge.customer.id : undefined;
    }
  } catch (error) {
    console.error(`Failed to fetch charges for payment intent ${paymentIntent.id}:`, error);
    // Continue without the customer information
  }
  
  // Determine product type from metadata or default to 'individual'
  const productType = paymentIntent.metadata?.productType || 'individual';
  
  // Save the new transaction
  await storage.savePaymentTransaction({
    id: uuidv4(),
    stripeId: paymentIntent.id,
    customerId,
    customerEmail,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    status: 'succeeded',
    created: new Date(paymentIntent.created * 1000).toISOString(),
    productType,
    metadata: JSON.stringify(paymentIntent.metadata),
    isRefunded: false,
    sessionId: paymentIntent.metadata?.sessionId
  });
  
  console.log(`Payment transaction recorded: ${paymentIntent.id}`);
}

/**
 * Handle failed payment intents
 */
async function handlePaymentIntentFailed(paymentIntent: Stripe.PaymentIntent) {
  console.log(`❌ Payment failed: ${paymentIntent.id}`);
  
  // Check if we already have this transaction
  const existingTransaction = await storage.getPaymentTransactionByStripeId(paymentIntent.id);
  if (existingTransaction) {
    // Just update the status
    await storage.updatePaymentTransactionStatus(paymentIntent.id, 'failed');
    return;
  }
  
  // Get customer information if available
  let customerEmail: string | undefined;
  let customerId: string | undefined;
  
  try {
    // Get the charges directly from Stripe API
    const charges = await stripe.charges.list({ payment_intent: paymentIntent.id });
    
    if (charges.data.length > 0) {
      const charge = charges.data[0];
      customerEmail = charge.billing_details.email || undefined;
      customerId = typeof charge.customer === 'string' ? charge.customer : 
                  charge.customer ? charge.customer.id : undefined;
    }
  } catch (error) {
    console.error(`Failed to fetch charges for failed payment intent ${paymentIntent.id}:`, error);
    // Continue without the customer information
  }
  
  // Determine product type from metadata or default to 'individual'
  const productType = paymentIntent.metadata?.productType || 'individual';
  
  // Save the failed transaction
  await storage.savePaymentTransaction({
    id: uuidv4(),
    stripeId: paymentIntent.id,
    customerId,
    customerEmail,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    status: 'failed',
    created: new Date(paymentIntent.created * 1000).toISOString(),
    productType,
    metadata: JSON.stringify(paymentIntent.metadata),
    isRefunded: false,
    sessionId: paymentIntent.metadata?.sessionId
  });
  
  console.log(`Failed payment transaction recorded: ${paymentIntent.id}`);
}

/**
 * Handle refunded charges
 */
async function handleChargeRefunded(charge: Stripe.Charge) {
  console.log(`♻️ Charge refunded: ${charge.id}`);
  
  // If this charge is linked to a payment intent
  if (charge.payment_intent) {
    const paymentIntentId = typeof charge.payment_intent === 'string' 
      ? charge.payment_intent 
      : charge.payment_intent.id;
    
    // Get refund reason if available
    let refundReason: string | undefined;
    
    if (charge.refunds && charge.refunds.data && charge.refunds.data.length > 0) {
      refundReason = charge.refunds.data[0].reason || undefined;
    }
    
    // Record the refund
    await storage.recordRefund(
      paymentIntentId,
      charge.amount_refunded,
      refundReason
    );
    
    console.log(`Refund recorded for payment intent: ${paymentIntentId}`);
  }
}

/**
 * Handle completed checkout sessions
 */
async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  console.log(`✅ Checkout session completed: ${session.id}`);
  
  // If the session has a payment intent, process that
  if (session.payment_intent) {
    // Get the payment intent details
    const paymentIntentId = typeof session.payment_intent === 'string' 
      ? session.payment_intent 
      : session.payment_intent.id;
    
    const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
    await handlePaymentIntentSucceeded(paymentIntent);
  }
}