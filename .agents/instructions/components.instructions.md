---
description: Enforces strict StencilJS component structure, naming, and documentation rules for all components in the design system. Ensures consistency, maintainability, and best practices across the codebase, following the BEEQ Design System guidelines.
applyTo: packages/beeq/src/components/**/*.tsx
---

# Components

All StencilJS components MUST ALWAYS FOLLOW this exact structure:

```typescript
@Component({
  tag: 'bq-<component-name>',
  styleUrl: 'bq-<component-name>.scss',
  shadow: true,
})
export class BqComponentName {
  // Own Properties
  // ====================

  // Reference to host HTML element
  // ===================================

  // State() variables
  // Inlined decorator, alphabetical order
  // =======================================

  // Public Property API
  // ========================

  // Prop lifecycle events
  // =======================

  // Events section
  // Requires JSDocs for public API documentation
  // ==============================================

  // Component lifecycle events
  // Ordered by their natural call order
  // =====================================

  // Listeners
  // ==============

  // Public methods API
  // These methods are exposed on the host element.
  // Always use two lines.
  // Public Methods must be async.
  // Requires JSDocs for public API documentation.
  // ===============================================

  // Local methods
  // Internal business logic.
  // These methods cannot be called from the host element.
  // =======================================================

  // render() function
  // Always the last one in the class.
  // ===================================

  render() {
    return <div>Component Content</div>;
  }
}
```

## Component Structure Rules

1. Section Order:
   - Own Properties: These are properties that are specific to the component, not related to the host element, and do not trigger re-renders.
   - Host Element References: These are references to the host HTML element, typically using the `@Element()` decorator.
   - State Variables (alphabetical): These are variables that manage the component's state, defined using the `@State()` decorator.
   - Public Properties: These are properties that can be set by the user of the component, defined using the `@Prop()` decorator.
   - Prop Lifecycle Events: These are lifecycle events related to the properties, such as `@Watch()` decorators.
   - Events (with JSDoc): These are custom events that the component can emit, defined using the `@Event()` decorator and documented with JSDoc.
   - Component Lifecycle Events (in call order): These are lifecycle methods that StencilJS provides, such as `connectedCallback()`, `disconnectedCallback()`, and `componentWillLoad()`.
   - Listeners: These are event listeners defined using the `@Listen()` decorator.
   - Public Methods (with JSDoc): These are methods that can be called by the user of the component, defined as public methods and documented with JSDoc.
   - Local Methods: These are internal private methods that are not exposed to the host element. They should be declared using arrow functions and with `private`, e.g., `private handleClick = () => {}`.
   - render() (always last): This is the render method that returns the component's HTML structure.

2. Naming Conventions:
   - Component tag: kebab-case with `bq-` prefix
   - Component class: PascalCase
   - State variables: camelCase
   - Properties and methods: camelCase
   - Events: camelCase prefixed with `bq` (e.g., `bqClick`)

3. Documentation:
   - All public APIs must have JSDoc documentation
   - Events must include detailed type information
   - Public methods must document parameters and return types

4. Method Rules:
   - Public methods must be async
   - Local methods should be private and use arrow functions

## Props, Validation and Forms

- Boolean props: use `prop: boolean = false` when the prop is conceptually required and should always be a boolean internally. Use `prop?: boolean` only when `undefined` is meaningful in the public API, and do not also assign `= false`.
- Validate prop values with `validatePropValue()` from `../../shared/utils` inside a `@Watch()`. Back it with a `const` array exported from `bq-<name>.types.ts` (e.g. `MY_COMPONENT_SIZE`), shared with Storybook.
- Form-associated components use `@AttachInternals()` and `formAssociated: true`.
- Use `reflect: true` for props that drive styling.

## Component JSDoc Block

Place above `@Component({})`. Every component includes:

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
 * @attr {type} attr-name - Description (one per @Prop, kebab-case)
 * @event bqChange - Description (one per @Event)
 * @method methodName() - Description (one per public @Method)
 * @slot - Default slot description
 * @slot name - Named slot description
 * @part part-name - Element description (one per shadow part)
 * @cssprop --bq-name--property - Description (one per CSS custom property)
 */
```

## Code Conventions

- Use early returns to avoid nested conditions.
- Prefer conditional classes (e.g. `classNames`) over ternary operators in class attributes.
- Prefix event handler functions with `handle` (e.g. `handleClick`, `handleKeyDown`).
- Use `kebab-case` for file names, `ALL_CAPS` for constants and enum values, and a `T` prefix for type parameters (e.g. `TKey`).
- Do not use `#` for private properties or methods; Stencil does not support it. Use the `private` keyword.
- Use `@Element()` to access the host element and `@Listen()` for host-level event handling.
- Use `shadow: { delegatesFocus: true }` when wrapping native inputs.

## Project Structure

- Scaffold new components with `pnpm g` (Plop generators in `tools/src/generators/plop`); do not create the files by hand.
- Projects are grouped by Nx tags: `core`, `publishable`, `wrapper`, `preset`, `skills`. Use them with `--exclude='*,!tag:<name>'` (see `AGENTS.md`).

## Scope of Changes

- Analyze the code before changing it. If its purpose is unclear, ask before proceeding.
- Only modify the sections related to the task.
- If you spot a refactor that would clearly improve performance, scalability, efficiency or readability, do not apply it. List it at the end of your response with the file, the benefit and a rough effort so the user can decide.
