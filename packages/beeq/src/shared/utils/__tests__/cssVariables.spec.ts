import jsdom from 'jsdom';

import { getColorCSSVariable } from '..';

// Helper function to setup JSDOM and global variables
function setupDOM(html: string) {
  const DOM = new jsdom.JSDOM(html);
  const { document } = DOM.window;
  global.document = document;
  global.window = document.defaultView;
  global.getComputedStyle = window.getComputedStyle.bind(window);
}

describe('cssVariables - getColorCSSVariable()', () => {
  it('should return the correct CSS Custom Property string', () => {
    setupDOM(`
      <html>
        <head>
          <style>
            :root {
              --bq-ui--primary: #fbfbfc;
            }
          </style>
        </head>
        <body>
          <div></div>
        </body>
      </html>
    `);

    const token = 'ui--primary';
    const result = `var(--bq-${token})`;

    expect(getColorCSSVariable(token)).toEqual(result);
  });
});
