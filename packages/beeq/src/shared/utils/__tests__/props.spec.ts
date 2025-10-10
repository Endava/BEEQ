import { validatePropValue } from '..';

const ACCEPTED_VALUES = ['small', 'medium', 'large'] as const;

interface ICustomElement extends Element {
  size: (typeof ACCEPTED_VALUES)[number];
}

describe('props - validatePropValue', () => {
  const originalConsole = { ...global.console };
  const el = document.createElement('div') as unknown as ICustomElement;

  beforeEach(() => {
    global.console.log = jest.fn();
    global.console.warn = jest.fn();
    global.console.error = jest.fn();
    el.size = 'medium';
  });

  afterEach(() => {
    global.console = originalConsole;
  });

  it('should not warn if property is in array', () => {
    validatePropValue(ACCEPTED_VALUES, 'small', el, 'size');

    expect(console.log).not.toHaveBeenCalled();
    expect(console.warn).not.toHaveBeenCalled();
    expect(console.error).not.toHaveBeenCalled();
    expect(el.size).toBe('medium');
  });

  it('should warn that property is not correct', () => {
    // @ts-expect-error: Type '"test"' is not assignable to type '"small" | "medium" | "large"'
    el.size = 'test';
    validatePropValue(ACCEPTED_VALUES, 'small', el, 'size');

    expect(console.log).not.toHaveBeenCalled();
    expect(console.warn).toHaveBeenCalledTimes(1);
    expect(console.warn).toHaveBeenCalledWith('[DIV] Please notice that "size" should be one of small|medium|large');
    expect(console.error).not.toHaveBeenCalled();
    expect(el.size).toBe('small');
  });
});
