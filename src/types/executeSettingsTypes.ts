import { type WalletClient } from 'viem'
import { RouteType } from './routeType'

export type SwitchChainHook = (chainId: number) => Promise<WalletClient | undefined | void>
export type UpdateRouteHook = (executionState: RouteType) => void

export interface ExecutionConfig {
	switchChainHook?: SwitchChainHook
	updateRouteStatusHook?: UpdateRouteHook
	txLink?: string
}
