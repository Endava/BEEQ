const CSSVALUEPREFIX = '--bq-';

/**
 * Get CSS custom property variable of a given color string value
 *
 * @param {string} colorName - Valid string value.
 * @return {string} The corresponding CSS custom property variable
 */
export function getColorCSSVariable(colorName: string): string | undefined {
  if (typeof window === 'undefined') return undefined;

  const token = `${CSSVALUEPREFIX}${colorName}`;
  const value = getComputedStyle(document.documentElement).getPropertyValue(token);
  if (!value) return undefined;

  return `var(${token})`;
}

/**
 * Get compiled CSS custom property value
 *
 * @param {string} variable - The variable name for which to get its value
 * @return {string} The corresponding value for the given CSS custom property
 */
export function getCSSVariableValue(variable: string, component: Element): string {
  const styles = getComputedStyle(component);
  return String(styles.getPropertyValue(`--${variable}`)).trim();
}
