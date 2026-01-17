/**
 * WHAT: TypeScript types for Admin HR Management module
 * 
 * WHY: Centralized type definitions ensure type safety across admin module.
 * Types define data structures for HR user management operations.
 * 
 * HOW: Exports interfaces and types used in HR management
 */

import { UserRole } from '../../auth/auth.types';

/**
 * WHAT: Create HR user request interface
 * 
 * WHY: Type-safe request body for HR creation endpoint.
 * Ensures email and name are present and typed correctly.
 * 
 * HOW: Used in validation and controller
 */
export interface CreateHrRequest {
  email: string;
  name: string;
  password?: string; // WHY: Optional - can be auto-generated if not provided
}

/**
 * WHAT: HR user response interface
 * 
 * WHY: Type-safe response structure for HR user data.
 * Never includes password for security.
 * 
 * HOW: Used in service and controller responses
 */
export interface HrUserResponse {
  id: string;
  email: string;
  name?: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * WHAT: Update HR status request interface
 * 
 * WHY: Type-safe request body for status toggle endpoint.
 * Only allows isActive status changes.
 * 
 * HOW: Used in validation and controller
 */
export interface UpdateHrStatusRequest {
  isActive: boolean;
}

/**
 * WHAT: HR list response interface
 * 
 * WHY: Type-safe response structure for HR list endpoint.
 * Includes pagination metadata for future pagination support.
 * 
 * HOW: Used in service and controller responses
 */
export interface HrListResponse {
  users: HrUserResponse[];
  total: number;
}

