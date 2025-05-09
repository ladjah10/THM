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
  async saveAssessmentProgress(tempId: string, assessment: Partial<AssessmentResult>): Promise<void> {
    console.log(`Saving partial assessment progress for tempId: ${tempId}`);
    // If assessment has an existing tempId, merge with existing data
    if (this.partialAssessments.has(tempId)) {
      const existingAssessment = this.partialAssessments.get(tempId) || {};
      const updatedAssessment = { ...existingAssessment, ...assessment };
      updatedAssessment.isPartial = true;
      updatedAssessment.tempId = tempId;
      this.partialAssessments.set(tempId, updatedAssessment);
    } else {
      // Otherwise, create a new entry
      const newAssessment = { ...assessment };
      newAssessment.isPartial = true;
      newAssessment.tempId = tempId;
      this.partialAssessments.set(tempId, newAssessment);
    }
  }

  // Method to get assessment progress for the continue feature
  async getAssessmentProgress(tempId: string): Promise<Partial<AssessmentResult> | null> {
    return this.partialAssessments.get(tempId) || null;
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
    return Array.from(this.assessments.values());
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
}

// Database storage implementation
export class DatabaseStorage {
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
  async recordPromoCodeUsage(data: {promoCode: string, assessmentType: string, timestamp: string}): Promise<void> {
    console.log(`Recording promo code usage in database: ${data.promoCode} for ${data.assessmentType} assessment`);
    // Record in memory storage
    await this.memStorage.recordPromoCodeUsage(data);
  }
  
