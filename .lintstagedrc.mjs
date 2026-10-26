// The `lint:staged` script runs lint-staged with `--no-stash --no-hide-partially-staged`.
// All worktrees share one `git stash` list, so the default backup stash collides across parallel commits.
// Consequence: Biome fixes are not reverted when a commit fails, and unstaged hunks of partially staged files are committed too.
export default {
  '{apps,packages,tools}/**/*.{js,json,ts,tsx,scss}': [
    'pnpm exec biome format --write --no-errors-on-unmatched --staged', // Format
    'pnpm exec biome lint --write --no-errors-on-unmatched --staged', // Lint and apply safe fixes
  ],
  // packages/beeq-skills/src is the source; skills/ is generated and committed with it.
  '{packages/beeq-skills/src/**,skills/**}': () => ['pnpm exec nx sync', 'git add skills'],
};
