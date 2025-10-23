import { BASE_URL } from '../constants'

export const conceroApi = {
	route: `${BASE_URL}/route`,
	routeStatus: `${BASE_URL}/route/status`,
	tokens: `${BASE_URL}/tokens`,
	mainnet_chains: `${BASE_URL}/chains/configuration?is_testnet=false`,
	testnet_chains: `${BASE_URL}/chains/configuration?is_testnet=true`,
}
