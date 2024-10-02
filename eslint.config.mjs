import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";

export default [
	{ files: ["**/*.{js,mjs,cjs,ts}"] },
	{
		languageOptions: { globals: { ...globals.browser, ...globals.node } },
		rules: {
			"@typescript-eslint/no-unused-vars": "warn",
			"@typescript-eslint/no-explicit-any": "warn",
		},
	},
	pluginJs.configs.recommended,
	...tseslint.configs.recommended,
];
