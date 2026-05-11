---
name: fix-accessibility
description: 'Audit and fix WCAG 2.1 Level AA accessibility issues in BEEQ StencilJS components. Use for: adding missing ARIA attributes, fixing keyboard navigation, managing focus, fixing color contrast issues, adding screen reader support, fixing role usage, and writing accessibility-related E2E tests for bq-* components.'
argument-hint: 'Component name or path (e.g. "bq-button" or packages/beeq/src/components/button/bq-button.tsx)'
---

# Fix Accessibility in a BEEQ Component

## When to Use

- A component fails an accessibility audit or axe scan
- A PR review flagged missing ARIA attributes
- Keyboard navigation is broken or incomplete
- Screen reader announces incorrect role, state, or label
- Focus is lost after a user interaction

## Before You Start

1. Read the [accessibility instructions](../../instructions/accessibility.instructions.md)
2. Read the component's `.tsx` to understand its current HTML structure and shadow DOM
3. Note which semantic HTML elements are used and whether shadow DOM parts are exposed

## Audit Checklist

Work through each category in order:

### 1. Semantic HTML

- [ ] Interactive elements use native elements: `<button>`, `<a href>`, `<input>`, `<select>`, `<textarea>`
- [ ] Use `<button>` for actions, `<a>` for navigation
- [ ] Heading levels are not skipped inside complex components
- [ ] `<label>` elements are associated to inputs via `htmlFor` / slotting, or `aria-label`/`aria-labelledby`
- [ ] Use `<ul>`/`<li>` for lists, `<nav>` for navigation regions, `<main>`, `<header>`, `<footer>` for landmarks
- [ ] Do **not** add `role="button"` to a `<div>` when a `<button>` can be used instead

### 2. Labels & Descriptions

- [ ] Every interactive element has an accessible name:
  - Visible text content, or
  - `aria-label` (short, direct), or
  - `aria-labelledby` pointing to a visible label element, or
  - `title` (last resort)
- [ ] Icon-only buttons must expose a `label` prop and apply `aria-label` to the inner button
- [ ] Form inputs are associated with a `<label>` or have `aria-labelledby`
- [ ] Helper/error text is linked via `aria-describedby`

### 3. Roles

- [ ] Apply `role` only when native semantics are insufficient
- [ ] Common patterns:
  - `role="dialog"` + `aria-modal="true"` for modal dialogs
  - `role="alert"` or `role="status"` for live notifications
  - `role="tooltip"` for tooltip elements (paired with `aria-describedby`)
  - `role="tab"` / `role="tablist"` / `role="tabpanel"` for tab components
  - `role="menu"` / `role="menuitem"` for dropdown menus
  - `role="listbox"` / `role="option"` for custom selects

### 4. State Attributes

Reflect interactive state with ARIA:

| State | Attribute |
|---|---|
| Open/closed (accordion, drawer, dropdown) | `aria-expanded="true/false"` |
| Selected (tab, option) | `aria-selected="true/false"` |
| Checked (checkbox, radio, toggle) | `aria-checked="true/false"` |
| Disabled | `aria-disabled="true"` (in addition to `disabled` where needed) |
| Required | `aria-required="true"` |
| Invalid | `aria-invalid="true"` + `aria-describedby` pointing to error message |
| Busy/loading | `aria-busy="true"` |
| Hidden decorative elements | `aria-hidden="true"` |

### 5. Keyboard Navigation

| Component type | Expected keyboard behavior |
|---|---|
| Button | `Enter` and `Space` activate |
| Link | `Enter` activates |
| Checkbox / Toggle | `Space` toggles |
| Accordion | `Enter`/`Space` expand; `Tab` moves between items |
| Select / Listbox | `Enter`/`Space` open; Arrow keys navigate options; `Escape` closes |
| Dialog / Drawer | `Escape` closes; focus trapped inside while open |
| Tabs | Arrow keys move between tabs; `Tab` moves to tab panel |
| Date picker | Arrow keys navigate calendar; `Escape` closes |

Implement keyboard handling with `@Listen('keydown')` or inline `onKeyDown`. Use `event.key` values, not `event.keyCode`.

### 6. Focus Management

- [ ] Focus is not lost after a state change (e.g. after submitting, after closing a dialog)
- [ ] On dialog/drawer open: move focus to the first focusable element inside
- [ ] On dialog/drawer close: return focus to the trigger element
- [ ] Use `shadow: { delegatesFocus: true }` in `@Component({})` for components that wrap native inputs
- [ ] Avoid `tabindex` values > 0; use `tabindex="0"` or `-1` only

### 7. Live Regions

- [ ] Notifications and status messages use `role="alert"` (assertive) or `role="status"` (polite)
- [ ] Do not change `role` or `aria-live` dynamically — set it on the static element


### 8. Color & Contrast

- [ ] Color is not the only means of conveying state (error, success, disabled, selected)
- [ ] Text and interactive elements meet WCAG AA contrast ratios (4.5:1 for normal text, 3:1 for large text and UI)
- [ ] Focus indicators meet the minimum contrast ratio against adjacent colors
- [ ] `prefers-reduced-motion` is respected for animations and transitions (via CSS `@media (prefers-reduced-motion: reduce)`)

### 9. Screen reader support
- [ ] Dynamic content changes are announced via `aria-live` regions or via `role="status"` / `role="alert"`
- [ ] Icon-only elements have a visually hidden text alternative or `aria-label`
- [ ] Images used for content have meaningful `alt` attributes; decorative images use `alt=""`
- [ ] Loading states are communicated (e.g., `aria-busy="true"` while content loads)

## Implementation Patterns

### Icon-only button

```tsx
// In template:
<button
  aria-label={this.label}
  aria-disabled={this.disabled ? 'true' : undefined}
>
  <slot />
</button>

// In @Prop():
/** Accessible label for screen readers. Required when the button contains only an icon. */
@Prop({ reflect: true }) label?: string;
```

### Expandable element

```tsx
<div
  role="button"
  aria-expanded={this.open ? 'true' : 'false'}
  aria-controls="panel-id"
  tabindex="0"
  onKeyDown={this.handleKeyDown}
>
```

### Error-linked input

```tsx
<input
  aria-describedby={this.hasError ? `${this.name}-error` : undefined}
  aria-invalid={this.hasError ? 'true' : undefined}
/>
{this.hasError && (
  <span id={`${this.name}-error`} role="alert">{this.errorMessage}</span>
)}
```

## Writing Accessibility Tests

After fixing, add E2E assertions (see `write-e2e-tests` skill):

```tsx
it('should have aria-label on icon-only button', async () => {
  const { root } = await render(<bq-button only-icon label="Close" />);
  const btn = (root as HTMLBqButtonElement).shadowRoot?.querySelector<HTMLButtonElement>('[part="button"]');
  expect(btn).toEqualAttribute('aria-label', 'Close');
});

it('should have aria-expanded when open', async () => {
  const { root, setProps } = await render(<bq-accordion />);
  await setProps({ open: true });
  const base = (root as HTMLBqAccordionElement).shadowRoot?.querySelector('[part="header"]');
  expect(base).toEqualAttribute('aria-expanded', 'true');
});
```

## Report format

### Issues
List each problem with:
- **Element / prop / line** — location of the issue (markdown link, workspace-relative path).
- **WCAG criterion** — which criterion is violated (e.g. 1.3.1, 4.1.2).
- **Severity** — `critical` (blocks assistive technology) | `serious` (significant barrier) | `moderate` (inconvenience) | `minor`.
- **Fix** — the concrete change needed.

### Recommendations
Additional improvements that are not violations but would improve the experience for users of assistive technology.
