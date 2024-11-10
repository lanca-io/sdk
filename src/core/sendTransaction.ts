import { Address, Hash, PublicClient, WalletClient } from 'viem'
import { InputRouteData, SwapArgs, TxName } from '../types'
import { conceroAbi } from '../abi'
import { isNative } from '../utils/isNative'
import { defaultGasCount } from '../constants'

export async function sendTransaction(
	txArgs: InputRouteData,
	publicClient: PublicClient,
	walletClient: WalletClient,
	conceroAddress: Address,
	clientAddress: Address,
): Promise<Hash | undefined> {
	const { srcSwapData, bridgeData, dstSwapData } = txArgs
	let txName: TxName = 'swap'
	let args: SwapArgs = [srcSwapData, clientAddress]

	if (srcSwapData.length > 0 && bridgeData) {
		txName = 'swapAndBridge'
		args = [bridgeData, srcSwapData, dstSwapData]
	}
	if (srcSwapData.length === 0 && bridgeData) {
		txName = 'bridge'
		args = [bridgeData, dstSwapData]
	}

	const gasPrice = await publicClient.getGasPrice()
	const isFromNativeToken = srcSwapData.length > 0 && isNative(srcSwapData[0].fromToken)

	let txHash
	try {
		const { request } = await publicClient.simulateContract({
			account: clientAddress,
			abi: conceroAbi,
			functionName: txName,
			address: conceroAddress,
			args,
			gas: defaultGasCount,
			gasPrice,
			...(isFromNativeToken && { value: srcSwapData[0].fromAmount })
		})
		txHash = await walletClient.writeContract(request)
	} catch (error) {
		console.error(error)
	}

	return txHash
}
