import { Address, Hash, PublicClient, WalletClient, zeroAddress } from 'viem'
import { InputRouteData, SwapArgs, TxName } from '../types'
import { conceroAbi } from '../abi'

export async function sendTransaction(
	txArgs: InputRouteData,
	publicClient: PublicClient,
	walletClient: WalletClient,
	conceroAddress: Address,
	clientAddress: Address,
): Promise<Hash> {
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

	const { request } = await publicClient.simulateContract({
		account: clientAddress,
		abi: conceroAbi,
		functionName: txName,
		address: conceroAddress,
		args,
		gas: 3_000_000n,
		gasPrice,
		...(isFromNativeToken && { value: srcSwapData[0].fromAmount })
	})

	return await walletClient.writeContract(request)
}
