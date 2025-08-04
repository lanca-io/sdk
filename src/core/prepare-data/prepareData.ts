import type { Address } from 'viem'
import type { Hex } from 'viem'
import type { IInputRouteData } from '../../types'
import type { IIntegration } from '../../types'
import type { SwapArgs } from '../../types'
import type { IPrepareTransactionArgsReturnType } from '../../types'
import { zeroAddress } from 'viem'
import { compressData } from './compressData'

enum TxType {
	SWAP = 'swap',
	SWAP_AND_BRIDGE = 'swapAndBridge',
	BRIDGE = 'bridge',
}

export const prepareData = (
	data: IInputRouteData,
	senderAddress: Address,
	integrator?: Address,
	feeBps?: bigint,
	receiverAddress?: Address,
): IPrepareTransactionArgsReturnType => {
	const { srcSwapData, bridgeData, dstSwapData } = data

	const integratorAddress: Address = integrator ?? zeroAddress
	const feePoints: bigint = feeBps ?? 0n
	const recipient: Address = receiverAddress ?? senderAddress

	const integratorInfo: Readonly<IIntegration> = {
		integrator: integratorAddress,
		feeBps: feePoints,
	}

	let parameters: SwapArgs = [srcSwapData, recipient, integratorInfo]
	let transaction: TxType = TxType.SWAP

	if (bridgeData) {
		const compressedData: Hex = dstSwapData.length > 0 ? compressData(dstSwapData) : '0x'
		bridgeData.compressedDstSwapData = compressedData
		parameters = [bridgeData, integratorInfo]

		if (srcSwapData.length > 0) {
			transaction = TxType.SWAP_AND_BRIDGE
			parameters.splice(1, 0, srcSwapData)
		} else {
			transaction = TxType.BRIDGE
		}
	}

	return { functionName: transaction, args: parameters }
}
