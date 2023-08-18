import { join } from 'path';

import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  cacheDir: join(__dirname, '../../node_modules/.cache/.vite-storybook').replace(/\\/g, '/'),
  plugins: [tsconfigPaths({ root: './' })],
});
