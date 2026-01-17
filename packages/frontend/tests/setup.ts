// WHY: Setup file runs before all tests
// This is where we configure testing utilities and global mocks
import '@testing-library/jest-dom';

// WHY: Mock window.matchMedia (used by some UI libraries)
// Jest doesn't provide this by default
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

