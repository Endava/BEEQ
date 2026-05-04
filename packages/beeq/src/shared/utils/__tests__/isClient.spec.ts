import { afterEach, describe, expect, it, vi } from 'vitest';

import { isClient } from '..';

describe(isClient.name, () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should return true when window and document are defined', () => {
    expect(isClient()).toBe(true);
  });

  it('should return false when window is undefined', () => {
    vi.stubGlobal('window', undefined);

    expect(isClient()).toBe(false);
  });

  it('should return false when document is undefined', () => {
    vi.stubGlobal('document', undefined);

    expect(isClient()).toBe(false);
  });
});
