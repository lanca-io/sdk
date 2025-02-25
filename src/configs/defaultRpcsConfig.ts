import { fallback } from 'viem'
import { SUPPORTED_CHAINS } from '../constants'
import { rpcsMap } from '../constants'
import { createCustomHttp } from '../http'
import { IChainWithProvider } from '../types'

const options = {
	onFetchResponse(response: Response) {
		if (!response.ok) {
			console.log('RPC node response:', {
				status: response.status,
				node: response.url,
			})
			const { status } = response
			if ((status >= 500 && status <= 599) || status === 429 || status === 403) {
				throw new Error('RPC Server error, switching to another node...')
			}
		}
	},
	batch: true,
}

const fallbackOptions = {
	retryCount: 3,
	rank: true,
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
