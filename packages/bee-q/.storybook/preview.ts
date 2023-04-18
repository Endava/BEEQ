import { defineCustomElements } from '@bee-q/core/dist/loader';
import { setCustomElements } from '@storybook/web-components';

import customElements from '../custom-elements.json';

import './css/styles.css';

defineCustomElements();
setCustomElements(customElements);

export const parameters = {
  controls: { expanded: true, hideNoControlsWarning: true },
  docs: {
    story: {
      inline: false,
      iframeHeight: '250px',
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
  },
};
