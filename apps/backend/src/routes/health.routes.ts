import { Router, Request, Response } from "express";

/**
 * WHAT: Health check route
 *
 * WHY: Health check endpoints are essential for:
 * - Monitoring systems (Kubernetes, Docker, etc.)
 * - Load balancer health checks
 * - Deployment verification
 * - Service discovery
 *
 * HOW: Simple GET endpoint that returns application status
 */

const router = Router();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Health check endpoint
 *     description: Returns application health status for monitoring and readiness checks
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Server is healthy
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                   example: 2024-01-01T00:00:00.000Z
 */
router.get("/health", (_req: Request, res: Response) => {
  // WHY: Simple health check - can be expanded to check database, external services, etc.
  // WHY: _req prefix indicates parameter is intentionally unused (required by Express signature)
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

export default router;
