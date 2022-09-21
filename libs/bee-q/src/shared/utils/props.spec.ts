import { validatePropValue } from './props';

describe('props - validatePropValue', () => {
  const originalConsole = { ...global.console };
  const el = document.createElement('div');
  const ACCEPTED_VAlUES = ['small', 'medium', 'large'] as const;

  beforeEach(() => {
    global.console.log = jest.fn();
    global.console.warn = jest.fn();
    global.console.error = jest.fn();
  });

  afterEach(() => {
    global.console = originalConsole;
  });

  it('should not warn if property is in array', () => {
    validatePropValue(ACCEPTED_VAlUES, 'small', 'small', 'size', el);

    expect(console.log).not.toHaveBeenCalled();
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
  });

  it('should warn that property is not correct', () => {
    validatePropValue(ACCEPTED_VAlUES, 'small', 'test', 'size', el);

    expect(console.log).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith('[DIV] Please notice that "size" should be one of small|medium|large');
    expect(console.error).not.toHaveBeenCalled();
  });
});
