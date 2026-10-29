---
name: fix-accessibility
description: 'Audit and fix WCAG 2.1 AA issues in a `bq-*` component: ARIA, keyboard navigation, focus, contrast and screen-reader support, including the accessibility e2e tests. Use when a component has a known or suspected accessibility problem. For a general review use review-component.'
argument-hint: 'Component name or path (e.g. "bq-button" or packages/beeq/src/components/button/bq-button.tsx)'
metadata:
  internal: true
---

# Fix Accessibility in a BEEQ Component

## When to Use

- A component fails an accessibility audit or axe scan, or a PR review flagged missing ARIA attributes.
- Keyboard navigation is broken or incomplete, a screen reader announces the wrong role, state or label, or focus is lost after an interaction.

## Procedure

### 1. Audit

1. Read the [accessibility instructions](../../instructions/accessibility.instructions.md). They hold every rule; this skill adds none.
2. Read the component's `.tsx` and its SCSS: note the semantic elements used and which shadow parts are exposed.
3. Check the component against every section of the instructions: semantic HTML, labels and names, roles and state, keyboard navigation, focus management, color and contrast, live regions.

Done when every section has a verdict and every violation has a location.

### 2. Fix

Apply the smallest change that resolves each violation, using the patterns below.

**Icon-only button**

```tsx
<button aria-label={this.label} aria-disabled={this.disabled ? 'true' : undefined}>
  <slot />
</button>

/** Accessible label for screen readers. Required when the button contains only an icon. */
@Prop({ reflect: true }) label?: string;
```

**Expandable element**

```tsx
<div
  role="button"
  aria-expanded={this.open ? 'true' : 'false'}
  aria-controls="panel-id"
  tabindex="0"
  onKeyDown={this.handleKeyDown}
>
```

**Error-linked input**

```tsx
<input
  aria-describedby={this.hasError ? `${this.name}-error` : undefined}
  aria-invalid={this.hasError ? 'true' : undefined}
/>
{this.hasError && (
  <span id={`${this.name}-error`} role="alert">{this.errorMessage}</span>
)}
```

Done when each violation is fixed in source.

### 3. Test

Add an e2e assertion for every fix, following the [testing instructions](../../instructions/testing.instructions.md) and the [write-e2e-tests](../write-e2e-tests/SKILL.md) skill:

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

Done when every fix has a test that fails without it.

### 4. Report

**Issues**: for each problem list:
- **Element / prop / line**: location, as a workspace-relative markdown link.
- **WCAG criterion**: the violated criterion (e.g. 1.3.1, 4.1.2).
- **Severity**: `critical` (blocks assistive technology) | `serious` (significant barrier) | `moderate` (inconvenience) | `minor`.
- **Fix**: the concrete change.

**Recommendations**: improvements that are not violations but would help assistive-technology users.
