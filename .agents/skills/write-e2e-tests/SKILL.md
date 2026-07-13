---
name: write-e2e-tests
description: 'Write E2E tests for BEEQ StencilJS components using @stencil/vitest in browser mode (Playwright/Chromium). Use for: adding or fixing E2E tests, covering props, events, slots, methods, keyboard interactions, accessibility attributes, and CSS custom properties for bq-* components. Files live at packages/beeq/src/components/<name>/__tests__/bq-<name>.e2e.tsx.'
argument-hint: 'Component name (e.g. "bq-button") or path to the component tsx file'
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

## File Location & Extension

```
packages/beeq/src/components/<component-name>/__tests__/bq-<component-name>.e2e.tsx
```

The `.e2e.tsx` extension is **required** — JSX is needed even when no explicit JSX calls appear.

## Imports

Use only what the test actually needs:

```tsx
import { h } from '@stencil/core'; // always keep — required for JSX

// Core test utilities
import { afterEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';
import { userEvent } from 'vitest/browser'; // only for keyboard/mouse interactions

// BEEQ shared helpers
import { computedStyle } from '../../../shared/test-utils/computedStyle';  // CSS assertions
import { getTextContent } from '../../../shared/utils/slot';               // slot text assertions
```

or check what other utils are available in `packages/beeq/src/shared/test-utils/` and `packages/beeq/src/shared/utils/` and import as needed.

## Required Baseline Tests

Every component file **must** start with:

```tsx
describe('bq-<component>', () => {
  it('should render', async () => {
    const { root } = await render(<bq-component />);
    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-component />);
    expect(root).toHaveShadowRoot(); // ✅ always toHaveShadowRoot(), never .shadowRoot !== null
  });
```

## Coverage Checklist

Write at least one test for each category that applies to the component:

| Category | What to test |
|---|---|
| Props | Each `@Prop()` is reflected as an attribute (`toEqualAttribute`) |
| Slots | Default and named slots render expected content (`getTextContent`) |
| Events | Action triggers the event; `vi.fn()` spy counts invocations |
| Methods | Public `@Method()` produces expected side-effects |
| Keyboard | Tab, Enter, Space, Arrow keys trigger correct behavior (`userEvent.keyboard`) |
| State | Interactive state transitions: checked, disabled, expanded, loading |
| Accessibility | `aria-*` attributes present and correct |
| CSS | Critical custom properties computed correctly (`computedStyle`) |

## Shadow DOM Helpers

Define typed accessors **outside** the `describe` block:

```tsx
const getInput = (el: HTMLBqCheckboxElement) =>
  el.shadowRoot?.querySelector<HTMLInputElement>('[part="input"]');
const getBase = (el: HTMLBqCheckboxElement) =>
  el.shadowRoot?.querySelector<HTMLElement>('[part="base"]');
```

## Element Casting

Always cast `root` before accessing typed properties or passing to typed helpers:

```tsx
// ✅ correct
const bqButton = root as HTMLBqButtonElement;
const btn = getButtonElement(bqButton);

// ❌ wrong — root is HTMLElement, not the concrete type
const btn = getButtonElement(root);
```

Cast `querySelector` results with a generic parameter:

```tsx
// ✅ correct
const input = bqToggle.shadowRoot?.querySelector<HTMLInputElement>('input');

// ❌ wrong — returns Element, not HTMLInputElement
const input = bqToggle.shadowRoot?.querySelector('input') as HTMLInputElement;
```

## Updating Props

Prefer `setProps` for re-rendering; fall back to direct property + `waitForChanges`:

```tsx
// ✅ preferred
const { root, setProps } = await render(<bq-drawer />);
await setProps({ open: true });

// ✅ also correct
const { root, waitForChanges } = await render(<bq-drawer />);
(root as HTMLBqDrawerElement).open = true;
await waitForChanges();
```

## Async Stability

```tsx
// After async operations (icon load, animation, slot change):
await waitForStable(root);

// After setting an attribute:
root.setAttribute('name', 'check');
await waitForChanges();
await waitForStable(root);
```

## Attribute Assertions

| Goal | Matcher |
|---|---|
| Attribute present | `expect(el).toHaveAttribute('attr')` |
| Attribute + value | `expect(el).toEqualAttribute('attr', value)` — **not** `toHaveAttribute` with 2 args |
| Attribute absent | `expect(el).not.toHaveAttribute('attr')` |
| CSS class present | `expect(el).toHaveClass('class-name')` |

## Mock Cleanup

Always restore mocks:

```tsx
afterEach(() => {
  vi.restoreAllMocks();
});
```

## Running the Tests

```bash
# Run all unit tests
pnpm exec nx run beeq:e2e

# Run tests for a specific file
pnpm exec nx run beeq:e2e -- bq-<component>.e2e.tsx

# Watch mode
pnpm exec nx run beeq:e2e -- bq-<component>.e2e.tsx --watch
```
