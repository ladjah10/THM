import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { z } from "zod";
import { sendAssessmentEmail } from "./nodemailer";
import { AssessmentResult } from "../shared/schema";

// Initialize Stripe with the secret key
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2023-10-16",
});

export async function registerRoutes(app: Express): Promise<Server> {
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
            purchaseDate: z.string().optional()
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

  // Create a Stripe payment intent for assessment purchase
  app.post('/api/create-payment-intent', async (req, res) => {
    try {
      // Fixed price for the assessment ($49)
      const amount = 4900; // $49.00 in cents

      // Create a PaymentIntent with the order amount and currency
      const paymentIntent = await stripe.paymentIntents.create({
        amount,
        currency: "usd",
        payment_method_types: ["card"],
        description: "The 100 Marriage Assessment - Series 1",
        metadata: {
          product: "marriage_assessment"
        }
      });

      res.status(200).json({
        clientSecret: paymentIntent.client_secret,
        amount: amount / 100 // Convert back to dollars for display
      });
    } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ 
        error: "Failed to create payment intent" 
      });
    }
  });

  // Verify promo code validity
  app.post('/api/verify-promo-code', async (req, res) => {
    try {
      const { promoCode } = req.body;
      
      // Valid promo codes (in a real app, these would be stored in a database)
      const validPromoCodes = ["FREE100", "LA2025", "MARRIAGE100"];
      
      // Check if the promo code is valid
      const isValid = validPromoCodes.includes(promoCode);
      
      res.status(200).json({ 
        valid: isValid,
        message: isValid ? "Promo code applied successfully" : "Invalid promo code"
      });
    } catch (error) {
      console.error("Error verifying promo code:", error);
      res.status(500).json({ 
        valid: false, 
        message: "Failed to verify promo code" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
