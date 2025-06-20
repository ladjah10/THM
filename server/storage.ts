import { z } from "zod";
import { 
  User, type InsertUser, 
  type AssessmentResult, 
  type CoupleAssessmentReport, 
  type PageView, 
  type VisitorSession, 
  type AnalyticsSummary, 
  type PaymentTransaction, 
  type ReferralData, 
  type DemographicData,
  type UserProfile,
  type DifferenceAnalysis
} from "@shared/schema";

// Storage interface definition
export interface IStorage {
  // User management
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(insertUser: InsertUser): Promise<User>;
  
  // Assessment management
  saveAssessment(assessment: AssessmentResult): Promise<void>;
  getAssessments(email: string): Promise<AssessmentResult[]>;
  getAllAssessments(): Promise<AssessmentResult[]>;
  getAssessmentById(id: string): Promise<AssessmentResult | null>;
  getAssessment(id: string): Promise<AssessmentResult | null>;
  updateAssessment(id: string, assessment: AssessmentResult): Promise<void>;
  getRecalculatedAssessments(): Promise<AssessmentResult[]>;
  getCompletedAssessment(emailOrId: string): Promise<AssessmentResult | null>;
  
  // Couple assessment management
  saveCoupleAssessment(primaryAssessment: AssessmentResult, spouseEmail: string): Promise<string>;
  getCoupleAssessment(coupleId: string): Promise<CoupleAssessmentReport | null>;
  getAllCoupleAssessments(): Promise<CoupleAssessmentReport[]>;
  updateCoupleAssessment(id: string, report: CoupleAssessmentReport): Promise<void>;
  
  // Analytics and tracking
  recordPageView(pageView: PageView): Promise<void>;
  getAnalyticsSummary(period?: string, startDate?: string, endDate?: string): Promise<AnalyticsSummary>;
  
  // Payment tracking
  savePaymentTransaction(transaction: PaymentTransaction): Promise<void>;
  getPaymentTransactions(startDate?: string, endDate?: string): Promise<PaymentTransaction[]>;
  
  // Session management
  sessionStore: any;
}

// Memory-based storage implementation
class MemStorage {
  // Internal storage structures
  private users: User[] = [];
  private assessments: Map<string, AssessmentResult> = new Map();
  private coupleAssessments: Map<string, CoupleAssessmentReport> = new Map();
  private partialAssessments: Map<string, Partial<AssessmentResult>> = new Map();
  private pageViews: PageView[] = [];
  private sessions: Map<string, VisitorSession> = new Map();
  private payments: Map<string, PaymentTransaction> = new Map();
  private referrals: ReferralData[] = [];
  private promoCodesUsage: { promoCode: string, assessmentType: string, timestamp: string }[] = [];
  private assessmentLogs: { id: string, assessmentId?: string, coupleAssessmentId?: string, action: string, userEmail?: string, scoreSummary?: string, timestamp: string, metadata?: string }[] = [];

