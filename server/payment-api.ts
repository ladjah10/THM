import { Request, Response } from "express";
import { storage } from "./storage";

// Simple function to check if a user is admin
function isUserAdmin(req: Request): boolean {
  return req.session?.user?.role === 'admin';
}

// Add payment transaction endpoint
export function setupPaymentEndpoint(app: any) {
  app.get('/api/admin/payment-transactions', async (req: Request, res: Response) => {
    try {
      // Check authentication
      if (!req.isAuthenticated || !req.isAuthenticated() || !isUserAdmin(req)) {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized: Admin access required'
        });
      }
      
      console.log('Processing admin payment transactions request');
      
      // Get transactions from the database
      try {
        const transactions = await storage.getTransactions();
        return res.status(200).json(transactions);
      } catch (error) {
        console.error('Database error:', error);
        return res.status(200).json([]);
      }
    } catch (error) {
      console.error('API error:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error processing payment transactions'
      });
    }
  });
}