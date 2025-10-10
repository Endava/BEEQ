import type { E2EPage } from '@stencil/core/testing';

import { setProperties } from '..';

describe(setProperties.name, () => {
  let mockPage: E2EPage;

  beforeEach(() => {
    mockPage = {
      // biome-ignore lint/style/useNamingConvention: Mocking E2EPage interface properties
      $eval: jest.fn(),
      waitForChanges: jest.fn().mockResolvedValue(undefined),
    } as unknown as E2EPage;
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should set attributes', async () => {
    const element = {};

    (mockPage.$eval as jest.Mock).mockImplementationOnce(
      (_: unknown, fn: (...args: unknown[]) => unknown, ...args: unknown[]) => fn(element, ...args),
    );

    await setProperties(mockPage, 'a', { href: 'test-href', id: 'test-id' });

    expect(element).toEqual({ href: 'test-href', id: 'test-id' });
  });

  it('should return attributes', async () => {
    const element = {};

    (mockPage.$eval as jest.Mock).mockImplementation(
      (_: unknown, fn: (...args: unknown[]) => unknown, ...args: unknown[]) => fn(element, ...args),
    );

    expect(await setProperties(mockPage, 'div', { title: 'test-title', id: 'test-id' })).toEqual({
      title: 'test-title',
      id: 'test-id',
    });
  });
});
