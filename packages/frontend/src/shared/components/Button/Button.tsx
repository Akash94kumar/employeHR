import styled from 'styled-components';

/**
 * WHAT: Reusable Button component
 * 
 * WHY: Centralized button component provides:
 * - Consistent styling across application
 * - Theme integration
 * - Accessibility built-in
 * - Variant support (primary, secondary)
 * 
 * HOW: Styled component with variant props
 */

/**
 * WHAT: Button variants
 * 
 * WHY: Different button styles for different use cases.
 * Primary for main actions, secondary for secondary actions.
 * 
 * HOW: TypeScript type for button variants
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost';
export type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;
}

/**
 * WHAT: Styled button component
 * 
 * WHY: Styled-components provides:
 * - Theme integration
 * - Dynamic styling based on props
 * - CSS-in-JS with TypeScript support
 * - No CSS class name conflicts
 * 
 * HOW: Uses styled.button with variant-based styling
 */
const StyledButton = styled.button<ButtonProps>`
  /* WHY: Base styles apply to all buttons */
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--spacing-sm);
  padding: ${(props) => {
    // WHY: Size-based padding for visual hierarchy
    switch (props.size) {
      case 'sm':
        return 'var(--spacing-xs) var(--spacing-sm)';
      case 'lg':
        return 'var(--spacing-md) var(--spacing-lg)';
      default:
        return 'var(--spacing-sm) var(--spacing-md)';
    }
  }};
  
  font-size: ${(props) => {
    switch (props.size) {
      case 'sm':
        return 'var(--font-size-sm)';
      case 'lg':
        return 'var(--font-size-lg)';
      default:
        return 'var(--font-size-md)';
    }
  }};
  
  font-weight: var(--font-weight-medium);
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  transition: all var(--transition-fast);
  cursor: pointer;
  
  /* WHY: fullWidth prop for full-width buttons (forms, etc.) */
  width: ${(props) => (props.fullWidth ? '100%' : 'auto')};

  /* WHY: Variant-based styling */
  ${(props) => {
    switch (props.variant) {
      case 'primary':
        return `
          background-color: var(--color-primary);
          color: var(--color-text-inverse);
          &:hover:not(:disabled) {
            background-color: var(--color-primary-hover);
          }
          &:active:not(:disabled) {
            background-color: var(--color-primary-dark);
          }
        `;
      case 'secondary':
        return `
          background-color: var(--color-secondary);
          color: var(--color-text-inverse);
          &:hover:not(:disabled) {
            background-color: var(--color-secondary-dark);
          }
        `;
      case 'outline':
        return `
          background-color: transparent;
          color: var(--color-primary);
          border-color: var(--color-primary);
          &:hover:not(:disabled) {
            background-color: var(--color-primary);
            color: var(--color-text-inverse);
          }
        `;
      case 'ghost':
        return `
          background-color: transparent;
          color: var(--color-primary);
          &:hover:not(:disabled) {
            background-color: var(--color-surface-hover);
          }
        `;
      default:
        return `
          background-color: var(--color-primary);
          color: var(--color-text-inverse);
        `;
    }
  }}

  /* WHY: Disabled state styling */
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }

  /* WHY: Focus styles for accessibility */
  &:focus-visible {
    outline: 2px solid var(--color-primary);
    outline-offset: 2px;
  }
`;

/**
 * WHAT: Button component
 * 
 * WHY: Wrapper component provides:
 * - Type safety
 * - Consistent API
 * - Accessibility attributes
 * 
 * HOW: Renders StyledButton with props
 */
export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  children,
  ...props
}: ButtonProps) {
  return (
    <StyledButton variant={variant} size={size} fullWidth={fullWidth} {...props}>
      {children}
    </StyledButton>
  );
}

