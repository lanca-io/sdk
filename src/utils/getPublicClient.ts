import type { PublicClient } from 'viem'
import { createPublicClient, http } from 'viem'
import { supportedViemChainsMap } from '../configs'

const clients: Record<string, PublicClient> = {}

export function getPublicClient(chainId: string) {
    if (clients[chainId]) {
        return clients[chainId]
    }
    const { chain, provider } = supportedViemChainsMap[chainId]
    const publicClient = createPublicClient({
        chain,
        transport: provider ?? http(),
    })
    clients[chainId] = publicClient
}