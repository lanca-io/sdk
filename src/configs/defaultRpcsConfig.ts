import { fallback, http } from 'viem'
import { arbitrum, avalanche, base, optimism, polygon } from 'viem/chains'
import { rpcsMap } from '../constants/rpcsMap'
import { ChainWithProvider } from '../types/chainWithProvider'

const options = {
	onFetchResponse(response: Response) {
		if (!response.ok) {
			if (response.status >= 500 && response.status <= 599) {
				throw new Error('RPC Server error, switching to another node...')
			}
		}
	},
}

export const supportedViemChainsMap: Record<string, ChainWithProvider> = {
	'42161': {
		chain: arbitrum,
		provider: fallback(rpcsMap['42161'].map((url: string) => http(url, options))),
	},
	'8453': {
		chain: base,
		provider: fallback(rpcsMap['8453'].map((url: string) => http(url, options))),
	},
	'43114': {
		chain: avalanche,
		provider: fallback(rpcsMap['43114'].map((url: string) => http(url, options))),
	},
	'137': {
		chain: polygon,
		provider: fallback(rpcsMap['137'].map((url: string) => http(url, options))),
	},
	'10': {
		chain: optimism,
		provider: fallback(rpcsMap['10'].map((url: string) => http(url, options))),
	},
}
