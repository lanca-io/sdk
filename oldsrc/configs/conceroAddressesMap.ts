import type { Address } from 'viem'
import { conceroProxyMap } from './conceroProxyMap'

export const conceroAddressesMap: Record<string, Address> = {
  // MAINNET
  '10': conceroProxyMap.CONCERO_PROXY_OPTIMISM,
  '137': conceroProxyMap.CONCERO_PROXY_POLYGON,
  '42161': conceroProxyMap.CONCERO_PROXY_ARBITRUM,
  '8453': conceroProxyMap.CONCERO_PROXY_BASE,
  '43114': conceroProxyMap.CONCERO_PROXY_AVALANCHE,
}
