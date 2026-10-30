import { readFileSync } from 'node:fs';
import path from 'node:path';

import { describe, expect, it } from 'vitest';

import { GENERATED_DIR, generate } from '../../scripts/generate-tokens';

describe('generated tokens', () => {
  const files = Object.entries(generate()).map(([file, contents]) => [path.relative(GENERATED_DIR, file), contents]);

  it.each(files)('src/generated/%s should be up to date with the @beeq/core SCSS foundations', (file, contents) => {
    expect(
      readFileSync(path.join(GENERATED_DIR, file), 'utf8'),
      'Stale file: run `pnpm exec nx run beeq-tailwindcss:generate`',
    ).toBe(contents);
  });
});
