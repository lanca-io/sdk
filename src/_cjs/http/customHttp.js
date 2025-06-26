Object.defineProperty(exports, '__esModule', { value: true })
exports.createCustomHttp = createCustomHttp
function createCustomHttp(url, options) {
  return () => ({
    name: `customHttp-${url}`,
    async request({ method, params }) {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jsonrpc: '2.0',
          id: Date.now(),
          method,
          params,
        }),
      })
      const jsonResponse = await response.json()
      if (method === 'eth_getTransactionByHash' && !jsonResponse.result) {
        throw new Error('Transaction not found')
      }
      if (!response.ok || jsonResponse.error) {
        throw new Error(
          `Error from ${url}: ${jsonResponse.error?.message || response.statusText}`
        )
      }
      return jsonResponse.result
    },
    config: options,
  })
}
//# sourceMappingURL=customHttp.js.map
