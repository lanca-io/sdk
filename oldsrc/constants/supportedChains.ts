import { arbitrum, avalanche, base, optimism, polygon } from 'viem/chains'

export const SUPPORTED_CHAINS = [arbitrum, optimism, avalanche, base, polygon]

export const SUPPORTED_OP_CHAINS: Record<number, boolean> = {
  [optimism.id]: true,
  [base.id]: true,
  [arbitrum.id]: false,
  [avalanche.id]: false,
  [polygon.id]: false,
}
