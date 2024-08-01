/**
 * Inspired by Shoelace's `getBasePath` and `setBasePath` functions.
 * https://github.com/shoelace-style/shoelace/blob/next/src/utilities/base-path.ts
 */

let basePath = '';

const scripts = [...document.getElementsByTagName('script')] as HTMLScriptElement[];

const findConfigScript = () => scripts.find((script) => script.hasAttribute('data-beeq'));

const findFallbackScript = () => scripts.find((script) => /beeq(\.esm)?\.js($|\?)/.test(script.src));

const getScriptPath = (script: HTMLScriptElement) => script.getAttribute('src').split('/').slice(0, -1).join('/');

/**
 * Returns the base path for the Assets.
 * If the base path has not been set, it will attempt to find the base path using the following methods:
 * 1. If a script with the attribute `data-beeq` exists, the base path will be set to the value of the `src` attribute.
 * 2. If a script with the name `beeq.js` or `beeq.esm.js` exists, the base path will be set to the value of the `src` attribute.
 * 3. If the base path has not been set and no scripts are found, the base path will be set to the current directory.
 *
 * @param subpath - An optional subpath to append to the base path.
 * @returns The base path of the assets.
 */
export const getBasePath = (subpath = '') => {
  if (!basePath) {
    const configScript = findConfigScript();
    const fallbackScript = configScript ? null : findFallbackScript();

    const script = configScript || fallbackScript;
    if (script) {
      const path = configScript ? script.getAttribute('data-beeq') : getScriptPath(script);
      setBasePath(`${path}/svg`);
    }
  }

  // Return the base path without a trailing slash. If one exists, append the subpath separated by a slash.
  const formattedSubpath = subpath ? `/${subpath.replace(/^\//, '')}` : '';
  return basePath.replace(/\/$/, '') + formattedSubpath;
};

/**
 * Sets the base path for the Assets.
 *
 * @param path - The base path to set.
 */
export const setBasePath = (path: string) => {
  basePath = path;
};
