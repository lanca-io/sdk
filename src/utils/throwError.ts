export const throwError = (txHash: `0x${string}`) => {
	const error = new Error('Failed transaction')
	error.data = { txHash }

	throw error
}
