# Frontend - Employee HR Portal

## Overview

### WHAT

React 18 application built with TypeScript, Vite, Redux Toolkit, and organized in a feature-based architecture.

### WHY

This architecture was chosen for:
- **Scalability**: Feature-based structure supports growth
- **Developer Experience**: Fast HMR, TypeScript safety, clear organization
- **Performance**: Code splitting, lazy loading, optimized builds
- **Maintainability**: Clear separation of concerns, reusable components

### HOW

The frontend follows these patterns:
- **Feature Modules**: Self-contained features with components, state, and API calls
- **Shared Components**: Reusable UI components in `shared/`
- **State Management**: Redux Toolkit for global state, Context API for component state
- **Type Safety**: Strict TypeScript configuration
- **Testing**: Jest + React Testing Library for unit and integration tests

## Project Structure

```
frontend/
├── src/
│   ├── features/              # Feature modules (auth, employees, hr, etc.)
│   │   ├── auth/
│   │   │   ├── components/    # Feature-specific components
│   │   │   ├── hooks/         # Custom hooks
│   │   │   ├── store/         # Redux slice (if needed)
│   │   │   ├── api/           # API calls
│   │   │   ├── types/         # TypeScript types
│   │   │   └── index.ts       # Public exports
│   │   ├── employees/
│   │   └── hr/
│   ├── shared/                # Shared across features
│   │   ├── components/         # Reusable UI components
│   │   ├── hooks/             # Shared hooks
│   │   ├── utils/             # Utility functions
│   │   ├── types/             # Shared types
│   │   └── constants/         # Constants
│   ├── app/                   # App-level setup
│   │   ├── store/             # Redux store configuration
│   │   ├── router/            # React Router setup
│   │   └── providers/         # Context providers
│   ├── assets/                # Static assets
│   └── main.tsx               # Entry point
├── public/                    # Public assets
├── tests/                     # Test utilities
├── .storybook/                # Storybook configuration
└── package.json
```

## Development

### Running Development Server

```bash
npm run dev
```

Starts Vite dev server on http://localhost:5173

### Building for Production

```bash
npm run build
```

Outputs to `dist/` directory.

### Testing

```bash
# Run tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:coverage
```

### Linting

```bash
# Check for issues
npm run lint

# Auto-fix issues
npm run lint:fix
```

### Type Checking

```bash
npm run type-check
```

### Storybook

```bash
# Start Storybook
npm run storybook

# Build Storybook
npm run build-storybook
```

## Architecture Decisions

### Feature-Based Structure

**Why**: 
- All code for a feature is in one place
- Easy to locate and modify feature code
- Supports micro-frontend architecture
- Natural code splitting boundaries

**How**:
Each feature module is self-contained with:
- Components specific to that feature
- State management (Redux slice or Context)
- API calls
- Types
- Tests

### State Management Strategy

**Redux Toolkit** for:
- Authentication state
- User profile
- App-wide settings
- Cached API data

**Context API** for:
- UI state (modals, sidebars)
- Theme preferences
- Form state (when not using form library)

**Why both**: Redux for complex state logic and time-travel debugging, Context for simple state to avoid prop drilling.

### Path Aliases

**Why**: Avoid relative path hell (`../../../../`) and make refactoring easier.

**Usage**:
```typescript
// Instead of:
import { Button } from '../../../shared/components/Button';

// Use:
import { Button } from '@/shared/components/Button';
```

## Code Style

- **TypeScript**: Strict mode enabled
- **Components**: Functional components with hooks
- **Naming**: PascalCase for components, camelCase for functions/variables
- **Comments**: Explain WHY, not WHAT
- **Exports**: Use index.ts files for clean imports

## Testing Strategy

- **Unit Tests**: Individual components and functions
- **Integration Tests**: Feature workflows
- **Component Tests**: Storybook stories
- **Coverage Target**: 80%+

## Accessibility

- Semantic HTML
- ARIA attributes where needed
- Keyboard navigation support
- Screen reader compatibility
- WCAG 2.1 AA compliance

---

**Last Updated**: Initial version

