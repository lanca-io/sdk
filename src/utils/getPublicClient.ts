import { http, createPublicClient } from 'viem'
import { supportedViemChainsMap } from '../configs'

export function getPublicClient(chainId: string) {
  const { chain, provider } = supportedViemChainsMap[chainId]
  const publicClient = createPublicClient({
    chain,
    transport: provider ?? http(),
  })

  return publicClient
}
