import StencilCoreTesting, { E2EPage } from '@stencil/core/testing';
import { computedStyle } from '..';

describe(computedStyle.name, () => {
  beforeEach(() => {
    jest.spyOn(StencilCoreTesting, 'newE2EPage').mockImplementationOnce(() =>
      Promise.resolve({
        // eslint-disable-next-line @typescript-eslint/ban-types
        evaluate: (fn: Function, arg) => {
          return fn(arg);
        },
      } as E2EPage),
    );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should return element style', async () => {
    jest
      .spyOn(document, 'querySelector')
      .mockImplementationOnce(() => {
        const div = document.createElement('div');
        div.attachShadow({ mode: 'open' });
        return div;
      })
      .mockImplementationOnce(() => {
        const div = document.createElement('div');
        return div;
      });

    jest.spyOn(global, 'getComputedStyle').mockImplementationOnce(() => ({ width: '20px' } as CSSStyleDeclaration));

    const page = await StencilCoreTesting.newE2EPage();

    expect(await computedStyle(page, 'bq-component')).toStrictEqual({ width: '20px' });
    expect(global.getComputedStyle).toHaveBeenCalledTimes(1);
    expect(document.querySelector).toHaveBeenCalledTimes(1);
  });

  it('should return shadow element style', async () => {
    jest.spyOn(document, 'querySelector').mockImplementationOnce(() => {
      const div = document.createElement('div');

      const shadowRoot = div.attachShadow({ mode: 'open' });
      shadowRoot.innerHTML = `<div></div>`;

      return div;
    });

    jest.spyOn(global, 'getComputedStyle').mockImplementationOnce(() => ({ width: '30px' } as CSSStyleDeclaration));

    const page = await StencilCoreTesting.newE2EPage();

    expect(await computedStyle(page, 'bq-component >>> div')).toStrictEqual({ width: '30px' });
    expect(global.getComputedStyle).toHaveBeenCalledTimes(1);
    expect(document.querySelector).toHaveBeenCalledTimes(1);
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
