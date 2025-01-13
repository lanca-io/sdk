import { DEFAULT_INDENTATION } from '../constants'

/**
 * Converts an object to a JSON string, with special handling for BigInt values.
 * BigInt values are converted to strings to ensure compatibility with JSON.
 *
 * @param obj - The object to be stringified.
 * @returns A JSON string representation of the object.
 */

export function stringifyWithBigInt(obj: unknown): string {
	return JSON.stringify(
		obj,
		(_, value) => (typeof value === 'bigint' ? value.toString() : value),
		DEFAULT_INDENTATION,
	)
}
