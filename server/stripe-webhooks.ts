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
 * Sync historical payments from Stripe to our database
 * This allows us to backfill transaction data from before webhook setup
 */
export async function syncStripePayments(startDate?: string, endDate?: string): Promise<{
  success: boolean;
  count: number;
  synced: number;
  errors: number;
  detail?: Record<string, number>;
  message: string;
}> {
  try {
    let startTimestamp: number | undefined;
    let endTimestamp: number | undefined;
    
    // Convert dates to Unix timestamps if provided
    if (startDate) {
      startTimestamp = Math.floor(new Date(startDate).getTime() / 1000);
    }
    
    if (endDate) {
      endTimestamp = Math.floor(new Date(endDate).getTime() / 1000);
    }
    
    console.log(`Syncing Stripe payments from ${startDate || 'beginning'} to ${endDate || 'now'}...`);
    
    // Get payments from Stripe
    const paymentIntents = await stripe.paymentIntents.list({
      limit: 100,
      created: {
        ...(startTimestamp && { gte: startTimestamp }),
        ...(endTimestamp && { lte: endTimestamp })
      }
    });
    
    console.log(`Found ${paymentIntents.data.length} payment intents to sync`);
    
    let syncedCount = 0;
    let errorCount = 0;
    
    // Tracking transactions by product type
    const transactionDetail: Record<string, number> = {
      individual: 0,
      couple: 0,
      marriage_pool: 0,
      other: 0
    };
    
    // Process each payment intent
    for (const paymentIntent of paymentIntents.data) {
      try {
        // Skip if we already have this transaction
        const existingTransaction = await storage.getPaymentTransactionByStripeId(paymentIntent.id);
        if (existingTransaction) {
          console.log(`Payment ${paymentIntent.id} already exists in database, skipping...`);
          continue;
        }
        
        // Determine product type before processing to track it properly
        let productType = 'other';
        try {
          const charges = await stripe.charges.list({ payment_intent: paymentIntent.id });
          if (charges.data.length > 0) {
            const description = charges.data[0].description || '';
            
            if (description.includes('THM Arranged Marriage Pool')) {
              productType = 'marriage_pool';
            } else if (description.includes('The 100 Marriage Assessment - Series 1 (Couple)')) {
              productType = 'couple';
            } else if (description.includes('The 100 Marriage Assessment - Series 1 (Individual)')) {
              productType = 'individual';
            }
          }
        } catch (error) {
          console.error(`Could not determine product type for ${paymentIntent.id}:`, error);
          // Continue with default 'other' type
        }
        
        if (paymentIntent.status === 'succeeded') {
          await handlePaymentIntentSucceeded(paymentIntent);
          syncedCount++;
          transactionDetail[productType]++;
          console.log(`✓ Synced ${productType} payment: ${paymentIntent.id}`);
        } else if (paymentIntent.status === 'canceled') {
          await handlePaymentIntentFailed(paymentIntent);
          syncedCount++;
        }
      } catch (error) {
        console.error(`Error syncing payment ${paymentIntent.id}:`, error);
        errorCount++;
      }
    }
    
    return {
      success: true,
      count: syncedCount,
      synced: syncedCount,
      errors: errorCount,
      detail: transactionDetail,
      message: `Successfully synced ${syncedCount} payments, encountered ${errorCount} errors`
    };
  } catch (error) {
    console.error('Error syncing Stripe payments:', error);
    
    // Additional diagnostics for Stripe API failures
    let diagnosticInfo = '';
    
    if (error instanceof Error) {
      if ('type' in error && typeof error.type === 'string') {
        // This is likely a Stripe API error with additional info
        diagnosticInfo = ` (Type: ${error.type})`;
        
        if ('code' in error && typeof error.code === 'string') {
          diagnosticInfo += ` [Code: ${error.code}]`;
        }
      }
    }
    
    return {
      success: false,
      count: 0,
      synced: 0,
      errors: 1,
      detail: { individual: 0, couple: 0, marriage_pool: 0, other: 0 },
      message: `Failed to sync payments: ${error instanceof Error ? error.message : String(error)}${diagnosticInfo}`
    };
  }
}

/**
 * Handle Stripe webhook events to sync payment data with our database
 */
