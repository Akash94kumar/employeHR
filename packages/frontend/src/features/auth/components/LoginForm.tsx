import { useState, FormEvent } from 'react';
import { useAuth, useAuthActions } from '../hooks';
import { LoadingSpinner } from '@/shared/components/LoadingSpinner';
import './LoginForm.css';

/**
 * WHAT: Login form component
 * 
 * WHY: Provides user interface for authentication.
 * Handles form submission, validation, and error display.
 * 
 * HOW: Form with email/password inputs, submits to auth service
 */

/**
 * WHAT: Login form component
 * 
 * WHY: Accessible login form with proper error handling.
 * Follows WCAG guidelines for accessibility.
 * 
 * HOW: Controlled form with validation and error states
 */
export function LoginForm() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const { loading, error: authError } = useAuth();
  const { login, clearError } = useAuthActions();

  /**
   * WHAT: Handle form submission
   * 
   * WHY: Validates form and calls login action.
   * Prevents default form submission, handles errors.
   * 
   * HOW: Validates inputs, calls login hook, handles errors
   */
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLocalError(null);
    clearError();

    // WHY: Client-side validation before API call
    // Provides immediate feedback, reduces server load
    if (!email || !password) {
      setLocalError('Please enter both email and password');
      return;
    }

    // WHY: Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setLocalError('Please enter a valid email address');
      return;
    }

    try {
      await login({ email, password });
    } catch (error) {
      // WHY: Error handling is done in Redux, but catch for safety
      setLocalError('Login failed. Please try again.');
    }
  };

  // WHY: Combine local and Redux errors for display
  const displayError = localError || authError;

  return (
    <div className="login-container">
      <form
        onSubmit={handleSubmit}
        className="login-form"
        aria-label="Login form"
        noValidate
      >
        <h1>Employee HR Portal</h1>
        <p className="login-subtitle">Sign in to your account</p>

        {/* WHY: Error message with ARIA for accessibility */}
        {displayError && (
          <div
            className="error-message"
            role="alert"
            aria-live="polite"
            aria-atomic="true"
          >
            {displayError}
            <button
              type="button"
              onClick={() => {
                setLocalError(null);
                clearError();
              }}
              className="error-dismiss"
              aria-label="Dismiss error message"
            >
              ×
            </button>
          </div>
        )}

        {/* WHY: Email input with proper labels and types */}
        <div className="form-group">
          <label htmlFor="email" className="form-label">
            Email Address
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="form-input"
            placeholder="Enter your email"
            required
            autoComplete="email"
            aria-required="true"
            aria-invalid={displayError ? 'true' : 'false'}
            aria-describedby={displayError ? 'error-message' : undefined}
            disabled={loading}
          />
        </div>

        {/* WHY: Password input with proper security attributes */}
        <div className="form-group">
          <label htmlFor="password" className="form-label">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="form-input"
            placeholder="Enter your password"
            required
            autoComplete="current-password"
            aria-required="true"
            aria-invalid={displayError ? 'true' : 'false'}
            aria-describedby={displayError ? 'error-message' : undefined}
            disabled={loading}
          />
        </div>

        {/* WHY: Submit button with loading state */}
        <button
          type="submit"
          className="login-button"
          disabled={loading}
          aria-busy={loading}
        >
          {loading ? (
            <>
              <LoadingSpinner />
              <span>Signing in...</span>
            </>
          ) : (
            'Sign In'
          )}
        </button>

        {/* WHY: Keyboard navigation support */}
        <div className="login-footer">
          <p className="login-note">
            HR and Employees use the same login screen.
            <br />
            Your role determines your dashboard access.
          </p>
          
          {/* WHY: Signup link for new user registration
           * In HR systems, typically only admins create users,
           * but link provides option for self-registration if needed
           */}
          <div className="signup-link-container">
            <p className="signup-text">
              Don't have an account?{' '}
              <a href="/register" className="signup-link">
                Contact HR for account creation
              </a>
            </p>
            <p className="signup-note">
              Note: Employee accounts are created by HR administrators.
              Please contact your HR department to get access.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}

