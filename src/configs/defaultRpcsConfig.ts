import { fallback, http } from 'viem'
import { arbitrum, avalanche, base, polygon } from 'viem/chains'
import { rpcsMap } from '../constants/rpcsMap'
import { ChainWithProvider } from '../types/chainWithProvider'

export const supportedViemChainsMap: Record<string, ChainWithProvider> = {
	'42161': {
		chain: arbitrum,
		provider: fallback(rpcsMap['42161'].map((url: string) => http(url))),
	},
	'8453': {
		chain: base,
		provider: fallback(rpcsMap['8453'].map((url: string) => http(url))),
	},
	'43114': {
		chain: avalanche,
		provider: fallback(rpcsMap['43114'].map((url: string) => http(url))),
	},
	'137': {
		chain: polygon,
		provider: fallback(rpcsMap['137'].map((url: string) => http(url))),
	},
	// '10': {
	// 	chain: optimism,
	// 	provider: http('https://optimism.publicnode.com'),
	// },
}
