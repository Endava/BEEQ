/* -------------------------------------------------------------------------- */
/*                             Icon request helper                            */
/* -------------------------------------------------------------------------- */

import { isNil, isString } from '../../../shared/utils';

const requests = new Map<string, Promise<unknown>>();

const fetchSvg = async (url: string, sanitize: boolean): Promise<unknown> => {
  if (typeof fetch === 'undefined' || typeof document === 'undefined') return;

  if (requests.has(url)) return requests.get(url);

  try {
    const response = await fetch(url);

    if (!response.ok) {
      iconContent.set(url, '');
      return;
    }

    let svgContent = (await response.text()) || '';

    if (svgContent && sanitize !== false) svgContent = validateContent(svgContent);

    iconContent.set(url, svgContent);
  } catch (error) {
    console.error(`[BqIcon] Failed to fetch SVG from ${url}:`, error);
    iconContent.set(url, '');
  }
};

export const iconContent = new Map<string, string>();

export const getSvgContent = async (url: string, sanitize: boolean) => {
  let req = requests.get(url);

  // NOTE: if the request does not exists we will cache it
  if (isNil(req)) {
    req = fetchSvg(url, sanitize);
    requests.set(url, req);
  }
  return req;
};

export const validateContent = (svgContent: string): string => {
  if (typeof document === 'undefined') return '';

  const svgTag = 'svg';
  const iconCssClass = 'bq-icon__svg';
  const div = document.createElement('div');
  div.innerHTML = svgContent;

  for (let i = div.childNodes.length - 1; i >= 0; i--) {
    if (div.childNodes[i].nodeName.toLowerCase() !== svgTag) {
      div.removeChild(div.childNodes[i]);
    }
  }

  // must only have 1 root element
  const svgElm = div.firstElementChild;
  if (svgElm && svgElm.nodeName.toLowerCase() === svgTag) {
    // keep other CSS classes (if there's any) and add the `bq-icon__svg` CSS class
    const othersCssClasses = svgElm.getAttribute('class') || '';
    svgElm.setAttribute('class', `${othersCssClasses} ${iconCssClass}`.trim());
    // set the shadow DOM part for the SVG element
    svgElm.setAttribute('part', svgTag);

    // remove height and width attribute, if for some reason they are still present in the SVG tag
    svgElm.removeAttribute('height');
    svgElm.removeAttribute('width');

    // root element must be an svg
    // lets double check we've got valid elements
    // do not allow scripts
    if (isValid(svgElm as HTMLElement)) return div.innerHTML;
  }

  return '';
};

export const isValid = (elm: HTMLElement): boolean => {
  if (elm.nodeType === Node.ELEMENT_NODE) {
    if (elm.nodeName.toLowerCase() === 'script') return false;

    for (const attribute of Array.from(elm.attributes)) {
      const value = attribute.value;
      if (isString(value) && value.toLowerCase().startsWith('on')) {
        return false;
      }
    }

    for (const childNode of Array.from(elm.children) as HTMLElement[]) {
      if (!isValid(childNode)) return false;
    }
  }
  return true;
};
