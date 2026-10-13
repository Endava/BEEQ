---
name: write-unit-tests
description: 'Write Vitest unit tests for BEEQ shared utilities under `packages/beeq/src/shared/`. Use when adding or fixing tests for helpers and pure logic. For component behavior use write-e2e-tests.'
argument-hint: 'Utility name or file path (e.g. "debounce" or packages/beeq/src/shared/utils/debounce.ts)'
metadata:
  internal: true
---

# Write BEEQ Unit Tests

Unit tests cover shared utilities only. For component tests (props, events, slots, DOM) use [write-e2e-tests](../write-e2e-tests/SKILL.md). General rules live in the [testing instructions](../../instructions/testing.instructions.md).

## Procedure

1. Read the utility and list its branches: happy path, edge cases (`null`, `undefined`, empty string, `0`, empty array), boundary values, error conditions and side effects (callbacks called with the right args and count).
2. Create `packages/beeq/src/shared/utils/__tests__/<utility-name>.spec.ts`.
3. Write one `it('should <expected behavior>')` per branch, in Arrange / Act / Assert order.
4. Run the file and fix failures.

Done when every branch from step 1 has a test and the file passes.

## Conventions

```ts
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

// Import from the barrel, not the individual file
import { myUtility } from '..';

describe(myUtility.name, () => {
  it('should <expected behavior>', () => {
    // Arrange, Act, Assert
  });
});
```

- Name the `describe` block with `fn.name` so it follows renames.
- Call `vi.restoreAllMocks()` in `afterEach`, and `vi.useRealTimers()` as well when the test used `vi.useFakeTimers()`.
- Keep every test independent; share no mutable state.

## Run

```bash
pnpm exec nx run beeq:test -- <utility-name>.spec.ts
```
