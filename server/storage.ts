import { users, type User, type InsertUser } from "@shared/schema";
import { AssessmentResult } from "@shared/schema";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  saveAssessment(assessment: AssessmentResult): Promise<void>;
  getAssessments(email: string): Promise<AssessmentResult[]>;
  getAllAssessments(): Promise<AssessmentResult[]>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private assessments: AssessmentResult[];
  currentId: number;

  constructor() {
    this.users = new Map();
    this.assessments = [];
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
    this.assessments.push(assessment);
  }
  
  async getAssessments(email: string): Promise<AssessmentResult[]> {
    return this.assessments.filter(a => a.email === email);
  }
  
  async getAllAssessments(): Promise<AssessmentResult[]> {
    return [...this.assessments];
  }
}

export const storage = new MemStorage();
