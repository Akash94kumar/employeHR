/**
 * WHAT: Database seed script to create initial users
 * 
 * WHY: Provides initial users for testing and development.
 * Creates users for all roles (SUPER_ADMIN, HR, MANAGER, EMPLOYEE).
 * 
 * HOW: Run with: npx tsx src/scripts/seed.ts
 */

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import { User } from '../modules/auth/auth.model';
import { UserRole } from '../modules/auth/auth.types';
import env from '../config/env';

/**
 * WHAT: Seed function to create initial users
 * 
 * WHY: Creates test users for all roles.
 * Uses bcrypt to hash passwords securely.
 * 
 * HOW: Connects to MongoDB, creates users, then disconnects
 */
async function seed() {
  try {
    // WHY: Connect to MongoDB
    console.log('Connecting to MongoDB...');
    await mongoose.connect(env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // WHY: Clear existing users (optional - comment out if you want to keep existing users)
    // await User.deleteMany({});
    // console.log('✅ Cleared existing users');

    // WHY: Check if users already exist
    const existingUsers = await User.find();
    if (existingUsers.length > 0) {
      console.log('⚠️  Users already exist. Skipping seed.');
      console.log('   To re-seed, delete existing users first.');
      await mongoose.disconnect();
      return;
    }

    // WHY: Hash password once for all users (same password for testing)
    const hashedPassword = await bcrypt.hash('password123', 10);

    // WHY: Create users for each role
    const users = [
      {
        email: 'admin@hrportal.com',
        password: hashedPassword,
        role: UserRole.SUPER_ADMIN,
        isActive: true,
      },
      {
        email: 'hr@hrportal.com',
        password: hashedPassword,
        role: UserRole.HR,
        isActive: true,
      },
      {
        email: 'manager@hrportal.com',
        password: hashedPassword,
        role: UserRole.MANAGER,
        isActive: true,
      },
      {
        email: 'employee@hrportal.com',
        password: hashedPassword,
        role: UserRole.EMPLOYEE,
        isActive: true,
      },
    ];

    // WHY: Insert users into database
    console.log('Creating users...');
    const createdUsers = await User.insertMany(users);
    console.log(`✅ Created ${createdUsers.length} users:`);

    // WHY: Display created users
    createdUsers.forEach((user) => {
      console.log(`   - ${user.email} (${user.role})`);
    });

    console.log('\n📝 Login Credentials:');
    console.log('   Email: admin@hrportal.com | Password: password123');
    console.log('   Email: hr@hrportal.com | Password: password123');
    console.log('   Email: manager@hrportal.com | Password: password123');
    console.log('   Email: employee@hrportal.com | Password: password123');

    // WHY: Disconnect from MongoDB
    await mongoose.disconnect();
    console.log('\n✅ Seed completed successfully!');
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    await mongoose.disconnect();
    process.exit(1);
  }
}

// WHY: Run seed function
seed();

