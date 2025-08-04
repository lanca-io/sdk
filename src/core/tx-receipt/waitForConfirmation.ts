import type { Client, Hash, TransactionReceipt, ReplacementReturnType, Chain, ReplacementReason } from 'viem'
import { getPublicClient } from '../../utils'
import { waitForReceipt } from './waitForReceipt'

export const waitForConfirmation = async (
	client: Client,
	chainId: number,
	txHash: Hash,
	onReplaced?: (response: ReplacementReturnType<Chain | undefined>) => void,
): Promise<{ receipt?: TransactionReceipt; reason?: ReplacementReason }> => {
	let { receipt, reason } = await waitForReceipt(client, txHash, onReplaced)

	if (!receipt?.status) {
		const publicClient: Client = await getPublicClient(chainId)
		const result = await waitForReceipt(publicClient, txHash, onReplaced)
		receipt = result.receipt
		reason = result.reason
	}

	return { receipt, reason }
}
