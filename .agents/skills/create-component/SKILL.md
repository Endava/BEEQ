---
name: create-component
description: 'Create a new BEEQ StencilJS web component. Use for: scaffolding bq-* components, adding new design system elements, generating component files (TSX, SCSS, types, stories, tests). Follows BEEQ component structure, naming conventions, JSDoc requirements, Shadow DOM, and Nx monorepo placement under packages/beeq/src/components/.'
argument-hint: 'Component name without the bq- prefix (e.g. "slider")'
---

# Create a BEEQ Component

## When to Use

- Adding a new `bq-*` web component to the design system
- Scaffolding all required files for a component from scratch
- Resuming work on an in-progress component scaffold

## Before You Start

1. Read the instruction files for this task:
   - [StencilJS instructions](../../instructions/stenciljs.instructions.md)
   - [Styles instructions](../../instructions/styles.instructions.md)
   - [Tailwind to native SCSS migration instructions](../../instructions/tailwind-to-native-scss.instructions.md)
   - [Accessibility instructions](../../instructions/accessibility.instructions.md)
2. Pick a similar existing component as a reference:
   - Simple / display: `packages/beeq/src/components/badge/bq-badge.tsx`
   - Interactive with events: `packages/beeq/src/components/button/bq-button.tsx`
   - Form-associated: `packages/beeq/src/components/checkbox/bq-checkbox.tsx`
   - Compound (host + item): `packages/beeq/src/components/accordion/` + `accordion-group/`

## Procedure

### 1. Run the Plop generator

```bash
pnpm g
```

Answer the prompts: component name (no `bq-` prefix), whether to add styling, style variables, and Storybook files. This creates the scaffolded files. Then update the generated `e2e.ts` extension to `.e2e.tsx`.

### 2. Implement the component (`bq-<name>.tsx`)

Follow the **exact section order** — do not reorder:

```
1. Own Properties          (private fields, element refs like prefixElem)
2. @Element()              (host HTML element reference)
3. @State()                (alphabetical, inlined decorator)
4. @Prop()                 (public API, reflect: true for styling-related props)
5. @Watch()                (prop lifecycle validators)
6. @Event()                (with full JSDoc; EventEmitter<T>)
7. Component lifecycle     (connectedCallback → componentWillLoad → componentDidLoad → disconnectedCallback)
8. @Listen()               (event listeners)
9. Public @Method()        (async, with full JSDoc)
10. Private local methods  (private arrow functions, e.g. private handleClick = () => {})
11. render()               (always last)
```

### 3. Create the types file (`bq-<name>.types.ts`)

Export type aliases and `const` arrays so both the component and Storybook can use them:

```ts
export type TMyComponentSize = 'small' | 'medium' | 'large';
export const MY_COMPONENT_SIZE = ['small', 'medium', 'large'] as const;
```

Only create this file if the component has typed props. The constant array is used in `@Watch` validators.

### 4. Write the component-level JSDoc block

Place above `@Component({})`. Every component **must** include:

```ts
/**
 * One-line description of what the component does.
 *
 * @example How to use it
 * ```html
 * <bq-name prop="value">Label</bq-name>
 * ```
 *
 * @documentation https://www.beeq.design/...
 * @status progress | stable | deprecated
 *
 * @dependency bq-icon  (list every consumed bq-* component)
 *
 * @attr {type} attr-name - Description (one per @Prop, use kebab-case)
 *
 * @event bqChange - Description (one per @Event)
 *
 * @method methodName() - Description (one per public @Method)
 *
 * @slot - Default slot description
 * @slot name - Named slot description
 *
 * @part part-name - Element description (one per shadow part)
 *
 * @cssprop --bq-name--property - Description (one per CSS custom property)
 */
```

### 5. Style the component (`scss/bq-<name>.scss`)

- Import variables file: `@import './bq-<name>.variables'`
- Use native SCSS/CSS. Do not add Tailwind `@apply`, `theme(...)`, or visual Tailwind utility classes in render output.
- Define CSS custom properties (e.g. `--bq-name--border-radius`) in `bq-<name>.variables.scss`
- Use BEEQ semantic classes only where stable styling hooks are needed, e.g. `.bq-name` and `.bq-name__content`.
- Use CSS logical properties for layout, sizing, spacing, positioning, borders, and radii.
- Use shared SCSS mixins for repeated focus, hover, and active patterns.
- Keep SCSS nesting depth at `2` or less.

## 6. After all files are created and implemented, ask the user:

Ask the user:

- What public props does this component need, and which are required?
- Does it need form association (`formAssociated: true`)?
- What events should it emit, and what detail payloads do they carry?
- What named slots does it expose beyond the default?
- What are the accessibility requirements — role, ARIA attributes, keyboard interactions?
- Should it support any size, appearance, or variant props?

Then run [review-component](../review-component/SKILL.md) on the new component to confirm everything is in order.

### 7. Verify the scaffold

Verify that the build passes without errors:

```bash
pnpm exec nx run beeq:build
```

## Key Rules

| Rule | Detail |
|---|---|
| Tag | `bq-<name>` — kebab-case, `bq-` prefix |
| Class | `Bq<Name>` — PascalCase |
| Events | camelCase, `bq` prefix (e.g. `bqClick`, `bqChange`) |
| Private | `private` keyword — never `#` (not supported by Stencil) |
| Local methods | Must be private arrow functions |
| Public methods | Must be `async` |
| Prop validation | Use `validatePropValue()` from `../../shared/utils` + `@Watch()` |
| Form components | Use `@AttachInternals()` + `formAssociated: true` |
| Focus delegation | Use `shadow: { delegatesFocus: true }` for interactive elements |
