import express, { type Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { analyticsMiddleware } from "./analytics-middleware";

const app = express();

// Create a raw body buffer for webhook requests - improve with proper error handling
app.use((req, res, next) => {
  // Only create raw body for Stripe webhook path
  if (req.originalUrl === '/api/webhooks/stripe') {
    let rawBody = '';
    let hasError = false;
    
    req.on('data', (chunk) => {
      rawBody += chunk.toString();
    });
    
    req.on('error', (err) => {
      console.error('Error reading webhook request body:', err);
      hasError = true;
      res.status(400).send(`Webhook Error: ${err.message}`);
    });
    
    req.on('end', () => {
      if (!hasError) {
        (req as any).rawBody = rawBody;
        console.log('Stripe webhook raw body captured:', rawBody.length > 0 ? 'Yes' : 'No (empty)');
        next();
      }
    });
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
