---
description: Ensure all utilities and components have comprehensive unit and e2e tests following best practices for organization, isolation, and maintainability.
applyTo: packages/beeq/src/**/*.spec.ts,packages/beeq/src/components/**/__tests__/*.e2e.tsx
---

# Testing

## Unit Testing

- Write unit tests for all utility functions under `packages/beeq/src/shared/`
- Follow the AAA pattern (Arrange, Act, Assert)
- Use proper test isolation — each test must be independent and not rely on state from other tests
- Use `vi.fn()` and `vi.spyOn()` for mocking; always restore mocks with `afterEach(() => vi.restoreAllMocks())`
- Keep test data minimal and focused on the behavior being tested

## E2E Testing

E2E tests run in **browser mode** (Playwright/Chromium) using `@stencil/vitest`. Every e2e test file must:

- Be located at `packages/beeq/src/components/<component-name>/__tests__/bq-<component-name>.e2e.tsx`
- Use the `.e2e.tsx` extension (JSX is required even without explicit JSX calls)

### Imports

```tsx
import { h } from '@stencil/core'; // required for JSX — always keep, even if linter warns it's unused
import { afterEach, describe, expect, it, render, vi, waitForStable } from '@stencil/vitest';
import { userEvent } from 'vitest/browser'; // for keyboard/mouse interactions

import { computedStyle } from '../../../shared/test-utils/computedStyle';   // for CSS assertions
import { getTextContent } from '../../../shared/utils/slot';                 // for slot text assertions
```

Only import what the file actually uses. Common subsets:
- Minimal read-only tests: `{ describe, expect, it, render }`
- Async/stability needed: add `waitForStable`
- Spy/mock needed: add `afterEach, vi`
- Keyboard interaction: add `userEvent` from `'vitest/browser'`

### Test Structure

Every component test file must include, at minimum:

```tsx
describe('bq-<component>', () => {
  it('should render', async () => {
    const { root } = await render(<bq-component />);
    expect(root).not.toBeNull();
  });

  it('should have shadow root', async () => {
    const { root } = await render(<bq-component />);
    expect(root.shadowRoot).not.toBeNull();
  });

  // ... additional tests
});
```

Beyond the baseline, every test should cover:
- **Prop reflection**: each `@Prop()` should have a test asserting it is reflected as an attribute
- **Slot content**: each named and default slot should have a test verifying its content renders
- **Events**: each `@Event()` should have tests for both the triggering action and the emitted event count
- **Methods**: each public `@Method()` should have tests for expected behavior and edge cases
- **Keyboard interactions**: test all relevant key presses and focus behavior for interactive components
- **State changes**: test all meaningful interactive state transitions (e.g. checked, disabled, expanded)
- **Accessibility**: test `aria-*` attributes, keyboard navigation, and focus/blur behavior where applicable
- **Design style**: use `computedStyle` to verify critical CSS custom properties or computed values

### Check if a component has a shadow root

Always use `toHaveShadowRoot()` for checking shadow root presence instead of directly accessing `shadowRoot`:

```tsx
// ✅ correct
const { root } = await render(<bq-accordion />);
expect(root).toHaveShadowRoot();

// ❌ wrong
const { root } = await render(<bq-accordion />);
expect(root.shadowRoot).not.toBeNull();
```

### Element Casting

Always cast `root` to the concrete element type before passing it to typed helper functions:

```tsx
// ✅ correct
const bqButton = root as HTMLBqButtonElement;
const input = getInput(bqButton);

// ❌ wrong — root is typed as HTMLElement, helper expects HTMLBqButtonElement
const input = getInput(root);
```

The same applies when using the component's properties or methods — always cast to the specific element type first:

```tsx
const bqToggle = root as HTMLBqToggleElement;

// ✅ correct
bqToggle.checked = true;

// ❌ wrong — root is HTMLElement, doesn't have 'checked' property
root.checked = true;
```

Cast querySelector results to the expected element type when accessing shadow DOM elements:

```tsx
// ✅ correct
const input = bqToggle.shadowRoot?.querySelector<HTMLInputElement>('input');
// ❌ wrong — querySelector returns Element or null, not HTMLInputElement
const input = bqToggle.shadowRoot?.querySelector('input');
const input = bqToggle.shadowRoot?.querySelector('input') as HTMLInputElement;
```

### Update component's props

Always update props using the `setProps` utility from `@stencil/vitest` instead of directly setting attributes on `root`. This ensures proper re-rendering and state updates:

```tsx
// ✅ preferred — use setProps for proper re-rendering
const { root, setProps } = await render(<bq-drawer />);

await setProps({ open: true });

// ✅ also correct
const { root, waitForChanges } = await render(<bq-drawer />);
const bqDrawer = root as HTMLBqDrawerElement;

bqDrawer.open = true;
await waitForChanges();

// ❌ wrong
const { root, waitForChanges } = await render(<bq-drawer />);

root.open = true;
await waitForChanges();
```

or prefer using `setProps`



### Shadow DOM Helpers

Define typed shadow-DOM accessors outside the `describe` block for reuse across tests:

```tsx
const getInput = (el: HTMLBqCheckboxElement) => el.shadowRoot?.querySelector<HTMLInputElement>('[part="input"]');
const getBase  = (el: HTMLBqCheckboxElement) => el.shadowRoot?.querySelector<HTMLElement>('[part="base"]');
```

### Slot Utilities

Always use the shared slot utilities from `../../../shared/utils/slot` instead of inline `assignedElements`/`textContent` chains:

```tsx
import { getTextContent } from '../../../shared/utils/slot';

// Plain text node directly in the slot
expect(getTextContent(slot)).toBe('Label');

// Text inside a wrapper element (e.g. <span slot="header">Text</span>)
expect(getTextContent(slot, { recurse: true })).toBe('Label');

// ❌ avoid — verbose and error-prone
slot.assignedElements({ flatten: true })[0].textContent?.trim();
```

Use `slot.assignedElements({ flatten: true })` only when you need the element itself (e.g. for `tagName` or `getAttribute` checks, or to assert the count of assigned elements).

### Async Stability

- Always `await waitForStable(root)` before asserting on content that requires async rendering (e.g. after setting attributes, fetching icons, or triggering animations)
- After programmatically changing a prop or attribute, call `await waitForChanges()` then `await waitForStable(root)`:

```tsx
root.setAttribute('name', 'check');
await waitForChanges();
await waitForStable(root);
```

### Attribute Assertions

| Assertion | Use for |
|---|---|
| `expect(el).toHaveAttribute('attr')` | presence check only (1 argument) |
| `expect(el).toEqualAttribute('attr', value)` | attribute + value check (2 arguments) |
| `expect(el).toHaveClass('class-name')` | CSS class presence |
| `expect(el).not.toHaveAttribute('attr')` | attribute absence |

> **Do not** use `toHaveAttribute('attr', value)` with two arguments — it is not supported. Use `toEqualAttribute` instead.

### Event Spying

```tsx
const { spyOnEvent } = await render(<bq-component />);
const bqChange = spyOnEvent('bqChange');

// ... trigger action

expect(bqChange).toHaveReceivedEvent();
expect(bqChange).toHaveReceivedEventTimes(1);
```

Use `vi.fn()` and `vi.spyOn()` for console spies (e.g. to assert validation warnings). Always restore with `afterEach(() => vi.restoreAllMocks())`.

### CSS / Design Style Assertions

Use `computedStyle` with the `>>>` shadow-piercing separator:

```tsx
const style = computedStyle('bq-icon >>> [part="base"]', ['height', 'width']);
expect(style).toEqual({ height: '24px', width: '24px' });
```

### Mandatory Props

Always include all required (`!`) props in every `render()` call. Missing required props cause TypeScript errors:

```tsx
// bq-radio requires name + value
<bq-radio name="option-a" value="1">Label</bq-radio>

// bq-radio-group requires name
<bq-radio-group name="my-group">...</bq-radio-group>
```

### Mock Cleanup

When using `vi.spyOn` or `vi.fn()`, always add a top-level `afterEach`:

```tsx
afterEach(() => {
  vi.restoreAllMocks();
});
```
