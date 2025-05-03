export default {
  // Run Prettier
  '{apps,packages,tools}/**/*.{js,json,ts,tsx,scss}': (files) => `pmp exec nx format:write --files=${files.join(',')}`,
  // Run ESLint
  'packages/beeq/src/**/*.*': ["pmp exec nx affected -t lint --exclude='*,!tag:publishable' -- --fix=true"],
};
