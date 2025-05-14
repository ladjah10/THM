import express, { type Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { analyticsMiddleware } from "./analytics-middleware";

const app = express();

// Create a raw body buffer for webhook requests with specific fix for stream readable errors
app.use(async (req, res, next) => {
  // Only create raw body for Stripe webhook path
  if (req.originalUrl === '/api/webhooks/stripe') {
    console.log('📥 Stripe webhook received, capturing raw body');
    
    // For stream not readable errors, we need a complete buffering solution
    try {
      // Use a promise-based approach to collect the entire stream
      const chunks: Buffer[] = [];
      
      // Handle data chunks
      req.on('data', (chunk: Buffer) => {
        chunks.push(chunk);
      });
      
      // Create a promise that resolves when the stream ends or rejects on error
      await new Promise<void>((resolve, reject) => {
        req.on('end', () => {
          try {
            // Combine all chunks into a single buffer and convert to string
            const rawBodyBuffer = Buffer.concat(chunks);
            const rawBody = rawBodyBuffer.toString('utf8');
            
            // Store both the string and buffer versions for flexibility
            (req as any).rawBody = rawBody;
            (req as any).rawBodyBuffer = rawBodyBuffer;
            
            console.log(`✅ Webhook body captured successfully (${rawBody.length} bytes)`);
            resolve();
          } catch (err) {
            reject(err);
          }
        });
        
        req.on('error', (err) => {
          console.error('❌ Error reading webhook request body:', err);
          reject(err);
        });
      });
      
      // If we get here, the raw body was successfully captured
      next();
    } catch (err: any) {
      console.error('❌ Fatal error processing webhook body:', err);
      res.status(500).json({ 
        error: 'Failed to process webhook body',
        message: err.message
      });
    }
  } else {
    next();
  }
});

// Standard middleware for non-webhook endpoints
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Add analytics middleware to track page views
app.use(analyticsMiddleware);

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
  // this serves both the API and the client.
  // It is the only port that is not firewalled.
  const port = 5000;
  server.listen({
    port,
    host: "0.0.0.0",
    reusePort: true,
  }, () => {
    log(`serving on port ${port}`);
  });
})();
