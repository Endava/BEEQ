import './assets/css/stories.css';

import type { DecoratorFunction } from '@storybook/types';
import type { Preview, WebComponentsRenderer } from '@storybook/web-components';
import { setCustomElementsManifest } from '@storybook/web-components';

import customElements from '../custom-elements.json';

setCustomElementsManifest(customElements);

const withThemeProvider: DecoratorFunction<WebComponentsRenderer, { [x: string]: unknown }> = (storyFn, context) => {
  const {
    globals: { theme },
  } = context;
  const body = document.querySelector('body.sb-show-main');
  if (!body) return storyFn();

  body.setAttribute('data-theme', (theme || 'Light').toLowerCase());
  return storyFn();
};

const preview: Preview = {
  decorators: [withThemeProvider],
  globalTypes: {
    theme: {
      name: 'Theme',
      description: 'Theme mode for BEEQ components',
      defaultValue: 'Light',
      toolbar: {
        icon: 'mirror',
        items: ['Dark', 'Light'],
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
  },
};

export default preview;
