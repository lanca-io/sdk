import {
  AbiConstructorNotFoundError,
  AbiConstructorParamsNotFoundError,
  AbiDecodingDataSizeInvalidError,
  AbiDecodingDataSizeTooSmallError,
  AbiDecodingZeroDataError,
  AbiEncodingArrayLengthMismatchError,
  AbiEncodingBytesSizeMismatchError,
  AbiEncodingLengthMismatchError,
  AbiErrorInputsNotFoundError,
  AbiErrorNotFoundError,
  AbiErrorSignatureNotFoundError,
  AbiEventNotFoundError,
  AbiEventSignatureEmptyTopicsError,
  AbiEventSignatureNotFoundError,
  AbiFunctionNotFoundError,
  AbiFunctionOutputsNotFoundError,
  AbiFunctionSignatureNotFoundError,
  BaseError,
  BlockNotFoundError,
  BytesSizeMismatchError,
  CallExecutionError,
  ChainDisconnectedError,
  ChainDoesNotSupportContract,
  ChainMismatchError,
  ChainNotFoundError,
  ClientChainNotConfiguredError,
  ContractFunctionExecutionError,
  ContractFunctionRevertedError,
  ContractFunctionZeroDataError,
  DecodeLogTopicsMismatch,
  EstimateGasExecutionError,
  ExecutionRevertedError,
  FeeCapTooHighError,
  FeeCapTooLowError,
  FeeConflictError,
  FilterTypeNotSupportedError,
  HttpRequestError,
  InsufficientFundsError,
  IntegerOutOfRangeError,
  InternalRpcError,
  IntrinsicGasTooHighError,
  IntrinsicGasTooLowError,
  InvalidAbiDecodingTypeError,
  InvalidAbiEncodingTypeError,
  InvalidAddressError,
  InvalidArrayError,
  InvalidBytesBooleanError,
  InvalidChainIdError,
  InvalidDefinitionTypeError,
  InvalidHexBooleanError,
  InvalidHexValueError,
  InvalidInputRpcError,
  InvalidLegacyVError,
  InvalidParamsRpcError,
  InvalidRequestRpcError,
  InvalidSerializableTransactionError,
  InvalidSerializedTransactionError,
  InvalidSerializedTransactionTypeError,
  InvalidStorageKeySizeError,
  JsonRpcVersionUnsupportedError,
  LimitExceededRpcError,
  MethodNotFoundRpcError,
  MethodNotSupportedRpcError,
  NonceMaxValueError,
  NonceTooHighError,
  NonceTooLowError,
  ParseRpcError,
  ProviderDisconnectedError,
  ProviderRpcError,
  RawContractError,
  ResourceNotFoundRpcError,
  ResourceUnavailableRpcError,
  RpcError,
  RpcRequestError,
  SizeExceedsPaddingSizeError,
  SizeOverflowError,
  SwitchChainError,
  TimeoutError,
  TipAboveFeeCapError,
  TransactionExecutionError,
  TransactionNotFoundError,
  TransactionReceiptNotFoundError,
  TransactionRejectedRpcError,
  TransactionTypeNotSupportedError,
  UnauthorizedProviderError,
  UnknownNodeError,
  UnknownRpcError,
  UnsupportedPackedAbiType,
  UnsupportedProviderMethodError,
  UrlRequiredError,
  UserRejectedRequestError,
  WaitForTransactionReceiptTimeoutError,
  WebSocketRequestError,
} from 'viem'
import { stringifyWithBigInt } from '../utils/stringifyWithBigInt'
import { LancaClientError } from './lancaErrors'

export enum ErrorCategory {
  ABI = 'ABI',
  ACCOUNT = 'Account',
  ADDRESS = 'Address',
  BLOCK = 'Block',
  CHAIN = 'Chain',
  CONTRACT = 'Contract',
  DATA = 'Data',
  ENCODING = 'Encoding',
  ENS = 'ENS',
  ESTIMATE_GAS = 'EstimateGas',
  LOG = 'Log',
  NODE = 'Node',
  REQUEST = 'Request',
  RPC = 'RPC',
  SIWE = 'SIWE',
  TRANSACTION = 'Transaction',
  TRANSPORT = 'Transport',
  UNKNOWN = 'Unknown',
}

