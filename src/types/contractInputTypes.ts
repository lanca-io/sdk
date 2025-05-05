import type { Address, Hex } from 'viem'

export interface IBridgeData {
	token: Address
	amount: bigint
	dstChainSelector: bigint
	receiver: Address
	compressedDstSwapData: Hex
}

export interface IInputSwapData {
	dexRouter: Address
	fromToken: Address
	fromAmount: bigint
	toToken: Address
	toAmount: bigint
	toAmountMin: bigint
	dexCallData: Hex
}

export interface IIntegration {
	integrator: Address
	feeBps: bigint
}

export type TxName = 'swap' | 'bridge' | 'swapAndBridge'

export interface IInputRouteData {
	bridgeData: IBridgeData | null
	srcSwapData: IInputSwapData[]
	dstSwapData: IInputSwapData[]
}

export type SwapArgs = Array<IInputSwapData[] | IBridgeData | bigint | Address | IIntegration | string>
