const globals = require('globals');
const jsESLint = require('@eslint/js');
const nxPlugin = require('@nx/eslint-plugin');
const jsoncParser = require('jsonc-eslint-parser');
const prettierPlugin = require('eslint-plugin-prettier');

/** @type { import("eslint").Linter.Config[] } */
module.exports = [
  jsESLint.configs.recommended,
  prettierPlugin,
  { ignores: ['node_modules', '!.storybook', 'dist'] },
  {
    plugins: {
      '@nx': nxPlugin,
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
      parser: parser,
    },
    rules: { '@nx/dependency-checks': 'error' },
  },
];
