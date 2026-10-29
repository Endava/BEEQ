---
description: BEEQ testing rules. Unit tests (Vitest) cover shared utilities only; component behavior is covered with e2e tests in browser mode (`@stencil/vitest`, Playwright/Chromium).
applyTo: packages/beeq/src/**/*.spec.ts,packages/beeq/src/components/**/__tests__/*.e2e.tsx
---

# Testing

## Unit tests

- Cover utilities under `packages/beeq/src/shared/` only. Components get e2e tests, not unit tests.
- Mock with `vi.fn()` / `vi.spyOn()` and restore in a top-level `afterEach(() => vi.restoreAllMocks())`.

## E2E tests

- Location: `packages/beeq/src/components/<name>/__tests__/bq-<name>.e2e.tsx`. The `.tsx` extension is required.
- Keep `import { h } from '@stencil/core'` even if the linter flags it as unused; JSX needs it.
- Import test utilities from `@stencil/vitest` and `userEvent` from `vitest/browser`. Import only what the file uses.
- Shared helpers live in `packages/beeq/src/shared/test-utils/` (e.g. `computedStyle`) and `packages/beeq/src/shared/utils/slot` (`getTextContent`).
- Use an existing well-tested file as the pattern, e.g. the `button` e2e test.

### What every component test file covers

- Baseline: it renders, and `expect(root).toHaveShadowRoot()` passes (never assert on `root.shadowRoot` directly).
- Each `@Prop()` is reflected as an attribute where applicable.
- Each default and named slot renders its content.
- Each `@Event()`: the triggering action and the emitted event count.
- Each public `@Method()`: expected behavior and edge cases.
- Keyboard and focus behavior, state transitions, and `aria-*` attributes for interactive components.
- Critical CSS custom properties or computed values, via `computedStyle`.

### Conventions

- Always include required (`!`) props in every `render()` call.
- Cast `root` to the concrete element type (`root as HTMLBqToggleElement`) before using typed helpers, props or methods. Cast `querySelector<HTMLInputElement>(...)` with the generic, not `as`.
- Update props with `await setProps({ open: true })`. Setting the property directly followed by `await waitForChanges()` is also acceptable.
- Define typed shadow-DOM accessors outside `describe`:

  ```tsx
  const getInput = (el: HTMLBqCheckboxElement) => el.shadowRoot?.querySelector<HTMLInputElement>('[part="input"]');
  ```

- Use the shared slot helpers instead of inline `assignedElements` chains:
  `getTextContent(slot)` for text nodes, `getTextContent(slot, { recurse: true })` for text inside a wrapper element. Use `slot.assignedElements({ flatten: true })` only when you need the element itself.
- After changing a prop or attribute, `await waitForChanges()` then `await waitForStable(root)`. Always `await waitForStable(root)` before asserting on async rendering (icon fetch, animations).
- Attribute assertions:

  | Assertion | Use for |
  |---|---|
  | `toHaveAttribute('attr')` | presence only (one argument) |
  | `toEqualAttribute('attr', value)` | presence and value |
  | `not.toHaveAttribute('attr')` | absence |
  | `toHaveClass('name')` | class presence |

  `toHaveAttribute('attr', value)` with two arguments is not supported. Avoid manual `getAttribute` checks.

- Events:

  ```tsx
  const { spyOnEvent } = await render(<bq-component />);
  const bqChange = spyOnEvent('bqChange');
  // ... trigger action
  expect(bqChange).toHaveReceivedEventTimes(1);
  ```

- CSS assertions use the `>>>` shadow-piercing separator:

  ```tsx
  const style = computedStyle('bq-icon >>> [part="base"]', ['height', 'width']);
  expect(style).toEqual({ height: '24px', width: '24px' });
  ```
