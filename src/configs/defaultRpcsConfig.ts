import { RpcConfig } from '../types'

export const defaultRpcsConfig: RpcConfig = {
	'137': ['https://polygon.meowrpc.com', 'https://polygon-pokt.nodies.app', 'https://polygon-bor-rpc.publicnode.com'],
	'42161': [
		'https://arbitrum-mainnet.infura.io/v3/f4f2c85489af448eb26b4eaeaaa99f1c',
		'https://1rpc.io/arb',
		'https://endpoints.omniatech.io/v1/arbitrum/one/public',
		'https://arbitrum.meowrpc.com',
	],
	'43114': ['https://avalanche-c-chain-rpc.publicnode.com', 'https://avalanche.drpc.org', 'https://1rpc.io/avax/c'],
	'8453': ['https://base-rpc.publicnode.com', 'https://base.drpc.org', 'https://1rpc.io/base'],
}
