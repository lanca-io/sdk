import { FallbackTransport } from 'viem'

export type RpcConfig = Record<number, string[]> | Record<number, FallbackTransport>
export interface LancaSDKConfig {
	integratorId: string
	feeTier: number
	chains?: RpcConfig
}
