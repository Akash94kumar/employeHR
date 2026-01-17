# Backend - Employee HR Portal

## Overview

### WHAT

NestJS backend application built with TypeScript, MongoDB, and organized in a modular, feature-based architecture.

### WHY

This architecture was chosen for:
- **Scalability**: Modular structure supports growth and team collaboration
- **Type Safety**: TypeScript ensures type safety across the application
- **Testability**: Dependency injection makes testing straightforward
- **Maintainability**: Clear separation of concerns, consistent patterns
- **Enterprise-Ready**: NestJS provides built-in support for microservices, WebSockets, etc.

### HOW

The backend follows NestJS conventions:
- **Modules**: Each feature is a self-contained module
- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic
- **DTOs**: Validate and transform incoming data
- **Entities**: Define database schemas
- **Guards**: Protect routes with authentication/authorization

## Project Structure

```
backend/
├── src/
│   ├── modules/               # Feature modules (auth, employees, hr, etc.)
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── dto/           # Data Transfer Objects
│   │   │   ├── entities/      # Database entities
│   │   │   └── strategies/    # Passport strategies
│   │   ├── employees/
│   │   └── hr/
│   ├── common/                # Shared code
│   │   ├── decorators/        # Custom decorators
│   │   ├── guards/            # Auth guards
│   │   ├── filters/           # Exception filters
│   │   ├── interceptors/      # Request/response interceptors
│   │   └── pipes/             # Validation pipes
│   ├── config/                # Configuration
│   ├── database/              # Database setup/utilities
│   ├── app.module.ts          # Root module
│   ├── app.controller.ts      # Root controller
│   └── main.ts                # Application entry
├── test/                      # E2E tests
└── package.json
```

## Development

### Running Development Server

```bash
npm run dev
```

Starts NestJS in watch mode on http://localhost:3000

### Building for Production

```bash
npm run build
npm run start:prod
```

### Testing

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov

# E2E tests
npm run test:e2e
```

### Linting

```bash
npm run lint
```

### Type Checking

```bash
npm run type-check
```

## Architecture Decisions

### NestJS Framework

**Why**: 
- Built-in TypeScript support
- Modular architecture (similar to Angular)
- Dependency injection for testability
- Decorators for clean, declarative code
- Excellent documentation and ecosystem
- Built-in support for microservices (future scaling)

### MongoDB with Mongoose

**Why**:
- Flexible schema (useful for HR data variations)
- Document-based (natural fit for employee profiles)
- Horizontal scaling capability
- Rich query language
- Mongoose provides schema validation and middleware

### Feature-Based Modules

**Why**:
- Each module represents a business feature
- Modules are loosely coupled
- Easy to test in isolation
- Supports microservices migration if needed
- Clear boundaries for team collaboration

### DTOs for Validation

**Why**:
- Type safety at runtime (not just compile time)
- Automatic validation with class-validator
- Clear API contracts
- Prevents invalid data from reaching business logic

### Guards for Authorization

**Why**:
- Reusable authentication/authorization logic
- Declarative route protection
- Easy to test
- Separation of concerns

## Code Style

- **TypeScript**: Strict mode enabled
- **Naming**: PascalCase for classes, camelCase for functions/variables
- **Comments**: Explain WHY, not WHAT
- **Decorators**: Use NestJS decorators for clean, declarative code

## API Conventions

- **Routes**: RESTful conventions (`/api/users`, `/api/users/:id`)
- **Status Codes**: Proper HTTP status codes (200, 201, 400, 401, 404, 500)
- **Error Responses**: Consistent error response format
- **Versioning**: Can be added via route prefix if needed (`/api/v1/...`)

## Security

- JWT-based authentication
- Password hashing with bcrypt
- Input validation via DTOs
- CORS configuration
- Rate limiting (can be added)
- Environment variable management

---

**Last Updated**: Initial version

