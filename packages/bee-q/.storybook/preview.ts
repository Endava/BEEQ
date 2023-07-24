import './css/sb-styles.css';

import { setCustomElements } from '@storybook/web-components';

import customElements from '../custom-elements.json';

setCustomElements(customElements);

export const parameters = {
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
};
