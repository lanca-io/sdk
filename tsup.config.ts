import { defineConfig } from 'tsup';
import { polyfillNode } from 'esbuild-plugin-polyfill-node';

export default defineConfig([
  {
    entry: ['src/index.ts'],
    format: ['esm', 'cjs'],
    platform: 'node',
    target: 'node20',
    dts: true,
    sourcemap: true,
    clean: true,
    minify: true,
    treeshake: true,
    splitting: true,
    external: ['pino'],
    outExtension: ({ format }) => ({
      js: format === 'esm' ? '.mjs' : '.cjs'
    }),
    esbuildOptions(options) {
      options.mainFields = ['module', 'main'];
    }
  },
  {
    entry: ['src/index.ts'],
    format: 'esm',
    platform: 'browser',
    target: 'es2020',
    globalName: 'LancaSDK',
    dts: false,
    sourcemap: true,
    minify: true,
    treeshake: true,
    bundle: true,
    noExternal: ['*'],
    outExtension: () => ({ js: '.browser.mjs' }),
    plugins: [
      polyfillNode({
        polyfills: { 
          crypto: true,
          stream: 'empty',
          util: 'empty'
        },
        globals: { 
          buffer: true,
        }
      })
    ],
    inject: ['src/configs/polyfills.ts'],
  },
  {
    entry: ['src/index.ts'],
    format: 'iife',
    platform: 'browser',
    target: 'es2020',
    globalName: 'LancaSDK',
    sourcemap: true,
    minify: true,
    treeshake: true,
    bundle: true,
    noExternal: ['*'],
    outExtension: () => ({ js: '.browser.js' }),
    plugins: [
      polyfillNode({
        polyfills: { 
          crypto: true,
          stream: 'empty',
          util: 'empty'
        },
        globals: { 
          buffer: true,
        }
      })
    ],
    inject: ['src/configs/polyfills.ts'],
  }
]);
