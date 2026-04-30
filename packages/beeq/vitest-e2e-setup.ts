/// <reference types="vitest/globals" />
/// <reference types="@stencil/vitest/globals" />

import { beforeAll } from 'vitest';
// Load global styles (design tokens, CSS custom properties, etc.)
// This is needed for browser-mode e2e tests so :root variables resolve correctly.
import '../../dist/beeq/dist/beeq/beeq.css';

// Tell bq-icon where to find SVG assets.
// getBasePath() discovers this via document.querySelector('script[data-beeq]'),
// which works across module instances (unlike setBasePath which is per-bundle).
const script = document.createElement('script');
script.setAttribute('data-beeq', '/svg');
document.head.appendChild(script);

// Load Stencil components.
// Adjust according to your build output of choice
beforeAll(async () => {
  // Load the lazy-loader for this project
  // @ts-expect-error - E2E tests run after build, so the file is guaranteed to exist. The error is due to the fact that the file doesn't exist at compile time.
  await import('../../dist/beeq/dist/beeq/beeq.esm.js');
});

// biome-ignore lint/complexity/noUselessEmptyExport: This file is meant for side effects (global styles, Stencil component definitions, etc.) and doesn't export anything.
export {};
