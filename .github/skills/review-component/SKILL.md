---
name: review-component
description: 'Review a BEEQ StencilJS component against design system guidelines and project standards. Use for: code review of bq-* components, checking section order, naming conventions, JSDoc completeness, prop validation, event documentation, accessibility, styling practices, and test coverage. Returns a structured review with pass/fail per category and actionable fixes.'
argument-hint: 'Path to the component tsx file (e.g. packages/beeq/src/components/button/bq-button.tsx)'
---

# Review a BEEQ Component

## When to Use

- Before opening a PR for a new or modified `bq-*` component
- Reviewing a PR that adds or modifies a `bq-*` component
- Auditing an existing component for guideline compliance
- Self-checking a component before submitting for review
- When a component "feels off" and you want a holistic check across all dimensions.

## Procedure

### 1. Load the instruction files

Read these before evaluating:
- [StencilJS instructions](../../instructions/stenciljs.instructions.md)
- [Styles instructions](../../instructions/styles.instructions.md)
- [Accessibility instructions](../../instructions/accessibility.instructions.md)
- [Testing instructions](../../instructions/testing.instructions.md)

### 2. Read the component files

Read all files for the component:
- `bq-<name>.tsx` — component logic
- `bq-<name>.types.ts` — type definitions
- `scss/bq-<name>.scss` — styles
- `scss/bq-<name>.variables.scss` — CSS custom properties
- `__tests__/bq-<name>.e2e.tsx` — E2E tests
- `_storybook/bq-<name>.stories.tsx` — Storybook stories

### 3. Evaluate each category

For each category below, mark ✅ pass, ⚠️ needs improvement, or ❌ fail, and list specific issues.

---

#### A. File Structure & Section Order
- [ ] Sections appear in the exact prescribed order (Own Properties → `@Element()` → `@State()` → `@Prop()` → `@Watch()` → `@Event()` → lifecycle → `@Listen()` → public methods → private methods → `render()`)
- [ ] Sections header comments are present even if the section is empty
- [ ] `render()` is the last method in the class
- [ ] `shadow: true` is set (or `delegatesFocus: true` only when needed)
- [ ] `formAssociated: true` is present only when the component submits form data
- [ ] No `#` private fields — only `private` keyword

#### B. Naming Conventions
- [ ] Tag uses `bq-` prefix and kebab-case
- [ ] Class name is `Bq<Name>` in PascalCase
- [ ] Events are camelCase with `bq` prefix (e.g. `bqChange`, `bqClick`)
- [ ] Event handler methods are prefixed with `handle` (e.g. `handleClick`)
- [ ] State variables, props, and methods are camelCase
- [ ] Constants and enum values are ALL_CAPS
- [ ] Private methods use arrow functions with the `private` keyword
- [ ] All public methods are `async`
- [ ] Type parameters are prefixed with `T` (e.g. `TButtonSize`)
- [ ] SCSS class names follow BEM

#### C. JSDoc Completeness
- [ ] Component-level JSDoc block present above `@Component({})`
- [ ] `@example`, `@documentation`, `@status`, `@dependency` tags present
- [ ] Every `@Prop()` documented with `@attr` in component JSDoc
- [ ] Every `@Event()` has JSDoc on the property and `@event` in component JSDoc
- [ ] Every `@Method()` has JSDoc with `@param` and `@returns`
- [ ] Every `@Prop()` has an inline JSDoc comment
- [ ] Every slot has `@slot` in component JSDoc
- [ ] Every shadow part has `@part` in component JSDoc
- [ ] Every CSS custom property has `@cssprop` in component JSDoc

#### D. Props & Events
- [ ] Props with fixed allowed values use `validatePropValue()` + `@Watch()`
- [ ] Boolean props should not have default values, default is `false`, so their purpose should be clear on what they control when `true`
- [ ] String props should not default to `undefined` if they are required.
- [ ] Styling-related props use `reflect: true`
- [ ] No prop defaults that contradict the type (e.g. `undefined` typed as `string`)
- [ ] Events use typed `EventEmitter<T>` (not `EventEmitter<any>`)
- [ ] Events bubble correctly (check `bubbles`, `cancelable` options if needed)

#### E. Accessibility
- [ ] Interactive elements use semantic HTML (`<button>`, `<a>`, `<input>`, etc.)
- [ ] `aria-label` / `aria-labelledby` / `aria-describedby` used where visible label is absent
- [ ] `role` attributes used only when native semantics are insufficient
- [ ] Keyboard navigation works (Tab, Enter, Space, Arrow keys as appropriate)
- [ ] Focus is managed correctly (no focus traps, no lost focus after state change)
- [ ] `aria-disabled` used instead of (or alongside) the `disabled` attribute where applicable
- [ ] `aria-expanded`, `aria-selected`, `aria-checked` reflect current state
- [ ] Color is never the sole means of conveying information

#### F. Styling
- [ ] Styles are in `scss/` subdirectory, not the component root
- [ ] `styleUrl` in the decorator references `./scss/bq-<name>.scss`
- [ ] Tailwind `@apply` used for abstracting long utility combinations
- [ ] No `!important` unless absolutely required
- [ ] CSS custom properties defined in `bq-<name>.variables.scss`
- [ ] SCSS file imports the variables file first
- [ ] No global styles; all styles are component-scoped
- [ ] BEM naming for extra CSS classes
- [ ] Focus styles are visible and meet contrast requirements
- [ ] `prefers-reduced-motion` considered for animations

#### G. Test Coverage
- [ ] `should render` test present
- [ ] `should have shadow root` uses `toHaveShadowRoot()` (not `.shadowRoot !== null`)
- [ ] Every `@Prop()` has a prop-reflection test
- [ ] Every named slot has a content test
- [ ] Every `@Event()` has an invocation test using `vi.fn()`
- [ ] Every public `@Method()` is tested
- [ ] Keyboard interactions tested with `userEvent`
- [ ] `afterEach(() => vi.restoreAllMocks())` present when mocks are used
- [ ] No use of deprecated `newE2EPage` from `@stencil/core/testing`

#### H. Storybook
- [ ] Import is from `@storybook/web-components-vite` (not `@storybook/web-components`)
- [ ] `argTypes` cover all public props and events
- [ ] Story variants exist for all major states / appearances
- [ ] Chromatic guard applied for animated/loading stories

---

### 4. Report Format

Return the review as:

```
## Component Review: bq-<name>

### Summary
<1-2 sentence overall assessment>

### Results

| Category | Status | Issues |
|---|---|---|
| File Structure | ✅/⚠️/❌ | ... |
| Naming | ✅/⚠️/❌ | ... |
| JSDoc | ✅/⚠️/❌ | ... |
| Props & Events | ✅/⚠️/❌ | ... |
| Accessibility | ✅/⚠️/❌ | ... |
| Styling | ✅/⚠️/❌ | ... |
| Tests | ✅/⚠️/❌ | ... |
| Storybook | ✅/⚠️/❌ | ... |

### Required Changes
<numbered list of blocking issues>

### Suggestions
<numbered list of non-blocking improvements>
```
