# Employee & HR Management Portal

Enterprise-grade Employee & HR Management Portal built with MERN stack, following industry best practices and documentation-first development approach.

## 🏗️ Architecture Overview

This is a **monorepo** project structured for scalability, maintainability, and team collaboration. The architecture follows a feature-based modular approach, enabling independent development and deployment of features.

### Project Structure

```
employee-hr-portal/
├── packages/
│   ├── frontend/          # React 18 + TypeScript + Vite
│   └── backend/           # NestJS + TypeScript + MongoDB
├── docs/                  # Comprehensive documentation
└── package.json           # Root workspace configuration
```

## 🚀 Quick Start

### Prerequisites

- Node.js >= 18.0.0
- npm >= 9.0.0
- MongoDB (local or connection string)

### Installation

```bash
# Install all dependencies
npm install

# Set up environment variables
cp packages/backend/.env.example packages/backend/.env
cp packages/frontend/.env.example packages/frontend/.env
```

### Development

```bash
# Run both frontend and backend concurrently
npm run dev

# Or run individually
npm run dev:frontend
npm run dev:backend
```

### Building

```bash
# Build all packages
npm run build

# Build individually
npm run build:frontend
npm run build:backend
```

### Testing

```bash
# Run all tests
npm run test

# Run tests for specific package
npm run test:frontend
npm run test:backend
```

## 📚 Documentation

### Getting Started
- [Quick Start Guide](./docs/QUICK_START.md) - Get up and running in minutes
- [Setup Guide](./docs/SETUP.md) - Complete setup instructions

### Architecture & Development
- [Project Summary](./docs/PROJECT_SUMMARY.md) - High-level project overview and status
- [Architecture Documentation](./docs/ARCHITECTURE.md) - Detailed architecture decisions and patterns
- [Contributing Guide](./docs/CONTRIBUTING.md) - Development workflow and code standards
- [Features Documentation](./docs/FEATURES.md) - Planned and implemented features

### Package-Specific
- [Frontend Documentation](./packages/frontend/README.md) - Frontend-specific documentation
- [Backend Documentation](./packages/backend/README.md) - Backend-specific documentation

## 🛠️ Tech Stack

### Frontend
- **React 18** - UI library with concurrent features
- **TypeScript** - Type safety and developer experience
- **Vite** - Fast build tool and dev server
- **Redux Toolkit** - State management
- **Context API** - Component-level state
- **Storybook** - Component documentation and testing
- **Jest + React Testing Library** - Unit and integration testing
- **Axios** - HTTP client
- **ESLint** - Code quality

### Backend
- **Node.js** - Runtime environment
- **NestJS** - Progressive Node.js framework
- **TypeScript** - Type safety
- **MongoDB** - NoSQL database
- **JWT** - Authentication
- **RBAC** - Role-based access control

## 🏛️ Core Principles

1. **Documentation-First**: Every major feature includes comprehensive documentation
2. **Why Over What**: Code comments explain reasoning, not just implementation
3. **Learning-Focused**: Codebase serves as a learning resource for future developers
4. **Scalability**: Architecture supports growth and team expansion
5. **Best Practices**: Industry-standard patterns and conventions

## 📁 Feature-Based Modules

The project is organized by features rather than technical layers:

- **Authentication** - Login, registration, password management
- **Employee Management** - Employee profiles, directory, onboarding
- **HR Operations** - Leave management, attendance, payroll
- **Admin Panel** - System configuration, user management
- **Reports & Analytics** - Dashboards, reports, insights

Each feature module is self-contained with its own:
- API endpoints (backend)
- UI components (frontend)
- State management
- Tests
- Documentation

## 🔒 Security

- JWT-based authentication
- Role-based access control (RBAC)
- Input validation and sanitization
- CORS configuration
- Environment variable management

## ♿ Accessibility

- WCAG 2.1 AA compliance
- Semantic HTML
- ARIA attributes
- Keyboard navigation support
- Screen reader compatibility

## 🧪 Testing Strategy

- **Unit Tests**: Individual components and functions
- **Integration Tests**: Feature workflows
- **E2E Tests**: Critical user journeys
- **Component Tests**: Storybook stories

## 📝 Contributing

1. Follow the documentation-first approach
2. Write meaningful comments explaining WHY
3. Maintain feature-based module structure
4. Ensure all tests pass
5. Update relevant documentation

## 📄 License

ISC

