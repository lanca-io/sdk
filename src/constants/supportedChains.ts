import {
	arbitrum,
	arbitrumSepolia,
	avalanche,
	avalancheFuji,
	base,
	baseSepolia,
	optimism,
	optimismSepolia,
	polygon,
	polygonAmoy,
} from 'viem/chains'

export const SUPPORTED_CHAINS = [
	arbitrum,
	optimism,
	avalanche,
	base,
	polygon, //mainnnet
	arbitrumSepolia,
	optimismSepolia,
	avalancheFuji,
	baseSepolia,
	polygonAmoy, //testnet
]
