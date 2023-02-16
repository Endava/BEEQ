/**
 * Get a number of randoms items from Array
 *
 * @param {Array} arr - The array where to look
 * @param {Number} n - The number of random items to take
 * @returns {Array} An array with the number of random items specified
 */
export const getRandomFromArray = (arr: Array<unknown>, n: number): Array<unknown> => {
  let len = arr.length;
  const result = new Array(n);
  const taken = new Array(len);

  if (n > len) throw new RangeError('getRandom: more elements taken than available');

  while (n--) {
    const x = Math.floor(Math.random() * len);
    result[n] = arr[x in taken ? taken[x] : x];
    taken[x] = --len in taken ? taken[len] : len;
  }
  return result;
};
