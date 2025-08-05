import type { Client, Hash, ReplacementReason, TransactionReceipt } from 'viem'
import { waitForConfirmation } from '../tx-receipt'

export const awaitTransaction = async (
	client: Client,
	txHash: Hash,
	chainId: number,
): Promise<{ receipt?: TransactionReceipt; reason?: ReplacementReason }> => {
	const { receipt, reason } = await waitForConfirmation(client, chainId, txHash)
	return { receipt, reason }
}
