import { resolve } from 'path'
import { defineConfig } from 'vite'

export default defineConfig({
	build: {
		lib: {
			entry: resolve(__dirname, 'src/index.ts'),
			name: 'lanca-sdk-demo', //change to @lanca/sdk
			fileName: format => `index.${format}.js`,
			formats: ['es', 'cjs'],
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
		sourcemap: true,
		minify: false,
	},
})
