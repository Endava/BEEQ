// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import './css/styles.css';
import { html } from 'lit-html';
import { classMap } from 'lit-html/directives/class-map.js';
import { setCustomElements } from '@storybook/web-components';

import { defineCustomElements } from '@bee-q/core/dist/loader';
import customElements from '../custom-elements.json';

defineCustomElements();
setCustomElements(customElements);

export const parameters = {
  controls: { expanded: true, hideNoControlsWarning: true },
  docs: {
    inlineStories: false,
    iframeHeight: '250px',
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

const withThemeProvider = (storyFn, context) => {
  const cssClasses = { centered: context.parameters.layout === 'centered' };

  return html` <div class="bq-root ${classMap(cssClasses)}">${storyFn()}</div> `;
};
export const decorators = [withThemeProvider];
