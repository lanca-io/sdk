import { Address, FallbackTransport } from 'viem'

export type RpcConfig = Record<number, string[]> | Record<number, FallbackTransport>
export interface LancaClientConfig {
	integratorAddress: Address
	feeBps: number
	chains: RpcConfig
}