  // User management methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.find(user => user.id === id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return this.users.find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.users.length + 1;
    const user = { ...insertUser, id };
    this.users.push(user);
    return user;
  }

  // Method to record promo code usage
  async recordPromoCodeUsage(data: {promoCode: string, assessmentType: string, timestamp: string}): Promise<void> {
    this.promoCodesUsage.push(data);
    console.log('Promo code usage recorded in memory:', data.promoCode, data.assessmentType);
  }
  
  // Save assessment progress during assessment (for auto-save functionality)
  async saveAssessmentProgress(data: {
    email: string;
    demographicData: any;
    responses?: Record<string, { option: string; value: number }>;
    assessmentType: string;
    timestamp: string;
    completed: boolean;
  }): Promise<void> {
    console.log(`Saving assessment progress for email: ${data.email}`);
    
    try {
      // Use email as the identifier
      const tempId = data.email;
      
      // Create progress record with the data we have so far
      const progressData = {
        email: data.email,
        demographics: data.demographicData,
        responses: data.responses || {},
        timestamp: data.timestamp,
        isPartial: true,
        assessmentType: data.assessmentType,
        tempId
      };
      
      // Save in memory
      this.partialAssessments.set(tempId, progressData);
      
      // Also save to database for persistence
      // Connect to database pool
      try {
        // Save to database for persistence
        const query = `
          INSERT INTO assessment_progress 
          (email, demographic_data, responses, assessment_type, timestamp, completed) 
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (email) 
          DO UPDATE SET 
            demographic_data = $2,
            responses = $3,
            assessment_type = $4,
            timestamp = $5,
            completed = $6
        `;
        
        const values = [
          data.email,
          JSON.stringify(data.demographicData),
          JSON.stringify(data.responses || {}),
          data.assessmentType,
          data.timestamp,
          data.completed
        ];
        
        await this.pool.query(query, values);
        console.log(`Assessment progress saved to database for ${data.email}`);
      } catch (dbError) {
        console.error('Error saving progress to database:', dbError);
        // Continue with memory storage even if database fails
      }
    } catch (error) {
      console.error('Error in saveAssessmentProgress:', error);
      throw error;
    }
  }

  // Method to get assessment progress for the continue feature
  async getAssessmentProgress(emailOrTempId: string): Promise<Partial<AssessmentResult> | null> {
    // First check by email in database if available
    if (this.pool) {
      try {
        const query = 'SELECT * FROM assessment_progress WHERE email = $1 ORDER BY timestamp DESC LIMIT 1';
        const result = await this.pool.query(query, [emailOrTempId]);
        
        if (result.rows.length > 0) {
          const row = result.rows[0];
          return {
            demographics: row.demographic_data,
            responses: row.responses || {},
            assessmentType: row.assessment_type,
            timestamp: row.timestamp,
            completed: row.completed || false
          };
        }
      } catch (error) {
        console.error('Error fetching from database:', error);
      }
    }
    
    // Fallback to memory storage
    return this.partialAssessments.get(emailOrTempId) || null;
  }

  // Assessment methods
  async saveAssessment(assessment: AssessmentResult): Promise<void> {
    // Use email as the key for individual assessments when no couple ID present
    const key = assessment.coupleId || assessment.demographics.email;
    this.assessments.set(key, assessment);
    console.log(`Assessment saved in memory for ${assessment.demographics.email}`);
  }

  async getAssessments(email: string): Promise<AssessmentResult[]> {
    const assessments: AssessmentResult[] = [];
    this.assessments.forEach(assessment => {
      if (assessment.demographics.email === email) {
        assessments.push(assessment);
      }
    });
    return assessments;
  }

  async getAllAssessments(): Promise<AssessmentResult[]> {
    const allAssessments = Array.from(this.assessments.values());
    
    // Optionally include couple assessments as individual entries
    // This helps the admin dashboard show complete data
    const coupleEntries: AssessmentResult[] = [];
    
    for (const coupleReport of this.coupleAssessments.values()) {
      // Add primary assessment if not already in the list
      if (!allAssessments.find(a => a.id === coupleReport.primary.id)) {
        coupleEntries.push(coupleReport.primary);
      }
      
      // Add spouse assessment if not already in the list
      if (!allAssessments.find(a => a.id === coupleReport.spouse.id)) {
        coupleEntries.push(coupleReport.spouse);
      }
    }
    
    return [...allAssessments, ...coupleEntries];
  }

  async getAssessmentById(id: string): Promise<AssessmentResult | null> {
    // First check individual assessments by ID
    for (const assessment of this.assessments.values()) {
      if (assessment.id === id) {
        return assessment;
      }
    }
    
    // If not found in individual assessments, check if it's a couple assessment ID
    const coupleAssessment = this.coupleAssessments.get(id);
    if (coupleAssessment) {
      // Return the primary assessment from the couple report
      return coupleAssessment.primary;
    }
    
    // Check if any individual assessment has this coupleId
    for (const assessment of this.assessments.values()) {
      if (assessment.coupleId === id) {
        return assessment;
      }
    }
    
    return null;
  }

  async getAssessment(id: string): Promise<AssessmentResult | null> {
    return this.getAssessmentById(id);
  }

  async updateAssessment(id: string, updatedAssessment: AssessmentResult): Promise<void> {
    // Update assessment by ID
    for (const [email, assessment] of this.assessments.entries()) {
      if (assessment.id === id) {
        this.assessments.set(email, updatedAssessment);
        console.log(`Assessment updated in memory for ${email} (ID: ${id})`);
        return;
      }
    }
    
    // If not found by ID, try to find by email
    if (updatedAssessment.email) {
      this.assessments.set(updatedAssessment.email, updatedAssessment);
      console.log(`Assessment updated in memory for ${updatedAssessment.email}`);
    }
  }

  async updateCoupleAssessment(id: string, report: CoupleAssessmentReport): Promise<void> {
    this.coupleAssessments.set(id, report);
    console.log(`Couple assessment updated in memory (ID: ${id})`);
  }
  
  // Get a completed assessment by email or ID
  async getCompletedAssessment(emailOrId: string): Promise<AssessmentResult | null> {
    // First try by email
    const assessment = this.assessments.get(emailOrId);
    if (assessment) return assessment;
    
    // Then try by ID
    for (const assessment of this.assessments.values()) {
      if (assessment.id === emailOrId) {
        return assessment;
      }
    }
    
    return null;
  }

  // Get recalculated assessments (for memory storage, return all assessments)
  async getRecalculatedAssessments(): Promise<AssessmentResult[]> {
    // In memory storage, we don't distinguish between recalculated and original
    // Return all assessments for compatibility
    return Array.from(this.assessments.values());
  }
  
  // Get a couple assessment by email (checks both primary and spouse emails)
  async getCoupleAssessmentByEmail(email: string): Promise<CoupleAssessmentReport | null> {
    // Look through all couple assessments
    for (const coupleAssessment of this.coupleAssessments.values()) {
      if (coupleAssessment.primaryAssessment.email === email || 
          coupleAssessment.spouseAssessment?.email === email) {
        return coupleAssessment;
      }
    }
    return null;
  }

  // Couple assessment methods
  async saveCoupleAssessment(primaryAssessment: AssessmentResult, spouseEmail: string): Promise<string> {
    // Generate a unique couple ID
    const coupleId = `${primaryAssessment.demographics.email}_${spouseEmail}_${Date.now()}`;
    
    // Update the primary assessment with the couple ID
    const updatedPrimaryAssessment = { ...primaryAssessment, coupleId, coupleRole: 'primary' as const };
    
    // Save the updated primary assessment
    await this.saveAssessment(updatedPrimaryAssessment);
    
    return coupleId;
  }

  async getSpouseAssessment(coupleId: string, role: 'primary' | 'spouse'): Promise<AssessmentResult | null> {
    for (const assessment of this.assessments.values()) {
      if (assessment.coupleId === coupleId && assessment.coupleRole === role) {
        return assessment;
      }
    }
    return null;
  }

  async saveCoupleAssessmentReport(report: CoupleAssessmentReport): Promise<void> {
    this.coupleAssessments.set(report.coupleId, report);
    console.log(`Couple assessment saved in memory for couple ID: ${report.coupleId}`);
  }

  async getCoupleAssessment(coupleId: string): Promise<CoupleAssessmentReport | null> {
    return this.coupleAssessments.get(coupleId) || null;
  }

  async getAllCoupleAssessments(): Promise<CoupleAssessmentReport[]> {
    return Array.from(this.coupleAssessments.values());
  }

  // Referral methods
  async saveReferral(referral: ReferralData): Promise<void> {
    this.referrals.push(referral);
    console.log(`Referral saved in memory: ${referral.referrerEmail} referred ${referral.recipientEmail}`);
  }

  async getAllReferrals(): Promise<ReferralData[]> {
    return this.referrals;
  }

  async updateReferralStatus(id: string, status: 'sent' | 'completed' | 'expired', completedTimestamp?: string): Promise<void> {
    const index = this.referrals.findIndex(ref => ref.id === id);
    if (index !== -1) {
      this.referrals[index].status = status;
      if (completedTimestamp) {
        this.referrals[index].completedTimestamp = completedTimestamp;
      }
      console.log(`Referral ${id} status updated to ${status}`);
    }
  }

  // Analytics methods
  async recordPageView(pageView: PageView): Promise<void> {
    this.pageViews.push(pageView);
    console.log(`Page view recorded in memory: ${pageView.path}`);
  }

  async createVisitorSession(session: VisitorSession): Promise<void> {
    this.sessions.set(session.id, session);
    console.log(`Visitor session created in memory: ${session.id}`);
  }

  async updateVisitorSession(sessionId: string, endTime: string, pageCount: number): Promise<void> {
    const session = this.sessions.get(sessionId);
    if (session) {
      session.endTime = endTime;
      session.pageCount = pageCount;
      this.sessions.set(sessionId, session);
      console.log(`Visitor session updated in memory: ${sessionId}`);
    }
  }

  async getPageViews(startDate?: string, endDate?: string): Promise<PageView[]> {
    if (!startDate && !endDate) {
      return this.pageViews;
    }
    
    return this.pageViews.filter(view => {
      const viewDate = new Date(view.timestamp);
      const isAfterStart = !startDate || viewDate >= new Date(startDate);
      const isBeforeEnd = !endDate || viewDate <= new Date(endDate);
      return isAfterStart && isBeforeEnd;
    });
  }

  async getVisitorSessions(startDate?: string, endDate?: string): Promise<VisitorSession[]> {
    const sessions = Array.from(this.sessions.values());
    
    if (!startDate && !endDate) {
      return sessions;
    }
    
    return sessions.filter(session => {
      const sessionDate = new Date(session.startTime);
      const isAfterStart = !startDate || sessionDate >= new Date(startDate);
      const isBeforeEnd = !endDate || sessionDate <= new Date(endDate);
      return isAfterStart && isBeforeEnd;
    });
  }

  async getAnalyticsSummary(period: 'day' | 'week' | 'month' | 'year'): Promise<AnalyticsSummary> {
    // Calculate the start date based on the period
    const now = new Date();
    let startDate = new Date(now);
    
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
    
    // Filter page views and sessions within the time period
    const filteredPageViews = await this.getPageViews(startDate.toISOString(), now.toISOString());
    const filteredSessions = await this.getVisitorSessions(startDate.toISOString(), now.toISOString());
    
    // Calculate metrics
    const totalPageViews = filteredPageViews.length;
    const uniqueVisitors = new Set(filteredSessions.map(s => s.id)).size;
    const averageSessionDuration = filteredSessions.reduce((total, session) => {
      if (session.endTime) {
        const duration = new Date(session.endTime).getTime() - new Date(session.startTime).getTime();
        return total + duration;
      }
      return total;
    }, 0) / Math.max(1, filteredSessions.length);
    
    // Get popular pages
    const pageCounts = filteredPageViews.reduce<Record<string, number>>((counts, view) => {
      counts[view.path] = (counts[view.path] || 0) + 1;
      return counts;
    }, {});
    
    const popularPages = Object.entries(pageCounts)
      .sort(([, countA], [, countB]) => countB - countA)
      .slice(0, 5)
      .map(([path, count]) => ({ path, count }));
    
    return {
      periodStart: startDate.toISOString(),
      periodEnd: now.toISOString(),
      totalPageViews,
      uniqueVisitors,
      averageSessionDuration,
      popularPages,
    };
  }

  // Update assessment with pool application status after payment
  async updateAssessmentPoolStatus(email: string, transactionId: string): Promise<void> {
    // Update assessment progress if exists
    const progressData = await this.getAssessmentProgress(email);
    if (progressData && progressData.demographics) {
      progressData.demographics.thmPoolApplied = true;
      await this.saveAssessmentProgress({
        email: progressData.demographics.email,
        demographicData: progressData.demographics,
        responses: progressData.responses || {},
        assessmentType: progressData.assessmentType || 'individual',
        timestamp: new Date().toISOString(),
        completed: progressData.completed || false
      });
      
      console.log(`✅ Updated pool status for ${email} after payment ${transactionId}`);
    }

    // Also update completed assessments if they exist
    const assessment = this.assessments.get(email);
    if (assessment) {
      assessment.demographics.thmPoolApplied = true;
      assessment.transactionId = transactionId;
      this.assessments.set(email, assessment);
      console.log(`✅ Updated completed assessment pool status for ${email}`);
    }

    // Update in database if available
    if (this.pool) {
      try {
        await this.pool.query(
          'UPDATE assessment_progress SET demographic_data = jsonb_set(demographic_data, \'{thmPoolApplied}\', \'true\') WHERE email = $1',
          [email]
        );
        await this.pool.query(
          'UPDATE assessment_results SET demographic_data = jsonb_set(demographic_data, \'{thmPoolApplied}\', \'true\'), transaction_id = $2 WHERE email = $1',
          [email, transactionId]
        );
      } catch (error) {
        console.error('Error updating database for pool status:', error);
      }
    }
  }

  // Payment methods
  async savePaymentTransaction(transaction: PaymentTransaction): Promise<void> {
    this.payments.set(transaction.stripeId, transaction);
    console.log(`Payment transaction saved in memory: ${transaction.stripeId}`);
  }

  async getPaymentTransactions(startDate?: string, endDate?: string): Promise<PaymentTransaction[]> {
    const transactions = Array.from(this.payments.values());
    
    if (!startDate && !endDate) {
      return transactions;
    }
    
    return transactions.filter(transaction => {
      const txDate = new Date(transaction.created);
      const isAfterStart = !startDate || txDate >= new Date(startDate);
      const isBeforeEnd = !endDate || txDate <= new Date(endDate);
      return isAfterStart && isBeforeEnd;
    });
  }

  async getPaymentTransactionByStripeId(stripeId: string): Promise<PaymentTransaction | null> {
    return this.payments.get(stripeId) || null;
  }

  async updatePaymentTransactionStatus(stripeId: string, status: string): Promise<void> {
    const transaction = this.payments.get(stripeId);
    if (transaction) {
      transaction.status = status;
      this.payments.set(stripeId, transaction);
      console.log(`Payment transaction status updated in memory: ${stripeId} -> ${status}`);
    }
  }
  
  async updatePaymentTransactionEmail(stripeId: string, email: string): Promise<void> {
    const transaction = this.payments.get(stripeId);
    if (transaction) {
      transaction.customerEmail = email;
      
      // Also update the metadata if it exists
      if (transaction.metadata) {
        try {
          const metadataObj = typeof transaction.metadata === 'string' 
            ? JSON.parse(transaction.metadata) 
            : transaction.metadata;
          
          metadataObj.email = email;
          transaction.metadata = JSON.stringify(metadataObj);
        } catch (err) {
          console.error('Error updating email in memory transaction metadata:', err);
        }
      }
      
      this.payments.set(stripeId, transaction);
      console.log(`Payment transaction email updated in memory: ${stripeId} -> ${email}`);
    } else {
      console.log(`No payment transaction found in memory for ${stripeId} when updating email`);
    }
  }

  async recordRefund(stripeId: string, amount: number, reason?: string): Promise<void> {
    const transaction = this.payments.get(stripeId);
    if (transaction) {
      transaction.isRefunded = true;
      transaction.refundAmount = amount;
      if (reason) {
        transaction.refundReason = reason;
      }
      this.payments.set(stripeId, transaction);
      console.log(`Refund recorded in memory for transaction: ${stripeId}`);
    }
  }
  
  async getPaymentTransactionsWithAssessments(startDate?: string, endDate?: string): Promise<PaymentTransaction[]> {
    console.log('Fetching payment transactions with assessments from memory');
    // Get the basic transactions
    const transactions = await this.getPaymentTransactions(startDate, endDate);
    
    // For each transaction, try to find matching assessment data
    return transactions.map(transaction => {
      // Try to extract demographics from metadata if present
      if (transaction.metadata) {
        const metadata = transaction.metadata;
        return {
          ...transaction,
          assessmentData: {
            email: transaction.customerEmail || '',
            firstName: metadata.firstName || metadata.first_name || '',
            lastName: metadata.lastName || metadata.last_name || '',
            gender: metadata.gender || '',
            marriageStatus: metadata.marriageStatus || metadata.marriage_status || '',
            desireChildren: metadata.desireChildren || metadata.desire_children || '',
            ethnicity: metadata.ethnicity || '',
            city: metadata.city || '',
            state: metadata.state || '',
            zipCode: metadata.zipCode || metadata.zip_code || ''
          }
        };
      }
      
      // Return the transaction as is if no metadata found
      return transaction;
    });
  }

  // Couple Assessment Methods
  async saveCoupleAssessment(data: {
    coupleId: string;
    primaryId: string;
    spouseId: string;
    analysis: string;
    compatibilityScore: string;
    recommendations: string;
    reportSent: boolean;
  }): Promise<{ id: string }> {
    const id = `couple_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const coupleAssessment = {
      id,
      coupleId: data.coupleId,
      primaryId: data.primaryId,
      spouseId: data.spouseId,
      analysis: data.analysis,
      compatibilityScore: data.compatibilityScore,
      recommendations: data.recommendations,
      reportSent: data.reportSent,
      timestamp: new Date().toISOString()
    };
    
    this.coupleAssessments.set(id, coupleAssessment as any);
    console.log(`Couple assessment saved in memory with ID: ${id}`);
    return { id };
  }

  async updateCoupleAssessmentReportStatus(id: string, reportSent: boolean): Promise<void> {
    const assessment = this.coupleAssessments.get(id);
    if (assessment) {
      (assessment as any).reportSent = reportSent;
      this.coupleAssessments.set(id, assessment);
      console.log(`Couple assessment report status updated in memory: ${id} -> ${reportSent}`);
    }
  }

  // Assessment Logging Methods
  async logAssessmentAction(data: {
    assessmentId?: string;
    coupleAssessmentId?: string;
    action: string;
    userEmail?: string;
    scoreSummary?: string;
    metadata?: string;
  }): Promise<{ id: string }> {
    const id = `log_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const logEntry = {
      id,
      assessmentId: data.assessmentId,
      coupleAssessmentId: data.coupleAssessmentId,
      action: data.action,
      userEmail: data.userEmail,
      scoreSummary: data.scoreSummary,
      timestamp: new Date().toISOString(),
      metadata: data.metadata
    };
    
    this.assessmentLogs.push(logEntry);
    console.log(`Assessment action logged in memory: ${data.action} for ${data.userEmail || 'unknown user'}`);
    return { id };
  }

  async getAssessmentLogs(limit: number = 100): Promise<any[]> {
    return this.assessmentLogs
      .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
      .slice(0, limit);
  }
}

// Database storage implementation
// Import the pool from db
import { pool } from './db';

export class DatabaseStorage implements IStorage {
  // Shared memory storage for fallback
  private memStorage: MemStorage;
  sessionStore: any;
  
  constructor() {
    // Initialize database connection and memory fallback
    this.memStorage = new MemStorage();
    
    // Create a simple memory session store for now
    // The actual session store will be properly initialized in the auth module
    // where it imports express-session directly
    this.sessionStore = {
      all: () => ({}),
      destroy: () => {},
      clear: () => {},
      length: () => 0,
      get: () => null,
      set: () => {},
      touch: () => {}
    };
    
    console.log('Database storage initialized with memory fallback');
  }
  
