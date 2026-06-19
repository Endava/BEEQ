---
name: write-unit-tests
description: 'Write Vitest unit tests for BEEQ shared utilities. Use for: adding or fixing unit tests for helper functions, utilities, and pure logic in packages/beeq/src/shared/utils/. Follows AAA pattern, uses vi.fn()/vi.spyOn(), fake timers, and proper mock cleanup. Not for component E2E tests (use write-e2e-tests skill instead).'
argument-hint: 'Utility name or file path (e.g. "debounce" or packages/beeq/src/shared/utils/debounce.ts)'
---

# Write BEEQ Unit Tests

## When to Use

- Adding tests for a new utility in `packages/beeq/src/shared/utils/`
- Fixing failing unit tests after a utility change
- Increasing coverage for edge cases in an existing utility

> For component tests (props, events, slots, DOM), use the **write-e2e-tests** skill instead.

## File Location

```
packages/beeq/src/shared/utils/__tests__/<utility-name>.spec.ts
```

## Imports

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Import from the barrel — not the individual file
import { myUtility } from '..';
```

## Test Structure (AAA Pattern)

```ts
describe(myUtility.name, () => {
  // Arrange → Act → Assert for each case
  it('should <expected behavior>', () => {
    // Arrange
    const input = ...;

    // Act
    const result = myUtility(input);

    // Assert
    expect(result).toBe(expected);
  });
});
```

Name `describe` blocks after the function itself using `.name` (e.g. `describe(clamp.name, ...)`). This auto-updates if the function is renamed.

## Mocking

### Functions

```ts
const spy = vi.fn<(...args: string[]) => void>();
myUtility(spy);
expect(spy).toHaveBeenCalledTimes(1);
expect(spy).toHaveBeenCalledWith('expected-arg');
```

### Globals / browser APIs

```ts
beforeEach(() => {
  vi.spyOn(globalThis, 'requestAnimationFrame').mockImplementation((cb) => {
    return setTimeout(() => cb(performance.now()), 0) as unknown as number;
  });
});

afterEach(() => {
  vi.restoreAllMocks();
});
```

### Timers

```ts
beforeEach(() => {
  vi.useFakeTimers();
});

afterEach(() => {
  vi.restoreAllMocks();
  vi.useRealTimers();
});

it('should fire after delay', () => {
  const fn = debounce(spy, 250);
  fn();
  vi.advanceTimersByTime(251);
  expect(spy).toHaveBeenCalledTimes(1);
});
```

## Mock Cleanup Rules

- **Always** call `vi.restoreAllMocks()` in `afterEach`
- **Always** call `vi.useRealTimers()` in `afterEach` when fake timers were used
- Each test must be completely independent — no shared mutable state between tests

## Coverage Goals

For each utility, cover:

| Case | Example |
|---|---|
| Happy path | Valid input returns expected output |
| Edge cases | `null`, `undefined`, empty string, 0, empty array |
| Boundary values | Min/max of a range, single-element collections |
| Error conditions | Invalid input throws or returns fallback |
| Side effects | Callbacks called with correct args and count |

## Running Unit Tests

```bash
# Run all unit tests
pnpm exec nx run beeq:test

# Run tests for a specific file
pnpm exec nx run beeq:test -- <utility-name>.spec.ts

# Watch mode
pnpm exec nx run beeq:test -- <utility-name>.spec.ts --watch
```
