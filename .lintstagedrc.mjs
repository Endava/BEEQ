export default {
  // Run Prettier
  '{apps,packages,tools}/**/*.{js,json,ts,tsx,scss}': (files) => `nx format:write --files=${files.join(',')}`,
  // Run ESLint
  'packages/beeq/src/**/*.*': [
    "npx nx affected -t lint --exclude='*,!tag:publishable' -- --fix=true",
  ],
};
