# Stripe Webhook Setup Guide

## Current Problem
Stripe is failing to send webhook events to our application because the webhook URL is set incorrectly in the Stripe Dashboard.

The error message from Stripe indicates they're attempting to send events to:
```
https://your-replit-domain.replit.app/api/webhooks/stripe
```

This is a placeholder URL, not the actual domain of our application.

## Complete Webhook Setup Solution

### 1. Update the Webhook URL in Stripe Dashboard

1. Log into your Stripe Dashboard: https://dashboard.stripe.com/
2. Navigate to **Developers → Webhooks**
3. Find the webhook endpoint with the placeholder URL shown above
4. Click on it to edit
5. Update the URL to the actual domain where the application is hosted:
   ```
   https://the100marriage.lawrenceadjah.com/api/webhooks/stripe
   ```
6. Save the changes

### 2. Verify the Webhook Secret

1. Make sure the webhook signing secret in Stripe matches the one in your environment variables
2. In Stripe Dashboard on the webhook details page:
   - Click **Reveal** next to the "Signing secret"
   - Copy this value
3. Make sure this value matches your `STRIPE_WEBHOOK_SECRET` environment variable
4. If it doesn't match or if the environment variable is missing:
   - Copy the signing secret from Stripe
   - Add it to your environment variables

### 3. Test the Webhook Configuration

The application now includes several tools to verify your webhook is configured correctly:

#### Basic Webhook Test
1. Visit: `https://the100marriage.lawrenceadjah.com/api/webhooks/stripe/test`
2. This endpoint will verify that:
   - The webhook endpoint is accessible
   - All required environment variables are set
   - The correct URL path is configured

#### Send a Test Event from Stripe
1. In the Stripe Dashboard, on your webhook details page, click **Send test webhook**
2. Select an event type to test (e.g., `payment_intent.succeeded`)
3. Click **Send test webhook**
4. Check your application logs to confirm the webhook was received and processed

### 4. Webhooks Troubleshooting Checklist

If webhooks are still not working after updating the URL, check these potential issues:

- **Webhook path accessible?** 
  - Verify the path `/api/webhooks/stripe` is accessible from the internet
  - Confirm no firewalls or access restrictions are blocking it

- **Environment variables set?**
  - `STRIPE_SECRET_KEY` must be set and valid
  - `STRIPE_WEBHOOK_SECRET` must match the signing secret from Stripe

- **Correct Stripe API version?**
  - The application uses API version `2023-10-16`
  - Ensure your webhook is using a compatible API version

- **Signature verification working?**
  - The webhook handler requires proper signature verification
  - Make sure raw request body parsing is enabled (this has been fixed in our code)

## Webhook Testing Tools

We've implemented robust testing capabilities to help verify your webhook setup:

1. **Basic Connectivity Test**:
   - GET request to `/api/webhooks/stripe/test`
   - Confirms endpoint accessibility and environment variable configuration

2. **Advanced Simulation Test**:
   - POST request to `/api/webhooks/stripe/simulate`
   - Requires header `x-admin-key: the100marriage-admin`
   - Tests the complete webhook processing flow with a simulated event
   - Safe to use as it doesn't modify any real data

## Additional Implementation Notes

- We've added improved error handling to reduce silent failures
- The raw body parsing middleware has been fixed to properly capture webhook payloads
- Detailed logging has been added throughout the webhook processing flow
- The webhook handlers fully support all payment events (success, failure, refunds, etc.)

By following these steps, webhook events should start working correctly and reliably again.