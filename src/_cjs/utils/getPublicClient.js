Object.defineProperty(exports, '__esModule', { value: true })
exports.getPublicClient = getPublicClient
const viem_1 = require('viem')
const configs_1 = require('../configs')
function getPublicClient(chainId) {
  const { chain, provider } = configs_1.supportedViemChainsMap[chainId]
  const publicClient = (0, viem_1.createPublicClient)({
    chain,
    transport: provider ?? (0, viem_1.http)(),
  })
  return publicClient
}
//# sourceMappingURL=getPublicClient.js.map
