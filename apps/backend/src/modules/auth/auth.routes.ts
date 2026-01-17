import { Router } from 'express';
import {
  loginController,
  registerController,
  refreshTokenController,
  logoutController,
  getCurrentUserController,
} from './auth.controller';
import { validateRequest } from '../../middlewares/validation.middleware';
import {
  loginSchema,
  registerSchema,
  refreshTokenSchema,
} from './auth.validation';
import { authenticate } from '../../middlewares/auth.middleware';

/**
 * WHAT: Authentication routes - route definitions only
 * 
 * WHY: Routes file only defines routes and middleware chain.
 * No business logic here - delegates to controller.
 * Separation allows:
 * - Easy route modification
 * - Clear route structure
 * - Reusable middleware
 * 
 * HOW: Express router with route definitions
 */

const router = Router();

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: User login
 *     description: Authenticate user with email and password. Returns access token and refresh token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 example: Password123!
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     refreshToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         email:
 *                           type: string
 *                         role:
 *                           type: string
 *                           enum: [SUPER_ADMIN, HR, MANAGER, EMPLOYEE]
 *       400:
 *         description: Validation error
 *       401:
 *         description: Invalid credentials
 */
router.post(
  '/login',
  validateRequest(loginSchema), // WHY: Validate request body before processing
  loginController,
);

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: User registration
 *     description: Register a new user account. In HR systems, typically only admins create users.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 8
 *                 example: Password123!
 *               role:
 *                 type: string
 *                 enum: [SUPER_ADMIN, HR, MANAGER, EMPLOYEE]
 *                 default: EMPLOYEE
 *                 example: EMPLOYEE
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: User created successfully
 *                     user:
 *                       type: object
 *       400:
 *         description: Validation error or user already exists
 */
router.post(
  '/register',
  validateRequest(registerSchema), // WHY: Validate request body
  registerController,
);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     description: Get a new access token using refresh token. Allows seamless authentication without re-login.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *                 example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *     responses:
 *       200:
 *         description: New access token generated
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken:
 *                       type: string
 *                       example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post(
  '/refresh',
  validateRequest(refreshTokenSchema), // WHY: Validate refresh token
  refreshTokenController,
);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: User logout
 *     description: Logout user and invalidate refresh token. Requires authentication.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Logout successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     message:
 *                       type: string
 *                       example: Logged out successfully
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.post(
  '/logout',
  authenticate, // WHY: Must be authenticated to logout
  logoutController,
);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user
 *     description: Returns information about the currently authenticated user. Requires authentication.
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User information retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       type: object
 *                       properties:
 *                         id:
 *                           type: string
 *                         email:
 *                           type: string
 *                         role:
 *                           type: string
 *                           enum: [SUPER_ADMIN, HR, MANAGER, EMPLOYEE]
 *                         isActive:
 *                           type: boolean
 *                         createdAt:
 *                           type: string
 *                           format: date-time
 *                         updatedAt:
 *                           type: string
 *                           format: date-time
 *       401:
 *         description: Unauthorized - Invalid or missing token
 */
router.get(
  '/me',
  authenticate, // WHY: Must be authenticated to get user info
  getCurrentUserController,
);

export default router;

