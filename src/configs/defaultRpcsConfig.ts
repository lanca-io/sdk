import { fallback, http } from 'viem'
import { base, polygon, arbitrum, avalanche } from 'viem/chains'

export const defaultRpcsConfig = {
	[polygon.id]: fallback([
		http(),
		http('https://polygon.meowrpc.com'),
		http('https://polygon-pokt.nodies.app'),
		http('https://polygon-bor-rpc.publicnode.com'),
	]),
	[arbitrum.id]: fallback([
		http(),
		http('https://1rpc.io/arb'),
		http('https://endpoints.omniatech.io/v1/arbitrum/one/public'),
		http('https://arbitrum.meowrpc.com'),
	]),
	[avalanche.id]: fallback([
		http(),
		http('https://avalanche-c-chain-rpc.publicnode.com'),
		http('https://avalanche.drpc.org'),
		http('https://1rpc.io/avax/c'),
	]),
	[base.id]: fallback([
		http('https://base-rpc.publicnode.com'),
		http('https://base.drpc.org'),
		http('https://1rpc.io/base'),
	]),
}