  // Method to record promo code usage
  async recordPromoCodeUsage(data: {promoCode: string, email?: string, assessmentType: string, timestamp: string}): Promise<void> {
    console.log(`Recording promo code usage in database: ${data.promoCode} for ${data.assessmentType} assessment`);
    
    try {
      // Save to database
      const query = `
        INSERT INTO promo_code_usage
        (promo_code, email, assessment_type, timestamp)
        VALUES ($1, $2, $3, $4)
      `;
      
      const values = [
        data.promoCode,
        data.email || null,
        data.assessmentType,
        data.timestamp
      ];
      
      await pool.query(query, values);
      console.log(`Promo code usage recorded in database: ${data.promoCode}`);
    } catch (dbError) {
      console.error('Error recording promo code usage to database:', dbError);
      
      // Try to create table if it doesn't exist
      try {
        await pool.query(`
          CREATE TABLE IF NOT EXISTS promo_code_usage (
            id SERIAL PRIMARY KEY,
            promo_code TEXT NOT NULL,
            email TEXT,
            assessment_type TEXT NOT NULL,
            timestamp TEXT NOT NULL
          )
        `);
        
        // Retry the insert
        const query = `
          INSERT INTO promo_code_usage
          (promo_code, email, assessment_type, timestamp)
          VALUES ($1, $2, $3, $4)
        `;
        
        const values = [
          data.promoCode,
          data.email || null,
          data.assessmentType,
          data.timestamp
        ];
        
        await pool.query(query, values);
        console.log(`Created table and recorded promo code usage: ${data.promoCode}`);
      } catch (createError) {
        console.error('Error creating promo code usage table:', createError);
      }
    }
    
    // Record in memory storage as fallback
    await this.memStorage.recordPromoCodeUsage(data);
  }
  
  // Method to check if a promo code is valid
  async isValidPromoCode(promoCode: string, assessmentType: string): Promise<boolean> {
    // List of valid promo codes
    const validPromoCodes = {
      individual: ['FREE100', 'LA2025', 'MARRIAGE100', 'INVITED10'],
      couple: ['FREE100', 'LA2025', 'MARRIAGE100', 'INVITED10', 'COUPLETEST']
    };
    
    // Check if the promo code is in the valid list for the assessment type
    const isValid = validPromoCodes[assessmentType as keyof typeof validPromoCodes]?.includes(promoCode) || false;
    
    console.log(`Promo code ${promoCode} is ${isValid ? 'valid' : 'invalid'} for ${assessmentType} assessment`);
    return isValid;
  }
  
  // Save assessment progress during assessment (for auto-save functionality)
  async saveAssessmentProgress(data: {
    email: string;
    demographicData: any;
    responses?: Record<string, { option: string; value: number }>;
    assessmentType: string;
    timestamp: string;
    completed: boolean;
  }): Promise<void> {
    try {
      console.log(`Saving assessment progress for email: ${data.email}`);
      
      try {
        // First, try to save to the database
        const query = `
          INSERT INTO assessment_progress 
          (email, demographic_data, responses, assessment_type, timestamp, completed) 
          VALUES ($1, $2, $3, $4, $5, $6)
          ON CONFLICT (email) 
          DO UPDATE SET 
            demographic_data = EXCLUDED.demographic_data,
            responses = EXCLUDED.responses,
            assessment_type = EXCLUDED.assessment_type,
            timestamp = EXCLUDED.timestamp,
            completed = EXCLUDED.completed
        `;
        
        const values = [
          data.email,
          JSON.stringify(data.demographicData),
          JSON.stringify(data.responses || {}),
          data.assessmentType,
          data.timestamp,
          data.completed
        ];
        
        await pool.query(query, values);
        console.log(`Assessment progress saved to database for ${data.email}`);
      } catch (dbError) {
        console.error('Error saving progress to database:', dbError);
        
        // Create table if it doesn't exist yet
        try {
          await pool.query(`
            CREATE TABLE IF NOT EXISTS assessment_progress (
              email TEXT PRIMARY KEY,
              demographic_data JSONB NOT NULL,
              responses JSONB NOT NULL DEFAULT '{}'::jsonb,
              assessment_type TEXT NOT NULL,
              timestamp TEXT NOT NULL,
              completed BOOLEAN NOT NULL DEFAULT FALSE
            )
          `);
          
          // Try the save operation again
          const query = `
            INSERT INTO assessment_progress 
            (email, demographic_data, responses, assessment_type, timestamp, completed) 
            VALUES ($1, $2, $3, $4, $5, $6)
            ON CONFLICT (email) 
            DO UPDATE SET 
              demographic_data = EXCLUDED.demographic_data,
              responses = EXCLUDED.responses,
              assessment_type = EXCLUDED.assessment_type,
              timestamp = EXCLUDED.timestamp,
              completed = EXCLUDED.completed
          `;
          
          const values = [
            data.email,
            JSON.stringify(data.demographicData),
            JSON.stringify(data.responses || {}),
            data.assessmentType,
            data.timestamp,
            data.completed
          ];
          
          await pool.query(query, values);
          console.log(`Created table and saved assessment progress to database for ${data.email}`);
        } catch (createError) {
          console.error('Error creating table and retrying save:', createError);
        }
      }
      
      // Create a temporary MemStorage method to save the progress as fallback
      // Using a function instead of direct property access since partialAssessments is private
      const tempId = data.email;
      const progressData = {
        email: data.email,
        demographics: data.demographicData,
        responses: data.responses || {},
        timestamp: data.timestamp,
        isPartial: true,
        assessmentType: data.assessmentType,
        tempId
      };
      
      // Use the shared memory storage instance with a workaround
      // Instead of accessing private property, use the method that already exists
      await this.memStorage.saveAssessmentProgress({
        email: data.email,
        demographicData: data.demographicData,
        responses: data.responses || {},
        assessmentType: data.assessmentType,
        timestamp: data.timestamp,
        completed: data.completed
      });
    } catch (error) {
      console.error('Error in saveAssessmentProgress:', error);
      throw error;
    }
  }
  
  async getUser(id: number): Promise<User | undefined> {
    try {
      // Implementation would use database access
      // Use shared memory storage as fallback
      return await this.memStorage.getUser(id);
    } catch (error) {
      console.error('Error getting user:', error);
      return await this.memStorage.getUser(id);
    }
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    try {
      // Implementation would use database access
      // Use shared memory storage as fallback
      return await this.memStorage.getUserByUsername(username);
    } catch (error) {
      console.error('Error getting user by username:', error);
      return await this.memStorage.getUserByUsername(username);
    }
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    try {
      // Implementation would use database access
      // Use shared memory storage as fallback
      return await this.memStorage.createUser(insertUser);
    } catch (error) {
      console.error('Error creating user:', error);
      return await this.memStorage.createUser(insertUser);
    }
  }
  
  // Check for assessments marked as completed and transfer them to results
  async transferCompletedAssessments(): Promise<void> {
    try {
      console.log('Checking for completed assessments to transfer to results...');
      const { pool } = await import('./db');
      const { calculateAssessmentWithResponses } = await import('./assessmentUtils');
      
      // Find all completed assessments
      const findCompletedQuery = `
        SELECT email, demographic_data, responses, assessment_type, timestamp, completed
        FROM assessment_progress
        WHERE completed = true
        AND (transfer_complete IS NULL OR transfer_complete = false)
      `;
      
      const completedResults = await pool.query(findCompletedQuery);
      console.log(`Found ${completedResults.rows.length} completed assessments to transfer`);
      
      // Process each completed assessment
      for (const row of completedResults.rows) {
        try {
          const email = row.email;
          const demographicData = row.demographic_data;
          const responses = row.responses;
          
          console.log(`Processing completed assessment for ${email}`);
          
          // Calculate scores and profiles for the assessment
          const assessmentData = await calculateAssessmentWithResponses(
            email,
            demographicData,
            responses
          );
          
          if (assessmentData) {
            // Save the processed assessment to results
            await this.saveAssessment(assessmentData);
            console.log(`Successfully transferred assessment for ${email} to results`);
            
            // Mark as transferred in the progress table
            try {
              const updateQuery = `
                UPDATE assessment_progress
                SET transfer_complete = true
                WHERE email = $1
              `;
              await pool.query(updateQuery, [email]);
            } catch (updateError) {
              // If the update fails, try to create the column first
              try {
                await pool.query(`
                  ALTER TABLE assessment_progress 
                  ADD COLUMN IF NOT EXISTS transfer_complete BOOLEAN DEFAULT false
                `);
                
                // Try update again
                await pool.query(`
                  UPDATE assessment_progress
                  SET transfer_complete = true
                  WHERE email = $1
                `, [email]);
              } catch (alterError) {
                console.error('Error updating transfer status:', alterError);
              }
            }
          }
        } catch (processError) {
          console.error(`Error processing assessment for ${row.email}:`, processError);
          // Continue with next assessment
        }
      }
    } catch (error) {
      console.error('Error transferring completed assessments:', error);
    }
  }

  async saveAssessment(assessment: AssessmentResult): Promise<void> {
    try {
      // Store in the database using the assessmentResults table
      const { db } = await import('./db');
      const { assessmentResults } = await import('@shared/schema');
      const { pool } = await import('./db');
      
      // Add enhanced logging to track gender profile information
      console.log(`Saving assessment for ${assessment.name} with gender: ${assessment.demographics.gender}`);
      console.log(`Gender profile present: ${!!assessment.genderProfile}`);
      
      if (assessment.genderProfile) {
        console.log(`Gender profile details: ID=${assessment.genderProfile.id}, Name=${assessment.genderProfile.name}`);
      } else {
        console.log('WARNING: Gender profile is missing even though gender is specified');
      }
      
      const jsonScores = JSON.stringify(assessment.scores);
      const jsonProfile = JSON.stringify(assessment.profile);
      const jsonGenderProfile = assessment.genderProfile ? JSON.stringify(assessment.genderProfile) : null;
      const jsonResponses = JSON.stringify(assessment.responses);
      const jsonDemographics = JSON.stringify(assessment.demographics);
      
      // Check for duplicate submission in the last 5 minutes
      const responseHash = require('crypto').createHash('md5').update(jsonResponses).digest('hex');
      const checkDuplicateQuery = `
        SELECT id FROM assessment_results 
        WHERE email = $1 
        AND md5(responses::text) = $2
        AND timestamp > NOW() - INTERVAL '5 minutes'
        LIMIT 1
      `;
      
      const duplicateResult = await pool.query(checkDuplicateQuery, [
        assessment.demographics.email,
        responseHash
      ]);
      
      if (duplicateResult.rows.length > 0) {
        console.log(`Duplicate assessment detected for ${assessment.demographics.email} - skipping save`);
        return; // Skip saving duplicate assessments
      }
      
      // If no duplicate found, insert into database using column names directly from schema
      // Important: Use column names that match database schema (snake_case) but map from our camelCase properties
      // To fix the gender profile issue, we're storing it in both potential column names
      const insertValues: any = {
        email: assessment.demographics.email,
        name: `${assessment.demographics.firstName} ${assessment.demographics.lastName}`,
        scores: jsonScores,
        profile: jsonProfile,
        responses: jsonResponses,
        demographics: jsonDemographics,
        rawAnswers: assessment.rawAnswers ? JSON.stringify(assessment.rawAnswers) : null,
        couple_id: assessment.coupleId,
        couple_role: assessment.coupleRole
        // transaction_id will be linked when a payment is made
      };
      
      // Store the gender profile using both potential column names to ensure compatibility
      if (jsonGenderProfile) {
        insertValues.gender_profile = jsonGenderProfile;
        insertValues.genderProfile = jsonGenderProfile;
        console.log(`Storing gender profile for ${assessment.demographics.email} under both column names`);
      }
      
      await db.insert(assessmentResults).values(insertValues);
      
      console.log(`Assessment saved to database for ${assessment.demographics.email}`);
      
      // Still keep in memory as a fallback
      await this.memStorage.saveAssessment(assessment);
    } catch (error) {
      console.error('Error saving assessment to database:', error);
      // Fall back to memory storage if database operation fails
      await this.memStorage.saveAssessment(assessment);
    }
  }
  
