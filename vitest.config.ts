import { defineConfig } from 'vitest/config'
import { TEST_TIMEOUT } from './tests/setup'

export default defineConfig({
	test: {
		globals: true,
		environment: 'node',
		coverage: {
			reporter: ['ts'],
		},
		setupFiles: ['./tests/setup.ts'],
		testTimeout: TEST_TIMEOUT,
	},
})
