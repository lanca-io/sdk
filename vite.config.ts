import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'lanca-sdk-demo',//change to @lanca/sdk
			fileName: (format) => `index.${format}.js`,
		},
		rollupOptions: {
			external: ['pino', 'viem', 'solady'],
			output: {
				globals: {
					pino: 'pino',
					viem: 'viem',
					solady: 'solady',
				},
			},
		},
	},
});
