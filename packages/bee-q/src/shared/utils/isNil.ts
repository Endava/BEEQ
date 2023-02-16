/**
 * Check if the value is null or undefined
 * @param value the value to be checked
 * @returns {boolean} the value is null or undefined
 */
export const isNil = <T>(value: T): value is null | undefined => {
  return value === null || value === undefined;
};
