import type { UrlType } from '../types'

export class LancaClientError extends Error {
	public readonly code: string
	public override readonly cause?: Error
	public readonly context?: Record<string, unknown>

	constructor(code: string, message: string, options: { cause?: Error; context?: Record<string, unknown> } = {}) {
		super(message)
		this.code = code
		this.cause = options.cause
		this.context = options.context

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, this.constructor)
		}

		if (this.cause?.stack) {
			this.stack += `\nCaused by: ${this.cause.stack}`
		}
	}

	public override toString(): string {
		let str = `[${this.code}] ${this.message}`
		if (this.cause) str += `\nCaused by: ${this.cause}`
		return str
	}

	toJSON(): {
		code: string
		message: string
		stack?: string
		context?: Record<string, unknown>
		cause?: unknown
	} {
		return {
			code: this.code,
			message: this.message,
			stack: this.stack,
			context: this.context,
			cause: this.cause instanceof LancaClientError ? this.cause.toJSON() : this.cause,
		}
	}
}

export class UnsupportedTokenError extends LancaClientError {
	constructor(
		public readonly tokens: string[],
		cause?: Error,
	) {
		super('UNSUPPORTED_TOKEN', 'Unsupported tokens', {
			cause,
			context: { tokens },
		})
	}
}

export class UnsupportedChainError extends LancaClientError {
	constructor(
		public readonly chains: string[],
		cause?: Error,
	) {
		super('UNSUPPORTED_CHAIN', 'Unsupported chains', {
			cause,
			context: { chains },
		})
	}
}

export class WrongAmountError extends LancaClientError {
	constructor(
		public readonly amount: string,
		cause?: Error,
	) {
		super('WRONG_AMOUNT', 'Invalid amount specified', {
			cause,
			context: { amount },
		})
	}
}

export class TokensAreTheSameError extends LancaClientError {
	constructor(
		public readonly tokens: string[],
		cause?: Error,
	) {
		super('SAME_TOKENS', 'Tokens must be different', {
			cause,
			context: { tokens },
		})
	}
}

export class WalletClientError extends LancaClientError {
	constructor(
		public readonly details: string,
		cause?: Error,
	) {
		super('WALLET_ERROR', 'Wallet operation failed', {
			cause,
			context: { details },
		})
	}
}

export class PublicClientError extends LancaClientError {
	constructor(
		public readonly details: string,
		cause?: Error,
	) {
		super('PUBLIC_CLIENT_ERROR', 'Public client operation failed', {
			cause,
			context: { details },
		})
	}
}

export class NoRouteError extends LancaClientError {
	constructor(
		public readonly details: string,
		cause?: Error,
	) {
		super('NO_ROUTE', 'No route available', {
			cause,
			context: { details },
		})
	}
}

export class HTTPError extends LancaClientError {
	constructor(
		message: string,
		public readonly response: Response,
		public readonly url: UrlType,
		public readonly options?: RequestInit,
		cause?: Error,
	) {
		super('HTTP_ERROR', `Request failed: ${message}`, {
			cause,
			context: {
				status: response.status,
				url,
				method: options?.method,
				headers: options?.headers,
			},
		})
	}
}

export class TooHighAmountError extends LancaClientError {
	constructor(
		public readonly amount: string,
		cause?: Error,
	) {
		super('AMOUNT_TOO_HIGH', 'Amount exceeds maximum limit', {
			cause,
			context: { amount },
		})
	}
}

export class TooLowAmountError extends LancaClientError {
	constructor(
		public readonly amount: string,
		cause?: Error,
	) {
		super('AMOUNT_TOO_LOW', 'Amount below minimum limit', {
			cause,
			context: { amount },
		})
	}
}

export class AmountBelowFeeError extends LancaClientError {
	constructor(
		public readonly amount: string,
		cause?: Error,
	) {
		super('AMOUNT_BELOW_FEE', 'Amount does not cover fees', {
			cause,
			context: { amount },
		})
	}
}

export class WrongSlippageError extends LancaClientError {
	constructor(
		public readonly slippage: string,
		cause?: Error,
	) {
		super('INVALID_SLIPPAGE', 'Invalid slippage value', {
			cause,
			context: { slippage },
		})
	}
}

export class MissingParamsError extends LancaClientError {
	constructor(
		public readonly params: string[],
		cause?: Error,
	) {
		super('MISSING_PARAMS', 'Required parameters missing', {
			cause,
			context: { params },
		})
	}
}

export class UserRejectedError extends LancaClientError {
	constructor(cause?: Error) {
		super('USER_REJECTED', 'User rejected operation', { cause })
	}
}

export class UnrecognizedChainError extends LancaClientError {
	constructor(cause?: Error) {
		super('UNRECOGNIZED_CHAIN', 'Unrecognized chain', { cause })
	}
}

export class ChainNotFoundError extends LancaClientError {
	constructor(cause?: Error) {
		super('CHAIN_NOT_FOUND', 'Chain not found', { cause })
	}
}

export class ChainAddError extends LancaClientError {
	constructor(cause?: Error) {
		super('CHAIN_ADD_FAILED', 'Failed to add chain', { cause })
	}
}

export class TransactionFeeError extends LancaClientError {
  constructor(message: string, cause?: Error) {
    super('TRANSACTION_FEE_ERROR', message || 'Transaction fee calculation error', { cause })
  }
}

export class NonceError extends LancaClientError {
  constructor(message: string, cause?: Error) {
    super('NONCE_ERROR', message || 'Transaction nonce error', { cause })
  }
}

export class ExecutionError extends LancaClientError {
  constructor(message: string, cause?: Error) {
    super('EXECUTION_ERROR', message || 'Transaction execution failed', { cause })
  }
}

export class TimeoutTransactionError extends LancaClientError {
  constructor(message: string, cause?: Error) {
    super('TIMEOUT_ERROR', message || 'Transaction confirmation timed out', { cause })
  }
}

export class NetworkError extends LancaClientError {
  constructor(message: string, cause?: Error) {
    super('NETWORK_ERROR', message || 'Network connection error', { cause })
  }
}

export class ContractInterfaceError extends LancaClientError {
  constructor(message: string, cause?: Error) {
    super('CONTRACT_INTERFACE_ERROR', message || 'Contract interface error', { cause })
  }
}

export class ChainError extends LancaClientError {
  constructor(message: string, cause?: Error) {
    super('CHAIN_ERROR', message || 'Chain configuration error', { cause })
  }
}
