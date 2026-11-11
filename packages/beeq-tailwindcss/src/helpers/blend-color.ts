type BlendPercentage = number | `var(--bq-state-mix-${'hover' | 'active'}, 20%)`;

type BlendOptions = {
  color: string;
  base: string;
  percentage?: BlendPercentage;
  property?: string;
};

const formatPercentage = (percentage: BlendPercentage) =>
  typeof percentage === 'number' ? `${percentage}%` : percentage;

/**
 * Blend color with base color and percentage
 *
 * @param {Object} opt - The blendColor options object
 * @param {string} opt.color - The color to blend
 * @param {string} opt.base - The base color layer to blend with
 * @param {number | string} opt.percentage - A numeric percentage or the shared state percentage variable
 * @param {string} [opt.property ='background-color'] - The CSS property to blend (e.g: 'background-color', 'color')
 */
export const blendColor = ({ color, base, percentage = 20, property = 'background-color' }: BlendOptions) => ({
  [property]: `color-mix(in srgb, ${color}, ${base} ${formatPercentage(percentage)})`,
});
