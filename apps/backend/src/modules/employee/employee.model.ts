import mongoose, { Schema, Document } from 'mongoose';
import { UserRole } from '../auth/auth.types';

/**
 * WHAT: Employee Mongoose model and schema
 * 
 * WHY: Employee model stores employee-specific information beyond basic user data.
 * Separates employee data from authentication data for better organization.
 * 
 * HOW: Defines employee document structure with references to user
 */

/**
 * WHAT: Employee document interface
 * 
 * WHY: TypeScript interface ensures type safety when working with employee documents.
 * 
 * HOW: Used throughout employee module for type safety
 */
export interface IEmployeeDocument extends Document {
  userId: mongoose.Types.ObjectId; // WHY: Reference to User model
  employeeId: string; // WHY: Unique employee identifier (e.g., EMP001)
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  dateOfBirth?: Date;
  joiningDate: Date;
  department: string;
  designation: string;
  managerId?: mongoose.Types.ObjectId; // WHY: Reference to manager (self-reference)
  salary?: number;
  address?: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  emergencyContact?: {
    name: string;
    relationship: string;
    phoneNumber: string;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * WHAT: Employee schema definition
 * 
 * WHY: Schema defines structure, validation, and indexes for employee collection.
 * 
 * HOW: Mongoose schema with validation and indexes
 */
const employeeSchema = new Schema<IEmployeeDocument>(
  {
    // WHY: Reference to User model - links employee data to authentication
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true, // WHY: One employee record per user
      index: true,
    },

    // WHY: Unique employee identifier for HR systems
    employeeId: {
      type: String,
      required: true,
      unique: true,
      index: true,
      uppercase: true, // WHY: Normalize to uppercase (EMP001)
    },

    firstName: {
      type: String,
      required: [true, 'First name is required'],
      trim: true,
      maxlength: [50, 'First name must be less than 50 characters'],
    },

    lastName: {
      type: String,
      required: [true, 'Last name is required'],
      trim: true,
      maxlength: [50, 'Last name must be less than 50 characters'],
    },

    phoneNumber: {
      type: String,
      trim: true,
      match: [/^[+]?[(]?[0-9]{1,4}[)]?[-\s.]?[(]?[0-9]{1,4}[)]?[-\s.]?[0-9]{1,9}$/, 'Invalid phone number'],
    },

    dateOfBirth: {
      type: Date,
    },

    // WHY: Joining date is required for tenure calculations
    joiningDate: {
      type: Date,
      required: [true, 'Joining date is required'],
      default: Date.now,
    },

    department: {
      type: String,
      required: [true, 'Department is required'],
      trim: true,
    },

    designation: {
      type: String,
      required: [true, 'Designation is required'],
      trim: true,
    },

    // WHY: Manager reference for organizational hierarchy
    managerId: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
    },

    salary: {
      type: Number,
      min: [0, 'Salary cannot be negative'],
    },

    address: {
      street: String,
      city: String,
      state: String,
      zipCode: String,
      country: String,
    },

    emergencyContact: {
      name: String,
      relationship: String,
      phoneNumber: String,
    },

    // WHY: Soft delete - allows deactivating employees without deleting data
    isActive: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// WHY: Compound index for common queries (department + isActive)
employeeSchema.index({ department: 1, isActive: 1 });

/**
 * WHAT: Employee model export
 * 
 * WHY: Model provides database operations (create, find, update, delete).
 * 
 * HOW: Mongoose model created from schema
 */
export const Employee = mongoose.model<IEmployeeDocument>('Employee', employeeSchema);

