import { isDefined } from './isDefined';
import { isString } from './isString';

/**
 * Converts a string or array to an array.
 *
 * @param {string | string[]} value - The value to convert.
 * @return {string[]} The converted array.
 * @throws {Error} If the input string is not a valid JSON array
 */
export const stringToArray = (value: string | string[]): string[] => {
  if (isString(value) && isDefined(value)) {
    try {
      return Array.from(JSON.parse(String(value)));
    } catch (error) {
      throw new Error(
        `Failed to parse string to array. Input must be a valid JSON array string. Details: ${error.message}`,
      );
    }
  }
  return Array.isArray(value) ? value : [];
};
