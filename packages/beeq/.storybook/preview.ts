import './assets/css/stories.css';

import type { DecoratorFunction } from '@storybook/types';
import type { Preview, WebComponentsRenderer } from '@storybook/web-components';
import { setCustomElementsManifest } from '@storybook/web-components';

import customElements from '../custom-elements.json';

setCustomElementsManifest(customElements);

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
  decorators: [withThemeProvider],

  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Theme for BEEQ components',
      defaultValue: 'beeq',
      toolbar: {
        icon: 'globe',
        items: [
          { value: 'beeq', title: 'BEEQ' },
          { value: 'endava', title: 'Endava' },
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
  },

  tags: ['autodocs'],
};

export default preview;
