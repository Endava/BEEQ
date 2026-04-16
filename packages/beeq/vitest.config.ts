import { readFile } from 'node:fs/promises';
import { resolve } from 'node:path';

import { defineVitestConfig } from '@stencil/vitest/config';
import { playwright } from '@vitest/browser-playwright';
import type { Plugin } from 'vite';

const resolvePath = (path: string) => resolve(__dirname, path).replace(/\\/g, '/');
const SVG_DIR = resolvePath('../../dist/beeq/dist/beeq/svg');

/**
 * Vite plugin to serve BEEQ SVG icons from the local dist directory.
 * Maps `/svg/*` requests to `dist/beeq/dist/beeq/svg/*` files.
 */
function serveBeeqSvg(): Plugin {
  return {
    name: 'serve-beeq-svg',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url?.startsWith('/svg/') || !req.url.endsWith('.svg')) return next();

        const filePath = resolve(SVG_DIR, req.url.slice(5)).replace(/\\/g, '/');
        // Prevent path traversal
        if (!filePath.startsWith(SVG_DIR)) return next();

        readFile(filePath)
          .then((content) => {
            res.setHeader('Content-Type', 'image/svg+xml');
            res.setHeader('Cache-Control', 'public, max-age=31536000');
            res.end(content);
          })
          .catch(() => next());
      });
    },
  };
}

export default defineVitestConfig({
  stencilConfig: resolvePath('./stencil.config.ts'),
  test: {
    projects: [
      {
        test: {
          name: 'spec',
          include: ['src/**/*.spec.{ts,tsx}'],
          environment: 'stencil',
          setupFiles: [resolvePath('./vitest-spec-setup.ts')],
        },
      },
      {
        // The browser project needs its own plugins array — top-level plugins
        // aren't forwarded to the browser's Vite dev server.
        plugins: [serveBeeqSvg()],
        test: {
          name: 'e2e',
          include: ['src/**/*.e2e.tsx'],
          setupFiles: [resolvePath('./vitest-e2e-setup.ts')],
          browser: {
            enabled: true,
            provider: playwright(),
            headless: true,
            instances: [{ browser: 'chromium' }],
          },
        },
      },
    ],
  },
});
