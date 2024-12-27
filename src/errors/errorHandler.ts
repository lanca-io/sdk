import pino, { Logger } from 'pino'
import {
	AmountBelowFeeError,
	LancaClientError,
	MissingParamsError,
	NoRouteError,
	TokensAreTheSameError,
	TooHighAmountError,
	TooLowAmountError,
	UnsupportedChainError,
	UnsupportedTokenError,
	UserRejectedError,
	WrongAmountError,
	WrongSlippageError,
} from './lancaErrors'
import { ErrorWithMessage, RoutingErrorParams, RoutingErrorType } from './types'

export class ErrorHandler {
	private logger: Logger
	private destinationReport: string //for the future use
	private apiUrl: string //for the future use

	/**
	 * Initializes a new instance of the ErrorHandler class.
	 *
	 * @param level - The logging level for the logger. Defaults to 'error' if not provided.
	 */
	constructor(level?: string) {
		this.destinationReport = ''
		this.apiUrl = ''
		this.logger = pino({
			name: 'lanca-sdk',
			level: level ?? 'error',
			transport: {
				target: 'pino-pretty',
				options: {
					colorize: true,
					//destination: './logs/lanca-sdk.log',
				},
			},
		})
	}

	/**
	 * Handles the given error and sends an error report to the Concero API if the logger's level is set to 'error'.
	 * @param error The error to be handled.
	 */
	public async handle(error: unknown | string | LancaClientError, sendReport: boolean = false) {
		if (error instanceof LancaClientError) {
			this.logger.error(error.toString())
		} else if (error instanceof Error) {
			this.logger.error(`[LancaClientError] [Error] ${error.message}`)
		} else {
			this.logger.error(`[LancaClientError] [UnknownError] ${JSON.stringify(error)}`)
		}
		if (sendReport) await this.sendErrorReport(error as LancaClientError)
	}

	/**
	 * Parses the given error into a LancaClientError.
	 *
	 * The error object should have a 'type' property that matches one of the RoutingErrorType enum values.
	 * The other properties of the error object depend on the type, and are specified in the RoutingErrorParams interface.
	 *
	 * If the error does not have a 'type' property, it is returned as is.
	 *
	 * @param error The error to be parsed.
	 * @returns A LancaClientError instance.
	 */
	public parse(error: unknown | RoutingErrorParams): LancaClientError {
		if ('type' in error) {
			const lancaError = error as RoutingErrorParams
			const { type } = lancaError
			switch (type) {
				case RoutingErrorType.TOKEN_NOT_SUPPORTED:
					return new UnsupportedTokenError(lancaError.tokens)
				case RoutingErrorType.CHAIN_NOT_SUPPORTED:
					return new UnsupportedChainError(lancaError.chains)
				case RoutingErrorType.NO_ROUTE_FOUND:
					return new NoRouteError(lancaError.error)
				case RoutingErrorType.TOO_HIGH_AMOUNT:
					return new TooHighAmountError(lancaError.amount)
				case RoutingErrorType.TOO_LOW_AMOUNT:
					return new TooLowAmountError(lancaError.amount)
				case RoutingErrorType.AMOUNT_BELOW_FEE:
					return new AmountBelowFeeError(lancaError.amount)
				case RoutingErrorType.WRONG_AMOUNT:
					return new WrongAmountError(lancaError.amount)
				case RoutingErrorType.WRONG_SLIPPAGE:
					return new WrongSlippageError(lancaError.slippageTolerance)
				case RoutingErrorType.MISSING_PARAMS:
					return new MissingParamsError(lancaError.missingParams)
				case RoutingErrorType.SAME_TOKENS:
					return new TokensAreTheSameError(lancaError.tokens)
			}
		}
		if (error instanceof Error) {
			if (error.message?.toLowerCase().includes('user rejected')) return new UserRejectedError(error)
		}
		return new LancaClientError('UnknownError', error as string, error.cause)
	}

	/**
	 * Sends an error report to the Concero API. If the logger's level is not set to 'error', this method does nothing.
	 * @param error The error to be reported.
	 */
	private async sendErrorReport(error: LancaClientError) {
		try {
			const response = await fetch(this.apiUrl, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					errorName: error.errorName,
					message: error.message,
					cause: error.cause,
				}),
			})
			this.logger.info(`Error report sent successfully: ${response.status}`)
		} catch (err: unknown) {
			this.logger.error(`Error sending error report: ${(err as ErrorWithMessage).message}`)
		}
	}
}