  async getAssessments(email: string): Promise<AssessmentResult[]> {
    try {
      // Get assessments from the database for a specific email
      const { pool } = await import('./db');
      
      const results = await pool.query(`
        SELECT id, email, name, scores, profile, gender_profile, responses, 
               demographics, timestamp, transaction_id, couple_id, couple_role, report_sent
        FROM assessment_results
        WHERE email = $1
        ORDER BY timestamp DESC
      `, [email]);
      
      // Transform DB results into AssessmentResult objects
      const assessments: AssessmentResult[] = results.rows.map((row: any) => {
        const scores = JSON.parse(row.scores);
        const profile = JSON.parse(row.profile);
        const responses = JSON.parse(row.responses);
        const demographics = JSON.parse(row.demographics);
        
        // Parse gender profile if it exists - handle both snake_case and camelCase property names
        // This fix handles a critical issue where male profiles weren't being properly retrieved
        let genderProfile = null;
        if (row.gender_profile) {
          console.log(`Found gender_profile in database row for ${row.email}`);
          genderProfile = JSON.parse(row.gender_profile);
        } else if (row.genderProfile) {
          console.log(`Found genderProfile in database row for ${row.email}`);
          genderProfile = JSON.parse(row.genderProfile);
        } else {
          console.log(`WARNING: No gender profile found for ${row.email}`);
        }
        
        return {
          id: row.id,
          email: row.email,
          name: row.name,
          scores: scores,
          profile: profile,
          genderProfile: genderProfile,
          responses: responses,
          demographics: demographics,
          timestamp: row.timestamp.toISOString(),
          transactionId: row.transaction_id,
          coupleId: row.couple_id,
          coupleRole: row.couple_role,
          reportSent: row.report_sent
        };
      });
      
      console.log(`Retrieved ${assessments.length} assessments from database for email: ${email}`);
      return assessments;
    } catch (error) {
      console.error(`Error getting assessments from database for email ${email}:`, error);
      // Only fall back to memory storage if database query fails
      return await this.memStorage.getAssessments(email);
    }
  }
  
  async getAllAssessments(): Promise<AssessmentResult[]> {
    try {
      // Get all assessments from the database
      const { pool } = await import('./db');
      
      const results = await pool.query(`
        SELECT id, email, name, scores, profile, gender_profile, responses, 
               demographics, raw_answers, timestamp, updated_at, recalculated, 
               last_recalculated, original_score, original_profile, recalculated_pdf_path,
               transaction_id, couple_id, couple_role, report_sent
        FROM assessment_results
        ORDER BY timestamp DESC
      `);
      
      console.log(`Database query returned ${results.rows.length} assessment records`);
      if (results.rows.length > 0) {
        console.log('Sample assessment from database:', results.rows[0].email);
      }
      
      // Transform DB results into AssessmentResult objects
      const assessments: AssessmentResult[] = results.rows.map((row: any) => {
        // Carefully parse the scores to ensure numeric values are properly handled
        let scores;
        try {
          scores = JSON.parse(row.scores);
          
          // Fix/validate overallPercentage as a number
          if (typeof scores.overallPercentage === 'string') {
            scores.overallPercentage = parseFloat(scores.overallPercentage);
          }
          
          // Fix/validate section percentages
          if (scores.sections) {
            Object.keys(scores.sections).forEach(sectionKey => {
              const section = scores.sections[sectionKey];
              if (section) {
                if (typeof section.percentage === 'string') {
                  section.percentage = parseFloat(section.percentage);
                }
                if (typeof section.earned === 'string') {
                  section.earned = parseFloat(section.earned);
                }
                if (typeof section.possible === 'string') {
                  section.possible = parseFloat(section.possible);
                }
              }
            });
          }
          
          // Fix/validate totalEarned and totalPossible
          if (typeof scores.totalEarned === 'string') {
            scores.totalEarned = parseFloat(scores.totalEarned);
          }
          if (typeof scores.totalPossible === 'string') {
            scores.totalPossible = parseFloat(scores.totalPossible);
          }
        } catch (error) {
          console.error('Error parsing scores JSON:', error);
          scores = { 
            overallPercentage: 0, 
            sections: {}, 
            strengths: [], 
            improvementAreas: [],
            totalEarned: 0,
            totalPossible: 0
          };
        }
        
        const profile = JSON.parse(row.profile);
        const responses = JSON.parse(row.responses);
        const demographics = JSON.parse(row.demographics);
        
        // Parse gender profile if it exists - handle both snake_case and camelCase property names
        // This fix ensures both male and female profiles are properly retrieved
        let genderProfile = null;
        if (row.gender_profile) {
          console.log(`Found gender_profile in database row for ${row.email}`);
          genderProfile = JSON.parse(row.gender_profile);
        } else if (row.genderProfile) {
          console.log(`Found genderProfile in database row for ${row.email}`);
          genderProfile = JSON.parse(row.genderProfile);
        } else {
          console.log(`WARNING: No gender profile found for ${row.email}`);
        }
        
        return {
          id: row.id,
          email: row.email,
          name: row.name,
          scores: scores,
          profile: profile,
          genderProfile: genderProfile,
          responses: responses,
          demographics: demographics,
          rawAnswers: row.raw_answers ? JSON.parse(row.raw_answers) : undefined,
          timestamp: row.timestamp.toISOString(),
          updatedAt: row.updated_at ? row.updated_at.toISOString() : undefined,
          recalculated: row.recalculated || false,
          lastRecalculated: row.last_recalculated ? row.last_recalculated.toISOString() : undefined,
          originalScore: row.original_score || undefined,
          originalProfile: row.original_profile || undefined,
          recalculatedPdfPath: row.recalculated_pdf_path || undefined,
          transactionId: row.transaction_id,
          coupleId: row.couple_id,
          coupleRole: row.couple_role,
          reportSent: row.report_sent
        };
      });
      
      console.log(`Retrieved ${assessments.length} assessments from database`);
      return assessments;
    } catch (error) {
      console.error('Error getting all assessments from database:', error);
      // Only fall back to memory storage if database query fails
      return await this.memStorage.getAllAssessments();
    }
  }

  async getAssessmentById(id: string): Promise<AssessmentResult | null> {
    try {
      // Get assessment from database by ID
      const { pool } = await import('./db');
      
      const results = await pool.query(`
        SELECT id, email, name, scores, profile, gender_profile, responses, 
               demographics, raw_answers, timestamp, updated_at, recalculated, 
               last_recalculated, original_score, original_profile, recalculated_pdf_path,
               transaction_id, couple_id, couple_role, report_sent
        FROM assessment_results
        WHERE id = $1
        LIMIT 1
      `, [id]);
      
      if (results.rows.length === 0) {
        console.log(`No assessment found in database for ID: ${id}`);
        // Fall back to memory storage
        return await this.memStorage.getAssessmentById(id);
      }
      
      const row = results.rows[0];
      
      // Parse scores and handle potential string values
      let scores;
      try {
        scores = JSON.parse(row.scores);
        
        if (typeof scores.overallPercentage === 'string') {
          scores.overallPercentage = parseFloat(scores.overallPercentage);
        }
        
        if (scores.sections) {
          Object.keys(scores.sections).forEach(section => {
            if (typeof scores.sections[section].percentage === 'string') {
              scores.sections[section].percentage = parseFloat(scores.sections[section].percentage);
            }
          });
        }
      } catch (e) {
        console.error(`Error parsing scores for assessment ${id}:`, e);
        scores = { 
          overallPercentage: 0, 
          sections: {}, 
          strengths: [], 
          improvementAreas: [],
          totalEarned: 0,
          totalPossible: 0
        };
      }
      
      const profile = JSON.parse(row.profile);
      const responses = JSON.parse(row.responses);
      const demographics = JSON.parse(row.demographics);
      
      // Parse gender profile with fallback handling
      let genderProfile = null;
      if (row.gender_profile) {
        genderProfile = JSON.parse(row.gender_profile);
      } else if (row.genderProfile) {
        genderProfile = JSON.parse(row.genderProfile);
      }
      
      const assessment: AssessmentResult = {
        id: row.id,
        email: row.email,
        name: row.name,
        scores: scores,
        profile: profile,
        genderProfile: genderProfile,
        responses: responses,
        demographics: demographics,
        rawAnswers: row.raw_answers ? JSON.parse(row.raw_answers) : undefined,
        timestamp: row.timestamp.toISOString(),
        updatedAt: row.updated_at ? row.updated_at.toISOString() : undefined,
        recalculated: row.recalculated || false,
        lastRecalculated: row.last_recalculated ? row.last_recalculated.toISOString() : undefined,
        originalScore: row.original_score || undefined,
        originalProfile: row.original_profile || undefined,
        recalculatedPdfPath: row.recalculated_pdf_path || undefined,
        transactionId: row.transaction_id,
        coupleId: row.couple_id,
        coupleRole: row.couple_role,
        reportSent: row.report_sent
      };
      
      console.log(`Retrieved assessment from database for ID: ${id}`);
      return assessment;
    } catch (error) {
      console.error(`Error getting assessment from database for ID ${id}:`, error);
      // Fall back to memory storage if database operation fails
      return await this.memStorage.getAssessmentById(id);
    }
  }
  
  // Couple assessment methods
  async saveCoupleAssessment(primaryAssessment: AssessmentResult, spouseEmail: string): Promise<string> {
    try {
      // Generate a unique couple ID
      const coupleId = `${primaryAssessment.demographics.email}_${spouseEmail}_${Date.now()}`;
      
      // Update the primary assessment with the couple ID
      const updatedPrimaryAssessment = { ...primaryAssessment, coupleId, coupleRole: 'primary' as const };
      
      // Save the updated primary assessment to database
      await this.saveAssessment(updatedPrimaryAssessment);
      
      console.log(`Couple assessment initiated in database for couple ID: ${coupleId}`);
      
      // Still keep in memory as a fallback
      await this.memStorage.saveCoupleAssessment(updatedPrimaryAssessment, spouseEmail);
      
      return coupleId;
    } catch (error) {
      console.error('Error saving couple assessment to database:', error);
      // Fall back to memory storage if database operation fails
      return await this.memStorage.saveCoupleAssessment(primaryAssessment, spouseEmail);
    }
  }
  
  async getSpouseAssessment(coupleId: string, role: 'primary' | 'spouse'): Promise<AssessmentResult | null> {
    try {
      // Get from database using the assessmentResults table
      const { db } = await import('./db');
      const { assessmentResults } = await import('@shared/schema');
      const { eq, and } = await import('drizzle-orm');
      
      // Query the database for the assessment with the given coupleId and role
      const results = await db.select()
        .from(assessmentResults)
        .where(
          and(
            eq(assessmentResults.coupleId, coupleId),
            eq(assessmentResults.coupleRole, role)
          )
        );
      
      if (results.length === 0) {
        console.log(`No ${role} assessment found in database for couple ID: ${coupleId}`);
        return await this.memStorage.getSpouseAssessment(coupleId, role);
      }
      
      // Convert database record to AssessmentResult
      const dbResult = results[0];
      const assessment: AssessmentResult = {
        id: dbResult.id,
        email: dbResult.email,
        name: dbResult.name,
        scores: JSON.parse(dbResult.scores),
        profile: JSON.parse(dbResult.profile),
        genderProfile: dbResult.gender_profile ? JSON.parse(dbResult.gender_profile) : 
                  (dbResult.genderProfile ? JSON.parse(dbResult.genderProfile) : null),
        responses: JSON.parse(dbResult.responses),
        demographics: JSON.parse(dbResult.demographics),
        timestamp: dbResult.timestamp.toISOString(),
        coupleId: dbResult.couple_id || undefined,
        coupleRole: dbResult.couple_role as 'primary' | 'spouse' || undefined,
        reportSent: dbResult.report_sent
      };
      
      console.log(`${role} assessment retrieved from database for couple ID: ${coupleId}`);
      return assessment;
    } catch (error) {
      console.error(`Error getting ${role} assessment from database:`, error);
      // Fall back to memory storage if database operation fails
      return await this.memStorage.getSpouseAssessment(coupleId, role);
    }
  }
  
