import { setRafTimeout } from '..';

describe(setRafTimeout.name, () => {
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

  it('should call the function after time pass', () => {
    const spy = jest.fn<void, string[]>();

    setRafTimeout(spy, 250, 'test value');

    jest.advanceTimersByTime(251);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('test value');
  });

  it('should cancel the function call', () => {
    const spy = jest.fn<void, string[]>();

    const cancel = setRafTimeout(spy, 250, 'test-value');

    jest.advanceTimersByTime(249);
    cancel();
    jest.advanceTimersByTime(250);

    expect(spy).toHaveBeenCalledTimes(0);
  });

  it('should use setTimeout if wait is 0', () => {
    jest.spyOn(globalThis, 'setTimeout');
    const spy = jest.fn<void, string[]>();

    setRafTimeout(spy, 0, 'test value');

    jest.advanceTimersByTime(250);

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith('test value');
    expect(globalThis.setTimeout as unknown as jest.SpyInstance).toHaveBeenCalledTimes(1);

    (globalThis.setTimeout as unknown as jest.SpyInstance).mockRestore();
  });

  it('should cancel setTimeout if wait is 0', () => {
    jest.spyOn(globalThis, 'setTimeout');
    const spy = jest.fn<void, string[]>();

    const cancel = setRafTimeout(spy, 0, 'test value');

    cancel();

    jest.advanceTimersByTime(250);

    expect(spy).toHaveBeenCalledTimes(0);
    expect(globalThis.setTimeout as unknown as jest.SpyInstance).toHaveBeenCalledTimes(1);

    (globalThis.setTimeout as unknown as jest.SpyInstance).mockRestore();
  });
});
