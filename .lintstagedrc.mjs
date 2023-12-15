export default {
  // Global prettier
  '{apps,packages,tools}/**/*.{js,json,ts,tsx,scss}': (files) => `nx format:write --files=${files.join(',')}`,
  // BEEQ linters and unit tests
  'packages/beeq/src/**/*.*': [
    "npx nx affected -t lint --exclude='*,!tag:publishable' -- --fix=true",
    "npx nx affected -t test --exclude='*,!tag:publishable' -- --findRelatedTests --passWithNoTests",
  ],
};
