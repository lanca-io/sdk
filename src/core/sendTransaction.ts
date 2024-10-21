import { Address, PublicClient, WalletClient, zeroAddress } from 'viem'
import { InputRouteData, SwapArgs, TxName } from '../types'
import { conceroAbi } from '../abi'

export async function sendTransaction(
	txArgs: InputRouteData,
	publicClient: PublicClient,
	walletClient: WalletClient,
	conceroAddress: Address,
	clientAddress: Address,
) {
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
	const isFromNativeToken = srcSwapData.length > 0 && srcSwapData[0].fromToken === zeroAddress

	return await walletClient.writeContract({
		chain: null,
		account: clientAddress,
		abi: conceroAbi,
		functionName: txName,
		address: conceroAddress,
		args,
		gas: 3_000_000n,
		gasPrice,
		value: isFromNativeToken ? srcSwapData[0].fromAmount : undefined,
	})
}
