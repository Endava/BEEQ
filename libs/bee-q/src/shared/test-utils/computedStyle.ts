import type { E2EPage } from '@stencil/core/testing';

/**
 * Enhances page to retrieve element style by a given selector
 * @param {E2EPage} page - stencil instance of puppeteer page
 * @param {String} selector - selector to be passed to querySelector, it supports stencil `>>>` selector
 * @returns {Object} style declaration
 */
export const computedStyle = (page: E2EPage, selector: string): Promise<CSSStyleDeclaration> => {
  return page.evaluate((querySelector: string) => {
    const [lightDomSelector, shadowDomSelector] = querySelector.split('>>>');

    let element = document.querySelector(lightDomSelector);

    if (!element) {
      throw new Error(`Could not find element ${lightDomSelector}`);
    }

    if (!!shadowDomSelector) {
      element = element.shadowRoot.querySelector(shadowDomSelector);

      if (!element) {
        throw new Error(`Could not find element ${shadowDomSelector}`);
      }
    }

    const style = getComputedStyle(element);

    return JSON.parse(JSON.stringify(style));
  }, selector);
};
