# Backend Setup Documentation

## Table of Contents

1. [Overview](#overview)
2. [What is Implemented](#what-is-implemented)
3. [Why Express + MongoDB + This Structure](#why-express--mongodb--this-structure)
4. [Application Bootstrap](#application-bootstrap)
5. [Database Connection Lifecycle](#database-connection-lifecycle)
6. [Error Handling Strategy](#error-handling-strategy)
7. [Trade-offs & Alternatives](#trade-offs--alternatives)

## Overview

### WHAT

This document explains the Express.js + MongoDB backend foundation for the Employee HR Portal. The backend is built with TypeScript in strict mode, following REST architecture principles and a feature-based modular structure.

### WHY

A well-documented backend foundation serves multiple purposes:
- **Onboarding**: New developers understand the architecture quickly
- **Decision Tracking**: Records why certain approaches were chosen
- **Maintenance**: Future changes can be made with full context
- **Learning**: Codebase serves as a learning resource

### HOW

The backend follows these principles:
- **Separation of Concerns**: server.ts (lifecycle) vs app.ts (configuration)
- **Type Safety**: TypeScript strict mode throughout
- **Validation**: Environment variables validated at startup
- **Error Handling**: Centralized error handling middleware
- **Modularity**: Feature-based structure for scalability

## What is Implemented

### Core Infrastructure

1. **Express Application Setup**
   - Express app configuration in `app.ts`
   - Server startup in `server.ts`
   - CORS middleware for cross-origin requests
   - JSON and URL-encoded body parsing

2. **MongoDB Connection**
   - Mongoose connection management in `config/db.ts`
   - Connection lifecycle handling
   - Graceful shutdown on process termination
   - Connection event handlers for monitoring

3. **Environment Configuration**
   - Environment variable validation using Zod
   - Type-safe environment variable access
   - Clear error messages for missing/invalid variables
   - Default values for development

4. **Error Handling**
   - Centralized error middleware
   - Consistent error response format
   - 404 Not Found handler
   - Development vs production error details

5. **Health Check API**
   - `GET /api/health` endpoint
   - Returns server status and timestamp
   - Used for monitoring and readiness checks

6. **TypeScript Configuration**
   - Strict mode enabled
   - Path aliases for clean imports
   - Source maps for debugging
   - Proper module resolution

### File Structure

```
apps/backend/
├── src/
│   ├── server.ts              # Entry point - starts HTTP server
│   ├── app.ts                 # Express app configuration
│   ├── config/
│   │   ├── env.ts             # Environment validation with Zod
│   │   └── db.ts              # MongoDB connection with Mongoose
│   ├── middlewares/
│   │   ├── error.middleware.ts    # Centralized error handler
│   │   └── notFound.middleware.ts # 404 handler
│   ├── routes/
│   │   └── health.routes.ts   # Health check endpoint
│   ├── utils/                 # Utility functions (empty, ready for use)
│   ├── types/                 # TypeScript types (empty, ready for use)
│   └── docs/                  # Documentation (empty, ready for use)
├── .env.example               # Environment variable template
├── tsconfig.json              # TypeScript configuration
├── package.json               # Dependencies and scripts
└── README.md                  # Package-specific documentation
```

## Why Express + MongoDB + This Structure

### Why Express.js?

**Decision**: Use Express.js as the web framework.

**Why**:
1. **Maturity**: Express is the most mature and widely-used Node.js framework
2. **Flexibility**: Minimal opinionation allows custom architecture
3. **Ecosystem**: Largest middleware ecosystem in Node.js
4. **Performance**: Lightweight and performant
5. **Learning Curve**: Easy to learn, well-documented
6. **REST Support**: Excellent for RESTful API development

**Alternatives Considered**:
- **NestJS**: More opinionated, better for large teams, but more complex
- **Fastify**: Faster, but smaller ecosystem
- **Koa**: More modern, but less mature ecosystem

**Trade-off**: Express is less opinionated, requiring more boilerplate, but provides maximum flexibility.

### Why MongoDB?

**Decision**: Use MongoDB with Mongoose for data storage.

**Why**:
1. **Flexible Schema**: HR data can vary (different employee types, custom fields)
2. **Document-Based**: Natural fit for employee profiles and HR records
3. **Horizontal Scaling**: Easy to scale horizontally as data grows
4. **Rich Query Language**: Powerful querying capabilities
5. **Mongoose ODM**: Provides schema validation, middleware, and type safety
6. **JSON-Like Structure**: Natural fit for JavaScript/TypeScript applications

**Alternatives Considered**:
- **PostgreSQL**: Better for complex relationships, but less flexible
- **MySQL**: Traditional SQL, but requires schema migrations
- **DynamoDB**: AWS-specific, less portable

**Trade-off**: MongoDB sacrifices ACID guarantees for flexibility and scalability. For HR data, flexibility often outweighs strict consistency requirements.

### Why This Folder Structure?

**Decision**: Feature-based modular structure with clear separation of concerns.

**Why**:
1. **Separation of Concerns**: 
   - `server.ts` only handles server lifecycle
   - `app.ts` only handles Express configuration
   - `config/` isolates configuration logic
   - `middlewares/` centralizes middleware logic
   - `routes/` organizes API endpoints

2. **Testability**: 
   - Can test `app.ts` without starting server
   - Can mock database connection easily
   - Clear boundaries for unit testing

3. **Scalability**:
   - Easy to add new routes (feature modules)
   - Middlewares can be reused across features
   - Configuration is centralized

4. **Maintainability**:
   - Clear file organization
   - Easy to locate code
   - Consistent patterns

**Alternatives Considered**:
- **Layer-based** (controllers/, services/, models/): More traditional, but harder to scale
- **Domain-driven** (auth/, employees/, hr/): Better for large apps, but more complex initially

**Trade-off**: Current structure is simpler but may need refactoring as features grow. Can evolve to domain-driven structure later.

## Application Bootstrap

### WHAT

The application bootstrap process: how the server starts and the app is configured.

### WHY

Understanding bootstrap is critical for:
- Debugging startup issues
- Adding initialization logic
- Testing the application
- Understanding execution flow

### HOW

#### Bootstrap Flow

```
1. server.ts (entry point)
   ↓
2. connectDatabase() - Connect to MongoDB
   ↓
3. createApp() - Configure Express app
   ↓
4. app.listen() - Start HTTP server
   ↓
5. Server ready to handle requests
```

#### server.ts - Entry Point

**WHAT**: Only handles server lifecycle (startup, shutdown).

**WHY**: Separation allows:
- Testing app without starting server
- Reusing app in different contexts (tests, serverless)
- Clear responsibility: server.ts = lifecycle, app.ts = configuration

**HOW**:
```typescript
async function startServer() {
  await connectDatabase();  // Connect to MongoDB first
  const app = createApp(); // Create configured Express app
  app.listen(env.PORT);    // Start HTTP server
}
```

#### app.ts - Express Configuration

**WHAT**: Configures Express app with middlewares and routes.

**WHY**: Separating configuration from startup provides:
- Testability (can create app instance without server)
- Reusability (app can be used in tests)
- Clear separation of concerns

**HOW**:
```typescript
export function createApp(): Express {
  const app = express();
  
  // Middlewares (order matters!)
  app.use(cors());
  app.use(express.json());
  
  // Routes
  app.use('/api', healthRoutes);
  
  // Error handling (must be last)
  app.use(notFoundMiddleware);
  app.use(errorMiddleware);
  
  return app;
}
```

#### Middleware Order

**WHY Order Matters**:
1. **CORS first**: Must handle preflight requests before other middlewares
2. **Body parsers**: Must parse request bodies before routes
3. **Routes**: Handle actual requests
4. **404 handler**: Catch unmatched routes
5. **Error handler**: Must be last to catch all errors

**What Happens if Order is Wrong**:
- CORS after routes: Preflight requests fail
- Error handler before routes: Errors not caught properly
- 404 handler before routes: All routes return 404

## Database Connection Lifecycle

### WHAT

How MongoDB connection is established, managed, and closed.

### WHY

Understanding connection lifecycle is important for:
- Debugging connection issues
- Handling reconnection scenarios
- Graceful shutdown
- Testing with database

### HOW

#### Connection Establishment

**Location**: `config/db.ts`

**Process**:
1. **Check if already connected**: Avoid duplicate connections
2. **Connect using Mongoose**: `mongoose.connect(uri, options)`
3. **Handle errors**: Log and exit process if connection fails
4. **Event handlers**: Monitor connection state

**Code Flow**:
```typescript
export async function connectDatabase() {
  // Check if already connected
  if (mongoose.connection.readyState === 1) return;
  
  // Connect with options
  await mongoose.connect(env.MONGODB_URI, {
    retryWrites: true,
    w: 'majority',
  });
}
```

**Why Mongoose?**:
- **ODM (Object Document Mapper)**: Provides schema validation, middleware, and type safety
- **Connection Management**: Handles connection pooling, reconnection
- **Schema Validation**: Ensures data integrity
- **Middleware**: Pre/post hooks for operations
- **Type Safety**: TypeScript support with @types/mongoose

#### Connection Options

**retryWrites: true**:
- Automatically retries write operations on network errors
- Improves reliability in case of transient network issues

**w: 'majority'**:
- Write concern ensures writes are acknowledged by majority of replica set
- Provides data durability in replica set configurations

#### Connection Events

**Event Handlers** (in `config/db.ts`):
- `connected`: Connection established
- `error`: Connection error occurred
- `disconnected`: Connection closed

**Why Monitor Events**:
- Debugging connection issues
- Logging connection state changes
- Handling reconnection scenarios

#### Graceful Shutdown

**Process Signals**:
- `SIGTERM`: Termination signal (Docker, Kubernetes)
- `SIGINT`: Interrupt signal (Ctrl+C)

**Shutdown Process**:
1. Receive termination signal
2. Close HTTP server (stop accepting new requests)
3. Close database connection
4. Exit process

**Why Graceful Shutdown**:
- Prevents data loss (pending operations complete)
- Closes connections properly (no resource leaks)
- Clean exit (no hanging processes)

**Code**:
```typescript
process.on('SIGTERM', async () => {
  await disconnectDatabase();
  process.exit(0);
});
```

## Error Handling Strategy

### WHAT

Centralized error handling with consistent error response format.

### WHY

Centralized error handling provides:
- **Consistency**: All errors return same format
- **Security**: Don't leak error details in production
- **Monitoring**: Single place to log errors
- **Maintainability**: Easy to modify error handling logic

### HOW

#### Error Middleware

**Location**: `middlewares/error.middleware.ts`

**Function**:
```typescript
function errorMiddleware(err, req, res, next) {
  const statusCode = err.statusCode || 500;
  
  res.status(statusCode).json({
    success: false,
    error: {
      message: err.message,
      ...(isDevelopment && { stack: err.stack }),
    },
    timestamp: new Date().toISOString(),
  });
}
```

**Why 4 Parameters**:
- Express requires error middleware to have 4 parameters
- `(err, req, res, next)` - Express recognizes this as error handler
- Must be added AFTER all routes

#### Error Response Format

**Structure**:
```json
{
  "success": false,
  "error": {
    "message": "Error message",
    "stack": "..." // Only in development
  },
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

**Why This Format**:
- `success: false`: Clear indication of error
- `error.message`: Human-readable error message
- `error.stack`: Only in development (security)
- `timestamp`: For error tracking and debugging

#### Error Types

**AppError Interface**:
```typescript
interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}
```

**Usage**:
```typescript
const error = new Error('Not found');
(error as AppError).statusCode = 404;
next(error);
```

#### 404 Handler

**Location**: `middlewares/notFound.middleware.ts`

**Function**:
- Catches requests to non-existent routes
- Creates error with statusCode 404
- Passes to error middleware

**Why Separate**:
- Clear separation: 404 is routing issue, not application error
- Can log 404 requests separately for monitoring
- Consistent with other error handling

#### Development vs Production

**Development**:
- Include stack trace in error response
- Detailed error messages
- Helpful for debugging

**Production**:
- Hide stack trace (security)
- Generic error messages
- Log detailed errors server-side

**Why**:
- **Security**: Stack traces can reveal code structure, file paths
- **UX**: Users don't need technical details
- **Monitoring**: Detailed errors logged server-side

## Trade-offs & Alternatives

### Express vs NestJS

**Express (Chosen)**:
- ✅ More flexible, less opinionated
- ✅ Larger ecosystem
- ✅ Easier to learn
- ✅ Better for REST APIs
- ❌ More boilerplate
- ❌ Less structure for large teams

**NestJS (Alternative)**:
- ✅ More structure, better for large teams
- ✅ Built-in dependency injection
- ✅ Better TypeScript support
- ❌ More complex, steeper learning curve
- ❌ More opinionated

**Decision**: Express chosen for flexibility and simplicity. Can migrate to NestJS later if needed.

### MongoDB vs PostgreSQL

**MongoDB (Chosen)**:
- ✅ Flexible schema (good for HR data variations)
- ✅ Document-based (natural fit)
- ✅ Easy horizontal scaling
- ✅ JSON-like structure
- ❌ Less ACID guarantees
- ❌ No joins (application-level joins needed)

**PostgreSQL (Alternative)**:
- ✅ ACID guarantees
- ✅ SQL joins
- ✅ Better for complex relationships
- ❌ Requires schema migrations
- ❌ Less flexible

**Decision**: MongoDB chosen for flexibility. HR data often varies, and flexibility outweighs strict consistency.

### Centralized vs Distributed Error Handling

**Centralized (Chosen)**:
- ✅ Consistent error format
- ✅ Single place to modify
- ✅ Better monitoring
- ❌ Less flexibility per route

**Distributed (Alternative)**:
- ✅ More flexibility per route
- ❌ Inconsistent error format
- ❌ Harder to maintain

**Decision**: Centralized chosen for consistency and maintainability.

### Environment Validation: Zod vs Manual

**Zod (Chosen)**:
- ✅ Type-safe validation
- ✅ Runtime validation
- ✅ Clear error messages
- ✅ Schema as single source of truth
- ❌ Additional dependency

**Manual Validation (Alternative)**:
- ✅ No dependencies
- ❌ More boilerplate
- ❌ Less type safety
- ❌ Error-prone

**Decision**: Zod chosen for type safety and developer experience.

### server.ts vs app.ts Separation

**Separated (Chosen)**:
- ✅ Testability
- ✅ Reusability
- ✅ Clear separation
- ❌ More files

**Combined (Alternative)**:
- ✅ Fewer files
- ❌ Harder to test
- ❌ Less reusable

**Decision**: Separation chosen for testability and maintainability.

---

## Summary

### Key Decisions

1. **Express.js**: Chosen for flexibility and ecosystem
2. **MongoDB + Mongoose**: Chosen for flexibility and document-based structure
3. **Feature-based Structure**: Chosen for scalability
4. **Centralized Error Handling**: Chosen for consistency
5. **Environment Validation with Zod**: Chosen for type safety
6. **server.ts / app.ts Separation**: Chosen for testability

### What's Ready

✅ Express application configured  
✅ MongoDB connection with Mongoose  
✅ Environment variable validation  
✅ Error handling middleware  
✅ Health check API  
✅ TypeScript strict mode  
✅ Graceful shutdown  

### Next Steps

1. Add authentication module
2. Add feature modules (employees, HR, etc.)
3. Add request validation middleware
4. Add logging (Winston, Pino, etc.)
5. Add rate limiting
6. Add API documentation (Swagger/OpenAPI)

---

**Last Updated**: Initial setup  
**Maintained By**: Backend Team

