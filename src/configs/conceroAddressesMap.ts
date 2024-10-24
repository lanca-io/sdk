import { config } from './config'
import { type Address } from 'viem'

export const conceroAddressesMap: Record<string, Address> = {
	'421614': '0xD3baA389560081394C2e08330ebE8595E8a55e61', // arb sepolia
	'11155420': '0x019C13276f86B42ee46a3fd857535E856b054279', // opt sepolia
	'84532': '0x5FcA77ba9Bb3CF34874ecbBB6AcDD24Bed554597', // base sepolia

	// MAINNET
	'137': config.CONCERO_PROXY_POLYGON,
	'42161': config.CONCERO_PROXY_ARBITRUM,
	'8453': config.CONCERO_PROXY_BASE,
	'43114': config.CONCERO_PROXY_AVALANCHE,
}
