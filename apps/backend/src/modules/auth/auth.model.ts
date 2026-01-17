import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from './auth.types';
import bcrypt from 'bcrypt';
import { BCRYPT_SALT_ROUNDS } from './auth.constants';

/**
 * WHAT: User Mongoose model and schema
 * 
 * WHY: Mongoose schema provides:
 * - Data validation at database level
 * - Type safety with TypeScript
 * - Middleware hooks (pre-save for password hashing)
 * - Indexes for performance
 * 
 * HOW: Defines user document structure and behavior
 */

/**
 * WHAT: User document interface extending Mongoose Document
 * 
 * WHY: TypeScript interface ensures type safety when working with user documents.
 * Extends Document to get Mongoose document methods.
 * 
 * HOW: Used throughout auth module for type safety
 */
export interface IUserDocument extends Document {
  email: string;
  password: string;
  role: UserRole;
  isActive: boolean;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
  // WHY: Instance method to compare password - keeps password logic in model
  comparePassword(candidatePassword: string): Promise<boolean>;
}

/**
 * WHAT: User schema definition
 * 
 * WHY: Schema defines structure, validation, and indexes for user collection.
 * Each field has specific purpose:
 * - email: Unique identifier, indexed for fast lookups
 * - password: Hashed password, never returned in queries
 * - role: User's permission level (RBAC)
 * - isActive: Soft delete - allows disabling accounts without deletion
 * - refreshToken: Stored refresh token for token rotation
 * 
 * HOW: Mongoose schema with validation and indexes
 */
const userSchema = new Schema<IUserDocument>(
  {
    // WHY: Email is unique identifier - must be unique and indexed for login performance
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true, // WHY: Prevents duplicate accounts
      lowercase: true, // WHY: Normalizes email (Email@Example.com = email@example.com)
      trim: true, // WHY: Removes whitespace
      index: true, // WHY: Index for fast login queries
      match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email'], // WHY: Basic email validation
    },

    // WHY: Password must be hashed before saving (see pre-save hook)
    // select: false prevents password from being returned in queries
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false, // WHY: Never return password in queries by default (security)
    },

    // WHY: Role determines user permissions (RBAC)
    // Default to EMPLOYEE for least privilege principle
    role: {
      type: String,
      enum: Object.values(UserRole), // WHY: Only allow valid roles
      default: UserRole.EMPLOYEE, // WHY: Default to least privileged role
      required: true,
    },

    // WHY: isActive allows soft delete - disable account without deleting data
    // Useful for audit trails and data retention
    isActive: {
      type: Boolean,
      default: true, // WHY: New users are active by default
      required: true,
    },

    // WHY: Refresh token stored in database for token rotation and invalidation
    // Optional because not all users may have active refresh tokens
    refreshToken: {
      type: String,
      select: false, // WHY: Don't return in queries by default
    },
  },
  {
    // WHY: timestamps automatically add createdAt and updatedAt fields
    timestamps: true,
  },
);

/**
 * WHAT: Pre-save hook to hash password before saving
 * 
 * WHY: Password must be hashed before storing in database.
 * Hashing in pre-save hook ensures password is always hashed, even if saved directly.
 * Only hashes if password is modified (not on every save).
 * 
 * HOW: Mongoose middleware that runs before document save
 */
userSchema.pre('save', async function (next) {
  // WHY: Only hash password if it's been modified (not on every save)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // WHY: Hash password with bcrypt before saving
    // Salt rounds determine complexity (higher = more secure but slower)
    const hashedPassword = await bcrypt.hash(this.password, BCRYPT_SALT_ROUNDS);
    this.password = hashedPassword;
    next();
  } catch (error) {
    next(error as Error);
  }
});

/**
 * WHAT: Instance method to compare password with hash
 * 
 * WHY: Password comparison logic belongs in model (separation of concerns).
 * Allows easy password verification: user.comparePassword(candidatePassword)
 * 
 * HOW: Instance method on user document
 */
userSchema.methods.comparePassword = async function (
  candidatePassword: string,
): Promise<boolean> {
  // WHY: Use bcrypt.compare to securely compare password with hash
  // bcrypt handles salt comparison automatically
  return bcrypt.compare(candidatePassword, this.password);
};

/**
 * WHAT: User model export
 * 
 * WHY: Model provides database operations (create, find, update, delete).
 * Typed with IUserDocument for TypeScript safety.
 * 
 * HOW: Mongoose model created from schema
 */
export const User = mongoose.model<IUserDocument>('User', userSchema);

