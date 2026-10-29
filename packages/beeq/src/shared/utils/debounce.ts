import { isNil } from './isNil';
import { setRafTimeout } from './setRafTimeout';

export type TFunction = (...args: unknown[]) => unknown;

type TDebounceFnReturn<T> = T extends unknown[] ? (...params: T) => void : (param: T) => void;
export type TDebounce<T> = TDebounceFnReturn<T> & { cancel: () => void } extends infer U ? U : never;

/**
 * Creates a debounced function that delays invoking func until after wait milliseconds have elapsed
 * since the last time the debounced function was invoked.
 *
 * @param {Function} func - The function to debounce.
 * @param {Number} wait - The number of milliseconds to delay.
 * @param {Boolean} immediate - If `true`, the function triggers immediately on the first call of each burst. It's
 * called again after the wait only if the debounced function was called again during it (like lodash's
 * `{ leading: true, trailing: true }`), so a single call invokes it once.
 * @return {Function} The new debounced function.
 */
export const debounce = <TFunc extends TFunction>(func: TFunc, wait = 0, immediate = false) => {
  let cancel: (() => void) | undefined;

  function debounceHandler(...args: Parameters<typeof func>) {
    cancel?.();

    // We're doing this on purpose to capture and preserve the `this` context
    // biome-ignore lint/complexity/noUselessThisAlias: <see above>
    const context = this;

    // `cancel` is only set while a call is pending, so a nil value means a new burst starts here
    const callNow = immediate && isNil(cancel);

    function timeoutHandler(fn: TFunc, context: unknown, ...args: Parameters<typeof fn>) {
      cancel = undefined;
      // The leading call already ran with these arguments
      if (callNow) return;

      fn.apply(context, args);
    }

    cancel = setRafTimeout(timeoutHandler, wait, func, context, ...args);

    if (callNow) {
      func.apply(context, args);
    }
  }

  return Object.assign(debounceHandler, {
    cancel: () => {
      cancel?.();
      cancel = undefined;
    },
  });
};
