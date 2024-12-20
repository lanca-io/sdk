import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		globals: true,
		environment: 'node',
		coverage: {
			reporter: ['ts'],
		},
		setupFiles: ['./tests/setup.ts'],
	},
})
