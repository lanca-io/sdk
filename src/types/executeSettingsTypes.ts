import { type WalletClient } from 'viem'

export type SwitchChainHook = (chainId: number) => Promise<WalletClient | undefined | void>

export enum ExecuteRouteStage {
	SwitchChain = 'SWITCH_CHAIN',
	Allowance = 'ALLOWANCE',
	Swap = 'SWAP',
	Bridge = 'BRIDGE',
}

export enum ExecuteRouteStatus {
	Pending = 'PENDING',
	Success = 'SUCCESS',
	Failed = 'FAILED',
	Rejected = 'REJECTED',
	NotStarted = 'NOT_STARTED',
}

export interface ExecuteRouteInfo {
	stage: ExecuteRouteStage
	status: ExecuteRouteStatus
}

// @review: why it is an array?
export type UpdateRouteHook = (executionStateArray: Array<ExecuteRouteInfo>) => void

export interface ExecutionConfigs {
	switchChainHook?: SwitchChainHook
	updateRouteStatusHook?: UpdateRouteHook
	txLink?: string
}
