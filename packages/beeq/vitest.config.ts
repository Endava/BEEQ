import { resolve } from 'node:path';

import { defineVitestConfig } from '@stencil/vitest/config';

const resolvePath = (path: string) => resolve(__dirname, path).replace(/\\/g, '/');

export default defineVitestConfig({
  stencilConfig: resolvePath('./stencil.config.ts'),
  test: {
    projects: [
      {
        test: {
          name: 'spec',
          include: ['src/**/*.spec.{ts,tsx}'],
          environment: 'stencil',
          setupFiles: [resolvePath('./vitest-setup.ts')],
        },
      },
    ],
  },
});
