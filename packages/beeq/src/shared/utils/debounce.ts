import { isNil } from './isNil';
import { setRafTimeout } from './setRafTimeout';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type TFunction = (...args: any[]) => unknown;

type TDebounceFnReturn<T> = T extends unknown[] ? (...params: T) => void : (param: T) => void;
export type TDebounce<T> = TDebounceFnReturn<T> & { cancel: () => void } extends infer U ? U : never;

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds have elapsed
 * since the last time the debounced function was invoked.
 *
 * @param {Function} func - The function to debounce.
 * @param {Number} wait - The number of milliseconds to delay.
 * @param {Boolean} immediate - If `true`, the function triggers immediately and then waits for the interval before being called again.
 * @return {Function} The new debounced function.
 */
export const debounce = <TFunc extends TFunction>(func: TFunc, wait = 0, immediate = false) => {
  let cancel: () => void | undefined;

  function debounceHandler(...args: Parameters<typeof func>) {
    cancel?.();

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this;

    function timeoutHandler(fn: TFunc, context: unknown, ...args: Parameters<typeof fn>) {
      fn.apply(context, args);
    }

    if (immediate && isNil(cancel)) {
      func.apply(context, args);
    }

    cancel = setRafTimeout(timeoutHandler, wait, func, context, ...args);
  }

  return Object.assign(debounceHandler, {
    cancel: () => {
      cancel?.();
    },
  });
};
