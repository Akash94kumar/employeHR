/**
 * WHAT: Admin HR Management service - API calls
 * 
 * WHY: Service layer separates API logic from components and Redux.
 * Provides:
 * - Reusable API calls
 * - Centralized error handling
 * - Type-safe API interactions
 * - Easy to mock for testing
 * 
 * HOW: Uses axios instance (apiClient) for HTTP requests
 */

import apiClient from '@/shared/utils/api';
import {
  CreateHrRequest,
  HrListResponse,
  UpdateHrStatusRequest,
  HrUser,
} from './types';

/**
 * WHAT: Create HR user API call
 * 
 * WHY: Creates new HR user account.
 * Only accessible by SUPER_ADMIN (enforced by backend).
 * 
 * HOW: POST request to /api/admin/hr
 */
export async function createHrUser(
  data: CreateHrRequest,
): Promise<HrUser> {
  const response = await apiClient.post<{ success: boolean; data: HrUser }>(
    '/admin/hr',
    data,
  );
  return response.data.data;
}

/**
 * WHAT: Get all HR users API call
 * 
 * WHY: Retrieves list of all HR users for admin dashboard.
 * Used to populate HR management table.
 * 
 * HOW: GET request to /api/admin/hr
 */
export async function getHrUsers(): Promise<HrListResponse> {
  const response = await apiClient.get<{ success: boolean; data: HrListResponse }>(
    '/admin/hr',
  );
  return response.data.data;
}

/**
 * WHAT: Update HR status API call
 * 
 * WHY: Toggles HR user active/inactive status.
 * Uses soft delete (isActive flag) instead of hard delete.
 * 
 * HOW: PATCH request to /api/admin/hr/:id/status
 */
export async function updateHrStatus(
  userId: string,
  data: UpdateHrStatusRequest,
): Promise<HrUser> {
  const response = await apiClient.patch<{ success: boolean; data: HrUser }>(
    `/admin/hr/${userId}/status`,
    data,
  );
  return response.data.data;
}

