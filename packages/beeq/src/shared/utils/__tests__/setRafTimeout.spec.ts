import { afterEach, beforeEach, describe, expect, it, vi } from '@stencil/vitest';

import { setRafTimeout } from '..';

describe(setRafTimeout.name, () => {
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
    vi.resetAllMocks();
    vi.useRealTimers();
  });

  it('should call the function after time pass', () => {
    const spy = vi.fn<(...args: string[]) => void>();

    setRafTimeout(spy, 250, 'test value');

    vi.advanceTimersByTime(251);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('test value');
  });

  it('should cancel the function call', () => {
    const spy = vi.fn<(...args: string[]) => void>();

    const cancel = setRafTimeout(spy, 250, 'test-value');

    vi.advanceTimersByTime(249);
    cancel();
    vi.advanceTimersByTime(250);

    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should use setTimeout if wait is 0', () => {
    vi.spyOn(globalThis, 'setTimeout');
    const spy = vi.fn<(...args: string[]) => void>();

    setRafTimeout(spy, 0, 'test value');

    vi.advanceTimersByTime(250);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('test value');
    expect(globalThis.setTimeout).toHaveBeenCalledTimes(1);
  });

  it('should cancel setTimeout if wait is 0', () => {
    vi.spyOn(globalThis, 'clearTimeout');
    const spy = vi.fn<(...args: string[]) => void>();

    const cancel = setRafTimeout(spy, 0, 'test value');

    cancel();

    vi.advanceTimersByTime(250);

    expect(spy).toHaveBeenCalledTimes(0);
    expect(globalThis.clearTimeout).toHaveBeenCalledTimes(1);
  });
});
