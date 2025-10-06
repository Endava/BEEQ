const nxESLint = require('@nx/eslint-plugin');
const importXPlugin = require('eslint-plugin-import-x');
const prettierRecommended = require('eslint-plugin-prettier/recommended');
const jsoncParser = require('jsonc-eslint-parser');
const tsESLint = require('typescript-eslint');

/** @type { import("eslint").Linter.Config[] } */
module.exports = [
  ...tsESLint.configs.recommended,
  prettierRecommended,
  importXPlugin.flatConfigs.recommended,
  importXPlugin.flatConfigs.typescript,
  {
    files: ['*.ts', '*.tsx', '*.js', '*.jsx'],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsESLint.parser,
      parserOptions: {
        project: './tsconfig.lib.json',
        tsconfigRootDir: __dirname,
      },
      sourceType: 'module',
    },
  },
  {
    files: ['**/*.js', '**/*.jsx'],
    languageOptions: {
      sourceType: 'module',
    },
  },
  {
    rules: {
      '@typescript-eslint/no-inferrable-types': 'off',
      'import-x/consistent-type-specifier-style': 'error',
      'import-x/no-named-as-default': 'off',
      'import-x/no-named-as-default-member': 'off',
      'import-x/namespace': [
        // @see https://github.com/import-js/eslint-plugin-import/blob/v2.27.5/docs/rules/namespace.md
        'error',
        {
          allowComputed: true,
        },
      ],
      'import-x/order': [
        'error',
        {
          groups: ['builtin', 'external', ['parent', 'sibling'], 'index'],
          'newlines-between': 'always',
          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },
        },
      ],
      'sort-imports': [
        'error',
        {
          ignoreCase: true,
          ignoreDeclarationSort: true,
        },
      ],
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
      '@nx/dependency-checks': 'error',
    },
  },
  {
    files: ['**/*.js'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
];
