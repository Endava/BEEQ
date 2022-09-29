import { isDefined, isNil } from '.';

type TCollection = Map<unknown, unknown> | Array<unknown> | Record<string, unknown> | Set<unknown> | null | undefined;

/**
 * Check if the value is an empty array, object, set, map
 * @param value the value to be checked
 * @returns {boolean} true if value is empty
 */
export const isEmpty = <T extends TCollection>(value: T): boolean => {
  if (isNil(value)) {
    return true;
  } else if ('size' in value) {
    return !isDefined(value.size);
  } else {
    return !isDefined(Object.values(value).length);
  }
};
