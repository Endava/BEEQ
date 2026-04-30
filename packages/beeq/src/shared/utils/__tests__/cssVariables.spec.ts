import { afterEach, describe, expect, it, vi } from 'vitest';

import { getColorCSSVariable, getCSSVariableValue } from '..';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('cssVariables - getColorCSSVariable()', () => {
  it('should return undefined in a non-client environment', () => {
    vi.stubGlobal('window', undefined);

    expect(getColorCSSVariable('primary')).toBeUndefined();

    vi.unstubAllGlobals();
  });

  it('should return the correct CSS Custom Property string', () => {
    vi.spyOn(globalThis, 'getComputedStyle').mockImplementation(
      () =>
        ({
          getPropertyValue: (prop: string) => {
            if (prop === '--bq-ui--primary') return '#fbfbfc';
            return '';
          },
        }) as CSSStyleDeclaration,
    );

    const token = 'ui--primary';
    const result = `var(--bq-${token})`;

    expect(getColorCSSVariable(token)).toEqual(result);
  });

  it('should return undefined when the CSS variable has no value', () => {
    vi.spyOn(globalThis, 'getComputedStyle').mockImplementation(
      () => ({ getPropertyValue: () => '' }) as unknown as CSSStyleDeclaration,
    );

    expect(getColorCSSVariable('nonexistent--token')).toBeUndefined();
  });
});

describe('cssVariables - getCSSVariableValue()', () => {
  it('should return the computed value of a CSS custom property', () => {
    const element = document.createElement('div');
    vi.spyOn(globalThis, 'getComputedStyle').mockImplementation(
      () => ({ getPropertyValue: (prop: string) => (prop === '--my-var' ? '  16px  ' : '') }) as CSSStyleDeclaration,
    );

    expect(getCSSVariableValue('my-var', element)).toBe('16px');
  });

  it('should return an empty string when the CSS variable is not defined', () => {
    const element = document.createElement('div');
    vi.spyOn(globalThis, 'getComputedStyle').mockImplementation(
      () => ({ getPropertyValue: () => '' }) as unknown as CSSStyleDeclaration,
    );

    expect(getCSSVariableValue('undefined--var', element)).toBe('');
  });
});
