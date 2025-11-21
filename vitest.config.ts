import { defineConfig } from 'vitest/config';
import { fileURLToPath } from 'node:url';

export default defineConfig({
  test: {
    environment: 'happy-dom',
    globals: true,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'tests/',
        '*.config.*',
        'src/boot/',
        'src/router/',
        'src/layouts/',
        'src/pages/',
        'src/components/',
        '.quasar/',
      ],
    },
  },
  resolve: {
    alias: {
      src: fileURLToPath(new URL('./src', import.meta.url)),
      composables: fileURLToPath(new URL('./src/composables', import.meta.url)),
    },
  },
});
