type BlendOptions = {
  color: string;
  base: string;
  percentage?: number;
  property?: string;
};

/**
 * Blend color with base color and percentage
 *
 * @param {Object} opt - The blendColor options object
 * @param {string} opt.color - The color to blend
 * @param {string} opt.base - The base color layer to blend with
 * @param {number} opt.percentage - The percentage to blend
 * @param {string} [opt.property ='background-color'] - The CSS property to blend (e.g: 'background-color', 'color')
 */
export const blendColor = ({ color, base, percentage = 20, property = 'background-color' }: BlendOptions) => ({
  [property]: `color-mix(in srgb, ${color}, ${base} ${percentage}%)`,
});
