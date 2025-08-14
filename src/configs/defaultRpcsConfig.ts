import type { IChainWithProvider } from '../types'
import { fallback } from 'viem'
import { SUPPORTED_CHAINS } from '../constants'
import { rpcsMap } from '../constants'
import { createCustomHttp } from '../http'
import { DEFAULT_REQUEST_RETRY_INTERVAL_MS, DEFAULT_REQUEST_TIMEOUT_MS, DEFAULT_RETRY_COUNT } from '../constants'

const options = {
	onFetchResponse(response: Response) {
		if (!response.ok) {
			console.log('RPC node response:', {
				status: response.status,
				node: response.url,
			})
		}
	},
	batch: true,
}

const fallbackOptions = {
	retryCount: DEFAULT_RETRY_COUNT,
	retryDelay: DEFAULT_REQUEST_RETRY_INTERVAL_MS,
	timeout: DEFAULT_REQUEST_TIMEOUT_MS,
}

export const supportedViemChainsMap: Record<string, IChainWithProvider> = SUPPORTED_CHAINS.reduce(
	(acc, chain) => {
		const chainId = chain.id.toString()
		acc[chainId] = {
			chain,
			provider: fallback(
				rpcsMap[chainId].map((url: string) => createCustomHttp(url, options)),
				fallbackOptions,
			),
		}

		return acc
	},
	{} as Record<string, IChainWithProvider>,
)
