import type { Address, Hex } from 'viem'
import type { ISwapDirectionData, ITxStep } from './tx'
import { StepType } from './tx'

export interface ILancaToken {
	address: Address
	chainId: string
	decimals: number
	logoURL: string
	name: string
	symbol: string
	priceUsd: number
}

export interface ILancaChain {
	id: string
	explorerURI: string
	logoURI: string
	name: string
}

export enum FeeType {
	LancaFee = 'LancaFee',
	ConceroMessageFee = 'ConceroMessageFee',
	LancaPoolLPFee = 'LancaPoolLPFee',
	LancaPoolRebalanceFee = 'LancaPoolRebalanceFee',
	IntegratorFee = 'IntegratorFee',
}

export interface IFee {
	type: FeeType
	amount: string
	token: ILancaToken
}

export interface IRouteTool {
	name: string
	amountOutMin?: string
	logoURL: string
	data?: {
		dexRouter: Address
		dexCallData: Hex
	}
}

export interface IRouteInternalStep {
	from: ISwapDirectionData
	to: ISwapDirectionData
	tool: IRouteTool
}

export interface IRouteBaseStep {
	type: StepType
	execution?: Partial<ITxStep>
}

export interface IRouteStep extends IRouteBaseStep {
	from: ISwapDirectionData
	to: ISwapDirectionData
	internalSteps: IRouteInternalStep[]
	fees?: IFee[]
}

export interface IRouteType {
	from: ISwapDirectionData
	to: ISwapDirectionData
	steps: Array<IRouteStep | IRouteBaseStep>
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
