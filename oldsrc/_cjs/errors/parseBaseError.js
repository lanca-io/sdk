Object.defineProperty(exports, '__esModule', { value: true })
exports.ErrorCategory = void 0
exports.parseViemError = parseViemError
const viem_1 = require('viem')
const lancaErrors_1 = require('./lancaErrors')
const stringifyWithBigInt_1 = require('../utils/stringifyWithBigInt')
let ErrorCategory
;((ErrorCategory) => {
  ErrorCategory.ABI = 'ABI'
  ErrorCategory.ACCOUNT = 'Account'
  ErrorCategory.ADDRESS = 'Address'
  ErrorCategory.BLOCK = 'Block'
  ErrorCategory.CHAIN = 'Chain'
  ErrorCategory.CONTRACT = 'Contract'
  ErrorCategory.DATA = 'Data'
  ErrorCategory.ENCODING = 'Encoding'
  ErrorCategory.ENS = 'ENS'
  ErrorCategory.ESTIMATE_GAS = 'EstimateGas'
  ErrorCategory.LOG = 'Log'
  ErrorCategory.NODE = 'Node'
  ErrorCategory.REQUEST = 'Request'
  ErrorCategory.RPC = 'RPC'
  ErrorCategory.SIWE = 'SIWE'
  ErrorCategory.TRANSACTION = 'Transaction'
  ErrorCategory.TRANSPORT = 'Transport'
  ErrorCategory.UNKNOWN = 'Unknown'
})(ErrorCategory || (exports.ErrorCategory = ErrorCategory = {}))
const errorCategoryMap = new Map([
  [viem_1.AbiConstructorNotFoundError, ErrorCategory.ABI],
  [viem_1.AbiConstructorParamsNotFoundError, ErrorCategory.ABI],
  [viem_1.AbiDecodingDataSizeInvalidError, ErrorCategory.ABI],
  [viem_1.AbiDecodingDataSizeTooSmallError, ErrorCategory.ABI],
  [viem_1.AbiDecodingZeroDataError, ErrorCategory.ABI],
  [viem_1.AbiEncodingArrayLengthMismatchError, ErrorCategory.ABI],
  [viem_1.AbiEncodingBytesSizeMismatchError, ErrorCategory.ABI],
  [viem_1.AbiEncodingLengthMismatchError, ErrorCategory.ABI],
  [viem_1.AbiErrorInputsNotFoundError, ErrorCategory.ABI],
  [viem_1.AbiErrorNotFoundError, ErrorCategory.ABI],
  [viem_1.AbiErrorSignatureNotFoundError, ErrorCategory.ABI],
  [viem_1.AbiEventNotFoundError, ErrorCategory.ABI],
  [viem_1.AbiEventSignatureEmptyTopicsError, ErrorCategory.ABI],
  [viem_1.AbiEventSignatureNotFoundError, ErrorCategory.ABI],
  [viem_1.AbiFunctionNotFoundError, ErrorCategory.ABI],
  [viem_1.AbiFunctionOutputsNotFoundError, ErrorCategory.ABI],
  [viem_1.AbiFunctionSignatureNotFoundError, ErrorCategory.ABI],
  [viem_1.BytesSizeMismatchError, ErrorCategory.ABI],
  [viem_1.DecodeLogTopicsMismatch, ErrorCategory.ABI],
  [viem_1.InvalidAbiDecodingTypeError, ErrorCategory.ABI],
  [viem_1.InvalidAbiEncodingTypeError, ErrorCategory.ABI],
  [viem_1.InvalidArrayError, ErrorCategory.ABI],
  [viem_1.InvalidDefinitionTypeError, ErrorCategory.ABI],
  [viem_1.UnsupportedPackedAbiType, ErrorCategory.ABI],
  [viem_1.InvalidAddressError, ErrorCategory.ADDRESS],
  [viem_1.BlockNotFoundError, ErrorCategory.BLOCK],
  [viem_1.ChainDoesNotSupportContract, ErrorCategory.CHAIN],
  [viem_1.ChainMismatchError, ErrorCategory.CHAIN],
  [viem_1.ChainNotFoundError, ErrorCategory.CHAIN],
  [viem_1.ClientChainNotConfiguredError, ErrorCategory.CHAIN],
  [viem_1.InvalidChainIdError, ErrorCategory.CHAIN],
  [viem_1.SwitchChainError, ErrorCategory.CHAIN],
  [viem_1.CallExecutionError, ErrorCategory.CONTRACT],
  [viem_1.ContractFunctionExecutionError, ErrorCategory.CONTRACT],
  [viem_1.ContractFunctionRevertedError, ErrorCategory.CONTRACT],
  [viem_1.ContractFunctionZeroDataError, ErrorCategory.CONTRACT],
  [viem_1.RawContractError, ErrorCategory.CONTRACT],
  [viem_1.SizeExceedsPaddingSizeError, ErrorCategory.DATA],
  [viem_1.IntegerOutOfRangeError, ErrorCategory.ENCODING],
  [viem_1.InvalidBytesBooleanError, ErrorCategory.ENCODING],
  [viem_1.InvalidHexBooleanError, ErrorCategory.ENCODING],
  [viem_1.InvalidHexValueError, ErrorCategory.ENCODING],
  [viem_1.SizeOverflowError, ErrorCategory.ENCODING],
  [viem_1.EstimateGasExecutionError, ErrorCategory.ESTIMATE_GAS],
  [viem_1.FilterTypeNotSupportedError, ErrorCategory.LOG],
  [viem_1.ExecutionRevertedError, ErrorCategory.NODE],
  [viem_1.FeeCapTooHighError, ErrorCategory.NODE],
  [viem_1.FeeCapTooLowError, ErrorCategory.NODE],
  [viem_1.InsufficientFundsError, ErrorCategory.NODE],
  [viem_1.IntrinsicGasTooHighError, ErrorCategory.NODE],
  [viem_1.IntrinsicGasTooLowError, ErrorCategory.NODE],
  [viem_1.NonceMaxValueError, ErrorCategory.NODE],
  [viem_1.NonceTooHighError, ErrorCategory.NODE],
  [viem_1.NonceTooLowError, ErrorCategory.NODE],
  [viem_1.TipAboveFeeCapError, ErrorCategory.NODE],
  [viem_1.TransactionTypeNotSupportedError, ErrorCategory.NODE],
  [viem_1.UnknownNodeError, ErrorCategory.NODE],
  [viem_1.HttpRequestError, ErrorCategory.REQUEST],
  [viem_1.RpcRequestError, ErrorCategory.REQUEST],
  [viem_1.TimeoutError, ErrorCategory.REQUEST],
  [viem_1.WebSocketRequestError, ErrorCategory.REQUEST],
  [viem_1.ChainDisconnectedError, ErrorCategory.RPC],
  [viem_1.InternalRpcError, ErrorCategory.RPC],
  [viem_1.InvalidInputRpcError, ErrorCategory.RPC],
  [viem_1.InvalidParamsRpcError, ErrorCategory.RPC],
  [viem_1.InvalidRequestRpcError, ErrorCategory.RPC],
  [viem_1.JsonRpcVersionUnsupportedError, ErrorCategory.RPC],
  [viem_1.LimitExceededRpcError, ErrorCategory.RPC],
  [viem_1.MethodNotFoundRpcError, ErrorCategory.RPC],
  [viem_1.MethodNotSupportedRpcError, ErrorCategory.RPC],
  [viem_1.ParseRpcError, ErrorCategory.RPC],
  [viem_1.ProviderDisconnectedError, ErrorCategory.RPC],
  [viem_1.ProviderRpcError, ErrorCategory.RPC],
  [viem_1.ResourceNotFoundRpcError, ErrorCategory.RPC],
  [viem_1.ResourceUnavailableRpcError, ErrorCategory.RPC],
  [viem_1.RpcError, ErrorCategory.RPC],
  [viem_1.TransactionRejectedRpcError, ErrorCategory.RPC],
  [viem_1.UnauthorizedProviderError, ErrorCategory.RPC],
  [viem_1.UnknownRpcError, ErrorCategory.RPC],
  [viem_1.UnsupportedProviderMethodError, ErrorCategory.RPC],
  [viem_1.UserRejectedRequestError, ErrorCategory.RPC],
  [viem_1.FeeConflictError, ErrorCategory.TRANSACTION],
  [viem_1.InvalidLegacyVError, ErrorCategory.TRANSACTION],
  [viem_1.InvalidSerializableTransactionError, ErrorCategory.TRANSACTION],
  [viem_1.InvalidSerializedTransactionError, ErrorCategory.TRANSACTION],
  [viem_1.InvalidSerializedTransactionTypeError, ErrorCategory.TRANSACTION],
  [viem_1.InvalidStorageKeySizeError, ErrorCategory.TRANSACTION],
  [viem_1.TransactionExecutionError, ErrorCategory.TRANSACTION],
  [viem_1.TransactionNotFoundError, ErrorCategory.TRANSACTION],
  [viem_1.TransactionReceiptNotFoundError, ErrorCategory.TRANSACTION],
  [viem_1.WaitForTransactionReceiptTimeoutError, ErrorCategory.TRANSACTION],
  [viem_1.UrlRequiredError, ErrorCategory.TRANSPORT],
])
function getErrorType(error, errorCategoryMap) {
  for (const [ErrorType] of errorCategoryMap) {
    const specificError = error.walk((err) => err instanceof ErrorType)
    if (specificError) {
      return ErrorType.name
    }
  }
  return 'UnknownError'
}
function formatErrorMessage(error) {
  const lines = []
  lines.push(`${error.shortMessage || error.message}`)
  if (error.cause) {
    let causeMessage
    if (error.cause instanceof Error) {
      causeMessage = error.cause.message
    } else if (typeof error.cause === 'object' && error.cause !== null) {
      try {
        const causeObj = error.cause
        if (causeObj.code && causeObj.message) {
          causeMessage = `${causeObj.message} (Code: ${causeObj.code})`
        } else {
          causeMessage = (0, stringifyWithBigInt_1.stringifyWithBigInt)(
            error.cause
          )
        }
      } catch {
        causeMessage = Object.keys(error.cause)
          .map((key) => `${key}: ${String(error.cause[key])}`)
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
function parseViemError(error) {
  if (error instanceof viem_1.BaseError) {
    const errorType = getErrorType(error, errorCategoryMap)
    const prettyMessage = formatErrorMessage(error)
    return new lancaErrors_1.LancaClientError(
      `[Lanca][${errorType || 'UnknownError'}]`,
      prettyMessage,
      error
    )
  }
  return new lancaErrors_1.LancaClientError(
    'UnknownError',
    typeof error === 'string' ? error : 'Unknown error occurred',
    undefined
  )
}
//# sourceMappingURL=parseBaseError.js.map
