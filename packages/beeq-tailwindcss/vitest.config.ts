import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    name: 'beeq-tailwindcss',
    environment: 'node',
    include: ['src/**/*.spec.ts'],
    globals: false,
  },
});
