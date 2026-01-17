/**
 * WHAT: Admin HR Management routes - route definitions only
 * 
 * WHY: Routes file only defines routes and middleware chain.
 * No business logic here - delegates to controller.
 * Separation allows:
 * - Easy route modification
 * - Clear route structure
 * - Reusable middleware
 * 
 * HOW: Express router with route definitions and RBAC middleware
 */

import { Router } from 'express';
import {
  createHrController,
  getHrUsersController,
  updateHrStatusController,
} from './hr.controller';
import { validateRequest } from '../../../middlewares/validation.middleware';
import { createHrSchema, updateHrStatusSchema } from './hr.validation';
import { authenticate } from '../../../middlewares/auth.middleware';
import { requireRole } from '../../../middlewares/rbac.middleware';
import { UserRole } from '../../auth/auth.types';

const router = Router();

/**
 * WHY: All admin routes require authentication and SUPER_ADMIN role
 * authenticate: Verifies JWT token and attaches user to request
 * requireRole: Ensures user has SUPER_ADMIN role
 * 
 * These middlewares run before all routes in this router
 */
router.use(authenticate);
router.use(requireRole([UserRole.SUPER_ADMIN]));

/**
 * @swagger
 * /admin/hr:
 *   post:
 *     summary: Create HR user
 *     description: Creates a new HR user account. Only accessible by SUPER_ADMIN.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: hr@example.com
 *               name:
 *                 type: string
 *                 example: John Doe
 *               password:
 *                 type: string
 *                 format: password
 *                 description: Optional. If not provided, a secure password will be auto-generated.
 *     responses:
 *       201:
 *         description: HR user created successfully
 *       400:
 *         description: Validation error or user already exists
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - SUPER_ADMIN role required
 */
router.post(
  '/',
  validateRequest(createHrSchema), // WHY: Validate request body
  createHrController,
);

/**
 * @swagger
 * /admin/hr:
 *   get:
 *     summary: Get all HR users
 *     description: Returns list of all HR users. Only accessible by SUPER_ADMIN.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of HR users
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 data:
 *                   type: object
 *                   properties:
 *                     users:
 *                       type: array
 *                       items:
 *                         type: object
 *                     total:
 *                       type: number
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - SUPER_ADMIN role required
 */
router.get('/', getHrUsersController);

/**
 * @swagger
 * /admin/hr/{id}/status:
 *   patch:
 *     summary: Update HR user status
 *     description: Activates or deactivates an HR user. Only accessible by SUPER_ADMIN.
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - isActive
 *             properties:
 *               isActive:
 *                 type: boolean
 *                 example: true
 *     responses:
 *       200:
 *         description: HR user status updated successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - SUPER_ADMIN role required
 *       404:
 *         description: User not found
 */
router.patch(
  '/:id/status',
  validateRequest(updateHrStatusSchema), // WHY: Validate request body
  updateHrStatusController,
);

export default router;

