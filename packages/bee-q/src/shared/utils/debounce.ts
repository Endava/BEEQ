import { isNil } from './isNil';

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
  let timeout: number;

  function debounceHandler(...args: Parameters<typeof func>) {
    cancelAnimationFrame(timeout);

    const currentTime = performance.now();

    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const context = this;

    const handleFrameRequestCallback: FrameRequestCallback = (time) => {
      cancelAnimationFrame(timeout);

      const delta = time - currentTime;

      if (delta < wait) {
        timeout = requestAnimationFrame(handleFrameRequestCallback);
      } else {
        timeout = undefined;
        func.apply(context, args);
      }
    };

    if (immediate && isNil(timeout)) {
      func.apply(context, args);
    }

    timeout = requestAnimationFrame(handleFrameRequestCallback);
  }

  return Object.assign(debounceHandler, {
    cancel: () => {
      cancelAnimationFrame(timeout);
    },
  });
};
