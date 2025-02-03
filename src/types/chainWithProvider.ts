import { Chain, Transport } from 'viem'

export interface IChainWithProvider {
	chain: Chain
	provider?: Transport
}
