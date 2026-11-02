# packages/beeq-tailwindcss

The standalone Tailwind CSS preset (`@beeq/tailwindcss`, v3 preset and v4 `@plugin`). `@beeq/core` does not consume it. Source is in `src/` (`theme`, `plugins`, `helpers`).

- Tokens, the reset and the typography classes have a single source of truth: the SCSS foundations in [`packages/beeq/src/global/styles/foundations/`](../beeq/src/global/styles/foundations/). Edit them there, then run `pnpm exec nx run beeq-tailwindcss:generate` to rewrite `src/generated/` and commit both. `src/__tests__/generated.spec.ts` goes red while `src/generated/` is stale.
- `scripts/generate-tokens.ts` reads the foundations with Sass and PostCSS at generation time only; `src/` imports neither, so the published bundle stays dependency-free. It throws on any selector, at-rule or `!important` token it cannot map, so a new theme or mode block in SCSS needs a matching slot in the script and in the `BeeqThemeSwapper` call in `src/index.ts`.
- The reset adapter appends `!important` to the rules SCSS keeps unlayered (hidden state, reduced motion), because Tailwind emits every `addBase` rule in its base layer.
- Utility names stay curated in TS: the theme scales in `src/index.ts`, `src/theme/colors/{primitive,declarative}.ts` and the plugins. `src/__tests__/token-references.spec.ts` checks that every `var(--bq-*)` they use is a generated token.
- Color layers in the foundations: primitives in `tokens/primitives.scss`, root semantics in the root block of `themes/{beeq,endava}.scss`, mode roles in their light and dark blocks, interaction aliases in `themes/shared.scss`.
- Mode roles reference root semantics only (`var(--bq-info)`), never primitives. All four mode blocks define the same roles, and info roles never resolve through brand.
- Add no per-state color tokens; hover and pressed colors are mixed with `--bq-hover`/`--bq-active` at 20% where they are used.
- `src/theme/__tests__/contrast.spec.ts` enforces these rules plus WCAG 4.5:1 text, 3:1 non-text and dark-mode APCA Lc 60 on every theme × mode. Accepted shortfalls go in `CONTRAST_EXCEPTIONS` or `APCA_EXCEPTIONS` with a reason, and raise their pinned counts only after maintainers agree. Run it with `pnpm exec nx run beeq-tailwindcss:test`; the `tag:core` filters in the root commands skip this package.
- Document token changes in `apps/beeq-docs/foundations/colors.mdx` and the theming pages.
- Changing a token or plugin can affect every component and the docs CSS. Run `pnpm docs:generate-beeq-mintlify-css` afterwards if the generated Mintlify bundle depends on it, and run the affected e2e tests.
