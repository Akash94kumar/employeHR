module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json',
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  ignorePatterns: ['.eslintrc.js'],
  rules: {
    // WHY: Allow unused vars that start with underscore (common pattern for unused params)
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_' },
    ],
    // WHY: Interface naming - I prefix helps distinguish interfaces from classes
    '@typescript-eslint/interface-name-prefix': 'off',
    // WHY: Explicit return types improve code documentation but can be verbose
    '@typescript-eslint/explicit-function-return-type': 'off',
    // WHY: Allow any in specific cases but prefer types
    '@typescript-eslint/no-explicit-any': 'warn',
    // WHY: Require explicit return types for exported functions (better API contracts)
    '@typescript-eslint/explicit-module-boundary-types': 'off',
  },
};

