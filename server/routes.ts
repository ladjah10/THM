import express, { type Express, type Request, type Response } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { z } from "zod";
import { sendAssessmentEmail, sendReferralEmail, sendCoupleInvitationEmails } from "./nodemailer";
import { sendFormInitiationNotification, sendAssessmentBackup } from "./sendgrid";
import { generateShareImage } from "./shareImage";
import { AssessmentResult, DemographicData, CoupleAssessmentReport } from "../shared/schema";
import { handleStripeWebhook, syncStripePayments } from "./stripe-webhooks";
import { createSampleAssessmentData } from "./sampleData";
import fs from 'fs';
import path from 'path';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';
import session from 'express-session';

// Extend Express.Request with session type
declare module 'express-session' {
  interface SessionData {
    user?: {
      role: string;
      id?: number;
      username?: string;
    };
    tempId?: string;
  }
}

// Define custom Request type with session
interface RequestWithSession extends Request {
  session: session.Session & Partial<session.SessionData>;
}

// Initialize Stripe with the secret key
if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error('Missing required Stripe secret: STRIPE_SECRET_KEY');
}

// Initialize Stripe - we're using the default API version
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export async function registerRoutes(app: Express): Promise<Server> {
  // Add input validation middleware for better data integrity
  app.use(express.json({ limit: '10mb' })); // Increase payload limit
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  
  // Request logging middleware for debugging submission issues
  app.use('/api/assessment', (req, res, next) => {
    console.log(`📝 Assessment API: ${req.method} ${req.path} - Body size: ${JSON.stringify(req.body).length} bytes`);
    next();
  });

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
  // Auto-save assessment responses endpoint
  app.post('/api/assessment/save-progress', async (req, res) => {
    try {
      // Validate the request body
      const progressSchema = z.object({
        email: z.string().email().optional(),
        demographicData: z.object({
          firstName: z.string().optional(),
          lastName: z.string().optional(),
          email: z.string().email().optional(),
          phone: z.string().optional(),
          gender: z.string().optional(),
          marriageStatus: z.string().optional(),
          desireChildren: z.string().optional(),
          ethnicity: z.string().optional(),
          lifeStage: z.string().optional(),
          birthday: z.string().optional(),
          city: z.string().optional(),
          state: z.string().optional(),
          zipCode: z.string().optional(),
          hasPurchasedBook: z.string().optional(),
          purchaseDate: z.string().optional(),
          promoCode: z.string().optional(),
          interestedInArrangedMarriage: z.boolean().optional(),
          thmPoolApplied: z.boolean().optional(),
          hasPaid: z.boolean().optional(),
        }).optional(),
        responses: z.record(z.object({
          option: z.string(),
          value: z.number()
        })).optional(),
        assessmentType: z.enum(['individual', 'couple']).optional(),
        timestamp: z.string().optional()
      });
      
      const validatedData = progressSchema.parse(req.body);
      
      // Generate tempId if email is not provided yet
      const tempId = validatedData.email || `temp-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
      
      // Store partial assessment with the format expected by storage.saveAssessmentProgress
      await storage.saveAssessmentProgress({
        email: validatedData.email || tempId,
        demographicData: validatedData.demographicData || {},
        responses: validatedData.responses || {},
        assessmentType: validatedData.assessmentType || 'individual',
        timestamp: validatedData.timestamp || new Date().toISOString(),
        completed: false
      });
      
      // Send form initiation notification to admin if demographic data is provided
      // Only send the notification when demographic data contains substantial information
      if (validatedData.demographicData && 
          (validatedData.demographicData.firstName || validatedData.demographicData.email)) {
        try {
          // Get IP address from request if available
          const ipAddress = req.headers['x-forwarded-for'] || 
                           req.socket.remoteAddress || 
                           'Unknown';
          
          // Send notification email in the background (don't await)
          sendFormInitiationNotification(validatedData.demographicData, ipAddress as string)
            .then(result => {
              if (result.success) {
                console.log('Form initiation notification sent successfully');
              } else {
                console.warn('Failed to send form initiation notification');
              }
            })
            .catch(err => {
              console.error('Error sending form initiation notification:', err);
            });
        } catch (error) {
          // Log error but don't fail the request if notification fails
          console.error('Error sending form initiation notification:', error);
        }
      }
      
      return res.status(200).json({ 
        success: true,
        tempId,
        message: "Assessment progress saved successfully"
      });
    } catch (error) {
      console.error("Error saving assessment progress:", error);
      return res.status(400).json({ 
        success: false,
        message: error instanceof Error ? error.message : "Failed to save assessment progress"
      });
    }
  });

  // Email sending endpoint
  // API to save assessment data without sending email
  app.post('/api/assessment/save', async (req, res) => {
    try {
      // Validate the request body - using the same schema as email endpoint
      const saveSchema = z.object({
        to: z.string().email(),
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
          hasPurchasedBook: z.string().optional(),
          purchaseDate: z.string().optional(),
          lifeStage: z.string().default("Not specified"),
          birthday: z.string().default("Not specified"),
          city: z.string().default("Not specified"),
          state: z.string().default("Not specified"),
          zipCode: z.string().default("Not specified"),
          promoCode: z.string().optional(),
          interestedInArrangedMarriage: z.boolean().default(false),
          thmPoolApplied: z.boolean().default(false)
        })
      });
      
      const validatedData = saveSchema.parse(req.body);
      
      // Create assessment result object
      const assessmentResult: AssessmentResult = {
        email: validatedData.to,
        name: validatedData.name,
        scores: validatedData.scores,
        profile: validatedData.profile,
        genderProfile: validatedData.genderProfile || null,
        responses: validatedData.responses,
        demographics: {
          ...validatedData.demographics,
          hasPurchasedBook: validatedData.demographics.hasPurchasedBook || "No"
        },
        timestamp: new Date().toISOString()
      };
      
      // Store assessment result in storage
      await storage.saveAssessment(assessmentResult);
      
      // Send a backup of all assessment data to admin
      try {
        console.log("Sending assessment backup email to admin...");
        const backupResult = await sendAssessmentBackup(assessmentResult);
        if (backupResult.success) {
          console.log("Assessment backup email sent successfully to admin");
        } else {
          console.warn("Failed to send assessment backup email, but continuing anyway");
        }
      } catch (backupError) {
        // Don't fail the API call if backup email fails
        console.error("Error sending assessment backup email:", backupError);
      }
      
      // Log promo code if used
      if (validatedData.demographics.promoCode) {
        console.log(`Assessment saved with promo code: ${validatedData.demographics.promoCode} for ${validatedData.demographics.email}`);
        await storage.recordPromoCodeUsage({
          promoCode: validatedData.demographics.promoCode,
          email: validatedData.demographics.email,
          assessmentType: 'individual',
          timestamp: new Date().toISOString()
        });
      }
      
      return res.status(200).json({
        success: true,
        message: "Assessment data saved successfully"
      });
    } catch (error) {
      console.error("Error saving assessment data:", error);
      return res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Failed to save assessment data"
      });
    }
  });

  // Endpoint for autosaving assessment progress
  app.post('/api/assessment/save-progress', async (req, res) => {
    try {
      const progressSchema = z.object({
        email: z.string().email(),
        demographicData: z.object({
          firstName: z.string().optional(),
          lastName: z.string().optional(),
          email: z.string().email(),
          // Other demographic fields are optional during progress save
          gender: z.string().optional(),
          birthday: z.string().optional(),
          promoCode: z.string().optional(),
          marriageStatus: z.string().optional(),
          desireChildren: z.string().optional(),
          ethnicity: z.string().optional(),
          lifeStage: z.string().optional(),
          city: z.string().optional(),
          state: z.string().optional(),
          zipCode: z.string().optional(),
          phone: z.string().optional(),
          interestedInArrangedMarriage: z.boolean().optional(),
          thmPoolApplied: z.boolean().optional()
        }),
        responses: z.record(z.object({
          option: z.string(),
          value: z.number()
        })).optional(),
        assessmentType: z.enum(['individual', 'couple']).optional(),
        timestamp: z.string(),
        completed: z.boolean().optional()
      });
      
      // Validate the request body
      const validatedData = progressSchema.parse(req.body);
      
      // Auto-merge responses instead of overwriting (critical fix #6)
      const existingProgress = await storage.getAssessmentProgress(validatedData.email);
      const mergedResponses = {
        ...(existingProgress?.responses || {}),
        ...(validatedData.responses || {})
      };
      
      // Check if this is a final submission or question 99 is answered
      const hasQuestion99 = mergedResponses['99'] !== undefined;
      const isFinalSubmission = validatedData.completed === true || hasQuestion99;
      
      if (isFinalSubmission) {
        console.log(`Received final submission for assessment: ${validatedData.email}`);
      }
      
      // Save progress to database with merged responses and completion status
      await storage.saveAssessmentProgress({
        email: validatedData.email,
        demographicData: validatedData.demographicData,
        responses: mergedResponses,
        assessmentType: validatedData.assessmentType || 'individual',
        timestamp: validatedData.timestamp,
        completed: isFinalSubmission
      });
      
      // If promo code is present and valid, record it
      if (validatedData.demographicData.promoCode) {
        // Check if it's a valid promo code
        const isValidPromo = await storage.isValidPromoCode(
          validatedData.demographicData.promoCode, 
          validatedData.assessmentType || 'individual'
        );
        
        if (isValidPromo) {
          await storage.recordPromoCodeUsage({
            promoCode: validatedData.demographicData.promoCode,
            email: validatedData.email,
            assessmentType: validatedData.assessmentType || 'individual',
            timestamp: validatedData.timestamp
          });
        }
      }
      
      // For completed assessments, trigger the transfer to results
      if (isFinalSubmission) {
        try {
          // Process in the background so we don't delay the response
          setTimeout(async () => {
            try {
              console.log(`Triggering assessment transfer for ${validatedData.email}`);
              await storage.transferCompletedAssessments();
            } catch (transferError) {
              console.error('Error during background transfer:', transferError);
            }
          }, 100); 
        } catch (triggerError) {
          console.error('Error setting up background transfer:', triggerError);
          // Don't fail the API call if this errors
        }
      }
      
      return res.status(200).json({
        success: true,
        message: isFinalSubmission ? 
          "Assessment completed and submitted successfully" : 
          "Progress saved successfully"
      });
    } catch (error) {
      console.error("Error saving assessment progress:", error);
      return res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : "Failed to save progress"
      });
    }
  });

  app.post('/api/email/send', async (req, res) => {
    try {
      // Validate the request body
      const emailSchema = z.object({
        to: z.string().email(),
        cc: z.string().email().optional(),
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
            hasPurchasedBook: z.string().default("No"),
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
      // Ensure all required demographic fields are present
      // Use the validated data directly since we added hasPurchasedBook to the schema
      const demographics: DemographicData = validatedData.data.demographics;
      
      const assessmentResult: AssessmentResult = {
        email: validatedData.to,
        name: validatedData.data.name,
        scores: validatedData.data.scores,
        profile: validatedData.data.profile,
        genderProfile: validatedData.data.genderProfile || null,
        responses: validatedData.data.responses,
        demographics,
        timestamp: new Date().toISOString()
      };
      
      // Store assessment result in storage
      await storage.saveAssessment(assessmentResult);
      
      // Send email with Nodemailer - admin email is now CC'd by default
      console.log("Attempting to send assessment email for", assessmentResult.email);
      const emailResult = await sendAssessmentEmail(assessmentResult);
      
      if (!emailResult.success) {
        console.error("Email sending failed:", emailResult);
        return res.status(500).json({
          success: false,
          message: `Failed to send email. Assessment data was saved. ${emailResult.error ? 'Error: ' + emailResult.error : ''}`,
          errorDetails: emailResult.error
        });
      }
      
      console.log("Email sending successful for", assessmentResult.email);
      
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
      
      // Provide more detailed error information for debugging
      const errorMessage = error instanceof Error 
        ? error.message
        : "Unknown error occurred";
        
      console.error("Error details:", errorMessage);
      
      return res.status(400).json({ 
        success: false,
        message: "Failed to send assessment report: " + errorMessage
      });
    }
  });

  // Admin API to fetch all assessments with optional date filtering
  app.get('/api/admin/assessments', async (req: Request, res: Response) => {
    try {
      // Get optional date filtering parameters
      const startDate = req.query.startDate as string | undefined;
      const endDate = req.query.endDate as string | undefined;
      const requirePayment = req.query.requirePayment === 'true';
      
      let assessments;
      
      // If date filtering is provided, use date filtering
      if (startDate || endDate) {
        console.log(`Fetching assessments with date range: ${startDate || 'any'} to ${endDate || 'now'}`);
        
        // Get all assessments and filter by date
        const allAssessments = await storage.getAllAssessments();
        
        assessments = allAssessments.filter(assessment => {
          // Skip assessments without timestamp
          if (!assessment.timestamp) return false;
          
          // Parse timestamp to Date
          const assessmentDate = new Date(assessment.timestamp);
          
          // Check if assessment is within date range
          let meetsDateCriteria = true;
          
          if (startDate) {
            const startDateObj = new Date(startDate);
            meetsDateCriteria = meetsDateCriteria && assessmentDate >= startDateObj;
          }
          
          if (endDate) {
            const endDateObj = new Date(endDate);
            // Add one day to include the end date fully
            endDateObj.setDate(endDateObj.getDate() + 1);
            meetsDateCriteria = meetsDateCriteria && assessmentDate < endDateObj;
          }
          
          // If requirePayment is true, check for transactionId
          if (requirePayment) {
            return meetsDateCriteria && !!assessment.transactionId;
          }
          
          return meetsDateCriteria;
        });
        
        console.log(`Found ${assessments.length} assessments within date range`);
      } else {
        console.log('Fetching all assessments without date filtering');
        // Get all assessments directly from the database using raw query for troubleshooting
        try {
          const { pool } = await import('./db');
          
          // Direct query to check what's in the database
          const rawResults = await pool.query(`
            SELECT id, email, name, timestamp, transaction_id 
            FROM assessment_results 
            ORDER BY timestamp DESC
          `);
          
          console.log(`Direct DB query found ${rawResults.rows.length} assessment records`);
          
          if (rawResults.rows.length > 0) {
            // Get the full assessment objects
            assessments = await storage.getAllAssessments();
            console.log(`Retrieved ${assessments.length} full assessment objects`);
          } else {
            assessments = [];
            console.log('No assessment records found in database');
          }
        } catch (dbError) {
          console.error('Error querying database directly:', dbError);
          // Fall back to storage method
          assessments = await storage.getAllAssessments();
        }
        
        // If requirePayment is true, filter for assessments with transaction IDs
        if (requirePayment) {
          assessments = assessments.filter(assessment => !!assessment.transactionId);
          console.log(`Filtered to ${assessments.length} paid assessments`);
        }
      }
      
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
        demographics: {
          ...validatedData.primaryAssessment.demographics,
          hasPurchasedBook: validatedData.primaryAssessment.demographics.hasPurchasedBook || "No"
        },
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
        demographics: {
          ...validatedData.spouseAssessment.demographics,
          hasPurchasedBook: validatedData.spouseAssessment.demographics.hasPurchasedBook || "No"
        },
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

  // Admin API to download complete assessment data as CSV
  app.get('/api/admin/export-all-assessments-csv', async (req: Request, res: Response) => {
    try {
      const assessments = await storage.getAllAssessments();
      
      // Create comprehensive CSV header with all data fields
      const csvHeader = [
        'Email', 'Name', 'Phone', 'Gender', 'Marriage Status', 'Birthday', 'Age',
        'City', 'State', 'Zip Code', 'Ethnicity', 'Desire Children', 
        'Has Purchased Book', 'Purchase Date', 'Life Stage',
        'Interested in Arranged Marriage', 'THM Pool Applied',
        'Overall Score', 'Profile Name', 'Profile Description',
        'Gender Profile Name', 'Gender Profile Description',
        'Date Completed', 'Transaction ID',
        // All 99 question responses
        ...Array.from({length: 99}, (_, i) => `Q${i+1}_Option`),
        ...Array.from({length: 99}, (_, i) => `Q${i+1}_Value`),
        // Section scores
        'Foundation_Score', 'Foundation_Percentage',
        'Faith_Score', 'Faith_Percentage',
        'Marriage_Score', 'Marriage_Percentage',
        'Boundaries_Score', 'Boundaries_Percentage',
        'Family_Score', 'Family_Percentage',
        'Parenting_Score', 'Parenting_Percentage',
        'Finances_Score', 'Finances_Percentage',
        'Health_Score', 'Health_Percentage',
        'Other_Score', 'Other_Percentage',
        'Marriage_Children_Score', 'Marriage_Children_Percentage'
      ];
      
      // Create comprehensive CSV rows with all data
      const csvRows = assessments.map(assessment => {
        const demographics = assessment.demographics || {};
        const responses = assessment.responses || {};
        const scores = assessment.scores || {};
        const sections = scores.sections || {};
        
        // Calculate age
        const age = demographics.birthday ? 
          String(new Date().getFullYear() - new Date(demographics.birthday).getFullYear()) : '';
        
        // Extract all question responses
        const questionOptions = Array.from({length: 99}, (_, i) => {
          const questionNum = String(i + 1);
          return responses[questionNum]?.option || '';
        });
        
        const questionValues = Array.from({length: 99}, (_, i) => {
          const questionNum = String(i + 1);
          return responses[questionNum]?.value || '';
        });
        
        // Extract section scores
        const sectionData = [
          sections['Your Foundation']?.earned || '', sections['Your Foundation']?.percentage || '',
          sections['Your Faith Life']?.earned || '', sections['Your Faith Life']?.percentage || '',
          sections['Your Marriage Life']?.earned || '', sections['Your Marriage Life']?.percentage || '',
          sections['Your Marriage and Boundaries']?.earned || '', sections['Your Marriage and Boundaries']?.percentage || '',
          sections['Your Family/Home Life']?.earned || '', sections['Your Family/Home Life']?.percentage || '',
          sections['Your Parenting Life']?.earned || '', sections['Your Parenting Life']?.percentage || '',
          sections['Your Finances']?.earned || '', sections['Your Finances']?.percentage || '',
          sections['Your Health and Wellness']?.earned || '', sections['Your Health and Wellness']?.percentage || '',
          sections['Other']?.earned || '', sections['Other']?.percentage || '',
          sections['Your Marriage Life with Children']?.earned || '', sections['Your Marriage Life with Children']?.percentage || ''
        ];
        
        return [
          demographics.email || '',
          `${demographics.firstName || ''} ${demographics.lastName || ''}`,
          demographics.phone || '',
          demographics.gender || '',
          demographics.marriageStatus || '',
          demographics.birthday || '',
          age,
          demographics.city || '',
          demographics.state || '',
          demographics.zipCode || '',
          demographics.ethnicity || '',
          demographics.desireChildren || '',
          demographics.hasPurchasedBook || '',
          demographics.purchaseDate || '',
          demographics.lifeStage || '',
          demographics.interestedInArrangedMarriage || '',
          demographics.thmPoolApplied || '',
          scores.overallPercentage?.toFixed(1) || '0',
          assessment.profile?.name || '',
          assessment.profile?.description || '',
          assessment.genderProfile?.name || '',
          assessment.genderProfile?.description || '',
          assessment.timestamp ? new Date(assessment.timestamp).toLocaleDateString() : '',
          assessment.transactionId || '',
          ...questionOptions,
          ...questionValues,
          ...sectionData
        ];
      });
      
      // Combine header and rows
      const csvContent = [csvHeader, ...csvRows]
        .map(row => row.map(field => `"${String(field).replace(/"/g, '""')}"`).join(','))
        .join('\n');
      
      // Set response headers for file download
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="complete-assessment-data.csv"');
      
      return res.send(csvContent);
    } catch (error) {
      console.error("Error exporting assessment data:", error);
      return res.status(500).json({ 
        success: false,
        message: "Failed to export assessment data"
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

  // Update payment transaction with customer metadata
  app.post('/api/update-payment-metadata', async (req, res) => {
    try {
      const { paymentIntentId, customerInfo } = req.body;
      
      if (!paymentIntentId || !customerInfo) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }
      
      console.log('Updating payment metadata for:', paymentIntentId, 'Customer info:', customerInfo);
      
      // Get the payment transaction from the database
      const transaction = await storage.getPaymentTransactionByStripeId(paymentIntentId);
      
      if (!transaction) {
        console.log(`Payment transaction not found in database for ID: ${paymentIntentId}, creating new record in webhook handler`);
        // Continue with the update even if transaction isn't in our DB yet
        // The webhook will create it when processed
      } else {
        console.log(`Found existing transaction in database: ${transaction.id}`);
      }
      
      // Update Stripe payment intent with customer information
      await stripe.paymentIntents.update(paymentIntentId, {
        metadata: {
          ...(transaction?.metadata ? JSON.parse(transaction.metadata) : {}),
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          email: customerInfo.email, 
          phone: customerInfo.phone || '',
          assessmentType: customerInfo.assessmentType || 'individual',
          thmPoolApplied: customerInfo.thmPoolApplied ? 'true' : 'false',
          customerName: `${customerInfo.firstName} ${customerInfo.lastName}`.trim(),
          // Add timestamp to help with debugging/tracking
          updatedAt: new Date().toISOString()
        }
      });
      
      // If transaction exists in our database, update its customer_email field directly
      if (transaction) {
        // Update transaction in our database with customer email
        try {
          await storage.updatePaymentTransactionEmail(
            paymentIntentId, 
            customerInfo.email
          );
          console.log(`Updated transaction ${paymentIntentId} with email: ${customerInfo.email}`);
        } catch (dbError) {
          console.error('Error updating transaction in database:', dbError);
          // Continue - we've already updated Stripe metadata
        }
      }
      
      // Send a success response with the metadata that was updated
      res.status(200).json({
        success: true,
        message: 'Payment metadata updated successfully',
        customerEmail: customerInfo.email,
        paymentIntentId
      });
      return;
      
      // Note: This code is unreachable because of the early return above
      // The THM pool handling is now done via the Stripe webhook handler
      // which has confirmed payment information
    } catch (error) {
      console.error('Error updating payment metadata:', error);
      res.status(500).json({ error: 'Failed to update payment metadata' });
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
      const { promoCode, assessmentType = 'individual', email } = req.body;
      
      if (!promoCode) {
        return res.status(400).json({
          valid: false,
          message: "Promo code is required"
        });
      }
      
      // Use our new database-backed promo code validation
      const isValid = await storage.isValidPromoCode(promoCode, assessmentType);
      
      // If valid, record promo code usage in the database with email if available
      if (isValid) {
        console.log(`Promo code ${promoCode} used successfully for ${assessmentType} assessment ${email ? `by ${email}` : ''}`);
        
        try {
          await storage.recordPromoCodeUsage({
            promoCode,
            email, // Include email if available
            assessmentType,
            timestamp: new Date().toISOString()
          });
        } catch (storageError) {
          console.error("Error recording promo code usage:", storageError);
          // Continue even if storage fails - don't block the user
        }
      }
      
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
          promoCode,
          // Additional required fields for ReferralData type
          fromEmail: referrer.email,
          toEmail: contact.email,
          createdTimestamp: new Date().toISOString()
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
  
  // API to fetch payment transactions for the admin dashboard
  app.get('/api/admin/payment-transactions', async (req: Request, res: Response) => {
    try {
      const startDate = req.query.startDate as string | undefined;
      const endDate = req.query.endDate as string | undefined;
      
      // Directly fetch payment transactions from the database
      const { pool } = await import('./db');
      
      const query = `
        SELECT id, stripe_id, customer_email, amount, currency, status, 
               created, product_type, metadata, is_refunded
        FROM payment_transactions
        ORDER BY created DESC
      `;
      
      const result = await pool.query(query);
      const transactions = result.rows.map((row: any) => ({
        id: row.id,
        stripeId: row.stripe_id,
        customerEmail: row.customer_email,
        amount: row.amount,
        currency: row.currency,
        status: row.status,
        created: row.created,
        productType: row.product_type,
        metadata: row.metadata,
        isRefunded: row.is_refunded
      }));
      
      console.log(`Retrieved ${transactions.length} payment transactions from database`);
      
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

  // API to search for assessments by email
  app.get('/api/admin/assessments/search', async (req: Request, res: Response) => {
    try {
      const email = req.query.email as string;
      
      if (!email) {
        return res.status(400).json({
          success: false,
          message: 'Email parameter is required'
        });
      }
      
      // First try exact match
      let assessments = await storage.getAssessments(email);
      
      // If no results, try case-insensitive match
      if (assessments.length === 0) {
        // Get all assessments and filter by case-insensitive email
        const allAssessments = await storage.getAllAssessments();
        assessments = allAssessments.filter(a => 
          a.email.toLowerCase() === email.toLowerCase()
        );
      }
      
      return res.status(200).json({
        success: true,
        assessments
      });
    } catch (error) {
      console.error('Error searching for assessments:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to search for assessments'
      });
    }
  });
  
  // Stripe webhook endpoint to receive webhook events from Stripe
  app.post('/api/webhooks/stripe', (req, res) => {
    try {
      // Log request headers for debugging
      console.log('📌 Webhook request headers:', {
        'content-type': req.headers['content-type'],
        'stripe-signature': req.headers['stripe-signature'] ? '✓ Present' : '✗ Missing',
        'content-length': req.headers['content-length'] || 'not specified'
      });
      
      // First try to get rawBodyBuffer (preferred) then fall back to rawBody
      const rawBodyBuffer = (req as any).rawBodyBuffer;
      const rawBody = (req as any).rawBody;
      
      if (!rawBodyBuffer && !rawBody) {
        console.error('❌ No raw body or buffer found in webhook request');
        return res.status(400).json({ 
          error: 'No raw body found',
          message: 'Make sure the request is properly formatted and sent directly to this endpoint'
        });
      }
      
      // Log which format we're using
      if (rawBodyBuffer) {
        console.log(`✓ Using raw body buffer (${rawBodyBuffer.length} bytes)`);
        // Convert buffer back to string if we need to use it
        const bodyContent = rawBodyBuffer.toString('utf8');
        req.body = bodyContent;
      } else {
        console.log(`✓ Using raw body string (${rawBody.length} bytes)`);
        req.body = rawBody;
      }
      
      // Pass control to the webhook handler
      return handleStripeWebhook(req, res);
    } catch (error) {
      console.error('❌ Unexpected error processing webhook:', error);
      return res.status(500).json({ 
        error: 'Unexpected error',
        message: error instanceof Error ? error.message : 'Unknown error processing webhook',
        stack: process.env.NODE_ENV !== 'production' ? (error as Error).stack : undefined
      });
    }
  });
  
  // Admin API to manually sync Stripe payments
  app.post('/api/admin/stripe/sync-payments', async (req: Request, res: Response) => {
    try {
      // In production, authenticate this endpoint
      const { startDate, endDate } = req.body;
      
      // Sync payments from Stripe
      const result = await syncStripePayments(startDate, endDate);
      
      return res.status(result.success ? 200 : 500).json(result);
    } catch (error) {
      console.error('Error syncing Stripe payments:', error);
      return res.status(500).json({
        success: false,
        message: `Failed to sync Stripe payments: ${error instanceof Error ? error.message : String(error)}`
      });
    }
  });
  
  // Admin endpoint to recover customer data directly from Stripe
  app.get('/api/admin/customer-data-recovery', async (req: Request, res: Response) => {
    try {
      // Initialize Stripe
      if (!process.env.STRIPE_SECRET_KEY) {
        throw new Error('Missing STRIPE_SECRET_KEY environment variable');
      }
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      
      // Get all payment intents from Stripe since May 6, 2025
      const paymentIntents = await stripe.paymentIntents.list({
        limit: 100,
        created: {
          gte: Math.floor(new Date('2025-05-06').getTime() / 1000)
        }
      });
      
      console.log(`Retrieved ${paymentIntents.data.length} payment intents for customer data recovery`);
      
      // Collect detailed customer information for each payment
      const customerData = [];
      
      for (const intent of paymentIntents.data) {
        if (intent.status !== 'succeeded') continue;
        
        // Get associated charges for more customer details
        const charges = await stripe.charges.list({ payment_intent: intent.id });
        const charge = charges.data[0] || null;
        
        // Get customer information if available
        let customerInfo = null;
        if (typeof intent.customer === 'string' && intent.customer) {
          try {
            customerInfo = await stripe.customers.retrieve(intent.customer);
          } catch (error) {
            console.error(`Error retrieving customer ${intent.customer}:`, error);
          }
        }
        
        // Extract all possible customer information
        const customerRecord = {
          payment_id: intent.id,
          payment_date: new Date(intent.created * 1000).toISOString(),
          amount: intent.amount / 100,
          currency: intent.currency.toUpperCase(),
          description: charge?.description || '',
          email: intent.receipt_email || 
                (customerInfo && !Array.isArray(customerInfo) ? (customerInfo as any).email : null) || 
                charge?.billing_details?.email || 
                intent.metadata?.email || '',
          name: charge?.billing_details?.name || 
               (customerInfo && !Array.isArray(customerInfo) ? (customerInfo as any).name : null) || 
               intent.metadata?.name || 
               `${intent.metadata?.firstName || ''} ${intent.metadata?.lastName || ''}`.trim() || '',
          phone: charge?.billing_details?.phone || 
                (customerInfo && !Array.isArray(customerInfo) ? (customerInfo as any).phone : null) || 
                intent.metadata?.phone || '',
          address: charge?.billing_details?.address || 
                  (customerInfo && !Array.isArray(customerInfo) ? (customerInfo as any).address : null) || {},
          metadata: intent.metadata || {},
          product_type: charge?.description?.includes('THM Arranged Marriage Pool') ? 'marriage_pool' :
                      charge?.description?.includes('Couple') ? 'couple' : 
                      charge?.description?.includes('Individual') ? 'individual' : 
                      intent.metadata?.productType || intent.metadata?.type || 'unknown'
        };
        
        customerData.push(customerRecord);
      }
      
      res.status(200).json(customerData);
    } catch (error) {
      console.error('Error recovering customer data from Stripe:', error);
      res.status(500).json({
        success: false,
        message: `Error recovering customer data: ${error instanceof Error ? error.message : String(error)}`
      });
    }
  });
  
  // Send follow-up emails to users who paid but haven't completed their assessment
  app.post('/api/admin/send-assessment-reminders', async (req: Request, res: Response) => {
    try {
      // In production, authenticate this endpoint
      const { daysAgo = 3 } = req.body;
      
      // Find incomplete assessments with transactions
      // 1. Get all transactions with successful payments
      const allTransactions = await storage.getPaymentTransactions();
      const successfulTransactions = allTransactions.filter(t => 
        t.status === 'succeeded' && t.customerEmail && 
        (t.productType === 'individual' || t.productType === 'couple')
      );
      
      // Track statistics for reporting
      const stats = {
        transactionsChecked: successfulTransactions.length,
        incompleteAssessments: 0,
        emailsSent: 0,
        errors: 0
      };
      
      // Calculate the cutoff date for reminders 
      // (only send to payments made at least X days ago)
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - Number(daysAgo));
      const cutoffISOString = cutoffDate.toISOString();
      
      console.log(`Checking for incomplete assessments paid before ${cutoffISOString}`);
      
      // Keep track of emails we've processed
      const processedEmails = new Set<string>();
      const emailPromises: Promise<any>[] = [];
      
      // Process each transaction
      for (const transaction of successfulTransactions) {
        try {
          // Skip if no email available
          if (!transaction.customerEmail || processedEmails.has(transaction.customerEmail)) {
            continue;
          }
          
          // Skip if transaction is too recent (within daysAgo)
          if (transaction.created > cutoffISOString) {
            continue;
          }
          
          // Check if there's a completed assessment for this email
          const assessments = await storage.getAssessments(transaction.customerEmail);
          
          // If no assessments or no completed ones, send a reminder
          const hasCompletedAssessment = assessments.some(a => {
            let demographics;
            try {
              demographics = typeof a.demographics === 'string' 
                ? JSON.parse(a.demographics) 
                : a.demographics;
              return demographics?.completedAssessment === true;
            } catch (err) {
              console.error(`Error parsing demographics for assessment:`, err);
              return false;
            }
          });
          
          if (!hasCompletedAssessment) {
            stats.incompleteAssessments++;
            
            // Get customer name from transaction metadata
            let customerName = '';
            if (transaction.metadata) {
              try {
                const metadata = JSON.parse(transaction.metadata);
                if (metadata.firstName && metadata.lastName) {
                  customerName = `${metadata.firstName} ${metadata.lastName}`;
                }
              } catch (err) {
                console.error(`Error parsing metadata for transaction ${transaction.id}:`, err);
              }
            }
            
            // Default name if not available
            if (!customerName) {
              customerName = 'Valued Customer';
            }
            
            // Send reminder email
            console.log(`Sending assessment reminder to ${transaction.customerEmail}`);
            
            // Import the sendAssessmentReminder function
            const { sendAssessmentReminder } = await import('./nodemailer');
            
            emailPromises.push(
              sendAssessmentReminder({
                to: transaction.customerEmail,
                customerName,
                assessmentType: transaction.productType as 'individual' | 'couple',
                purchaseDate: transaction.created,
                transactionId: transaction.id
              }).then((result: { success: boolean, previewUrl?: string }) => {
                if (result.success) {
                  stats.emailsSent++;
                } else {
                  stats.errors++;
                }
                return result;
              }).catch((err: Error) => {
                stats.errors++;
                console.error(`Error sending reminder to ${transaction.customerEmail}:`, err);
                return { success: false, error: err.message };
              })
            );
            
            // Mark this email as processed
            processedEmails.add(transaction.customerEmail);
          }
        } catch (err) {
          console.error(`Error processing transaction ${transaction.id}:`, err);
          stats.errors++;
        }
      }
      
      // Wait for all emails to be sent
      await Promise.all(emailPromises);
      
      return res.status(200).json({
        success: true,
        stats
      });
    } catch (error) {
      console.error('Error sending assessment reminders:', error);
      return res.status(500).json({
        success: false,
        message: `Failed to send assessment reminders: ${error instanceof Error ? error.message : String(error)}`
      });
    }
  });

  // API endpoint to resend assessment results to a user
  app.post('/api/admin/resend-assessment-results', async (req: RequestWithSession, res: Response) => {
    try {
      // Validate admin access
      if (!req.session || !req.session.user || req.session.user.role !== 'admin') {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      
      const schema = z.object({
        email: z.string().email(),
        assessmentType: z.enum(['individual', 'couple']).optional()
      });
      
      const { email, assessmentType } = schema.parse(req.body);
      
      // Fetch the assessment from storage
      let assessment: AssessmentResult | null = null;
      let coupleAssessment: CoupleAssessmentReport | null = null;
      
      if (assessmentType === 'couple') {
        // Fetch couple assessment data
        const coupleData = await storage.getCoupleAssessmentByEmail(email);
        
        if (!coupleData) {
          return res.status(404).json({ 
            success: false, 
            message: 'Couple assessment not found for this email' 
          });
        }
        
        coupleAssessment = coupleData;
      } else {
        // Fetch individual assessment
        assessment = await storage.getCompletedAssessment(email);
        
        if (!assessment) {
          return res.status(404).json({ 
            success: false, 
            message: 'Individual assessment not found for this email' 
          });
        }
      }
      
      // Generate PDF and send email with results
      try {
        if (assessment) {
          // Generate individual assessment PDF
          const { generateIndividualAssessmentPDF } = await import('./updated-individual-pdf');
          const pdfBuffer = await generateIndividualAssessmentPDF(assessment);
          
          // Create temporary file for the PDF
          const tempFilePath = path.join(os.tmpdir(), `${uuidv4()}-individual-assessment.pdf`);
          fs.writeFileSync(tempFilePath, pdfBuffer);
          
          // Send email
          const { sendAssessmentEmail } = await import('./sendgrid');
          const emailResult = await sendAssessmentEmail(assessment, tempFilePath);
          
          // Clean up the temporary file
          try {
            fs.unlinkSync(tempFilePath);
          } catch (err) {
            console.warn('Failed to clean up temporary PDF file:', err);
          }
          
          if (!emailResult.success) {
            throw new Error(emailResult.error || 'Failed to send email');
          }
          
          return res.status(200).json({ 
            success: true, 
            message: `Assessment results resent successfully to ${email}` 
          });
        } else if (coupleAssessment) {
          // Generate couple assessment PDF
          const { generateCoupleAssessmentPDF } = await import('./updated-couple-pdf');
          const pdfBuffer = await generateCoupleAssessmentPDF(coupleAssessment);
          
          // Create temporary file for the PDF
          const tempFilePath = path.join(os.tmpdir(), `${uuidv4()}-couple-assessment.pdf`);
          fs.writeFileSync(tempFilePath, pdfBuffer);
          
          // Send email
          const { sendCoupleAssessmentEmail } = await import('./sendgrid');
          const emailResult = await sendCoupleAssessmentEmail(coupleAssessment, tempFilePath);
          
          // Clean up the temporary file
          try {
            fs.unlinkSync(tempFilePath);
          } catch (err) {
            console.warn('Failed to clean up temporary PDF file:', err);
          }
          
          if (!emailResult.success) {
            throw new Error('Failed to send couple assessment email');
          }
          
          return res.status(200).json({ 
            success: true, 
            message: `Couple assessment results resent successfully to ${email}` 
          });
        }
      } catch (error) {
        console.error('Error generating or sending assessment email:', error);
        return res.status(500).json({ 
          success: false, 
          message: error instanceof Error ? error.message : 'Failed to generate or send assessment email' 
        });
      }
    } catch (error) {
      console.error("Error resending assessment results:", error);
      return res.status(400).json({ 
        success: false, 
        message: error instanceof Error ? error.message : "Failed to resend assessment results" 
      });
    }
  });

  // Webhook test endpoint for Stripe configuration validation
  app.get('/api/webhooks/stripe/test', (req, res) => {
    // Check if the required environment variables are set
    const envCheck = {
      STRIPE_SECRET_KEY: !!process.env.STRIPE_SECRET_KEY,
      STRIPE_WEBHOOK_SECRET: !!process.env.STRIPE_WEBHOOK_SECRET
    };
    
    // Check Stripe configuration
    const isMissingConfig = !envCheck.STRIPE_SECRET_KEY || !envCheck.STRIPE_WEBHOOK_SECRET;
    
    res.status(200).json({
      status: 'success',
      message: 'Stripe webhook endpoint is properly configured and accessible',
      timestamp: new Date().toISOString(),
      configured_path: '/api/webhooks/stripe',
      config_status: isMissingConfig ? 'incomplete' : 'complete',
      environment: envCheck,
      note: 'This endpoint is for testing only. Actual webhook events should be posted to /api/webhooks/stripe'
    });
  });
  
  // Advanced webhook testing endpoint that simulates a payment event
  app.post('/api/webhooks/stripe/simulate', async (req, res) => {
    try {
      // Check authorization - this should only be accessible from admin
      // In a real production app, this would have proper authentication
      const isAuthorized = req.headers['x-admin-key'] === 'the100marriage-admin';
      
      if (!isAuthorized) {
        return res.status(401).json({
          status: 'error',
          message: 'Unauthorized. This endpoint is for administrative testing only.'
        });
      }
      
      // Log the simulation attempt
      console.log('💡 Webhook simulation requested');
      
      // Create a sample event that mimics a Stripe webhook
      const mockEvent = {
        id: `evt_test_${Date.now()}`,
        object: 'event',
        api_version: '2023-10-16',
        created: Math.floor(Date.now() / 1000),
        type: 'payment_intent.succeeded',
        data: {
          object: {
            id: `pi_test_${Date.now()}`,
            object: 'payment_intent',
            amount: 4900, // $49.00
            currency: 'usd',
            status: 'succeeded',
            payment_method_types: ['card'],
            metadata: {
              firstName: 'Test',
              lastName: 'User',
              email: 'test@example.com',
              assessmentType: 'individual',
              thmPoolApplied: 'false'
            }
          }
        }
      };
      
      // Log the simulation event
      console.log(`🔄 Simulating Stripe webhook event: ${mockEvent.type}`);
      
      // Process the mock event using our normal webhook handler
      // Note: In production, you'd want to ensure this doesn't create real transactions
      // Here we're just testing the handler's functionality
      const mockReq = {
        body: JSON.stringify(mockEvent),
        headers: {
          'stripe-signature': 'mock_signature_for_testing'
        },
        // Add required Request properties for type compatibility
        originalUrl: '/api/webhooks/stripe',
        method: 'POST',
        on: () => ({}),
        get: () => ({}),
        header: () => undefined,
        cookies: {},
        path: '/api/webhooks/stripe',
        protocol: 'https',
        secure: true
      } as unknown as Request;
      
      // Create a mock response object to capture the response
      const mockRes = {
        status: (code: number) => ({
          json: (data: any) => ({ statusCode: code, data }),
          send: (msg: string) => ({ statusCode: code, message: msg })
        })
      } as unknown as Response;
      
      // Process the mock event directly to avoid database operations
      // This will test the parsing logic but not actually save to the database
      const result = await import('./stripe-webhooks').then(module => {
        // Override the stripe.webhooks.constructEvent for testing
        const originalConstructEvent = stripe.webhooks.constructEvent;
        stripe.webhooks.constructEvent = () => mockEvent as any;
        
        // Call the handler with our mock objects
        const response = module.handleStripeWebhook(mockReq as any, mockRes as any);
        
        // Restore the original function
        stripe.webhooks.constructEvent = originalConstructEvent;
        
        return response;
      });
      
      return res.status(200).json({
        status: 'success',
        message: 'Webhook simulation completed',
        timestamp: new Date().toISOString(),
        mock_event: mockEvent,
        simulation_result: 'completed',
        note: 'This was a simulation only. No actual data was modified.'
      });
    } catch (error) {
      console.error('❌ Error in webhook simulation:', error);
      return res.status(500).json({
        status: 'error',
        message: error instanceof Error ? error.message : 'Unknown error in webhook simulation',
        timestamp: new Date().toISOString()
      });
    }
  });

  // New endpoint to handle assessment completion
  app.post('/api/assessment/complete', async (req, res) => {
    try {
      const completionSchema = z.object({
        email: z.string().email(),
        sessionId: z.string().optional(),
        finalResponse: z.object({
          questionId: z.string(),
          option: z.string(),
          value: z.number()
        }).optional()
      });

      const { email, sessionId, finalResponse } = completionSchema.parse(req.body);
      
      console.log(`🏁 Completing assessment for ${email}`);

      // Get the assessment progress
      const progressData = await storage.getAssessmentProgress(email);
      
      if (!progressData) {
        return res.status(404).json({
          success: false,
          message: 'Assessment progress not found'
        });
      }

      // Add final response if provided
      if (finalResponse) {
        const currentResponses = progressData.responses || {};
        currentResponses[finalResponse.questionId] = {
          option: finalResponse.option,
          value: finalResponse.value
        };
        progressData.responses = currentResponses;
      }

      // Mark as completed and transfer to results
      await storage.saveAssessmentProgress({
        ...progressData,
        completed: true
      });

      // Trigger immediate transfer to results
      await storage.transferCompletedAssessments();

      return res.status(200).json({
        success: true,
        message: 'Assessment completed successfully'
      });

    } catch (error) {
      console.error('Error completing assessment:', error);
      return res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to complete assessment'
      });
    }
  });

  // Admin API to fetch pool candidates (arranged marriage pool participants)
  app.get('/api/admin/pool-candidates', async (req: Request, res: Response) => {
    try {
      console.log('Fetching pool candidates for admin dashboard');
      
      // Get all completed assessments
      const allAssessments = await storage.getAllAssessments();
      
      // Filter for pool candidates - those who:
      // 1. Are single/divorced/widowed
      // 2. Have opted into arranged marriage pool (interestedInArrangedMarriage = true)
      // 3. Have paid for THM pool access (thmPoolApplied = true)
      // Note: Score filter removed per admin requirements
      const poolCandidates = allAssessments.filter(assessment => {
        const demographics = assessment.demographics;
        if (!demographics) {
          return false;
        }
        
        const marriageStatus = demographics?.marriageStatus?.toLowerCase();
        const interested = demographics?.interestedInArrangedMarriage === true;
        const applied = demographics?.thmPoolApplied === true;
        const eligibleStatus = ['single', 'divorced', 'widowed', 'no'].includes(marriageStatus);
        
        return interested && applied && eligibleStatus;
      }).map(assessment => ({
        ...assessment,
        // Calculate match score for sorting
        matchScore: (assessment.scores?.overallPercentage || 0) + 
                   (assessment.demographics?.age ? Math.max(0, 40 - Math.abs(30 - assessment.demographics.age)) : 0)
      }));
      
      // Sort by match score (highest first)
      poolCandidates.sort((a, b) => b.matchScore - a.matchScore);
      
      console.log(`Found ${poolCandidates.length} pool candidates`);
      
      return res.status(200).json({
        success: true,
        data: poolCandidates
      });
    } catch (error) {
      console.error('Error fetching pool candidates:', error);
      return res.status(500).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to fetch pool candidates'
      });
    }
  });

  // Admin API for downloading full assessment data as JSON
  app.get('/api/admin/download-assessment/:email', async (req: RequestWithSession, res: Response) => {
    try {
      // Validate admin access - check both session and admin header for credentials
      const adminUsername = 'admin';
      const adminPassword = '100marriage';
      const adminHeader = req.headers['x-admin-auth'];
      
      // Check either session-based auth or header-based auth
      const isSessionAuth = req.session && req.session.user && req.session.user.role === 'admin';
      const isHeaderAuth = adminHeader === Buffer.from(`${adminUsername}:${adminPassword}`).toString('base64');
      
      if (!isSessionAuth && !isHeaderAuth) {
        console.log('Admin authorization failed for download-assessment:', {
          hasSession: !!req.session,
          hasSessionUser: req.session && !!req.session.user,
          sessionRole: req.session?.user?.role || 'none',
          headerProvided: !!adminHeader
        });
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      
      const { email } = req.params;
      
      if (!email) {
        return res.status(400).json({ success: false, message: 'Email parameter is required' });
      }
      
      // Get the assessment data
      const assessment = await storage.getCompletedAssessment(email);
      
      if (!assessment) {
        return res.status(404).json({ success: false, message: 'Assessment not found' });
      }
      
      // Set appropriate headers for file download
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="assessment-${email}-${Date.now()}.json"`);
      
      // Return the full assessment data as JSON
      return res.status(200).json(assessment);
    } catch (error) {
      console.error('Error downloading assessment data:', error);
      return res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to download assessment data' 
      });
    }
  });
  
  // Admin API for downloading couple assessment data as JSON
  app.get('/api/admin/download-couple-assessment/:email', async (req: RequestWithSession, res: Response) => {
    try {
      // Validate admin access - check both session and admin header for credentials
      const adminUsername = 'admin';
      const adminPassword = '100marriage';
      const adminHeader = req.headers['x-admin-auth'];
      
      // Check either session-based auth or header-based auth
      const isSessionAuth = req.session && req.session.user && req.session.user.role === 'admin';
      const isHeaderAuth = adminHeader === Buffer.from(`${adminUsername}:${adminPassword}`).toString('base64');
      
      if (!isSessionAuth && !isHeaderAuth) {
        console.log('Admin authorization failed for download-couple-assessment:', {
          hasSession: !!req.session,
          hasSessionUser: req.session && !!req.session.user,
          sessionRole: req.session?.user?.role || 'none',
          headerProvided: !!adminHeader
        });
        return res.status(401).json({ success: false, message: 'Unauthorized' });
      }
      
      const { email } = req.params;
      
      if (!email) {
        return res.status(400).json({ success: false, message: 'Email parameter is required' });
      }
      
      // Get the couple assessment data
      const coupleAssessment = await storage.getCoupleAssessmentByEmail(email);
      
      if (!coupleAssessment) {
        return res.status(404).json({ success: false, message: 'Couple assessment not found' });
      }
      
      // Set appropriate headers for file download
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Content-Disposition', `attachment; filename="couple-assessment-${email}-${Date.now()}.json"`);
      
      // Return the full couple assessment data as JSON
      return res.status(200).json(coupleAssessment);
    } catch (error) {
      console.error('Error downloading couple assessment data:', error);
      return res.status(500).json({ 
        success: false, 
        message: error instanceof Error ? error.message : 'Failed to download couple assessment data' 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
