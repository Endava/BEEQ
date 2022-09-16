/**
 * Validate the element property value, if is one of the accepted values
 *
 * @param {readonly} ACCEPTED_VAlUES - The list of the accepted values to check against.
 * @param {unknow} fallbackValue - The default value to assign
 * @param {unknown} propertyValue - The property value to check
 * @param {string} propertyName - The property name (will be used in the console notification)
 * @param {Element} element - The component reference
 * @returns {void}
 */
export const validatePropValue = (
  ACCEPTED_VAlUES: Readonly<unknown[]>,
  fallbackValue: unknown,
  propertyValue: unknown,
  propertyName: string,
  element: Element,
) => {
  // Early return if the property value is one of the accetped values
  if (ACCEPTED_VAlUES.includes(propertyValue)) return;
  // Size value fallback
  element[propertyName] = fallbackValue;
  // Notify developer in the browser console
  console.warn(
    `[${element.tagName.toUpperCase()}] Please notice that "${propertyName}" should be one of ${ACCEPTED_VAlUES.join(
      '|',
    )}`,
  );
};
