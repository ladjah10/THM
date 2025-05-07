/**
 * Middleware to track page views and analytics data
 */
import { Request, Response, NextFunction } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { storage } from './storage';
import { PageView, VisitorSession } from '@shared/schema';

// Helper function to set a cookie if it doesn't exist
function ensureSessionCookie(req: Request, res: Response): string {
  let sessionId = req.cookies?.sessionId;
  
  if (!sessionId) {
    sessionId = uuidv4();
    res.cookie('sessionId', sessionId, {
      maxAge: 24 * 60 * 60 * 1000, // 24 hours
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax'
    });
    
    // Create a new visitor session
    const session: VisitorSession = {
      id: sessionId,
      startTime: new Date().toISOString(),
      endTime: null,
      pageCount: 0,
      deviceType: detectDeviceType(req),
      browser: detectBrowser(req),
      country: getCountryFromIP(req),
      region: getRegionFromIP(req)
    };
    
    storage.createVisitorSession(session).catch(err => {
      console.error('Error creating visitor session:', err);
    });
  }
  
  return sessionId;
}

// Helper functions to extract user info from request
function detectDeviceType(req: Request): string {
  const ua = req.headers['user-agent'] || '';
  
  if (/mobile/i.test(ua)) return 'mobile';
  if (/tablet/i.test(ua)) return 'tablet';
  if (/iPad|Android(?!.*mobile)/i.test(ua)) return 'tablet';
  
  return 'desktop';
}

function detectBrowser(req: Request): string {
  const ua = req.headers['user-agent'] || '';
  
  if (/chrome/i.test(ua)) return 'Chrome';
  if (/firefox/i.test(ua)) return 'Firefox';
  if (/safari/i.test(ua)) return 'Safari';
  if (/edge|edg/i.test(ua)) return 'Edge';
  if (/msie|trident/i.test(ua)) return 'Internet Explorer';
  
  return 'Other';
}

function getCountryFromIP(req: Request): string {
  // In a production implementation, this would use a GeoIP database
  // For this simplified version, we'll just return a placeholder
  return 'Unknown';
}

function getRegionFromIP(req: Request): string {
  // Same as country, would use a GeoIP database in production
  return 'Unknown';
}

// Analytics middleware
export function analyticsMiddleware(req: Request, res: Response, next: NextFunction) {
  // Skip analytics for API endpoints and static assets
  if (req.path.startsWith('/api/') || 
      req.path.includes('.') || 
      req.path === '/favicon.ico') {
    return next();
  }
  
  const sessionId = ensureSessionCookie(req, res);
  
  // Record page view
  const pageView: PageView = {
    id: uuidv4(),
    path: req.path,
    timestamp: new Date().toISOString(),
    referrer: req.headers.referer || '',
    userAgent: req.headers['user-agent'] || '',
    ipAddress: req.ip || '0.0.0.0',
    sessionId
  };
  
  storage.recordPageView(pageView).catch(err => {
    console.error('Error recording page view:', err);
  });
  
  // Update session info
  storage.getVisitorSessions().then(sessions => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
      const pageCount = session.pageCount + 1;
      storage.updateVisitorSession(
        sessionId, 
        new Date().toISOString(), 
        pageCount
      ).catch(err => {
        console.error('Error updating visitor session:', err);
      });
    }
  }).catch(err => {
    console.error('Error retrieving visitor sessions:', err);
  });
  
  next();
}