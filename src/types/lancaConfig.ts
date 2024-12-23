import { Address} from 'viem'

export type RpcConfig = Record<string, string[]> //| Record<string, FallbackTransport> | Record<string, HttpTransport[]>
export interface LancaClientConfig {
	integratorAddress?: Address
	feeBps?: bigint
	chains?: RpcConfig
}
