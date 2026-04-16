import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { debounce } from '..';

describe(debounce.name, () => {
  beforeEach(() => {
    vi.useFakeTimers();

    vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((callback) => {
      return setTimeout(() => {
        callback(performance.now());
      }, 0) as unknown as number;
    });

    vi.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation((timer) => {
      clearTimeout(timer);
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('should call the function only after timer pass', () => {
    const spy = vi.fn<(...args: string[]) => void>();

    const fn = debounce(spy, 250);

    for (let i = 0; i < 2; i += 1) {
      fn(`${i}`);
      vi.advanceTimersByTime(249);
    }

    fn('test value');
    vi.advanceTimersByTime(251);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('test value');
  });

  it('should cancel the function call', () => {
    const spy = vi.fn<(...args: string[]) => void>();

    const fn = debounce(spy, 250);

    fn('test-value');

    vi.advanceTimersByTime(249);
    fn.cancel();
    vi.advanceTimersByTime(250);

    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should call the function immediate', () => {
    const spy = vi.fn<(...args: string[]) => void>();

    const fn = debounce(spy, 250, true);

    for (let i = 0; i < 2; i += 1) {
      fn(`${i}`);
      vi.advanceTimersByTime(249);
    }

    fn('test value');
    vi.advanceTimersByTime(250);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenNthCalledWith(1, '0');
    expect(spy).toHaveBeenLastCalledWith('test value');
  });

  it('should not fail if cancel is called but the function is not initialized yet', () => {
    const spy = vi.fn<(...args: string[]) => void>();

    const fn = debounce(spy, 250, true);

    expect(fn.cancel).not.toThrow();
    expect(fn.cancel).not.toThrowError(new TypeError('cancel is not a function'));
  });
});
