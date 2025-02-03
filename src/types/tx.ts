import { Hash } from 'viem'
import { SwapArgs, TxName } from './contractInputTypes'
import { ILancaChain, ILancaToken } from './routeType'

export interface ISwapDirectionData {
	token: ILancaToken
	chain: ILancaChain
	amount: string
}

export enum Status {
	SUCCESS = 'SUCCESS',
	FAILED = 'FAILED',
	PENDING = 'PENDING',
	NOT_STARTED = 'NOT_STARTED',
	REJECTED = 'REJECTED',
}

export enum StepType {
	SRC_SWAP = 'SRC_SWAP',
	BRIDGE = 'BRIDGE',
	DST_SWAP = 'DST_SWAP',
	ALLOWANCE = 'ALLOWANCE',
	SWITCH_CHAIN = 'SWITCH_CHAIN',
}

export interface ITxStep {
	type?: StepType
	status: Status
	txHash?: Hash
	error?: string
	receivedAmount?: string
}

export interface IPrepareTransactionArgsReturnType {
	txName: TxName
	args: SwapArgs
	isFromNativeToken: boolean
	fromAmount: bigint
}
