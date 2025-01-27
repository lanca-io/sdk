import { fallback } from 'viem'
import { arbitrum, avalanche, base, optimism, polygon } from 'viem/chains'
import { rpcsMap } from '../constants/rpcsMap'
import { createCustomHttp } from '../http'
import { ChainWithProvider } from '../types/chainWithProvider'

const options = {
	onFetchResponse(response: Response) {
		if (!response.ok) {
			console.log('RPC node response:', {
				status: response.status,
				node: response.url,
			})
			if ((response.status >= 500 && response.status <= 599) || response.status === 429) {
				throw new Error('RPC Server error, switching to another node...')
			}
		}
	},
	batch: true,
}

const fallbackOptions = {
	retryCount: 10,
	retryDelay: 3000,
}

export const supportedViemChainsMap: Record<string, ChainWithProvider> = {
	'42161': {
		chain: arbitrum,
		provider: fallback(
			rpcsMap['42161'].map((url: string) => createCustomHttp(url, options)),
			fallbackOptions,
		),
	},
	'8453': {
		chain: base,
		provider: fallback(
			rpcsMap['8453'].map((url: string) => createCustomHttp(url, options)),
			fallbackOptions,
		),
	},
	'43114': {
		chain: avalanche,
		provider: fallback(
			rpcsMap['43114'].map((url: string) => createCustomHttp(url, options)),
			fallbackOptions,
		),
	},
	'137': {
		chain: polygon,
		provider: fallback(
			rpcsMap['137'].map((url: string) => createCustomHttp(url, options)),
			fallbackOptions,
		),
	},
	'10': {
		chain: optimism,
		provider: fallback(
			rpcsMap['10'].map((url: string) => createCustomHttp(url, options)),
			fallbackOptions,
		),
	},
}
