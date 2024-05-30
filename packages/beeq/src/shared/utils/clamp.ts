/**
 * Restricts value to a specified interval [min, max]
 *
 * @param value - value
 * @param min  - lower end of the interval
 * @param max  - upper end of the interval
 * @returns  - value in interval [min, max]
 */
export const clamp = (value: number, min = Number.MIN_SAFE_INTEGER, max = Number.MAX_SAFE_INTEGER) => {
  return Math.min(Math.max(min, value), max);
};
