import { EIP1193RequestFn, Transport, TransportConfig } from 'viem'

export function createCustomHttp(url: string, options?: unknown): Transport {
	return () => ({
		name: `customHttp-${url}`,

		async request({ method, params }: { method: string; params?: unknown }) {
			const response = await fetch(url, {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					jsonrpc: '2.0',
					id: Date.now(),
					method,
					params,
				}),
			})

			const jsonResponse = await response.json()

			if (method === 'eth_getTransactionByHash' && !jsonResponse.result) {
				throw new Error('Transaction not found')
			}

			if (!response.ok || jsonResponse.error) {
				throw new Error(`Error from ${url}: ${jsonResponse.error?.message || response.statusText}`)
			}

			return jsonResponse.result
		},
		config: options as TransportConfig<string, EIP1193RequestFn>,
	})
}
