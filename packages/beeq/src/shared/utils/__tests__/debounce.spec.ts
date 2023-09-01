import { debounce } from '..';

describe(debounce.name, () => {
  beforeEach(() => {
    jest.useFakeTimers();

    jest.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((callback) => {
      return setTimeout(() => {
        callback(performance.now());
      }, 0) as unknown as number;
    });

    jest.spyOn(globalThis, 'cancelAnimationFrame').mockImplementation((timer) => {
      clearTimeout(timer);
    });
  });

  afterEach(() => {
    (globalThis.requestAnimationFrame as unknown as jest.SpyInstance).mockRestore();
    (globalThis.cancelAnimationFrame as unknown as jest.SpyInstance).mockRestore();
    jest.useRealTimers();
  });

  it('should call the function only after timer pass', () => {
    const spy = jest.fn<void, string[]>();

    const fn = debounce(spy, 250);

    for (let i = 0; i < 2; i += 1) {
      fn(`${i}`);
      jest.advanceTimersByTime(249);
    }

    fn('test value');
    jest.advanceTimersByTime(251);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('test value');
  });

  it('should cancel the function call', () => {
    const spy = jest.fn<void, string[]>();

    const fn = debounce(spy, 250);

    fn('test-value');

    jest.advanceTimersByTime(249);
    fn.cancel();
    jest.advanceTimersByTime(250);

    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should call the function immediate', () => {
    const spy = jest.fn<void, string[]>();

    const fn = debounce(spy, 250, true);

    for (let i = 0; i < 2; i += 1) {
      fn(`${i}`);
      jest.advanceTimersByTime(249);
    }

    fn('test value');
    jest.advanceTimersByTime(250);

    expect(spy).toHaveBeenCalledTimes(2);
    expect(spy).toHaveBeenNthCalledWith(1, '0');
    expect(spy).toHaveBeenLastCalledWith('test value');
  });

  it('should not fail if cancel is called but the function is not initialised yet', () => {
    const spy = jest.fn<void, string[]>();

    const fn = debounce(spy, 250, true);

    expect(fn.cancel).not.toThrow();
    expect(fn.cancel).not.toThrowError(new TypeError('cancel is not a function'));
  });
});
