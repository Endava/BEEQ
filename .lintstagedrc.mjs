import { relative } from 'path';

export default {
  // Run Prettier
  '{apps,packages,tools}/**/*.{js,json,ts,tsx,scss}': (files) => `pnpm exec nx format:write --files=${files.join(',')}`,
  // Run linter for beeq package only
  'packages/beeq/src/**/*.*': (files) => {
    const relativeFiles = files.map((file) => relative(process.cwd(), file));
    return `pnpm exec nx affected -t lint --exclude='*,!tag:core' --fix --files=${relativeFiles.join(',')}`;
  },
};
