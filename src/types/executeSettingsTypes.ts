import type { WalletClient } from 'viem'
import type { IRouteType } from './routeType'

export type SwitchChainHook = (chainId: number) => Promise<WalletClient | undefined | void>
export type UpdateRouteHook = (executionState: IRouteType) => void

export interface IExecutionConfig {
	switchChainHook?: SwitchChainHook
	updateRouteStatusHook?: UpdateRouteHook
	txLink?: string
}
