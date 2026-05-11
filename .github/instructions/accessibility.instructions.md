---
description: Ensure all components meet accessibility standards, including ARIA, semantic HTML, color contrast, keyboard navigation, and screen reader support.
applyTo: packages/beeq/src/components/**/*.{tsx,ts}
---

# Accessibility

Follow WCAG 2.1 Level AA standards across all `bq-*` components.

## Semantic HTML

- Use native elements for their intended purpose: `<button>` for actions, `<a href>` for navigation, `<input>` for form fields
- Do not use `<div>` or `<span>` with `role="button"` when a `<button>` is semantically correct
- Use landmark elements (`<main>`, `<nav>`, `<header>`, `<footer>`) and list structures (`<ul>`/`<li>`) where appropriate

## Labels & Names

- Every interactive element must have an accessible name via: visible text content, `aria-label`, `aria-labelledby`, or (last resort) `title`
- Icon-only buttons must expose a `label` prop and apply it as `aria-label` on the inner element
- Form inputs must be associated with a `<label>` or have `aria-labelledby`; helper/error text linked via `aria-describedby`

## ARIA Roles & State

- Apply `role` only when native semantics are insufficient (e.g. `role="dialog"`, `role="alert"`, `role="listbox"`)
- Reflect interactive state with ARIA attributes:
  - `aria-expanded` — for accordions, dropdowns, drawers
  - `aria-selected` — for tabs and options
  - `aria-checked` — for checkboxes, radios, toggles
  - `aria-disabled` — in addition to `disabled` where needed
  - `aria-invalid` + `aria-describedby` — for form validation errors
  - `aria-busy` — for loading states
  - `aria-hidden="true"` — for decorative/redundant elements (icons with visible labels)

## Keyboard Navigation

| Component type | Expected behavior |
|---|---|
| Button | `Enter` and `Space` activate |
| Link | `Enter` activates |
| Checkbox / Toggle | `Space` toggles |
| Select / Listbox | Arrow keys navigate; `Escape` closes |
| Dialog / Drawer | `Escape` closes; focus trapped inside |
| Tabs | Arrow keys move between tabs |
| Accordion | `Enter`/`Space` expand; `Tab` between items |

- Implement keyboard handling with `@Listen('keydown')` or inline `onKeyDown`
- Use `event.key` string values, never `event.keyCode`

## Focus Management

- Use `shadow: { delegatesFocus: true }` in `@Component({})` for components wrapping native inputs
- On dialog/drawer open: move focus to the first focusable element inside
- On dialog/drawer close: return focus to the trigger element
- Never use `tabindex` values > 0; use `0` or `-1` only

## Color & Contrast

- Text: minimum 4.5:1 contrast ratio (3:1 for large text ≥18pt or ≥14pt bold)
- Focus indicators: minimum 3:1 contrast against adjacent colors
- Never convey information by color alone — pair with icon, text, or pattern

## Live Regions

- Use `role="alert"` (assertive) for error messages and critical notifications
- Use `role="status"` (polite) for non-critical status updates
- Set `role` on the static element; do not change it dynamically
