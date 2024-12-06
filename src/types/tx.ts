import { TxName, SwapArgs } from './contractInputTypes'
import { ConceroChain, ConceroToken } from './routeType'

export interface SwapDirectionData {
	token: ConceroToken
	chain: ConceroChain
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
	SWITCH_CHAIN = 'SWITCH_CHAIN'
}

export interface TxStep {
	type?: StepType
	status: Status
	txHash?: string
	error?: string
}

export interface PrepareTransactionArgsReturnType {
	txName: TxName
	args: SwapArgs
	isFromNativeToken: boolean
	fromAmount: bigint
}
