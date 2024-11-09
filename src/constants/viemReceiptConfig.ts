import { WaitForTransactionReceiptParameters } from "viem";

export const viemReceiptConfig: Partial<WaitForTransactionReceiptParameters> = {
    pollingInterval: 3_000,
    retryCount: 500,
    confirmations: 2,
    timeout: 0
}