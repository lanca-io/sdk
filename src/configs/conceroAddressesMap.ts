import { type Address } from 'viem'
import { conceroProxyMap } from './conceroProxyMap'

export const conceroAddressesMap: Record<string, Address> = {
	// V2 TESTNET
	'421614': '0x2fB5a5CE8d296E9f54B99e39cA14B28b4ff0292f',
	'84532': '0x7E09f05edA043e65f3c739Db594fd781b14a4ce9',
	'2021': '0xA80a668566517BeE1ab71df78B384e6281b02625',
	'6342': '0xC19D5300E11f71e6eA55941f5B6517FA87B879F4',

	// MAINNET
	'10': conceroProxyMap.CONCERO_PROXY_OPTIMISM,
	'137': conceroProxyMap.CONCERO_PROXY_POLYGON,
	'42161': conceroProxyMap.CONCERO_PROXY_ARBITRUM,
	'8453': conceroProxyMap.CONCERO_PROXY_BASE,
	'43114': conceroProxyMap.CONCERO_PROXY_AVALANCHE,
}
