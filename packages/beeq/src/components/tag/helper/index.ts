import { TAG_SIZE, type TTagSize } from '../bq-tag.types';

/**
 * Function to determine the icon size based on the provided tag size.
 *
 * @param {TTagSize} size - The size of the tag.
 * @returns {number} The corresponding icon size. If the provided size does not match any predefined sizes, the function returns the size for 'medium'.
 */
export const iconSize = (size: TTagSize): number => {
  const xsmall = TAG_SIZE[0];
  const small = TAG_SIZE[1];
  const medium = TAG_SIZE[2];

  const SIZE = {
    [xsmall]: 16,
    [small]: 20,
    [medium]: 24,
  };

  return SIZE[size] || SIZE[medium];
};
