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
	integratorAddress?: Address,
	feeBps?: bigint,
	receiverAddress?: Address,
): IPrepareTransactionArgsReturnType => {
	const { sourceData, bridgeData, destinationData } = data

	const integrator: Address = integratorAddress ?? zeroAddress
	const feePoints: bigint = feeBps ?? 0n
	const recipient: Address = receiverAddress ?? senderAddress

	const integratorInfo: Readonly<IIntegration> = {
		integrator: integrator,
		feeBps: feePoints,
	}

	let parameters: SwapArgs = [sourceData, recipient, integratorInfo]
	let transaction: TxType = TxType.SWAP

	if (bridgeData) {
		const compressedData: Hex = destinationData.length > 0 ? compressData(destinationData) : '0x'
		bridgeData.compressedDstSwapData = compressedData
		parameters = [bridgeData, integratorInfo]

		if (sourceData.length > 0) {
			transaction = TxType.SWAP_AND_BRIDGE
			parameters.splice(1, 0, sourceData)
		} else {
			transaction = TxType.BRIDGE
		}
	}

	return { functionName: transaction, args: parameters }
}
