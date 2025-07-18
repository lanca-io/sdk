import type { Chain, Client } from 'viem'
import type { IRouteType, SwitchChainHook, UpdateRouteHook } from '../../types'
import type { ITxStep } from '../../types'
import { getEVMChain } from './getChain'
import { StepType } from '../../types'
import { Status } from '../../types'
import { getAction } from 'viem/utils'
import { switchChain } from 'viem/actions'
import { addEVMChain } from './addChain'
import { globalErrorHandler } from '../../errors'

const UNRECOGNIZED_CHAIN = 4902
const CHAIN_NOT_FOUND = -32603
const USER_REJECTED_REQUEST = 4001

export const switchEVMChain = async (
	client: Client,
	targetChain: Chain,
	routeStatus: IRouteType,
	chainHook: SwitchChainHook,
	routeHook: UpdateRouteHook,
) => {
	const currentId = await getEVMChain(client)

	if (currentId == targetChain.id) return

	routeStatus.steps.unshift({
		type: StepType.SWITCH_CHAIN,
		execution: { status: Status.PENDING },
	})

	const { execution } = routeStatus.steps[0]
	routeHook?.(routeStatus)

	switch (true) {
		case !!chainHook: {
			await chainHook(targetChain.id)
			execution!.status = Status.SUCCESS
			routeHook?.(routeStatus)
			return
		}
		default: {
			await attemptSwitch(client, targetChain, routeStatus, execution!, routeHook)
			execution!.status = Status.SUCCESS
			routeHook?.(routeStatus)
			return
		}
	}
}

const attemptSwitch = async (
	client: Client,
	chain: Chain,
	routeStatus: IRouteType,
	execution: Partial<ITxStep>,
	routeHook: UpdateRouteHook,
) => {
	if (!client) return

	try {
		await getAction(
			client,
			switchChain,
			'switchChain',
		)({
			id: chain.id,
		})
	} catch (e: unknown) {
		let code = (e as { code: number }).code
		if (code === UNRECOGNIZED_CHAIN || code === CHAIN_NOT_FOUND) {
			await attemptAdd(client, chain, routeStatus, execution, routeHook)
		} else if (code === USER_REJECTED_REQUEST) {
			execution!.status = Status.REJECTED
			execution!.error = 'User rejected chain switch'
			routeHook?.(routeStatus)
			throw globalErrorHandler.parse(e)
		} else {
			execution!.status = Status.FAILED
			execution!.error = 'Chain switch failed'
			throw globalErrorHandler.parse(e)
		}
	}
}

const attemptAdd = async (
	client: Client,
	chain: Chain,
	routeStatus: IRouteType,
	execution: Partial<ITxStep>,
	routeHook: UpdateRouteHook,
) => {
	if (!client) return

	try {
		await addEVMChain(client, chain)
	} catch (e) {
		execution!.status = Status.FAILED
		execution!.error = 'Failed to add chain'
		routeHook?.(routeStatus)
	}
}
