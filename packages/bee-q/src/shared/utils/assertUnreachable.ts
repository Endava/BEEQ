/**
 * Helps typescript to identify unhandled switch cases
 *
 * @param value switch value
 * @returns {RangeError} Throws RangeError if the case is not handled
 */
export const assertUnreachable = (value: never): never => {
  throw new RangeError(`Case not handled ${value}`);
};
