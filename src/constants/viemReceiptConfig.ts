import { WaitForTransactionReceiptParameters } from 'viem'
import { DEFAULT_CONFIRMATIONS } from './default'

export const viemReceiptConfig: Partial<WaitForTransactionReceiptParameters> = {
	pollingInterval: 3_000,
	timeout: 0,
}