  async saveCoupleAssessmentReport(report: CoupleAssessmentReport): Promise<void> {
    try {
      // Save to database using the coupleAssessments table
      const { pool } = await import('./db');
      
      // First, ensure the primary and spouse assessments are saved to the database
      if (report.primary) {
        await this.saveAssessment(report.primary);
      }
      
      if (report.spouse) {
        await this.saveAssessment(report.spouse);
      }
      
      // Get the IDs of the primary and spouse assessments
      const primaryId = report.primary.id;
      const spouseId = report.spouse.id;
      
      if (!primaryId || !spouseId) {
        throw new Error('Primary or spouse assessment ID is missing');
      }
      
      // Use a report ID if provided, or generate a new one
      const reportId = report.id || crypto.randomUUID();
      
      // Insert into database using raw SQL to bypass schema mapping issues
      await pool.query(`
        INSERT INTO couple_assessments (
          id, couple_id, primary_id, spouse_id, analysis, 
          timestamp, compatibility_score, recommendations, report_sent
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (couple_id) DO UPDATE SET
          primary_id = $3,
          spouse_id = $4,
          analysis = $5,
          timestamp = $6,
          compatibility_score = $7,
          recommendations = $8,
          report_sent = $9
      `, [
        reportId,
        report.coupleId,
        primaryId,
        spouseId,
        JSON.stringify(report.analysis),
        new Date(report.timestamp || new Date().toISOString()),
        report.compatibilityScore,
        JSON.stringify(report.recommendations || []),
        report.reportSent || false
      ]);
      
      console.log(`Couple assessment report saved to database for couple ID: ${report.coupleId}`);
      
      // Still keep in memory as a fallback
      await this.memStorage.saveCoupleAssessmentReport(report);
    } catch (error) {
      console.error('Error saving couple assessment report to database:', error);
      // Fall back to memory storage if database operation fails
      await this.memStorage.saveCoupleAssessmentReport(report);
    }
  }
  
  async getCoupleAssessment(coupleId: string): Promise<CoupleAssessmentReport | null> {
    try {
      // Get from database using raw SQL to avoid schema mapping issues
      const { pool } = await import('./db');
      
      // Query the database for the couple assessment with the given coupleId
      const results = await pool.query(`
        SELECT id, couple_id as "coupleId", primary_id as "primaryId", spouse_id as "spouseId", 
               analysis, timestamp, compatibility_score as "compatibilityScore", 
               recommendations, report_sent as "reportSent"
        FROM couple_assessments
        WHERE couple_id = $1
      `, [coupleId]);
      
      if (results.rows.length === 0) {
        console.log(`No couple assessment found in database for couple ID: ${coupleId}`);
        return await this.memStorage.getCoupleAssessment(coupleId);
      }
      
      // Get the primary and spouse assessments
      const dbResult = results.rows[0];
      const primaryAssessment = await this.getSpouseAssessment(coupleId, 'primary');
      const spouseAssessment = await this.getSpouseAssessment(coupleId, 'spouse');
      
      if (!primaryAssessment || !spouseAssessment) {
        console.log(`Primary or spouse assessment missing for couple ID: ${coupleId}`);
        return await this.memStorage.getCoupleAssessment(coupleId);
      }
      
      // Convert database record to CoupleAssessmentReport
      const report: CoupleAssessmentReport = {
        id: dbResult.id,
        coupleId: dbResult.coupleId,
        primary: primaryAssessment,
        spouse: spouseAssessment,
        analysis: JSON.parse(dbResult.analysis),
        timestamp: typeof dbResult.timestamp === 'string' 
          ? dbResult.timestamp 
          : dbResult.timestamp.toISOString(),
        compatibilityScore: Number(dbResult.compatibilityScore),
        recommendations: JSON.parse(dbResult.recommendations),
        reportSent: dbResult.reportSent
      };
      
      console.log(`Couple assessment report retrieved from database for couple ID: ${coupleId}`);
      return report;
    } catch (error) {
      console.error('Error getting couple assessment from database:', error);
      // Fall back to memory storage if database operation fails
      return await this.memStorage.getCoupleAssessment(coupleId);
    }
  }
  
  // Add missing methods required by the interface
  async getAssessment(id: string): Promise<AssessmentResult | null> {
    return this.getAssessmentById(id);
  }

  async updateAssessment(id: string, assessment: AssessmentResult): Promise<void> {
    try {
      const { pool } = await import('./db');
      
      await pool.query(`
        UPDATE assessments 
        SET email = $2, name = $3, scores = $4, profile = $5, gender_profile = $6, 
            responses = $7, demographics = $8, updated_at = $9, recalculated = $10,
            last_recalculated = $11
        WHERE id = $1
      `, [
        id,
        assessment.email,
        assessment.name,
        JSON.stringify(assessment.scores),
        JSON.stringify(assessment.profile),
        assessment.genderProfile ? JSON.stringify(assessment.genderProfile) : null,
        JSON.stringify(assessment.responses),
        JSON.stringify(assessment.demographics),
        new Date(),
        assessment.recalculated || false,
        assessment.lastRecalculated ? new Date(assessment.lastRecalculated) : new Date()
      ]);
      
      console.log(`Assessment updated in database: ${id}`);
    } catch (error) {
      console.error('Error updating assessment in database:', error);
      await this.memStorage.updateAssessment(id, assessment);
    }
  }

  async getRecalculatedAssessments(): Promise<AssessmentResult[]> {
    try {
      const { pool } = await import('./db');
      
      const results = await pool.query(`
        SELECT id, email, name, scores, profile, gender_profile as "genderProfile", 
               responses, demographics, raw_answers, timestamp, updated_at, 
               recalculated, last_recalculated, original_score, original_profile, 
               recalculated_pdf_path, couple_id, couple_role, report_sent
        FROM assessments 
        WHERE recalculated = true
        ORDER BY last_recalculated DESC
      `);

      if (!results.rows || results.rows.length === 0) {
        return [];
      }

      return results.rows.map(row => ({
        id: row.id,
        email: row.email,
        name: row.name,
        scores: JSON.parse(row.scores),
        profile: JSON.parse(row.profile),
        genderProfile: row.genderProfile ? JSON.parse(row.genderProfile) : null,
        responses: JSON.parse(row.responses),
        demographics: JSON.parse(row.demographics),
        timestamp: row.timestamp.toISOString(),
        recalculated: row.recalculated || false,
        lastRecalculated: row.last_recalculated ? row.last_recalculated.toISOString() : undefined,
        originalScore: row.original_score,
        originalProfile: row.original_profile,
        recalculatedPdfPath: row.recalculated_pdf_path || undefined,
        coupleId: row.couple_id || undefined,
        coupleRole: row.couple_role as 'primary' | 'spouse' || undefined,
        reportSent: row.report_sent
      }));
    } catch (error) {
      console.error('Error getting recalculated assessments from database:', error);
      return this.memStorage.getRecalculatedAssessments();
    }
  }

  async updateCoupleAssessment(id: string, report: CoupleAssessmentReport): Promise<void> {
    try {
      const { pool } = await import('./db');
      
      await pool.query(`
        UPDATE couple_assessments 
        SET analysis = $2, compatibility_score = $3, recommendations = $4, report_sent = $5
        WHERE id = $1 OR couple_id = $1
      `, [
        id,
        JSON.stringify(report.analysis),
        report.compatibilityScore,
        JSON.stringify(report.recommendations || []),
        report.reportSent || false
      ]);
      
      console.log(`Couple assessment updated in database: ${id}`);
    } catch (error) {
      console.error('Error updating couple assessment in database:', error);
      await this.memStorage.updateCoupleAssessment(id, report);
    }
  }
  
  async getAllCoupleAssessments(): Promise<CoupleAssessmentReport[]> {
    try {
      // Get from database using raw SQL
      const { pool } = await import('./db');
      
      // Query the database for all couple assessments
      const results = await pool.query(`
        SELECT id, couple_id as "coupleId", primary_id as "primaryId", spouse_id as "spouseId", 
               analysis, timestamp, compatibility_score as "compatibilityScore", 
               recommendations, report_sent as "reportSent"
        FROM couple_assessments
        ORDER BY timestamp DESC
      `);
      
      if (!results.rows || results.rows.length === 0) {
        console.log('No couple assessments found in database');
        return await this.memStorage.getAllCoupleAssessments();
      }
      
      // Convert database records to CoupleAssessmentReport objects
      const reports: CoupleAssessmentReport[] = [];
      
      for (const dbResult of results.rows) {
        try {
          const coupleId = dbResult.coupleId;
          const primaryAssessment = await this.getSpouseAssessment(coupleId, 'primary');
          const spouseAssessment = await this.getSpouseAssessment(coupleId, 'spouse');
          
          if (primaryAssessment && spouseAssessment) {
            reports.push({
              id: dbResult.id,
              coupleId: coupleId,
              primary: primaryAssessment,
              spouse: spouseAssessment,
              analysis: typeof dbResult.analysis === 'string' ? JSON.parse(dbResult.analysis) : dbResult.analysis,
              timestamp: typeof dbResult.timestamp === 'string' 
                ? dbResult.timestamp 
                : dbResult.timestamp.toISOString(),
              compatibilityScore: Number(dbResult.compatibilityScore),
              recommendations: typeof dbResult.recommendations === 'string' 
                ? JSON.parse(dbResult.recommendations) 
                : dbResult.recommendations,
              reportSent: dbResult.reportSent
            });
          }
        } catch (err) {
          console.error(`Error processing couple assessment ${dbResult.coupleId}:`, err);
        }
      }
      
      console.log(`Retrieved ${reports.length} couple assessments from database`);
      
      if (reports.length === 0) {
        // Fall back to memory storage if no valid reports were created
        return await this.memStorage.getAllCoupleAssessments();
      }
      
      return reports;
    } catch (error) {
      console.error('Error getting all couple assessments from database:', error);
      // Fall back to memory storage if database operation fails
      return await this.memStorage.getAllCoupleAssessments();
    }
  }
  
  async saveReferral(referral: ReferralData): Promise<void> {
    try {
      // Save referral to database
      const { pool } = await import('./db');
      
      // Generate an ID if not provided
      const id = referral.id || crypto.randomUUID();
      
      // Insert into database using raw SQL with proper parameter binding
      await pool.query(`
        INSERT INTO referrals (
          id, referrer_email, referrer_name, recipient_email, recipient_name,
          status, sent_timestamp, completed_timestamp, promo_code, product_type, custom_message
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        ON CONFLICT (id) DO UPDATE SET
          referrer_email = $2,
          referrer_name = $3,
          recipient_email = $4,
          recipient_name = $5,
          status = $6,
          sent_timestamp = $7,
          completed_timestamp = $8,
          promo_code = $9,
          product_type = $10,
          custom_message = $11
      `, [
        id,
        referral.referrerEmail || '',
        referral.referrerName || '',
        referral.recipientEmail || '',
        referral.recipientName || '',
        referral.status || 'sent',
        new Date(referral.sentTimestamp || new Date().toISOString()),
        referral.completedTimestamp ? new Date(referral.completedTimestamp) : null,
        referral.promoCode || null,
        referral.productType || 'individual',
        referral.customMessage || null
      ]);
      
      console.log(`Referral saved to database: ${id}`);
      
      // Still keep in memory as a fallback
      await this.memStorage.saveReferral({
        ...referral,
        id: id
      });
    } catch (error) {
      console.error('Error saving referral to database:', error);
      // Fall back to memory storage if database operation fails
      await this.memStorage.saveReferral(referral);
    }
  }
  
