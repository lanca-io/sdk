import type { UrlType } from '../types'

export class LancaClientError extends Error {
	public category: string
	override cause?: Error
	public details?: string
	public docsPath?: string
	public metaMessages?: string[]
	public shortMessage: string
	public version?: string

	/**
	 * Constructs a new instance of the LancaClientError class.
	 *
	 * @param category - The error category (e.g. 'ABI', 'CHAIN', etc.).
	 * @param message - A descriptive message for the error.
	 * @param cause - An optional underlying error that caused this error.
	 * @param metaMessages - Optional array of additional messages about the error.
	 * @param version - Optional version information.
	 * @param details - Optional additional details about the error.
	 * @param docsPath - Optional path to documentation about this error.
	 */
	constructor(
		category: string,
		message: string,
		cause?: Error,
		metaMessages?: string[],
		version?: string,
		details?: string,
		docsPath?: string,
	) {
		super(message)
		this.category = category
		this.cause = cause
		this.metaMessages = metaMessages
		this.shortMessage = message
		this.version = version
		this.details = details
		this.docsPath = docsPath

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor)
		}
	}
}

// No changes needed to other error classes as they inherit from LancaClientError

export class UnsupportedTokenError extends LancaClientError {
	/**
	 * Constructs a new instance of the UnsupportedTokenError class.
	 *
	 * @param tokens The unsupported tokens
	 * @param cause An optional underlying error that caused this error.
	 */
	constructor(tokens: string[], cause?: Error) {
		super('UnsupportedToken', `Unsupported tokens: ${tokens.join(', ')}`, cause)
	}
}

export class UnsupportedChainError extends LancaClientError {
	/**
	 * Constructs a new instance of the UnsupportedChainError class.
	 *
	 * @param chains The unsupported chains
	 * @param cause An optional underlying error that caused this error.
	 */
	constructor(chains: string[], cause?: Error) {
		super('UnsupportedChain', `Unsupported chains: ${chains.join(', ')}`, cause)
	}
}

export class WrongAmountError extends LancaClientError {
	/**
	 * Constructs a new instance of the WrongAmountError class.
	 *
	 * @param amount The wrong amount
	 * @param cause An optional underlying error that caused this error.
	 */
	constructor(amount: string, cause?: Error) {
		super('WrongAmount', `Wrong amount: ${amount}`, cause)
	}
}

export class TokensAreTheSameError extends LancaClientError {
	/**
	 * Constructs a new instance of the TokensAreTheSameError class.
	 *
	 * @param tokens The tokens
	 * @param cause An optional underlying error that caused this error.
	 */
	constructor(tokens: string[], cause?: Error) {
		super('TokensAreTheSame', `Tokens are the same: ${tokens.join(', ')}`, cause)
	}
}

export class WalletClientError extends LancaClientError {
	/**
	 * Constructs a new instance of the WalletClientError class.
	 *
	 * @param error A descriptive error message.
	 * @param cause An optional underlying error that caused this error.
	 */
	constructor(error: string, cause?: Error) {
		super('WalletClientError', `Wallet client error: ${error}`, cause)
	}
}

export class PublicClientError extends LancaClientError {
	/**
	 * Constructs a new instance of the PublicClientError class.
	 *
	 * @param error A descriptive error message.
	 * @param cause An optional underlying error that caused this error.
	 */
	constructor(error: string, cause?: Error) {
		super('PublicClientError', `Public client error: ${error}`, cause)
	}
}

export class NoRouteError extends LancaClientError {
	/**
	 * Constructs a new instance of the NoRouteError class.
	 *
	 * @param error A descriptive error message of the route error.
	 * @param cause An optional underlying error that caused this error.
	 */
	constructor(error: string, cause?: Error) {
		super('NoRouteError', `No route found: ${error}`, cause)
	}
}

export class HTTPError extends LancaClientError {
	private response: Response
	private url: UrlType
	private options?: RequestInit
	/**
	 * Constructs a new instance of the HTTPError class.
	 *
	 * @param error A descriptive error message for the request error.
	 * @param response The response object associated with the error.
	 * @param url The URL where the error occurred.
	 * @param options Optional request options that were used when the error occurred.
	 * @param cause An optional underlying error that caused this error.
	 */
	constructor(error: string, response: Response, url: UrlType, options?: RequestInit, cause?: Error) {
		super('RequestError', `Request error: ${error}`, cause)
		this.response = response
		this.url = url
		this.options = options
	}
}

export class TooHighAmountError extends LancaClientError {
	/**
	 * Constructs a new instance of the TooHighAmountError class.
	 *
	 * @param amount The too high amount
	 * @param cause An optional underlying error that caused this error.
	 */
	constructor(amount: string, cause?: Error) {
		super('TooHighAmount', `Too high amount: ${amount}`, cause)
	}
}

