import { type Address, Hex } from 'viem'

// @review we always use "I" convention for interfaces
export interface BridgeData {
	amount: bigint
	dstChainSelector: bigint
	receiver: Address
}

// @review we always use "I" convention for interfaces
export interface InputSwapData {
	dexRouter: Address
	fromToken: Address
	fromAmount: bigint
	toToken: Address
	toAmount: bigint
	toAmountMin: bigint
	dexCallData: Hex
}

// @review we always use "I" convention for interfaces
export interface Integration {
	integrator: Address
	feeBps: bigint
}

export type TxName = 'swap' | 'bridge' | 'swapAndBridge'

// @review we always use "I" convention for interfaces
export interface InputRouteData {
	bridgeData: BridgeData | null
	srcSwapData: InputSwapData[]
	dstSwapData: InputSwapData[]
}

export type SwapArgs = Array<InputSwapData[] | BridgeData | bigint | Address | Integration | string>
