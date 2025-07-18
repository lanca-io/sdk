import type { Client } from 'viem'
import { createClient, http } from 'viem'
import { supportedViemChainsMap } from '../configs'

const clients: Record<string, Client> = {}

export const getPublicClient = async (chainId: number): Promise<Client> => {
	if (clients[chainId]) {
		return clients[chainId]
	}

	const { chain, provider } = supportedViemChainsMap[chainId]
	clients[chainId] = createClient({
		chain,
		transport: provider ?? http(),
	})

	return clients[chainId]
}
