import { Chain, Transport } from 'viem'

export interface ChainWithProvider {
	chain: Chain
	provider?: Transport
}
