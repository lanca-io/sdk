import { Address, Hex } from 'viem'
import { StepType, SwapDirectionData, TxStep } from './tx'

export interface LancaToken {
	address: Address
	chainId: string
	decimals: number
	logoURL: string
	name: string
	symbol: string
	priceUsd: number
}

export interface LancaChain {
	id: string
	explorerURL: string
	logoURL: string
	name: string
}

export interface Fee {
	type: string
	amount: string
	token: LancaToken
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
	fromToken: Address
	toToken: Address
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
