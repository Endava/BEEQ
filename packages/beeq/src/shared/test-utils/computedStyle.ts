import type { E2EPage } from '@stencil/core/testing';

/**
 * Enhances page to retrieve element style by a given selector
 * @param {E2EPage} page - stencil instance of puppeteer page
 * @param {String} selector - selector to be passed to querySelector, it supports stencil `>>>` selector
 * @returns {Object} style declaration
 */
export const computedStyle = <T extends keyof CSSStyleDeclaration>(
  page: E2EPage,
  selector: string,
  filter?: ReadonlyArray<T>,
): Promise<Pick<CSSStyleDeclaration, T>> => {
  return page.evaluate(
    // FIXME:
    // @ts-expect-error Argument of type '(querySelector: string, filter?: Array<T>) => any' is not assignable to parameter of type 'string
    (querySelector: string, filter?: Array<T>) => {
      const [lightDomSelector, shadowDomSelector] = querySelector.split('>>>');

      let element = document.querySelector(lightDomSelector);

      if (!element) {
        throw new Error(`Could not find element ${lightDomSelector}`);
      }

      if (shadowDomSelector) {
        element = element.shadowRoot!.querySelector(shadowDomSelector);

        if (!element) {
          throw new Error(`Could not find element ${shadowDomSelector}`);
        }
      }

      const style = getComputedStyle(element);

      if (filter) {
        return filter.reduce(
          (acc, key) => {
            acc[key] = style[key];
            return acc;
          },
          {} as Pick<CSSStyleDeclaration, T>,
        );
      }

      return JSON.parse(JSON.stringify(style));
    },
    selector,
    filter,
  ) as Promise<Pick<CSSStyleDeclaration, T>>;
};
