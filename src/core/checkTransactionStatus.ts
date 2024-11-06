import { PublicClient } from 'viem'
// @review: TS2305: Module '../ types' has no exported member ExecutionState
import { TxStep, UpdateRouteHook } from '../types'
import { Status} from '../types/routeType'
import { baseUrl } from '../constants'

export async function checkTransactionStatus(
	txHash: `0x${string}`,
	srcPublicClient: PublicClient,
	updateRouteStatusHook?: UpdateRouteHook,
) {
	// @review: unused variable. we should check status of transaction (tx.status)
	const tx = await srcPublicClient.waitForTransactionReceipt({
		hash: txHash,
		pollingInterval: 3_000,
		retryCount: 500,
		confirmations: 3,
	})

	//every 3 seconds check transaction status with route_status endpoint
	const timeInterval = 3000
	let isDone = false

	const intervalId = setInterval(async () => {
		if (isDone) {
			clearInterval(intervalId)
			return
		}

		try {
			const response = await fetch(`${baseUrl}/route_status?txHash=${txHash}`)

			if (response.status !== 200) {
				throw new Error(response.statusText)
			}

			const steps: TxStep[] = await response.json()
			if (steps.every(({ status }) => status === Status.SUCCESS)) {
				isDone = true
			}
		} catch (error) {
			console.log(error)
		}
	}, timeInterval)
}

