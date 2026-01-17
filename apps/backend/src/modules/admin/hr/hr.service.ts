/**
 * WHAT: Admin HR Management service - business logic layer
 * 
 * WHY: Service layer separates business logic from HTTP layer (controller).
 * Provides:
 * - Reusability (logic can be used by controllers, other services, etc.)
 * - Testability (can test business logic without HTTP)
 * - Single Responsibility (controller handles HTTP, service handles logic)
 * 
 * HOW: Contains all HR management business logic
 */

import { User } from '../../auth/auth.model';
import { UserRole } from '../../auth/auth.types';
import { CreateHrInput, UpdateHrStatusInput } from './hr.validation';
import { HrUserResponse, HrListResponse } from './hr.types';
import crypto from 'crypto';

/**
 * WHAT: Generate random password
 * 
 * WHY: Auto-generate secure passwords when admin doesn't provide one.
 * Ensures strong passwords without requiring admin to create them.
 * 
 * HOW: Uses crypto to generate random secure password
 */
function generateRandomPassword(): string {
  // WHY: Generate 16-character random password with mixed case, numbers, and symbols
  // Secure enough for initial password (user should change on first login)
  const length = 16;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  const randomBytes = crypto.randomBytes(length);
  let password = '';
  
  for (let i = 0; i < length; i++) {
    password += charset[randomBytes[i] % charset.length];
  }
  
  return password;
}

/**
 * WHAT: Create HR user service
 * 
 * WHY: Creates new HR user accounts.
 * Only SUPER_ADMIN can create HR users (enforced at route level).
 * 
 * HOW: Creates user with HR role, hashes password, returns user data
 */
export async function createHrUser(
  input: CreateHrInput,
): Promise<HrUserResponse> {
  // WHY: Check if user already exists - prevents duplicate accounts
  const existingUser = await User.findOne({ email: input.email });
  if (existingUser) {
    throw new Error('User with this email already exists');
  }

  // WHY: Auto-generate password if not provided
  // Admin can provide custom password, but auto-generation is more secure
  const password = input.password || generateRandomPassword();

  // WHY: Create user with HR role (fixed - cannot be changed)
  // HR role is assigned automatically, not user-selectable
  const user = await User.create({
    email: input.email,
    password, // WHY: Password will be hashed by pre-save hook in model
    role: UserRole.HR, // WHY: Fixed role - always HR for this endpoint
    isActive: true, // WHY: New HR users are active by default
  });

  // WHY: Return user without password (security)
  const userObject = user.toObject();
  delete (userObject as any).password;
  delete (userObject as any).refreshToken;

  return {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  } as HrUserResponse;
}

/**
 * WHAT: Get all HR users service
 * 
 * WHY: Retrieves list of all HR users for admin dashboard.
 * Only returns HR role users (filtered by role).
 * 
 * HOW: Queries database for users with HR role
 */
export async function getHrUsers(): Promise<HrListResponse> {
  // WHY: Find all users with HR role
  // Excludes password and refreshToken by default (select: false in model)
  const users = await User.find({ role: UserRole.HR })
    .sort({ createdAt: -1 }) // WHY: Sort by newest first
    .lean(); // WHY: lean() returns plain objects (faster, no Mongoose overhead)

  // WHY: Transform to response format
  const hrUsers: HrUserResponse[] = users.map((user) => ({
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  }));

  return {
    users: hrUsers,
    total: hrUsers.length,
  };
}

/**
 * WHAT: Update HR user status service
 * 
 * WHY: Allows activating/deactivating HR users.
 * Uses soft delete (isActive flag) instead of hard delete for:
 * - Audit trail (preserve user history)
 * - Data retention (compliance)
 * - Ability to reactivate if needed
 * 
 * HOW: Updates isActive field on user document
 */
export async function updateHrStatus(
  userId: string,
  input: UpdateHrStatusInput,
): Promise<HrUserResponse> {
  // WHY: Find user and verify it's an HR user
  const user = await User.findById(userId);
  if (!user) {
    throw new Error('User not found');
  }

  // WHY: Ensure user is HR role (security check)
  if (user.role !== UserRole.HR) {
    throw new Error('User is not an HR user');
  }

  // WHY: Update isActive status (soft delete)
  user.isActive = input.isActive;
  await user.save();

  // WHY: Return updated user without sensitive fields
  const userObject = user.toObject();
  delete (userObject as any).password;
  delete (userObject as any).refreshToken;

  return {
    id: user._id.toString(),
    email: user.email,
    role: user.role,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  } as HrUserResponse;
}

