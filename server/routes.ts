import express, { type Express, type Request, type Response } from "express";
import { createServer, type Server } from "http";
import Stripe from "stripe";
import { storage } from "./storage";
import { z } from "zod";
import { sendAssessmentEmail, sendReferralEmail, sendCoupleInvitationEmails } from "./nodemailer";
import { sendFormInitiationNotification } from "./sendgrid";
import { generateShareImage } from "./shareImage";
import { AssessmentResult } from "../shared/schema";
import { handleStripeWebhook, syncStripePayments } from "./stripe-webhooks";

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
      
      // Create a minimal assessment result for storing progress
      const minimalAssessment: Partial<AssessmentResult> = {
        email: validatedData.email,
        demographics: validatedData.demographicData,
        responses: validatedData.responses || {},
        timestamp: validatedData.timestamp || new Date().toISOString(),
        isPartial: true // Flag to indicate this is a partial save
      };
      
      // Store partial assessment
      await storage.saveAssessmentProgress(tempId, minimalAssessment);
      
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
        timestamp: z.string()
      });
      
      // Validate the request body
      const validatedData = progressSchema.parse(req.body);
      
      // Save progress to database
      await storage.saveAssessmentProgress({
        email: validatedData.email,
        demographicData: validatedData.demographicData,
        responses: validatedData.responses || {},
        assessmentType: validatedData.assessmentType || 'individual',
        timestamp: validatedData.timestamp,
        completed: false
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
      
      return res.status(200).json({
        success: true,
        message: "Progress saved successfully"
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
        demographics: {
          ...validatedData.data.demographics,
          hasPurchasedBook: validatedData.data.demographics.hasPurchasedBook || "No"
        },
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
        assessments = await storage.getAllAssessments();
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
      
      // Get the payment transaction from the database
      const transaction = await storage.getPaymentTransactionByStripeId(paymentIntentId);
      
      if (!transaction) {
        return res.status(404).json({ error: 'Payment transaction not found' });
      }
      
      // Update transaction with customer information
      await stripe.paymentIntents.update(paymentIntentId, {
        metadata: {
          ...transaction.metadata ? JSON.parse(transaction.metadata) : {},
          firstName: customerInfo.firstName,
          lastName: customerInfo.lastName,
          email: customerInfo.email,
          phone: customerInfo.phone || '',
          assessmentType: customerInfo.assessmentType || 'individual',
          thmPoolApplied: customerInfo.thmPoolApplied ? 'true' : 'false'
        }
      });
      
      // If this was a THM pool application and the transaction doesn't have an email,
      // create a partial assessment record to show in the admin dashboard
      if (customerInfo.thmPoolApplied && (!transaction.customerEmail || transaction.productType === 'marriage_pool')) {
        // Import uuid
        const { v4: uuidv4 } = await import('uuid');
        
        // Create a minimal assessment result with just the THM pool information
        const minimalAssessment: AssessmentResult = {
          email: customerInfo.email,
          name: `${customerInfo.firstName} ${customerInfo.lastName}`,
          scores: {
            overallPercentage: 0,
            totalEarned: 0,
            totalPossible: 0,
            sections: {},
            strengths: [],
            improvementAreas: []
          },
          profile: {
            id: 0,
            name: "THM Pool Applicant",
            description: "Applied to THM Arranged Marriage Pool but has not completed assessment",
            genderSpecific: null,
            criteria: []
          },
          genderProfile: null, // Adding missing required field
          responses: {},
          demographics: {
            firstName: customerInfo.firstName,
            lastName: customerInfo.lastName,
            email: customerInfo.email,
            gender: 'Not specified', // Required field
            birthday: 'Not specified', // Required field
            lifeStage: 'Not specified', // Required field
            marriageStatus: 'Not specified', // Required field
            desireChildren: 'Not specified', // Required field
            ethnicity: 'Not specified', // Required field
            city: 'Not specified', // Required field
            state: 'Not specified', // Required field
            zipCode: 'Not specified', // Required field
            hasPurchasedBook: 'No', // Required field
          },
          timestamp: new Date().toISOString(),
          transactionId: transaction.id,
          reportSent: false
        };
        
        // Check if an assessment already exists for this email
        const existingAssessments = await storage.getAssessments(customerInfo.email);
        
        if (existingAssessments.length === 0) {
          // Only save if there's no existing assessment for this email
          await storage.saveAssessment(minimalAssessment);
          console.log(`Created partial assessment record for THM Pool applicant: ${customerInfo.email}`);
        }
      }
      
      res.status(200).json({ success: true });
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
  
  // API to fetch payment transactions for analytics
  app.get('/api/admin/analytics/payment-transactions', async (req: Request, res: Response) => {
    try {
      const startDate = req.query.startDate as string | undefined;
      const endDate = req.query.endDate as string | undefined;
      const includeAssessmentData = req.query.includeAssessmentData === 'true';
      
      // Choose whether to fetch basic transactions or enhanced ones with assessment data
      const transactions = includeAssessmentData
        ? await storage.getPaymentTransactionsWithAssessments(startDate, endDate)
        : await storage.getPaymentTransactions(startDate, endDate);
      
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
    // Use the raw body we captured in the middleware
    const rawBody = (req as any).rawBody;
    
    if (!rawBody) {
      console.error('No raw body found in webhook request');
      return res.status(400).send('No raw body found');
    }
    
    // Pass the raw body to the webhook handler
    req.body = rawBody;
    return handleStripeWebhook(req, res);
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

  const httpServer = createServer(app);
  return httpServer;
}
