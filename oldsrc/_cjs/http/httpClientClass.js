Object.defineProperty(exports, '__esModule', { value: true })
exports.HttpClient = void 0
const constants_1 = require('../constants')
const errors_1 = require('../errors')
const utils_1 = require('../utils')
class HttpClient {
  apiKey
  maxRetryCount
  constructor(apiKey = '', maxRetryCount = constants_1.DEFAULT_RETRY_COUNT) {
    this.apiKey = apiKey
    this.maxRetryCount = maxRetryCount
  }
  async request(url, options = {}) {
    const headers = {
      'x-lanca-version': '1.0.0',
      'x-lanca-integrator': 'lanca-sdk',
      'Content-Type': 'application/json',
      Accept: 'application/json',
    }
    if (this.apiKey) {
      headers['x-lanca-api-key'] = this.apiKey
    }
    options.headers = { ...options.headers, ...headers }
    let response = null
    let retryCount = 0
    let lancaError = null
    while (retryCount < this.maxRetryCount) {
      try {
        response = await fetch(url, {
          ...options,
          credentials: 'include',
        })
        if (response.ok) {
          return await response.json()
        }
        const errorResponse = await response.json()
        if (response.status >= 400 && response.status < 500) {
          lancaError = errors_1.globalErrorHandler.parse(errorResponse)
          await errors_1.globalErrorHandler.handle(lancaError)
          break
        }
      } catch (error) {
        if (this.isNetworkError(error)) {
          console.warn(
            `Network error occurred. Retrying... (${retryCount++}/${this.maxRetryCount})`
          )
        }
        await errors_1.globalErrorHandler.handle(error)
      }
      if (response?.status) {
        retryCount++
      }
      await (0, utils_1.sleep)(constants_1.DEFAULT_REQUEST_RETRY_INTERVAL_MS)
    }
    throw lancaError
  }
  async get(url, options = {}) {
    if (options instanceof URLSearchParams) {
      url += `?${options.toString()}`
      options = {}
    }
    return this.request(url, { ...options, method: 'GET' })
  }
  async post(url, options = {}) {
    return this.request(url, { ...options, method: 'POST' })
  }
  isNetworkError(error) {
    return (
      error instanceof TypeError ||
      error?.message.includes('NetworkError') ||
      error?.message.includes('failed to fetch')
    )
  }
}
exports.HttpClient = HttpClient
//# sourceMappingURL=httpClientClass.js.map
