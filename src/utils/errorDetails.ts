import type { Hash } from "viem";

export const getErrorDetails = async (hash: Hash, chainId: number) => {
    try {
        const res = await fetch(`https://api.tenderly.co/api/v1/public-contract/${chainId}/tx/${hash}`)
        const body = await res.json()
        return body
    } catch (_) {}
}