import { ConceroChain, ConceroToken, Status } from './routeType'

export interface SwapDirectionData {
	token: ConceroToken
	chain?: ConceroChain
	amount: string
}

export interface Transaction {
	data: string
	to: string
	from: string
	value: string
	blockNumber: number
}

export enum TxType {
	SRC_SWAP = 'SRC_SWAP',
	BRIDGE = 'BRIDGE',
	DST_SWAP = 'DST_SWAP',
}

export interface TxStep {
	type: TxType
	status: Status
	txHash: string
	error?: string
}