import { ExecutionType } from './executeSettingsTypes'
import { ConceroChain, ConceroToken } from './routeType'

export interface SwapDirectionData {
	token: ConceroToken
	chain: ConceroChain
	amount: string
}

export interface Transaction {
	data: string
	to: string
	from: string
	value: string
	blockNumber: number
}

export enum Status {
	SUCCESS = 'SUCCESS',
	FAILED = 'FAILED',
	PENDING = 'PENDING',
	NOT_STARTED = 'NOT_STARTED',
	REJECTED = 'REJECTED',
}

export enum TxType {
	SRC_SWAP = 'SRC_SWAP',
	BRIDGE = 'BRIDGE',
	DST_SWAP = 'DST_SWAP',
}

export interface TxStep {
	type?: TxType | ExecutionType
	status: Status
	txHash: string
	error?: string
}