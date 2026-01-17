import './LoadingSpinner.css';

/**
 * LoadingSpinner Component
 * 
 * WHAT: Displays a loading indicator while content is being fetched or rendered
 * 
 * WHY: Provides visual feedback to users during async operations, improving UX
 * This is a shared component because loading states are needed across many features
 * 
 * HOW: Uses CSS animation for smooth, performant loading indicator
 */
export function LoadingSpinner() {
  return (
    <div
      className="loading-spinner"
      role="status"
      aria-label="Loading"
      // WHY: aria-live="polite" announces loading state to screen readers without interrupting
      aria-live="polite"
    >
      <div className="spinner" />
      <span className="sr-only">Loading...</span>
    </div>
  );
}

