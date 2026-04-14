import { afterEach, beforeEach, describe, expect, it, vi } from '@stencil/vitest';

import { setProperties } from '..';

/** Minimal mock matching the subset of E2EPage used by setProperties */
interface MockPage {
  // biome-ignore lint/style/useNamingConvention: Mocking E2EPage interface properties
  $eval: ReturnType<typeof vi.fn>;
  waitForChanges: ReturnType<typeof vi.fn>;
}

describe(setProperties.name, () => {
  let mockPage: MockPage;
  let page: Parameters<typeof setProperties>[0];

  beforeEach(() => {
    mockPage = {
      // biome-ignore lint/style/useNamingConvention: Mocking E2EPage interface properties
      $eval: vi.fn(),
      waitForChanges: vi.fn().mockResolvedValue(undefined),
    };
    page = mockPage as unknown as Parameters<typeof setProperties>[0];
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('should set attributes', async () => {
    const element = {};

    mockPage.$eval.mockImplementationOnce((_: unknown, fn: (...args: unknown[]) => unknown, ...args: unknown[]) =>
      fn(element, ...args),
    );

    await setProperties(page, 'a', { href: 'test-href', id: 'test-id' });

    expect(element).toEqual({ href: 'test-href', id: 'test-id' });
  });

  it('should return attributes', async () => {
    const element = {};

    mockPage.$eval.mockImplementation((_: unknown, fn: (...args: unknown[]) => unknown, ...args: unknown[]) =>
      fn(element, ...args),
    );

    expect(await setProperties(page, 'div', { title: 'test-title', id: 'test-id' })).toEqual({
      title: 'test-title',
      id: 'test-id',
    });
  });
});
