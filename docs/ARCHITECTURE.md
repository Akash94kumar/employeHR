# Architecture Documentation

## Table of Contents

1. [Overview](#overview)
2. [Monorepo Structure](#monorepo-structure)
3. [Frontend Architecture](#frontend-architecture)
4. [Backend Architecture](#backend-architecture)
5. [Design Decisions](#design-decisions)
6. [Data Flow](#data-flow)
7. [Security Architecture](#security-architecture)

## Overview

### WHAT

This document describes the architecture of the Employee & HR Management Portal, a monorepo-based enterprise application built with the MERN stack.

### WHY

A well-documented architecture serves multiple purposes:
- **Onboarding**: New developers can understand the system quickly
- **Decision Tracking**: Records why certain approaches were chosen
- **Maintenance**: Future changes can be made with full context
- **Scalability**: Architecture patterns support growth

### HOW

The architecture follows these principles:
- **Monorepo**: Single repository for all code, enabling code sharing and unified tooling
- **Feature-Based Modules**: Organization by business domain, not technical layers
- **Micro-Frontend Ready**: Frontend structured to support micro-frontend architecture
- **Modular Backend**: NestJS modules aligned with business features
- **Documentation-First**: Architecture decisions documented before implementation

## Monorepo Structure

### WHAT

The project uses npm workspaces to manage multiple packages in a single repository.

### WHY

**Monorepo Benefits:**
1. **Code Sharing**: Shared types, utilities, and constants between frontend and backend
2. **Atomic Changes**: Update frontend and backend together in a single commit
3. **Unified Tooling**: Single ESLint, TypeScript, and testing configuration
4. **Simplified CI/CD**: One pipeline for the entire application
5. **Developer Experience**: Single `npm install` and unified scripts

**Alternative Considered**: Separate repositories
- **Rejected because**: Would require duplicate tooling, harder to maintain consistency, more complex deployment coordination

### HOW

```
employee-hr-portal/
├── packages/
│   ├── frontend/          # React application
│   └── backend/           # NestJS application
├── docs/                  # Documentation
├── package.json           # Root workspace config
└── .gitignore
```

**Workspace Configuration:**
- Root `package.json` defines workspaces as `packages/*`
- Each package has its own `package.json` with specific dependencies
- Shared dependencies can be hoisted to root
- Scripts can run across all workspaces or specific ones

## Frontend Architecture

### WHAT

The frontend is built with React 18, TypeScript, and Vite, organized in a feature-based structure with Redux Toolkit for global state and Context API for component-level state.

### WHY

**React 18:**
- Concurrent features (Suspense, Transitions) improve UX
- Server Components ready (future-proofing)
- Industry standard with large ecosystem

**TypeScript:**
- Type safety catches errors at compile time
- Better IDE support and autocomplete
- Self-documenting code through types
- Easier refactoring

**Vite:**
- Fast HMR (Hot Module Replacement) for development
- Optimized production builds
- Native ESM support
- Better developer experience than Create React App

**Redux Toolkit + Context API:**
- **Redux Toolkit**: Global state (auth, user preferences, app-wide data)
- **Context API**: Component tree state (modals, themes, form state)
- **Why both**: Redux for complex state logic, Context for simple prop drilling avoidance

**Feature-Based Structure:**
- Each feature is self-contained (components, state, API calls, tests)
- Easier to locate code related to a feature
- Supports micro-frontend architecture
- Better code splitting opportunities

### HOW

```
frontend/
├── src/
│   ├── features/              # Feature modules
│   │   ├── auth/
│   │   │   ├── components/
│   │   │   ├── hooks/
│   │   │   ├── store/
│   │   │   ├── api/
│   │   │   ├── types/
│   │   │   └── index.ts
│   │   ├── employees/
│   │   └── hr/
│   ├── shared/                # Shared across features
│   │   ├── components/         # Reusable UI components
│   │   ├── hooks/             # Custom hooks
│   │   ├── utils/             # Utility functions
│   │   ├── types/             # Shared TypeScript types
│   │   └── constants/         # Constants
│   ├── app/                   # App-level setup
│   │   ├── store/             # Redux store configuration
│   │   ├── router/            # React Router setup
│   │   └── providers/         # Context providers
│   ├── assets/                # Static assets
│   └── main.tsx               # Entry point
├── public/
├── .storybook/                # Storybook configuration
├── tests/                     # Test utilities
└── package.json
```

**State Management Pattern:**
```typescript
// Global state (Redux Toolkit)
- Authentication state
- User profile
- App-wide settings
- Cached API data

// Context API
- Theme preferences
- Modal state
- Form state (when not using form library)
- UI state (sidebar open/closed)
```

## Backend Architecture

### WHAT

The backend uses NestJS, a progressive Node.js framework, with MongoDB for data storage, organized in a modular architecture aligned with business features.

### WHY

**NestJS:**
- Built-in TypeScript support
- Modular architecture (similar to Angular)
- Dependency injection for testability
- Decorators for clean, declarative code
- Built-in support for microservices (future scaling)
- Excellent documentation and ecosystem

**MongoDB:**
- Flexible schema (useful for HR data variations)
- Horizontal scaling capability
- Document-based (natural fit for employee profiles)
- Rich query language
- Good performance for read-heavy workloads

**Modular Architecture:**
- Each module represents a business feature
- Modules are loosely coupled
- Easy to test in isolation
- Supports microservices migration if needed

### HOW

```
backend/
├── src/
│   ├── modules/               # Feature modules
│   │   ├── auth/
│   │   │   ├── auth.controller.ts
│   │   │   ├── auth.service.ts
│   │   │   ├── auth.module.ts
│   │   │   ├── dto/
│   │   │   ├── entities/
│   │   │   └── strategies/    # JWT strategies
│   │   ├── employees/
│   │   └── hr/
│   ├── common/                # Shared code
│   │   ├── decorators/
│   │   ├── guards/            # Auth guards
│   │   ├── filters/           # Exception filters
│   │   ├── interceptors/      # Request/response interceptors
│   │   └── pipes/             # Validation pipes
│   ├── config/                # Configuration
│   ├── database/              # Database setup
│   └── main.ts                # Application entry
├── test/                      # E2E tests
└── package.json
```

**Module Structure:**
Each module follows NestJS conventions:
- `*.module.ts`: Module definition, imports, exports
- `*.controller.ts`: HTTP endpoints
- `*.service.ts`: Business logic
- `dto/`: Data Transfer Objects for validation
- `entities/`: Database entities/schemas

## Design Decisions

### Feature-Based Over Layer-Based

**Decision**: Organize code by features (auth, employees, hr) rather than layers (components, services, utils).

**Why:**
- **Locality**: All code for a feature is in one place
- **Scalability**: Easy to add new features without touching existing code
- **Team Collaboration**: Teams can work on features independently
- **Code Splitting**: Natural boundaries for lazy loading
- **Micro-Frontend Ready**: Features can become micro-frontends later

**Trade-off**: Some code duplication (e.g., each feature might have similar API call patterns)
**Mitigation**: Shared utilities and hooks in `shared/` directory

### Redux Toolkit + Context API

**Decision**: Use both Redux Toolkit and Context API for state management.

**Why:**
- **Redux Toolkit**: Complex state logic, time-travel debugging, middleware support
- **Context API**: Simple state, avoid prop drilling, no external dependency

**When to use what:**
- **Redux**: Auth state, user profile, cached data, complex state logic
- **Context**: UI state (modals, themes), form state, component tree state

### TypeScript Strict Mode

**Decision**: Use TypeScript with strict mode enabled.

**Why:**
- Catches more errors at compile time
- Better refactoring safety
- Self-documenting code
- Better IDE support

**Trade-off**: More verbose code, slower initial development
**Mitigation**: Worth the long-term maintainability benefits

### MongoDB Over PostgreSQL

**Decision**: Use MongoDB for data storage.

**Why:**
- Flexible schema (HR data can vary)
- Document-based (natural fit for employee profiles)
- Horizontal scaling
- Good for read-heavy workloads

**Trade-off**: No joins, eventual consistency considerations
**Mitigation**: Application-level joins, careful schema design

## Data Flow

### Frontend to Backend

1. **User Action** → Component
2. **Component** → Redux Action or API Hook
3. **API Hook** → Axios Request
4. **Axios** → Backend API Endpoint
5. **Backend Controller** → Service
6. **Service** → Database (via Mongoose)
7. **Response flows back** through the same path

### Authentication Flow

1. User submits credentials
2. Frontend sends to `/auth/login`
3. Backend validates and generates JWT
4. Frontend stores JWT in httpOnly cookie (or localStorage with XSS protection)
5. Subsequent requests include JWT in Authorization header
6. Backend guard validates JWT
7. Request proceeds if valid

## Security Architecture

### WHAT

Multi-layered security approach with authentication, authorization, input validation, and secure communication.

### WHY

Enterprise applications handle sensitive HR data requiring:
- **Authentication**: Verify user identity
- **Authorization**: Control what users can access (RBAC)
- **Input Validation**: Prevent injection attacks
- **Secure Communication**: HTTPS, secure cookies

### HOW

**Authentication:**
- JWT tokens for stateless authentication
- Refresh tokens for long-lived sessions
- Password hashing with bcrypt

**Authorization:**
- Role-based access control (RBAC)
- Guards on routes and endpoints
- Permission checks in services

**Input Validation:**
- DTOs with class-validator (NestJS)
- Sanitization of user input
- Type checking (TypeScript)

**Secure Communication:**
- HTTPS in production
- Secure cookies (httpOnly, sameSite)
- CORS configuration
- Rate limiting

---

**Last Updated**: Initial version
**Maintained By**: Development Team

