import { ConceroChain, ConceroToken } from './routeType'

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
