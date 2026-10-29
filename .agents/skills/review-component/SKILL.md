---
name: review-component
description: 'Review a `bq-*` component against BEEQ guidelines and return a pass/fail report per category with fixes: structure, naming, JSDoc, props, accessibility, styling, tests and stories. Use before merging or when auditing a component. To fix accessibility issues specifically use fix-accessibility.'
argument-hint: 'Path to the component tsx file (e.g. packages/beeq/src/components/button/bq-button.tsx)'
metadata:
  internal: true
---

# Review a BEEQ Component

## When to Use

- Before opening a PR for a new or modified `bq-*` component, or when reviewing such a PR.
- Auditing an existing component for guideline compliance, or when it "feels off" and needs a holistic check.

## Procedure

### 1. Load the rules

Read these before evaluating. They are the only source of rules; this skill adds none:

- [Components instructions](../../instructions/components.instructions.md)
- [Styles instructions](../../instructions/styles.instructions.md)
- [Tailwind to native SCSS migration instructions](../../instructions/tailwind-to-native-scss.instructions.md)
- [Accessibility instructions](../../instructions/accessibility.instructions.md)
- [Testing instructions](../../instructions/testing.instructions.md)
- [write-stories](../write-stories/SKILL.md) for the Storybook rules

### 2. Read the component files

Read every file of the component:

- `bq-<name>.tsx`: logic
- `bq-<name>.types.ts`: types
- `scss/bq-<name>.scss` and `scss/bq-<name>.variables.scss`: styles and CSS custom properties
- `__tests__/bq-<name>.e2e.tsx`: e2e tests
- `_storybook/bq-<name>.stories.tsx`: stories

Done when each file exists or its absence is recorded as an issue.

### 3. Evaluate each category

Apply every rule of the matching section to the files. Mark each category ✅ pass, ⚠️ needs improvement or ❌ fail, and list each violated rule with its location.

| Category | Rules to apply |
|---|---|
| File Structure | Component Structure Rules in components (section order and headers, `render()` last, `shadow`, `formAssociated`, `private` over `#`) |
| Naming | Code Conventions in components (tag, class, event, handler, constant and type names, BEM for SCSS) |
| JSDoc | Component JSDoc Block in components (component-level tags, `@attr`, `@event`, `@slot`, `@part`, `@cssprop`, props, methods) |
| Props & Events | Props, Validation and Forms in components (validation with `@Watch()`, defaults versus types, `reflect`, typed `EventEmitter`) |
| Accessibility | Every rule in the accessibility instructions |
| Styling | Every rule in the styles instructions, plus the `scss/` layout and `styleUrl` from components |
| Tests | Every rule in the testing instructions, including a test for every prop, slot, event and public method |
| Storybook | Story rules in write-stories (import source, `argTypes`, state variants, Chromatic guard) |

Done when every category has a status.

### 4. Report format

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
