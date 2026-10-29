# packages/beeq-tailwindcss

Design tokens and the Tailwind CSS preset consumed by `packages/beeq` and by applications. Source is in `src/` (`theme`, `plugins`, `helpers`).

- Component styles use these tokens; see the [styles](../../.agents/instructions/styles.instructions.md) guidelines for naming.
- Color layers live in `src/theme`: primitives in `colors/base.ts` and `colors/primitive.ts`, root semantics in `{default,endava}/root.ts`, mode roles in `{default,endava}/{light,dark}.ts`, elevation shadows in `shadows.ts`.
- Mode roles reference root semantics only (`var(--bq-info)`), never primitives. All four mode objects define the same roles, and info roles never resolve through brand.
- Add no per-state color tokens; hover and pressed colors are mixed with `--bq-hover`/`--bq-active` at 20% where they are used.
- `src/theme/__tests__/contrast.spec.ts` enforces these rules plus WCAG 4.5:1 text, 3:1 non-text and dark-mode APCA Lc 60 on every theme × mode. Accepted shortfalls go in `CONTRAST_EXCEPTIONS` or `APCA_EXCEPTIONS` with a reason, and raise their pinned counts only after maintainers agree. Run it with `pnpm exec nx run beeq-tailwindcss:test`; the `tag:core` filters in the root commands skip this package.
- Document token changes in `apps/beeq-docs/foundations/colors.mdx` and the theming pages.
- Changing a token or plugin can affect every component and the docs CSS. Run `pnpm docs:generate-beeq-mintlify-css` afterwards if the generated Mintlify bundle depends on it, and run the affected e2e tests.
