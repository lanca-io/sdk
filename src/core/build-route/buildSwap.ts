import type { IInputSwapData } from '../../types'
import type { ILancaToken } from '../../types'
import type { IRouteInternalStep } from '../../types'

export const buildSwap = (step: IRouteInternalStep): IInputSwapData => {
	const { tool, from, to } = step
	const fromToken: ILancaToken = from.token
	const toToken: ILancaToken = to.token

	const { amountOutMin } = tool
	const { dexCallData, dexRouter } = tool.data!

	const fromAmount: bigint = BigInt(from.amount)
	const toAmount: bigint = BigInt(to.amount)
	const toAmountMin: bigint = BigInt(amountOutMin!)

	const data: IInputSwapData = {
		dexRouter,
		fromToken: fromToken.address,
		fromAmount,
		toToken: toToken.address,
		toAmount,
		toAmountMin,
		dexCallData,
	}

	return data
}
