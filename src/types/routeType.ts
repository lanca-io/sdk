import { Address, Hex } from 'viem'
import { StepType, SwapDirectionData, TxStep } from './tx'

// @review we always use "I" convention for interfaces
export interface LancaToken {
	address: Address
	chainId: string
	decimals: number
	logoURL: string
	name: string
	symbol: string
	priceUsd: number
}

// @review we always use "I" convention for interfaces
export interface LancaChain {
	id: string
	explorerURL: string
	logoURL: string
	name: string
}

// @review: unused
export enum FeeType {
	LancaFee = 'LancaFee',
	ConceroMessageFee = 'ConceroMessageFee',
	LancaPoolLPFee = 'LancaPoolLPFee',
	LancaPoolRebalanceFee = 'LancaPoolRebalanceFee',
	IntegratorFee = 'IntegratorFee',
}

// @review we always use "I" convention for interfaces
export interface Fee {
	type: FeeType
	amount: string
	token: LancaToken
}

// @review we always use "I" convention for interfaces
export interface RouteTool {
	name: string
	amountOutMin?: string
	logoURL: string
	data?: {
		dexRouter: Address
		dexCallData: Hex
	}
}

// @review we always use "I" convention for interfaces
export interface RouteInternalStep {
	from: SwapDirectionData
	to: SwapDirectionData
	tool: RouteTool
}

// @review we always use "I" convention for interfaces
export interface RouteBaseStep {
	type: StepType
	execution?: TxStep
}

// @review we always use "I" convention for interfaces
export interface RouteStep extends RouteBaseStep {
	from: SwapDirectionData
	to: SwapDirectionData
	internalSteps: RouteInternalStep[]
	fees?: Fee[]
}

// @review we always use "I" convention for interfaces. rename to ILancaRoute
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
