import { Address, erc20Abi, parseUnits, PublicClient, WalletClient } from 'viem'
import { Status, StepType, SwapDirectionData } from '../types'
import { conceroAddressesMap } from '../configs'
import { RouteType, UpdateRouteHook } from '../types'
import { isNative } from '../utils'

export async function checkAllowanceAndApprove(
	walletClient: WalletClient,
	publicClient: PublicClient,
	txData: SwapDirectionData,
	clientAddress: Address,
	routeStatus: RouteType,
	updateRouteStatusHook?: UpdateRouteHook,
): Promise<void> {
	const { token, amount, chain } = txData
	if (isNative(token.address)) {
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

	const isSwitchStepPresent = routeStatus.steps[0].type === StepType.SWITCH_CHAIN
	const allowanceIndex = isSwitchStepPresent ? 1 : 0

	routeStatus.steps.splice(allowanceIndex, 0, {
		type: StepType.ALLOWANCE,
		execution: {
			status: Status.NOT_STARTED
		}
	})

	const { execution } = routeStatus.steps[allowanceIndex]

	if (allowance >= amountInDecimals) {
		execution.status = Status.SUCCESS
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

	execution.status = Status.PENDING
	updateRouteStatusHook?.(routeStatus)

	try {
		const approveTxHash = await walletClient.writeContract(request)
		if (approveTxHash) {
			await publicClient.waitForTransactionReceipt({ hash: approveTxHash })
			execution.status = Status.SUCCESS
			execution.txHash = approveTxHash
		} else {
			execution.status = Status.FAILED
			execution.error = 'Failed to approve allowance'
		}
	} catch (error) {
		execution.status = Status.FAILED
		execution.error = 'Failed to approve allowance'
	}

	updateRouteStatusHook?.(routeStatus)
}
