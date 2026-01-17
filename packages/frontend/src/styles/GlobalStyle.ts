import { createGlobalStyle } from 'styled-components';

/**
 * WHAT: Global styles using styled-components createGlobalStyle
 * 
 * WHY: Global styles provide:
 * - CSS reset and base styles
 * - Consistent typography
 * - Accessibility improvements
 * - Works with styled-components theming
 * 
 * HOW: Uses createGlobalStyle to inject global CSS
 */

/**
 * WHAT: Global style component
 * 
 * WHY: createGlobalStyle allows global styles within styled-components ecosystem.
 * Provides CSS reset, base typography, and accessibility styles.
 * 
 * HOW: Injected once at app root, applies to entire application
 */
export const GlobalStyle = createGlobalStyle`
  /* WHY: Import CSS variables - provides design tokens */
  @import url('./variables.css');

  /* ============================================
     CSS RESET
     ============================================ */
  
  /* WHY: Reset removes browser default styles
   * Ensures consistent appearance across browsers
   */
  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  /* ============================================
     ROOT ELEMENT
     ============================================ */
  
  html {
    /* WHY: 62.5% makes 1rem = 10px (easier calculations) */
    font-size: 62.5%;
    /* WHY: Smooth scrolling improves UX */
    scroll-behavior: smooth;
  }

  body {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
      'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
      sans-serif;
    font-size: var(--font-size-md);
    line-height: var(--line-height-normal);
    color: var(--color-text);
    background-color: var(--color-bg);
    /* WHY: Better font rendering */
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  /* ============================================
     TYPOGRAPHY
     ============================================ */
  
  h1, h2, h3, h4, h5, h6 {
    font-weight: var(--font-weight-semibold);
    line-height: var(--line-height-tight);
    color: var(--color-text);
    margin-bottom: var(--spacing-md);
  }

  h1 {
    font-size: var(--font-size-4xl);
  }

  h2 {
    font-size: var(--font-size-3xl);
  }

  h3 {
    font-size: var(--font-size-2xl);
  }

  h4 {
    font-size: var(--font-size-xl);
  }

  p {
    margin-bottom: var(--spacing-md);
    color: var(--color-text-secondary);
  }

  /* ============================================
     ACCESSIBILITY
     ============================================ */
  
  /* WHY: Focus styles are essential for keyboard navigation
   * Provides visible indication of focused elements
   */
  *:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
    border-radius: var(--radius-sm);
  }

  /* WHY: Skip link for screen readers
   * Allows keyboard users to skip to main content
   */
  .skip-link {
    position: absolute;
    top: -40px;
    left: 0;
    background: var(--color-primary);
    color: var(--color-text-inverse);
    padding: var(--spacing-sm) var(--spacing-md);
    text-decoration: none;
    z-index: var(--z-tooltip);
  }

  .skip-link:focus {
    top: 0;
  }

  /* WHY: Screen reader only text
   * Visually hidden but accessible to assistive tech
   */
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }

  /* ============================================
     LINKS
     ============================================ */
  
  a {
    color: var(--color-primary);
    text-decoration: none;
    transition: color var(--transition-fast);
  }

  a:hover {
    color: var(--color-primary-dark);
    text-decoration: underline;
  }

  a:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }

  /* ============================================
     BUTTONS
     ============================================ */
  
  button {
    font-family: inherit;
    cursor: pointer;
    border: none;
    transition: all var(--transition-fast);
  }

  button:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* ============================================
     FORM ELEMENTS
     ============================================ */
  
  input, textarea, select {
    font-family: inherit;
    font-size: inherit;
  }

  /* ============================================
     UTILITIES
     ============================================ */
  
  /* WHY: Loading spinner container */
  .loading-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 200px;
  }
`;

