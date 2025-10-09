import { TAG_COLOR, TAG_SIZE, TAG_VARIANT, type TTagColor, type TTagSize, type TTagVariant } from '../bq-tag.types';

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

/**
 * Function to determine the tag text color scheme for a given tag type.
 *
 * @param {TTagType} color - The color of the tag.
 * @returns {Object} An object containing the color scheme for the given tag type. If the provided type does not match any predefined types, the function returns the color scheme for 'default'.
 */
export const textColor = (color: TTagColor): Partial<{ [K in TTagVariant]: string }> => {
  const typeError = TAG_COLOR[0];
  const typeGray = TAG_COLOR[1];
  const typeInfo = TAG_COLOR[2];
  const typeSuccess = TAG_COLOR[3];
  const typeWarning = TAG_COLOR[4];

  const variantOutline = TAG_VARIANT[0];
  const variantFilled = TAG_VARIANT[1];

  const COLORS = {
    [typeError]: {
      [variantOutline]: 'text--danger',
      [variantFilled]: 'text--alt',
    },
    [typeGray]: {
      [variantOutline]: 'text--primary',
      [variantFilled]: 'text--alt',
    },
    [typeInfo]: {
      [variantOutline]: 'text--brand',
      [variantFilled]: 'text--alt',
    },
    [typeSuccess]: {
      [variantOutline]: 'text--success',
      [variantFilled]: 'text--alt',
    },
    [typeWarning]: {
      [variantOutline]: 'text--warning',
      [variantFilled]: 'text--alt',
    },
  };

  return COLORS[color];
};
