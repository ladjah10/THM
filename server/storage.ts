import { users, type User, type InsertUser } from "@shared/schema";
import { 
  AssessmentResult, 
  CoupleAssessmentReport, 
  ReferralData, 
  PageView, 
  VisitorSession, 
  AnalyticsSummary,
  PaymentTransaction
} from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveAssessment(assessment: AssessmentResult): Promise<void>;
  getAssessments(email: string): Promise<AssessmentResult[]>;
  getAllAssessments(): Promise<AssessmentResult[]>;
  
  // Couple assessment methods
  saveCoupleAssessment(primaryAssessment: AssessmentResult, spouseEmail: string): Promise<string>; // Returns coupleId
  getSpouseAssessment(coupleId: string, role: 'primary' | 'spouse'): Promise<AssessmentResult | null>;
  getCoupleAssessment(coupleId: string): Promise<CoupleAssessmentReport | null>;
  getAllCoupleAssessments(): Promise<CoupleAssessmentReport[]>;
  
  // Referral methods
  saveReferral(referral: ReferralData): Promise<void>;
  getAllReferrals(): Promise<ReferralData[]>;
  updateReferralStatus(id: string, status: 'sent' | 'completed' | 'expired', completedTimestamp?: string): Promise<void>;
  
  // Analytics methods
  recordPageView(pageView: PageView): Promise<void>;
  createVisitorSession(session: VisitorSession): Promise<void>;
  updateVisitorSession(sessionId: string, endTime: string, pageCount: number): Promise<void>;
  getPageViews(startDate?: string, endDate?: string): Promise<PageView[]>;
  getVisitorSessions(startDate?: string, endDate?: string): Promise<VisitorSession[]>;
  getAnalyticsSummary(period: 'day' | 'week' | 'month' | 'year'): Promise<AnalyticsSummary>;
  
  // Payment transaction methods
  savePaymentTransaction(transaction: PaymentTransaction): Promise<void>;
  getPaymentTransactions(startDate?: string, endDate?: string): Promise<PaymentTransaction[]>;
  getPaymentTransactionByStripeId(stripeId: string): Promise<PaymentTransaction | null>;
  updatePaymentTransactionStatus(stripeId: string, status: string): Promise<void>;
  recordRefund(stripeId: string, amount: number, reason?: string): Promise<void>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private assessments: AssessmentResult[];
  private coupleAssessments: Map<string, CoupleAssessmentReport>;
  private referrals: ReferralData[];
  private pageViews: PageView[] = [];
  private visitorSessions: VisitorSession[] = [];
  private paymentTransactions: PaymentTransaction[] = [];
  currentId: number;

  constructor() {
    this.users = new Map();
    this.assessments = [];
    this.coupleAssessments = new Map();
    this.referrals = [];
    this.pageViews = [];
    this.visitorSessions = [];
    this.paymentTransactions = [];
    this.currentId = 1;
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  async saveAssessment(assessment: AssessmentResult): Promise<void> {
    // If this is an update to an existing assessment, remove the old one first
    if (assessment.email) {
      const existingIndex = this.assessments.findIndex(a => 
        a.email === assessment.email && 
        (!assessment.coupleId || a.coupleId === assessment.coupleId)
      );
      
      if (existingIndex >= 0) {
        this.assessments.splice(existingIndex, 1);
      }
    }
    
    this.assessments.push(assessment);
  }
  
  async getAssessments(email: string): Promise<AssessmentResult[]> {
    return this.assessments.filter(a => a.email === email);
  }
  
  async getAllAssessments(): Promise<AssessmentResult[]> {
    return [...this.assessments];
  }
  
  // Couple assessment methods
  async saveCoupleAssessment(primaryAssessment: AssessmentResult, spouseEmail: string): Promise<string> {
    // Generate a unique coupleId
    const coupleId = `couple_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    
    // Save primary assessment with coupleId
    const primaryWithCoupleId = {
      ...primaryAssessment,
      coupleId,
      coupleRole: 'primary' as const
    };
    
    await this.saveAssessment(primaryWithCoupleId);
    
    // Return the coupleId - the spouse will use this to link their assessment
    return coupleId;
  }
  
  async getSpouseAssessment(coupleId: string, role: 'primary' | 'spouse'): Promise<AssessmentResult | null> {
    const assessment = this.assessments.find(a => 
      a.coupleId === coupleId && a.coupleRole === role
    );
    
    return assessment || null;
  }
  
  async getCoupleAssessment(coupleId: string): Promise<CoupleAssessmentReport | null> {
    // Check if we already have a computed report
    if (this.coupleAssessments.has(coupleId)) {
      return this.coupleAssessments.get(coupleId) || null;
    }
    
    // Find primary and spouse assessments
    const primaryAssessment = await this.getSpouseAssessment(coupleId, 'primary');
    const spouseAssessment = await this.getSpouseAssessment(coupleId, 'spouse');
    
    if (!primaryAssessment || !spouseAssessment) {
      return null; // Not found or not complete
    }
    
    // Import the utility function dynamically on the server side
    const { generateCoupleReport } = await import('../client/src/utils/coupleAnalysisUtils');
    
    // Generate full couple assessment report
    const coupleReport = generateCoupleReport(primaryAssessment, spouseAssessment, coupleId);
    
    // Store for future reference
    this.coupleAssessments.set(coupleId, coupleReport);
    
    return coupleReport;
  }
  
  async getAllCoupleAssessments(): Promise<CoupleAssessmentReport[]> {
    // Get all unique coupleIds
    const coupleIds = new Set<string>();
    this.assessments.forEach(assessment => {
      if (assessment.coupleId) {
        coupleIds.add(assessment.coupleId);
      }
    });
    
    // Get couple assessments for each coupleId
    const coupleAssessments = await Promise.all(
      Array.from(coupleIds).map(id => this.getCoupleAssessment(id))
    );
    
    // Filter out null values and return
    return coupleAssessments.filter((report): report is CoupleAssessmentReport => report !== null);
  }
  
  // Referral methods
  async saveReferral(referral: ReferralData): Promise<void> {
    // Check if referral already exists
    const existingIndex = this.referrals.findIndex(r => 
      r.id === referral.id
    );
    
    if (existingIndex >= 0) {
      // Update existing referral
      this.referrals[existingIndex] = referral;
    } else {
      // Add new referral
      this.referrals.push(referral);
    }
  }
  
  async getAllReferrals(): Promise<ReferralData[]> {
    return [...this.referrals];
  }
  
  async updateReferralStatus(id: string, status: 'sent' | 'completed' | 'expired', completedTimestamp?: string): Promise<void> {
    const referralIndex = this.referrals.findIndex(r => r.id === id);
    
    if (referralIndex >= 0) {
      this.referrals[referralIndex] = {
        ...this.referrals[referralIndex],
        status,
        completedTimestamp: completedTimestamp || this.referrals[referralIndex].completedTimestamp
      };
    }
  }
  
  // Analytics methods
  async recordPageView(pageView: PageView): Promise<void> {
    try {
      // Try to use database if available
      const { db } = await import('./db');
      const { pageViews } = await import('@shared/schema');
      
      await db.insert(pageViews).values({
        id: pageView.id,
        path: pageView.path,
        timestamp: new Date(pageView.timestamp),
        referrer: pageView.referrer,
        userAgent: pageView.userAgent,
        ipAddress: pageView.ipAddress,
        sessionId: pageView.sessionId
      });
      
      console.log(`Page view recorded in database: ${pageView.path}`);
    } catch (error) {
      // Fallback to in-memory storage
      this.pageViews.push(pageView);
      console.log(`Page view recorded in memory: ${pageView.path}`);
    }
  }
  
  async createVisitorSession(session: VisitorSession): Promise<void> {
    try {
      // Try to use database if available
      const { db } = await import('./db');
      const { visitorSessions } = await import('@shared/schema');
      
      await db.insert(visitorSessions).values({
        id: session.id,
        startTime: new Date(session.startTime),
        endTime: session.endTime ? new Date(session.endTime) : null,
        pageCount: session.pageCount,
        deviceType: session.deviceType,
        browser: session.browser,
        country: session.country,
        region: session.region
      });
      
      console.log(`Visitor session created in database: ${session.id}`);
    } catch (error) {
      // Fallback to in-memory storage
      this.visitorSessions.push(session);
      console.log(`Visitor session created in memory: ${session.id}`);
    }
  }
  
  async updateVisitorSession(sessionId: string, endTime: string, pageCount: number): Promise<void> {
    try {
      // Try to use database if available
      const { db } = await import('./db');
      const { visitorSessions } = await import('@shared/schema');
      const { eq } = await import('drizzle-orm');
      
      await db.update(visitorSessions)
        .set({ 
          endTime: new Date(endTime),
          pageCount: pageCount
        })
        .where(eq(visitorSessions.id, sessionId));
      
      console.log(`Visitor session updated in database: ${sessionId}`);
    } catch (error) {
      // Fallback to in-memory storage
      const sessionIndex = this.visitorSessions.findIndex(s => s.id === sessionId);
      
      if (sessionIndex >= 0) {
        this.visitorSessions[sessionIndex] = {
          ...this.visitorSessions[sessionIndex],
          endTime,
          pageCount
        };
        console.log(`Visitor session updated in memory: ${sessionId}`);
      }
    }
  }
  
  async getPageViews(startDate?: string, endDate?: string): Promise<PageView[]> {
    try {
      // Try to use database if available
      const { db } = await import('./db');
      const { pageViews } = await import('@shared/schema');
      const { and, gte, lte } = await import('drizzle-orm');
      
      let query = db.select().from(pageViews);
      
      if (startDate && endDate) {
        query = query.where(
          and(
            gte(pageViews.timestamp, new Date(startDate)),
            lte(pageViews.timestamp, new Date(endDate))
          )
        );
      } else if (startDate) {
        query = query.where(gte(pageViews.timestamp, new Date(startDate)));
      } else if (endDate) {
        query = query.where(lte(pageViews.timestamp, new Date(endDate)));
      }
      
      const dbPageViews = await query;
      console.log(`Retrieved ${dbPageViews.length} page views from database`);
      
      // Convert database records to PageView interface
      return dbPageViews.map(pv => ({
        id: pv.id,
        path: pv.path,
        timestamp: pv.timestamp.toISOString(),
        referrer: pv.referrer || '',
        userAgent: pv.userAgent || '',
        ipAddress: pv.ipAddress || '',
        sessionId: pv.sessionId
      }));
    } catch (error) {
      // Fallback to in-memory storage
      console.log('Using in-memory page views', error);
      
      if (!startDate && !endDate) {
        return [...this.pageViews];
      }
      
      return this.pageViews.filter(view => {
        const viewDate = new Date(view.timestamp);
        const isAfterStart = startDate ? viewDate >= new Date(startDate) : true;
        const isBeforeEnd = endDate ? viewDate <= new Date(endDate) : true;
        return isAfterStart && isBeforeEnd;
      });
    }
  }
  
  async getVisitorSessions(startDate?: string, endDate?: string): Promise<VisitorSession[]> {
    try {
      // Try to use database if available
      const { db } = await import('./db');
      const { visitorSessions } = await import('@shared/schema');
      const { and, gte, lte } = await import('drizzle-orm');
      
      let query = db.select().from(visitorSessions);
      
      if (startDate && endDate) {
        query = query.where(
          and(
            gte(visitorSessions.startTime, new Date(startDate)),
            lte(visitorSessions.startTime, new Date(endDate))
          )
        );
      } else if (startDate) {
        query = query.where(gte(visitorSessions.startTime, new Date(startDate)));
      } else if (endDate) {
        query = query.where(lte(visitorSessions.startTime, new Date(endDate)));
      }
      
      const dbSessions = await query;
      console.log(`Retrieved ${dbSessions.length} visitor sessions from database`);
      
      // Convert database records to VisitorSession interface
      return dbSessions.map(s => ({
        id: s.id,
        startTime: s.startTime.toISOString(),
        endTime: s.endTime ? s.endTime.toISOString() : null,
        pageCount: s.pageCount,
        deviceType: s.deviceType || '',
        browser: s.browser || '',
        country: s.country || '',
        region: s.region || ''
      }));
    } catch (error) {
      // Fallback to in-memory storage
      console.log('Using in-memory visitor sessions', error);
      
      if (!startDate && !endDate) {
        return [...this.visitorSessions];
      }
      
      return this.visitorSessions.filter(session => {
        const sessionDate = new Date(session.startTime);
        const isAfterStart = startDate ? sessionDate >= new Date(startDate) : true;
        const isBeforeEnd = endDate ? sessionDate <= new Date(endDate) : true;
        return isAfterStart && isBeforeEnd;
      });
    }
  }
  
  async getAnalyticsSummary(period: 'day' | 'week' | 'month' | 'year'): Promise<AnalyticsSummary> {
    // Calculate start date based on period
    let startDate: Date;
    const now = new Date();
    const endDate = now;
    
    switch (period) {
      case 'day':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 1);
        break;
      case 'week':
        startDate = new Date(now);
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate = new Date(now);
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate = new Date(now);
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }
    
    // Get page views within period
    const periodViews = await this.getPageViews(startDate.toISOString(), endDate.toISOString());
    
    // Get sessions within period
    const periodSessions = await this.getVisitorSessions(startDate.toISOString(), endDate.toISOString());
    
    // Get payment transactions within period
    const periodTransactions = await this.getPaymentTransactions(startDate.toISOString(), endDate.toISOString());
    
    // Calculate top pages
    const pageMap = new Map<string, number>();
    for (const view of periodViews) {
      const currentCount = pageMap.get(view.path) || 0;
      pageMap.set(view.path, currentCount + 1);
    }
    
    const topPages = Array.from(pageMap.entries())
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
    
    // Calculate daily visitors
    const dailyVisitorMap = new Map<string, number>();
    for (const session of periodSessions) {
      const date = new Date(session.startTime).toISOString().split('T')[0];
      const currentCount = dailyVisitorMap.get(date) || 0;
      dailyVisitorMap.set(date, currentCount + 1);
    }
    
    const dailyVisitors = Array.from(dailyVisitorMap.entries())
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
    
    // Calculate average session duration
    let totalDuration = 0;
    let completedSessions = 0;
    
    for (const session of periodSessions) {
      if (session.endTime) {
        const startTime = new Date(session.startTime).getTime();
        const endTime = new Date(session.endTime).getTime();
        const duration = (endTime - startTime) / 1000; // Duration in seconds
        
        if (duration > 0 && duration < 7200) { // Ignore sessions longer than 2 hours (likely errors)
          totalDuration += duration;
          completedSessions++;
        }
      }
    }
    
    const averageSessionDuration = completedSessions > 0 ? Math.round(totalDuration / completedSessions) : 0;
    
    // Calculate conversion rate based on actual payments
    const conversions = periodTransactions.filter(t => t.status === 'succeeded').length;
    const conversionRate = periodSessions.length > 0 ? (conversions / periodSessions.length) * 100 : 0;
    
    // Calculate sales metrics
    const totalSales = periodTransactions
      .filter(t => t.status === 'succeeded' && !t.isRefunded)
      .reduce((sum, t) => sum + t.amount, 0) / 100; // Convert from cents to dollars
      
    // Calculate sales by product type
    const salesByProductType: Record<string, number> = {};
    for (const transaction of periodTransactions) {
      if (transaction.status === 'succeeded' && !transaction.isRefunded) {
        const productType = transaction.productType || 'unknown';
        salesByProductType[productType] = (salesByProductType[productType] || 0) + (transaction.amount / 100);
      }
    }
    
    // Calculate daily sales
    const dailySalesMap = new Map<string, number>();
    for (const transaction of periodTransactions) {
      if (transaction.status === 'succeeded' && !transaction.isRefunded) {
        const date = new Date(transaction.created).toISOString().split('T')[0];
        const currentAmount = dailySalesMap.get(date) || 0;
        dailySalesMap.set(date, currentAmount + (transaction.amount / 100));
      }
    }
    
    const dailySales = Array.from(dailySalesMap.entries())
      .map(([date, amount]) => ({ date, amount }))
      .sort((a, b) => a.date.localeCompare(b.date));
    
    // Get recent transactions
    const recentTransactions = [...periodTransactions]
      .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
      .slice(0, 10);
      
    return {
      totalVisitors: periodSessions.length,
      totalPageViews: periodViews.length,
      topPages,
      dailyVisitors,
      conversionRate,
      averageSessionDuration,
      salesData: {
        totalSales,
        recentTransactions,
        salesByProductType,
        dailySales
      }
    };
  }
  
  // Payment transaction methods
  async savePaymentTransaction(transaction: PaymentTransaction): Promise<void> {
    try {
      // Try to use database if available
      const { db } = await import('./db');
      const { paymentTransactions } = await import('@shared/schema');
      
      await db.insert(paymentTransactions).values({
        id: transaction.id,
        stripeId: transaction.stripeId,
        customerId: transaction.customerId || null,
        customerEmail: transaction.customerEmail || null,
        amount: transaction.amount,
        currency: transaction.currency,
        status: transaction.status,
        created: new Date(transaction.created),
        productType: transaction.productType,
        metadata: transaction.metadata || null,
        isRefunded: transaction.isRefunded,
        refundAmount: transaction.refundAmount || null,
        refundReason: transaction.refundReason || null,
        sessionId: transaction.sessionId || null
      });
      
      console.log(`Payment transaction recorded in database: ${transaction.stripeId}`);
    } catch (error) {
      // Fallback to in-memory storage
      const existingIndex = this.paymentTransactions.findIndex(t => t.stripeId === transaction.stripeId);
      
      if (existingIndex >= 0) {
        this.paymentTransactions[existingIndex] = transaction;
      } else {
        this.paymentTransactions.push(transaction);
      }
      
      console.log(`Payment transaction recorded in memory: ${transaction.stripeId}`);
    }
  }
  
  async getPaymentTransactions(startDate?: string, endDate?: string): Promise<PaymentTransaction[]> {
    try {
      // Try to use database if available
      const { db } = await import('./db');
      const { paymentTransactions } = await import('@shared/schema');
      const { and, gte, lte } = await import('drizzle-orm');
      
      let query = db.select().from(paymentTransactions);
      
      if (startDate && endDate) {
        query = query.where(
          and(
            gte(paymentTransactions.created, new Date(startDate)),
            lte(paymentTransactions.created, new Date(endDate))
          )
        );
      } else if (startDate) {
        query = query.where(gte(paymentTransactions.created, new Date(startDate)));
      } else if (endDate) {
        query = query.where(lte(paymentTransactions.created, new Date(endDate)));
      }
      
      const dbTransactions = await query;
      console.log(`Retrieved ${dbTransactions.length} payment transactions from database`);
      
      // Convert database records to PaymentTransaction interface
      return dbTransactions.map(t => ({
        id: t.id,
        stripeId: t.stripeId,
        customerId: t.customerId || undefined,
        customerEmail: t.customerEmail || undefined,
        amount: t.amount,
        currency: t.currency,
        status: t.status,
        created: t.created.toISOString(),
        productType: t.productType,
        metadata: t.metadata || undefined,
        isRefunded: t.isRefunded,
        refundAmount: t.refundAmount || undefined,
        refundReason: t.refundReason || undefined,
        sessionId: t.sessionId || undefined
      }));
    } catch (error) {
      // Fallback to in-memory storage
      console.log('Using in-memory payment transactions', error);
      
      if (!startDate && !endDate) {
        return [...this.paymentTransactions];
      }
      
      return this.paymentTransactions.filter(transaction => {
        const transactionDate = new Date(transaction.created);
        const isAfterStart = startDate ? transactionDate >= new Date(startDate) : true;
        const isBeforeEnd = endDate ? transactionDate <= new Date(endDate) : true;
        return isAfterStart && isBeforeEnd;
      });
    }
  }
  
  async getPaymentTransactionByStripeId(stripeId: string): Promise<PaymentTransaction | null> {
    try {
      // Try to use database if available
      const { db } = await import('./db');
      const { paymentTransactions } = await import('@shared/schema');
      const { eq } = await import('drizzle-orm');
      
      const [transaction] = await db
        .select()
        .from(paymentTransactions)
        .where(eq(paymentTransactions.stripeId, stripeId));
      
      if (!transaction) {
        return null;
      }
      
      // Convert to PaymentTransaction interface
      return {
        id: transaction.id,
        stripeId: transaction.stripeId,
        customerId: transaction.customerId || undefined,
        customerEmail: transaction.customerEmail || undefined,
        amount: transaction.amount,
        currency: transaction.currency,
        status: transaction.status,
        created: transaction.created.toISOString(),
        productType: transaction.productType,
        metadata: transaction.metadata || undefined,
        isRefunded: transaction.isRefunded,
        refundAmount: transaction.refundAmount || undefined,
        refundReason: transaction.refundReason || undefined,
        sessionId: transaction.sessionId || undefined
      };
    } catch (error) {
      // Fallback to in-memory storage
      console.log('Using in-memory payment transaction lookup', error);
      
      const transaction = this.paymentTransactions.find(t => t.stripeId === stripeId);
      return transaction || null;
    }
  }
  
  async updatePaymentTransactionStatus(stripeId: string, status: string): Promise<void> {
    try {
      // Try to use database if available
      const { db } = await import('./db');
      const { paymentTransactions } = await import('@shared/schema');
      const { eq } = await import('drizzle-orm');
      
      await db
        .update(paymentTransactions)
        .set({ status })
        .where(eq(paymentTransactions.stripeId, stripeId));
      
      console.log(`Payment transaction status updated in database: ${stripeId} -> ${status}`);
    } catch (error) {
      // Fallback to in-memory storage
      const transactionIndex = this.paymentTransactions.findIndex(t => t.stripeId === stripeId);
      
      if (transactionIndex >= 0) {
        this.paymentTransactions[transactionIndex] = {
          ...this.paymentTransactions[transactionIndex],
          status
        };
        console.log(`Payment transaction status updated in memory: ${stripeId} -> ${status}`);
      }
    }
  }
  
  async recordRefund(stripeId: string, amount: number, reason?: string): Promise<void> {
    try {
      // Try to use database if available
      const { db } = await import('./db');
      const { paymentTransactions } = await import('@shared/schema');
      const { eq } = await import('drizzle-orm');
      
      await db
        .update(paymentTransactions)
        .set({ 
          isRefunded: true,
          refundAmount: amount,
          refundReason: reason || null
        })
        .where(eq(paymentTransactions.stripeId, stripeId));
      
      console.log(`Refund recorded in database: ${stripeId}, amount: ${amount}`);
    } catch (error) {
      // Fallback to in-memory storage
      const transactionIndex = this.paymentTransactions.findIndex(t => t.stripeId === stripeId);
      
      if (transactionIndex >= 0) {
        this.paymentTransactions[transactionIndex] = {
          ...this.paymentTransactions[transactionIndex],
          isRefunded: true,
          refundAmount: amount,
          refundReason: reason
        };
        console.log(`Refund recorded in memory: ${stripeId}, amount: ${amount}`);
      }
    }
  }
}

export const storage = new MemStorage();