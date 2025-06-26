Object.defineProperty(exports, '__esModule', { value: true })
exports.SUPPORTED_OP_CHAINS = exports.SUPPORTED_CHAINS = void 0
const chains_1 = require('viem/chains')
exports.SUPPORTED_CHAINS = [
  chains_1.arbitrum,
  chains_1.optimism,
  chains_1.avalanche,
  chains_1.base,
  chains_1.polygon,
]
exports.SUPPORTED_OP_CHAINS = {
  [chains_1.optimism.id]: true,
  [chains_1.base.id]: true,
  [chains_1.arbitrum.id]: false,
  [chains_1.avalanche.id]: false,
  [chains_1.polygon.id]: false,
}
//# sourceMappingURL=supportedChains.js.map
