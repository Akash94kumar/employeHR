export default {
  // WHY: jsdom simulates browser environment for React component testing
  testEnvironment: 'jsdom',
  // WHY: Transform TypeScript and JSX files for Jest
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', {
      tsconfig: {
        jsx: 'react-jsx',
      },
    }],
  },
  // WHY: Module name mapping for path aliases (matches tsconfig paths)
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '^@/features/(.*)$': '<rootDir>/src/features/$1',
    '^@/shared/(.*)$': '<rootDir>/src/shared/$1',
    '^@/app/(.*)$': '<rootDir>/src/app/$1',
  },
  // WHY: Setup file runs before tests (e.g., for test utilities, mocks)
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  // WHY: Coverage collection for quality metrics
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/main.tsx',
    '!src/vite-env.d.ts',
  ],
  // WHY: Test file patterns
  testMatch: ['**/__tests__/**/*.test.{ts,tsx}', '**/*.test.{ts,tsx}'],
};

