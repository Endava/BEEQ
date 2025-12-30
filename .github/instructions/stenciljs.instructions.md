---
description: Enforces strict StencilJS component structure, naming, and documentation rules for all components in the design system. Ensures consistency, maintainability, and best practices across the codebase, following the BEEQ Design System and Nx monorepo guidelines.
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

## Component Implementation

- Always use the @Element() decorator to access the component's DOM element
- Use the @Listen() decorator for event handling
- Implement proper lazy loading strategies
- Use proper slot patterns
- Follow proper event handling patterns
- Use proper component composition patterns
- Follow proper shadow DOM encapsulation patterns
- Implement proper form association
- Use proper custom element registry patterns

## Component State Management

- Use proper state management patterns
- Follow proper prop management
- Implement proper event handling
- Use proper lifecycle hooks
- Follow proper update patterns

## Component Performance

- Implement proper lazy loading
- Use proper code splitting
- Follow proper bundle optimization
- Implement proper resource loading
- Use proper rendering optimization

## Component Documentation

- Document component usage
- Provide proper examples
- Include proper API documentation
- Document proper integration patterns
- Include proper migration guides
