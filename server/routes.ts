import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

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
      
      // Store assessment result in storage
      await storage.saveAssessment({
        email: validatedData.to,
        name: validatedData.data.name,
        scores: validatedData.data.scores,
        profile: validatedData.data.profile,
        responses: validatedData.data.responses,
        demographics: validatedData.data.demographics,
        timestamp: new Date().toISOString()
      });
      
      // In a real application, we would send an actual email here
      // For this implementation, we'll simulate sending an email
      console.log(`Email report would be sent to ${validatedData.to} with CC to ${validatedData.cc}`);
      
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

  const httpServer = createServer(app);
  return httpServer;
}
