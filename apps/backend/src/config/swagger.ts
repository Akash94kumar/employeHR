import { SwaggerDefinition, SwaggerOptions } from "swagger-jsdoc";

/**
 * WHAT: Swagger/OpenAPI configuration
 *
 * WHY: API documentation is essential for:
 * - Developer onboarding
 * - API testing
 * - Frontend integration
 * - API contract definition
 *
 * HOW: Swagger JSDoc generates OpenAPI spec from code comments
 */

/**
 * WHAT: Swagger definition configuration
 *
 * WHY: Defines API metadata and base information.
 * This information appears in Swagger UI.
 *
 * HOW: OpenAPI 3.0 specification format
 */
const swaggerDefinition: SwaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "Employee HR Portal API",
    version: "1.0.0",
    description:
      "Enterprise-grade Employee & HR Management Portal API Documentation",
    contact: {
      name: "API Support",
    },
  },
  servers: [
    {
      url: "http://localhost:3000/api",
      description: "Development server",
    },
  ],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: "http",
        scheme: "bearer",
        bearerFormat: "JWT",
        description: "JWT Authorization header using the Bearer scheme",
      },
    },
  },
  tags: [
    {
      name: "Health",
      description: "Health check endpoints",
    },
    {
      name: "Authentication",
      description: "User authentication and authorization",
    },
  ],
};

/**
 * WHAT: Swagger options configuration
 *
 * WHY: Configures where Swagger should look for API documentation.
 * Points to route files where JSDoc comments define endpoints.
 *
 * HOW: Swagger JSDoc options
 */
export const swaggerOptions: SwaggerOptions = {
  definition: swaggerDefinition,
  apis: [
    "./src/routes/*.ts",
    "./src/modules/**/*.routes.ts",
    "./src/modules/**/*.controller.ts",
  ],
};