  async getAllReferrals(): Promise<ReferralData[]> {
    try {
      // Retrieve all referrals from the database
      const { pool } = await import('./db');
      
      const results = await pool.query(`
        SELECT 
          id, referrer_email as "referrerEmail", referrer_name as "referrerName", 
          recipient_email as "recipientEmail", recipient_name as "recipientName",
          status, sent_timestamp as "sentTimestamp", completed_timestamp as "completedTimestamp", 
          promo_code as "promoCode", product_type as "productType", custom_message as "customMessage"
        FROM referrals
        ORDER BY sent_timestamp DESC
      `);
      
      // Transform DB results into ReferralData objects
      const referrals: ReferralData[] = results.rows.map((row: any) => ({
        id: row.id,
        referrerEmail: row.referrerEmail,
        referrerName: row.referrerName,
        recipientEmail: row.recipientEmail,
        recipientName: row.recipientName,
        status: row.status || 'sent',
        sentTimestamp: row.sentTimestamp ? (
          typeof row.sentTimestamp === 'string' 
            ? row.sentTimestamp 
            : row.sentTimestamp.toISOString()
        ) : new Date().toISOString(),
        completedTimestamp: row.completedTimestamp ? (
          typeof row.completedTimestamp === 'string' 
            ? row.completedTimestamp 
            : row.completedTimestamp.toISOString()
        ) : undefined,
        promoCode: row.promoCode,
        productType: row.productType || 'individual',
        customMessage: row.customMessage
      }));
      
      console.log(`Retrieved ${referrals.length} referrals from database`);
      return referrals;
    } catch (error) {
      console.error('Error getting all referrals from database:', error);
      // Only fall back to memory storage if database query fails
      return await this.memStorage.getAllReferrals();
    }
  }
  
  async updateReferralStatus(id: string, status: 'sent' | 'completed' | 'expired', completedTimestamp?: string): Promise<void> {
    try {
      // Update referral status in the database
      const { pool } = await import('./db');
      
      // Prepare the parameters for the update
      const params: any[] = [status, id];
      let query = 'UPDATE referrals SET status = $1';
      
      // If completedTimestamp is provided, add it to the update
      if (completedTimestamp && status === 'completed') {
        query += ', completed_timestamp = $3';
        params.push(new Date(completedTimestamp));
      }
      
      // Complete the query with the WHERE clause
      query += ' WHERE id = $2';
      
      // Execute the update
      await pool.query(query, params);
      
      console.log(`Referral status updated in database: ${id} => ${status}`);
      
      // Still update memory storage as a fallback
      await this.memStorage.updateReferralStatus(id, status, completedTimestamp);
    } catch (error) {
      console.error('Error updating referral status in database:', error);
      // Fall back to memory storage if database operation fails
      await this.memStorage.updateReferralStatus(id, status, completedTimestamp);
    }
  }
  
  async recordPageView(pageView: PageView): Promise<void> {
    try {
      // First import all the necessary dependencies
      const { pool } = await import('./db');
      const { pageViews } = await import('@shared/schema');
      
      // Convert timestamp to a Date object if it's a string
      let timestamp: Date;
      if (typeof pageView.timestamp === 'string') {
        timestamp = new Date(pageView.timestamp);
      } else {
        timestamp = new Date(); // Default to current time if invalid
      }
      
      // Check if sessionId is provided, if not create a default one
      const sessionId = pageView.sessionId || crypto.randomUUID();
      
      // First ensure the session exists to satisfy foreign key constraint
      try {
        // Check if a session with this ID already exists
        const { visitorSessions } = await import('@shared/schema');
        const { eq } = await import('drizzle-orm');
        const { db } = await import('./db');
        
        const existing = await db.select()
          .from(visitorSessions)
          .where(eq(visitorSessions.id, sessionId))
          .limit(1);
        
        // If no session exists, create one
        if (existing.length === 0) {
          // Create a default session
          await pool.query(
            'INSERT INTO visitor_sessions (id, start_time, page_count) VALUES ($1, $2, $3) ON CONFLICT (id) DO NOTHING',
            [sessionId, new Date(), 1]
          );
          
          console.log(`Created default visitor session for pageView: ${sessionId}`);
        }
      } catch (sessionError) {
        console.error('Error checking/creating session:', sessionError);
        // Continue anyway, as we want to try to record the page view
      }
      
      // Now insert the page view with raw SQL to handle any schema discrepancies
      await pool.query(
        'INSERT INTO page_views (id, path, timestamp, referrer, user_agent, ip_address, session_id) VALUES ($1, $2, $3, $4, $5, $6, $7)',
        [
          crypto.randomUUID(),
          pageView.path,
          timestamp,
          pageView.referrer || null,
          pageView.userAgent || null,
          pageView.ipAddress || null,
          sessionId
        ]
      );
      
      console.log(`Page view recorded in database: ${pageView.path}`);
      
      // Still keep in memory as a fallback
      await this.memStorage.recordPageView(pageView);
    } catch (error) {
      console.error('Error recording page view in database:', error);
      // Fall back to memory storage if database operation fails
      await this.memStorage.recordPageView(pageView);
    }
  }
  
  async createVisitorSession(session: VisitorSession): Promise<void> {
    try {
      // First import all necessary dependencies
      const { pool } = await import('./db');
      
      // Prepare the timestamp for startTime
      const startTime = typeof session.startTime === 'string' 
        ? new Date(session.startTime) 
        : session.startTime;
      
      // Prepare endTime if it exists
      let endTime = null;
      if (session.endTime) {
        endTime = typeof session.endTime === 'string' 
          ? new Date(session.endTime) 
          : session.endTime;
      }
      
      // Insert into database using raw SQL with pool.query
      await pool.query(
        `INSERT INTO visitor_sessions (
          id, start_time, end_time, page_count, user_agent, ip_address, referrer, user_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        ON CONFLICT (id) DO UPDATE SET
          end_time = $3,
          page_count = $4,
          user_agent = $5,
          ip_address = $6,
          referrer = $7,
          user_id = $8`,
        [
          session.id,
          startTime,
          endTime,
          session.pageCount || 0,
          session.userAgent || null,
          session.ipAddress || null,
          session.referrer || null,
          session.userId || null
        ]
      );
      
      console.log(`Visitor session created/updated in database: ${session.id}`);
      
      // Still keep in memory as a fallback
      await this.memStorage.createVisitorSession(session);
    } catch (error) {
      console.error('Error creating visitor session in database:', error);
      // Fall back to memory storage if database operation fails
      await this.memStorage.createVisitorSession(session);
    }
  }
  
  async updateVisitorSession(sessionId: string, endTime: string, pageCount: number): Promise<void> {
    try {
      // Import all necessary dependencies at the beginning
      const { pool } = await import('./db');
      
      // Convert endTime to a Date object if it's a string
      let endTimeDate: Date;
      if (typeof endTime === 'string') {
        endTimeDate = new Date(endTime);
      } else {
        endTimeDate = new Date(); // Default to current time if invalid
      }
      
      // Update the session in the database using SQL query with pool.query
      await pool.query(
        'UPDATE visitor_sessions SET end_time = $1, page_count = $2 WHERE id = $3',
        [endTimeDate, pageCount, sessionId]
      );
      
      console.log(`Visitor session updated in database: ${sessionId}`);
      
      // Still update memory storage
      await this.memStorage.updateVisitorSession(sessionId, endTime, pageCount);
    } catch (error) {
      console.error('Error updating visitor session in database:', error);
      // Fall back to memory storage if database operation fails
      await this.memStorage.updateVisitorSession(sessionId, endTime, pageCount);
    }
  }
  
  async getPageViews(startDate?: string, endDate?: string): Promise<PageView[]> {
    try {
      // Retrieve from database using raw SQL to avoid schema mapping issues
      const { pool } = await import('./db');
      
      // Build the query with optional date filters
      let query = `
        SELECT id, path, timestamp, referrer, user_agent as "userAgent", 
               ip_address as "ipAddress", session_id as "sessionId"
        FROM page_views
        WHERE 1=1
      `;
      
      const params: any[] = [];
      let paramIndex = 1;
      
      if (startDate) {
        query += ` AND timestamp >= $${paramIndex}`;
        params.push(new Date(startDate));
        paramIndex++;
      }
      
      if (endDate) {
        query += ` AND timestamp <= $${paramIndex}`;
        params.push(new Date(endDate));
        paramIndex++;
      }
      
      // Order by most recent first
      query += ' ORDER BY timestamp DESC';
      
      // Execute query
      const results = await pool.query(query, params);
      
      // Transform and return
      return results.rows.map((row: any) => ({
        id: row.id || '',
        path: row.path,
        timestamp: typeof row.timestamp === 'string' 
          ? row.timestamp 
          : row.timestamp.toISOString(),
        referrer: row.referrer || '',
        userAgent: row.userAgent || '',
        ipAddress: row.ipAddress || '',
        sessionId: row.sessionId || ''
      }));
    } catch (error) {
      console.error('Error getting page views from database:', error);
      // Fall back to memory storage
      return await this.memStorage.getPageViews(startDate, endDate);
    }
  }
  
  async getVisitorSessions(startDate?: string, endDate?: string): Promise<VisitorSession[]> {
    try {
      // Retrieve from database using raw SQL to avoid schema mapping issues
      const { pool } = await import('./db');
      
      // Build the query with optional date filters
      let query = `
        SELECT 
          id, 
          start_time as "startTime", 
          end_time as "endTime", 
          page_count as "pageCount", 
          user_agent as "userAgent", 
          ip_address as "ipAddress", 
          referrer, 
          user_id as "userId"
        FROM visitor_sessions
        WHERE 1=1
      `;
      
      const params: any[] = [];
      let paramIndex = 1;
      
      if (startDate) {
        query += ` AND start_time >= $${paramIndex}`;
        params.push(new Date(startDate));
        paramIndex++;
      }
      
      if (endDate) {
        query += ` AND start_time <= $${paramIndex}`;
        params.push(new Date(endDate));
        paramIndex++;
      }
      
      // Order by most recent first
      query += ' ORDER BY start_time DESC';
      
      // Execute query
      const results = await pool.query(query, params);
      
      // Transform and return
      return results.rows.map((row: any) => ({
        id: row.id,
        startTime: typeof row.startTime === 'string' 
          ? row.startTime 
          : row.startTime.toISOString(),
        endTime: row.endTime 
          ? (typeof row.endTime === 'string' 
              ? row.endTime 
              : row.endTime.toISOString()) 
          : undefined,
        pageCount: row.pageCount || 0,
        userAgent: row.userAgent || '',
        ipAddress: row.ipAddress || '',
        referrer: row.referrer || '',
        userId: row.userId
      }));
    } catch (error) {
      console.error('Error getting visitor sessions from database:', error);
      // Fall back to memory storage
      return await this.memStorage.getVisitorSessions(startDate, endDate);
    }
  }
  
