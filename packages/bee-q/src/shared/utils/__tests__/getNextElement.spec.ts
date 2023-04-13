import { getNextElement } from '..';

function makeTestArray(length: number, disabled = false) {
  return Array.from({ length }).map((_, idx) => ({ tag: `tag-${idx}`, disabled }));
}

describe(getNextElement.name, () => {
  it('should return next element that is not disabled', () => {
    const arr = makeTestArray(3);
    arr[1].disabled = true;
    expect(getNextElement(arr, 0, 'forward')).toStrictEqual(arr[2]);
  });

  it('should return prev element that is not disabled', () => {
    const arr = makeTestArray(3);
    arr[1].disabled = true;
    expect(getNextElement(arr, 2, 'backward')).toStrictEqual(arr[0]);
  });

  it('should return element at index if they are all disabled', () => {
    const arr = makeTestArray(3, true);
    expect(getNextElement(arr, 1, 'backward')).toStrictEqual(arr[1]);
  });

  it('should return the element at index if is the only one not disabled', () => {
    const arr = makeTestArray(3, true);
    arr[1].disabled = false;
    expect(getNextElement(arr, 1, 'forward')).toStrictEqual(arr[1]);
  });
});
