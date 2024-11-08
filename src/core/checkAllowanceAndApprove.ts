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
		routeStatus.approveAllowance.status = Status.SUCCESS
		return
	}

	const conceroAddress = conceroAddressesMap[chain.id]
	const allowance = await publicClient.readContract({ //@review-from-oleg - Add bigint type
		abi: erc20Abi,
		functionName: 'allowance',
		address: token.address as `0x${string}`,
		args: [clientAddress, conceroAddress],
	})

	let approveTxHash = null
	const amountInDecimals = parseUnits(amount, token.decimals) //	@review-from-oleg - Add bigint type

	//@review-from-oleg - there is a logical error here. If allowance === amountInDecimals, the request will NOT be sent and approveTxHash will be null.
	// This will lead to routeStatus.approveAllowance.status = Status.FAILED.

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

		//	@review-from-oleg - If this throws, the status will remain PENDING.
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