  async getAnalyticsSummary(period: 'day' | 'week' | 'month' | 'year'): Promise<AnalyticsSummary> {
    try {
      // Calculate the start date based on the period
      const now = new Date();
      let startDate = new Date(now);
      
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
      
      // Use direct SQL queries for better performance
      const { pool } = await import('./db');
      
      // Get total page views for the period
      const pageViewsResult = await pool.query(
        'SELECT COUNT(*) as "totalPageViews" FROM page_views WHERE timestamp >= $1 AND timestamp <= $2',
        [startDate, now]
      );
      const totalPageViews = parseInt(pageViewsResult.rows[0].totalPageViews);
      
      // Get unique visitors count (distinct session IDs) 
      const uniqueVisitorsResult = await pool.query(
        'SELECT COUNT(DISTINCT session_id) as "uniqueVisitors" FROM page_views WHERE timestamp >= $1 AND timestamp <= $2',
        [startDate, now]
      );
      const uniqueVisitors = parseInt(uniqueVisitorsResult.rows[0].uniqueVisitors);
      
      // Calculate average session duration for completed sessions
      const durationResult = await pool.query(`
        SELECT AVG(EXTRACT(EPOCH FROM (end_time - start_time))) * 1000 as "avgDuration"
        FROM visitor_sessions
        WHERE start_time >= $1 AND start_time <= $2 AND end_time IS NOT NULL
      `, [startDate, now]);
      const averageSessionDuration = durationResult.rows[0].avgDuration || 0;
      
      // Get popular pages (top 5)
      const popularPagesResult = await pool.query(`
        SELECT path, COUNT(*) as "count"
        FROM page_views
        WHERE timestamp >= $1 AND timestamp <= $2
        GROUP BY path
        ORDER BY "count" DESC
        LIMIT 5
      `, [startDate, now]);
      
      const popularPages = popularPagesResult.rows.map((row: any) => ({
        path: row.path,
        count: parseInt(row.count)
      }));
      
      // Get daily visitors data for charts
      const dailyVisitorsResult = await pool.query(`
        SELECT DATE(timestamp) as "date", COUNT(DISTINCT session_id) as "visitors"
        FROM page_views
        WHERE timestamp >= $1 AND timestamp <= $2
        GROUP BY DATE(timestamp)
        ORDER BY "date"
      `, [startDate, now]);
      
      const dailyVisitors = dailyVisitorsResult.rows.map((row: any) => ({
        date: row.date.toISOString().split('T')[0],
        count: parseInt(row.visitors)
      }));
      
      // Get conversion rate (users who completed an assessment)
      // First get total visitors
      const totalVisitorsResult = await pool.query(
        'SELECT COUNT(DISTINCT id) as "totalVisitors" FROM visitor_sessions WHERE start_time >= $1 AND start_time <= $2',
        [startDate, now]
      );
      const totalVisitors = parseInt(totalVisitorsResult.rows[0].totalVisitors);
      
      // Get completed assessments in the period
      const completedAssessmentsResult = await pool.query(
        'SELECT COUNT(*) as "completedAssessments" FROM assessment_results WHERE timestamp >= $1 AND timestamp <= $2',
        [startDate, now]
      );
      const completedAssessments = parseInt(completedAssessmentsResult.rows[0].completedAssessments);
      
      // Calculate conversion rate
      const conversionRate = totalVisitors > 0 ? (completedAssessments / totalVisitors) * 100 : 0;
      
      return {
        period,
        startDate: startDate.toISOString(),
        endDate: now.toISOString(),
        totalPageViews,
        uniqueVisitors,
        totalVisitors,
        averageSessionDuration,
        popularPages,
        topPages: popularPages, // Alias for backwards compatibility
        dailyVisitors,
        conversionRate
      };
    } catch (error) {
      console.error('Error getting analytics summary from database:', error);
      // Fall back to memory storage
      return await this.memStorage.getAnalyticsSummary(period);
    }
  }
  
  async savePaymentTransaction(transaction: PaymentTransaction): Promise<void> {
    try {
      // Store in the database using raw SQL to avoid schema mapping issues
      const { pool } = await import('./db');
      
      // Generate a UUID for the transaction id if not provided
      const id = transaction.id || crypto.randomUUID();
      
      // Insert into database using a SQL query
      await pool.query(
        `INSERT INTO payment_transactions (
          id, stripe_id, customer_email, amount, currency, status, created, 
          product_type, assessment_type, metadata, is_refunded, refund_amount, 
          refund_reason, promo_code
        ) VALUES (
          $1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14
        )
        ON CONFLICT (stripe_id) DO UPDATE SET
          customer_email = $3,
          amount = $4,
          currency = $5,
          status = $6,
          created = $7,
          product_type = $8,
          assessment_type = $9,
          metadata = $10,
          is_refunded = $11,
          refund_amount = $12,
          refund_reason = $13,
          promo_code = $14`,
        [
          id,
          transaction.stripeId,
          transaction.customerEmail || null,
          transaction.amount,
          transaction.currency,
          transaction.status,
          new Date(transaction.created),
          transaction.productType || transaction.assessmentType, // Use productType as fallback
          transaction.assessmentType || null,
          JSON.stringify(transaction.metadata || {}),
          transaction.isRefunded || false,
          transaction.refundAmount || null,
          transaction.refundReason || null,
          transaction.promoCode || null
        ]
      );
      
      console.log(`Payment transaction saved to database: ${transaction.stripeId}`);
      
      // Still keep in memory as a fallback
      await this.memStorage.savePaymentTransaction(transaction);
    } catch (error) {
      console.error('Error saving payment transaction to database:', error);
      // Fall back to memory storage if database operation fails
      await this.memStorage.savePaymentTransaction(transaction);
    }
  }
  
  async getPaymentTransactions(startDate?: string, endDate?: string): Promise<PaymentTransaction[]> {
    try {
      // Retrieve from database using raw SQL to avoid schema mapping issues
      const { pool } = await import('./db');
      
      // Build the query with optional date filters
      let query = `
        SELECT 
          id,
          stripe_id as "stripeId", 
          customer_email as "customerEmail", 
          amount, 
          currency, 
          status, 
          created, 
          product_type as "productType",
          assessment_type as "assessmentType", 
          metadata, 
          is_refunded as "isRefunded", 
          refund_amount as "refundAmount", 
          refund_reason as "refundReason", 
          promo_code as "promoCode"
        FROM payment_transactions
        WHERE 1=1
      `;
      
      const params: any[] = [];
      let paramIndex = 1;
      
      if (startDate) {
        query += ` AND created >= $${paramIndex}`;
        params.push(new Date(startDate));
        paramIndex++;
      }
      
      if (endDate) {
        query += ` AND created <= $${paramIndex}`;
        params.push(new Date(endDate));
        paramIndex++;
      }
      
      // Order by most recent first
      query += ' ORDER BY created DESC';
      
      // Execute query
      const results = await pool.query(query, params);
      
      // Transform and return
      return results.rows.map((row: any) => ({
        id: row.id,
        stripeId: row.stripeId,
        customerEmail: row.customerEmail,
        amount: row.amount,
        currency: row.currency,
        status: row.status,
        created: typeof row.created === 'string' 
          ? row.created 
          : row.created.toISOString(),
        productType: row.productType || row.assessmentType || 'individual',
        assessmentType: row.assessmentType || row.productType || 'individual',
        metadata: typeof row.metadata === 'string' 
          ? JSON.parse(row.metadata) 
          : (row.metadata || {}),
        isRefunded: row.isRefunded || false,
        refundAmount: row.refundAmount,
        refundReason: row.refundReason,
        promoCode: row.promoCode
      }));
    } catch (error) {
      console.error('Error getting payment transactions from database:', error);
      // Fall back to memory storage
      return await this.memStorage.getPaymentTransactions(startDate, endDate);
    }
  }
  
  async getPaymentTransactionsWithAssessments(startDate?: string, endDate?: string): Promise<PaymentTransaction[]> {
    try {
      console.log('Fetching payment transactions with assessments from database');
      
      // First get the basic transactions
      const transactions = await this.getPaymentTransactions(startDate, endDate);
      
      // Connect to the database
      const { pool } = await import('./db');
      
      // Create an array to store the enhanced transactions
      const enhancedTransactions: PaymentTransaction[] = [];
      
      // Process each transaction one by one to add assessment data
      for (const transaction of transactions) {
        try {
          // First check if transaction has metadata
          if (transaction.metadata) {
            const metadata = transaction.metadata;
            
            // Create a basic enhanced transaction with metadata
            const enhancedTransaction = {
              ...transaction,
              assessmentData: {
                email: transaction.customerEmail || '',
                firstName: metadata.firstName || metadata.first_name || '',
                lastName: metadata.lastName || metadata.last_name || '',
                gender: metadata.gender || '',
                marriageStatus: metadata.marriageStatus || metadata.marriage_status || '',
                desireChildren: metadata.desireChildren || metadata.desire_children || '',
                ethnicity: metadata.ethnicity || '',
                city: metadata.city || '',
                state: metadata.state || '',
                zipCode: metadata.zipCode || metadata.zip_code || '',
              }
            };
            
            enhancedTransactions.push(enhancedTransaction);
          } else {
            // Try to find an assessment with this transaction ID
            const query = `
              SELECT email, name, demographics
              FROM assessment_results
              WHERE transaction_id = $1
              LIMIT 1
            `;
            
            const result = await pool.query(query, [transaction.id]);
            
            if (result.rows.length > 0) {
              const assessment = result.rows[0];
              const demographics = typeof assessment.demographics === 'string' 
                ? JSON.parse(assessment.demographics) 
                : assessment.demographics;
              
              // Create enhanced transaction with assessment data
              enhancedTransactions.push({
                ...transaction,
                assessmentData: {
                  email: assessment.email || transaction.customerEmail || '',
                  firstName: demographics.firstName || '',
                  lastName: demographics.lastName || '',
                  gender: demographics.gender || '',
                  marriageStatus: demographics.marriageStatus || '',
                  desireChildren: demographics.desireChildren || '',
                  ethnicity: demographics.ethnicity || '',
                  city: demographics.city || '',
                  state: demographics.state || '',
                  zipCode: demographics.zipCode || '',
                }
              });
            } else {
              // No assessment found, just add the transaction as is
              enhancedTransactions.push(transaction);
            }
          }
        } catch (error) {
          console.error(`Error enhancing transaction ${transaction.id} with assessment data:`, error);
          enhancedTransactions.push(transaction);
        }
      }
      
      console.log(`Enhanced ${enhancedTransactions.length} transactions with assessment data`);
      return enhancedTransactions;
    } catch (error) {
      console.error('Error getting payment transactions with assessments:', error);
      // Fall back to memory storage
      return await this.memStorage.getPaymentTransactionsWithAssessments(startDate, endDate);
    }
  }
  
  async getPaymentTransactionByStripeId(stripeId: string): Promise<PaymentTransaction | null> {
    try {
      // Retrieve from database using raw SQL to avoid schema mapping issues
      const { pool } = await import('./db');
      
      // Build the query to get transaction by Stripe ID
      const query = `
        SELECT 
          id,
          stripe_id as "stripeId", 
          customer_email as "customerEmail", 
          amount, 
          currency, 
          status, 
          created, 
          product_type as "productType",
          assessment_type as "assessmentType", 
          metadata, 
          is_refunded as "isRefunded", 
          refund_amount as "refundAmount", 
          refund_reason as "refundReason", 
          promo_code as "promoCode"
        FROM payment_transactions
        WHERE stripe_id = $1
      `;
      
      // Execute query with stripeId parameter
      const result = await pool.query(query, [stripeId]);
      
      if (!result.rows || result.rows.length === 0) {
        return null;
      }
      
      const row = result.rows[0];
      
      // Transform and return
      return {
        id: row.id,
        stripeId: row.stripeId,
        customerEmail: row.customerEmail,
        amount: row.amount,
        currency: row.currency,
        status: row.status,
        created: typeof row.created === 'string' 
          ? row.created 
          : row.created.toISOString(),
        productType: row.productType || row.assessmentType || 'individual',
        assessmentType: row.assessmentType || row.productType || 'individual',
        metadata: typeof row.metadata === 'string' 
          ? JSON.parse(row.metadata) 
          : (row.metadata || {}),
        isRefunded: row.isRefunded || false,
        refundAmount: row.refundAmount,
        refundReason: row.refundReason,
        promoCode: row.promoCode
      };
    } catch (error) {
      console.error('Error getting payment transaction by Stripe ID from database:', error);
      // Fall back to memory storage
      return await this.memStorage.getPaymentTransactionByStripeId(stripeId);
    }
  }
  
