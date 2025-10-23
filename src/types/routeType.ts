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

export interface ILancaExtendedChain {
	id: number
	name: string
	selector: bigint
	logo: string
	nativeCurrency: {
		name: string
		symbol: string
		decimals: number
	}
	rpcUrls: {
		default: {
			http: string[]
		}
	}
	explorer: string | null
	testnet: boolean
	contracts: Partial<{
		usdc_e: string | null
		usdc: string | null
		bridge_lbf: string | null
		bridge_v2: string | null
		message_v2: string | null
		orchestrator: string | null
		message_v1: string | null
	}>
}

export enum DeploymentType {
	usdc_e = 'usdc_e',
	usdc = 'usdc',
	bridge_lbf = 'bridge_lbf',
	bridge_v2 = 'bridge_v2',
	message_v2 = 'message_v2',
	orchestrator = 'orchestrator',
	message_v1 = 'message_v1',
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
	sender: Address
	slippage?: string
	feePercentage?: Address
}

export interface IGetTokens {
	chainId: string
	name?: string
	symbol?: string
	limit?: string
}
