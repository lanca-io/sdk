import { ExecutionInfo } from "./executeSettingsTypes"
import { Status, TxType } from "./tx"

export interface ConceroToken {
	address: string
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
	from: {
		token: ConceroToken
		chain: ConceroChain
		amount: string
	}
	to: {
		token: ConceroToken
		chain: ConceroChain
		amount: string
	}
	tool: RouteTool
}

export interface RouteStep {
	type: TxType
	from: {
		token: ConceroToken
		chain: ConceroChain
		amount: string
	}
	to: {
		token: ConceroToken
		chain: ConceroChain
		amount: string
	}
	internalSteps: RouteInternalStep[]
	execution?: ExecutionInfo
}



export interface RouteType {
	from: {
		token: ConceroToken
		chain: ConceroChain
		amount: string
	}
	to: {
		token: ConceroToken
		chain: ConceroChain
		amount: string
	}
	steps: RouteStep[]
}

export interface RouteTypeExtended extends RouteType {
	switchChain: Status
	approveAllowance: Status
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
