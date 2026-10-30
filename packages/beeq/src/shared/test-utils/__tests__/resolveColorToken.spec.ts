import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { resolveColorToken } from '..';

beforeEach(() => vi.stubGlobal('CSS', { supports: vi.fn(() => true) }));
afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe(resolveColorToken.name, () => {
  it('should reject a defined non-colour rather than return an inherited colour', () => {
    const scope = document.createElement('div');
    vi.mocked(CSS.supports).mockReturnValue(false);
    vi.spyOn(globalThis, 'getComputedStyle').mockReturnValue({
      getPropertyValue: () => '12px',
    } as unknown as CSSStyleDeclaration);

    expect(() => resolveColorToken('--fixture', scope)).toThrow('Invalid colour token --fixture: 12px');
    expect(scope.childElementCount).toBe(0);
  });

  it('should reject an empty token before inserting a probe', () => {
    const scope = document.createElement('div');
    vi.spyOn(globalThis, 'getComputedStyle').mockReturnValue({
      getPropertyValue: () => '  ',
    } as unknown as CSSStyleDeclaration);

    expect(() => resolveColorToken('--missing', scope)).toThrow('Missing or unresolved colour token --missing');
    expect(scope.childElementCount).toBe(0);
  });

  it.each([undefined, 'nested'] as const)('should resolve in the requested scope (%s) and remove the probe', (kind) => {
    const scope = kind ? document.createElement('div') : document.documentElement;
    const before = scope.childElementCount;
    const getStyle = vi.spyOn(globalThis, 'getComputedStyle');
    getStyle.mockImplementation((element) => {
      if (element === scope) return { getPropertyValue: () => '#112233' } as unknown as CSSStyleDeclaration;
      expect(element.parentElement).toBe(scope);
      expect((element as HTMLElement).style.color).toContain('var(--fixture');
      return { color: 'rgb(17, 34, 51)' } as CSSStyleDeclaration;
    });

    expect(resolveColorToken('--fixture', kind ? scope : undefined)).toBe('rgb(17, 34, 51)');
    expect(scope.childElementCount).toBe(before);
  });

  it.each(['', 'rgb(1, 2, 3)'])('should reject an unresolved probe colour (%s) and remove the probe', (color) => {
    const scope = document.createElement('div');
    vi.spyOn(globalThis, 'getComputedStyle')
      .mockReturnValueOnce({ getPropertyValue: () => 'var(--unknown)' } as unknown as CSSStyleDeclaration)
      .mockReturnValueOnce({ color } as CSSStyleDeclaration);

    expect(() => resolveColorToken('--fixture', scope)).toThrow('Unresolved colour token --fixture');
    expect(scope.childElementCount).toBe(0);
  });

  it('should remove the probe even when reading its style throws', () => {
    const scope = document.createElement('div');
    vi.spyOn(globalThis, 'getComputedStyle')
      .mockReturnValueOnce({ getPropertyValue: () => '#112233' } as unknown as CSSStyleDeclaration)
      .mockImplementationOnce(() => {
        throw new Error('style read failed');
      });

    expect(() => resolveColorToken('--fixture', scope)).toThrow('style read failed');
    expect(scope.childElementCount).toBe(0);
  });
});
