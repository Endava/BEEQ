import { html } from 'lit-html';
import { classMap } from 'lit-html/directives/class-map.js';
import { addParameters, setCustomElements } from '@storybook/web-components';
import { defineCustomElements } from '../../../dist/bee-q/dist/loader';

import customElements from '../custom-elements.json';

defineCustomElements();
setCustomElements(customElements);

addParameters({
  docs: {
    inlineStories: false,
    iframeHeight: '250px',
  },
});

export const parameters = {
  controls: { expanded: true, hideNoControlsWarning: true },
  layout: 'fullscreen',
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
