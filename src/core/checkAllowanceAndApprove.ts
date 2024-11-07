import { Address, erc20Abi, parseUnits, PublicClient, WalletClient, zeroAddress } from 'viem'
import { Status, SwapDirectionData } from '../types/tx'
import { conceroAddressesMap } from '../configs'
import { RouteTypeExtended, UpdateRouteHook } from '../types'

export async function checkAllowanceAndApprove(
	walletClient: WalletClient,
	publicClient: PublicClient,
	txData: SwapDirectionData,
	clientAddress: Address,
	routeStatus: RouteTypeExtended,
	updateRouteStatusHook?: UpdateRouteHook,
) {
	const { token, amount, chain } = txData
	if (token.address === zeroAddress) {
		return
	}

	if (!chain) {
		return
	}

	const conceroAddress = conceroAddressesMap[chain.id]
	const allowance = await publicClient.readContract({
		abi: erc20Abi,
		functionName: 'allowance',
		address: token.address as `0x${string}`,
		args: [clientAddress, conceroAddress],
	})

	let approveTxHash = null
	const amountInDecimals = parseUnits(amount, token.decimals)

	if (allowance < amountInDecimals) {
		const { request } = await publicClient.simulateContract({
			account: clientAddress,
			address: token.address as `0x${string}`,
			abi: erc20Abi,
			functionName: 'approve',
			args: [conceroAddress, amountInDecimals],
		})

		routeStatus.approveAllowance.status = Status.PENDING
		updateRouteStatusHook?.(routeStatus)

		approveTxHash = await walletClient.writeContract(request)
	}

	if (approveTxHash) {
		await publicClient.waitForTransactionReceipt({ hash: approveTxHash })
		routeStatus.approveAllowance = {
			status: Status.SUCCESS,
			txHash: approveTxHash,
		}
	} else {
		routeStatus.approveAllowance = {
			status: Status.FAILED,
			txHash: '',
			error: 'Failed to approve allowance'
		}
	}
	updateRouteStatusHook?.(routeStatus)
}
