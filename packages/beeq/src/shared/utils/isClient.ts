/**
 * Checks if the code is running on the client side.
 * @returns {boolean} True if running on the client side, false otherwise.
 */
export const isClient = (): boolean => {
  return typeof window !== 'undefined' && typeof document !== 'undefined';
};
