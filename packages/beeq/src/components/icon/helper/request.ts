/* -------------------------------------------------------------------------- */
/*                             Icon request helper                            */
/* -------------------------------------------------------------------------- */

import { Env } from '@stencil/core';

import { isString } from '../../../shared/utils';

const requests = new Map<string, Promise<unknown>>();

const fetchSvg = async (url: string, sanitize: boolean): Promise<unknown> => {
  let req: Promise<unknown>;

  if (typeof fetch !== 'undefined' && typeof document !== 'undefined') {
    const rsp = await fetch(url);
    if (rsp.ok) {
      return rsp.text().then((svgContent) => {
        if (svgContent && sanitize !== false) svgContent = validateContent(svgContent);
        iconContent.set(url, svgContent || '');
      });
    }
    iconContent.set(url, '');
    // cache for the same requests
    requests.set(url, req);
    return req;
  }

  iconContent.set(url, '');
  return Promise.resolve();
};

export const iconContent = new Map<string, string>();

export const getSvgContent = async (url: string, sanitize: boolean) => {
  // see if we already have a request for this SVG file
  const req = await requests.get(url);
  if (!req) return fetchSvg(url, sanitize);

  return req;
};

export const validateContent = (svgContent: string): string => {
  const svgTag = 'svg';
  const iconCssClass = !Env.ICONS_SVG_PATH ? 'bq-icon__svg' : '';

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
