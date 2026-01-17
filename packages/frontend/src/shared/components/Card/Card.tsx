import styled from 'styled-components';

/**
 * WHAT: Reusable Card component
 * 
 * WHY: Card component provides:
 * - Consistent container styling
 * - Elevation and depth
 * - Padding and spacing
 * - Theme integration
 * 
 * HOW: Styled div with card-specific styles
 */

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  padding?: 'sm' | 'md' | 'lg';
  hover?: boolean;
}

/**
 * WHAT: Styled card component
 * 
 * WHY: Styled-components allows:
 * - Dynamic padding based on props
 * - Hover effects when needed
 * - Theme integration
 * 
 * HOW: Uses styled.div with conditional styling
 */
const StyledCard = styled.div<CardProps>`
  /* WHY: Base card styles */
  background-color: var(--color-surface);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-md);
  border: 1px solid var(--color-border);
  
  /* WHY: Padding variants for different content types */
  padding: ${(props) => {
    switch (props.padding) {
      case 'sm':
        return 'var(--spacing-md)';
      case 'lg':
        return 'var(--spacing-xl)';
      default:
        return 'var(--spacing-lg)';
    }
  }};

  /* WHY: Hover effect for interactive cards */
  ${(props) =>
    props.hover &&
    `
    transition: all var(--transition-fast);
    cursor: pointer;
    &:hover {
      box-shadow: var(--shadow-lg);
      transform: translateY(-2px);
    }
  `}
`;

/**
 * WHAT: Card component
 * 
 * WHY: Wrapper provides:
 * - Type safety
 * - Consistent API
 * - Semantic HTML
 * 
 * HOW: Renders StyledCard with props
 */
export function Card({ padding = 'md', hover = false, children, ...props }: CardProps) {
  return (
    <StyledCard padding={padding} hover={hover} {...props}>
      {children}
    </StyledCard>
  );
}

