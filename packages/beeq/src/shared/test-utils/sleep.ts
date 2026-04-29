/**
 * Returns a promise that resolves after the given number of milliseconds.
 * Compatible with both Node.js (unit tests) and browser environments (e2e tests).
 */
export const sleep = (ms: number): Promise<void> => new Promise((resolve) => setTimeout(resolve, ms));
