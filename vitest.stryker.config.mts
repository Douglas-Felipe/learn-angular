import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import angular from '@analogjs/vite-plugin-angular';
import { configDefaults, defineConfig } from 'vitest/config';

const rootDir = dirname(fileURLToPath(import.meta.url));
const pureUnitSpecs = ['src/app/features/**/utils/*.util.spec.ts'];

export default defineConfig({
  plugins: [angular({ tsconfig: 'tsconfig.spec.json' })],
  resolve: {
    alias: {
      '@routing': resolve(rootDir, 'src/app/core/routing'),
    },
  },
  test: {
    globals: true,
    projects: [
      {
        extends: true,
        test: {
          name: 'unit-pure',
          environment: 'node',
          setupFiles: [],
          include: pureUnitSpecs,
        },
      },
      {
        extends: true,
        test: {
          name: 'angular-dom',
          environment: 'jsdom',
          setupFiles: ['vitest.setup.ts'],
          include: ['src/**/*.spec.ts'],
          exclude: [...configDefaults.exclude, ...pureUnitSpecs],
        },
      },
    ],
  },
});
