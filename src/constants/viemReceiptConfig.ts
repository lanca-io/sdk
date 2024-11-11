import { WaitForTransactionReceiptParameters } from "viem";

export const viemReceiptConfig: Partial<WaitForTransactionReceiptParameters> = {
    pollingInterval: 3_000,
    confirmations: 2,
    timeout: 0
}