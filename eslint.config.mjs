import pluginJs from '@eslint/js'
import parserTs from '@typescript-eslint/parser'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
	{
		ignores: [
			'node_modules',
			'dist',
			'tests',
			'eslint.config.mjs',
			'coverage',
			'vite.config.ts',
			'vitest.config.ts',
		],
	},
	{ files: ['**/*.{ts}'] },
	{
		languageOptions: {
			parser: parserTs,
			parserOptions: {
				project: './tsconfig.json',
			},
			globals: { ...globals.browser, ...globals.node },
		},
		rules: {
			'@typescript-eslint/no-unused-vars': 'warn',
			'@typescript-eslint/no-explicit-any': 'warn',
			'@typescript-eslint/no-empty-interface': 'warn',
			'@typescript-eslint/naming-convention': [
				'error',
				{
					selector: 'parameter',
					format: ['camelCase', 'PascalCase', 'UPPER_CASE', 'snake_case'],
					leadingUnderscore: 'allow',
				},
			],
		},
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
]
