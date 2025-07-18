import type { Address } from 'viem'
import type { Chain } from 'viem'
import type { Client } from 'viem'
import type { ISwapDirectionData } from '../../types'
import type { UpdateRouteHook } from '../../types'
import type { IRouteType } from '../../types'
import { ContractFunctionExecutionError } from 'viem'
import { UserRejectedRequestError } from 'viem'
import { getAllowance } from './getAllowance'
import { isZeroAddress } from '../../utils/isZeroAddress'
import { conceroAddressesMap as mainnetContracts } from '../../configs'
import { conceroV2AddressesMap as testnetContracts } from '../../configs'
import { UINT_MAX } from '../../constants'
import { StepType } from '../../types'
import { Status } from '../../types'
import { setTokenAllowance } from './setAllowance'
import { awaitApprovalTransaction } from './awaitApproval'
import { globalErrorHandler } from '../../errors'

export const handleAllowance = async (
	client: Client,
	chain: Chain,
	routeStatus: IRouteType,
	data: ISwapDirectionData,
	isTestnet: boolean,
	statusHook?: UpdateRouteHook,
) => {
	const { token, amount: tokenAmount } = data

	if (isZeroAddress(token.address)) return

	const index: number = routeStatus.steps[0]?.type === StepType.SWITCH_CHAIN ? 1 : 0
	routeStatus.steps.splice(index, 0, {
		type: StepType.ALLOWANCE,
		execution: { status: Status.NOT_STARTED },
	})
	statusHook?.(routeStatus)

	const amount: bigint = isTestnet ? UINT_MAX : BigInt(tokenAmount)
	const contract: Address = isTestnet ? testnetContracts[chain.id] : mainnetContracts[chain.id]
	const senderAddress: Address = client.account!.address

	const { execution } = routeStatus.steps[index]

	execution!.status = Status.PENDING
	statusHook?.(routeStatus)

	try {
		const txHash = await setTokenAllowance(client, chain, token.address, contract, amount)
		if (!txHash) {
			execution!.status = Status.SUCCESS
			statusHook?.(routeStatus)
			return
		}

		const { receipt, reason } = await awaitApprovalTransaction(client, txHash, chain.id)
		if (receipt?.status !== 'success') {
			throw new Error(`Transaction failed with status: ${receipt?.status} Reason: ${reason}`)
		}

		const approvedAmount = await getAllowance(client, token.address, senderAddress, contract)
		if (approvedAmount < amount) {
			throw new Error(`Allowance not sufficient after transaction: required ${amount}, got ${approvedAmount}`)
		}

		execution!.status = Status.SUCCESS
		statusHook?.(routeStatus)
		return
	} catch (e) {
		if (
			e instanceof UserRejectedRequestError ||
			(e instanceof ContractFunctionExecutionError && e.message.includes('rejected'))
		) {
			execution!.status = Status.REJECTED
			execution!.error = 'User rejected the request'
			statusHook?.(routeStatus)
			throw globalErrorHandler.parse(e)
		}
		execution!.status = Status.FAILED
		execution!.error = 'Failed to approve allowance'
		statusHook?.(routeStatus)
		throw globalErrorHandler.parse(e)
	}
}
