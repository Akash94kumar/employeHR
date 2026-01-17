module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2022,
    sourceType: 'module',
    project: require.resolve('./tsconfig.json'),
  },
  plugins: ['@typescript-eslint'],
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  root: true,
  env: {
    node: true,
    es2022: true,
  },
  ignorePatterns: ['.eslintrc.js', 'dist'],
  rules: {
    // WHY: Allow unused vars that start with underscore (common pattern for unused params)
    '@typescript-eslint/no-unused-vars': [
      'error',
      { argsIgnorePattern: '^_' },
    ],
    // WHY: Explicit return types improve code documentation but can be verbose
    '@typescript-eslint/explicit-function-return-type': 'off',
    // WHY: Allow any in specific cases but prefer types
    '@typescript-eslint/no-explicit-any': 'warn',
  },
};

