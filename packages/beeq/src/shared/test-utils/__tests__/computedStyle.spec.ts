import { afterEach, describe, expect, it, vi } from '@stencil/vitest';

import { computedStyle } from '..';

describe(computedStyle.name, () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return element style', () => {
    vi.spyOn(document, 'querySelector').mockImplementationOnce(() => {
      const div = document.createElement('div');
      div.attachShadow({ mode: 'open' });
      return div;
    });
    vi.spyOn(globalThis, 'getComputedStyle').mockImplementationOnce(() => ({ width: '20px' }) as CSSStyleDeclaration);

    expect(computedStyle('bq-component')).toStrictEqual({
      width: '20px',
    });
  });

  it('should return shadow element style', () => {
    vi.spyOn(document, 'querySelector').mockImplementationOnce(() => {
      const div = document.createElement('div');
      const shadowRoot = div.attachShadow({ mode: 'open' });
      shadowRoot.innerHTML = `<div></div>`;
      return div;
    });
    vi.spyOn(globalThis, 'getComputedStyle').mockImplementationOnce(() => ({ width: '30px' }) as CSSStyleDeclaration);

    expect(computedStyle('bq-component >>> div')).toStrictEqual({
      width: '30px',
    });
  });

  it('should filter element style', () => {
    vi.spyOn(document, 'querySelector').mockImplementationOnce(() => {
      const div = document.createElement('div');
      div.attachShadow({ mode: 'open' });
      return div;
    });
    vi.spyOn(globalThis, 'getComputedStyle').mockImplementationOnce(
      () => ({ width: '20px', height: '30px' }) as CSSStyleDeclaration,
    );

    expect(computedStyle('bq-component', ['width'])).toStrictEqual({ width: '20px' });
  });

  it('should filter empty object if filter is []', () => {
    vi.spyOn(document, 'querySelector').mockImplementationOnce(() => {
      const div = document.createElement('div');
      div.attachShadow({ mode: 'open' });
      return div;
    });
    vi.spyOn(globalThis, 'getComputedStyle').mockImplementationOnce(
      () => ({ width: '20px', height: '30px' }) as CSSStyleDeclaration,
    );

    expect(computedStyle('bq-component', [])).toStrictEqual({});
  });

  it('should throw error if element is not found', () => {
    vi.spyOn(document, 'querySelector').mockImplementationOnce(() => null);

    expect(() => computedStyle('bq-component')).toThrow('Could not find element bq-component');
  });

  it('should throw error if element is not found in shadow dom', () => {
    vi.spyOn(document, 'querySelector').mockImplementationOnce(() => {
      const div = document.createElement('div');
      const shadowRoot = div.attachShadow({ mode: 'open' });
      shadowRoot.innerHTML = `<div></div>`;
      return div;
    });

    expect(() => computedStyle('bq-component >>> span')).toThrow('Could not find element span');
  });
});
