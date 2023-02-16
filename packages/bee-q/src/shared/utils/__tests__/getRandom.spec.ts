import { getRandomFromArray } from '..';

describe(getRandomFromArray.name, () => {
  const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  it('should return the specific random number of items', () => {
    expect(getRandomFromArray(arr, 4)).toHaveLength(4);
    expect(getRandomFromArray(arr, 8)).toHaveLength(8);
  });

  it('should throw an error if the random number specified is bigger than the elements in the Array', () => {
    expect.assertions(2);
    try {
      getRandomFromArray(arr, arr.length + 5);
    } catch (error) {
      expect(error).toBeInstanceOf(RangeError);
      expect(error).toHaveProperty('message', 'getRandom: more elements taken than available');
    }
  });

  it('should return none if the Array is empty and the random number = 0 ', () => {
    expect(getRandomFromArray([], 0)).toHaveLength(0);
  });

  it('should throw an error if the Array is empty and the random number > 0', () => {
    expect.assertions(2);
    try {
      getRandomFromArray([], 1);
    } catch (error) {
      expect(error).toBeInstanceOf(RangeError);
      expect(error).toHaveProperty('message', 'getRandom: more elements taken than available');
    }
  });
});
