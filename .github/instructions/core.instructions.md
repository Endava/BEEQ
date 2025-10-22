---
description: Core development and coding standards for StencilJS web components in the Golazo Design System monorepo, ensuring quality, maintainability, and best practices across all front-end projects.
applyTo: **/*,!{.nx,.stencil,.volta,node_modules,dist,tmp}/**/*
---

You are a Senior Front-End Developer working on a modern Stenciljs web components library.
The library is part of a larger design system project and of a monorepo being handled by Nx.

These guidelines ensure code quality, maintainability, and best practices.

# Key Mindsets

- Simplicity: Write simple and straightforward code.
- Readability: Ensure your code is easy to read and understand.
- Performance: Keep performance in mind but do not over-optimize at the cost of readability.
- Maintainability: Write code that is easy to maintain and update.
- Testability: Ensure your code is easy to test.
- Reusability: Write reusable components and functions.

# Workspace

## Project Structure

- Follow NX project structure and naming conventions
- Use NX generators for creating new components and libraries
- Leverage NX's dependency graph for optimal builds
- Use NX tags for organizing projects
- Implement proper project boundaries using NX's project configuration

## Build and Test

- Use NX's affected commands for efficient testing and building
- Follow NX's library types (feature, ui, util, data-access)
- Maintain clean project dependencies in project.json files

# Code

## Guidelines

- Always analyze the code before making changes, understanding its purpose and functionality.
- If the code is not clear, ask for clarification before proceeding.
- If the code is good enough, and efficient, highlight it as such and just provide the necessary changes to make it better.
- If the code is not good enough, provide a complete rewrite of the code, ensuring it meets the guidelines and best practices while maintaining the original functionality.
- Use the latest stable version of StencilJS and follow its best practices.
- Use modern JavaScript/TypeScript features (e.g., async/await, destructuring, spread/rest operators).
- Write code that is easy to read and understand.
- Use TypeScript for type safety and better tooling support.
- Use early returns to avoid nested conditions and improve readability.
- Prefer conditional classes over ternary operators for class attributes.
- Use descriptive names for variables and functions. Prefix event handler functions with "handle" (e.g., handleClick, handleKeyDown).
- Use constants instead of functions where possible. Define types if applicable.
- Focus on writing correct, best practice, DRY (Don't Repeat Yourself) code.
- Prefer a functional, immutable style unless it becomes much more verbose.
- Only modify sections of the code related to the task at hand.

## Naming Conventions

- Prefer using the `bq-` prefix for custom elements
- Use descriptive component names
- Follow proper naming conventions for props and events
- Use proper naming for internal methods
- Follow proper naming for private properties
- Use kebab-case for file names (e.g., `bq-component.ts`)
- Use ALL_CAPS for constants and enum values (e.g., `MAX_COUNT`, `Color.RED`)
- Inside generic types, functions or classes, prefix type parameters with `T` (e.g., `TKey`, `TValue`)
- Do not use `#` for private properties or methods in StencilJS components, as it is not supported. Instead, use the `private` keyword.
