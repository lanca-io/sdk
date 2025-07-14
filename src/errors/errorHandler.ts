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
	UserRejectedError,
	ChainNotFoundError,
	ChainSwitchError,
	ChainAddError,
} from './lancaErrors'
import { stringifyWithBigInt } from '../utils/stringifyWithBigInt'
import { BaseError } from 'viem'
import { parseViemError } from './parseBaseError'
import { ErrorLogger } from './errorLogger'

function isRoutingErrorParams(error: unknown): error is IRoutingErrorParams {
	return (
		typeof error === 'object' &&
		error !== null &&
		'type' in error &&
		Object.values(RoutingErrorType).includes((error as any).type)
	)
}

const routingErrorMap: Record<RoutingErrorType, (params: IRoutingErrorParams) => LancaClientError> = {
	[RoutingErrorType.TOKEN_NOT_SUPPORTED]: params => new UnsupportedTokenError(params.tokens as string[]),
	[RoutingErrorType.CHAIN_NOT_SUPPORTED]: params => new UnsupportedChainError(params.chains as string[]),
	[RoutingErrorType.NO_ROUTE_FOUND]: params => new NoRouteError(params.error as string),
	[RoutingErrorType.TOO_HIGH_AMOUNT]: params => new TooHighAmountError(params.amount as string),
	[RoutingErrorType.TOO_LOW_AMOUNT]: params => new TooLowAmountError(params.amount as string),
	[RoutingErrorType.AMOUNT_BELOW_FEE]: params => new AmountBelowFeeError(params.amount as string),
	[RoutingErrorType.WRONG_AMOUNT]: params => new WrongAmountError(params.amount as string),
	[RoutingErrorType.WRONG_SLIPPAGE]: params => new WrongSlippageError(params.slippageTolerance as string),
	[RoutingErrorType.MISSING_PARAMS]: params => new MissingParamsError(params.missingParams as string[]),
	[RoutingErrorType.SAME_TOKENS]: params => new TokensAreTheSameError(params.tokens as string[]),
	[RoutingErrorType.USER_REJECTED]: () => new UserRejectedError(),
	[RoutingErrorType.CHAIN_NOT_FOUND]: () => new ChainNotFoundError(),
	[RoutingErrorType.CHAIN_SWITCH_FAILED]: params => new ChainSwitchError(params.error as string),
	[RoutingErrorType.CHAIN_ADD_FAILED]: params => new ChainAddError(new Error(params.error as string)),
	[RoutingErrorType.UNKNOWN_ERROR]: params =>
		new LancaClientError(
			'UnknownError',
			'An unknown routing error occurred',
			undefined,
			undefined,
			undefined,
			stringifyWithBigInt(params),
		),
}

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
		this.logger.error(error)
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
		if (error instanceof LancaClientError) return error

		if (isRoutingErrorParams(error)) {
			const handler = routingErrorMap[error.type as RoutingErrorType]
			if (handler) return handler(error)
		}

		if (error instanceof BaseError) return parseViemError(error)

		let category = 'UnknownError'
		let message = 'An unknown error occurred'
		let stack: string | undefined
		let cause: Error | undefined
		let details: string

		try {
			if (typeof error === 'object' && error !== null) {
				category = (error as any).name ?? category
				message = typeof (error as any).message === 'string' ? (error as any).message : String(error)
				stack = (error as any).stack
				cause = (error as any).cause instanceof Error ? (error as any).cause : undefined
			} else {
				message = String(error)
			}
			details = stack ?? stringifyWithBigInt(error)
		} catch {
			details = 'Unserializable error object'
		}

		return new LancaClientError(category, message, cause, undefined, undefined, details, undefined)
	}
}
