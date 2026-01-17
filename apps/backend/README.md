# Backend - Express + MongoDB

## Overview

### WHAT

Production-grade Express.js backend with TypeScript, MongoDB, and REST architecture.

### WHY

This backend foundation provides:
- **Scalability**: Modular structure supports growth
- **Type Safety**: TypeScript strict mode ensures correctness
- **Maintainability**: Clear separation of concerns
- **Production-Ready**: Error handling, validation, monitoring

### HOW

The backend follows Express.js best practices with:
- Feature-based modular structure
- Centralized error handling
- Environment variable validation
- Database connection management

## Project Structure

```
apps/backend/
├── src/
│   ├── server.ts              # Entry point (server start only)
│   ├── app.ts                 # Express app configuration
│   ├── config/
│   │   ├── env.ts             # Environment validation
│   │   └── db.ts              # MongoDB connection
│   ├── middlewares/
│   │   ├── error.middleware.ts
│   │   └── notFound.middleware.ts
│   ├── routes/
│   │   └── health.routes.ts
│   ├── utils/                 # Utility functions
│   ├── types/                 # TypeScript types
│   └── docs/                  # Documentation
├── .env.example
├── tsconfig.json
└── package.json
```

## Development

### Prerequisites

- Node.js >= 18.0.0
- MongoDB (local or connection string)

### Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your MongoDB URI
```

### Running

```bash
# Development (with hot reload)
npm run dev

# Production build
npm run build
npm start
```

### Health Check

```bash
curl http://localhost:3000/api/health
```

Should return:
```json
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z"
}
```

## Architecture

### server.ts vs app.ts

- **server.ts**: Only starts the HTTP server and handles lifecycle
- **app.ts**: Configures Express app (middlewares, routes)

**Why**: Separation allows testing app without starting server.

### Database Connection

- Connection handled in `config/db.ts`
- Connects before server starts
- Graceful shutdown on process termination

### Error Handling

- Centralized error middleware
- Consistent error response format
- 404 handler for unknown routes

## Documentation

See [docs/03-backend-setup.md](../../docs/03-backend-setup.md) for comprehensive documentation.

---

**Last Updated**: Initial setup
**Status**: Foundation Complete

