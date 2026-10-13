---
name: create-component
description: 'Scaffold a new BEEQ `bq-*` StencilJS component with `pnpm g`, then implement the TSX, types, SCSS and JSDoc. Use when creating a component from scratch or resuming an in-progress scaffold. For tests, stories or docs use the write-* and doc-component skills.'
argument-hint: 'Component name without the bq- prefix (e.g. "slider")'
metadata:
  internal: true
---

# Create a BEEQ Component

## When to Use

- Adding a new `bq-*` web component to the design system
- Scaffolding all required files for a component from scratch
- Resuming work on an in-progress component scaffold

## Before You Start

1. Read the instruction files for this task:
   - [Components instructions](../../instructions/components.instructions.md)
   - [Styles instructions](../../instructions/styles.instructions.md)
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

Follow the section order, naming and prop rules in the [components instructions](../../instructions/components.instructions.md). Do not reorder sections.

### 3. Create the types file (`bq-<name>.types.ts`)

Only when the component has typed props. Export type aliases and `const` arrays so the component (`@Watch` validators) and Storybook can share them:

```ts
export type TMyComponentSize = 'small' | 'medium' | 'large';
export const MY_COMPONENT_SIZE = ['small', 'medium', 'large'] as const;
```

### 4. Write the component-level JSDoc block

Use the JSDoc template in the components instructions. List every prop, event, method, slot, part and CSS custom property.

### 5. Style the component (`scss/bq-<name>.scss`)

- Import variables file: `@import './bq-<name>.variables'`
- Use Tailwind `@apply` for abstracting long utility combinations
- Define CSS custom properties (e.g. `--bq-name--border-radius`) in `bq-<name>.variables.scss`
- Follow BEM for any extra class names

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
