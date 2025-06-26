Object.defineProperty(exports, '__esModule', { value: true })
exports.ChainSwitchError =
  exports.InvalidChainError =
  exports.ChainConfigurationError =
  exports.ChainMismatchError =
  exports.UnsupportedContractError =
  exports.ChainAddError =
  exports.ChainNotFoundError =
  exports.UnrecognizedChainError =
  exports.UserRejectedError =
  exports.MissingParamsError =
  exports.WrongSlippageError =
  exports.AmountBelowFeeError =
  exports.TooLowAmountError =
  exports.TooHighAmountError =
  exports.HTTPError =
  exports.NoRouteError =
  exports.PublicClientError =
  exports.WalletClientError =
  exports.TokensAreTheSameError =
  exports.WrongAmountError =
  exports.UnsupportedChainError =
  exports.UnsupportedTokenError =
  exports.LancaClientError =
    void 0
class LancaClientError extends Error {
  errorName
  cause
  details
  docsPath
  metaMessages
  shortMessage
  version
  constructor(errorName, message, cause, metaMessages, version) {
    super(message)
    this.errorName = errorName
    this.cause = cause
    this.metaMessages = metaMessages
    this.shortMessage = message
    this.version = version
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, this.constructor)
    }
  }
  static fromBaseError(errorName, message, baseError) {
    return new LancaClientError(
      errorName,
      message || baseError.message,
      baseError,
      baseError.metaMessages,
      baseError.version
    )
  }
  toString() {
    let result = `${this.errorName}: ${this.message}`
    if (this.metaMessages && this.metaMessages.length > 0) {
      result += '\nDetails:'
      for (const msg of this.metaMessages) {
        result += `\n- ${msg}`
      }
    }
    if (this.docsPath) {
      result += `\nDocumentation: ${this.docsPath}`
    }
    return result
  }
}
exports.LancaClientError = LancaClientError
class UnsupportedTokenError extends LancaClientError {
  constructor(tokens, cause) {
    super('UnsupportedToken', `Unsupported tokens: ${tokens.join(', ')}`, cause)
  }
}
exports.UnsupportedTokenError = UnsupportedTokenError
class UnsupportedChainError extends LancaClientError {
  constructor(chains, cause) {
    super('UnsupportedChain', `Unsupported chains: ${chains.join(', ')}`, cause)
  }
}
exports.UnsupportedChainError = UnsupportedChainError
class WrongAmountError extends LancaClientError {
  constructor(amount, cause) {
    super('WrongAmount', `Wrong amount: ${amount}`, cause)
  }
}
exports.WrongAmountError = WrongAmountError
class TokensAreTheSameError extends LancaClientError {
  constructor(tokens, cause) {
    super(
      'TokensAreTheSame',
      `Tokens are the same: ${tokens.join(', ')}`,
      cause
    )
  }
}
exports.TokensAreTheSameError = TokensAreTheSameError
class WalletClientError extends LancaClientError {
  constructor(error, cause) {
    super('WalletClientError', `Wallet client error: ${error}`, cause)
  }
}
exports.WalletClientError = WalletClientError
class PublicClientError extends LancaClientError {
  constructor(error, cause) {
    super('PublicClientError', `Public client error: ${error}`, cause)
  }
}
exports.PublicClientError = PublicClientError
class NoRouteError extends LancaClientError {
  constructor(error, cause) {
    super('NoRouteError', `No route found: ${error}`, cause)
  }
}
exports.NoRouteError = NoRouteError
class HTTPError extends LancaClientError {
  response
  url
  options
  constructor(error, response, url, options, cause) {
    super('RequestError', `Request error: ${error}`, cause)
    this.response = response
    this.url = url
    this.options = options
  }
}
exports.HTTPError = HTTPError
class TooHighAmountError extends LancaClientError {
  constructor(amount, cause) {
    super('TooHighAmount', `Too high amount: ${amount}`, cause)
  }
}
exports.TooHighAmountError = TooHighAmountError
class TooLowAmountError extends LancaClientError {
  constructor(amount, cause) {
    super('TooLowAmount', `Too low amount: ${amount}`, cause)
  }
}
exports.TooLowAmountError = TooLowAmountError
class AmountBelowFeeError extends LancaClientError {
  constructor(amount, cause) {
    super('AmountBelowFeeError', `Amount below fee: ${amount}`, cause)
  }
}
exports.AmountBelowFeeError = AmountBelowFeeError
class WrongSlippageError extends LancaClientError {
  constructor(slippage, cause) {
    super('WrongSlippage', `Wrong slippage: ${slippage}`, cause)
  }
}
exports.WrongSlippageError = WrongSlippageError
class MissingParamsError extends LancaClientError {
  constructor(params, cause) {
    super('MissingParams', `Missing params: ${params.join(', ')}`, cause)
  }
}
exports.MissingParamsError = MissingParamsError
class UserRejectedError extends LancaClientError {
  constructor(cause) {
    super('UserRejected', 'User rejected', cause)
  }
}
exports.UserRejectedError = UserRejectedError
class UnrecognizedChainError extends LancaClientError {
  constructor(cause) {
    super('UnrecognizedChain', 'Unrecognized chain', cause)
  }
}
exports.UnrecognizedChainError = UnrecognizedChainError
class ChainNotFoundError extends LancaClientError {
  constructor(cause) {
    super('ChainNotFound', 'Chain not found', cause)
  }
}
exports.ChainNotFoundError = ChainNotFoundError
class ChainAddError extends LancaClientError {
  constructor(cause) {
    super('ChainAddError', 'Failed to add chain', cause)
  }
}
exports.ChainAddError = ChainAddError
class UnsupportedContractError extends LancaClientError {
  constructor(cause) {
    super('UnsupportedContract', 'Chain does not support this contract', cause)
  }
}
exports.UnsupportedContractError = UnsupportedContractError
class ChainMismatchError extends LancaClientError {
  constructor(details, cause) {
    super('ChainMismatch', `Chain mismatch error: ${details}`, cause)
  }
}
exports.ChainMismatchError = ChainMismatchError
class ChainConfigurationError extends LancaClientError {
  constructor(details, cause) {
    super('ChainConfiguration', `Chain configuration error: ${details}`, cause)
  }
}
exports.ChainConfigurationError = ChainConfigurationError
class InvalidChainError extends LancaClientError {
  constructor(details, cause) {
    super('InvalidChain', `Invalid chain: ${details}`, cause)
  }
}
exports.InvalidChainError = InvalidChainError
class ChainSwitchError extends LancaClientError {
  constructor(details, cause) {
    super('Chain switch Error', `Switch Error: ${details}`, cause)
  }
}
exports.ChainSwitchError = ChainSwitchError
//# sourceMappingURL=lancaErrors.js.map