export class TooLowAmountError extends LancaClientError {
	/**
	 * Constructs a new instance of the TooLowAmountError class.
	 *
	 * @param amount The too low amount
	 * @param cause An optional underlying error that caused this error.
	 */
	constructor(amount: string, cause?: Error) {
		super('TooLowAmount', `Too low amount: ${amount}`, cause)
	}
}

export class AmountBelowFeeError extends LancaClientError {
	/**
	 * Constructs a new instance of the AmountBelowFeeError class.
	 *
	 * @param amount The amount below fee
	 * @param cause An optional underlying error that caused this error.
	 */
	constructor(amount: string, cause?: Error) {
		super('AmountBelowFeeError', `Amount below fee: ${amount}`, cause)
	}
}

export class WrongSlippageError extends LancaClientError {
	/**
	 * Constructs a new instance of the WrongSlippageError class.
	 *
	 * @param slippage The wrong slippage
	 * @param cause An optional underlying error that caused this error.
	 */
	constructor(slippage: string, cause?: Error) {
		super('WrongSlippage', `Wrong slippage: ${slippage}`, cause)
	}
}

export class MissingParamsError extends LancaClientError {
	/**
	 * Constructs a new instance of the MissingParamsError class.
	 *
	 * @param params The missing params
	 * @param cause An optional underlying error that caused this error.
	 */
	constructor(params: string[], cause?: Error) {
		super('MissingParams', `Missing params: ${params.join(', ')}`, cause)
	}
}

export class UserRejectedError extends LancaClientError {
	/**
	 * Constructs a new instance of the UserRejectedError class.
	 *
	 * @param cause An optional underlying error that caused this error.
	 */
	constructor(cause?: Error) {
		super('UserRejected', 'User rejected', cause)
	}
}

// Add these new error classes after UserRejectedError

export class UnrecognizedChainError extends LancaClientError {
	/**
	 * Constructs a new instance of the UnrecognizedChainError class.
	 *
	 * @param cause An optional underlying error that caused this error.
	 */
	constructor(cause?: Error) {
		super('UnrecognizedChain', 'Unrecognized chain', cause)
	}
}

export class ChainNotFoundError extends LancaClientError {
	/**
	 * Constructs a new instance of the ChainNotFoundError class.
	 *
	 * @param cause An optional underlying error that caused this error.
	 */
	constructor(cause?: Error) {
		super('ChainNotFound', 'Chain not found', cause)
	}
}

export class ChainAddError extends LancaClientError {
	/**
	 * Constructs a new instance of the ChainAddError class.
	 *
	 * @param cause An optional underlying error that caused this error.
	 */
	constructor(cause?: Error) {
		super('ChainAddError', 'Failed to add chain', cause)
	}
}

export class UnsupportedContractError extends LancaClientError {
	/**
	 * Constructs a new instance of the UnsupportedContractError class.
	 *
	 * @param cause An optional underlying error that caused this error.
	 */
	constructor(cause?: Error) {
		super('UnsupportedContract', 'Chain does not support this contract', cause)
	}
}

export class ChainMismatchError extends LancaClientError {
	/**
	 * Constructs a new instance of the ChainMismatchError class.
	 *
	 * @param details Additional information about the chain mismatch
	 * @param cause An optional underlying error that caused this error.
	 */
	constructor(details: string, cause?: Error) {
		super('ChainMismatch', `Chain mismatch error: ${details}`, cause)
	}
}

export class ChainConfigurationError extends LancaClientError {
	/**
	 * Constructs a new instance of the ChainConfigurationError class.
	 *
	 * @param details Additional information about the configuration error
	 * @param cause An optional underlying error that caused this error.
	 */
	constructor(details: string, cause?: Error) {
		super('ChainConfiguration', `Chain configuration error: ${details}`, cause)
	}
}

export class InvalidChainError extends LancaClientError {
	/**
	 * Constructs a new instance of the InvalidChainError class.
	 *
	 * @param details Additional information about the invalid chain
	 * @param cause An optional underlying error that caused this error.
	 */
	constructor(details: string, cause?: Error) {
		super('InvalidChain', `Invalid chain: ${details}`, cause)
	}
}

export class ChainSwitchError extends LancaClientError {
	/**
	 * Constructs a new instance of the InvalidChainError class.
	 *
	 * @param details Additional information about the invalid chain
	 * @param cause An optional underlying error that caused this error.
	 */
	constructor(details: string, cause?: Error) {
		super('Chain switch Error', `Switch Error: ${details}`, cause)
	}
}
