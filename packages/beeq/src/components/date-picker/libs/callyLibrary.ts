/* -------------------------------------------------------------------------- */
/*                         Cally Library loader helper                        */
/* -------------------------------------------------------------------------- */

const CALLY_SCRIPT_ATTRIBUTE = 'data-cally-library';
//❗ Make sure to update the version here when the library releases a new version
const CALLY_LIB_VERSION = '0.9.0';
/**
 * ❗ Make sure to update the hash here if the `CALLY_LIB_VERSION` is updated
 * This hash is used to ensure the integrity of the library when loading it
 * from a CDN.
 * @see https://developer.mozilla.org/en-US/docs/Web/Security/Defenses/Subresource_Integrity#tools_for_generating_sri_hashes
 */
const CALLY_LIB_HASH = 'sha384-pM/XA9cWLgX65JRL+wCO7uw2DIwVqcK1WlITykq2OZYbP5vuMspYj0K29Ka6UyFU';

let isLibraryLoaded = false;
let loadingPromise: Promise<void> | null = null;

type ScriptConfig = {
  type: string;
  src: string;
  attributes?: Record<string, string>;
};

/**
 * Helper function to load a script with given configuration
 * @param {Object} config - Script configuration
 * @param {string} config.type - The type of the script
 * @param {string} config.src - The source URL of the script
 * @param {Object} [config.attributes] - Additional attributes to set on the script element
 * @returns {Promise<void>}
 */
const loadScript = ({ type, src, attributes = {} }: ScriptConfig): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.type = type;
    script.src = src;

    script.onload = () => resolve();
    script.onerror = (error: Event) =>
      reject(new Error(`Failed to load script: ${src}, ${error instanceof Error ? error.message : 'Unknown error'}`));

    Object.entries(attributes).forEach(([key, value]) => {
      script.setAttribute(key, value);
    });

    document.head.appendChild(script);
  });
};

/**
 * Checks if the Cally library is already loaded in the document
 * @returns {boolean} True if the library is loaded
 */
const isCallyLibraryLoaded = (): boolean => {
  // This might be a bit redundant, but it's a sanity check to ensure the library is actually loaded
  return isLibraryLoaded || document.querySelector(`script[${CALLY_SCRIPT_ATTRIBUTE}]`) !== null;
};

/**
 * Loads the Cally library for the date picker component.
 * Uses a singleton promise pattern to prevent race conditions when multiple
 * date picker components attempt to load the library simultaneously.
 *
 * @throws {Error} If the library fails to load
 * @return {Promise<void>}
 */
const loadCallyLibrary = (): Promise<void> => {
  // Already loaded, return immediately
  if (isLibraryLoaded) return Promise.resolve();

  // If a load is already in progress, wait for it to complete
  if (loadingPromise !== null) return loadingPromise;

  // Check if script already exists in DOM (e.g., from a previous session or external source)
  if (document.querySelector(`script[${CALLY_SCRIPT_ATTRIBUTE}]`) !== null) {
    isLibraryLoaded = true;
    return Promise.resolve();
  }

  // Start loading and store the promise so concurrent calls can await it
  loadingPromise = loadScript({
    type: 'module',
    src: `https://unpkg.com/cally@${CALLY_LIB_VERSION}/dist/cally.js`,
    attributes: {
      [CALLY_SCRIPT_ATTRIBUTE]: '',
      crossOrigin: 'anonymous',
      integrity: CALLY_LIB_HASH,
    },
  })
    .then(() => {
      isLibraryLoaded = true;
    })
    .catch((error) => {
      // Reset the promise so future attempts can retry
      loadingPromise = null;
      isLibraryLoaded = false;
      throw new Error(`Failed to load the cally library: ${error instanceof Error ? error.message : 'Unknown error'}`);
    });

  return loadingPromise;
};

export { loadCallyLibrary, isCallyLibraryLoaded };
