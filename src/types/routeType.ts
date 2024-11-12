import { Address } from 'viem'
import { TxStep, StepType, SwapDirectionData } from './tx'

export interface ConceroToken {
	address: Address
	chainId: string
	decimals: number
	logoURL: string
	name: string
	symbol: string
	priceUsd: number
}

export interface ConceroChain {
	id: string
	explorerURL: string
	logoURL: string
	name: string
}

export interface RouteTool {
	name: string
	amountOutMin?: string
	logoURL: string
	params?: {
		fee?: number
		deadline?: number
		sqrPrice?: string
		path?: string
	}
}

export interface RouteInternalStep {
	from: SwapDirectionData
	to: SwapDirectionData
	tool: RouteTool
}

export interface RouteBaseStep {
	type: StepType
	execution?: TxStep
}

export interface RouteStep extends RouteBaseStep {
	from: SwapDirectionData
	to: SwapDirectionData
	internalSteps: RouteInternalStep[]
}

export interface RouteType {
	from: SwapDirectionData
	to: SwapDirectionData
	steps: Array<RouteStep | RouteBaseStep>
}

export interface IGetRoute {
	fromToken: string
	toToken: string
	fromChainId: string
	toChainId: string
	amount: string
	slippageTolerance: string
}

export interface IGetTokens {
	chainId: string
	name?: string
	symbol?: string
	limit?: string
}
