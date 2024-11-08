import { PublicClient } from 'viem'
import { Status, TxStep, UpdateRouteHook } from '../types'
import { RouteTypeExtended } from '../types/routeType'
import { baseUrl } from '../constants'

export async function checkTransactionStatus(
	txHash: `0x${string}`, // use Address type (and everywhere else where you're using this) imported from "viem"
	srcPublicClient: PublicClient,
	routeStatus: RouteTypeExtended,
	updateRouteStatusHook?: UpdateRouteHook,
) {
	const { status } = await srcPublicClient.waitForTransactionReceipt({
		hash: txHash,
		pollingInterval: 3_000,
		retryCount: 500,
		//@review-from-oleg - retryCount cant be so high. Also move the entire object (apart from hash) to a constant viemReceiptConfig
		//here's how its used:
		// somewhere in constants:
		// 		export const viemReceiptConfig: WaitForTransactionReceiptParameters = {
		//   timeout: 0,
		//   confirmations: 2,
		// };
		// in code:
		// 		    const { cumulativeGasUsed } = await publicClient.waitForTransactionReceipt({
		//       hash: transactionHash,
		//       ...viemReceiptConfig,
		//     });
		confirmations: 3, //	@review-from-oleg - 2 should be enough
	})


	if (status === 'reverted') {
		updateRouteStatusHook?.({
			...routeStatus,
			steps: routeStatus.steps.map(step => ({
				...step,
				execution: {
					status: Status.FAILED,
					txHash: '',
					error: 'Transaction reverted'
				}
			}))
		})
		return
	}

	if (status === 'success') {
		updateRouteStatusHook?.({
			...routeStatus,
			steps: routeStatus.steps.map(step => ({
				...step,
				execution: {
					status: Status.SUCCESS,
					txHash,
				}
			}))
		})
		return
	}

	//every 3 seconds check transaction status with route_status endpoint
	const timeInterval = 3000
	//	@review-from-oleg - Important – we must implement a maxRetryCount, so that it doesn't loop infinitely.
	let isDone = false //@review-from-oleg - rename to isTransactionComplete for clarity

	const intervalId = setInterval(async () => {
		if (isDone) {
			clearInterval(intervalId)
			updateRouteStatusHook?.({
				...routeStatus,
				steps: routeStatus.steps.map(step => ({
					...step,
					execution: {
						status: Status.SUCCESS,
						txHash,
					}
				}))
			})
			return
		}

		try {
			//	@review-from-oleg - we need to refactor fetch to use a custom wrapper 'request.ts' which will add custom headers and handle errors, so we don't duplicate this 200 check everywhere
			const response = await fetch(`${baseUrl}/route_status?txHash=${txHash}`)

			if (response.status !== 200) {
				throw new Error(response.statusText)
			}

			const steps: TxStep[] = await response.json()
			if (steps.every(({ status }) => status === Status.SUCCESS)) {
				isDone = true
			}
		} catch (error) {
			//@review-from-oleg – we need a custom, global error handler. This should not only catch all errors, but also send them as reports to our API.
			//also everywhere where you're logging errors please use console.error	instead of console.log
			console.log(error)
		}
	}, timeInterval)
}

