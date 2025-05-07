import { users, type User, type InsertUser } from "@shared/schema";
import { 
  AssessmentResult, 
  CoupleAssessmentReport, 
  ReferralData, 
  PageView, 
  VisitorSession, 
  AnalyticsSummary 
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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private assessments: AssessmentResult[];
  private coupleAssessments: Map<string, CoupleAssessmentReport>;
  private referrals: ReferralData[];
  private pageViews: PageView[] = [];
  private visitorSessions: VisitorSession[] = [];
  currentId: number;

  constructor() {
    this.users = new Map();
    this.assessments = [];
    this.coupleAssessments = new Map();
    this.referrals = [];
    this.pageViews = [];
    this.visitorSessions = [];
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
    this.pageViews.push(pageView);
  }
  
  async createVisitorSession(session: VisitorSession): Promise<void> {
    this.visitorSessions.push(session);
  }
  
  async updateVisitorSession(sessionId: string, endTime: string, pageCount: number): Promise<void> {
    const sessionIndex = this.visitorSessions.findIndex(s => s.id === sessionId);
    
    if (sessionIndex >= 0) {
      this.visitorSessions[sessionIndex] = {
        ...this.visitorSessions[sessionIndex],
        endTime,
        pageCount
      };
    }
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
    // Calculate date range based on period
    const now = new Date();
    let startDate: Date;
    
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
    
    // Filter data for the period
    const filteredPageViews = await this.getPageViews(startDate.toISOString(), now.toISOString());
    const filteredSessions = await this.getVisitorSessions(startDate.toISOString(), now.toISOString());
    
    // Count unique visitors (by sessionId)
    const uniqueVisitors = new Set(filteredPageViews.map(view => view.sessionId)).size;
    
    // Get top pages
    const pageCounts: Record<string, number> = {};
    filteredPageViews.forEach(view => {
      if (!pageCounts[view.path]) {
        pageCounts[view.path] = 0;
      }
      pageCounts[view.path]++;
    });
    
    const topPages = Object.entries(pageCounts)
      .map(([path, count]) => ({ path, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
    
    // Calculate daily visitors
    const dailyVisitorMap: Record<string, number> = {};
    filteredPageViews.forEach(view => {
      const date = new Date(view.timestamp).toISOString().split('T')[0];
      if (!dailyVisitorMap[date]) {
        dailyVisitorMap[date] = 0;
      }
      dailyVisitorMap[date]++;
    });
    
    const dailyVisitors = Object.entries(dailyVisitorMap)
      .map(([date, count]) => ({ date, count }))
      .sort((a, b) => a.date.localeCompare(b.date));
    
    // Calculate conversion rate (assessments started / visitors)
    const uniqueAssessmentEmails = new Set(
      this.assessments
        .filter(a => new Date(a.timestamp) >= startDate)
        .map(a => a.email)
    ).size;
    
    const conversionRate = uniqueVisitors > 0 
      ? (uniqueAssessmentEmails / uniqueVisitors) * 100 
      : 0;
    
    // Calculate average session duration
    let totalDuration = 0;
    let completedSessions = 0;
    
    filteredSessions.forEach(session => {
      if (session.endTime) {
        const startTime = new Date(session.startTime).getTime();
        const endTime = new Date(session.endTime).getTime();
        const duration = (endTime - startTime) / 1000; // in seconds
        totalDuration += duration;
        completedSessions++;
      }
    });
    
    const averageSessionDuration = completedSessions > 0 
      ? totalDuration / completedSessions 
      : 0;
    
    return {
      totalVisitors: uniqueVisitors,
      totalPageViews: filteredPageViews.length,
      topPages,
      dailyVisitors,
      conversionRate,
      averageSessionDuration
    };
  }
}

export const storage = new MemStorage();
