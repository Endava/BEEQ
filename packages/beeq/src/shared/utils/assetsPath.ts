/**
 * Inspired by Shoelace's `getBasePath` and `setBasePath` functions.
 * https://github.com/shoelace-style/shoelace/blob/next/src/utilities/base-path.ts
 */

/**
 * Extend the Window interface to include the `bqSVGBasePath` property and prevent it from being modified.
 * This is necessary to prevent the basePath from being modified by external scripts.
 */
declare global {
  interface Window {
    bqSVGBasePath: string;
  }
}

/**
 * Define the `bqSVGBasePath` property on the global window object, but only when the window object is available.
 */
if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'bqSVGBasePath', {
    configurable: true,
    enumerable: false,
    writable: true,
  });
}

const DATA_BEEQ_ATTRIBUTE = 'data-beeq';
const DEFAULT_SVG_PATH = 'svg';
const scripts: HTMLScriptElement[] =
  typeof document !== 'undefined' && document
    ? ([...document.getElementsByTagName('script')] as HTMLScriptElement[])
    : [];

/**
 * Sets the `bqSVGBasePath` in the global window object,
 * which is used to determine the SVG path in the BQIcon component.
 * This method is the only way to update the base path.
 *
 * @param path - The new base path to set.
 */
export const setBasePath = (path: string): void => {
  if (typeof window !== 'undefined') {
    window.bqSVGBasePath = path;
  }
};

/**
 * Retrieves the `bqSVGBasePath`, optionally appending a subpath.
 *
 * @param subpath - The subpath to append to the base path.
 * @returns The full base path including the subpath.
 */
export const getBasePath = (subpath = ''): string | undefined => {
  if (typeof window === 'undefined') return undefined;

  const { bqSVGBasePath } = window;
  if (!bqSVGBasePath) {
    initializeBasePath();
  }

  return formatBasePath(subpath);
};

/**
 * Initializes the `bqSVGBasePath` for the BEEQ assets by finding the appropriate script and setting the base path accordingly.
 * 1. If a script with the attribute `data-beeq` exists, the base path will be set to the value of the `src` attribute.
 * 2. If a script with the name `beeq.js` or `beeq.esm.js` exists, the base path will be set to the value of the `src` attribute.
 * 3. If no scripts are found, the base path will be set to the default value `./svg`.
 */
const initializeBasePath = (): void => {
  const configScript = findConfigScript();
  const fallbackScript = configScript ? null : findFallbackScript();

  const script = configScript || fallbackScript;
  if (script) {
    const path = configScript ? script.getAttribute(DATA_BEEQ_ATTRIBUTE) : getScriptPath(script);
    setBasePath(`${path}/${DEFAULT_SVG_PATH}`);
  } else {
    setBasePath(`./${DEFAULT_SVG_PATH}`);
  }
};

/**
 * Formats the `bqSVGBasePath` without a trailing slash.
 * If one exists, append the subpath separated by a slash.
 *
 * @param subpath - The subpath to append to the base path.
 * @returns The formatted base path.
 */
const formatBasePath = (subpath: string): string => {
  const formattedSubpath = subpath ? `/${subpath.replace(/^\//, '')}` : '';
  return window.bqSVGBasePath.replace(/\/$/, '') + formattedSubpath;
};

const findConfigScript = (): HTMLScriptElement => scripts.find((script) => script.hasAttribute(DATA_BEEQ_ATTRIBUTE));

const findFallbackScript = (): HTMLScriptElement => scripts.find((script) => /beeq(\.esm)?\.js($|\?)/.test(script.src));

const getScriptPath = (script: HTMLScriptElement): string =>
  script.getAttribute('src').split('/').slice(0, -1).join('/');
