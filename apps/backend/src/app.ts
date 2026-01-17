import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import env from './config/env';
import { errorMiddleware } from './middlewares/error.middleware';
import { notFoundMiddleware } from './middlewares/notFound.middleware';
import healthRoutes from './routes/health.routes';
import swaggerRoutes from './routes/swagger.routes';
import authRoutes from './modules/auth/auth.routes';
import adminHrRoutes from './modules/admin/hr/hr.routes';

/**
 * WHAT: Express application configuration
 * 
 * WHY: Separating app configuration from server startup provides:
 * - Testability (can create app instance without starting server)
 * - Reusability (app can be used in tests, serverless functions, etc.)
 * - Clear separation of concerns (app config vs server lifecycle)
 * 
 * HOW: Configures Express app with middlewares and routes, returns app instance
 */

/**
 * WHAT: Creates and configures Express application
 * 
 * WHY: Factory function pattern allows:
 * - Easy testing (can create multiple app instances)
 * - Clear initialization order
 * - Dependency injection if needed later
 * 
 * HOW: Sets up all middlewares and routes, returns configured app
 */
export function createApp(): Express {
  const app = express();

  // ============================================
  // MIDDLEWARES (Order matters!)
  // ============================================

  // WHY: CORS must be first to allow cross-origin requests
  // This enables frontend (running on different port) to make API requests
  app.use(
    cors({
      origin: env.CORS_ORIGIN,
      credentials: true, // WHY: Allows cookies/credentials to be sent with requests
    }),
  );

  // WHY: JSON body parser allows Express to parse JSON request bodies
  // Without this, req.body would be undefined for JSON requests
  app.use(express.json());

  // WHY: URL-encoded body parser handles form submissions
  // extended: true allows rich objects and arrays in form data
  app.use(express.urlencoded({ extended: true }));

  // ============================================
  // ROUTES
  // ============================================

  // WHY: Health check route - no authentication needed, used for monitoring
  app.use('/api', healthRoutes);

  // WHY: Swagger documentation - API docs at /api-docs
  app.use('/', swaggerRoutes);

  // WHY: Authentication routes - handles login, register, logout, token refresh
  app.use('/api/auth', authRoutes);

  // WHY: Admin routes - HR management (SUPER_ADMIN only)
  app.use('/api/admin/hr', adminHrRoutes);

  // ============================================
  // ERROR HANDLING (Must be last!)
  // ============================================

  // WHY: 404 handler must come after all routes but before error handler
  // This catches any requests that don't match defined routes
  app.use(notFoundMiddleware);

  // WHY: Error handler must be last middleware
  // It catches all errors from routes and other middlewares
  app.use(errorMiddleware);

  return app;
}

