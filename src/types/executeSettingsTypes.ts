import { Address, type WalletClient } from 'viem'
import { RouteType } from './routeType'
import { Status } from './tx'

export type SwitchChainHook = (chainId: number) => Promise<WalletClient | undefined | void>

export interface ExecutionInfo {
	status: Status
	txHash: Address
	error?: string
}

export type UpdateRouteHook = (executionState: RouteType) => void

export interface ExecutionConfigs {
	switchChainHook?: SwitchChainHook
	updateRouteStatusHook?: UpdateRouteHook
	txLink?: string
}
