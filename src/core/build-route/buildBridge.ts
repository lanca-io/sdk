import type { Address, Hex } from 'viem'
import type { IRouteStep } from '../../types'
import type { IBridgeData } from '../../types'
import { v2ChainSelectors as v2Selectors } from '../../configs'
import { ccipChainSelectors as v1Selectors } from '../../configs'

export const buildBridge = (
	step: IRouteStep,
	senderAddress: Address,
	receiverAddress: Address,
	isTestnet: boolean,
): IBridgeData => {
	const { from, to } = step
	const token: Address = from.token.address
	const amount: bigint = BigInt(from.amount)
	const selector: bigint = isTestnet ? v2Selectors[to.chain.id] : v1Selectors[to.chain.id]
	const receiver: Address = receiverAddress ?? senderAddress

	const data = {
		token,
		amount,
		dstChainSelector: selector,
		receiver,
		compressedDstSwapData: '0x' as Hex,
	}

	return data
}
