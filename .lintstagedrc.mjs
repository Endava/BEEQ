export default {
  '{apps,packages,tools}/**/*.{js,json,ts,tsx,scss}': [
    'pnpm exec biome format --write --no-errors-on-unmatched --staged', // Format
    'pnpm exec biome lint --write --no-errors-on-unmatched --staged', // Lint and apply safe fixes
  ],
  // packages/beeq-skills/src is the source; skills/ and the docs-site copies are generated and committed with it.
  '{packages/beeq-skills/src/**,skills/**,apps/beeq-docs/skill.md,apps/beeq-docs/skill/**}': () => [
    'pnpm exec nx sync',
    'git add skills apps/beeq-docs/skill.md apps/beeq-docs/skill/references',
  ],
};