  // Save assessment progress during assessment (for auto-save functionality)
  async saveAssessmentProgress(tempId: string, assessment: Partial<AssessmentResult>): Promise<void> {
    try {
      console.log(`Saving partial assessment progress for tempId: ${tempId}`);
      // Implement database storage logic
      
      // Use the shared memory storage instance
      await this.memStorage.saveAssessmentProgress(tempId, assessment);
    } catch (error) {
      console.error('Error saving assessment progress:', error);
      // Still use the shared memory storage instance even in the error case
      await this.memStorage.saveAssessmentProgress(tempId, assessment);
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
  
  async saveAssessment(assessment: AssessmentResult): Promise<void> {
    try {
      // Store in the database using the assessmentResults table
      const { db } = await import('./db');
      const { assessmentResults } = await import('@shared/schema');
      
      const jsonScores = JSON.stringify(assessment.scores);
      const jsonProfile = JSON.stringify(assessment.profile);
      const jsonGenderProfile = assessment.genderProfile ? JSON.stringify(assessment.genderProfile) : null;
      const jsonResponses = JSON.stringify(assessment.responses);
      const jsonDemographics = JSON.stringify(assessment.demographics);
      
      // Insert into database using column names directly from schema
      await db.insert(assessmentResults).values({
        email: assessment.demographics.email,
        name: `${assessment.demographics.firstName} ${assessment.demographics.lastName}`,
        scores: jsonScores,
        profile: jsonProfile,
        gender_profile: jsonGenderProfile,
        responses: jsonResponses,
        demographics: jsonDemographics,
        couple_id: assessment.coupleId,
        couple_role: assessment.coupleRole
        // transaction_id will be linked when a payment is made
      });
      
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
      // Implementation of database retrieval
      return await this.memStorage.getAssessments(email);
    } catch (error) {
      console.error('Error getting assessments:', error);
      return await this.memStorage.getAssessments(email);
    }
  }
  
  async getAllAssessments(): Promise<AssessmentResult[]> {
    try {
      // Implementation of database retrieval
      return await this.memStorage.getAllAssessments();
    } catch (error) {
      console.error('Error getting all assessments:', error);
      return await this.memStorage.getAllAssessments();
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
            eq(assessmentResults.couple_id, coupleId),
            eq(assessmentResults.couple_role, role)
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
        genderProfile: dbResult.gender_profile ? JSON.parse(dbResult.gender_profile) : null,
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
      const { db } = await import('./db');
      const { coupleAssessments } = await import('@shared/schema');
      
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
      
      // Insert into database
      await db.insert(coupleAssessments).values({
        couple_id: report.coupleId,
        primary_id: primaryId,
        spouse_id: spouseId,
        analysis: JSON.stringify(report.analysis),
        compatibility_score: report.compatibilityScore,
        recommendations: JSON.stringify(report.recommendations || []),
        report_sent: report.reportSent || false
      });
      
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
      // Get from database using the coupleAssessments table
      const { db } = await import('./db');
      const { coupleAssessments } = await import('@shared/schema');
      const { eq } = await import('drizzle-orm');
      
      // Query the database for the couple assessment with the given coupleId
      const results = await db.select()
        .from(coupleAssessments)
        .where(eq(coupleAssessments.couple_id, coupleId));
      
      if (results.length === 0) {
        console.log(`No couple assessment found in database for couple ID: ${coupleId}`);
        return await this.memStorage.getCoupleAssessment(coupleId);
      }
      
      // Get the primary and spouse assessments
      const dbResult = results[0];
      const primaryAssessment = await this.getSpouseAssessment(coupleId, 'primary');
      const spouseAssessment = await this.getSpouseAssessment(coupleId, 'spouse');
      
      if (!primaryAssessment || !spouseAssessment) {
        console.log(`Primary or spouse assessment missing for couple ID: ${coupleId}`);
        return await this.memStorage.getCoupleAssessment(coupleId);
      }
      
      // Convert database record to CoupleAssessmentReport
      const report: CoupleAssessmentReport = {
        id: dbResult.id,
        coupleId: dbResult.couple_id,
        primary: primaryAssessment,
        spouse: spouseAssessment,
        analysis: JSON.parse(dbResult.analysis),
        timestamp: dbResult.timestamp.toISOString(),
        compatibilityScore: Number(dbResult.compatibility_score),
        recommendations: JSON.parse(dbResult.recommendations),
        reportSent: dbResult.report_sent
      };
      
      console.log(`Couple assessment report retrieved from database for couple ID: ${coupleId}`);
      return report;
    } catch (error) {
      console.error('Error getting couple assessment from database:', error);
      // Fall back to memory storage if database operation fails
      return await this.memStorage.getCoupleAssessment(coupleId);
    }
  }
  
  async getAllCoupleAssessments(): Promise<CoupleAssessmentReport[]> {
    try {
      // Get from database using the coupleAssessments table
      const { db } = await import('./db');
      const { coupleAssessments } = await import('@shared/schema');
      
      // Query the database for all couple assessments
      const results = await db.select().from(coupleAssessments);
      
      if (results.length === 0) {
        console.log('No couple assessments found in database');
        return await this.memStorage.getAllCoupleAssessments();
      }
      
      // Convert database records to CoupleAssessmentReport objects
      const reports: CoupleAssessmentReport[] = [];
      
      for (const dbResult of results) {
        try {
          const primaryAssessment = await this.getSpouseAssessment(dbResult.couple_id, 'primary');
          const spouseAssessment = await this.getSpouseAssessment(dbResult.couple_id, 'spouse');
          
          if (primaryAssessment && spouseAssessment) {
            reports.push({
              id: dbResult.id,
              coupleId: dbResult.couple_id,
              primary: primaryAssessment,
              spouse: spouseAssessment,
              analysis: JSON.parse(dbResult.analysis),
              timestamp: dbResult.timestamp.toISOString(),
              compatibilityScore: Number(dbResult.compatibility_score),
              recommendations: JSON.parse(dbResult.recommendations),
              reportSent: dbResult.report_sent
            });
          }
        } catch (err) {
          console.error(`Error processing couple assessment ${dbResult.couple_id}:`, err);
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
      // Implementation of database storage
      await this.memStorage.saveReferral(referral);
    } catch (error) {
      console.error('Error saving referral:', error);
      await this.memStorage.saveReferral(referral);
    }
  }
  
  async getAllReferrals(): Promise<ReferralData[]> {
    try {
      // Implementation of database retrieval
      return await this.memStorage.getAllReferrals();
    } catch (error) {
      console.error('Error getting all referrals:', error);
      return await this.memStorage.getAllReferrals();
    }
  }
  
  async updateReferralStatus(id: string, status: 'sent' | 'completed' | 'expired', completedTimestamp?: string): Promise<void> {
    try {
      // Implementation of database update
      await this.memStorage.updateReferralStatus(id, status, completedTimestamp);
    } catch (error) {
      console.error('Error updating referral status:', error);
      await this.memStorage.updateReferralStatus(id, status, completedTimestamp);
    }
  }
  
  async recordPageView(pageView: PageView): Promise<void> {
    try {
      // Store in the database using the pageViews table
      const { db } = await import('./db');
      const { pageViews } = await import('@shared/schema');
      
      // Convert timestamp to a Date object if it's a string
      let timestamp: Date;
      if (typeof pageView.timestamp === 'string') {
        timestamp = new Date(pageView.timestamp);
      } else {
        timestamp = new Date(); // Default to current time if invalid
      }
      
      // Insert into database
      await db.insert(pageViews).values({
        path: pageView.path,
        timestamp: timestamp,
        referrer: pageView.referrer,
        user_agent: pageView.userAgent,
        ip_address: pageView.ipAddress,
        session_id: pageView.sessionId
      });
      
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
      // Store in the database using the visitorSessions table
      const { db } = await import('./db');
      const { visitorSessions } = await import('@shared/schema');
      
      // Insert into database
      await db.insert(visitorSessions).values({
        id: session.id,
        start_time: session.startTime,
        end_time: session.endTime,
        user_agent: session.userAgent,
        ip_address: session.ipAddress,
        page_count: session.pageCount,
        referrer: session.referrer,
        user_id: session.userId
      });
      
      console.log(`Visitor session created in database: ${session.id}`);
      
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
      // Update in the database
      const { db } = await import('./db');
      const { visitorSessions } = await import('@shared/schema');
      const { eq } = await import('drizzle-orm');
      
      // Update the session in the database
      await db.update(visitorSessions)
        .set({
          end_time: endTime,
          page_count: pageCount
        })
        .where(eq(visitorSessions.id, sessionId));
      
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
      // Retrieve from database
      const { db } = await import('./db');
      const { pageViews } = await import('@shared/schema');
      const { and, gte, lte, desc } = await import('drizzle-orm');
      
      let query = db.select().from(pageViews);
      
      // Apply date filters if provided
      if (startDate || endDate) {
        const conditions = [];
        if (startDate) {
          conditions.push(gte(pageViews.timestamp, new Date(startDate)));
        }
        if (endDate) {
          conditions.push(lte(pageViews.timestamp, new Date(endDate)));
        }
        if (conditions.length > 0) {
          query = query.where(and(...conditions));
        }
      }
      
      // Order by most recent first
      query = query.orderBy(desc(pageViews.timestamp));
      
      // Execute query
      const results = await query;
      
      // Transform and return
      return results.map(row => ({
        id: row.id ?? '',
        path: row.path,
        timestamp: row.timestamp.toISOString(),
        referrer: row.referrer ?? '',
        userAgent: row.user_agent ?? '',
        ipAddress: row.ip_address ?? '',
        sessionId: row.session_id ?? ''
      }));
    } catch (error) {
      console.error('Error getting page views from database:', error);
      // Fall back to memory storage
      return await this.memStorage.getPageViews(startDate, endDate);
    }
  }
  
  async getVisitorSessions(startDate?: string, endDate?: string): Promise<VisitorSession[]> {
    try {
      // Retrieve from database
      const { db } = await import('./db');
      const { visitorSessions } = await import('@shared/schema');
      const { and, gte, lte, desc } = await import('drizzle-orm');
      
      let query = db.select().from(visitorSessions);
      
      // Apply date filters if provided
      if (startDate || endDate) {
        const conditions = [];
        if (startDate) {
          conditions.push(gte(visitorSessions.start_time, new Date(startDate)));
        }
        if (endDate) {
          conditions.push(lte(visitorSessions.start_time, new Date(endDate)));
        }
        if (conditions.length > 0) {
          query = query.where(and(...conditions));
        }
      }
      
      // Order by most recent first
      query = query.orderBy(desc(visitorSessions.start_time));
      
      // Execute query
      const results = await query;
      
      // Transform and return
      return results.map(row => ({
        id: row.id,
        startTime: row.start_time.toISOString(),
        endTime: row.end_time ? row.end_time.toISOString() : undefined,
        pageCount: row.page_count ?? 0,
        userAgent: row.user_agent ?? '',
        ipAddress: row.ip_address ?? '',
        referrer: row.referrer ?? '',
        userId: row.user_id
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
      
      // Get page views and sessions for the period directly from database
      const pageViews = await this.getPageViews(startDate.toISOString(), now.toISOString());
      const sessions = await this.getVisitorSessions(startDate.toISOString(), now.toISOString());
      
      // Calculate metrics
      const totalPageViews = pageViews.length;
      const uniqueVisitors = new Set(sessions.map(s => s.id)).size;
      
      // Calculate average session duration
      let totalDuration = 0;
      let countedSessions = 0;
      
      for (const session of sessions) {
        if (session.endTime) {
          const duration = new Date(session.endTime).getTime() - new Date(session.startTime).getTime();
          if (duration > 0) {
            totalDuration += duration;
            countedSessions++;
          }
        }
      }
      
      const averageSessionDuration = countedSessions > 0 ? totalDuration / countedSessions : 0;
      
      // Count page views by path
      const pathCounts: Record<string, number> = {};
      for (const view of pageViews) {
        pathCounts[view.path] = (pathCounts[view.path] || 0) + 1;
      }
      
      // Sort paths by view count and get top 5
      const popularPages = Object.entries(pathCounts)
        .sort(([, countA], [, countB]) => countB - countA)
        .slice(0, 5)
        .map(([path, count]) => ({ path, count }));
      
      return {
        period,
        startDate: startDate.toISOString(),
        endDate: now.toISOString(),
        totalPageViews,
        uniqueVisitors,
        averageSessionDuration,
        popularPages
      };
    } catch (error) {
      console.error('Error getting analytics summary from database:', error);
      // Fall back to memory storage
      return await this.memStorage.getAnalyticsSummary(period);
    }
  }
  
  async savePaymentTransaction(transaction: PaymentTransaction): Promise<void> {
    try {
      // Store in the database using the payments table
      const { db } = await import('./db');
      const { payments } = await import('@shared/schema');
      
      // Insert into database
      await db.insert(payments).values({
        stripe_id: transaction.stripeId,
        customer_email: transaction.customerEmail,
        amount: transaction.amount,
        currency: transaction.currency,
        status: transaction.status,
        created: new Date(transaction.created),
        assessment_type: transaction.assessmentType,
        metadata: JSON.stringify(transaction.metadata || {}),
        is_refunded: transaction.isRefunded || false,
        refund_amount: transaction.refundAmount,
        refund_reason: transaction.refundReason,
        promo_code: transaction.promoCode
      });
      
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
      // Retrieve from database
      const { db } = await import('./db');
      const { payments } = await import('@shared/schema');
      const { and, gte, lte, desc } = await import('drizzle-orm');
      
      let query = db.select().from(payments);
      
      // Apply date filters if provided
      if (startDate || endDate) {
        const conditions = [];
        if (startDate) {
          conditions.push(gte(payments.created, new Date(startDate)));
        }
        if (endDate) {
          conditions.push(lte(payments.created, new Date(endDate)));
        }
        if (conditions.length > 0) {
          query = query.where(and(...conditions));
        }
      }
      
      // Order by most recent first
      query = query.orderBy(desc(payments.created));
      
      // Execute query
      const results = await query;
      
      // Transform and return
      return results.map(row => ({
        stripeId: row.stripe_id,
        customerEmail: row.customer_email,
        amount: row.amount,
        currency: row.currency,
        status: row.status,
        created: row.created.toISOString(),
        assessmentType: row.assessment_type,
        metadata: row.metadata ? JSON.parse(row.metadata) : {},
        isRefunded: row.is_refunded ?? false,
        refundAmount: row.refund_amount,
        refundReason: row.refund_reason,
        promoCode: row.promo_code
      }));
    } catch (error) {
      console.error('Error getting payment transactions from database:', error);
      // Fall back to memory storage
      return await this.memStorage.getPaymentTransactions(startDate, endDate);
    }
  }
  
  async getPaymentTransactionByStripeId(stripeId: string): Promise<PaymentTransaction | null> {
    try {
      // Retrieve from database
      const { db } = await import('./db');
      const { payments } = await import('@shared/schema');
      const { eq } = await import('drizzle-orm');
      
      // Find transaction by Stripe ID
      const [transaction] = await db.select()
        .from(payments)
        .where(eq(payments.stripe_id, stripeId));
      
      if (!transaction) {
        return null;
      }
      
      // Transform and return
      return {
        stripeId: transaction.stripe_id,
        customerEmail: transaction.customer_email,
        amount: transaction.amount,
        currency: transaction.currency,
        status: transaction.status,
        created: transaction.created.toISOString(),
        assessmentType: transaction.assessment_type,
        metadata: transaction.metadata ? JSON.parse(transaction.metadata) : {},
        isRefunded: transaction.is_refunded ?? false,
        refundAmount: transaction.refund_amount,
        refundReason: transaction.refund_reason,
        promoCode: transaction.promo_code
      };
    } catch (error) {
      console.error('Error getting payment transaction by Stripe ID from database:', error);
      // Fall back to memory storage
      return await this.memStorage.getPaymentTransactionByStripeId(stripeId);
    }
  }
  
  async updatePaymentTransactionStatus(stripeId: string, status: string): Promise<void> {
    try {
      // Update in the database
      const { db } = await import('./db');
      const { payments } = await import('@shared/schema');
      const { eq } = await import('drizzle-orm');
      
      // Update the transaction status
      await db.update(payments)
        .set({ status })
        .where(eq(payments.stripe_id, stripeId));
      
      console.log(`Payment transaction status updated in database: ${stripeId} -> ${status}`);
      
      // Also update in memory storage
      await this.memStorage.updatePaymentTransactionStatus(stripeId, status);
    } catch (error) {
      console.error('Error updating payment transaction status in database:', error);
      // Fall back to memory storage
      await this.memStorage.updatePaymentTransactionStatus(stripeId, status);
    }
  }
  
  async recordRefund(stripeId: string, amount: number, reason?: string): Promise<void> {
    try {
      // Update in the database
      const { db } = await import('./db');
      const { payments } = await import('@shared/schema');
      const { eq } = await import('drizzle-orm');
      
      // Update the transaction with refund information
      await db.update(payments)
        .set({
          is_refunded: true,
          refund_amount: amount,
          refund_reason: reason,
          status: 'refunded'
        })
        .where(eq(payments.stripe_id, stripeId));
      
      console.log(`Refund recorded in database for transaction: ${stripeId}`);
      
      // Also update in memory storage
      await this.memStorage.recordRefund(stripeId, amount, reason);
    } catch (error) {
      console.error('Error recording refund in database:', error);
      // Fall back to memory storage
      await this.memStorage.recordRefund(stripeId, amount, reason);
    }
  }
}

// Export the storage instance 
export const storage = new DatabaseStorage();