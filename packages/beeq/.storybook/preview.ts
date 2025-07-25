// eslint-disable no-unused-disable
// eslint-disable-next-line import-x/no-unresolved
import './assets/css/stories.css';

import { DocsContainer } from '@storybook/addon-docs/blocks';
import { setCustomElementsManifest } from '@storybook/web-components-vite';
import type { Preview, WebComponentsRenderer } from '@storybook/web-components-vite';
import { createElement } from 'react';
import type { DecoratorFunction } from 'storybook/internal/csf';

import { isChromatic } from './chromatic-parameters';
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-ignore: this is a custom element manifest generated by the build process
// eslint-disable-next-line import-x/no-unresolved
import customElements from './custom-elements.json';

setCustomElementsManifest(customElements);

const contentDirectionProvider: DecoratorFunction<WebComponentsRenderer, { [x: string]: unknown }> = (
  storyFn,
  context,
) => {
  const {
    globals: { layout },
  } = context;
  const html = document.querySelector('html');
  if (!(html instanceof HTMLElement)) return storyFn();

  html.setAttribute('dir', layout || 'ltr');
  return storyFn();
};

const withThemeProvider: DecoratorFunction<WebComponentsRenderer, { [x: string]: unknown }> = (storyFn, context) => {
  const {
    globals: { theme, mode },
  } = context;
  const body = document.querySelector('body.sb-show-main');
  if (!(body instanceof HTMLElement)) return storyFn();

  if (theme !== 'none') {
    body.setAttribute('bq-theme', theme || 'beeq');
  } else {
    body.removeAttribute('bq-theme');
  }

  if (mode !== 'none') {
    body.setAttribute('bq-mode', mode || 'light');
  } else {
    body.removeAttribute('bq-mode');
  }

  return storyFn();
};

// Add decorator to disable animations when running in Chromatic
const withAnimationControl: DecoratorFunction<WebComponentsRenderer> = (storyFn) => {
  // Disable animations only in Chromatic environment
  if (isChromatic()) {
    // Add styles to disable all animations and transitions
    const style = document.createElement('style');
    style.innerHTML = `
      *, *::before, *::after {
        animation-duration: 0s !important;
        transition-duration: 0s !important;
        animation-delay: 0s !important;
        transition-delay: 0s !important;
        animation-iteration-count: 1 !important;
      }
    `;
    document.head.appendChild(style);
  }
  return storyFn();
};

const preview: Preview = {
  decorators: [contentDirectionProvider, withThemeProvider, withAnimationControl],
  globalTypes: {
    layout: {
      name: 'Content direction',
      description: 'Reading direction for BEEQ components',
      defaultValue: 'ltr',
      toolbar: {
        icon: 'document',
        items: [
          { value: 'ltr', title: 'Direction: LTR →' },
          { value: 'rtl', title: 'Direction: RTL ←' },
        ],
        dynamicTitle: true,
      },
    },
    theme: {
      name: 'Theme',
      description: 'Theme for BEEQ components',
      defaultValue: 'beeq',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'beeq', title: 'Theme: BEEQ' },
          { value: 'endava', title: 'Theme: Endava' },
          { value: 'none', title: 'Theme: None' },
        ],
        dynamicTitle: true,
      },
    },
    mode: {
      name: 'Mode',
      description: 'Theme mode for BEEQ components',
      defaultValue: 'light',
      toolbar: {
        icon: 'mirror',
        items: [
          { value: 'light', title: '☀️ Light' },
          { value: 'dark', title: '🌘 Dark' },
          { value: 'none', title: '🤷‍♂️ None' },
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    a11y: {
      options: {
        /*
         * Opt in to running WCAG 2.x AAA rules
         * Note that you must explicitly re-specify the defaults (all but the last array entry)
         * See https://github.com/dequelabs/axe-core/blob/develop/doc/API.md#options-parameter-examples for more details
         */
        runOnly: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'best-practice'],
      },
      /*
       * Configure test behavior
       * See: https://storybook.js.org/docs/next/writing-tests/accessibility-testing#test-behavior
       */
      test: 'todo',
    },
    controls: { expanded: true, hideNoControlsWarning: true },
    docs: {
      story: {
        inline: true,
        height: '250px',
      },
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      container: (props: any) => {
        const { theme, mode, layout } = props.context.store.userGlobals.globals;

        const html = document.querySelector('html');
        html!.setAttribute('dir', layout.toLowerCase() ?? 'ltr');

        const body = document.querySelector('body');
        body!.setAttribute('bq-theme', theme.toLowerCase() ?? 'beeq');
        body!.setAttribute('bq-mode', mode.toLowerCase() ?? 'light');

        return createElement(DocsContainer, props);
      },
    },
    html: {
      removeComments: true,
      removeEmptyComments: true,
      highlighter: {
        showLineNumbers: true,
        wrapLines: true,
      },
      prettier: {
        htmlWhitespaceSensitivity: 'ignore',
        tabWidth: 2,
        printWidth: 80,
        useTabs: false,
      },
      root: '#root-inner',
    },
    options: {
      storySort: {
        order: ['Welcome', "What's new", 'Foundation', 'Components'],
      },
    },
  },
  tags: ['autodocs'],
};

export default preview;
