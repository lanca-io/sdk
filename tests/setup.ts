import { Address } from 'viem'

export const FROM_ADDRESS = '0xa1c9e0381150Eb24d164Ef0Db18E606e65F751Af'.toLowerCase() as Address
export const TO_ADDRESS = '0xf4eac421F8fA86E499b56848605E604e3ff6D22F'.toLowerCase() as Address
export const DEFAULT_SLIPPAGE = '0.5'

export const TEST_TIMEOUT = 100_000
export const TOKENS_MAP: Record<string, Record<string, Address>> = {
	'8453': { USDC: '0x833589fcd6edb6e08f4c7c32d4f71b54bda02913', ETH: '0x0000000000000000000000000000000000000000' },
	'137': { USDC: '0x3c499c542cef5e3811e1192ce70d8cc03d5c3359' },
	'42161': {
		USDC: '0xaf88d065e77c8cc2239327c5edb3a432268e5831',
		ETH: '0x0000000000000000000000000000000000000000',
		WETH: '0x82af49447d8a07e3bd95bd0d56f35241523fbab1',
	},
	'43114': { USDC: '0xb97ef9ef8734c71904d8002f8b6bc66dd9c48a6e', USDT: '0x9702230a8ea53601f5cd2dc00fdbc13d4df4a8c7' },
}
