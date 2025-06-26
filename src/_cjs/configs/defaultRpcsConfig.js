Object.defineProperty(exports, '__esModule', { value: true })
exports.supportedViemChainsMap = void 0
const viem_1 = require('viem')
const constants_1 = require('../constants')
const constants_2 = require('../constants')
const http_1 = require('../http')
const constants_3 = require('../constants')
const ERROR_FORBIDDEN = 403
const ERROR_TIMEOUT = 408
const ERROR_TOO_MANY_REQUESTS = 429
const ERROR_SERVER_MIN = 500
const ERROR_SERVER_MAX = 599
const options = {
  onFetchResponse(response) {
    if (!response.ok) {
      const { status } = response
      if (
        (status >= ERROR_SERVER_MIN && status <= ERROR_SERVER_MAX) ||
        status === ERROR_TOO_MANY_REQUESTS ||
        status === ERROR_FORBIDDEN ||
        status === ERROR_TIMEOUT
      ) {
        throw new Error('RPC Server error, switching to another node...')
      }
    }
  },
  batch: true,
}
const fallbackOptions = {
  retryCount: constants_3.DEFAULT_RETRY_COUNT,
  retryDelay: constants_3.DEFAULT_REQUEST_RETRY_INTERVAL_MS,
  timeout: constants_3.DEFAULT_REQUEST_TIMEOUT_MS,
}
exports.supportedViemChainsMap = constants_1.SUPPORTED_CHAINS.reduce(
  (acc, chain) => {
    const chainId = chain.id.toString()
    acc[chainId] = {
      chain,
      provider: (0, viem_1.fallback)(
        constants_2.rpcsMap[chainId].map((url) =>
          (0, http_1.createCustomHttp)(url, options)
        ),
        fallbackOptions
      ),
    }
    return acc
  },
  {}
)
//# sourceMappingURL=defaultRpcsConfig.js.map