const errorCategoryMap = new Map<any, ErrorCategory>([
  [AbiConstructorNotFoundError, ErrorCategory.ABI],
  [AbiConstructorParamsNotFoundError, ErrorCategory.ABI],
  [AbiDecodingDataSizeInvalidError, ErrorCategory.ABI],
  [AbiDecodingDataSizeTooSmallError, ErrorCategory.ABI],
  [AbiDecodingZeroDataError, ErrorCategory.ABI],
  [AbiEncodingArrayLengthMismatchError, ErrorCategory.ABI],
  [AbiEncodingBytesSizeMismatchError, ErrorCategory.ABI],
  [AbiEncodingLengthMismatchError, ErrorCategory.ABI],
  [AbiErrorInputsNotFoundError, ErrorCategory.ABI],
  [AbiErrorNotFoundError, ErrorCategory.ABI],
  [AbiErrorSignatureNotFoundError, ErrorCategory.ABI],
  [AbiEventNotFoundError, ErrorCategory.ABI],
  [AbiEventSignatureEmptyTopicsError, ErrorCategory.ABI],
  [AbiEventSignatureNotFoundError, ErrorCategory.ABI],
  [AbiFunctionNotFoundError, ErrorCategory.ABI],
  [AbiFunctionOutputsNotFoundError, ErrorCategory.ABI],
  [AbiFunctionSignatureNotFoundError, ErrorCategory.ABI],
  [BytesSizeMismatchError, ErrorCategory.ABI],
  [DecodeLogTopicsMismatch, ErrorCategory.ABI],
  [InvalidAbiDecodingTypeError, ErrorCategory.ABI],
  [InvalidAbiEncodingTypeError, ErrorCategory.ABI],
  [InvalidArrayError, ErrorCategory.ABI],
  [InvalidDefinitionTypeError, ErrorCategory.ABI],
  [UnsupportedPackedAbiType, ErrorCategory.ABI],
  [InvalidAddressError, ErrorCategory.ADDRESS],
  [BlockNotFoundError, ErrorCategory.BLOCK],
  [ChainDoesNotSupportContract, ErrorCategory.CHAIN],
  [ChainMismatchError, ErrorCategory.CHAIN],
  [ChainNotFoundError, ErrorCategory.CHAIN],
  [ClientChainNotConfiguredError, ErrorCategory.CHAIN],
  [InvalidChainIdError, ErrorCategory.CHAIN],
  [SwitchChainError, ErrorCategory.CHAIN],
  [CallExecutionError, ErrorCategory.CONTRACT],
  [ContractFunctionExecutionError, ErrorCategory.CONTRACT],
  [ContractFunctionRevertedError, ErrorCategory.CONTRACT],
  [ContractFunctionZeroDataError, ErrorCategory.CONTRACT],
  [RawContractError, ErrorCategory.CONTRACT],
  [SizeExceedsPaddingSizeError, ErrorCategory.DATA],
  [IntegerOutOfRangeError, ErrorCategory.ENCODING],
  [InvalidBytesBooleanError, ErrorCategory.ENCODING],
  [InvalidHexBooleanError, ErrorCategory.ENCODING],
  [InvalidHexValueError, ErrorCategory.ENCODING],
  [SizeOverflowError, ErrorCategory.ENCODING],
  [EstimateGasExecutionError, ErrorCategory.ESTIMATE_GAS],
  [FilterTypeNotSupportedError, ErrorCategory.LOG],
  [ExecutionRevertedError, ErrorCategory.NODE],
  [FeeCapTooHighError, ErrorCategory.NODE],
  [FeeCapTooLowError, ErrorCategory.NODE],
  [InsufficientFundsError, ErrorCategory.NODE],
  [IntrinsicGasTooHighError, ErrorCategory.NODE],
  [IntrinsicGasTooLowError, ErrorCategory.NODE],
  [NonceMaxValueError, ErrorCategory.NODE],
  [NonceTooHighError, ErrorCategory.NODE],
  [NonceTooLowError, ErrorCategory.NODE],
  [TipAboveFeeCapError, ErrorCategory.NODE],
  [TransactionTypeNotSupportedError, ErrorCategory.NODE],
  [UnknownNodeError, ErrorCategory.NODE],
  [HttpRequestError, ErrorCategory.REQUEST],
  [RpcRequestError, ErrorCategory.REQUEST],
  [TimeoutError, ErrorCategory.REQUEST],
  [WebSocketRequestError, ErrorCategory.REQUEST],
  [ChainDisconnectedError, ErrorCategory.RPC],
  [InternalRpcError, ErrorCategory.RPC],
  [InvalidInputRpcError, ErrorCategory.RPC],
  [InvalidParamsRpcError, ErrorCategory.RPC],
  [InvalidRequestRpcError, ErrorCategory.RPC],
  [JsonRpcVersionUnsupportedError, ErrorCategory.RPC],
  [LimitExceededRpcError, ErrorCategory.RPC],
  [MethodNotFoundRpcError, ErrorCategory.RPC],
  [MethodNotSupportedRpcError, ErrorCategory.RPC],
  [ParseRpcError, ErrorCategory.RPC],
  [ProviderDisconnectedError, ErrorCategory.RPC],
  [ProviderRpcError, ErrorCategory.RPC],
  [ResourceNotFoundRpcError, ErrorCategory.RPC],
  [ResourceUnavailableRpcError, ErrorCategory.RPC],
  [RpcError, ErrorCategory.RPC],
  [TransactionRejectedRpcError, ErrorCategory.RPC],
  [UnauthorizedProviderError, ErrorCategory.RPC],
  [UnknownRpcError, ErrorCategory.RPC],
  [UnsupportedProviderMethodError, ErrorCategory.RPC],
  [UserRejectedRequestError, ErrorCategory.RPC],
  [FeeConflictError, ErrorCategory.TRANSACTION],
  [InvalidLegacyVError, ErrorCategory.TRANSACTION],
  [InvalidSerializableTransactionError, ErrorCategory.TRANSACTION],
  [InvalidSerializedTransactionError, ErrorCategory.TRANSACTION],
  [InvalidSerializedTransactionTypeError, ErrorCategory.TRANSACTION],
  [InvalidStorageKeySizeError, ErrorCategory.TRANSACTION],
  [TransactionExecutionError, ErrorCategory.TRANSACTION],
  [TransactionNotFoundError, ErrorCategory.TRANSACTION],
  [TransactionReceiptNotFoundError, ErrorCategory.TRANSACTION],
  [WaitForTransactionReceiptTimeoutError, ErrorCategory.TRANSACTION],
  [UrlRequiredError, ErrorCategory.TRANSPORT],
])

