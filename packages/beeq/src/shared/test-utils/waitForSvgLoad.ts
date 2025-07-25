/**
 * Options for SVG loading wait function
 */
interface WaitForSvgLoadOptions {
  /** Timeout in milliseconds (default: 15000) */
  timeout?: number;
  /** Additional properties to set on the icon element */
  properties?: Partial<HTMLBqIconElement>;
}

/**
 * Waits for SVG content to load in a bq-icon component
 * This function is designed to be used with page.$eval() in E2E tests
 *
 * @param {HTMLBqIconElement} element - The HTMLBqIconElement instance
 * @param {WaitForSvgLoadOptions} options - Configuration options
 * @returns {Promise<void>} Promise that resolves when SVG is loaded
 */
export const waitForSvgLoad = (element: HTMLBqIconElement, options: WaitForSvgLoadOptions = {}): Promise<void> => {
  const { timeout = 15000, properties } = options;

  return new Promise<void>((resolve, reject) => {
    let isResolved = false;

    const cleanup = () => {
      if (isResolved) return;

      isResolved = true;
      clearTimeout(timeoutId);
      element.removeEventListener('svgLoaded', svgLoadedHandler);
    };

    const timeoutId = setTimeout(() => {
      cleanup();
      reject(new Error(`SVG did not load within ${timeout}ms`));
    }, timeout);

    const svgLoadedHandler = () => {
      if (isResolved) return;

      cleanup();
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        resolve();
      }, 50);
    };

    const checkIfAlreadyLoaded = () => {
      // Check if SVG is already loaded by looking for the svg element with part="svg"
      const svgElement = element.shadowRoot?.querySelector('[part="svg"]');
      if (svgElement?.innerHTML.trim()) {
        cleanup();
        resolve();
        return true;
      }
      return false;
    };

    // Set properties if provided (this might trigger a new load)
    if (properties) {
      Object.keys(properties).forEach((key) => {
        element[key] = properties[key];
      });
    }

    // Check if SVG is already loaded
    if (checkIfAlreadyLoaded()) {
      return;
    }

    // Listen for the svgLoaded event
    element.addEventListener('svgLoaded', svgLoadedHandler);
  });
};
