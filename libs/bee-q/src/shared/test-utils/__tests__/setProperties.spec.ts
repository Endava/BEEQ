import StencilCoreTesting, { E2EPage } from '@stencil/core/testing';
import { setProperties } from '..';

describe(setProperties.name, () => {
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

    // eslint-disable-next-line @typescript-eslint/ban-types
    (page.$eval as jest.Mock).mockImplementationOnce((_: unknown, fn: Function, ...args) => fn(element, ...args));

    await setProperties(page, 'a', { href: 'test-href', id: 'test-id' });

    expect(element).toEqual({ href: 'test-href', id: 'test-id' });
  });

  it('should return attributes', async () => {
    const element = {};

    const page = await StencilCoreTesting.newE2EPage();

    // eslint-disable-next-line @typescript-eslint/ban-types
    (page.$eval as jest.Mock).mockImplementation((_: unknown, fn: Function, ...args) => fn(element, ...args));

    expect(await setProperties(page, 'div', { title: 'test-title', id: 'test-id' })).toEqual({
      title: 'test-title',
      id: 'test-id',
    });
  });
});
