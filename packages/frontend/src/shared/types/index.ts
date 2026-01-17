/**
 * WHAT: Shared TypeScript types used across the application
 * 
 * WHY: Centralized types ensure consistency and avoid duplication
 * Types defined here are used by multiple features
 * 
 * HOW: Export types and interfaces that are shared across features
 */

// WHY: User type is used across authentication, profile, and other features
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

// WHY: Role enum ensures type safety and consistency
export enum UserRole {
  ADMIN = 'admin',
  HR = 'hr',
  MANAGER = 'manager',
  EMPLOYEE = 'employee',
}

// WHY: API response wrapper ensures consistent response structure
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// WHY: Pagination is used across many list views
export interface PaginationParams {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

