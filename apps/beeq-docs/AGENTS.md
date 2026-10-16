# apps/beeq-docs

The Mintlify documentation site (`docs.json` is the navigation).

- Follow the [documentation](../../.agents/instructions/documentation.instructions.md), [component docs](../../.agents/instructions/component-docs.instructions.md) and [code examples](../../.agents/instructions/code-examples.instructions.md) guidelines. Use the `doc-component` skill to write a component page and `review-doc` to audit one.
- `beeq-mintlify.css` is generated from `@beeq/core`; regenerate it with `pnpm docs:generate-beeq-mintlify-css` instead of editing it.
- Verify props, slots, parts and CSS variables against the component source in `packages/beeq` before documenting them.
