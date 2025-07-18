import type { IRouteType } from '../../types'
import type { IRouteStep } from '../../types'
import type { UpdateRouteHook } from '../../types'
import type { ITxStep } from '../../types'
import { StepType } from '../../types'
import { Status } from '../../types'

export class StatusManager {
	static initRouteStatuses(route: IRouteType): IRouteType {
		return {
			...route,
			steps: route.steps.map(step =>
				StatusManager.isActionStep(step.type) ? { ...step, execution: { status: Status.NOT_STARTED } } : step,
			),
		}
	}

	static setAllStatuses(route: IRouteType, status: Status, error?: string, onUpdate?: UpdateRouteHook) {
		for (const step of route.steps) {
			if (StatusManager.isActionStep(step.type)) {
				if (!step.execution) step.execution = { status }
				step.execution.status = status
				step.execution.error = error
			}
		}
		onUpdate?.(route)
	}

	static setStatus(route: IRouteType, type: StepType, status: Status, error?: string, onUpdate?: UpdateRouteHook) {
		const step = route.steps.find(s => s.type === type && StatusManager.isActionStep(s.type))
		if (step) {
			if (!step.execution) step.execution = { status }
			step.execution.status = status
			step.execution.error = error
			onUpdate?.(route)
		}
	}

	static syncStatuses(route: IRouteType, txSteps: ITxStep[], onUpdate?: UpdateRouteHook) {
		let execIdx = 0
		for (const step of route.steps) {
			if (StatusManager.isActionStep(step.type) && txSteps[execIdx]) {
				step.execution = { ...step.execution, ...txSteps[execIdx++] }
			}
		}
		onUpdate?.(route)
	}

	static computeOverallStatus(steps: ITxStep[]): { status: Status; error?: string } {
		const allSuccess = steps.every(s => s.status === Status.SUCCESS)
		if (allSuccess) return { status: Status.SUCCESS }
		const failStep = steps.find(s => s.status === Status.FAILED)
		if (failStep) return { status: Status.FAILED, error: failStep.error }
		return { status: Status.PENDING }
	}

	static getStatus(route: IRouteType, type: StepType): IRouteStep | undefined {
		return route.steps.find(s => s.type === type && StatusManager.isActionStep(s.type)) as IRouteStep | undefined
	}

	static isActionStep(type: StepType): boolean {
		return type !== StepType.SWITCH_CHAIN && type !== StepType.ALLOWANCE
	}
}
