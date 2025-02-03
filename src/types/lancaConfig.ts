import { Address } from 'viem'
import { IChainWithProvider } from './chainWithProvider'

export type RpcConfig = Record<string, IChainWithProvider>
export interface ILancaClientConfig {
	integratorAddress?: Address
	feeBps?: bigint
	chains?: RpcConfig
}
