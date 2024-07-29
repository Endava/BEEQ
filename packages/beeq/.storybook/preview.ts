import './assets/css/stories.css';

import type { DecoratorFunction } from '@storybook/csf';
import type { Preview, WebComponentsRenderer } from '@storybook/web-components';
import { createElement } from 'react';
import { DocsContainer } from '@storybook/blocks';
import { setCustomElementsManifest } from '@storybook/web-components';

import customElements from '../custom-elements.json';

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

  body.setAttribute('bq-theme', theme || 'beeq');
  body.setAttribute('bq-mode', mode || 'light');
  return storyFn();
};

const preview: Preview = {
  decorators: [contentDirectionProvider, withThemeProvider],
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
        ],
        dynamicTitle: true,
      },
    },
  },
  parameters: {
    controls: { expanded: true, hideNoControlsWarning: true },
    docs: {
      story: {
        inline: true,
        height: '250px',
      },
      container: (props: any) => {
        const {
          globals: { theme, mode, layout },
        } = props.context.store.globals;

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
        order: ['Welcome', 'Foundation', 'Components'],
      },
    },
  },
  tags: ['autodocs'],
};

export default preview;
