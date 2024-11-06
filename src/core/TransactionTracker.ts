import { Address, createPublicClient, decodeEventLog, http, Log, parseAbiItem, PublicClient } from 'viem'
import { conceroAbi } from '../abi'
// @review: TS2305: Module '../ types' has no exported member ExecutionState
import { ExecuteRouteStage, ExecuteRouteStatus, ExecutionState, Transaction, UpdateRouteHook } from '../types'
import { timer } from '../utils/timer'
import { conceroAddressesMap, defaultRpcsConfig } from '../configs'
import { throwError } from '../utils/throwError'
import { functionsAbi } from '../abi/contractFunctionsData'
import { RouteType, Status, TxStep } from '../types/routeType'
import { baseUrl } from '../constants'

// @review replace this class with single function "checkTransactionStatus"
export class TransactionTracker {
	public static async checkTransactionStatus(
		txHash: string,
		srcPublicClient: PublicClient,
		routeData: RouteType,
		conceroAddress: Address,
		clientAddress: Address,
		updateRouteStatusHook?: UpdateRouteHook,
	) {
		// @review: unused variable. we should check status of transaction (tx.status)
		const tx = await srcPublicClient.waitForTransactionReceipt({
			// @review: change type of txHash to `0x${string}
			hash: txHash as `0x${string}`,
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
}
