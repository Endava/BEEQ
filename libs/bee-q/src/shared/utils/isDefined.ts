/**
 * Check is a value is not null or undefined
 * @param value the value to be checked
 * @returns {boolean} the value is not null or undefined
 */
export const isDefined = <T>(value: T): value is NonNullable<T> => {
  return value !== null && value !== undefined;
};
