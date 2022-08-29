const CSSVALUEPREFIX = '--bq-';

/**
 * Get CSS custom property variable of a given color string value
 *
 * @param {string} colorName - Valid string value.
 * @return {string} The correspongin CSS custom property variable
 */
export function getColorCSSVariable(colorName: string): string {
  return `var(${CSSVALUEPREFIX}${colorName})`;
}
