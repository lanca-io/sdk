import type { Client, Transaction } from 'viem'
import { getBlock } from 'viem/actions'
import { median } from './median'

/**
 * Calculates the optimal maxFeePerGas and maxPriorityFeePerGas based on the latest block transactions.
 *
 * @param client - The client instance to use for fetching the latest block.
 * @returns A promise that resolves to an object containing maxFeePerGas and maxPriorityFeePerGas or undefined if they cannot be computed.
 */
export const getGasFees = async (
	client: Client,
): Promise<{ maxFeePerGas: bigint | undefined; maxPriorityFeePerGas: bigint | undefined }> => {
	const block = await getBlock(client, {
		includeTransactions: true,
	})

	const baseFeePerGas = block.baseFeePerGas
	if (!baseFeePerGas) {
		return { maxFeePerGas: undefined, maxPriorityFeePerGas: undefined }
	}

	const maxPriorityFeePerGasList = (block.transactions as Transaction[])
		.filter(tx => tx.maxPriorityFeePerGas)
		.map(tx => tx.maxPriorityFeePerGas) as bigint[]

	if (!maxPriorityFeePerGasList.length) {
		return { maxFeePerGas: undefined, maxPriorityFeePerGas: undefined }
	}

	let maxPriorityFeePerGasSum = 0n
	for (const value of maxPriorityFeePerGasList) {
		maxPriorityFeePerGasSum += value
	}

	const maxPriorityFeePerGasMedian = median(maxPriorityFeePerGasList) ?? 0n
	const maxPriorityFeePerGasAvg = maxPriorityFeePerGasSum / BigInt(maxPriorityFeePerGasList.length)
	const maxPriorityFeePerGas =
		maxPriorityFeePerGasMedian > maxPriorityFeePerGasAvg ? maxPriorityFeePerGasAvg : maxPriorityFeePerGasMedian

	const maxFeePerGas = baseFeePerGas + maxPriorityFeePerGas

	return { maxFeePerGas, maxPriorityFeePerGas }
}