  async updatePaymentTransactionStatus(stripeId: string, status: string): Promise<void> {
    try {
      // Update in the database using raw SQL to avoid schema mapping issues
      const { pool } = await import('./db');
      
      // Update the transaction status with a simple query
      await pool.query(
        'UPDATE payment_transactions SET status = $1 WHERE stripe_id = $2',
        [status, stripeId]
      );
      
      console.log(`Payment transaction status updated in database: ${stripeId} -> ${status}`);
      
      // Also update in memory storage
      await this.memStorage.updatePaymentTransactionStatus(stripeId, status);
    } catch (error) {
      console.error('Error updating payment transaction status in database:', error);
      // Fall back to memory storage
      await this.memStorage.updatePaymentTransactionStatus(stripeId, status);
    }
  }
  
  // Update payment transaction customer email
  async updatePaymentTransactionEmail(stripeId: string, email: string): Promise<void> {
    try {
      // Update in the database using raw SQL
      const { pool } = await import('./db');
      
      // Update both customer_email and metadata JSON to ensure consistency
      const query = `
        UPDATE payment_transactions 
        SET 
          customer_email = $1,
          metadata = COALESCE(
            jsonb_set(
              CASE 
                WHEN metadata IS NULL THEN '{}'::jsonb
                WHEN jsonb_typeof(metadata) = 'string' THEN metadata::jsonb
                ELSE metadata
              END, 
              '{email}', 
              $2::jsonb
            ),
            '{}'::jsonb
          )
        WHERE stripe_id = $3
        RETURNING id
      `;
      
      const result = await pool.query(query, [email, JSON.stringify(email), stripeId]);
      
      if (result.rows && result.rows.length > 0) {
        console.log(`Updated payment transaction email for ${stripeId}: ${email}`);
      } else {
        console.log(`No payment transaction found for ${stripeId} when updating email`);
      }
      
      // Also update in memory storage if needed
      const memTransaction = await this.memStorage.getPaymentTransactionByStripeId(stripeId);
      if (memTransaction) {
        memTransaction.customerEmail = email;
        // Update metadata too if it exists
        if (memTransaction.metadata) {
          try {
            const metadataObj = typeof memTransaction.metadata === 'string' 
              ? JSON.parse(memTransaction.metadata) 
              : memTransaction.metadata;
            
            metadataObj.email = email;
            memTransaction.metadata = JSON.stringify(metadataObj);
          } catch (err) {
            console.error('Error updating email in memory transaction metadata:', err);
          }
        }
      }
    } catch (error) {
      console.error(`Error updating payment transaction email for ${stripeId}:`, error);
      // Fall back to simple memory update
      const memTransaction = await this.memStorage.getPaymentTransactionByStripeId(stripeId);
      if (memTransaction) {
        memTransaction.customerEmail = email;
        console.log(`Updated payment transaction email in memory: ${stripeId} -> ${email}`);
      }
    }
  }
  
  async recordRefund(stripeId: string, amount: number, reason?: string): Promise<void> {
    try {
      // Update in the database using raw SQL to avoid schema mapping issues
      const { pool } = await import('./db');
      
      // Update the transaction with refund information using SQL
      await pool.query(
        `UPDATE payment_transactions 
         SET is_refunded = true, 
             refund_amount = $1, 
             refund_reason = $2, 
             status = 'refunded' 
         WHERE stripe_id = $3`,
        [amount, reason || null, stripeId]
      );
      
      console.log(`Refund recorded in database for transaction: ${stripeId}`);
      
      // Also update in memory storage
      await this.memStorage.recordRefund(stripeId, amount, reason);
    } catch (error) {
      console.error('Error recording refund in database:', error);
      // Fall back to memory storage
      await this.memStorage.recordRefund(stripeId, amount, reason);
    }
  }
  
  async getPaymentTransactionsWithAssessments(startDate?: string, endDate?: string): Promise<PaymentTransaction[]> {
    try {
      // Get base transactions
      const transactions = await this.getPaymentTransactions(startDate, endDate);
      
      // Load assessment data for each transaction
      const { pool } = await import('./db');
      
      // Process each transaction to add assessment data
      const enhancedTransactions = await Promise.all(transactions.map(async (transaction) => {
        try {
          // Try to find assessment data by transaction ID
          const assessmentQuery = `
            SELECT 
              email,
              name,
              demographics
            FROM assessment_results
            WHERE transaction_id = $1
            LIMIT 1
          `;
          
          const assessmentResult = await pool.query(assessmentQuery, [transaction.id]);
          
          // If we found assessment data, add it to the transaction
          if (assessmentResult.rows && assessmentResult.rows.length > 0) {
            const assessmentData = assessmentResult.rows[0];
            let demographics: any = {};
            
            // Parse demographics JSON if it exists
            if (assessmentData.demographics) {
              try {
                demographics = typeof assessmentData.demographics === 'string' 
                  ? JSON.parse(assessmentData.demographics)
                  : assessmentData.demographics;
              } catch (e) {
                console.error('Error parsing demographics:', e);
              }
            }
            
            // Add assessment data to transaction
            return {
              ...transaction,
              assessmentData: {
                email: assessmentData.email,
                firstName: demographics.firstName || '',
                lastName: demographics.lastName || '',
                gender: demographics.gender || '',
                marriageStatus: demographics.marriageStatus || '',
                desireChildren: demographics.desireChildren || '',
                ethnicity: demographics.ethnicity || '',
                city: demographics.city || '',
                state: demographics.state || '',
                zipCode: demographics.zipCode || ''
              }
            };
          }
          
          // If no assessment data found by transaction ID, try by email
          if (transaction.customerEmail) {
            const emailQuery = `
              SELECT 
                email,
                name,
                demographics
              FROM assessment_results
              WHERE email = $1
              ORDER BY timestamp DESC
              LIMIT 1
            `;
            
            const emailResult = await pool.query(emailQuery, [transaction.customerEmail]);
            
            if (emailResult.rows && emailResult.rows.length > 0) {
              const assessmentData = emailResult.rows[0];
              let demographics: any = {};
              
              // Parse demographics JSON if it exists
              if (assessmentData.demographics) {
                try {
                  demographics = typeof assessmentData.demographics === 'string' 
                    ? JSON.parse(assessmentData.demographics)
                    : assessmentData.demographics;
                } catch (e) {
                  console.error('Error parsing demographics:', e);
                }
              }
              
              // Add assessment data to transaction
              return {
                ...transaction,
                assessmentData: {
                  email: assessmentData.email,
                  firstName: demographics.firstName || '',
                  lastName: demographics.lastName || '',
                  gender: demographics.gender || '',
                  marriageStatus: demographics.marriageStatus || '',
                  desireChildren: demographics.desireChildren || '',
                  ethnicity: demographics.ethnicity || '',
                  city: demographics.city || '',
                  state: demographics.state || '',
                  zipCode: demographics.zipCode || ''
                }
              };
            }
          }
          
          // If no assessment data found, try to extract from metadata
          if (transaction.metadata) {
            const metadata = transaction.metadata;
            return {
              ...transaction,
              assessmentData: {
                email: transaction.customerEmail || '',
                firstName: metadata.firstName || metadata.first_name || '',
                lastName: metadata.lastName || metadata.last_name || '',
                gender: metadata.gender || '',
                marriageStatus: metadata.marriageStatus || metadata.marriage_status || '',
                desireChildren: metadata.desireChildren || metadata.desire_children || '',
                ethnicity: metadata.ethnicity || '',
                city: metadata.city || '',
                state: metadata.state || '',
                zipCode: metadata.zipCode || metadata.zip_code || ''
              }
            };
          }
          
          // Return the transaction without assessment data if none found
          return transaction;
        } catch (error) {
          console.error(`Error enhancing transaction ${transaction.id} with assessment data:`, error);
          return transaction;
        }
      }));
      
      console.log(`Enhanced ${enhancedTransactions.length} transactions with assessment data`);
      return enhancedTransactions;
    } catch (error) {
      console.error('Error getting payment transactions with assessments:', error);
      // Fall back to regular transactions if there's an error
      return this.getPaymentTransactions(startDate, endDate);
    }
  }
  
  // Get a completed assessment by email
  async getCompletedAssessment(email: string): Promise<AssessmentResult | null> {
    try {
      // Import pool only when needed
      const { pool } = await import('./db');
      
      const query = `
        SELECT id, email, name, scores, profile, gender_profile, responses, 
               demographics, timestamp, transaction_id, couple_id, couple_role, report_sent
        FROM assessment_results
        WHERE email = $1 AND completed = true
        LIMIT 1
      `;
      
      const result = await pool.query(query, [email]);
      
      if (result.rows.length === 0) {
        // No result in database, fall back to memory storage
        return this.memStorage.getCompletedAssessment(email);
      }
      
      // Transform DB result into AssessmentResult object
      const row = result.rows[0];
      const scores = JSON.parse(row.scores);
      const profile = JSON.parse(row.profile);
      const responses = JSON.parse(row.responses);
      const demographics = JSON.parse(row.demographics);
      
      // Parse gender profile if it exists
      const genderProfile = row.gender_profile ? JSON.parse(row.gender_profile) : null;
      
      return {
        id: row.id,
        email: row.email,
        name: row.name,
        scores: scores,
        profile: profile,
        genderProfile: genderProfile,
        responses: responses,
        demographics: demographics,
        timestamp: row.timestamp.toISOString(),
        transactionId: row.transaction_id,
        coupleId: row.couple_id,
        coupleRole: row.couple_role,
        reportSent: row.report_sent
      };
    } catch (error) {
      console.error(`Error getting completed assessment from database for email ${email}:`, error);
      // Fall back to memory storage on error
      return this.memStorage.getCompletedAssessment(email);
    }
  }
  
  // Get a couple assessment by email (checks both primary and spouse emails)
  async getCoupleAssessmentByEmail(email: string): Promise<CoupleAssessmentReport | null> {
    try {
      // Import pool only when needed
      const { pool } = await import('./db');
      
      // First find assessment with this email
      const assessmentQuery = `
        SELECT couple_id, couple_role
        FROM assessment_results
        WHERE email = $1 AND couple_id IS NOT NULL
        LIMIT 1
      `;
      
      const assessmentResult = await pool.query(assessmentQuery, [email]);
      
      if (assessmentResult.rows.length === 0) {
        // No result in database, fall back to memory storage
        return this.memStorage.getCoupleAssessmentByEmail(email);
      }
      
      // Now get the couple assessment with this ID
      const coupleId = assessmentResult.rows[0].couple_id;
      return await this.getCoupleAssessment(coupleId);
    } catch (error) {
      console.error(`Error getting couple assessment from database for email ${email}:`, error);
      // Fall back to memory storage on error
      return this.memStorage.getCoupleAssessmentByEmail(email);
    }
  }
}

// Export the storage instance 
export const storage = new DatabaseStorage();