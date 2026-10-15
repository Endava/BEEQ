import { describe, expect, it } from 'vitest';

import preset from '../index';

describe('@beeq/tailwindcss default export', () => {
  it('exposes the Tailwind CSS v3 preset shape (`presets: [beeqPreset]`, v4 `@config`)', () => {
    expect(preset.theme.colors).toBeDefined();
    expect(preset.plugins.length).toBeGreaterThan(0);
  });

  it('exposes the Tailwind CSS v4 plugin shape (`@plugin "@beeq/tailwindcss"`)', () => {
    expect(preset.handler).toBeTypeOf('function');
    expect(preset.config).toMatchObject({ theme: preset.theme, plugins: preset.plugins });
  });
});
