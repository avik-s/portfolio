import js from '@eslint/js';

const browserGlobals = {
  document: 'readonly',
  Event: 'readonly',
  IntersectionObserver: 'readonly',
  URL: 'readonly',
  window: 'readonly',
};

const testGlobals = {
  ...browserGlobals,
  describe: 'readonly',
  expect: 'readonly',
  test: 'readonly',
  vi: 'readonly',
};

export default [
  {
    ignores: ['dist/**', 'node_modules/**'],
  },
  js.configs.recommended,
  {
    files: ['assets/js/**/*.js'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: browserGlobals,
    },
    rules: {
      'no-console': 'warn',
    },
  },
  {
    files: ['tests/**/*.js', 'scripts/**/*.mjs'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...testGlobals,
        console: 'readonly',
        process: 'readonly',
        setTimeout: 'readonly',
      },
    },
  },
];
