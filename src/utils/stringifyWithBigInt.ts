import { DEFAULT_INDENTATION } from '../constants'

export function stringifyWithBigInt(obj: unknown): string {
	return JSON.stringify(
		obj,
		(_, value) => (typeof value === 'bigint' ? value.toString() : value),
		DEFAULT_INDENTATION,
	)
}
