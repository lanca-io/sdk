import { Address, Hex } from 'viem'
import { StepType, SwapDirectionData, TxStep } from './tx'

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

export interface Fee {
	type: string
	amount: string
	token: ConceroToken
}

export interface RouteTool {
	name: string
	amountOutMin?: string
	logoURL: string
	data?: {
		dexRouter: Address
		dexCallData: Hex
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
	fees?: Fee[]
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
	fromAddress: Address
	toAddress: Address
}

export interface IGetTokens {
	chainId: string
	name?: string
	symbol?: string
	limit?: string
}
