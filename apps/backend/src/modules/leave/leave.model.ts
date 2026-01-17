import mongoose, { Schema, Document } from 'mongoose';

/**
 * WHAT: Leave Mongoose model and schema
 * 
 * WHY: Leave model stores employee leave requests and records.
 * Essential for HR leave management functionality.
 * 
 * HOW: Defines leave document structure
 */

/**
 * WHAT: Leave status enum
 * 
 * WHY: Enum ensures type safety for leave status.
 * 
 * HOW: Used in leave model and throughout leave module
 */
export enum LeaveStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
}

/**
 * WHAT: Leave type enum
 * 
 * WHY: Enum ensures type safety for leave types.
 * 
 * HOW: Used in leave model
 */
export enum LeaveType {
  SICK_LEAVE = 'SICK_LEAVE',
  CASUAL_LEAVE = 'CASUAL_LEAVE',
  EARNED_LEAVE = 'EARNED_LEAVE',
  MATERNITY_LEAVE = 'MATERNITY_LEAVE',
  PATERNITY_LEAVE = 'PATERNITY_LEAVE',
  UNPAID_LEAVE = 'UNPAID_LEAVE',
}

/**
 * WHAT: Leave document interface
 * 
 * WHY: TypeScript interface ensures type safety.
 * 
 * HOW: Used throughout leave module for type safety
 */
export interface ILeaveDocument extends Document {
  employeeId: mongoose.Types.ObjectId; // WHY: Reference to Employee
  leaveType: LeaveType;
  startDate: Date;
  endDate: Date;
  numberOfDays: number;
  reason?: string;
  status: LeaveStatus;
  approvedBy?: mongoose.Types.ObjectId; // WHY: Reference to approver (User/Employee)
  approvedAt?: Date;
  rejectionReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * WHAT: Leave schema definition
 * 
 * WHY: Schema defines structure, validation, and indexes for leave collection.
 * 
 * HOW: Mongoose schema with validation and indexes
 */
const leaveSchema = new Schema<ILeaveDocument>(
  {
    // WHY: Reference to Employee model
    employeeId: {
      type: Schema.Types.ObjectId,
      ref: 'Employee',
      required: true,
      index: true,
    },

    leaveType: {
      type: String,
      enum: Object.values(LeaveType),
      required: [true, 'Leave type is required'],
    },

    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },

    endDate: {
      type: Date,
      required: [true, 'End date is required'],
      validate: {
        validator: function (this: ILeaveDocument, value: Date) {
          return value >= this.startDate;
        },
        message: 'End date must be after start date',
      },
    },

    // WHY: Calculated number of days (excluding weekends/holidays in future)
    numberOfDays: {
      type: Number,
      required: true,
      min: [0.5, 'Leave must be at least 0.5 days'],
    },

    reason: {
      type: String,
      maxlength: [500, 'Reason must be less than 500 characters'],
    },

    status: {
      type: String,
      enum: Object.values(LeaveStatus),
      default: LeaveStatus.PENDING,
      required: true,
      index: true,
    },

    // WHY: Reference to approver (User with HR/MANAGER role)
    approvedBy: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },

    approvedAt: {
      type: Date,
    },

    rejectionReason: {
      type: String,
      maxlength: [500, 'Rejection reason must be less than 500 characters'],
    },
  },
  {
    timestamps: true,
  },
);

// WHY: Compound index for common queries (employeeId + status)
leaveSchema.index({ employeeId: 1, status: 1 });
// WHY: Index for date range queries
leaveSchema.index({ startDate: 1, endDate: 1 });

/**
 * WHAT: Leave model export
 * 
 * WHY: Model provides database operations.
 * 
 * HOW: Mongoose model created from schema
 */
export const Leave = mongoose.model<ILeaveDocument>('Leave', leaveSchema);

