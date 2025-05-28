import { Request } from 'express';
import session from 'express-session';

// Extend Request type with session
interface RequestWithSession extends Request {
  session: session.Session & Partial<session.SessionData> & {
    user?: {
      role: string;
      id?: number;
      username?: string;
    };
  };
  isAuthenticated?: () => boolean;
}

// Admin authentication helper
export function isUserAdmin(req: RequestWithSession): boolean {
  return req.session?.user?.role === 'admin';
}

// Admin authentication middleware
export function requireAdmin(req: RequestWithSession, res: any, next: any) {
  if (!req.session?.user || req.session.user.role !== 'admin') {
    return res.status(401).json({ 
      success: false, 
      message: 'Unauthorized: Admin access required' 
    });
  }
  next();
}

// Alternative header-based admin auth for API calls
export function validateAdminAuth(req: RequestWithSession): boolean {
  const adminUsername = 'admin';
  const adminPassword = '100marriage';
  const adminHeader = req.headers['x-admin-auth'];
  
  // Check either session-based auth or header-based auth
  const isSessionAuth = req.session?.user?.role === 'admin';
  const isHeaderAuth = adminHeader === Buffer.from(`${adminUsername}:${adminPassword}`).toString('base64');
  
  return isSessionAuth || isHeaderAuth;
}