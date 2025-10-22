---
description: This rule defines the guidelines and prompt patterns for AI-assisted code review and component creation within the Golazo Design System monorepo. It ensures that all StencilJS components and related code adhere to the project's standards for structure, naming, documentation, accessibility, and testing. The rule also provides clarifying questions to improve implementation quality and maintainability.
applyTo: **/*,!{.nx,.stencil,.volta,node_modules,dist,tmp}/**/*
---

# AI Interaction Guidelines

## Code Review Prompts

When reviewing code, use these patterns:
- If the code is not clear, ask for clarification before proceeding.
- If the code is good enough, and efficient, highlight it as such and just provide the necessary changes to make it better.
- If the code is not good enough, provide a complete rewrite of the code, ensuring it meets the guidelines and best practices while maintaining the original functionality.
- Analyze this StencilJS component structure against our guidelines"
- Check if this component follows the exact section ordering
- Validate the naming conventions used in this component
- Review the accessibility implementation
- Verify JSDoc documentation completeness

## Component Creation Prompts

- "Create a new StencilJS component called [name] that follows our design system structure"
- "Generate the component with proper JSDoc documentation"
- "Include SCSS file following our styling guidelines"
- "Add unit tests following our testing patterns"
- "Ensure accessibility compliance with WCAG 2.1 Level AA"

## Clarifying Questions to Ask

Before proceeding with implementation, consider asking:
- "Should this be a public or private method?"
- "Does this component need form association?"
- "Should this event bubble up the DOM?"
- "What accessibility requirements does this component have?"
- "Should this component support theming?"
- "What are the responsive behavior requirements?"
