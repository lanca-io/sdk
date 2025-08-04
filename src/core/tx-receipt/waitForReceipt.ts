import type { Client, Hash, ReplacementReturnType, Chain, ReplacementReason, TransactionReceipt } from 'viem'
import { waitForTransactionReceipt } from 'viem/actions'
import { DEFAULT_CONFIRMATIONS } from '../../constants'

export const waitForReceipt = async (
	client: Client,
	txHash: Hash,
	onReplaced?: (response: ReplacementReturnType<Chain | undefined>) => void,
): Promise<{ receipt?: TransactionReceipt; reason?: ReplacementReason }> => {
	let receipt: TransactionReceipt | undefined
	let reason: ReplacementReason | undefined

	try {
		receipt = await waitForTransactionReceipt(client, {
			hash: txHash,
			timeout: 0,
			confirmations: DEFAULT_CONFIRMATIONS,
			onReplaced: response => {
				reason = response.reason
				onReplaced?.(response)
			},
		})
	} catch (_) {}

	return { receipt, reason }
}
