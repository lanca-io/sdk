import { type WalletClient } from 'viem'
import { RouteTypeExtended } from './routeType'
import { Status } from './tx'

export type SwitchChainHook = (chainId: number) => Promise<WalletClient | undefined | void>

export interface ExecutionInfo {
	status: Status
	txHash: `0x${string}`
	error?: string
}

export enum ExecutionType {
	ALLOWANCE = 'ALLOWANCE',
	SWITCH_CHAIN = 'SWITCH_CHAIN'
}

export type UpdateRouteHook = (executionState: RouteTypeExtended) => void

export interface ExecutionConfigs {
	switchChainHook?: SwitchChainHook
	updateRouteStatusHook?: UpdateRouteHook
	txLink?: string
}
