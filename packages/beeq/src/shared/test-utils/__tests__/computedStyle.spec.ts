import { afterEach, describe, expect, it, vi } from '@stencil/vitest';

import { computedStyle } from '..';

/** Minimal mock matching the subset of E2EPage used by computedStyle */
interface MockPage {
  evaluate: (fn: (...args: unknown[]) => unknown, ...args: unknown[]) => unknown;
}

describe(computedStyle.name, () => {
  // Create a minimal page mock that mirrors what the tests were doing:
  // page.evaluate(fn, ...args) just calls fn(...args) synchronously
  const mockPage: MockPage = {
    evaluate: (fn: (...args: unknown[]) => unknown, ...args: unknown[]) => fn(...args),
  };

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return element style', async () => {
    vi.spyOn(document, 'querySelector').mockImplementationOnce(() => {
      const div = document.createElement('div');
      div.attachShadow({ mode: 'open' });
      return div;
    });
    vi.spyOn(globalThis, 'getComputedStyle').mockImplementationOnce(() => ({ width: '20px' }) as CSSStyleDeclaration);

    expect(await computedStyle(mockPage as Parameters<typeof computedStyle>[0], 'bq-component')).toStrictEqual({
      width: '20px',
    });
  });

  it('should return shadow element style', async () => {
    vi.spyOn(document, 'querySelector').mockImplementationOnce(() => {
      const div = document.createElement('div');
      const shadowRoot = div.attachShadow({ mode: 'open' });
      shadowRoot.innerHTML = `<div></div>`;
      return div;
    });
    vi.spyOn(globalThis, 'getComputedStyle').mockImplementationOnce(() => ({ width: '30px' }) as CSSStyleDeclaration);

    expect(await computedStyle(mockPage as Parameters<typeof computedStyle>[0], 'bq-component >>> div')).toStrictEqual({
      width: '30px',
    });
  });

  it('should filter element style', async () => {
    vi.spyOn(document, 'querySelector').mockImplementationOnce(() => {
      const div = document.createElement('div');
      div.attachShadow({ mode: 'open' });
      return div;
    });
    vi.spyOn(globalThis, 'getComputedStyle').mockImplementationOnce(
      () => ({ width: '20px', height: '30px' }) as CSSStyleDeclaration,
    );

    expect(
      await computedStyle(mockPage as Parameters<typeof computedStyle>[0], 'bq-component', ['width']),
    ).toStrictEqual({ width: '20px' });
  });

  it('should filter empty object if filter is []', async () => {
    vi.spyOn(document, 'querySelector').mockImplementationOnce(() => {
      const div = document.createElement('div');
      div.attachShadow({ mode: 'open' });
      return div;
    });
    vi.spyOn(globalThis, 'getComputedStyle').mockImplementationOnce(
      () => ({ width: '20px', height: '30px' }) as CSSStyleDeclaration,
    );

    expect(await computedStyle(mockPage as Parameters<typeof computedStyle>[0], 'bq-component', [])).toStrictEqual({});
  });

  it('should throw error if element is not found', async () => {
    vi.spyOn(document, 'querySelector').mockImplementationOnce(() => null);

    expect(() => computedStyle(mockPage as Parameters<typeof computedStyle>[0], 'bq-component')).toThrow(
      'Could not find element bq-component',
    );
  });

  it('should throw error if element is not found in shadow dom', async () => {
    vi.spyOn(document, 'querySelector').mockImplementationOnce(() => {
      const div = document.createElement('div');
      const shadowRoot = div.attachShadow({ mode: 'open' });
      shadowRoot.innerHTML = `<div></div>`;
      return div;
    });

    expect(() => computedStyle(mockPage as Parameters<typeof computedStyle>[0], 'bq-component >>> span')).toThrow(
      'Could not find element  span',
    );
  });
});
