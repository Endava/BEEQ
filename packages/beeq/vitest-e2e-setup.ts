/// <reference types="vitest/globals" />
/// <reference types="@stencil/vitest/globals" />

import { beforeAll, beforeEach } from 'vitest';
import { cdp } from 'vitest/browser';
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

// All test files share one page, so the pointer stays wherever the previous test left it.
// Rendered components sit at the top-left corner, so a leftover pointer can apply :hover
// styles to the next test. Park it in the bottom-right corner before every test.
// `userEvent.unhover()` doesn't help: it moves the pointer to the centre of <body>.
beforeEach(async () => {
  await cdp().send('Input.dispatchMouseEvent', {
    type: 'mouseMoved',
    x: window.innerWidth - 1,
    y: window.innerHeight - 1,
  });
});

// biome-ignore lint/complexity/noUselessEmptyExport: This file is meant for side effects (global styles, Stencil component definitions, etc.) and doesn't export anything.
export {};
