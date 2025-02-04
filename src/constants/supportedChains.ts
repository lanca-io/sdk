import { arbitrum, avalanche, base, optimism, polygon } from 'viem/chains'

export const SUPPORTED_CHAINS = [arbitrum, optimism, avalanche, base, polygon]

export const SUPPORTED_OP_CHAINS = {
    [optimism.id.toString()]: true,
    [base.id.toString()]: true,
    [arbitrum.id.toString()]: false,
    [avalanche.id.toString()]: false,
    [polygon.id.toString()]: false,
}
