import mongoose from 'mongoose';
import env from './env';

/**
 * WHAT: MongoDB database connection management
 * 
 * WHY: Centralized database connection logic provides:
 * - Single point of configuration
 * - Consistent error handling
 * - Connection state management
 * - Easy testing and mocking
 * 
 * HOW: Uses Mongoose to manage MongoDB connection lifecycle
 */

/**
 * WHAT: MongoDB connection options
 * 
 * WHY: These options improve connection stability and performance:
 * - retryWrites: Automatically retry write operations on network errors
 * - w: 'majority' ensures writes are acknowledged by majority of replica set
 * 
 * HOW: Passed to mongoose.connect() to configure connection behavior
 */
const connectionOptions: mongoose.ConnectOptions = {
  // WHY: Retry writes improve reliability in case of transient network issues
  retryWrites: true,
  // WHY: Write concern ensures data durability in replica sets
  w: 'majority',
};

/**
 * WHAT: Establishes connection to MongoDB database
 * 
 * WHY: Separate connection function allows:
 * - Explicit connection control
 * - Error handling at connection time
 * - Testing without auto-connection
 * - Connection retry logic if needed
 * 
 * HOW: Uses mongoose.connect() with validated MongoDB URI from env
 */
export async function connectDatabase(): Promise<void> {
  try {
    // WHY: Check if already connected to avoid duplicate connections
    if (mongoose.connection.readyState === 1) {
      console.log('✅ MongoDB already connected');
      return;
    }

    // WHY: Connect to MongoDB using validated URI from environment
    await mongoose.connect(env.MONGODB_URI, connectionOptions);

    console.log('✅ MongoDB connected successfully');
  } catch (error) {
    // WHY: Log error and exit process - database is critical, app can't run without it
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
}

/**
 * WHAT: Closes MongoDB connection gracefully
 * 
 * WHY: Graceful shutdown ensures:
 * - Pending operations complete
 * - Connections are properly closed
 * - No resource leaks
 * 
 * HOW: Uses mongoose.connection.close() to close connection
 */
export async function disconnectDatabase(): Promise<void> {
  try {
    await mongoose.connection.close();
    console.log('✅ MongoDB connection closed');
  } catch (error) {
    console.error('❌ Error closing MongoDB connection:', error);
  }
}

/**
 * WHAT: Database connection event handlers
 * 
 * WHY: Event handlers provide visibility into connection state:
 * - Monitor connection lifecycle
 * - Debug connection issues
 * - Handle reconnection scenarios
 * 
 * HOW: Attaches listeners to mongoose connection events
 */
mongoose.connection.on('connected', () => {
  console.log('📊 MongoDB connection established');
});

mongoose.connection.on('error', (error) => {
  console.error('❌ MongoDB connection error:', error);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
});

// WHY: Handle process termination to close database connection gracefully
process.on('SIGINT', async () => {
  await disconnectDatabase();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  await disconnectDatabase();
  process.exit(0);
});

