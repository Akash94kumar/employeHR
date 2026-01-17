# Contributing Guide

## Table of Contents

1. [Development Workflow](#development-workflow)
2. [Code Standards](#code-standards)
3. [Documentation Requirements](#documentation-requirements)
4. [Testing Requirements](#testing-requirements)
5. [Commit Guidelines](#commit-guidelines)

## Development Workflow

### WHAT

Standard workflow for contributing to the Employee HR Portal project.

### WHY

A consistent workflow ensures:
- Code quality and consistency
- Easy code reviews
- Proper testing
- Maintainable documentation

### HOW

1. **Create Feature Branch**
   ```bash
   git checkout -b feature/feature-name
   # or
   git checkout -b fix/bug-description
   ```

2. **Develop Feature**
   - Write code following project structure
   - Add tests
   - Update documentation
   - Add meaningful comments

3. **Run Quality Checks**
   ```bash
   # Type checking
   npm run type-check

   # Linting
   npm run lint
   npm run lint:fix

   # Tests
   npm run test
   ```

4. **Commit Changes**
   - Follow commit message guidelines
   - Include relevant documentation updates

5. **Push and Create PR**
   ```bash
   git push origin feature/feature-name
   ```

## Code Standards

### WHAT

Standards for writing code in this project.

### WHY

Consistent code style:
- Improves readability
- Makes code reviews easier
- Reduces cognitive load
- Enables better tooling support

### HOW

#### TypeScript

- **Strict Mode**: Always enabled
- **Types**: Explicit types for function parameters and return values
- **Interfaces**: Use interfaces for object shapes
- **Naming**: 
  - PascalCase for components, classes, interfaces
  - camelCase for functions, variables
  - UPPER_SNAKE_CASE for constants

#### Comments

- **Explain WHY, not WHAT**: Code should be self-documenting
- **Use JSDoc**: For public APIs and complex functions
- **Example**:
  ```typescript
  /**
   * WHAT: Validates user credentials
   * 
   * WHY: Centralized validation ensures consistent rules across the app
   * 
   * HOW: Checks email format and password strength requirements
   */
  function validateCredentials(email: string, password: string): boolean {
    // WHY: Regex validation is faster than multiple string operations
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email) && password.length >= 8;
  }
  ```

#### File Organization

- **Feature-Based**: Organize by feature, not by type
- **Index Files**: Use index.ts for clean exports
- **One Component Per File**: Each component gets its own file

#### Component Structure

```typescript
// 1. Imports
import React from 'react';
import { Button } from '@/shared/components/Button';

// 2. Types/Interfaces
interface Props {
  title: string;
}

// 3. Component
export function MyComponent({ title }: Props) {
  // Component logic
  return <div>{title}</div>;
}

// 4. Export (if needed)
export default MyComponent;
```

## Documentation Requirements

### WHAT

Every major feature or setup must include documentation.

### WHY

Documentation serves multiple purposes:
- **Onboarding**: New developers can understand quickly
- **Decision Tracking**: Records why approaches were chosen
- **Maintenance**: Future changes have full context
- **Learning**: Codebase serves as a learning resource

### HOW

#### Required Documentation

1. **Feature Documentation** (in feature folder):
   - `README.md`: Explains the feature
   - Code comments: Explain WHY

2. **API Documentation**:
   - DTOs: Document expected input/output
   - Controllers: Document endpoints
   - Services: Document business logic

3. **Architecture Changes**:
   - Update `docs/ARCHITECTURE.md` for significant changes
   - Document design decisions

#### Documentation Format

Use the WHAT/WHY/HOW format:

```markdown
### WHAT
Brief description of what is implemented.

### WHY
Explanation of why this approach was chosen, including:
- Alternatives considered
- Trade-offs
- Benefits

### HOW
Explanation of how it is implemented, including:
- Key patterns used
- Important implementation details
- Usage examples
```

## Testing Requirements

### WHAT

Testing standards for the project.

### WHY

Tests ensure:
- Code correctness
- Regression prevention
- Refactoring safety
- Documentation through examples

### HOW

#### Test Coverage

- **Target**: 80%+ coverage
- **Critical Paths**: 100% coverage
- **Components**: Test user interactions
- **Services**: Test business logic

#### Test Types

1. **Unit Tests**: Individual functions/components
2. **Integration Tests**: Feature workflows
3. **E2E Tests**: Critical user journeys

#### Writing Tests

```typescript
/**
 * WHAT: Tests for UserService.validateEmail
 * 
 * WHY: Email validation is critical for user registration
 * 
 * HOW: Tests various email formats and edge cases
 */
describe('UserService.validateEmail', () => {
  it('should return true for valid email', () => {
    expect(validateEmail('user@example.com')).toBe(true);
  });

  it('should return false for invalid email', () => {
    expect(validateEmail('invalid-email')).toBe(false);
  });
});
```

## Commit Guidelines

### WHAT

Standards for commit messages.

### WHY

Clear commit messages:
- Help understand project history
- Make debugging easier
- Enable better release notes
- Improve code reviews

### HOW

#### Commit Message Format

```
<type>(<scope>): <subject>

<body>

<footer>
```

#### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

#### Examples

```
feat(auth): add JWT authentication

Implement JWT-based authentication with refresh tokens.
This provides stateless authentication and improves scalability.

Closes #123
```

```
fix(employees): correct employee list pagination

The pagination was not working correctly when filtering by department.
Fixed by correcting the query builder logic.

Fixes #456
```

#### Scope

Use feature or module name:
- `auth`: Authentication feature
- `employees`: Employee management
- `hr`: HR operations
- `shared`: Shared components/utilities

---

**Last Updated**: Initial version
**Maintained By**: Development Team

