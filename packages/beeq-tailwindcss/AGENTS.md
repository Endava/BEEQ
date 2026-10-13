# packages/beeq-tailwindcss

Design tokens and the Tailwind CSS preset consumed by `packages/beeq` and by applications. Source is in `src/` (`theme`, `plugins`, `helpers`).

- Component styles use these tokens; see the [styles](../../.agents/instructions/styles.instructions.md) guidelines for naming.
- Changing a token or plugin can affect every component and the docs CSS. Run `pnpm docs:generate-beeq-mintlify-css` afterwards if the generated Mintlify bundle depends on it, and run the affected e2e tests.
