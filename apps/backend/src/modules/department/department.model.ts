import mongoose, { Schema, Document } from 'mongoose';

/**
 * WHAT: Department Mongoose model and schema
 * 
 * WHY: Department model stores organizational department information.
 * Used for employee categorization and reporting.
 * 
 * HOW: Defines department document structure
 */

/**
 * WHAT: Department document interface
 * 
 * WHY: TypeScript interface ensures type safety.
 * 
 * HOW: Used throughout department module for type safety
 */
export interface IDepartmentDocument extends Document {
  name: string;
  code: string; // WHY: Short code for department (e.g., "ENG", "HR", "SALES")
  description?: string;
  headId?: mongoose.Types.ObjectId; // WHY: Reference to department head (Employee)
  budget?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * WHAT: Department schema definition
 * 
 * WHY: Schema defines structure, validation, and indexes for department collection.
 * 
 * HOW: Mongoose schema with validation and indexes
 */
const departmentSchema = new Schema<IDepartmentDocument>(
  {
    name: {
      type: String,
      required: [true, 'Department name is required'],
      unique: true,
      trim: true,
      index: true,
    },

    // WHY: Short code for easy reference (e.g., "ENG", "HR")
    code: {
      type: String,
      required: [true, 'Department code is required'],
      unique: true,
      uppercase: true, // WHY: Normalize to uppercase
      trim: true,
      index: true,
      match: [/^[A-Z]{2,10}$/, 'Department code must be 2-10 uppercase letters'],
    },

    description: {
      type: String,
      maxlength: [500, 'Description must be less than 500 characters'],
    },

    // WHY: Reference to department head (Employee)
    headId: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
    },

    budget: {
      type: Number,
      min: [0, 'Budget cannot be negative'],
    },

    // WHY: Soft delete - allows deactivating departments
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

/**
 * WHAT: Department model export
 * 
 * WHY: Model provides database operations.
 * 
 * HOW: Mongoose model created from schema
 */
export const Department = mongoose.model<IDepartmentDocument>('Department', departmentSchema);

