import type { Address, Client } from 'viem'
import type { IInputRouteData, IRouteStep, IRouteType, UpdateRouteHook } from '../../types'
import { StepType } from '../../types'
import { UserRejectedRequestError, ContractFunctionExecutionError } from 'viem'
import { buildRoute } from '../build-route'
import { prepareData } from '../prepare-data'
import { Status } from '../../types'
import { executeTransaction } from './executeTransaction'
import { conceroV2AddressesMap as V2Contracts } from '../../configs'
import { conceroAddressesMap as V1Contracts } from '../../configs'
import { globalErrorHandler } from '../../errors'

export const handleTransaction = async (
	client: Client,
	route: IRouteType,
	fromAddress: Address,
	toAddress?: Address,
	integratorAddress?: Address,
	feeBps?: bigint,
	isTestnet: boolean = false,
	statusHook?: UpdateRouteHook,
) => {
	const step: IRouteStep = route.steps.find(
		({ type }) => type === StepType.SRC_SWAP || type === StepType.BRIDGE,
	) as IRouteStep

	if (!step) {
		throw new Error('No valid step found for transaction execution')
	}

	step.execution!.status = Status.PENDING
	statusHook?.(route)

	try {
		if (!client || !client.chain || !client.chain.id) {
			step.execution!.status = Status.FAILED
			statusHook?.(route)
			throw new Error('Client is required to execute a transaction')
		}

		const contract: Address = isTestnet ? V2Contracts[client.chain.id] : V1Contracts[client.chain.id]

		if (!contract) {
			step.execution!.status = Status.FAILED
			statusHook?.(route)
			throw new Error(`No contract address found for chain ID: ${client.chain.id}`)
		}

		const routeData: IInputRouteData = buildRoute(route, fromAddress, isTestnet, toAddress)
		const txData = prepareData(routeData, fromAddress, integratorAddress, feeBps, toAddress)

		const fromToken: Address = step.from.token.address
		const selector: bigint | undefined = routeData.bridgeData?.dstChainSelector

		if (!selector) {
			step.execution!.status = Status.FAILED
			statusHook?.(route)
			throw new Error('Selector is required for transaction execution')
		}

		const amount: bigint | undefined = routeData.bridgeData?.amount
		if (!amount) {
			step.execution!.status = Status.FAILED
			statusHook?.(route)
			throw new Error('Amount is required for transaction execution')
		}

		const hash = await executeTransaction(
			client,
			contract,
			fromToken,
			selector,
			amount,
			txData.functionName,
			txData.args,
			isTestnet,
		)

		step.execution!.status = Status.SUCCESS
		statusHook?.(route)

		return hash
	} catch (e) {
		if (
			e instanceof UserRejectedRequestError ||
			(e instanceof ContractFunctionExecutionError && e.message.includes('rejected'))
		) {
			step.execution!.status = Status.REJECTED
			step.execution!.error = 'User rejected the request'
			statusHook?.(route)
			throw globalErrorHandler.parse(e)
		}

		step.execution!.status = Status.FAILED
		step.execution!.error = 'Failed to approve allowance'
		statusHook?.(route)
		throw globalErrorHandler.parse(e)
	}
}
