/**
 * Retrieves computed CSS styles for an element, with support for shadow DOM piercing via `>>>` selector.
 * Works directly with the DOM (designed for browser-mode e2e tests).
 *
 * @param {string} selector - CSS selector, supports `>>>` to pierce into shadow DOM
 * @param {ReadonlyArray<T>} [filter] - Optional list of CSS property names to return
 * @returns {Pick<CSSStyleDeclaration, T>} The computed style (filtered if specified)
 */
export const computedStyle = <T extends keyof CSSStyleDeclaration>(
  selector: string,
  filter?: ReadonlyArray<T>,
): Pick<CSSStyleDeclaration, T> => {
  const [lightDomSelector, shadowDomSelector] = selector.split('>>>').map((s) => s.trim());

  let element: Element | null = document.querySelector(lightDomSelector);

  if (!element) {
    throw new Error(`Could not find element ${lightDomSelector}`);
  }

  if (shadowDomSelector) {
    element = element.shadowRoot?.querySelector(shadowDomSelector) ?? null;

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
};
