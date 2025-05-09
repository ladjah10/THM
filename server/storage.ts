import { 
  pageViews,
  visitorSessions,
  paymentTransactions,
  assessmentResults,
  coupleAssessments,
  type AssessmentResultDB,
  type CoupleAssessmentDB,
  type InsertAssessmentResult,
  type InsertCoupleAssessment
} from "@shared/schema";
import { 
  AssessmentResult, 
  CoupleAssessmentReport, 
  ReferralData, 
  PageView, 
  VisitorSession, 
  AnalyticsSummary,
  PaymentTransaction
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, between, sql, gte, lte } from "drizzle-orm";
import { v4 as uuidv4 } from 'uuid';

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

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.username, username));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }
  
  async saveAssessment(assessment: AssessmentResult): Promise<void> {
    try {
      // Convert complex objects to JSON strings for database storage
      const dbAssessment: InsertAssessmentResult = {
        id: assessment.id || uuidv4(),
        email: assessment.email,
        name: assessment.name,
        scores: JSON.stringify(assessment.scores),
        profile: JSON.stringify(assessment.profile),
        genderProfile: assessment.genderProfile ? JSON.stringify(assessment.genderProfile) : null,
        responses: JSON.stringify(assessment.responses),
        demographics: JSON.stringify(assessment.demographics),
        timestamp: new Date(assessment.timestamp),
        transactionId: assessment.transactionId,
        coupleId: assessment.coupleId,
        coupleRole: assessment.coupleRole,
        reportSent: assessment.reportSent || false
      };
      
      // Check if assessment already exists
      if (assessment.id) {
        // Update existing assessment
        await db.update(assessmentResults)
          .set(dbAssessment)
          .where(eq(assessmentResults.id, assessment.id));
        console.log(`Assessment updated in database: ${assessment.email}`);
      } else if (assessment.coupleId && assessment.coupleRole) {
        // Check for existing assessment with same coupleId and role
        const [existing] = await db.select()
          .from(assessmentResults)
          .where(
            and(
              eq(assessmentResults.coupleId, assessment.coupleId),
              eq(assessmentResults.coupleRole, assessment.coupleRole)
            )
          );
        
        if (existing) {
          // Update existing assessment
          await db.update(assessmentResults)
            .set(dbAssessment)
            .where(eq(assessmentResults.id, existing.id));
          console.log(`Couple assessment updated in database: ${assessment.email} (${assessment.coupleRole})`);
        } else {
          // Insert new assessment
          await db.insert(assessmentResults).values(dbAssessment);
          console.log(`New couple assessment saved in database: ${assessment.email} (${assessment.coupleRole})`);
        }
      } else {
        // Check for existing assessment with same email
        const [existing] = await db.select()
          .from(assessmentResults)
          .where(eq(assessmentResults.email, assessment.email))
          .orderBy(desc(assessmentResults.timestamp))
          .limit(1);
        
        if (existing && !existing.coupleId) {
          // Update existing assessment
          await db.update(assessmentResults)
            .set(dbAssessment)
            .where(eq(assessmentResults.id, existing.id));
          console.log(`Assessment updated in database: ${assessment.email}`);
        } else {
          // Insert new assessment
          await db.insert(assessmentResults).values(dbAssessment);
          console.log(`New assessment saved in database: ${assessment.email}`);
        }
      }
    } catch (error) {
      console.error('Error saving assessment to database:', error);
      // Fallback to memory storage if needed
      const memStorage = new MemStorage();
      await memStorage.saveAssessment(assessment);
    }
  }
  
  async getAssessments(email: string): Promise<AssessmentResult[]> {
    try {
      const dbAssessments = await db.select()
        .from(assessmentResults)
        .where(eq(assessmentResults.email, email));
      
      return dbAssessments.map(this.mapDbAssessmentToResult);
    } catch (error) {
      console.error('Error retrieving assessments from database:', error);
      // Fallback to memory storage
      const memStorage = new MemStorage();
      return memStorage.getAssessments(email);
    }
  }
  
  async getAllAssessments(): Promise<AssessmentResult[]> {
    try {
      const dbAssessments = await db.select().from(assessmentResults);
      return dbAssessments.map(this.mapDbAssessmentToResult);
    } catch (error) {
      console.error('Error retrieving all assessments from database:', error);
      // Fallback to memory storage
      const memStorage = new MemStorage();
      return memStorage.getAllAssessments();
    }
  }
  
  // Helper method to convert database record to AssessmentResult
  private mapDbAssessmentToResult(dbAssessment: AssessmentResultDB): AssessmentResult {
    return {
      id: dbAssessment.id,
      email: dbAssessment.email,
      name: dbAssessment.name,
      scores: JSON.parse(dbAssessment.scores),
      profile: JSON.parse(dbAssessment.profile),
      genderProfile: dbAssessment.genderProfile ? JSON.parse(dbAssessment.genderProfile) : null,
      responses: JSON.parse(dbAssessment.responses),
      demographics: JSON.parse(dbAssessment.demographics),
      timestamp: dbAssessment.timestamp.toISOString(),
      transactionId: dbAssessment.transactionId || undefined,
      coupleId: dbAssessment.coupleId || undefined,
      coupleRole: dbAssessment.coupleRole as 'primary' | 'spouse' | undefined,
      reportSent: dbAssessment.reportSent
    };
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
    try {
      const [dbAssessment] = await db.select()
        .from(assessmentResults)
        .where(
          and(
            eq(assessmentResults.coupleId, coupleId),
            eq(assessmentResults.coupleRole, role)
          )
        );
      
      if (!dbAssessment) {
        return null;
      }
      
      return this.mapDbAssessmentToResult(dbAssessment);
    } catch (error) {
      console.error('Error retrieving spouse assessment from database:', error);
      // Fallback to memory storage
      const memStorage = new MemStorage();
      return memStorage.getSpouseAssessment(coupleId, role);
    }
  }
  
  async getCoupleAssessment(coupleId: string): Promise<CoupleAssessmentReport | null> {
    try {
      // Check if we already have a computed report in the database
      const [existingCoupleAssessment] = await db.select()
        .from(coupleAssessments)
        .where(eq(coupleAssessments.coupleId, coupleId));
      
      if (existingCoupleAssessment) {
        // Find the primary and spouse assessments
        const [primary] = await db.select()
          .from(assessmentResults)
          .where(
            and(
              eq(assessmentResults.id, existingCoupleAssessment.primaryId),
              eq(assessmentResults.coupleRole, 'primary')
            )
          );
        
        const [spouse] = await db.select()
          .from(assessmentResults)
          .where(
            and(
              eq(assessmentResults.id, existingCoupleAssessment.spouseId),
              eq(assessmentResults.coupleRole, 'spouse')
            )
          );
        
        if (primary && spouse) {
          return {
            id: existingCoupleAssessment.id,
            coupleId: existingCoupleAssessment.coupleId,
            primary: this.mapDbAssessmentToResult(primary),
            spouse: this.mapDbAssessmentToResult(spouse),
            analysis: JSON.parse(existingCoupleAssessment.analysis),
            timestamp: existingCoupleAssessment.timestamp.toISOString(),
            compatibilityScore: Number(existingCoupleAssessment.compatibilityScore),
            recommendations: JSON.parse(existingCoupleAssessment.recommendations),
            reportSent: existingCoupleAssessment.reportSent
          };
        }
      }
      
      // If not found in database, compute it
      const primaryAssessment = await this.getSpouseAssessment(coupleId, 'primary');
      const spouseAssessment = await this.getSpouseAssessment(coupleId, 'spouse');
      
      if (!primaryAssessment || !spouseAssessment) {
        return null; // Not found or not complete
      }
      
      // Import the utility function dynamically on the server side
      const { generateCoupleReport } = await import('../client/src/utils/coupleAnalysisUtils');
      
      // Generate full couple assessment report
      const coupleReport = generateCoupleReport(primaryAssessment, spouseAssessment, coupleId);
      
      // Store in database for future reference
      const newCoupleAssessment: InsertCoupleAssessment = {
        id: uuidv4(),
        coupleId: coupleId,
        primaryId: primaryAssessment.id,
        spouseId: spouseAssessment.id,
        analysis: JSON.stringify(coupleReport.analysis),
        timestamp: new Date(),
        compatibilityScore: coupleReport.compatibilityScore.toString(),
        recommendations: JSON.stringify(coupleReport.recommendations),
        reportSent: false
      };
      
      await db.insert(coupleAssessments).values(newCoupleAssessment);
      console.log(`Couple assessment report saved to database: ${coupleId}`);
      
      return coupleReport;
    } catch (error) {
      console.error('Error retrieving couple assessment from database:', error);
      // Fallback to memory storage
      const memStorage = new MemStorage();
      return memStorage.getCoupleAssessment(coupleId);
    }
  }
  
  async getAllCoupleAssessments(): Promise<CoupleAssessmentReport[]> {
    try {
      // Get all couples from the database
      const dbCoupleAssessments = await db.select().from(coupleAssessments);
      
      // Map to CoupleAssessmentReport objects
      const reports: CoupleAssessmentReport[] = [];
      
      for (const dbCouple of dbCoupleAssessments) {
        const coupleReport = await this.getCoupleAssessment(dbCouple.coupleId);
        if (coupleReport) {
          reports.push(coupleReport);
        }
      }
      
      return reports;
    } catch (error) {
      console.error('Error retrieving all couple assessments from database:', error);
      // Fallback to memory storage
      const memStorage = new MemStorage();
      return memStorage.getAllCoupleAssessments();
    }
  }
  
  // Implement the rest of the interface methods (referrals, analytics, payments)
  // using the same pattern as MemStorage but with database operations
  
  // Referral methods
  async saveReferral(referral: ReferralData): Promise<void> {
    // Fallback to memory storage for now
    const memStorage = new MemStorage();
    await memStorage.saveReferral(referral);
  }
  
  async getAllReferrals(): Promise<ReferralData[]> {
    // Fallback to memory storage for now
    const memStorage = new MemStorage();
    return memStorage.getAllReferrals();
  }
  
  async updateReferralStatus(id: string, status: 'sent' | 'completed' | 'expired', completedTimestamp?: string): Promise<void> {
    // Fallback to memory storage for now
    const memStorage = new MemStorage();
    await memStorage.updateReferralStatus(id, status, completedTimestamp);
  }
  
  // Analytics methods
  async recordPageView(pageView: PageView): Promise<void> {
    try {
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
      console.error('Error recording page view in database:', error);
      // Fallback to memory storage
      const memStorage = new MemStorage();
      await memStorage.recordPageView(pageView);
    }
  }
  
  async createVisitorSession(session: VisitorSession): Promise<void> {
    try {
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
      console.error('Error creating visitor session in database:', error);
      // Fallback to memory storage
      const memStorage = new MemStorage();
      await memStorage.createVisitorSession(session);
    }
  }
  
  async updateVisitorSession(sessionId: string, endTime: string, pageCount: number): Promise<void> {
    try {
      await db.update(visitorSessions)
        .set({ 
          endTime: new Date(endTime),
          pageCount: pageCount
        })
        .where(eq(visitorSessions.id, sessionId));
      
      console.log(`Visitor session updated in database: ${sessionId}`);
    } catch (error) {
      console.error('Error updating visitor session in database:', error);
      // Fallback to memory storage
      const memStorage = new MemStorage();
      await memStorage.updateVisitorSession(sessionId, endTime, pageCount);
    }
  }
  
  async getPageViews(startDate?: string, endDate?: string): Promise<PageView[]> {
    try {
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
      console.error('Error retrieving page views from database:', error);
      // Fallback to memory storage
      const memStorage = new MemStorage();
      return memStorage.getPageViews(startDate, endDate);
    }
  }
  
  async getVisitorSessions(startDate?: string, endDate?: string): Promise<VisitorSession[]> {
    try {
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
      return dbSessions.map(vs => ({
        id: vs.id,
        startTime: vs.startTime.toISOString(),
        endTime: vs.endTime ? vs.endTime.toISOString() : null,
        pageCount: vs.pageCount,
        deviceType: vs.deviceType || '',
        browser: vs.browser || '',
        country: vs.country || '',
        region: vs.region || ''
      }));
    } catch (error) {
      console.error('Error retrieving visitor sessions from database:', error);
      // Fallback to memory storage
      const memStorage = new MemStorage();
      return memStorage.getVisitorSessions(startDate, endDate);
    }
  }
  
  async getAnalyticsSummary(period: 'day' | 'week' | 'month' | 'year'): Promise<AnalyticsSummary> {
    try {
      // Get date range based on period
      const now = new Date();
      let startDate = new Date();
      
      switch (period) {
        case 'day':
          startDate.setDate(now.getDate() - 1);
          break;
        case 'week':
          startDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          startDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          startDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      // Get visitor sessions for the period
      const sessions = await this.getVisitorSessions(startDate.toISOString(), now.toISOString());
      
      // Get page views for the period
      const views = await this.getPageViews(startDate.toISOString(), now.toISOString());
      
      // Get payment transactions for the period
      const transactions = await this.getPaymentTransactions(startDate.toISOString(), now.toISOString());
      
      // Group page views by path
      const pageViewsByPath: Record<string, number> = {};
      views.forEach(view => {
        pageViewsByPath[view.path] = (pageViewsByPath[view.path] || 0) + 1;
      });
      
      // Sort and get top pages
      const topPages = Object.entries(pageViewsByPath)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 5)
        .map(([path, count]) => ({ path, count }));
      
      // Group sessions by date
      const sessionsByDate: Record<string, number> = {};
      sessions.forEach(session => {
        const date = session.startTime.split('T')[0];
        sessionsByDate[date] = (sessionsByDate[date] || 0) + 1;
      });
      
      // Convert to array sorted by date
      const dailyVisitors = Object.entries(sessionsByDate)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, count]) => ({ date, count }));
      
      // Calculate conversion rate (transactions / sessions)
      const conversionRate = sessions.length ? (transactions.length / sessions.length) * 100 : 0;
      
      // Calculate average session duration
      let totalDuration = 0;
      let completedSessions = 0;
      
      sessions.forEach(session => {
        if (session.endTime) {
          const start = new Date(session.startTime).getTime();
          const end = new Date(session.endTime).getTime();
          const duration = (end - start) / 1000; // in seconds
          
          totalDuration += duration;
          completedSessions++;
        }
      });
      
      const averageSessionDuration = completedSessions ? totalDuration / completedSessions : 0;
      
      // Group transactions by product type
      const salesByProductType: Record<string, number> = {};
      let totalSales = 0;
      
      transactions.forEach(transaction => {
        if (transaction.status === 'succeeded' && !transaction.isRefunded) {
          const amount = transaction.amount;
          totalSales += amount;
          salesByProductType[transaction.productType] = (salesByProductType[transaction.productType] || 0) + amount;
        }
      });
      
      // Group transactions by date
      const salesByDate: Record<string, number> = {};
      transactions.forEach(transaction => {
        if (transaction.status === 'succeeded' && !transaction.isRefunded) {
          const date = transaction.created.split('T')[0];
          salesByDate[date] = (salesByDate[date] || 0) + transaction.amount;
        }
      });
      
      // Convert to array sorted by date
      const dailySales = Object.entries(salesByDate)
        .sort((a, b) => a[0].localeCompare(b[0]))
        .map(([date, amount]) => ({ date, amount }));
      
      // Build the summary object
      const summary: AnalyticsSummary = {
        totalVisitors: sessions.length,
        totalPageViews: views.length,
        topPages,
        dailyVisitors,
        conversionRate,
        averageSessionDuration,
        salesData: {
          totalSales,
          recentTransactions: transactions
            .sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
            .slice(0, 10),
          salesByProductType,
          dailySales
        }
      };
      
      return summary;
    } catch (error) {
      console.error('Error generating analytics summary from database:', error);
      // Fallback to memory storage
      const memStorage = new MemStorage();
      return memStorage.getAnalyticsSummary(period);
    }
  }
  
  // Payment transaction methods
  async savePaymentTransaction(transaction: PaymentTransaction): Promise<void> {
    try {
      await db.insert(paymentTransactions).values({
        id: transaction.id,
        stripeId: transaction.stripeId,
        customerId: transaction.customerId,
        customerEmail: transaction.customerEmail,
        amount: transaction.amount,
        currency: transaction.currency,
        status: transaction.status,
        created: new Date(transaction.created),
        productType: transaction.productType,
        productName: transaction.productName,
        metadata: transaction.metadata,
        isRefunded: transaction.isRefunded,
        refundAmount: transaction.refundAmount,
        refundReason: transaction.refundReason,
        sessionId: transaction.sessionId
      });
      
      console.log(`Payment transaction saved to database: ${transaction.stripeId}`);
      
      // If there's a customer email, try to link this transaction to an assessment
      if (transaction.customerEmail) {
        await this.linkTransactionToAssessment(transaction);
      }
    } catch (error) {
      console.error('Error saving payment transaction to database:', error);
      // Fallback to memory storage
      const memStorage = new MemStorage();
      await memStorage.savePaymentTransaction(transaction);
    }
  }
  
  // Helper method to link a transaction to an assessment
  private async linkTransactionToAssessment(transaction: PaymentTransaction): Promise<void> {
    try {
      // Find the latest assessment for this email
      const [assessment] = await db.select()
        .from(assessmentResults)
        .where(eq(assessmentResults.email, transaction.customerEmail!))
        .orderBy(desc(assessmentResults.timestamp))
        .limit(1);
      
      if (assessment && !assessment.transactionId) {
        // Update the assessment with the transaction ID
        await db.update(assessmentResults)
          .set({ transactionId: transaction.id })
          .where(eq(assessmentResults.id, assessment.id));
          
        console.log(`Linked transaction ${transaction.id} to assessment ${assessment.id}`);
      }
    } catch (error) {
      console.error('Error linking transaction to assessment:', error);
    }
  }
  
  async getPaymentTransactions(startDate?: string, endDate?: string): Promise<PaymentTransaction[]> {
    try {
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
      
      // Convert database records to PaymentTransaction interface
      return dbTransactions.map(pt => ({
        id: pt.id,
        stripeId: pt.stripeId,
        customerId: pt.customerId || undefined,
        customerEmail: pt.customerEmail || undefined,
        amount: Number(pt.amount),
        currency: pt.currency,
        status: pt.status,
        created: pt.created.toISOString(),
        productType: pt.productType,
        productName: pt.productName || undefined,
        metadata: pt.metadata || undefined,
        isRefunded: pt.isRefunded,
        refundAmount: pt.refundAmount ? Number(pt.refundAmount) : undefined,
        refundReason: pt.refundReason || undefined,
        sessionId: pt.sessionId || undefined
      }));
    } catch (error) {
      console.error('Error retrieving payment transactions from database:', error);
      // Fallback to memory storage
      const memStorage = new MemStorage();
      return memStorage.getPaymentTransactions(startDate, endDate);
    }
  }
  
  // Get payment transactions with linked assessment data
  async getPaymentTransactionsWithAssessments(startDate?: string, endDate?: string): Promise<Array<PaymentTransaction & { assessmentData?: Partial<DemographicData> }>> {
    try {
      // First get the transactions
      const transactions = await this.getPaymentTransactions(startDate, endDate);
      
      // Create an enhanced transactions array with assessment data
      const enhancedTransactions = await Promise.all(
        transactions.map(async (transaction) => {
          try {
            if (!transaction.customerEmail) {
              return transaction;
            }
            
            // Find assessments for this email
            const assessmentsByEmail = await db.select()
              .from(assessmentResults)
              .where(eq(assessmentResults.email, transaction.customerEmail))
              .orderBy(desc(assessmentResults.timestamp));
              
            if (assessmentsByEmail && assessmentsByEmail.length > 0) {
              const assessment = assessmentsByEmail[0];
              const demographics = assessment.demographics ? JSON.parse(assessment.demographics) : {};
              
              return {
                ...transaction,
                assessmentData: {
                  firstName: demographics.firstName,
                  lastName: demographics.lastName,
                  email: demographics.email,
                  gender: demographics.gender,
                  marriageStatus: demographics.marriageStatus,
                  desireChildren: demographics.desireChildren,
                  ethnicity: demographics.ethnicity,
                  city: demographics.city,
                  state: demographics.state,
                  zipCode: demographics.zipCode
                }
              };
            }
          } catch (error) {
            console.error(`Error fetching assessment data for transaction ${transaction.id}:`, error);
          }
          
          // Return the original transaction if no assessment is found
          return transaction;
        })
      );
      
      return enhancedTransactions;
    } catch (error) {
      console.error('Error retrieving enhanced payment transactions:', error);
      return this.getPaymentTransactions(startDate, endDate);
    }
  }
  
  async getPaymentTransactionByStripeId(stripeId: string): Promise<PaymentTransaction | null> {
    try {
      const [dbTransaction] = await db.select()
        .from(paymentTransactions)
        .where(eq(paymentTransactions.stripeId, stripeId));
      
      if (!dbTransaction) {
        return null;
      }
      
      return {
        id: dbTransaction.id,
        stripeId: dbTransaction.stripeId,
        customerId: dbTransaction.customerId || undefined,
        customerEmail: dbTransaction.customerEmail || undefined,
        amount: Number(dbTransaction.amount),
        currency: dbTransaction.currency,
        status: dbTransaction.status,
        created: dbTransaction.created.toISOString(),
        productType: dbTransaction.productType,
        productName: dbTransaction.productName || undefined,
        metadata: dbTransaction.metadata || undefined,
        isRefunded: dbTransaction.isRefunded,
        refundAmount: dbTransaction.refundAmount ? Number(dbTransaction.refundAmount) : undefined,
        refundReason: dbTransaction.refundReason || undefined,
        sessionId: dbTransaction.sessionId || undefined
      };
    } catch (error) {
      console.error('Error retrieving payment transaction by Stripe ID from database:', error);
      // Fallback to memory storage
      const memStorage = new MemStorage();
      return memStorage.getPaymentTransactionByStripeId(stripeId);
    }
  }
  
  async updatePaymentTransactionStatus(stripeId: string, status: string): Promise<void> {
    try {
      await db.update(paymentTransactions)
        .set({ status })
        .where(eq(paymentTransactions.stripeId, stripeId));
      
      console.log(`Payment transaction status updated in database: ${stripeId} -> ${status}`);
    } catch (error) {
      console.error('Error updating payment transaction status in database:', error);
      // Fallback to memory storage
      const memStorage = new MemStorage();
      await memStorage.updatePaymentTransactionStatus(stripeId, status);
    }
  }
  
  async recordRefund(stripeId: string, amount: number, reason?: string): Promise<void> {
    try {
      await db.update(paymentTransactions)
        .set({ 
          isRefunded: true,
          refundAmount: amount,
          refundReason: reason
        })
        .where(eq(paymentTransactions.stripeId, stripeId));
      
      console.log(`Refund recorded in database for payment: ${stripeId}`);
    } catch (error) {
      console.error('Error recording refund in database:', error);
      // Fallback to memory storage
      const memStorage = new MemStorage();
      await memStorage.recordRefund(stripeId, amount, reason);
    }
  }
}

// Use database storage if available, fallback to memory storage
export const storage = new DatabaseStorage();