const nxESLint = require('@nx/eslint-plugin');
const jsoncParser = require('jsonc-eslint-parser');
const tsESLint = require('typescript-eslint');

/** @type { import("eslint").Linter.Config[] } */
module.exports = [
  ...tsESLint.configs.recommended,
  {
    languageOptions: {
      parserOptions: {
        sourceType: 'module',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
    },
  },
  {
    files: ['**/package.json', '**/project.json'],
    languageOptions: {
      parser: jsoncParser,
    },
    plugins: {
      '@nx': nxESLint,
    },
    rules: {
      '@nx/dependency-checks': [
        'error',
        {
          ignoredDependencies: ['@beeq/core', '@stencil/react-output-target', 'react', 'react-dom', 'tslib'],
        },
      ],
    },
  },
  {
    files: ['**/*.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];
