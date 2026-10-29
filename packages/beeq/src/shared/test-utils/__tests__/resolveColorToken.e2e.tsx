import { afterEach, beforeEach, describe, expect, it } from 'vitest';

import { resolveColorToken } from '..';

const inserted: HTMLElement[] = [];
let originalStyle: string | null;

beforeEach(() => {
  originalStyle = document.documentElement.getAttribute('style');
});

afterEach(() => {
  if (originalStyle === null) document.documentElement.removeAttribute('style');
  else document.documentElement.setAttribute('style', originalStyle);
  for (const node of inserted.splice(0)) node.remove();
});

describe('resolveColorToken browser resolution', () => {
  it('should resolve a root token and remove its probe', () => {
    document.documentElement.style.setProperty('--parity-fixture', '#123456');
    const count = document.documentElement.childElementCount;
    expect(resolveColorToken('--parity-fixture')).toBe('rgb(18, 52, 86)');
    expect(document.documentElement.childElementCount).toBe(count);
  });

  it('should resolve a nested token independently of the root and follow scoped references', () => {
    document.documentElement.style.setProperty('--parity-fixture', '#123456');
    const scope = document.createElement('div');
    scope.style.setProperty('--parity-fixture', 'var(--parity-local)');
    scope.style.setProperty('--parity-local', '#654321');
    document.body.appendChild(scope);
    inserted.push(scope);
    expect(resolveColorToken('--parity-fixture')).toBe('rgb(18, 52, 86)');
    expect(resolveColorToken('--parity-fixture', scope)).toBe('rgb(101, 67, 33)');
    expect(scope.childElementCount).toBe(0);
  });

  it.each(['missing', 'unresolved', 'cyclic', 'sentinel', 'invalid'])('should reject a %s token', (kind) => {
    const scope = document.createElement('div');
    if (kind === 'unresolved') scope.style.setProperty('--parity-value', 'var(--parity-missing)');
    if (kind === 'cyclic') scope.style.setProperty('--parity-value', 'var(--parity-value)');
    if (kind === 'sentinel') scope.style.setProperty('--parity-value', 'rgb(1, 2, 3)');
    if (kind === 'invalid') scope.style.setProperty('--parity-value', '12px');
    document.body.appendChild(scope);
    inserted.push(scope);
    expect(() => resolveColorToken('--parity-value', scope)).toThrow(/colour token/);
    expect(scope.childElementCount).toBe(0);
  });
});
