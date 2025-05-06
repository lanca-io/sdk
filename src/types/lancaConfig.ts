import type { Address } from 'viem'
import type { IChainWithProvider } from './chainWithProvider'

export type RpcConfig = Record<string, IChainWithProvider>
export interface ILancaClientConfig {
	integratorAddress?: Address
	feeBps?: bigint
	chains?: RpcConfig
	testnet?: boolean
}
