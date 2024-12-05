import { Address, FallbackTransport } from 'viem'

export type RpcConfig = Record<number, string[]> | Record<number, FallbackTransport>
export interface LancaSDKConfig {
	integratorAddress: Address
	feeBps: number
	chains?: RpcConfig
}
