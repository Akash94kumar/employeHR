/**
 * WHAT: Admin HR Management controller - HTTP request/response layer
 * 
 * WHY: Controller layer handles HTTP-specific concerns:
 * - Request/response formatting
 * - HTTP status codes
 * - Error handling and transformation
 * - Input validation (delegates to validation layer)
 * 
 * HOW: Express route handlers that call service layer and format responses
 */

import { Request, Response, NextFunction } from 'express';
import { createHrUser, getHrUsers, updateHrStatus } from './hr.service';
import { CreateHrInput, UpdateHrStatusInput } from './hr.validation';
import { sendSuccess } from '../../../utils/response.util';

/**
 * WHAT: Create HR user controller
 * 
 * WHY: Handles POST /api/admin/hr requests.
 * Creates new HR user account (only SUPER_ADMIN can access).
 * 
 * HOW: Express route handler
 */
export async function createHrController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // WHY: Request body is validated by validation middleware before reaching controller
    const input = req.body as CreateHrInput;

    // WHY: Call service layer for business logic
    const user = await createHrUser(input);

    // WHY: Use standardized success response utility
    // 201 Created for resource creation
    sendSuccess(res, user, 201, 'HR user created successfully');
  } catch (error) {
    // WHY: Pass error to error middleware for consistent error handling
    next(error);
  }
}

/**
 * WHAT: Get all HR users controller
 * 
 * WHY: Handles GET /api/admin/hr requests.
 * Returns list of all HR users for admin dashboard.
 * 
 * HOW: Express route handler
 */
export async function getHrUsersController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    // WHY: Call service layer for business logic
    const result = await getHrUsers();

    // WHY: Use standardized success response utility
    sendSuccess(res, result, 200);
  } catch (error) {
    // WHY: Pass error to error middleware for consistent error handling
    next(error);
  }
}

/**
 * WHAT: Update HR status controller
 * 
 * WHY: Handles PATCH /api/admin/hr/:id/status requests.
 * Toggles HR user active/inactive status.
 * 
 * HOW: Express route handler
 */
export async function updateHrStatusController(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  try {
    const userId = req.params.id;
    const input = req.body as UpdateHrStatusInput;

    // WHY: Call service layer for business logic
    const user = await updateHrStatus(userId, input);

    // WHY: Use standardized success response utility
    sendSuccess(
      res,
      user,
      200,
      `HR user ${input.isActive ? 'activated' : 'deactivated'} successfully`,
    );
  } catch (error) {
    // WHY: Pass error to error middleware for consistent error handling
    next(error);
  }
}

