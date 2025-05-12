# Stripe Webhook Setup

## Problem
Stripe is failing to send webhook events to our application because the webhook URL is set incorrectly. 

The error message indicates that Stripe is trying to send events to:
```
https://your-replit-domain.replit.app/api/webhooks/stripe
```

This is a placeholder URL and not the actual domain of our application.

## Solution

### 1. Update the Webhook URL in Stripe Dashboard

1. Log into your Stripe Dashboard: https://dashboard.stripe.com/
2. Navigate to Developers → Webhooks
3. Find the webhook endpoint with the URL `https://your-replit-domain.replit.app/api/webhooks/stripe`
4. Click on it to edit
5. Update the URL to the actual domain where the application is hosted:
   ```
   https://the100marriage.lawrenceadjah.com/api/webhooks/stripe
   ```
6. Save the changes

### 2. Verify the Webhook Secret

1. Make sure the webhook signing secret in Stripe matches the one in your environment variables
2. In Stripe Dashboard, the webhook's signing secret can be revealed on the webhook details page
3. Check that this matches the value of `STRIPE_WEBHOOK_SECRET` in your environment variables

### 3. Test the Webhook

1. In the Stripe Dashboard, click "Send test webhook" 
2. Select an event type (like `payment_intent.succeeded`)
3. Send the test event
4. Check your application logs to confirm the webhook was received and processed

## Additional Notes

- The webhook handler is already properly implemented in the application code
- The webhook endpoint is configured at `/api/webhooks/stripe`
- The webhook handler supports signature verification for security

By fixing the URL in the Stripe Dashboard, webhook events should start working correctly again.