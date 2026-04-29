import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import { sleep } from '../../test-utils/sleep';

beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});

describe(sleep.name, () => {
  it('should resolve after the specified number of milliseconds', async () => {
    let resolved = false;

    sleep(500).then(() => {
      resolved = true;
    });

    expect(resolved).toBe(false);

    await vi.advanceTimersByTimeAsync(500);

    expect(resolved).toBe(true);
  });

  it('should resolve immediately when ms is 0', async () => {
    let resolved = false;

    sleep(0).then(() => {
      resolved = true;
    });

    await vi.advanceTimersByTimeAsync(0);

    expect(resolved).toBe(true);
  });
});
