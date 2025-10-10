import StencilCoreTesting, { type E2EPage } from '@stencil/core/testing';

import { computedStyle } from '..';

/**
 * !Note:
 * This test suite is skipped because we patched the @nxext/stencil package
 * in order to make it work with the latest version of Stencil: https://github.com/nxext/nx-extensions/issues/1086
 *
 * Applying the patch proposed in this PR: https://github.com/nxext/nx-extensions/pull/1088
 * seems to break the StencilCoreTesting and the following error is thrown:
 *
 * Cannot use spyOn on a primitive value; undefined given
 */
describe.skip(computedStyle.name, () => {
  beforeEach(() => {
    jest.spyOn(StencilCoreTesting, 'newE2EPage').mockImplementationOnce(() =>
      Promise.resolve({
        evaluate: (fn: (...args: unknown[]) => unknown, ...arg: unknown[]) => {
          return fn(...arg);
        },
      } as E2EPage),
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return element style', async () => {
    jest.spyOn(document, 'querySelector').mockImplementationOnce(() => {
      const div = document.createElement('div');
      div.attachShadow({ mode: 'open' });
      return div;
    });

    jest.spyOn(global, 'getComputedStyle').mockImplementationOnce(() => ({ width: '20px' }) as CSSStyleDeclaration);

    const page = await StencilCoreTesting.newE2EPage();

    expect(await computedStyle(page, 'bq-component')).toStrictEqual({ width: '20px' });
  });

  it('should return shadow element style', async () => {
    jest.spyOn(document, 'querySelector').mockImplementationOnce(() => {
      const div = document.createElement('div');

      const shadowRoot = div.attachShadow({ mode: 'open' });
      shadowRoot.innerHTML = `<div></div>`;

      return div;
    });

    jest.spyOn(global, 'getComputedStyle').mockImplementationOnce(() => ({ width: '30px' }) as CSSStyleDeclaration);

    const page = await StencilCoreTesting.newE2EPage();

    expect(await computedStyle(page, 'bq-component >>> div')).toStrictEqual({ width: '30px' });
  });

  it('should filter element style', async () => {
    jest.spyOn(document, 'querySelector').mockImplementationOnce(() => {
      const div = document.createElement('div');
      div.attachShadow({ mode: 'open' });
      return div;
    });

    jest
      .spyOn(global, 'getComputedStyle')
      .mockImplementationOnce(() => ({ width: '20px', height: '30px' }) as CSSStyleDeclaration);

    const page = await StencilCoreTesting.newE2EPage();

    expect(await computedStyle(page, 'bq-component', ['width'])).toStrictEqual({ width: '20px' });
  });

  it('should filter empty object if filter is []', async () => {
    jest.spyOn(document, 'querySelector').mockImplementationOnce(() => {
      const div = document.createElement('div');
      div.attachShadow({ mode: 'open' });
      return div;
    });

    jest
      .spyOn(global, 'getComputedStyle')
      .mockImplementationOnce(() => ({ width: '20px', height: '30px' }) as CSSStyleDeclaration);

    const page = await StencilCoreTesting.newE2EPage();

    expect(await computedStyle(page, 'bq-component', [])).toStrictEqual({});
  });

  it('should throw error if element is not found', async () => {
    jest.spyOn(document, 'querySelector').mockImplementationOnce(() => {
      return null;
    });

    const page = await StencilCoreTesting.newE2EPage();
    expect(() => computedStyle(page, 'bq-component')).toThrow('Could not find element bq-component');
  });

  it('should throw error if element is not found in shadow dom', async () => {
    jest.spyOn(document, 'querySelector').mockImplementationOnce(() => {
      const div = document.createElement('div');

      const shadowRoot = div.attachShadow({ mode: 'open' });
      shadowRoot.innerHTML = `<div></div>`;

      return div;
    });

    const page = await StencilCoreTesting.newE2EPage();
    expect(() => computedStyle(page, 'bq-component >>> span')).toThrow('Could not find element  span');
  });
});
