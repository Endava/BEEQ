import { describe, expect, it, vi } from '@stencil/vitest';

import { getColorCSSVariable } from '..';

describe('cssVariables - getColorCSSVariable()', () => {
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
});
