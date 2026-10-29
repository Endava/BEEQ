---
description: Rules for code examples in BEEQ docs: CodeLivePreview isolation and layout, the CSS code tab, and CodeGroup framework tabs (HTML, JavaScript, Angular, React, Vue).
applyTo: apps/beeq-docs/**/*.{mdx,md,jsx}
---

# Documentation Code Examples

See [documentation guidelines](documentation.instructions.md) for tone and Mintlify components.

## CodeLivePreview

Prefer `mode="iframe"` for new `CodeLivePreview` examples. Iframe mode gives the example a full document sandbox, so Mintlify layout, CSS, and page scripts cannot influence the preview, and preview scripts cannot disrupt the docs page.

Always pass the mode explicitly:

```mdx
<CodeLivePreview mode="iframe" height="12rem" code={`...`} />
```

Use iframe mode whenever an example includes layout behavior, scripts, overlays, popovers, fixed or absolute positioning, responsive containers, page-like composition, global token overrides on `:root`, or anything that could conflict with the Mintlify documentation shell. When using iframe mode, always include an explicit `height` (it sets the frame's height) and use `removePadding` when preview padding would hide the real layout behavior.

Shadow mode is still allowed for small, component-local examples that will not disrupt the Mintlify page and do not need full document isolation. In shadow mode, `CodeLivePreview` injects the `code` prop into a **shadow root** attached to the `.preview` div. `beeq.css` is loaded inside the shadow root automatically, and CSS custom properties (`--bq-*`) inherit through the shadow boundary so design tokens and dark/light mode work without changes. Role tokens arrive already resolved: the docs page computes `--bq-ui--brand: var(--bq-brand)` and the other roles on its own `<html>`, and `:root` matches nothing inside a shadow root. A snippet that sets a base token such as `--bq-brand`, on `:root`, `:host`, or an element, therefore never reaches components that read the roles. Show global token overrides in iframe mode, where the snippet's `:root` is the frame's document root.

### CSS inside shadow mode — use `:host`

The shadow root's host element is the `.preview` div. The `CodeLivePreview` stylesheet sets the following properties on it by default: `display: flex`, `align-items: center`, `justify-content: center`, `flex-direction: column` (switching to `row` at ≥40rem via container query), `gap: var(--bq-spacing-m)`, and `padding: var(--bq-spacing-l)`.

To override host layout, use `:host` inside a `<style>` block:

```html
<style>
  :host {
    /* Override the shadow host (.preview) flex defaults */
    flex-direction: column !important;
    gap: var(--bq-spacing-m) !important;
  }

  .my-wrapper {
    /* Target descendants inside the shadow root — no isolation needed */
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
</style>
```

**Rules:**

- Use `:host` to target the `.preview` container itself. All layout overrides on `:host` require `!important` to beat the `CodeLivePreview` stylesheet's specificity.
- Use any other selector (`.my-class`, `bq-button`, `h1`, etc.) to target elements inside the preview; the shadow boundary isolates them.
- Write `:host {}` for host layout; never `@scope`.
- `@media` and `@supports` work normally inside `<style>`.

**Correct:**
```html
<style>
  :host { flex-direction: column !important; gap: var(--bq-spacing-m) !important; }

  .avatar--group { display: flex; }

  @media (min-width: 640px) {
    .avatar--group { flex-direction: row; }
  }
</style>
```

`<style scoped>` is not a real browser feature; do not use it.

### JavaScript in `code` prop

Inline `<script>` blocks are executed via `new Function('previewRoot', ...)`. Use `previewRoot` to query elements inside the preview. In iframe mode, `previewRoot` is the iframe document. In shadow mode, `previewRoot` is the shadow root. Do **not** use `document.currentScript` because it is always `null` for dynamically created scripts.

Wrap logic in an IIFE to avoid variable leakage across multiple re-renders:

```html
<script>
  (() => {
    const btn = previewRoot.querySelector('bq-button');
    btn?.addEventListener('bqClick', () => { /* ... */ });
  })();
</script>
```

### Wrapper divs and layout

In shadow mode, the `.preview` host already centers its children with the flex defaults listed above. Do **not** add a wrapper `<div>` just for alignment, centering, or spacing between siblings. To tweak them, override `:host` (with `!important`):

```html
<style>
  :host {
    justify-content: space-around !important;
    gap: var(--bq-spacing-l) !important;
  }
</style>
```

In iframe mode, use normal document CSS inside the preview. Only add a wrapper element when the layout the example needs is fundamentally different from the preview surface or page body, such as:
- `position: relative` for absolutely positioned children (e.g., a badge layered on top of an icon)
- Negative margins for an overlapping group effect (e.g., stacked avatars)
- A grid, multi-row, or wrapping layout that flex cannot express
- A dimension constraint (fixed width, aspect ratio) that must apply to a specific subtree

When a wrapper is genuinely needed:

- Give it a BEM-style class name (e.g., `.avatar--group`, `.badge--icon`, `.dropdown-custom`).
- Style it inside a `<style>` block via a normal selector (`.avatar--group { ... }`).
- Keep the wrapper class name consistent between the `code` prop and the framework code tabs.
- Drop the CSS code tab entirely from the `CodeGroup` if the wrapper exists only for preview isolation and carries no educational value for users.

---

## CSS Code Tab

The CSS tab in a `CodeGroup` is for **copy-paste documentation** — it shows users how to style the component in their own project. Apply these rules:

- Include a CSS tab only when the styles are essential for understanding or reusing the example. Omit it when the styles only arrange the preview.
- Use an explicit filename when React imports it, for example `styles.css`.
- Use plain CSS selectors, **not** `@scope`. Users control their own scope naturally.
- Use modern CSS nesting (`& child`, `&::part(x)`, `&:hover`) for readability.
- Prefer `--bq-*` CSS custom properties and design tokens over hardcoded values.
- Always use CSS logical properties (e.g., `margin-inline-start` instead of `margin-left`) for better internationalization support.
- Be aware of component-specific CSS variables and shadow parts by checking the source code before writing examples.

```css
.avatar--group {
  display: flex;

  & bq-avatar {
    margin-inline-start: calc(var(--bq-spacing-xs) * -1);

    &::part(base):hover {
      scale: 1.2;
    }
  }
}
```

---

## CodeGroup Framework Tabs

The code shown in `CodeGroup` tabs must align with what `CodeLivePreview` renders. Do not document a different structure, state, or behavior than the preview shows.

Use this tab order:

1. `CSS` — only when the styles are essential for understanding or reusing the example
2. `JavaScript` — only when the script is long enough to deserve its own tab
3. `HTML`
4. `React`
5. `Angular`
6. `Vue`

Every fenced code block used as a Mintlify tab must include the correct icon. Add `expandable` only when the code block has **more than 7 lines** of code; short snippets should stay fully visible because Mintlify collapses expandable blocks too aggressively. Keep all `apps/beeq-docs/index.mdx` code tabs open, regardless of length.

| Tab | Opening fence |
|---|---|
| CSS | `css styles.css icon="css"` |
| JavaScript | `javascript script.js icon="js"` |
| HTML | `html HTML icon="html5"` |
| React | `jsx React icon="react"` |
| React with TypeScript | `tsx React icon="react"` |
| Angular | `ts Angular icon="angular"` |
| Vue | `vue Vue icon="vuejs"` |

Component pages must include HTML, React, Angular, and Vue tabs unless the page has a documented reason not to. Non-component pages may use focused tabs such as HTML and CSS when framework examples do not add value.

Keep one empty line between each fenced code block inside a `CodeGroup`.

### JavaScript tabs

Add a separate JavaScript tab only when the script is too long to keep the HTML example readable.

### Prop naming by framework

| Framework | Convention | Example |
|---|---|---|
| HTML | kebab-case attributes | `alt-text`, `background-color` |
| Angular | kebab-case attributes for static strings; `[propName]="value"` for property bindings | `alt-text`, `[firstDayOfWeek]="1"` |
| React | camelCase props | `altText`, `backgroundColor` |
| Vue | camelCase props | `altText`, `backgroundColor` |

Vue component wrappers use camelCase — **never** copy HTML attribute names into Vue tabs.

### Angular standalone pattern

Every Angular tab must be a **`ts`** code block (not `html`) showing a complete standalone `@Component`. Do not use Angular modules. This applies even when the example has no class logic — consistency and the canonical import pattern matter more than brevity.

```ts Angular icon="angular" expandable
import { Component } from "@angular/core";
import { BqComponentA } from "@beeq/angular/standalone";

@Component({
  standalone: true,
  imports: [BqComponentA],
  template: `
    <bq-component-a name="example">
      <label slot="label">Example label</label>
    </bq-component-a>
  `
})
export class ExampleComponent {}
```

Rules:
- Always import from `@beeq/angular/standalone` — never from `BeeQModule` or the non-standalone package.
- List every BEEQ component used in the template in the `imports` array.
- Name the class descriptively: `DefaultButtonComponent`, `DisabledDatePickerComponent`, etc.
- Use an empty class body `{}` when there is no logic.
- Use `[propName]="value"` for non-string or dynamic property bindings; plain HTML attributes (`prop-name="value"`) for static strings.
- Use `(bqEventName)="handler($event)"` for event bindings.
- Use inline styles in Angular examples unless the CSS is essential to the example and appears in a CSS tab.

### React and Vue styling

- React examples must import the CSS filename shown in the CSS tab when a CSS tab exists, for example `import "./styles.css";`.
- Vue examples should use inline styles unless the CSS is essential to the example and appears in a CSS tab.

---
