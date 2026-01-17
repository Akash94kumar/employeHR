/**
 * WHAT: TypeScript theme configuration for styled-components
 * 
 * WHY: TypeScript theme provides:
 * - Type safety for theme values
 * - Autocomplete in styled-components
 * - Single source of truth for design tokens
 * - Works alongside CSS variables
 * 
 * HOW: Exports theme object that matches CSS variables
 * Used by styled-components ThemeProvider
 */

/**
 * WHAT: Theme interface for TypeScript
 * 
 * WHY: Type-safe theme ensures correct usage.
 * Prevents typos and provides autocomplete.
 * 
 * HOW: Defines structure of theme object
 */
export interface Theme {
  colors: {
    primary: string;
    primaryDark: string;
    primaryLight: string;
    secondary: string;
    success: string;
    error: string;
    warning: string;
    info: string;
    bg: string;
    bgSecondary: string;
    surface: string;
    text: string;
    textSecondary: string;
    textMuted: string;
    border: string;
  };
  spacing: {
    xs: string;
    sm: string;
    md: string;
    lg: string;
    xl: string;
    '2xl': string;
    '3xl': string;
  };
  borderRadius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  shadows: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
  };
  typography: {
    fontSize: {
      xs: string;
      sm: string;
      md: string;
      lg: string;
      xl: string;
      '2xl': string;
      '3xl': string;
      '4xl': string;
    };
    fontWeight: {
      normal: number;
      medium: number;
      semibold: number;
      bold: number;
    };
    lineHeight: {
      tight: number;
      normal: number;
      relaxed: number;
    };
  };
  transitions: {
    fast: string;
    normal: string;
    slow: string;
  };
  zIndex: {
    dropdown: number;
    sticky: number;
    fixed: number;
    modalBackdrop: number;
    modal: number;
    popover: number;
    tooltip: number;
  };
}

/**
 * WHAT: Default theme object
 * 
 * WHY: Provides theme values that match CSS variables.
 * styled-components can access these via props.theme.
 * 
 * HOW: Object with design tokens matching CSS variables
 */
export const theme: Theme = {
  colors: {
    primary: 'var(--color-primary)',
    primaryDark: 'var(--color-primary-dark)',
    primaryLight: 'var(--color-primary-light)',
    secondary: 'var(--color-secondary)',
    success: 'var(--color-success)',
    error: 'var(--color-error)',
    warning: 'var(--color-warning)',
    info: 'var(--color-info)',
    bg: 'var(--color-bg)',
    bgSecondary: 'var(--color-bg-secondary)',
    surface: 'var(--color-surface)',
    text: 'var(--color-text)',
    textSecondary: 'var(--color-text-secondary)',
    textMuted: 'var(--color-text-muted)',
    border: 'var(--color-border)',
  },
  spacing: {
    xs: 'var(--spacing-xs)',
    sm: 'var(--spacing-sm)',
    md: 'var(--spacing-md)',
    lg: 'var(--spacing-lg)',
    xl: 'var(--spacing-xl)',
    '2xl': 'var(--spacing-2xl)',
    '3xl': 'var(--spacing-3xl)',
  },
  borderRadius: {
    sm: 'var(--radius-sm)',
    md: 'var(--radius-md)',
    lg: 'var(--radius-lg)',
    xl: 'var(--radius-xl)',
    full: 'var(--radius-full)',
  },
  shadows: {
    sm: 'var(--shadow-sm)',
    md: 'var(--shadow-md)',
    lg: 'var(--shadow-lg)',
    xl: 'var(--shadow-xl)',
  },
  typography: {
    fontSize: {
      xs: 'var(--font-size-xs)',
      sm: 'var(--font-size-sm)',
      md: 'var(--font-size-md)',
      lg: 'var(--font-size-lg)',
      xl: 'var(--font-size-xl)',
      '2xl': 'var(--font-size-2xl)',
      '3xl': 'var(--font-size-3xl)',
      '4xl': 'var(--font-size-4xl)',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
    lineHeight: {
      tight: 1.25,
      normal: 1.5,
      relaxed: 1.75,
    },
  },
  transitions: {
    fast: 'var(--transition-fast)',
    normal: 'var(--transition-normal)',
    slow: 'var(--transition-slow)',
  },
  zIndex: {
    dropdown: 1000,
    sticky: 1020,
    fixed: 1030,
    modalBackdrop: 1040,
    modal: 1050,
    popover: 1060,
    tooltip: 1070,
  },
};

// WHY: Export theme type for styled-components
declare module 'styled-components' {
  export interface DefaultTheme extends Theme {}
}

