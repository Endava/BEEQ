/**
 * Inspired by Shoelace's `getBasePath` and `setBasePath` functions.
 * https://github.com/shoelace-style/shoelace/blob/next/src/utilities/base-path.ts
 */
import { Env } from '@stencil/core';

let beeqBasePath: string | undefined;
const DATA_BEEQ_ATTRIBUTE = 'data-beeq';
const DEFAULT_SVG_PATH = 'svg';

/**
 * Sets the base path for the assets.
 * @param {string} path - The base path to set.
 */
export const setBasePath = (path: string): void => {
  beeqBasePath = path;
};

/**
 * Gets the base path for the assets.
 * @param {string} subpath - An optional subpath to append to the base path.
 * @returns {string} The base path of the assets.
 */
export const getBasePath = (subpath: string = ''): string => {
  if (!beeqBasePath) {
    const configScript = findConfigScript();
    const fallbackScript = configScript ? null : findFallbackScript();

    const script = configScript || fallbackScript;
    if (script) {
      const path = configScript ? script.getAttribute(DATA_BEEQ_ATTRIBUTE) : getScriptPath(script);
      setBasePath(`${path}/${DEFAULT_SVG_PATH}`);
    } else {
      // Fallback: use an environment variable (if set) or the default path
      setBasePath(Env.BEEQ_ASSETS_BASE_PATH || `./${DEFAULT_SVG_PATH}`);
    }
  }

  // Return the base path without a trailing slash. If one exists, append the subpath separated by a slash.
  const formattedSubpath = subpath ? `/${subpath.replace(/^\//, '')}` : '';
  return beeqBasePath.replace(/\/$/, '') + formattedSubpath;
};

/**
 * Finds the configuration script element.
 * @returns The configuration script element or null if not found.
 */
const findConfigScript = (): HTMLScriptElement | null => {
  if (typeof window === 'undefined') return null;

  return document.querySelector(`script[${DATA_BEEQ_ATTRIBUTE}]`);
};

/**
 * Finds the fallback script element.
 * @returns The fallback script element or null if not found.
 */
const findFallbackScript = (): HTMLScriptElement | null => {
  if (typeof window === 'undefined') return null;

  return document.querySelector(`script[src*="beeq"]`);
};

/**
 * Gets the path of a script element.
 * @param {HTMLScriptElement} script - The script element.
 * @returns The path of the script element.
 */
const getScriptPath = (script: HTMLScriptElement): string => {
  if (typeof window === 'undefined') return '';

  const src = script.getAttribute('src');
  return src ? src.substring(0, src.lastIndexOf('/')) : '';
};
