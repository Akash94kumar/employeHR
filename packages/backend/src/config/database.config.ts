import { registerAs } from '@nestjs/config';

/**
 * WHAT: Database configuration factory
 * 
 * WHY: Centralizes database configuration logic
 * Makes it easy to switch between different database setups
 * 
 * HOW: Uses registerAs to create a namespaced configuration
 */
export default registerAs('database', () => ({
  uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/employee-hr-portal',
  // WHY: Connection options can be added here for advanced configuration
  options: {
    retryWrites: true,
    w: 'majority',
  },
}));

