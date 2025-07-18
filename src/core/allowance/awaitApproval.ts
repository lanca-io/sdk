import type { Chain, Client, Hash, ReplacementReason, TransactionReceipt } from 'viem'
import type { ReplacementReturnType } from 'viem'
import { waitForTransactionReceipt } from 'viem/actions'
import { getPublicClient } from '../../utils'
import { DEFAULT_CONFIRMATIONS } from '../../constants'

export const awaitApprovalTransaction = async (
	client: Client,
	txHash: Hash,
	chainId: number,
): Promise<{ receipt?: TransactionReceipt; reason?: ReplacementReason }> => {
	const { receipt, reason } = await awaitTransactionReceipt(client, chainId, txHash)
	return { receipt, reason }
}

const awaitTransactionReceipt = async (
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

const waitForReceipt = async (
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
