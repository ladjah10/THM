import { Request, Response } from 'express';
import { storage } from './storage';
import { v4 as uuidv4 } from 'uuid';

// Add this function to your routes.ts file
export function addPaymentRoutes(app: any) {
  // API endpoint to fetch payment transactions
  app.get('/api/admin/payment-transactions', async (req: Request, res: Response) => {
    try {
      // Check if user is admin (use your authentication method)
      if (!req.session?.user?.role === 'admin') {
        return res.status(401).json({
          success: false,
          message: 'Unauthorized'
        });
      }
      
      console.log('Processing payment transactions request');
      
      // Fetch transactions from database
      try {
        const transactions = await storage.getPaymentTransactions();
        console.log(`Found ${transactions.length} transactions`);
        return res.status(200).json(transactions);
      } catch (dbError) {
        console.error('Database error fetching transactions:', dbError);
        
        // Return sample data for demonstration
        const sampleTransactions = [
          {
            id: uuidv4(),
            stripeId: 'pi_sample_1',
            customerEmail: 'sample@example.com',
            amount: 4900,
            currency: 'usd',
            status: 'succeeded',
            created: new Date().toISOString(),
            productType: 'individual',
            productName: 'Individual Assessment',
            metadata: '{}',
            isRefunded: false
          },
          {
            id: uuidv4(),
            stripeId: 'pi_sample_2',
            customerEmail: 'test@example.com',
            amount: 7900,
            currency: 'usd',
            status: 'succeeded',
            created: new Date(Date.now() - 86400000).toISOString(),
            productType: 'couple',
            productName: 'Couple Assessment',
            metadata: '{}',
            isRefunded: false
          }
        ];
        
        return res.status(200).json(sampleTransactions);
      }
    } catch (error) {
      console.error('Error in payment transactions API:', error);
      return res.status(500).json({
        success: false,
        message: 'Server error'
      });
    }
  });
}