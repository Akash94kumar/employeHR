import { Router, Request, Response } from "express";
import swaggerJsdoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import { swaggerOptions } from "../config/swagger";

/**
 * WHAT: Swagger UI routes
 *
 * WHY: Provides interactive API documentation.
 * Developers can test APIs directly from Swagger UI.
 *
 * HOW: Serves Swagger UI and OpenAPI JSON specification
 */

const router = Router();

// WHY: Generate OpenAPI specification from JSDoc comments
const swaggerSpec = swaggerJsdoc(swaggerOptions);

/**
 * WHAT: GET /api-docs.json - OpenAPI JSON specification
 *
 * WHY: Returns OpenAPI specification in JSON format.
 * Used by Swagger UI and other API documentation tools.
 *
 * HOW: Returns generated OpenAPI spec
 */
router.get("/api-docs.json", (req: Request, res: Response) => {
  res.setHeader("Content-Type", "application/json");
  res.send(swaggerSpec);
});

/**
 * WHAT: Swagger UI setup
 *
 * WHY: Interactive API documentation interface.
 * Allows testing APIs directly from browser.
 *
 * HOW: Serves Swagger UI at /api-docs
 */
router.use(
  "/api-docs",
  swaggerUi.serve,
  swaggerUi.setup(swaggerSpec, {
    customCss: ".swagger-ui .topbar { display: none }", // WHY: Hide Swagger topbar
    customSiteTitle: "Employee HR Portal API Documentation",
  }),
);

export default router;
