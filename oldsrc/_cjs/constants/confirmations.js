Object.defineProperty(exports, '__esModule', { value: true })
exports.CHAIN_CONFIRMATIONS = void 0
exports.getChainConfirmations = getChainConfirmations
const default_1 = require('./default')
exports.CHAIN_CONFIRMATIONS = {
  3636: 1,
}
function getChainConfirmations(chainId) {
  if (exports.CHAIN_CONFIRMATIONS[chainId]) {
    return exports.CHAIN_CONFIRMATIONS[chainId]
  }
  return default_1.DEFAULT_CONFIRMATIONS
}
//# sourceMappingURL=confirmations.js.map
