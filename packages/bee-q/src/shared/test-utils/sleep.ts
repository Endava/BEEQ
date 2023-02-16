import { promisify } from 'util';

/**
 * Delay function which returns a promise with setTimeout as callback function
 * @returns {void}
 */
export const sleep = promisify(setTimeout);
