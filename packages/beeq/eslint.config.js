const { fixupPluginRules } = require('@eslint/compat');
const nxESLint = require('@nx/eslint-plugin');
const importXPlugin = require('eslint-plugin-import-x');
const jsxA11yPlugin = require('eslint-plugin-jsx-a11y');
const prettierRecommended = require('eslint-plugin-prettier/recommended');
const storybookPlugin = require('eslint-plugin-storybook');
const globals = require('globals');
const jsoncParser = require('jsonc-eslint-parser');
const tsESLint = require('typescript-eslint');

/** @type { import("eslint").Linter.Config[] } */
module.exports = [
  ...tsESLint.configs.recommended,
  prettierRecommended,
  importXPlugin.flatConfigs.recommended,
  importXPlugin.flatConfigs.typescript,
  jsxA11yPlugin.flatConfigs.recommended,
  {
    ignores: ['**/*.e2e.ts', '**/*.spec.ts', '**/*.spec.tsx', '**/cem/*.*'],
  },
  {
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.jest,
      },
      parserOptions: {
        project: ['tsconfig.lib.json', 'tsconfig.storybook.json'],
        tsconfigRootDir: __dirname,
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    linterOptions: {
      reportUnusedDisableDirectives: false,
    },
    settings: {
      react: { version: 'detect' },
    },
    plugins: {
      storybook: fixupPluginRules(storybookPlugin),
    },
  },
  // Project-specific TypeScript config
  {
    rules: {
      // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
      // e.g. "@typescript-eslint/explicit-function-return-type": "off",
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/type-annotation-spacing': 'off',
      '@typescript-eslint/member-ordering': 'off',
      '@typescript-eslint/no-inferrable-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
        },
      ],
      'comma-dangle': 'off',
      'jsx-a11y/no-noninteractive-tabindex': [
        'error',
        {
          tags: [],
          roles: ['tabpanel', 'dialog'],
          allowExpressionValues: true,
        },
      ],
      'jsx-a11y/click-events-have-key-events': 'off',
      'jsx-a11y/no-static-element-interactions': 'off',
      'jsx-a11y/mouse-events-have-key-events': 'off',
      'import-x/consistent-type-specifier-style': 'error',
      'import-x/no-named-as-default': 'off',
      'import-x/no-named-as-default-member': 'off',
      'import-x/namespace': [
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
      '@nx/dependency-checks': [
        'error',
        {
          ignoredDependencies: [
            '@eslint/compat',
            '@nx/eslint-plugin',
            '@stencil/angular-output-target',
            '@stencil/core',
            '@stencil/react-output-target',
            '@stencil/sass',
            '@stencil/vue-output-target',
            'cem-plugin-custom-jsdoc-tags',
            'cem-plugin-expanded-types',
            'cem-plugin-jsdoc-example',
            'custom-element-jsx-integration',
            'custom-element-vs-code-integration',
            'eslint-plugin-import-x',
            'eslint-plugin-jsx-a11y',
            'eslint-plugin-prettier',
            'eslint-plugin-storybook',
            'globals',
            'jsonc-eslint-parser',
            'stencil-tailwind-plugin',
            'typescript-eslint',
            'vite-tsconfig-paths',
            'vite',
          ],
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
