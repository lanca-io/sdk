import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: false,
  outDir: 'dist',
  target: 'es2022',
  platform: 'node',
  shims: true,
  treeshake: true,
  outExtension({ format }) {
    return { 
      js: format === 'esm' ? '.mjs' : '.cjs' 
    }
  },
  external: ['viem', 'pino', 'solady'], 
});
