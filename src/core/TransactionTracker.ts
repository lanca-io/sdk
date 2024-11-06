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

	private static trackSwapTransaction(logs: Log[], sendState: (state: ExecutionState) => void) {
		for (const log of logs) {
			try {
				const decodedLog = decodeEventLog({
					abi: conceroAbi,
					data: log.data,
					topics: log.topics,
				})

				if (decodedLog.eventName === 'Orchestrator_SwapSuccess') {
					sendState({
						stage: ExecuteRouteStatus.Success,
						payload: {
							title: 'Swap execute successfully!',
							body: 'Check your balance',
							status: 'success',
							txLink: null,
						},
					})
				}
			} catch (err) {
				console.error(err)
			}
		}
	}

	private static async trackBridgeTransaction(
		tx: Transaction,
		routeData: RouteType,
		srcPublicClient: PublicClient,
		sendState: (state: ExecutionState) => void,
		conceroAddress: Address,
		clientAddress: Address,
	) {
		const dstPublicClient = createPublicClient({
			chain: defaultRpcsConfig[routeData.to.chain.id].chain,
			transport: defaultRpcsConfig[routeData.to.chain.id].transport ?? http(),
		})

		const stopTimer = timer(time => {
			if (time === 180) {
				sendState({ stage: ExecuteRouteStage.longDurationConfirming })
			}
		})

		const latestDstChainBlock = await dstPublicClient.getBlockNumber()

		// TODO get log to receipt
		const [logCCIPSent] = await srcPublicClient.getLogs({
			address: conceroAddress,
			event: parseAbiItem(
				'event CCIPSent(bytes32 indexed ccipMessageId, address sender, address recipient, uint8 token, uint256 amount, uint64 dstChainSelector)',
			),
			args: {
				from: clientAddress,
				to: clientAddress,
			},
			fromBlock: tx.blockNumber,
			toBlock: 'latest',
		})

		if (!logCCIPSent.args) {
			return this.trackBridgeTransaction(tx, routeData, srcPublicClient, sendState, conceroAddress, clientAddress)
		}

		const { ccipMessageId } = logCCIPSent.args
		const dstConceroAddress = conceroAddressesMap[routeData.to.chain.id]

		let retryCount = 0
		const maxRetries = 120

		const timerId = setInterval(async () => {
			const logs = await dstPublicClient.getLogs({
				address: dstConceroAddress,
				abi: functionsAbi,
				fromBlock: latestDstChainBlock,
				toBlock: 'latest',
			})

			logs.forEach(log => {
				const decodedLog = decodeEventLog({
					abi: functionsAbi,
					data: log.data,
					topics: log.topics,
				})

				const dstCcipMessageId = decodedLog.args?.ccipMessageId as string
				const isCurrentCcipMessage = dstCcipMessageId === ccipMessageId

				if (ccipMessageId && decodedLog.eventName === 'TXReleased' && isCurrentCcipMessage) {
					sendState({
						stage: ExecuteRouteStage.successTransaction,
						payload: {
							title: 'Swap execute successfully!',
							body: 'Check your balance',
							status: 'success',
							txLink: null,
						},
					})
					clearTimeout(timerId)
					stopTimer()
					return
				}

				if (ccipMessageId && decodedLog.eventName === 'FunctionsRequestError' && isCurrentCcipMessage) {
					sendState({
						stage: ExecuteRouteStage.failedTransaction,
						payload: {
							title: 'Failed transaction',
							body: 'Transaction was reverted',
							status: 'failed',
							txLink: null,
						},
					})
					clearTimeout(timerId)
					stopTimer()
					throwError(tx)
				}
			})

			if (retryCount === maxRetries) {
				stopTimer()
				clearInterval(timerId)
			}

			retryCount++
		}, 2000)
	}
}
