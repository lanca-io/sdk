import { DEFAULT_CONFIRMATIONS } from './default'

export const CHAIN_CONFIRMATIONS: Record<number, number> = {
	3636: 1,
}

export function getChainConfirmations(chainId: number): number {
	if (CHAIN_CONFIRMATIONS[chainId]) {
		return CHAIN_CONFIRMATIONS[chainId]
	}

	return DEFAULT_CONFIRMATIONS
}
