export type TExtractProp<T> = T[keyof T] extends infer U ? U : never;
export type TValidProperty<E, T> = TExtractProp<{ [K in keyof E]: E[K] extends T ? K : never }>;

/**
 * Validate the element property value, if is one of the accepted values
 *
 * @param {readonly} ACCEPTED_VALUES - The list of the accepted values to check against.
 * @param {unknow} fallbackValue - The default value to assign
 * @param {Element} element - The component reference
 * @param {string} propertyName - The property name (will be used in the console notification)
 * @returns {void}
 */
export const validatePropValue = <T extends E[keyof E], E extends Element>(
  ACCEPTED_VALUES: Readonly<T[]>,
  fallbackValue: T,
  element: E,
  propertyName: TValidProperty<E, T>,
): void => {
  const propertyValue = element[propertyName as string];
  // Early return if the property value is one of the accetped values
  if (ACCEPTED_VALUES.includes(propertyValue)) return;
  // Override property with fallback value
  element[propertyName as string] = fallbackValue;
  // Notify developer in the browser console
  console.warn(
    `[${element.tagName.toUpperCase()}] Please notice that "${propertyName}" should be one of ${ACCEPTED_VALUES.join(
      '|',
    )}`,
  );
};
