import type { IRoutingErrorParams } from './types'
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
import { ErrorLogger } from './errorLogger'

export class ErrorHandler {
	private logger: ErrorLogger

	constructor(level?: string) {
		this.logger = new ErrorLogger('lanca-sdk', level ?? 'error')
	}

	/**
	 * Handles the given error and sends an error report to the Concero API if the logger's level is set to 'error'.
	 * @param error The error to be handled.
	 */
	public async handle(error: unknown | string | LancaClientError) {
		const normalizedError = error instanceof LancaClientError
			? error
			: this.parse(error);

		this.logger.error(normalizedError)
		const errorPayload = {
			errorName: normalizedError.name,
			errorMessage: normalizedError.message,
			errorStack: normalizedError.stack,
			metaMessage: normalizedError.metaMessages,
			cause: normalizedError.cause ? normalizedError.cause.message : undefined,
		}
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
}
