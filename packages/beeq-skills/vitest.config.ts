import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    include: ['__tests__/**/*.spec.ts'],
    globals: false,
    testTimeout: 20_000,
  },
});
