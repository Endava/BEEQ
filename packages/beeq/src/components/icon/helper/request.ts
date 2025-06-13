/* -------------------------------------------------------------------------- */
/*                             Icon request helper                            */
/* -------------------------------------------------------------------------- */

import { isClient, isNil } from '../../../shared/utils';

const SVG_TAG = 'svg';
const ICON_CSS_CLASS = 'bq-icon__svg';

interface IconCache {
  requests: Map<string, Promise<string>>;
  content: Map<string, string>;
}

const cache: IconCache = {
  requests: new Map(),
  content: new Map(),
};

/**
 * Sanitizes SVG element by setting required attributes and removing unwanted ones
 * @param svg - The SVG element to sanitize
 */
const sanitizeSvgElement = (svg: SVGElement): void => {
  const currentClass = svg.getAttribute('class') || '';

  svg.setAttribute('class', `${currentClass} ${ICON_CSS_CLASS}`.trim());
  svg.setAttribute('part', SVG_TAG);
  svg.removeAttribute('height');
  svg.removeAttribute('width');
};

/**
 * Validates element security (no scripts or event handlers)
 * @param element - The element to validate
 * @returns True if the element is valid, false otherwise
 */
const validateElement = (element: Element): boolean => {
  if (!element || element.nodeType !== Node.ELEMENT_NODE) return false;
  if (element.nodeName.toLowerCase() === 'script') return false;

  // Check for malicious attributes using modern array methods
  const hasUnsafeAttribute = Array.from(element.attributes).some((attr) => {
    const value = attr.value?.toLowerCase() || '';
    const name = attr.name.toLowerCase();

    // Check for event handlers
    if (name.startsWith('on')) return true;
    // Check for javascript: URLs
    if (value.includes('javascript:')) return true;

    return false;
  });

  if (hasUnsafeAttribute) return false;

  // Recursively validate children
  return Array.from(element.children).every((child) => validateElement(child));
};

/**
 * Processes SVG content with security checks and sanitization
 * @param content - The SVG content to process
 * @returns The processed and sanitized SVG content
 */
const processSvgContent = (content: string): string => {
  if (!isClient() || isNil(content)) return '';

  try {
    const domParser = new DOMParser();
    const doc = domParser.parseFromString(content, 'image/svg+xml');
    const svg = doc.querySelector(SVG_TAG);

    if (!svg || !validateElement(svg)) {
      console.warn('[BqIcon] SVG content failed security validation');
      return '';
    }

    sanitizeSvgElement(svg);
    return new XMLSerializer().serializeToString(svg);
  } catch (error) {
    console.error('[BqIcon] Error processing SVG content:', error);
    return '';
  }
};

/**
 * Fetches and processes SVG content from URL
 * @param url - The URL of the SVG to fetch
 * @param shouldSanitize - Whether to sanitize the SVG content
 * @returns Promise that resolves to the processed SVG content
 */
const fetchAndProcessSvg = async (url: string, shouldSanitize = true): Promise<string> => {
  if (!isClient()) return '';

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const content = await response.text();

    if (!content.trim()) {
      console.warn(`[BqIcon] Empty SVG content received from ${url}`);
      return '';
    }

    return shouldSanitize ? processSvgContent(content) : content;
  } catch (error) {
    console.error(`[BqIcon] Failed to fetch SVG from ${url}:`, error);
    return '';
  }
};

/**
 * Retrieves SVG content with caching, security validation, and sanitization
 * @param url - The URL of the SVG to fetch
 * @param sanitize - Whether to sanitize the SVG content (default: true)
 * @returns Promise that resolves to the processed SVG content or undefined
 */
export const getSvgContent = async (url?: string, sanitize = true): Promise<string> => {
  if (!isClient() || isNil(url)) return undefined;

  // Return cached content if available
  if (cache.content.has(url)) {
    const cachedContent = cache.content.get(url);
    return cachedContent;
  }

  // Check if the request is already in the cache
  if (!cache.requests.has(url)) {
    // Create new request with proper cleanup
    const request = fetchAndProcessSvg(url, sanitize).then((content) => {
      // Cache the result (including empty strings for failed requests)
      cache.content.set(url, content);
      // Clean up the pending request
      cache.requests.delete(url);
      return content;
    });

    cache.requests.set(url, request);
  }

  return cache.requests.get(url);
};

/**
 * Clears the icon cache - useful for testing or memory management
 */
export const clearIconCache = (): void => {
  cache.requests.clear();
  cache.content.clear();
};

/**
 * Gets cache statistics for debugging
 */
export const getCacheStats = () => ({
  pendingRequests: cache.requests.size,
  cachedContent: cache.content.size,
  urls: Array.from(cache.content.keys()),
});

// Export cache for external access if needed
export { cache as iconCache };
