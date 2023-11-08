export default {
  // Global prettier
  '{apps,packages,tools}/**/*.{js,json,ts,tsx,scss}': (files) => `nx format:write --files=${files.join(',')}`,
  // BEEQ linters
  'packages/beeq/src/**/*.*': "npx nx affected -t lint test --exclude='*,!tag:publishable' -- --fix --findRelatedTests",
};
