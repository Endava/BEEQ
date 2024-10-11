/* -------------------------------------------------------------------------- */
/*                             Icon request helper                            */
/* -------------------------------------------------------------------------- */

import { isNil, isString } from '../../../shared/utils';

const requests = new Map<string, Promise<unknown>>();
export const iconContent = new Map<string, string>();

/**
 * Fetches SVG content from a given URL and optionally sanitizes it.
 * @param {string} url - The URL to fetch the SVG from.
 * @param {boolean} sanitize - Whether to sanitize the SVG content.
 * @returns {Promise<unknown>} - A promise that resolves to the SVG content.
 */
const fetchSvg = async (url: string, sanitize: boolean): Promise<unknown> => {
  if (isNil(url) || typeof fetch === 'undefined' || typeof window === 'undefined') {
    return;
  }

  if (requests.has(url)) return requests.get(url);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      iconContent.set(url, '');
      return;
    }

    let svgContent = await response.text();

    if (sanitize !== false) {
      svgContent = validateContent(svgContent);
    }

    iconContent.set(url, svgContent);
    return svgContent;
  } catch (error) {
    console.error(`[BqIcon] Failed to fetch SVG from ${url}:`, error);
    iconContent.set(url, '');
  }
};

/**
 * Retrieves the SVG content for a given URL, fetching and caching it if necessary.
 * @param {string} url - The URL to fetch the SVG from.
 * @param {boolean} sanitize - Whether to sanitize the SVG content.
 * @returns {Promise<unknown>} - A promise that resolves to the SVG content.
 */
export const getSvgContent = async (url: string, sanitize: boolean): Promise<unknown> => {
  if (isNil(url)) return;

  let req = requests.get(url);

  if (isNil(req)) {
    req = fetchSvg(url, sanitize);
    requests.set(url, req);
  }
  return req;
};

/**
 * Validates and sanitizes the SVG content.
 * @param {string} svgContent - The SVG content to validate.
 * @returns {string} - The sanitized SVG content.
 */
export const validateContent = (svgContent: string): string => {
  if (typeof window === 'undefined' || isNil(svgContent)) return '';

  const svgTag = 'svg';
  const iconCssClass = 'bq-icon__svg';
  const div = document.createElement('div');
  div.innerHTML = svgContent;

  const svgElm = div.querySelector(svgTag);

  if (svgElm) {
    const existingClasses = svgElm.getAttribute('class') || '';
    svgElm.setAttribute('class', `${existingClasses} ${iconCssClass}`.trim());
    svgElm.setAttribute('part', svgTag);
    svgElm.removeAttribute('height');
    svgElm.removeAttribute('width');

    if (isValid(svgElm)) {
      return div.innerHTML;
    }
  }

  return '';
};

/**
 * Checks if an HTML element is valid (i.e., does not contain scripts or event handlers).
 * @param {HTMLElement} elm - The element to check.
 * @returns {boolean} - True if the element is valid, false otherwise.
 */
export const isValid = (elm: Element): boolean => {
  if (!elm) return false;
  if (elm.nodeType !== Node.ELEMENT_NODE) return false;
  if (elm.nodeName.toLowerCase() === 'script') return false;

  for (const attribute of Array.from(elm.attributes)) {
    if (isString(attribute.value) && attribute.value.toLowerCase().startsWith('on')) {
      return false;
    }
  }

  for (const childNode of Array.from(elm.children) as HTMLElement[]) {
    if (!isValid(childNode)) return false;
  }

  return true;
};
