import { isString } from '.';

/**
 * Check is a value is not falsy
 * @param value the value to be checked
 * @returns {boolean} the value is not falsy
 */
export const isDefined = (value: unknown): boolean => {
  return isString(value) ? value.length !== 0 : Boolean(value);
};
