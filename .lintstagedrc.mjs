export default {
  '{apps,packages,tools}/**/*.{js,json,ts,tsx,scss}': [
    'pnpm exec biome format --write --no-errors-on-unmatched --staged', // Format
    'pnpm exec biome lint --write --no-errors-on-unmatched --staged', // Lint and apply safe fixes
  ],
};
