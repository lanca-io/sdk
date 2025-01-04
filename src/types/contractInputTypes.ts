import { Hex, type Address } from 'viem'

export interface BridgeData {
	amount: bigint
	dstChainSelector: bigint
	receiver: Address
}

export interface InputSwapData {
	dexRouter: Address
	fromToken: Address
	fromAmount: bigint
	toToken: Address
	toAmount: bigint
	toAmountMin: bigint
	dexCallData: Hex
}

export interface Integration {
	integrator: Address
	feeBps: bigint
}

export type TxName = 'swap' | 'bridge' | 'swapAndBridge'

export interface InputRouteData {
	bridgeData: BridgeData | null
	srcSwapData: InputSwapData[]
	dstSwapData: InputSwapData[]
}

export type SwapArgs = Array<InputSwapData[] | BridgeData | bigint | Address | Integration | string>
