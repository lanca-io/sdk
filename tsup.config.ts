import { defineConfig } from 'tsup';
import { polyfillNode } from 'esbuild-plugin-polyfill-node';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: true,
  target: 'es2022',
  shims: true,
  external: ['viem', 'pino', 'solady'],
  plugins: [
    polyfillNode({
      polyfills: { crypto: true },
      globals: { buffer: true, process: true }
    })
  ],
  inject: ['src/configs/polyfills.ts'],
});