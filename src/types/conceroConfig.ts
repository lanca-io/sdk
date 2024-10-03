import { FallbackTransport, WalletClient } from "viem";

export type RpcConfig =
	| Record<number, string[]>
	| Record<number, FallbackTransport>;
export interface ConceroConfig {
	integratorId: string;
	feeTier: number;
	chains: RpcConfig;
	walletClient?: WalletClient;
}
