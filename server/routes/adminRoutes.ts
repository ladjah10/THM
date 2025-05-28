import express, { Request, Response } from "express";
import { validateAdminAuth } from "../utils/auth";
import { storage } from "../storage";

const router = express.Router();

// Admin authentication middleware for all admin routes
router.use((req: any, res: Response, next: any) => {
  if (!validateAdminAuth(req)) {
    return res.status(401).json({ 
      success: false, 
      message: 'Unauthorized: Admin access required' 
    });
  }
  next();
});

// Get all assessments with filtering
router.get('/assessments', async (req: Request, res: Response) => {
  try {
    const startDate = req.query.startDate as string | undefined;
    const endDate = req.query.endDate as string | undefined;
    
    const assessments = await storage.getAllAssessments();
    
    let filteredAssessments = assessments;
    
    if (startDate || endDate) {
      filteredAssessments = assessments.filter(assessment => {
        if (!assessment.timestamp) return false;
        
        const assessmentDate = new Date(assessment.timestamp);
        let meetsDateCriteria = true;
        
        if (startDate) {
          meetsDateCriteria = meetsDateCriteria && assessmentDate >= new Date(startDate);
        }
        
        if (endDate) {
          const endDateObj = new Date(endDate);
          endDateObj.setHours(23, 59, 59, 999);
          meetsDateCriteria = meetsDateCriteria && assessmentDate <= endDateObj;
        }
        
        return meetsDateCriteria;
      });
    }
    
    return res.status(200).json({
      success: true,
      data: filteredAssessments
    });
  } catch (error) {
    console.error('Error fetching assessments:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch assessments'
    });
  }
});

export default router;