export async function handleStripeWebhook(req: Request, res: Response) {
  let event: Stripe.Event;
  
  // Log the incoming webhook for debugging with improved detail
  const requestTimestamp = new Date().toISOString();
  console.log('📌 Received Stripe webhook:', {
    timestamp: requestTimestamp,
    headers: {
      'stripe-signature': req.headers['stripe-signature'] ? '✓ Present' : '✗ Missing',
      'content-type': req.headers['content-type'],
      'content-length': req.headers['content-length'] || 'not specified'
    },
    url: req.originalUrl,
    method: req.method
  });
  
  // More detailed logging of the request body
  const bodyType = typeof req.body;
  console.log(`Webhook body type: ${bodyType}, content available: ${req.body ? 'Yes' : 'No'}`);
  
  // Check if body is parseable (if string) and log the event type with better error handling
  try {
    if (!req.body) {
      console.error('❌ Webhook body is empty or undefined');
      throw new Error('Webhook body is missing');
    }
    
    const parsedBody = bodyType === 'string' ? JSON.parse(req.body) : req.body;
    console.log(`Webhook event details:`, {
      type: parsedBody.type || 'unknown',
      id: parsedBody.id || 'unknown',
      apiVersion: parsedBody.api_version || 'unknown',
      created: parsedBody.created ? new Date(parsedBody.created * 1000).toISOString() : 'unknown'
    });
  } catch (error) {
    console.error('❌ Could not parse webhook body for logging:', error);
    // Continue processing - this is just diagnostic logging
  }
  
  const sig = req.headers['stripe-signature'];
  
  try {
    if (!req.body) {
      throw new Error('Webhook body is empty or missing');
    }
    
    if (sig && process.env.STRIPE_WEBHOOK_SECRET) {
      // Verify the webhook signature if we have the secret
      console.log(`Attempting signature verification with secret key ending in ...${process.env.STRIPE_WEBHOOK_SECRET.slice(-4)}`);
      
      // If req.body is a string (raw body), use it directly
      const payload = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);
      
      if (payload.length === 0) {
        throw new Error('Webhook payload is empty');
      }
      
      event = stripe.webhooks.constructEvent(
        payload,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      );
      console.log('✓ Webhook signature verified successfully');
    } else {
      // For testing/development, parse the event directly
      // In production, always use signature verification
      console.warn('⚠️ Webhook signature verification skipped - not recommended for production');
      
      if (!sig) {
        console.warn('Missing stripe-signature header');
      }
      
      if (!process.env.STRIPE_WEBHOOK_SECRET) {
        console.warn('Missing STRIPE_WEBHOOK_SECRET environment variable');
      }
      
      event = typeof req.body === 'string' ? JSON.parse(req.body) : req.body as Stripe.Event;
    }
  } catch (err: any) {
    console.error(`❌ Webhook processing error: ${err.message}`);
    // Send more detailed error response
    return res.status(400).json({
      error: 'Webhook validation failed',
      message: err.message,
      timestamp: new Date().toISOString()
    });
  }
  
  // Handle specific event types
  try {
    console.log(`📦 Processing Stripe event: ${event.type} (id: ${event.id})`);
    
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
        
      default:
        console.log(`⚠️ Unhandled event type: ${event.type}`);
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
      
      // Send notification email for status change
      try {
        await sendNotificationEmail(existingTransaction);
        console.log(`Payment notification email sent for updated transaction: ${paymentIntent.id}`);
      } catch (error) {
        console.error('Failed to send payment notification email:', error);
      }
    }
    return;
  }
  
  // Fetch customer information from payment intent and charges
  let customerEmail: string | undefined;
  let customerId: string | undefined;
  let firstName: string | undefined;
  let lastName: string | undefined;
  let customerName: string | undefined;
  let phone: string | undefined;
  let assessmentType: string = 'individual';
  let thmPoolApplied: boolean = false;
  
  // First check the payment intent metadata for customer details
  // This would be present if the customer used our enhanced payment form
  if (paymentIntent.metadata) {
    firstName = paymentIntent.metadata.firstName;
    lastName = paymentIntent.metadata.lastName;
    customerEmail = paymentIntent.metadata.email || customerEmail;
    phone = paymentIntent.metadata.phone;
    thmPoolApplied = paymentIntent.metadata.thmPoolApplied === 'true';
    assessmentType = paymentIntent.metadata.assessmentType || assessmentType;
    
    if (firstName && lastName) {
      customerName = `${firstName} ${lastName}`;
    }
    
    console.log(`Found customer info in payment metadata: ${customerName || 'Unknown'} (${customerEmail || 'No email'})`);
  }
  
  try {
    // Get the charges directly from Stripe API
    const charges = await stripe.charges.list({ payment_intent: paymentIntent.id });
    
    if (charges.data.length > 0) {
      const charge = charges.data[0];
      // Only use the charge email if we don't already have one from metadata
      customerEmail = customerEmail || charge.billing_details.email || undefined;
      customerId = typeof charge.customer === 'string' ? charge.customer : 
                  charge.customer ? charge.customer.id : undefined;
      
      // Try to extract name from charge billing details if we don't have it yet
      if (!customerName && charge.billing_details.name) {
        customerName = charge.billing_details.name;
        
        // Try to split into first/last name if we don't have them yet
        if ((!firstName || !lastName) && customerName) {
          const nameParts = customerName.split(' ');
          if (nameParts.length >= 2) {
            firstName = firstName || nameParts[0];
            lastName = lastName || nameParts.slice(1).join(' ');
          }
        }
      }
      
      // Get phone if not already present
      phone = phone || charge.billing_details.phone || undefined;
    }
  } catch (error) {
    console.error(`Failed to fetch charges for payment intent ${paymentIntent.id}:`, error);
    // Continue without the customer information from charges
  }
  
  // Extract product information from the description or metadata
  let productType = paymentIntent.metadata?.productType || 'individual';
  let productName = paymentIntent.metadata?.productName || '';
  
  // If there's a charge description containing "THM Arranged Marriage Pool", update the product type
  try {
    const charges = await stripe.charges.list({ payment_intent: paymentIntent.id });
    if (charges.data.length > 0) {
      const charge = charges.data[0];
      const description = charge.description || '';
      
      if (description.includes('THM Arranged Marriage Pool')) {
        productType = 'marriage_pool';
        productName = 'THM Arranged Marriage Pool Application Fee';
      } else if (description.includes('The 100 Marriage Assessment - Series 1 (Couple)')) {
        productType = 'couple';
        productName = 'The 100 Marriage Assessment - Series 1 (Couple)';
      } else if (description.includes('The 100 Marriage Assessment - Series 1 (Individual)')) {
        productType = 'individual';
        productName = 'The 100 Marriage Assessment - Series 1 (Individual)';
      } else if (!productName) {
        productName = description; // Use charge description as fallback
      }
    }
  } catch (error) {
    console.error(`Failed to fetch charge descriptions for payment intent ${paymentIntent.id}:`, error);
  }
  
  // Create transaction object
  const transaction = {
    id: uuidv4(),
    stripeId: paymentIntent.id,
    customerId,
    customerEmail,
    amount: paymentIntent.amount,
    currency: paymentIntent.currency,
    status: 'succeeded',
    created: new Date(paymentIntent.created * 1000).toISOString(),
    productType,
    productName,
    metadata: JSON.stringify(paymentIntent.metadata),
    isRefunded: false,
    sessionId: paymentIntent.metadata?.sessionId
  };
  
  console.log(`Recording payment for: ${productName} (${productType}) - Amount: ${paymentIntent.amount/100} ${paymentIntent.currency.toUpperCase()}`)
  
  // Save the new transaction
  await storage.savePaymentTransaction(transaction);
  console.log(`Payment transaction recorded: ${paymentIntent.id}`);
  
  // If this customer has an assessment, link it to this transaction
  if (customerEmail) {
    try {
      // Get all assessments for this customer's email
      const customerAssessments = await storage.getAssessments(customerEmail);
      
      if (customerAssessments.length > 0) {
        // Sort by timestamp to get the most recent assessment
        const sortedAssessments = customerAssessments.sort(
          (a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
        );
        
        // Update the most recent assessment with the transaction ID
        const latestAssessment = sortedAssessments[0];
        
        if (!latestAssessment.transactionId) {
          latestAssessment.transactionId = transaction.id;
          await storage.saveAssessment(latestAssessment);
          console.log(`Linked assessment to transaction: ${transaction.id} -> ${latestAssessment.email}`);
        }
      }
    } catch (error) {
      console.error('Failed to link assessment to transaction:', error);
      // Continue processing even if linking fails
    }
  }
  
  // Send notification email
  try {
    await sendNotificationEmail(transaction);
    console.log(`Payment notification email sent for new transaction: ${paymentIntent.id}`);
  } catch (error) {
    console.error('Failed to send payment notification email:', error);
  }
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
  
  // Extract product information from the description or metadata
  let productType = paymentIntent.metadata?.productType || 'individual';
  let productName = paymentIntent.metadata?.productName || '';
  
  // If there's a charge description, update product info
  try {
    const charges = await stripe.charges.list({ payment_intent: paymentIntent.id });
    if (charges.data.length > 0) {
      const charge = charges.data[0];
      const description = charge.description || '';
      
      if (description.includes('THM Arranged Marriage Pool')) {
        productType = 'marriage_pool';
        productName = 'THM Arranged Marriage Pool Application Fee';
      } else if (description.includes('The 100 Marriage Assessment - Series 1 (Couple)')) {
        productType = 'couple';
        productName = 'The 100 Marriage Assessment - Series 1 (Couple)';
      } else if (description.includes('The 100 Marriage Assessment - Series 1 (Individual)')) {
        productType = 'individual';
        productName = 'The 100 Marriage Assessment - Series 1 (Individual)';
      } else if (!productName) {
        productName = description; // Use charge description as fallback
      }
    }
  } catch (error) {
    console.error(`Failed to fetch charge descriptions for failed payment intent ${paymentIntent.id}:`, error);
  }
  
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
    productName,
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