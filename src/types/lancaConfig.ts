import { Address } from 'viem'
import { ChainWithProvider } from './chainWithProvider'

export type RpcConfig = Record<string, ChainWithProvider>
export interface LancaClientConfig {
	integratorAddress?: Address
	feeBps?: bigint
	chains?: RpcConfig
}
