import { PublicClient, Address } from 'viem'
import { Status, TxStep, UpdateRouteHook } from '../types'
import { RouteTypeExtended } from '../types/routeType'
import { baseUrl } from '../constants'

export async function checkTransactionStatus(
	txHash: Address,
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
					error: 'Transaction reverted',
				},
			})),
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
				},
			})),
		})
		return
	}

	//@review-from-oleg – if status is null, we should handle this

	const timeInterval = 3000
	let isDone = false //@review-from-oleg - rename to isTransactionComplete for clarity

	//@review-from-oleg - This part needs to be re-written.
	// if the fetch takes 4 seconds, you would still send a fetch request every 3 seconds without awaiting it
	// rewrite using while(shouldFetch) and sleep(fetchIntervalMS). Don't use setInterval or setTimeout
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
					},
				})),
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
