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

## Local build performance: `BEEQ_SKIP_ICONS` and `:fast` scripts

The `beeq:build` target declares `dependsOn: [{ "target": "icons" }, ...]`,
and the shared `nx.json` `targetDefaults` make `beeq:storybook-build` and
`beeq:e2e` depend on `beeq:build`. As a result any Nx Cloud DTE agent that
picks up `build`, `storybook-build`, or `e2e` for `beeq` always has the
flattened Phosphor SVG assets on disk before running. The
icons executor is idempotent — a warm run is a sub-second fingerprint check
— so the dependency is effectively free after the first cold checkout.

For the rare cases where an AI agent (or a human) needs to iterate quickly
and knows the SVG folder is already populated and unchanged, the icons
executor honors a `BEEQ_SKIP_ICONS` environment variable and the repo
exposes matching `:fast` npm scripts.

- **Default (use in almost all cases)** — run the target normally so the
  icons dependency runs and cache-hits or refreshes as needed. Never break
  the dependency chain by hand.

  ```bash
  pnpm build            # runs build:beeq + build:storybook (both fan into icons)
  pnpm build:beeq
  pnpm build:storybook
  pnpm test:e2e
  ```

  > **Fresh checkout note.** `pnpm start` (the local dev server) does **not**
  > depend on `beeq:build` or `beeq:icons`, so it will 404 on `/svg/*.svg`
  > until the SVG folder is populated. After cloning or running `pnpm clean`,
  > run `pnpm build:beeq` (or `pnpm exec nx run beeq:icons`) once before
  > `pnpm start`.

- **`:fast` variants (use only when explicitly appropriate)** — set
  `BEEQ_SKIP_ICONS=1` and skip the icons executor entirely. Use when:
  - You are iterating on unrelated code (component, styles, docs, tests)
    and the SVG folder was populated by a previous full run.
  - You know the pinned `sourceRef` / `sourceChecksum` in `project.json`
    has not changed since the last successful icons run.
  - You are running a large batch of build/test/e2e invocations back-to-back
    and want to save the sub-second per-run fingerprint check.

  ```bash
  pnpm build:beeq:fast
  pnpm build:storybook:fast
  pnpm test:e2e:fast
  BEEQ_SKIP_ICONS=1 pnpm build   # skip icons across a compound build
  BEEQ_SKIP_ICONS=1 pnpm exec nx run <project>:<target>
  ```

### Rules for AI agents

- **Prefer `:fast` for iterative local runs** where the SVG folder already
  exists and the pinned source has not changed. Announce the choice
  ("running `pnpm build:beeq:fast` — icons unchanged since last run") so a
  human reviewing your session can catch a wrong assumption.
- **Never use `:fast` or set `BEEQ_SKIP_ICONS`** when:
  - The `sourceRef` / `sourceChecksum` in `packages/beeq/project.json` was
    just changed.
  - The task involves the `bq-icon` component itself, adding/removing
    icons, or verifying icon rendering.
  - You cannot confirm the SVG folder is populated (a fresh checkout, a
    just-run `pnpm clean`, or after deleting
    `packages/beeq/src/components/icon/svg/`).
  - You are running anything that will be shipped or committed (CI,
    publish, deploy). `BEEQ_SKIP_ICONS` must never be set in CI or
    workflow files.
- **When in doubt, run the non-`:fast` variant.** The overhead is a
  sub-second cache check.
- The executor logs `Skipped via BEEQ_SKIP_ICONS ...` when the escape hatch
  fires. If you see that line in a build log that is later shipped or
  deployed, that is a bug — surface it.
