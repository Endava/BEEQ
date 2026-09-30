export default {
  '{apps,packages,tools}/**/*.{js,json,ts,tsx,scss}': [
    'pnpm exec biome format --write --no-errors-on-unmatched --staged', // Format
    'pnpm exec biome lint --write --no-errors-on-unmatched --staged', // Lint and apply safe fixes
  ],
  // packages/beeq-skills/src is the source; skills/ is generated and committed with it.
  '{packages/beeq-skills/src/**,skills/**}': () => ['pnpm exec nx sync', 'git add skills'],
};
