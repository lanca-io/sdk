export const throwError = (txHash: Address) => {
	const error = new Error('Failed transaction')
	error.data = { txHash }

	throw error
}
