const nxESLint = require('@nx/eslint-plugin');
const jsoncParser = require('jsonc-eslint-parser');
const tsESLint = require('typescript-eslint');

/** @type { import("eslint").Linter.Config[] } */
module.exports = [
  ...tsESLint.configs.recommended,
  {
    ignores: ['**/src/components.ts'],
  },
  {
    rules: {
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-explicit-any': 'off',
      'prefer-const': 'off',
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
          ignoredDependencies: ['@beeq/core', '@stencil/vue-output-target', 'tslib', 'vue'],
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
