import type { IRouteType } from '../../types'
import type { IInputRouteData } from '../../types'
import type { IBridgeData } from '../../types'
import type { IInputSwapData } from '../../types'
import type { IRouteStep } from '../../types'
import type { Address } from 'viem'
import { StepType } from '../../types'
import { buildBridge } from './buildBridge'
import { buildSwap } from './buildSwap'

export const buildRoute = (
	route: IRouteType,
	fromAddress: Address,
	isTestnet: boolean,
	receiverAddress?: Address,
): IInputRouteData => {
	const steps = route.steps ?? []
	const receiver = receiverAddress ?? fromAddress

	let bridgeData: IBridgeData | null = null
	const sourceSwapData: IInputSwapData[] = []
	const destinationSwapData: IInputSwapData[] = []

	for (const step of steps) {
		switch (step.type) {
			case StepType.BRIDGE: {
				bridgeData = buildBridge(step as IRouteStep, fromAddress, receiver, isTestnet)
				break
			}
			case StepType.SRC_SWAP: {
				for (const internalStep of (step as IRouteStep).internalSteps) {
					sourceSwapData.push(buildSwap(internalStep))
				}
				break
			}
			case StepType.DST_SWAP: {
				for (const internalStep of (step as IRouteStep).internalSteps) {
					destinationSwapData.push(buildSwap(internalStep))
				}
				break
			}
			default: {
				break
			}
		}
	}

	return {
		sourceData: sourceSwapData,
		bridgeData: bridgeData,
		destinationData: destinationSwapData,
	}
}
