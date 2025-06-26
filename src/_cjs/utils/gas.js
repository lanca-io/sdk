Object.defineProperty(exports, '__esModule', { value: true })
exports.getGasFees = void 0
const actions_1 = require('viem/actions')
const median_1 = require('./median')
const getGasFees = async (client) => {
  const block = await (0, actions_1.getBlock)(client, {
    includeTransactions: true,
  })
  const baseFeePerGas = block.baseFeePerGas
  if (!baseFeePerGas) {
    return { maxFeePerGas: undefined, maxPriorityFeePerGas: undefined }
  }
  const maxPriorityFeePerGasList = block.transactions
    .filter((tx) => tx.maxPriorityFeePerGas)
    .map((tx) => tx.maxPriorityFeePerGas)
  if (!maxPriorityFeePerGasList.length) {
    return { maxFeePerGas: undefined, maxPriorityFeePerGas: undefined }
  }
  let maxPriorityFeePerGasSum = 0n
  for (const value of maxPriorityFeePerGasList) {
    maxPriorityFeePerGasSum += value
  }
  const maxPriorityFeePerGasMedian =
    (0, median_1.median)(maxPriorityFeePerGasList) ?? 0n
  const maxPriorityFeePerGasAvg =
    maxPriorityFeePerGasSum / BigInt(maxPriorityFeePerGasList.length)
  const maxPriorityFeePerGas =
    maxPriorityFeePerGasMedian > maxPriorityFeePerGasAvg
      ? maxPriorityFeePerGasAvg
      : maxPriorityFeePerGasMedian
  const maxFeePerGas = baseFeePerGas + maxPriorityFeePerGas
  return { maxFeePerGas, maxPriorityFeePerGas }
}
exports.getGasFees = getGasFees
//# sourceMappingURL=gas.js.map
