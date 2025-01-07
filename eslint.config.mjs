import pluginJs from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
	{ files: ['**/*.{ts}'] },
	{
		languageOptions: { globals: { ...globals.browser, ...globals.node } },
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
