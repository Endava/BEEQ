/* -------------------------------------------------------------------------- */
/*                         Cally Library loader helper                        */
/* -------------------------------------------------------------------------- */

const CALLY_SCRIPT_ATTRIBUTE = 'data-cally-library' as const;
//❗ Make sure to update the version here when the library releases a new version
const CALLY_LIB_VERSION = '0.8.0' as const;
/**
 * ❗ Make sure to update the hash here if the `CALLY_LIB_VERSION` is updated
 * This hash is used to ensure the integrity of the library when loading it
 * from a CDN.
 * @see https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity
 */
const CALLY_LIB_HASH = 'sha384-giuY/f8D3+ehgOTmQMr4HvrreOITDmvXsZuDCJ1csQ+3dURHA24NqRd8lkSI6uGF' as const;

let isLibraryLoaded = false;

/**
 * Checks if the Cally library is already loaded in the document
 * @returns {boolean} True if the library is loaded
 */
export const isCallyLibraryLoaded = (): boolean => {
  return isLibraryLoaded || document.querySelector(`script[${CALLY_SCRIPT_ATTRIBUTE}]`) !== null;
};

/**
 * Loads the Cally library for the date picker component
 * @throws {Error} If the library fails to load
 * @return {Promise<void>}
 */
export const loadCallyLibrary = async (): Promise<void> => {
  if (isCallyLibraryLoaded()) return;

  try {
    await loadScript({
      type: 'module',
      src: `https://unpkg.com/cally@${CALLY_LIB_VERSION}/dist/cally.js`,
      attributes: {
        [CALLY_SCRIPT_ATTRIBUTE]: '',
        crossOrigin: 'anonymous',
        integrity: CALLY_LIB_HASH,
      },
    });

    isLibraryLoaded = true;
  } catch (error) {
    isLibraryLoaded = false;
    throw new Error(`Failed to load the cally library: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

interface ScriptConfig {
  type: string;
  src: string;
  attributes?: Record<string, string>;
}

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

    Object.entries(attributes).forEach(([key, value]) => {
      script.setAttribute(key, value);
    });

    script.onload = () => resolve();
    script.onerror = (error: Event) => reject(error);

    document.head.appendChild(script);
  });
};
