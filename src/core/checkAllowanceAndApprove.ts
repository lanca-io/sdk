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
	const allowance: bigint = await publicClient.readContract({
		abi: erc20Abi,
		functionName: 'allowance',
		address: token.address as Address,
		args: [clientAddress, conceroAddress],
	})

	const amountInDecimals: bigint = parseUnits(amount, token.decimals)

	if (allowance >= amountInDecimals) {
		routeStatus.approveAllowance = {
			status: Status.SUCCESS,
		}
		updateRouteStatusHook?.(routeStatus)
		return
	}

	const { request } = await publicClient.simulateContract({
		account: clientAddress,
		address: token.address as Address,
		abi: erc20Abi,
		functionName: 'approve',
		args: [conceroAddress, amountInDecimals],
	})

	routeStatus.approveAllowance.status = Status.PENDING
	updateRouteStatusHook?.(routeStatus)

	try {
		const approveTxHash = await walletClient.writeContract(request)
		if (approveTxHash) {
			await publicClient.waitForTransactionReceipt({ hash: approveTxHash })
			routeStatus.approveAllowance = {
				status: Status.SUCCESS,
				txHash: approveTxHash,
			}
		} else {
			routeStatus.approveAllowance = {
				status: Status.FAILED,
				error: 'Failed to approve allowance'
			}
		}
	} catch (error) {
		routeStatus.approveAllowance = {
			status: Status.FAILED,
			error: 'Failed to approve allowance'
		}
	}

	updateRouteStatusHook?.(routeStatus)
}
