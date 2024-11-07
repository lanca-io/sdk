import { type WalletClient } from 'viem'
import { RouteTypeExtended } from './routeType'
import { Status } from './tx'

export type SwitchChainHook = (chainId: number) => Promise<WalletClient | undefined | void>

export interface ExecutionState {
	status: Status
	txHash: `0x${string}`
	error?: string
}

export type UpdateRouteHook = (executionStateArray: RouteTypeExtended) => void

export interface ExecutionConfigs {
	switchChainHook?: SwitchChainHook
	updateRouteStatusHook?: UpdateRouteHook
	txLink?: string
}
