import type { Hash } from 'viem'
import type { SwapArgs, TxName } from './contractInputTypes'
import type { ILancaChain, ILancaToken } from './routeType'

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

export interface ITxStepBase {
	type?: StepType
	status: Status
	error?: string
	receivedAmount?: string
}

export interface ITxStepSwap extends ITxStepBase {
	txHash: Hash
}

export interface ITxStepBridge extends ITxStepBase {
	srcTxHash: Hash
	dstTxHash: Hash
}

export type ITxStep = ITxStepSwap | ITxStepBridge

export interface IPrepareTransactionArgsReturnType {
	txName: TxName
	args: SwapArgs
	isFromNativeToken: boolean
	fromAmount: bigint
}
