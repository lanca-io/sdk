import {
	ExecutionRevertedError,
	InsufficientFundsError,
	NonceTooLowError,
	NonceTooHighError,
	FeeCapTooLowError,
	FeeCapTooHighError,
	IntrinsicGasTooLowError,
	IntrinsicGasTooHighError,
	TransactionExecutionError,
	WaitForTransactionReceiptTimeoutError,
	ContractFunctionExecutionError,
	ContractFunctionRevertedError,
	EstimateGasExecutionError,
	HttpRequestError,
	RpcRequestError,
	TimeoutError,
	ProviderDisconnectedError,
	ChainDisconnectedError,
	UserRejectedRequestError,
	ChainNotFoundError,
	ChainMismatchError,
	AbiFunctionNotFoundError,
	AbiEncodingLengthMismatchError,
} from 'viem'

import { BaseError } from 'viem'
import {
	ChainError,
	ContractInterfaceError,
	ExecutionError,
	LancaClientError,
	NetworkError,
	NonceError,
	TimeoutTransactionError,
	TransactionFeeError,
	UserRejectedError,
	UnsupportedTokenError,
	UnsupportedChainError,
	NoRouteError,
	TooHighAmountError,
	TooLowAmountError,
	AmountBelowFeeError,
	WrongAmountError,
	WrongSlippageError,
	MissingParamsError,
	TokensAreTheSameError,
	ChainAddError,
} from './lancaErrors'

export function parseError(error: unknown): LancaClientError {
	if (error instanceof UserRejectedRequestError) {
		return new UserRejectedError(error)
	}

	if (
		error instanceof InsufficientFundsError ||
		error instanceof FeeCapTooLowError ||
		error instanceof FeeCapTooHighError ||
		error instanceof IntrinsicGasTooLowError ||
		error instanceof IntrinsicGasTooHighError
	) {
		return new TransactionFeeError(error.message, error)
	}

	if (error instanceof NonceTooLowError || error instanceof NonceTooHighError) {
		return new NonceError(error.message, error)
	}

	if (
		error instanceof ExecutionRevertedError ||
		error instanceof TransactionExecutionError ||
		error instanceof ContractFunctionExecutionError ||
		error instanceof ContractFunctionRevertedError ||
		error instanceof EstimateGasExecutionError
	) {
		return new ExecutionError(error.message, error)
	}

	if (error instanceof TimeoutError || error instanceof WaitForTransactionReceiptTimeoutError) {
		return new TimeoutTransactionError(error.message, error)
	}

	if (
		error instanceof HttpRequestError ||
		error instanceof RpcRequestError ||
		error instanceof ProviderDisconnectedError ||
		error instanceof ChainDisconnectedError
	) {
		return new NetworkError(error.message, error)
	}

	if (error instanceof AbiFunctionNotFoundError || error instanceof AbiEncodingLengthMismatchError) {
		return new ContractInterfaceError(error.message, error)
	}

	if (error instanceof ChainNotFoundError || error instanceof ChainMismatchError) {
		return new ChainError(error.message, error)
	}

	if (error instanceof BaseError) {
		return new LancaClientError('VIEM_ERROR', error.shortMessage || error.message, {
			cause: error,
			context: {
				details: error.details,
				docsPath: error.docsPath,
			},
		})
	}

	// if (typeof error === 'object' && error !== null && 'type' in error) {
	//     const routingError = error as { type: string, [key: string]: any }

	//     if (routingError.type === 'TOKEN_NOT_SUPPORTED' && 'tokens' in routingError) {
	//         return new UnsupportedTokenError(routingError.tokens)
	//     }

	//     if (routingError.type === 'SAME_TOKENS' && 'tokens' in routingError) {
	//         return new TokensAreTheSameError(routingError.tokens)
	//     }

	//     // Handle chain errors
	//     if (routingError.type === 'CHAIN_NOT_SUPPORTED' && 'chains' in routingError) {
	//         return new UnsupportedChainError(routingError.chains)
	//     }

	//     if (routingError.type === 'CHAIN_NOT_FOUND') {
	//         return new LancaClientError(
	//             'CHAIN_NOT_FOUND',
	//             `Chain not found${'code' in error ? `: ${error.code}` : ''}`,
	//             { cause: error instanceof Error ? error : undefined }
	//         )
	//     }

	//     if (routingError.type === 'CHAIN_SWITCH_FAILED') {
	//         return new ChainError('Chain switch failed')
	//     }

	//     if (routingError.type === 'CHAIN_ADD_FAILED') {
	//         return new ChainAddError()
	//     }

	//     // Handle amount errors
	//     if (routingError.type === 'TOO_HIGH_AMOUNT' && 'amount' in routingError) {
	//         return new TooHighAmountError(routingError.amount)
	//     }

	//     if (routingError.type === 'TOO_LOW_AMOUNT' && 'amount' in routingError) {
	//         return new TooLowAmountError(routingError.amount)
	//     }

	//     if (routingError.type === 'AMOUNT_BELOW_FEE' && 'amount' in routingError) {
	//         return new AmountBelowFeeError(routingError.amount)
	//     }

	//     if (routingError.type === 'WRONG_AMOUNT' && 'amount' in routingError) {
	//         return new WrongAmountError(routingError.amount)
	//     }

	//     if (routingError.type === 'NO_ROUTE_FOUND') {
	//         return new NoRouteError(routingError.error)
	//     }

	//     if (routingError.type === 'WRONG_SLIPPAGE' && 'slippageTolerance' in routingError) {
	//         return new WrongSlippageError(routingError.slippageTolerance)
	//     }

	//     if (routingError.type === 'MISSING_PARAMS' && 'missingParams' in routingError) {
	//         return new MissingParamsError(routingError.missingParams)
	//     }

	//     if (routingError.type === 'USER_REJECTED') {
	//         return new UserRejectedError()
	//     }
	// }

	return new LancaClientError('UNKNOWN_ERROR', typeof error === 'string' ? error : 'Unknown error occurred', {
		cause: error instanceof Error ? error : undefined,
	})
}
