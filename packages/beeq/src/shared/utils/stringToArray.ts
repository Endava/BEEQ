import { isString } from './isString';

/**
 * Converts a string or array to an array.
 *
 * @param {string | string[]} value - The value to convert.
 * @return {string[]} The converted array.
 * @throws {Error} If the JSON string cannot be parsed
 */
export const stringToArray = (value: string | string[]): string[] => {
  if (isString(value)) {
    try {
      return Array.from(JSON.parse(String(value)));
    } catch (error) {
      throw error;
    }
  }
  return Array.isArray(value) ? value : [];
};
