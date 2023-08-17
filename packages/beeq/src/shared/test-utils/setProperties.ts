import type { E2EPage } from '@stencil/core/testing';

export type BqHTMLTagNameMap = keyof {
  [TAG in keyof HTMLElementTagNameMap as TAG extends `bq-${string}` ? TAG : never]: TAG extends `bq-${string}`
    ? TAG
    : never;
};

/**
 * Enhances page to set and retrieve properties based on attributes parameter. It typed against bq web components
 * @param {E2EPage} page - stencil instance of puppeteer page
 * @param {String} element - element selector
 * @param {Object} attributes - attributes that will be set on element instance
 * @returns {Object} attributes that were set on element instance
 */
export const setProperties = async <T extends keyof HTMLElementTagNameMap = BqHTMLTagNameMap>(
  page: E2EPage,
  element: T,
  attributes: Partial<HTMLElementTagNameMap[T]>,
) => {
  await page.$eval(
    element,
    (elementRef, attributes) => {
      Object.entries(attributes).forEach(([attr, value]) => (elementRef[attr] = value));
    },
    attributes,
  );

  await page.waitForChanges();

  return page.$eval(
    element,
    (elementRef, attributes) => {
      const attrs = {};
      Object.keys(attributes).forEach((attr) => (attrs[attr] = elementRef[attr]));
      return attrs;
    },
    attributes,
  );
};
