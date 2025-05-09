import express, { type Express, type Request, type Response } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { z } from "zod";
import { sendAssessmentEmail, sendReferralEmail, sendCoupleInvitationEmails } from "./nodemailer";
import { generateShareImage } from "./shareImage";
import { AssessmentResult } from "../shared/schema";
import { handleStripeWebhook } from "./stripe-webhooks";

// Initialize Stripe with the secret key
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

// Initialize Stripe - we're using the default API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function registerRoutes(app: Express): Promise<Server> {
  // Serve sample templates directly
  app.get('/sample-results.html', (req, res) => {
    res.sendFile('sample-results-mockup.html', { root: '.' });
  });
  
  app.get('/sample-email.html', (req, res) => {
    res.sendFile('sample-email-visualization.html', { root: '.' });
  });
  
  app.get('/sample-pdf.html', (req, res) => {
    res.sendFile('sample-pdf.html', { root: '.' });
  });
  
  // Serve couple assessment sample templates
  app.get('/sample-couple-results.html', (req, res) => {
    res.sendFile('sample-couple-results-mockup.html', { root: '.' });
  });
  
  app.get('/sample-couple-email.html', (req, res) => {
    res.sendFile('sample-couple-email-visualization.html', { root: '.' });
  });
  
  app.get('/sample-couple-report.html', (req, res) => {
    res.sendFile('sample-couple-report.html', { root: '.' });
  });
  
  // Share image generation endpoint for social media sharing
  app.get('/api/share-image', generateShareImage);
  // Email sending endpoint
  app.post('/api/email/send', async (req, res) => {
    try {
      // Validate the request body
      const emailSchema = z.object({
        to: z.string().email(),
        cc: z.string().email(),
        subject: z.string(),
        data: z.object({
          name: z.string(),
          scores: z.object({
            sections: z.record(z.object({
              earned: z.number(),
              possible: z.number(),
              percentage: z.number()
            })),
            overallPercentage: z.number(),
            strengths: z.array(z.string()),
            improvementAreas: z.array(z.string()),
            totalEarned: z.number(),
            totalPossible: z.number()
          }),
          profile: z.object({
            id: z.number(),
            name: z.string(),
            description: z.string(),
            genderSpecific: z.string().nullable(),
            criteria: z.array(z.object({
              section: z.string(),
              min: z.number().optional(),
              max: z.number().optional()
            }))
          }),
          genderProfile: z.object({
            id: z.number(),
            name: z.string(),
            description: z.string(),
            genderSpecific: z.string().nullable(),
            criteria: z.array(z.object({
              section: z.string(),
              min: z.number().optional(),
              max: z.number().optional()
            }))
          }).nullable().optional(),
          responses: z.record(z.object({
            option: z.string(),
            value: z.number()
          })),
          demographics: z.object({
            firstName: z.string(),
            lastName: z.string(),
            email: z.string().email(),
            phone: z.string().optional(),
            gender: z.string(),
            marriageStatus: z.string(),
            desireChildren: z.string(),
            ethnicity: z.string(),
            purchaseDate: z.string().optional(),
            lifeStage: z.string().default("Not specified"),
            birthday: z.string().default("Not specified"),
            city: z.string().default("Not specified"),
            state: z.string().default("Not specified"),
            zipCode: z.string().default("Not specified"),
            interestedInArrangedMarriage: z.boolean().default(false),
            thmPoolApplied: z.boolean().default(false)
          })
        })
      });
      
      const validatedData = emailSchema.parse(req.body);
      
      // Create assessment result object
      const assessmentResult: AssessmentResult = {
        email: validatedData.to,
        name: validatedData.data.name,
        scores: validatedData.data.scores,
        profile: validatedData.data.profile,
        genderProfile: validatedData.data.genderProfile || null,
        responses: validatedData.data.responses,
        demographics: validatedData.data.demographics,
        timestamp: new Date().toISOString()
      };
      
      // Store assessment result in storage
      await storage.saveAssessment(assessmentResult);
      
      // Send email with Nodemailer - admin email is now CC'd by default
      const emailResult = await sendAssessmentEmail(assessmentResult);
      
      if (!emailResult.success) {
        return res.status(500).json({
          success: false,
          message: "Failed to send email. Assessment data was saved."
        });
      }
      
      // For testing purposes, log the email preview URL
      if (emailResult.previewUrl) {
        console.log('📧 Email Preview URL (for testing):', emailResult.previewUrl);
        console.log('(Open this URL in your browser to view the test email)');
      }
      
      return res.status(200).json({ 
        success: true,
        message: "Assessment report sent successfully"
      });
    } catch (error) {
      console.error("Error sending email:", error);
      return res.status(400).json({ 
        success: false,
        message: "Failed to send assessment report"
      });
    }
  });

  // Admin API to fetch all assessments
  app.get('/api/admin/assessments', async (req: Request, res: Response) => {
    try {
      // In a real application, this endpoint would have proper authentication
      // For now, we'll just return all assessments from storage
      const assessments = await storage.getAllAssessments();
      
      // Return the assessments
      return res.status(200).json(assessments);
    } catch (error) {
      console.error("Error fetching assessments:", error);
      return res.status(500).json({ 
        success: false,
        message: "Failed to fetch assessments"
      });
    }
  });
  
  // API to start a couple assessment
  app.post('/api/couple-assessment/start', async (req: Request, res: Response) => {
    try {
      // Validate the request body
      const startCoupleSchema = z.object({
        primaryAssessment: z.object({
          email: z.string().email(),
          name: z.string(),
          scores: z.any(),
          profile: z.any(),
          genderProfile: z.any().optional(),
          responses: z.record(z.any()),
          demographics: z.any(),
          timestamp: z.string().optional()
        }),
        spouseEmail: z.string().email()
      });
      
      const validatedData = startCoupleSchema.parse(req.body);
      
      // Create assessment result object
      const primaryAssessment: AssessmentResult = {
        email: validatedData.primaryAssessment.email,
        name: validatedData.primaryAssessment.name,
        scores: validatedData.primaryAssessment.scores,
        profile: validatedData.primaryAssessment.profile,
        genderProfile: validatedData.primaryAssessment.genderProfile,
        responses: validatedData.primaryAssessment.responses,
        demographics: validatedData.primaryAssessment.demographics,
        timestamp: validatedData.primaryAssessment.timestamp || new Date().toISOString()
      };
      
      // Generate coupleId and save primary assessment
      const coupleId = await storage.saveCoupleAssessment(primaryAssessment, validatedData.spouseEmail);
      
      return res.status(200).json({ 
        success: true,
        coupleId,
        message: "Couple assessment started successfully"
      });
    } catch (error) {
      console.error("Error starting couple assessment:", error);
      return res.status(400).json({ 
        success: false,
        message: error instanceof Error ? error.message : "Failed to start couple assessment"
      });
    }
  });
  
  // API to submit spouse assessment
  app.post('/api/couple-assessment/submit-spouse', async (req: Request, res: Response) => {
    try {
      // Validate the request body
      const submitSpouseSchema = z.object({
        coupleId: z.string(),
        spouseAssessment: z.object({
          email: z.string().email(),
          name: z.string(),
          scores: z.any(),
          profile: z.any(),
          genderProfile: z.any().optional(),
          responses: z.record(z.any()),
          demographics: z.any(),
          timestamp: z.string().optional()
        })
      });
      
      const validatedData = submitSpouseSchema.parse(req.body);
      
      // Create assessment result object
      const spouseAssessment: AssessmentResult = {
        email: validatedData.spouseAssessment.email,
        name: validatedData.spouseAssessment.name,
        scores: validatedData.spouseAssessment.scores,
        profile: validatedData.spouseAssessment.profile,
        genderProfile: validatedData.spouseAssessment.genderProfile,
        responses: validatedData.spouseAssessment.responses,
        demographics: validatedData.spouseAssessment.demographics,
        coupleId: validatedData.coupleId,
        coupleRole: 'spouse',
        timestamp: validatedData.spouseAssessment.timestamp || new Date().toISOString()
      };
      
      // Save spouse assessment
      await storage.saveAssessment(spouseAssessment);
      
      // Generate couple report
      const coupleReport = await storage.getCoupleAssessment(validatedData.coupleId);
      
      if (!coupleReport) {
        return res.status(404).json({
          success: false,
          message: "Could not generate couple report. Primary assessment not found."
        });
      }
      
      return res.status(200).json({ 
        success: true,
        coupleReport,
        message: "Spouse assessment submitted successfully"
      });
    } catch (error) {
      console.error("Error submitting spouse assessment:", error);
      return res.status(400).json({ 
        success: false,
        message: error instanceof Error ? error.message : "Failed to submit spouse assessment"
      });
    }
  });
  
  // API to fetch a couple assessment report
  app.get('/api/couple-assessment/:coupleId', async (req: Request, res: Response) => {
    try {
      const coupleId = req.params.coupleId;
      
      if (!coupleId) {
        return res.status(400).json({
          success: false,
          message: "Couple ID is required"
        });
      }
      
      const coupleReport = await storage.getCoupleAssessment(coupleId);
      
      if (!coupleReport) {
        return res.status(404).json({
          success: false,
          message: "Couple assessment not found or incomplete"
        });
      }
      
      return res.status(200).json({ 
        success: true,
        coupleReport
      });
    } catch (error) {
      console.error("Error fetching couple assessment:", error);
      return res.status(500).json({ 
        success: false,
        message: "Failed to fetch couple assessment"
      });
    }
  });
  
  // Admin API to fetch all couple assessments
  app.get('/api/admin/couple-assessments', async (req: Request, res: Response) => {
    try {
      // In a real application, this endpoint would have proper authentication
      const coupleAssessments = await storage.getAllCoupleAssessments();
      
      // Return the couple assessments
      return res.status(200).json(coupleAssessments);
    } catch (error) {
      console.error("Error fetching couple assessments:", error);
      return res.status(500).json({ 
        success: false,
        message: "Failed to fetch couple assessments"
      });
    }
  });
  
  // Admin API to fetch all referrals/invitations
  app.get('/api/admin/referrals', async (req: Request, res: Response) => {
    try {
      // In a real application, this endpoint would have proper authentication
      const referrals = await storage.getAllReferrals();
      
      // Return the referrals
      return res.status(200).json(referrals);
    } catch (error) {
      console.error("Error fetching referrals:", error);
      return res.status(500).json({ 
        success: false,
        message: "Failed to fetch referrals"
      });
    }
  });
  
  // API to register a couple assessment early (before assessments are completed)
  app.post('/api/couple-assessment/register-early', async (req: Request, res: Response) => {
    try {
      // Validate the request body
      const earlyRegisterSchema = z.object({
        primaryEmail: z.string().email(),
        spouseEmail: z.string().email()
      });
      
      const validatedData = earlyRegisterSchema.parse(req.body);
      
      // Generate a unique coupleId (UUID format)
      const coupleId = `couple-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      // In a real implementation, we would store this pending couple registration
      // For now, we'll return the coupleId that can be used later
      console.log(`Early couple registration: ${validatedData.primaryEmail} and ${validatedData.spouseEmail} with ID ${coupleId}`);
      
      return res.status(200).json({ 
        success: true,
        coupleId,
        message: "Couple assessment registered successfully"
      });
    } catch (error) {
      console.error("Error registering early couple assessment:", error);
      return res.status(400).json({ 
        success: false,
        message: error instanceof Error ? error.message : "Failed to register couple assessment"
      });
    }
  });
  
  // API to send invitations to both partners for a couple assessment
  app.post('/api/couple-assessment/send-invitations', async (req: Request, res: Response) => {
    try {
      // Validate the request body
      const sendInvitationsSchema = z.object({
        coupleId: z.string(),
        primaryEmail: z.string().email(),
        spouseEmail: z.string().email(),
        primaryName: z.string().optional(),
        spouseName: z.string().optional()
      });
      
      const validatedData = sendInvitationsSchema.parse(req.body);
      
      // Send specialized couple assessment invitations to both partners
      const emailResult = await sendCoupleInvitationEmails({
        primaryEmail: validatedData.primaryEmail,
        primaryName: validatedData.primaryName,
        spouseEmail: validatedData.spouseEmail,
        spouseName: validatedData.spouseName,
        coupleId: validatedData.coupleId
      });
      
      if (!emailResult.success) {
        throw new Error("Failed to send invitation emails");
      }
      
      // For testing purposes, log the email preview URLs
      if (emailResult.previewUrls && emailResult.previewUrls.length > 0) {
        console.log('📧 Email Preview URLs (for testing):');
        emailResult.previewUrls.forEach((url, index) => {
          console.log(`${index === 0 ? 'Primary' : 'Spouse'} Email: ${url}`);
        });
      }
      
      return res.status(200).json({ 
        success: true,
        message: "Invitations sent successfully to both partners",
        previewUrls: emailResult.previewUrls
      });
    } catch (error) {
      console.error("Error sending couple invitations:", error);
      return res.status(400).json({ 
        success: false,
        message: error instanceof Error ? error.message : "Failed to send invitations"
      });
    }
  });
  
  // Send email for a couple assessment
  app.post('/api/couple-assessment/email', async (req: Request, res: Response) => {
    try {
      const { coupleId } = req.body;
      
      if (!coupleId) {
        return res.status(400).json({
          success: false,
          message: 'Couple ID is required'
        });
      }
      
      // Get the couple assessment report
      const report = await storage.getCoupleAssessment(coupleId);
      
      if (!report) {
        return res.status(404).json({
          success: false,
          message: 'Couple assessment not found or incomplete'
        });
      }
      
      // Import the sendCoupleAssessmentEmail function from nodemailer.ts
      const { sendCoupleAssessmentEmail } = await import('./nodemailer');
      
      // Send email with the report
      const emailResult = await sendCoupleAssessmentEmail(report);
      
      if (emailResult.success) {
        return res.status(200).json({
          success: true,
          message: 'Couple assessment email sent successfully',
          previewUrl: emailResult.previewUrl
        });
      } else {
        throw new Error('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending couple assessment email:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to send couple assessment email'
      });
    }
  });

  // Create a Stripe payment intent for assessment purchase
  app.post('/api/create-payment-intent', async (req, res) => {
    try {
      // Get assessment type and THM pool application status from request
      const { 
        assessmentType = 'individual',
        thmPoolApplied = false 
      } = req.body;
      
      // Base price calculation
      // Individual: $49, Couple: $79 (for future use)
      let amount = assessmentType === 'couple' ? 7900 : 4900; // in cents
      
      // Add THM Pool application fee if opted in ($25 extra)
      if (thmPoolApplied) {
        amount += 2500; // Add $25 in cents
      }
      
      // Create a description based on assessment type and THM pool application
      let description = `The 100 Marriage Assessment - Series 1 (${assessmentType === 'couple' ? 'Couple' : 'Individual'})`;
      if (thmPoolApplied) {
        description += ' + THM Arranged Marriage Pool Application';
      }

      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        payment_method_types: ["card"],
        description,
        metadata: {
          product: "marriage_assessment",
          type: assessmentType,
          thmPoolApplied: thmPoolApplied ? "yes" : "no"
        }
      });

      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        amount: amount / 100, // Convert back to dollars for display
        assessmentType,
        thmPoolApplied
      });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ 
        error: "Failed to create payment intent. Please use a promo code instead.",
        usePromoCode: true
      });
    }
  });

  // Verify promo code validity
  app.post('/api/verify-promo-code', async (req, res) => {
    try {
      const { promoCode, assessmentType = 'individual' } = req.body;
      
      // Valid promo codes (in a real app, these would be stored in a database)
      // For now, these promo codes work for both individual and couple assessments
      const validPromoCodes = ["FREE100", "LA2025", "MARRIAGE100", "INVITED10"];
      
      // Future implementation could have type-specific promo codes
      // const individualPromoCodes = [...];
      // const couplePromoCodes = [...];
      
      // Check if the promo code is valid
      const isValid = validPromoCodes.includes(promoCode);
      
      res.status(200).json({ 
        valid: isValid,
        assessmentType,
        message: isValid 
          ? `Promo code applied successfully for ${assessmentType} assessment` 
          : "Invalid promo code"
      });
    } catch (error) {
      console.error("Error verifying promo code:", error);
      res.status(500).json({ 
        valid: false, 
        message: "Failed to verify promo code" 
      });
    }
  });
  
  // Create payment intent specifically for THM pool application fee
  app.post('/api/create-thm-payment-intent', async (req, res) => {
    try {
      if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('Missing Stripe secret key');
      }
      
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      
      // THM Pool Application Fee is fixed at $25
      const amount = 2500; // in cents
      
      // Create a payment intent
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: 'usd',
        metadata: {
          purpose: 'THM_Pool_Application_Fee_Only'
        },
        description: 'THM Arranged Marriage Pool Application Fee'
      });
      
      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        amount: amount / 100 // Convert back to dollars for display
      });
    } catch (error) {
      console.error("Error creating THM payment intent:", error);
      res.status(500).json({
        message: "Failed to create payment intent for THM pool application"
      });
    }
  });
  
  // Send referral invitations and apply discount
  app.post('/api/send-referrals', async (req, res) => {
    try {
      const { referrer, contacts } = req.body;
      
      // Validate request data
      if (!referrer || !referrer.firstName || !referrer.lastName || !referrer.email) {
        return res.status(400).json({ 
          success: false, 
          message: "Referrer information is incomplete" 
        });
      }
      
      // Validate referrer email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(referrer.email)) {
        return res.status(400).json({ 
          success: false, 
          message: "Invalid referrer email address" 
        });
      }
      
      if (!contacts || !Array.isArray(contacts) || contacts.length < 3) {
        return res.status(400).json({ 
          success: false, 
          message: "Must provide information for 3 contacts" 
        });
      }
      
      // Check for duplicate emails among contacts
      const contactEmails = new Set<string>();
      
      // Check if any contact email matches the referrer's email
      if (contacts.some(c => c.email.toLowerCase() === referrer.email.toLowerCase())) {
        return res.status(400).json({ 
          success: false, 
          message: "You cannot refer yourself" 
        });
      }
      
      for (const contact of contacts) {
        if (!contact.firstName || !contact.lastName || !contact.email) {
          return res.status(400).json({ 
            success: false, 
            message: "Contact information is incomplete" 
          });
        }
        
        // Validate email format
        if (!emailRegex.test(contact.email)) {
          return res.status(400).json({ 
            success: false, 
            message: `Invalid email address: ${contact.email}` 
          });
        }
        
        // Check for duplicate emails among contacts
        const lowerCaseEmail = contact.email.toLowerCase();
        if (contactEmails.has(lowerCaseEmail)) {
          return res.status(400).json({ 
            success: false, 
            message: `Duplicate email address: ${contact.email}` 
          });
        }
        
        contactEmails.add(lowerCaseEmail);
      }
      
      // In a production system, we would also check:
      // 1. Has this email been referred before?
      // 2. Are these emails on a spam/throwaway email domain blacklist?
      // 3. Is the referrer attempting to abuse the system with multiple referrals?
      
      // Store the referrals in the database and send emails
      
      // Log the referral information
      console.log("Referral received:", {
        referrer: `${referrer.firstName} ${referrer.lastName} (${referrer.email})`,
        contacts: contacts.map(c => `${c.firstName} ${c.lastName} (${c.email})`)
      });
      
      // Generate promo code for referrals
      const promoCode = `INVITED10_${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
      
      // Send emails to contacts
      const emailPromises = [];
      const referralStorePromises = [];
      
      for (const contact of contacts) {
        console.log(`Sending invitation email to ${contact.email}...`);
        
        // Generate unique ID for this referral
        const referralId = `ref_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
        
        // Store the referral data
        const referralData = {
          id: referralId,
          referrerName: `${referrer.firstName} ${referrer.lastName}`,
          referrerEmail: referrer.email,
          invitedName: `${contact.firstName} ${contact.lastName}`,
          invitedEmail: contact.email,
          timestamp: new Date().toISOString(),
          status: 'sent' as const,
          promoCode
        };
        
        // Add to storage
        referralStorePromises.push(storage.saveReferral(referralData));
        
        // Queue up email sending promises
        emailPromises.push(
          sendReferralEmail({
            to: contact.email,
            referrerName: `${referrer.firstName} ${referrer.lastName}`,
            referrerEmail: referrer.email,
            recipientName: `${contact.firstName} ${contact.lastName}`,
            promoCode
          })
        );
      }
      
      // Wait for all referrals to be stored
      await Promise.all(referralStorePromises);
      
      // Wait for all emails to be sent
      const emailResults = await Promise.all(emailPromises);
      
      // Check if any emails failed to send
      const failedEmails = emailResults.filter(result => !result.success);
      if (failedEmails.length > 0) {
        console.warn(`${failedEmails.length} out of ${contacts.length} referral emails failed to send`);
      }
      
      // Return success response
      res.status(200).json({ 
        success: true, 
        discountApplied: 10, // $10 discount
        message: "Referrals sent successfully and discount applied!" 
      });
    } catch (error) {
      console.error("Error processing referrals:", error);
      res.status(500).json({ 
        success: false, 
        message: "Failed to process referrals. Please try again." 
      });
    }
  });

  // Analytics endpoints for the admin dashboard
  app.get('/api/admin/analytics/summary', async (req: Request, res: Response) => {
    try {
      const period = (req.query.period as 'day' | 'week' | 'month' | 'year') || 'week';
      const analyticsSummary = await storage.getAnalyticsSummary(period);
      
      return res.status(200).json(analyticsSummary);
    } catch (error) {
      console.error('Error fetching analytics summary:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch analytics summary'
      });
    }
  });
  
  app.get('/api/admin/analytics/page-views', async (req: Request, res: Response) => {
    try {
      const startDate = req.query.startDate as string | undefined;
      const endDate = req.query.endDate as string | undefined;
      
      const pageViews = await storage.getPageViews(startDate, endDate);
      
      return res.status(200).json(pageViews);
    } catch (error) {
      console.error('Error fetching page views:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch page views'
      });
    }
  });
  
  app.get('/api/admin/analytics/visitor-sessions', async (req: Request, res: Response) => {
    try {
      const startDate = req.query.startDate as string | undefined;
      const endDate = req.query.endDate as string | undefined;
      
      const visitorSessions = await storage.getVisitorSessions(startDate, endDate);
      
      return res.status(200).json(visitorSessions);
    } catch (error) {
      console.error('Error fetching visitor sessions:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch visitor sessions'
      });
    }
  });
  
  // API to fetch payment transactions for analytics
  app.get('/api/admin/analytics/payment-transactions', async (req: Request, res: Response) => {
    try {
      const startDate = req.query.startDate as string | undefined;
      const endDate = req.query.endDate as string | undefined;
      
      const transactions = await storage.getPaymentTransactions(startDate, endDate);
      
      return res.status(200).json(transactions);
    } catch (error) {
      console.error('Error fetching payment transactions:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch payment transactions'
      });
    }
  });
  
  // API to fetch a single payment transaction by Stripe ID
  app.get('/api/admin/payment-transactions/:stripeId', async (req: Request, res: Response) => {
    try {
      const stripeId = req.params.stripeId;
      
      if (!stripeId) {
        return res.status(400).json({
          success: false,
          message: 'Stripe ID is required'
        });
      }
      
      const transaction = await storage.getPaymentTransactionByStripeId(stripeId);
      
      if (!transaction) {
        return res.status(404).json({
          success: false,
          message: 'Payment transaction not found'
        });
      }
      
      return res.status(200).json({
        success: true,
        transaction
      });
    } catch (error) {
      console.error('Error fetching payment transaction:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch payment transaction'
      });
    }
  });
  
  // Stripe webhook endpoint to receive webhook events from Stripe
  app.post('/api/webhooks/stripe', express.raw({ type: 'application/json' }), handleStripeWebhook);

  const httpServer = createServer(app);
  return httpServer;
}