function getErrorType(
  error: BaseError,
  errorCategoryMap: Map<any, string>
): string {
  for (const [ErrorType] of errorCategoryMap) {
    const specificError = error.walk((err) => err instanceof ErrorType)
    if (specificError) {
      return ErrorType.name
    }
  }
  return 'UnknownError'
}

function formatErrorMessage(error: BaseError): string {
  const lines: string[] = []
  lines.push(`${error.shortMessage || error.message}`)

  if (error.cause) {
    let causeMessage: string
    if (error.cause instanceof Error) {
      causeMessage = error.cause.message
    } else if (typeof error.cause === 'object' && error.cause !== null) {
      try {
        const causeObj = error.cause as any
        if (causeObj.code && causeObj.message) {
          causeMessage = `${causeObj.message} (Code: ${causeObj.code})`
        } else {
          causeMessage = stringifyWithBigInt(error.cause)
        }
      } catch {
        causeMessage = Object.keys(error.cause)
          .map((key) => `${key}: ${String((error.cause as any)[key])}`)
          .join(', ')
      }
    } else {
      causeMessage = String(error.cause)
    }
    lines.push(`• Cause: ${causeMessage}`)
  }

  if (error.metaMessages?.length) {
    lines.push(`• Details:\n  - ${error.metaMessages.join('\n  - ')}`)
  }

  return lines.join('\n')
}

export function parseViemError(error: BaseError): LancaClientError {
  if (error instanceof BaseError) {
    const errorType = getErrorType(error, errorCategoryMap)

    const prettyMessage = formatErrorMessage(error)

    return new LancaClientError(
      `[Lanca][${errorType || 'UnknownError'}]`,
      prettyMessage,
      error
    )
  }

  return new LancaClientError(
    'UnknownError',
    typeof error === 'string' ? error : 'Unknown error occurred',
    undefined
  )
}
