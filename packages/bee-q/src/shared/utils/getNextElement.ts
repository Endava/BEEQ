const getNextIndex = (currentIndex: number, length: number, direction: 'forward' | 'backward'): number => {
  const nextIndex = currentIndex + (direction === 'forward' ? 1 : -1);
  return (length + nextIndex) % length;
};

/**
 * Gets the next element that is not disabled
 *
 * @param {Array} elements - The array to search in
 * @param {Numebr} startAt - Position to start at
 * @param {String} direction - The direction to look on
 * @returns {Element} Next available element
 */
export const getNextElement = <T extends { disabled: boolean }>(
  elements: T[],
  startAt = 0,
  direction: 'forward' | 'backward' = 'forward',
): T => {
  let elementIndex = startAt;
  let element = elements[startAt];

  do {
    elementIndex = getNextIndex(elementIndex, elements.length, direction);
    element = elements[elementIndex];

    if (elementIndex === startAt) {
      break;
    }
  } while (element.disabled);

  return element;
};
