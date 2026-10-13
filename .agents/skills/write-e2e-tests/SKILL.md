---
name: write-e2e-tests
description: 'Write or fix e2e tests for a `bq-*` component with `@stencil/vitest` in browser mode, covering props, slots, events, methods, keyboard, accessibility attributes and CSS. Use when adding coverage or fixing failing e2e tests. For shared utilities use write-unit-tests.'
argument-hint: 'Component name (e.g. "bq-button") or path to the component tsx file'
metadata:
  internal: true
---

# Write BEEQ E2E Tests

## When to Use

- Adding E2E tests for a new or existing `bq-*` component
- Fixing failing E2E tests after a component change
- Increasing coverage for untested props, events, or interactions

## Before You Start

1. Read the full [testing instructions](../../instructions/testing.instructions.md)
2. Read the component's `.tsx` file to understand all `@Prop()`, `@Event()`, `@Method()`, and `@Listen()` members
3. Check an existing well-tested file for patterns, e.g. `packages/beeq/src/components/button/__tests__/bq-button.e2e.tsx`

## Procedure

1. Create `packages/beeq/src/components/<name>/__tests__/bq-<name>.e2e.tsx` (see the testing instructions for location, imports and conventions).
2. Start with the baseline tests (`should render`, `should have shadow root`).
3. Add at least one test for each coverage category that applies to the component, as listed in the testing instructions: props, slots, events, methods, keyboard, state, accessibility and CSS.
4. Follow the conventions in the testing instructions for casting, `setProps`, async stability, attribute matchers and mock cleanup.
5. Run the tests (below) and fix failures before finishing.

## Running the Tests

```bash
# Run all e2e tests
pnpm exec nx run beeq:e2e

# Run tests for a specific file
pnpm exec nx run beeq:e2e -- bq-<component>.e2e.tsx

# Watch mode
pnpm exec nx run beeq:e2e -- bq-<component>.e2e.tsx --watch
```
