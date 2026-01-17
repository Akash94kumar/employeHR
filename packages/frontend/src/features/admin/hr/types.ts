/**
 * WHAT: TypeScript types for Admin HR Management feature
 * 
 * WHY: Centralized type definitions ensure type safety across admin HR module.
 * Types match backend API responses and Redux state structure.
 * 
 * HOW: Exports interfaces and types used in admin HR slice, service, and components
 */

/**
 * WHAT: HR user interface from backend
 * 
 * WHY: Type-safe representation of HR user data from API.
 * Ensures frontend and backend data structures match.
 * 
 * HOW: Used in Redux state and components
 */
export interface HrUser {
  id: string;
  email: string;
  role: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * WHAT: Create HR request interface
 * 
 * WHY: Type-safe request body for HR creation.
 * Ensures email and name are present and typed correctly.
 * 
 * HOW: Used in create HR form and service
 */
export interface CreateHrRequest {
  email: string;
  name: string;
  password?: string;
}

/**
 * WHAT: HR list response interface
 * 
 * WHY: Type-safe API response structure.
 * Matches backend HrListResponse interface.
 * 
 * HOW: Used in admin HR service and Redux slice
 */
export interface HrListResponse {
  users: HrUser[];
  total: number;
}

/**
 * WHAT: Update HR status request interface
 * 
 * WHY: Type-safe request body for status update.
 * Only allows isActive status changes.
 * 
 * HOW: Used in status toggle functionality
 */
export interface UpdateHrStatusRequest {
  isActive: boolean;
}

/**
 * WHAT: Admin HR state interface for Redux
 * 
 * WHY: Defines structure of admin HR state in Redux store.
 * Ensures consistent state shape across application.
 * 
 * HOW: Used in admin HR slice and selectors
 */
export interface AdminHrState {
  users: HrUser[];
  total: number;
  loading: boolean;
  error: string | null;
  createModalOpen: boolean;
}

