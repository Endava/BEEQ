/**
 * Flattens a nested object into a flat key-value structure
 *
 * @param obj - The object to flatten
 * @param prefix - The prefix for the keys
 * @param result - The result object to populate
 */
function flattenObject(obj: Record<string, unknown>, prefix = '', result: Record<string, string> = {}): void {
  Object.entries(obj).forEach(([key, value]) => {
    const newKey = prefix ? `${prefix}-${key}` : key;

    if (value && typeof value === 'object' && !Array.isArray(value)) {
      // Recursively flatten nested objects
      flattenObject(value as Record<string, unknown>, newKey, result);
    } else if (typeof value === 'string') {
      // Only include string values (actual color values)
      result[newKey] = value;
    }
  });
}

/**
 * Custom implementation of flattenColorPalette for TailwindCSS v3/v4 compatibility
 * This function flattens nested color objects into a flat key-value structure
 *
 * @param colors - The colors object from theme
 * @returns Flattened color palette
 */
function customFlattenColorPalette(colors: Record<string, unknown>): Record<string, string> {
  if (!colors || typeof colors !== 'object') return {};

  const result: Record<string, string> = {};
  flattenObject(colors, '', result);
  return result;
}

/**
 * Checks if a module exists and can be required
 *
 * @param modulePath - The module path to check
 * @returns True if the module exists and can be required
 */
function moduleExists(modulePath: string): boolean {
  try {
    require.resolve(modulePath);
    return true;
  } catch {
    return false;
  }
}

/**
 * Safe wrapper that tries to use TailwindCSS's built-in flattenColorPalette if available,
 * otherwise falls back to our custom implementation
 *
 * @param colors - The colors object from theme
 * @returns Flattened color palette
 */
export function flattenColorPalette(colors: Record<string, unknown>): Record<string, string> {
  // Check if TailwindCSS v3's flattenColorPalette is available
  if (!moduleExists('tailwindcss/lib/util/flattenColorPalette')) {
    // Otherwise, use our custom implementation for TailwindCSS v4 or when the utility is not available
    return customFlattenColorPalette(colors);
  }

  try {
    // Try to use TailwindCSS v3's flattenColorPalette if available
    // @see: https://github.com/tailwindlabs/tailwindcss/discussions/6925#discussioncomment-1919382
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { default: twFlattenColorPalette } = require('tailwindcss/lib/util/flattenColorPalette');
    return twFlattenColorPalette(colors);
  } catch {
    return customFlattenColorPalette(colors);
  }
}
