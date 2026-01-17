module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:react-hooks/recommended',
    // WHY: React Refresh plugin ensures HMR works correctly with React components
    'plugin:react-refresh/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parser: '@typescript-eslint/parser',
  plugins: ['react-refresh'],
  rules: {
    // WHY: Allow unused vars that start with underscore (common pattern for unused params)
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_' },
    ],
    // WHY: React Refresh requires components to be exported, but we want to allow default exports
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    // WHY: Prefer explicit return types for better code documentation
    '@typescript-eslint/explicit-function-return-type': 'off', // Can be enabled for stricter code
    // WHY: Allow any in specific cases (e.g., error handling) but prefer types
    '@typescript-eslint/no-explicit-any': 'warn',
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};

