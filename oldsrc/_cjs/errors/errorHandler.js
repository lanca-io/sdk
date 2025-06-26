Object.defineProperty(exports, '__esModule', { value: true })
exports.ErrorHandler = void 0
const types_1 = require('./types')
const lancaErrors_1 = require('./lancaErrors')
const stringifyWithBigInt_1 = require('../utils/stringifyWithBigInt')
const viem_1 = require('viem')
const parseBaseError_1 = require('./parseBaseError')
const errorLogger_1 = require('./errorLogger')
class ErrorHandler {
  logger
  constructor(level) {
    this.logger = new errorLogger_1.ErrorLogger('lanca-sdk', level ?? 'error')
  }
  async handle(error) {
    this.logger.error(error)
  }
  parse(error) {
    if ('type' in error) {
      const lancaError = error
      const { type } = lancaError
      switch (type) {
        case types_1.RoutingErrorType.TOKEN_NOT_SUPPORTED:
          return new lancaErrors_1.UnsupportedTokenError(lancaError.tokens)
        case types_1.RoutingErrorType.CHAIN_NOT_SUPPORTED:
          return new lancaErrors_1.UnsupportedChainError(lancaError.chains)
        case types_1.RoutingErrorType.NO_ROUTE_FOUND:
          return new lancaErrors_1.NoRouteError(lancaError.error)
        case types_1.RoutingErrorType.TOO_HIGH_AMOUNT:
          return new lancaErrors_1.TooHighAmountError(lancaError.amount)
        case types_1.RoutingErrorType.TOO_LOW_AMOUNT:
          return new lancaErrors_1.TooLowAmountError(lancaError.amount)
        case types_1.RoutingErrorType.AMOUNT_BELOW_FEE:
          return new lancaErrors_1.AmountBelowFeeError(lancaError.amount)
        case types_1.RoutingErrorType.WRONG_AMOUNT:
          return new lancaErrors_1.WrongAmountError(lancaError.amount)
        case types_1.RoutingErrorType.WRONG_SLIPPAGE:
          return new lancaErrors_1.WrongSlippageError(
            lancaError.slippageTolerance
          )
        case types_1.RoutingErrorType.MISSING_PARAMS:
          return new lancaErrors_1.MissingParamsError(lancaError.missingParams)
        case types_1.RoutingErrorType.SAME_TOKENS:
          return new lancaErrors_1.TokensAreTheSameError(lancaError.tokens)
      }
    }
    if (error instanceof viem_1.BaseError) {
      return (0, parseBaseError_1.parseViemError)(error)
    }
    if (error instanceof Error) {
      return new lancaErrors_1.LancaClientError(
        'UnknownError',
        error.message,
        error
      )
    }
    return new lancaErrors_1.LancaClientError(
      'UnknownError',
      (0, stringifyWithBigInt_1.stringifyWithBigInt)(error),
      error.cause
    )
  }
}
exports.ErrorHandler = ErrorHandler
//# sourceMappingURL=errorHandler.js.map
