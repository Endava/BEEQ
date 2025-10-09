import StencilCoreTesting, { type E2EPage } from '@stencil/core/testing';

import { setProperties } from '..';

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
describe.skip(setProperties.name, () => {
  beforeEach(() => {
    jest
      .spyOn(StencilCoreTesting, 'newE2EPage')
      .mockImplementationOnce(() =>
        Promise.resolve({ $eval: jest.fn(), waitForChanges: () => Promise.resolve() } as unknown as E2EPage),
      );
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should set attributes', async () => {
    const element = {};

    const page = await StencilCoreTesting.newE2EPage();

    (page.$eval as jest.Mock).mockImplementationOnce(
      (_: unknown, fn: (...args: unknown[]) => unknown, ...args: unknown[]) => fn(element, ...args),
    );

    await setProperties(page, 'a', { href: 'test-href', id: 'test-id' });

    expect(element).toEqual({ href: 'test-href', id: 'test-id' });
  });

  it('should return attributes', async () => {
    const element = {};

    const page = await StencilCoreTesting.newE2EPage();

    (page.$eval as jest.Mock).mockImplementation(
      (_: unknown, fn: (...args: unknown[]) => unknown, ...args: unknown[]) => fn(element, ...args),
    );

    expect(await setProperties(page, 'div', { title: 'test-title', id: 'test-id' })).toEqual({
      title: 'test-title',
      id: 'test-id',
    });
  });
});
