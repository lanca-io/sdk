export class UnsupportedTokenError extends Error {
	/**
	 * @param token The unsupported token
	 */
	constructor(token: string) {
		super(`Unsupported token: ${token}`)
	}
}

export class UnsupportedChainError extends Error {
	/**
	 * @param chainId The unsupported chain
	 */
	constructor(chainId: string) {
		super(`Unsupported chain: ${chainId}`)
	}
}

export class EmptyAmountError extends Error {
	/**
	 * @param amount The empty amount
	 */
	constructor(amount: string) {
		super(`Empty amount: ${amount}`)
	}
}

export class TokensAreTheSameError extends Error {
	/**
	 * @param token The same token
	 */
	constructor(token: string) {
		super(`Tokens are the same: ${token}`)
	}
}

export class WalletClientError extends Error {
	/**
	 * @param error The wallet client error
	 */
	constructor(error: string) {
		super(`Wallet client error: ${error}`)
	}
}

export class PublicClientError extends Error {
	/**
	 * @param error The public client error
	 */
	constructor(error: string) {
		super(`Public client error: ${error}`)
	}
}

export class RouteError extends Error {
	/**
	 * @param error The route error
	 */
	constructor(error: string) {
		super(`Route error: ${error}`)
	}
}
