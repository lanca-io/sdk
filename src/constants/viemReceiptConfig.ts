import type { WaitForTransactionReceiptParameters } from 'viem'

export const viemReceiptConfig: Partial<WaitForTransactionReceiptParameters> = {
	pollingInterval: 3_000,
	timeout: 0,
}
