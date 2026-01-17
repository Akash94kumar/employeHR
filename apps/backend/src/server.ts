import { createApp } from './app';
import { connectDatabase } from './config/db';
import env from './config/env';

/**
 * WHAT: Server entry point - starts the HTTP server
 * 
 * WHY: Separating server startup from app configuration provides:
 * - Testability (can test app without starting server)
 * - Clear separation: app.ts = configuration, server.ts = lifecycle
 * - Easy to swap server implementations (HTTP, HTTPS, etc.)
 * 
 * HOW: Connects to database, creates app, starts HTTP server
 */

/**
 * WHAT: Starts the Express server
 * 
 * WHY: Async function allows proper async/await for database connection
 * This ensures database is connected before server starts accepting requests
 * 
 * HOW: Connects to MongoDB, creates Express app, starts HTTP server
 */
async function startServer(): Promise<void> {
  try {
    // WHY: Connect to database first - app can't function without database
    // If connection fails, process exits (handled in connectDatabase)
    await connectDatabase();

    // WHY: Create Express app after database connection
    // This ensures app is ready to handle requests that need database
    const app = createApp();

    // WHY: Start HTTP server on configured port
    // Server listens for incoming requests
    const server = app.listen(env.PORT, () => {
      console.log(`🚀 Server running on http://localhost:${env.PORT}`);
      console.log(`📝 Environment: ${env.NODE_ENV}`);
      console.log(`🔗 Health check: http://localhost:${env.PORT}/api/health`);
    });

    // WHY: Graceful shutdown handling
    // Closes server and database connection when process receives termination signal
    process.on('SIGTERM', () => {
      console.log('SIGTERM received, shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });

    process.on('SIGINT', () => {
      console.log('SIGINT received, shutting down gracefully...');
      server.close(() => {
        console.log('Server closed');
        process.exit(0);
      });
    });
  } catch (error) {
    // WHY: If server startup fails, log error and exit
    // Prevents server from running in broken state
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// WHY: Start server when this file is executed
// This is the entry point when running: npm run dev or npm start
startServer();

