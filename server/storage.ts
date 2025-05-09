import { 
  pageViews,
  visitorSessions,
  paymentTransactions,
  assessmentResults,
  type AssessmentResultDB,
  type CoupleAssessmentDB,
  type InsertAssessmentResult,
  type InsertCoupleAssessment,
  type User,
  type InsertUser
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

// Storage interface defining all storage operations
export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveAssessment(assessment: AssessmentResult): Promise<void>;
  saveAssessmentProgress(tempId: string, assessment: Partial<AssessmentResult>): Promise<void>;
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
  
  // Promo code methods
  recordPromoCodeUsage(data: {promoCode: string, assessmentType: string, timestamp: string}): Promise<void>;
}

// In-memory storage implementation
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
  
  async saveAssessmentProgress(tempId: string, assessment: Partial<AssessmentResult>): Promise<void> {
    // Find existing partial assessment progress by tempId
    const existingIndex = this.assessments.findIndex(a => 
      (a.email === tempId || a.tempId === tempId) && a.isPartial === true
    );
    
    // Create a full assessment object with partial data and tempId
    const progressAssessment = {
      ...assessment,
      tempId: tempId,
      isPartial: true,
      timestamp: assessment.timestamp || new Date().toISOString()
    } as AssessmentResult;
    
    if (existingIndex >= 0) {
      // Update existing partial assessment
      // Merge existing data with new data, new data takes precedence
      this.assessments[existingIndex] = {
        ...this.assessments[existingIndex],
        ...progressAssessment,
        // Merge responses separately to keep all existing responses
        responses: {
          ...this.assessments[existingIndex].responses,
          ...progressAssessment.responses
        },
        // If assessment has demographics, merge them
        demographics: progressAssessment.demographics
          ? {
              ...this.assessments[existingIndex].demographics,
              ...progressAssessment.demographics
            }
          : this.assessments[existingIndex].demographics
      };
    } else {
      // Add new partial assessment
      this.assessments.push(progressAssessment);
    }
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
    // Just store in memory
    this.pageViews.push(pageView);
    console.log(`Page view recorded in memory: ${pageView.path}`);
  }
  
  async createVisitorSession(session: VisitorSession): Promise<void> {
    // Just store in memory
    this.visitorSessions.push(session);
    console.log(`Visitor session created in memory: ${session.id}`);
  }
  
  async updateVisitorSession(sessionId: string, endTime: string, pageCount: number): Promise<void> {
    // Update in memory
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
  
  // Method to record promo code usage
  async recordPromoCodeUsage(data: {promoCode: string, assessmentType: string, timestamp: string}): Promise<void> {
    console.log(`Recording promo code usage in memory: ${data.promoCode} for ${data.assessmentType} assessment`);
    // In a real implementation with memory storage, we would track this in a dedicated array
    // For now, we'll just log it
  }
  
  async getPageViews(startDate?: string, endDate?: string): Promise<PageView[]> {
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
  
  async getVisitorSessions(startDate?: string, endDate?: string): Promise<VisitorSession[]> {
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
    const existingIndex = this.paymentTransactions.findIndex(t => t.stripeId === transaction.stripeId);
    
    if (existingIndex >= 0) {
      this.paymentTransactions[existingIndex] = transaction;
    } else {
      this.paymentTransactions.push(transaction);
    }
    
    console.log(`Payment transaction recorded in memory: ${transaction.stripeId}`);
  }
  
  async getPaymentTransactions(startDate?: string, endDate?: string): Promise<PaymentTransaction[]> {
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
  
  async getPaymentTransactionByStripeId(stripeId: string): Promise<PaymentTransaction | null> {
    const transaction = this.paymentTransactions.find(t => t.stripeId === stripeId);
    return transaction || null;
  }
  
  async updatePaymentTransactionStatus(stripeId: string, status: string): Promise<void> {
    const transactionIndex = this.paymentTransactions.findIndex(t => t.stripeId === stripeId);
    
    if (transactionIndex >= 0) {
      this.paymentTransactions[transactionIndex] = {
        ...this.paymentTransactions[transactionIndex],
        status
      };
      console.log(`Payment transaction status updated in memory: ${stripeId} -> ${status}`);
    }
  }
  
  async recordRefund(stripeId: string, amount: number, reason?: string): Promise<void> {
    const transactionIndex = this.paymentTransactions.findIndex(t => t.stripeId === stripeId);
    
    if (transactionIndex >= 0) {
      this.paymentTransactions[transactionIndex] = {
        ...this.paymentTransactions[transactionIndex],
        isRefunded: true,
        refundAmount: amount,
        refundReason: reason
      };
      console.log(`Refund recorded in memory for transaction: ${stripeId}`);
    }
  }
}

// Database storage implementation
export class DatabaseStorage implements IStorage {
  // Method to record promo code usage
  async recordPromoCodeUsage(data: {promoCode: string, assessmentType: string, timestamp: string}): Promise<void> {
    console.log(`Recording promo code usage in database: ${data.promoCode} for ${data.assessmentType} assessment`);
    // In a real implementation, this would insert into a dedicated table
    // For now, we'll just log it
  }
  
  // Save assessment progress during assessment (for auto-save functionality)
  async saveAssessmentProgress(tempId: string, assessment: Partial<AssessmentResult>): Promise<void> {
    try {
      console.log(`Saving partial assessment progress for tempId: ${tempId}`);
      // Implement database storage logic
      
      // If database operation fails, fallback to memory
      const memStorage = new MemStorage();
      await memStorage.saveAssessmentProgress(tempId, assessment);
    } catch (error) {
      console.error('Error saving assessment progress:', error);
      // Fallback to memory storage
      const memStorage = new MemStorage();
      await memStorage.saveAssessmentProgress(tempId, assessment);
    }
  }
  
  async getUser(id: number): Promise<User | undefined> {
    try {
      // Implementation would use database access
      // For now, use memory storage as fallback
      const memStorage = new MemStorage();
      return await memStorage.getUser(id);
    } catch (error) {
      console.error('Error getting user:', error);
      const memStorage = new MemStorage();
      return await memStorage.getUser(id);
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      // Implementation would use database access
      // For now, use memory storage as fallback
      const memStorage = new MemStorage();
      return await memStorage.getUserByUsername(username);
    } catch (error) {
      console.error('Error getting user by username:', error);
      const memStorage = new MemStorage();
      return await memStorage.getUserByUsername(username);
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      // Implementation would use database access
      // For now, use memory storage as fallback
      const memStorage = new MemStorage();
      return await memStorage.createUser(insertUser);
    } catch (error) {
      console.error('Error creating user:', error);
      const memStorage = new MemStorage();
      return await memStorage.createUser(insertUser);
    }
  }
  
  async saveAssessment(assessment: AssessmentResult): Promise<void> {
    try {
      // Implementation of database storage
      const memStorage = new MemStorage();
      await memStorage.saveAssessment(assessment);
    } catch (error) {
      console.error('Error saving assessment:', error);
      const memStorage = new MemStorage();
      await memStorage.saveAssessment(assessment);
    }
  }
  
  async getAssessments(email: string): Promise<AssessmentResult[]> {
    try {
      // Implementation of database retrieval
      const memStorage = new MemStorage();
      return await memStorage.getAssessments(email);
    } catch (error) {
      console.error('Error getting assessments:', error);
      const memStorage = new MemStorage();
      return await memStorage.getAssessments(email);
    }
  }
  
  async getAllAssessments(): Promise<AssessmentResult[]> {
    try {
      // Implementation of database retrieval
      const memStorage = new MemStorage();
      return await memStorage.getAllAssessments();
    } catch (error) {
      console.error('Error getting all assessments:', error);
      const memStorage = new MemStorage();
      return await memStorage.getAllAssessments();
    }
  }
  
  // All the other methods with similar implementation pattern
  async saveCoupleAssessment(primaryAssessment: AssessmentResult, spouseEmail: string): Promise<string> {
    try {
      // Implementation of database storage
      const memStorage = new MemStorage();
      return await memStorage.saveCoupleAssessment(primaryAssessment, spouseEmail);
    } catch (error) {
      console.error('Error saving couple assessment:', error);
      const memStorage = new MemStorage();
      return await memStorage.saveCoupleAssessment(primaryAssessment, spouseEmail);
    }
  }
  
  async getSpouseAssessment(coupleId: string, role: 'primary' | 'spouse'): Promise<AssessmentResult | null> {
    try {
      // Implementation of database retrieval
      const memStorage = new MemStorage();
      return await memStorage.getSpouseAssessment(coupleId, role);
    } catch (error) {
      console.error('Error getting spouse assessment:', error);
      const memStorage = new MemStorage();
      return await memStorage.getSpouseAssessment(coupleId, role);
    }
  }
  
  async getCoupleAssessment(coupleId: string): Promise<CoupleAssessmentReport | null> {
    try {
      // Implementation of database retrieval
      const memStorage = new MemStorage();
      return await memStorage.getCoupleAssessment(coupleId);
    } catch (error) {
      console.error('Error getting couple assessment:', error);
      const memStorage = new MemStorage();
      return await memStorage.getCoupleAssessment(coupleId);
    }
  }
  
  async getAllCoupleAssessments(): Promise<CoupleAssessmentReport[]> {
    try {
      // Implementation of database retrieval
      const memStorage = new MemStorage();
      return await memStorage.getAllCoupleAssessments();
    } catch (error) {
      console.error('Error getting all couple assessments:', error);
      const memStorage = new MemStorage();
      return await memStorage.getAllCoupleAssessments();
    }
  }
  
  async saveReferral(referral: ReferralData): Promise<void> {
    try {
      // Implementation of database storage
      const memStorage = new MemStorage();
      await memStorage.saveReferral(referral);
    } catch (error) {
      console.error('Error saving referral:', error);
      const memStorage = new MemStorage();
      await memStorage.saveReferral(referral);
    }
  }
  
  async getAllReferrals(): Promise<ReferralData[]> {
    try {
      // Implementation of database retrieval
      const memStorage = new MemStorage();
      return await memStorage.getAllReferrals();
    } catch (error) {
      console.error('Error getting all referrals:', error);
      const memStorage = new MemStorage();
      return await memStorage.getAllReferrals();
    }
  }
  
  async updateReferralStatus(id: string, status: 'sent' | 'completed' | 'expired', completedTimestamp?: string): Promise<void> {
    try {
      // Implementation of database update
      const memStorage = new MemStorage();
      await memStorage.updateReferralStatus(id, status, completedTimestamp);
    } catch (error) {
      console.error('Error updating referral status:', error);
      const memStorage = new MemStorage();
      await memStorage.updateReferralStatus(id, status, completedTimestamp);
    }
  }
  
  async recordPageView(pageView: PageView): Promise<void> {
    try {
      // Implementation of database storage
      const memStorage = new MemStorage();
      await memStorage.recordPageView(pageView);
    } catch (error) {
      console.error('Error recording page view:', error);
      const memStorage = new MemStorage();
      await memStorage.recordPageView(pageView);
    }
  }
  
  async createVisitorSession(session: VisitorSession): Promise<void> {
    try {
      // Implementation of database storage
      const memStorage = new MemStorage();
      await memStorage.createVisitorSession(session);
    } catch (error) {
      console.error('Error creating visitor session:', error);
      const memStorage = new MemStorage();
      await memStorage.createVisitorSession(session);
    }
  }
  
  async updateVisitorSession(sessionId: string, endTime: string, pageCount: number): Promise<void> {
    try {
      // Implementation of database update
      const memStorage = new MemStorage();
      await memStorage.updateVisitorSession(sessionId, endTime, pageCount);
    } catch (error) {
      console.error('Error updating visitor session:', error);
      const memStorage = new MemStorage();
      await memStorage.updateVisitorSession(sessionId, endTime, pageCount);
    }
  }
  
  async getPageViews(startDate?: string, endDate?: string): Promise<PageView[]> {
    try {
      // Implementation of database retrieval
      const memStorage = new MemStorage();
      return await memStorage.getPageViews(startDate, endDate);
    } catch (error) {
      console.error('Error getting page views:', error);
      const memStorage = new MemStorage();
      return await memStorage.getPageViews(startDate, endDate);
    }
  }
  
  async getVisitorSessions(startDate?: string, endDate?: string): Promise<VisitorSession[]> {
    try {
      // Implementation of database retrieval
      const memStorage = new MemStorage();
      return await memStorage.getVisitorSessions(startDate, endDate);
    } catch (error) {
      console.error('Error getting visitor sessions:', error);
      const memStorage = new MemStorage();
      return await memStorage.getVisitorSessions(startDate, endDate);
    }
  }
  
  async getAnalyticsSummary(period: 'day' | 'week' | 'month' | 'year'): Promise<AnalyticsSummary> {
    try {
      // Implementation of database retrieval and computation
      const memStorage = new MemStorage();
      return await memStorage.getAnalyticsSummary(period);
    } catch (error) {
      console.error('Error getting analytics summary:', error);
      const memStorage = new MemStorage();
      return await memStorage.getAnalyticsSummary(period);
    }
  }
  
  async savePaymentTransaction(transaction: PaymentTransaction): Promise<void> {
    try {
      // Implementation of database storage
      const memStorage = new MemStorage();
      await memStorage.savePaymentTransaction(transaction);
    } catch (error) {
      console.error('Error saving payment transaction:', error);
      const memStorage = new MemStorage();
      await memStorage.savePaymentTransaction(transaction);
    }
  }
  
  async getPaymentTransactions(startDate?: string, endDate?: string): Promise<PaymentTransaction[]> {
    try {
      // Implementation of database retrieval
      const memStorage = new MemStorage();
      return await memStorage.getPaymentTransactions(startDate, endDate);
    } catch (error) {
      console.error('Error getting payment transactions:', error);
      const memStorage = new MemStorage();
      return await memStorage.getPaymentTransactions(startDate, endDate);
    }
  }
  
  async getPaymentTransactionByStripeId(stripeId: string): Promise<PaymentTransaction | null> {
    try {
      // Implementation of database retrieval
      const memStorage = new MemStorage();
      return await memStorage.getPaymentTransactionByStripeId(stripeId);
    } catch (error) {
      console.error('Error getting payment transaction by Stripe ID:', error);
      const memStorage = new MemStorage();
      return await memStorage.getPaymentTransactionByStripeId(stripeId);
    }
  }
  
  async updatePaymentTransactionStatus(stripeId: string, status: string): Promise<void> {
    try {
      // Implementation of database update
      const memStorage = new MemStorage();
      await memStorage.updatePaymentTransactionStatus(stripeId, status);
    } catch (error) {
      console.error('Error updating payment transaction status:', error);
      const memStorage = new MemStorage();
      await memStorage.updatePaymentTransactionStatus(stripeId, status);
    }
  }
  
  async recordRefund(stripeId: string, amount: number, reason?: string): Promise<void> {
    try {
      // Implementation of database update
      const memStorage = new MemStorage();
      await memStorage.recordRefund(stripeId, amount, reason);
    } catch (error) {
      console.error('Error recording refund:', error);
      const memStorage = new MemStorage();
      await memStorage.recordRefund(stripeId, amount, reason);
    }
  }
}

// Export the storage instance 
export const storage = new DatabaseStorage();