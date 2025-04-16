import { users, type User, type InsertUser } from "@shared/schema";
import { AssessmentResult, CoupleAssessmentReport } from "@shared/schema";

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
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private assessments: AssessmentResult[];
  private coupleAssessments: Map<string, CoupleAssessmentReport>;
  currentId: number;

  constructor() {
    this.users = new Map();
    this.assessments = [];
    this.coupleAssessments = new Map();
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
}

export const storage = new MemStorage();
