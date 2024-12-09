import { UrlType } from "../types"

export class BaseError extends Error {
	public errorName: string
	override cause?: Error

	/**
	 * Constructs a new instance of the BaseError class.
	 * 
	 * @param errorName - The name of the error.
	 * @param message - A descriptive message for the error.
	 * @param cause - An optional underlying error that caused this error.
	 */
	constructor(errorName: string, message: string, cause?: Error) {
		super(message)
		this.errorName = errorName
		this.cause = cause
	}
}


export class UnsupportedTokenError extends BaseError {

	/**
	 * Constructs a new instance of the UnsupportedTokenError class.
	 * 
	 * @param token The unsupported token
	 * @param cause An optional underlying error that caused this error.
	 */
	constructor(token: string, cause?: Error) {
		super('UnsupportedToken', `Unsupported token: ${token}`, cause)
	}
}

export class UnsupportedChainError extends BaseError {
	/**
	 * Constructs a new instance of the UnsupportedChainError class.
	 * 
	 * @param chainId The unsupported chain
	 * @param cause An optional underlying error that caused this error.
	 */
	constructor(chainId: string, cause?: Error) {
		super('UnsupportedChain', `Unsupported chain: ${chainId}`, cause)
	}
}

export class EmptyAmountError extends BaseError {
	/**
	 * Constructs a new instance of the EmptyAmountError class.
	 * 
	 * @param amount The empty amount
	 * @param cause An optional underlying error that caused this error.
	 */
	constructor(amount: string, cause?: Error) {
		super('EmptyAmount', `Empty amount: ${amount}`, cause)
	}
}

export class TokensAreTheSameError extends BaseError {
	/**
	 * Constructs a new instance of the TokensAreTheSameError class.
	 * 
	 * @param token The token
	 * @param cause An optional underlying error that caused this error.
	 */
	constructor(token: string, cause?: Error) {
		super('TokensAreTheSame', `Tokens are the same: ${token}`, cause)
	}
}

export class WalletClientError extends BaseError {
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

export class PublicClientError extends BaseError {
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

export class RouteError extends BaseError {
	/**
	 * Constructs a new instance of the RouteError class.
	 * 
	 * @param error A descriptive error message of the route error.
	 * @param cause An optional underlying error that caused this error.
	 */
	constructor(error: string, cause?: Error) {
		super('RouteError', `Route error: ${error}`, cause)
	}
}

export class HTTPError extends BaseError {
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
