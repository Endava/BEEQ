const { fixupPluginRules } = require('@eslint/compat');
const nxESLint = require('@nx/eslint-plugin');
const angularESLint = require('@angular-eslint/eslint-plugin');
const jsoncParser = require('jsonc-eslint-parser');

/** @type { import("eslint").Linter.Config[] } */
module.exports = [
  {
    files: ['*.ts'],
    plugins: {
      '@angular-eslint': fixupPluginRules(angularESLint),
    },
    rules: {
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'bq',
          style: 'kebab-case',
        },
      ],
      '@angular-eslint/component-class-suffix': 'off',
      '@angular-eslint/directive-class-suffix': 'off',
      '@angular-eslint/directive-selector': 'off',
      '@angular-eslint/no-host-metadata-property': 'off',
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
          ignoredDependencies: ['@beeq/core', '@stencil/core', 'tslib'],
        },
      ],
    },
  },
];
