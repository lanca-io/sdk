import pino from 'pino'
import type { Logger } from 'pino'
import type { IErrorWithMessage, IRoutingErrorParams } from './types'
import { RoutingErrorType } from './types'
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
	WrongAmountError,
	WrongSlippageError,
} from './lancaErrors'
import { stringifyWithBigInt } from '../utils/stringifyWithBigInt'
import { BaseError } from 'viem'
import { parseViemError } from './parseBaseError'

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
			this.logger.error(error.message)
		} else {
			this.logger.error(JSON.stringify(error))
		}
		if (sendReport) await this.sendErrorReport(error as LancaClientError)
	}

	/**
	 * Parses the given error into a LancaClientError.
	 *
	 * The error object should have a 'type' property that matches one of the RoutingErrorType enum values.
	 * The other properties of the error object depend on the type, and are specified in the IRoutingErrorParams interface.
	 *
	 * If the error does not have a 'type' property, it is returned as is.
	 *
	 * @param error The error to be parsed.
	 * @returns A LancaClientError instance.
	 */
	public parse(error: unknown | IRoutingErrorParams | LancaClientError | Error): LancaClientError {
		// @ts-expect-error Type 'unknown' is not assignable to type 'IRoutingErrorParams'.
		if ('type' in error) {
			const lancaError = error as IRoutingErrorParams
			const { type } = lancaError
			switch (type) {
				case RoutingErrorType.TOKEN_NOT_SUPPORTED:
					return new UnsupportedTokenError(lancaError.tokens as string[])
				case RoutingErrorType.CHAIN_NOT_SUPPORTED:
					return new UnsupportedChainError(lancaError.chains as string[])
				case RoutingErrorType.NO_ROUTE_FOUND:
					return new NoRouteError(lancaError.error as string)
				case RoutingErrorType.TOO_HIGH_AMOUNT:
					return new TooHighAmountError(lancaError.amount as string)
				case RoutingErrorType.TOO_LOW_AMOUNT:
					return new TooLowAmountError(lancaError.amount as string)
				case RoutingErrorType.AMOUNT_BELOW_FEE:
					return new AmountBelowFeeError(lancaError.amount as string)
				case RoutingErrorType.WRONG_AMOUNT:
					return new WrongAmountError(lancaError.amount as string)
				case RoutingErrorType.WRONG_SLIPPAGE:
					return new WrongSlippageError(lancaError.slippageTolerance as string)
				case RoutingErrorType.MISSING_PARAMS:
					return new MissingParamsError(lancaError.missingParams as string[])
				case RoutingErrorType.SAME_TOKENS:
					return new TokensAreTheSameError(lancaError.tokens as string[])
			}
		}
		if (error instanceof BaseError) {
			return parseViemError(error)
		}

		if (error instanceof Error) {
			return new LancaClientError('UnknownError', error.message, error)
		}

		// @ts-expect-error Type 'unknown' is not assignable to type 'LancaClientError'.
		return new LancaClientError('UnknownError', stringifyWithBigInt(error), error.cause)
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
			this.logger.error(`Error sending error report: ${(err as IErrorWithMessage).message}`)
		}
	}
}
