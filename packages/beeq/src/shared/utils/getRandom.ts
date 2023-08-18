/**
 * Get a number of randoms items from Array
 *
 * @param {Array} arr - The array where to look
 * @param {Number} n - The number of random items to take
 * @returns {Array} An array with the number of random items specified
 */
export const getRandomFromArray = <T>(arr: T[], n: number): T[] => {
  let length = arr.length;
  const result = new Array(n);
  const taken = new Array(length);

  if (n > length) throw new RangeError('getRandom: more elements taken than available');

  while (n--) {
    const x = Date.now() % length;
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --length in taken ? taken[length] : length;
  }
  return result;
};
