/**
 * Check if the value is a string or not
 * @param value the value to be checked
 * @returns {boolean} the value is a string
 */
export const isString = (value: unknown): value is string => {
  const type = typeof value;
  return (
    type === 'string' ||
    (type === 'object' &&
      value != null &&
      !Array.isArray(value) &&
      Object.prototype.toString.call(value) == '[object String]')
  );
};
