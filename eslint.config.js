const globals = require('globals');
const jsESLint = require('@eslint/js');
const nxESLint = require('@nx/eslint-plugin');
const jsoncParser = require('jsonc-eslint-parser');
const prettierPlugin = require('eslint-plugin-prettier');

/** @type { import("eslint").Linter.Config[] } */
module.exports = [
  jsESLint.configs.recommended,
  prettierPlugin,
  { ignores: ['node_modules', '!.storybook', 'dist'] },
  {
    plugins: {
      '@nx': nxESLint,
    },
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
    },
  },
  {
    files: ['**/*.json'],
    languageOptions: {
      parser: jsoncParser,
    },
    rules: { '@nx/dependency-checks': 'error' },
  },
];
