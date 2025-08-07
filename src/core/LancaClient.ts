import type { Address, EstimateContractGasParameters, Hash, PublicClient, Transport, WalletClient } from 'viem'
import { ContractFunctionExecutionError, createPublicClient, UserRejectedRequestError, zeroAddress } from 'viem'
import { conceroAbiV1_7, conceroAbiV2 } from '../abi'
import { conceroAddressesMap, supportedViemChainsMap, conceroV2AddressesMap } from '../configs'
import { conceroApi } from '../configs'
import {
	DEFAULT_REQUEST_RETRY_INTERVAL_MS,
	DEFAULT_REQUEST_TIMEOUT_MS,
	DEFAULT_SLIPPAGE,
	DEFAULT_TOKENS_LIMIT,
	viemReceiptConfig,
} from '../constants'
import {
	globalErrorHandler,
	NoRouteError,
	PublicClientError,
	TokensAreTheSameError,
	WalletClientError,
	WrongAmountError,
} from '../errors'
import { httpClient } from '../http'
import type {
	IExecutionConfig,
	IGetRoute,
	IGetTokens,
	IInputRouteData,
	ILancaChain,
	ILancaClientConfig,
	ILancaToken,
	IRouteStep,
	IRouteType,
	ITxStep,
	UpdateRouteHook,
	ITxStepSwap,
} from '../types'
import { Status, StepType } from '../types'
import { sleep } from '../utils'
import { getChainConfirmations } from '../constants'
import { handleAllowance } from './allowance'
import { buildRoute } from './build-route'
import { switchEVMChain } from './chain-actions'
import { StatusManager } from './status-manager'

export class LancaClient {
	private readonly config: ILancaClientConfig
	/**
	 * @param config - The configuration object for the client.
	 * @param config.integratorAddress - The integrator address. It is used to identify the integrator in the Concero system.
	 * @param config.feeBps - The fee tier. It is used to determine the fee that will be charged for the transaction.
	 * @param config.chains - The chains configuration. If not provided, the default configuration will be used.
	 */
	constructor({
		integratorAddress = zeroAddress,
		feeBps = 0n,
		chains = supportedViemChainsMap,
		testnet = false,
	}: ILancaClientConfig = {}) {
		this.config = { integratorAddress, feeBps, chains, testnet }
	}

	/**
	 * Get the route for the given input parameters.
	 * @param options - The options object.
	 * @param options.fromChainId - The ID of the source chain.
	 * @param options.toChainId - The ID of the destination chain.
	 * @param options.fromToken - The address of the source token.
	 * @param options.toToken - The address of the destination token.
	 * @param options.amount - The amount of the source token to be swapped.
	 * @param options.slippageTolerance - The slippage tolerance in percentage. Default is 0.5%.
	 * @returns The route object or undefined if the route is not found.
	 */
	public async getRoute({
		fromChainId,
		toChainId,
		fromToken,
		toToken,
		amount,
		fromAddress,
		toAddress,
		slippageTolerance = DEFAULT_SLIPPAGE,
	}: IGetRoute): Promise<IRouteType | undefined> {
		const options = new URLSearchParams({
			fromChainId,
			toChainId,
			fromToken,
			toToken,
			amount,
			fromAddress,
			toAddress,
			slippageTolerance,
		})
		try {
			const routeResponse: { data: IRouteType } = await httpClient.get(conceroApi.route, options)
			return routeResponse?.data
		} catch (error) {
			await globalErrorHandler.handle(error)
			throw globalErrorHandler.parse(error)
		}
	}

	/**
	 * Execute the given route with the given wallet client and execution configurations.
	 * @param route - The route object.
	 * @param walletClient - The wallet client object.
	 * @param executionConfig - The execution configuration object.
	 * @returns The updated route object or undefined if the user rejected the transaction.
	 */
	public async executeRoute(
		route: IRouteType,
		walletClient: WalletClient,
		executionConfig: IExecutionConfig,
		destinationAddress?: Address,
	): Promise<IRouteType | undefined> {
		try {
			const { chains } = this.config

			if (!walletClient) {
				throw new WalletClientError('Wallet client not initialized')
			}

			this.validateRoute(route)

			const { switchChainHook, updateRouteStatusHook } = executionConfig

			const routeStatus = StatusManager.initRouteStatuses(route)
			updateRouteStatusHook?.(routeStatus)

			const [clientAddress] = await walletClient.getAddresses()

			const fromChainId = route.from.chain.id

			await switchEVMChain(
				walletClient,
				chains![fromChainId].chain,
				routeStatus,
				switchChainHook!,
				updateRouteStatusHook!,
			)

			const inputRouteData: IInputRouteData = buildRoute(
				route,
				clientAddress,
				this.config.testnet ? true : false,
				destinationAddress,
			)

			const conceroAddress = this.config.testnet
				? conceroV2AddressesMap[fromChainId]
				: conceroAddressesMap[fromChainId]

			const publicClient = createPublicClient({
				chain: chains![fromChainId].chain,
				transport: chains![fromChainId].provider as Transport,
			})

			if (!publicClient) {
				throw new PublicClientError('Public client not initialized')
			}

			await handleAllowance(
				walletClient,
				chains![fromChainId].chain,
				routeStatus,
				route.from,
				this.config.testnet ? true : false,
				updateRouteStatusHook,
			)

			const hash = await this.handleTransaction(
				publicClient,
				walletClient,
				conceroAddress,
				clientAddress,
				inputRouteData,
				routeStatus,
				destinationAddress,
				updateRouteStatusHook,
			)

			await this.handleTransactionStatus(hash, publicClient, routeStatus, updateRouteStatusHook)

			return routeStatus
		} catch (error) {
			await globalErrorHandler.handle(error)
			throw globalErrorHandler.parse(error)
		}
	}

	/**
	 * Get the list of supported chains.
	 * @returns The list of supported chains or undefined if the request failed.
	 */
	public async getSupportedChains(): Promise<ILancaChain[] | undefined> {
		try {
			const supportedChainsResponse: { data: ILancaChain[] } = await httpClient.get(conceroApi.chains)
			return supportedChainsResponse?.data
		} catch (error) {
			await globalErrorHandler.handle(error)
			throw globalErrorHandler.parse(error)
		}
	}

	/**
	 * Fetches a list of supported tokens based on the provided filter criteria.
	 *
	 * @param chainId - The ID of the blockchain network to fetch tokens from.
	 * @param name - (Optional) The name of the token to filter by.
	 * @param symbol - (Optional) The symbol of the token to filter by.
	 * @param limit - (Optional) The maximum number of tokens to return. Defaults to `DEFAULT_TOKENS_LIMIT`.
	 *
	 * @returns A promise that resolves to an array of `ILancaToken` objects or undefined if the request fails.
	 */
	public async getSupportedTokens({
		chainId,
		name,
		symbol,
		limit = DEFAULT_TOKENS_LIMIT,
	}: IGetTokens): Promise<ILancaToken[] | undefined> {
		const options = new URLSearchParams({
			chain_id: chainId,
			limit,
			...(name && { name }),
			...(symbol && { symbol }),
		})

		try {
			const supportedTokensResponse: { data: ILancaToken[] } = await httpClient.get(conceroApi.tokens, options)
			return supportedTokensResponse?.data
		} catch (error) {
			await globalErrorHandler.handle(error)
			throw globalErrorHandler.parse(error)
		}
	}

	/**
	 * Fetches the status of the route execution by the given transaction hash.
	 *
	 * @param txHash - The transaction hash of the route execution.
	 *
	 * @returns A promise that resolves to an array of `ITxStep` objects or undefined if the request fails.
	 */
	public async getRouteStatus(txHash: string): Promise<ITxStep[] | undefined> {
		const options = new URLSearchParams({
			txHash,
		})

		const routeStatusResponse: { data: ITxStep[] } = await httpClient.get(conceroApi.routeStatus, options)
		return routeStatusResponse?.data
	}

	/**
	 * Validates the route data before executing the route.
	 * @throws {RouteError} if the route is not initialized.
	 * @throws {EmptyAmountError} if the `to.amount` is empty.
	 * @throws {TokensAreTheSameError} if the `from.token.address` and `to.token.address` are the same and the `from.chain.id` and `to.chain.id` are the same.
	 */
	private validateRoute(route: IRouteType) {
		if (!route) throw new NoRouteError('Route not initialized')
		if (!route.from.amount || !route.to.amount) throw new WrongAmountError('0')
		if (route.from.token.address === route.to.token.address && route.from.chain?.id === route.to.chain?.id)
			throw new TokensAreTheSameError([route.from.token.address, route.to.token.address])
	}

	/**
	 * Handles the status of the transaction after it is sent to the network.
	 *
	 * @param txHash - The transaction hash of the transaction.
	 * @param publicClient - The PublicClient instance to use for getting the transaction receipt.
	 * @param routeStatus - The current status of the route.
	 * @param updateRouteStatusHook - The function to call when the route status is updated.
	 */
	private async handleTransactionStatus(
		txHash: Address,
		publicClient: PublicClient,
		routeStatus: IRouteType,
		updateRouteStatusHook?: UpdateRouteHook,
	) {
		const chainId = publicClient.chain?.id || 0

		const { status } = await publicClient.waitForTransactionReceipt({
			hash: txHash,
			...viemReceiptConfig,
			confirmations: getChainConfirmations(chainId),
		})

		if (!status || status === 'reverted') {
			StatusManager.setAllStatuses(routeStatus, Status.FAILED, 'Transaction reverted', updateRouteStatusHook)
			return
		}

		const firstStepType = routeStatus.steps.find(
			({ type }) => type === StepType.SRC_SWAP || type === StepType.BRIDGE,
		)

		const isBridgeStepExist = routeStatus.steps.some(({ type }) => type === StepType.BRIDGE)

		if (status === 'success' && firstStepType?.type === StepType.SRC_SWAP && !isBridgeStepExist) {
			let step
			do {
				;[step] = await this.fetchRouteSteps(txHash)
				if (!step) {
					await new Promise(resolve => setTimeout(resolve, DEFAULT_REQUEST_TIMEOUT_MS))
				}
			} while (!step)
			;(firstStepType.execution! as ITxStepSwap).txHash = txHash
			firstStepType.execution!.status = Status.SUCCESS
			if (step.receivedAmount) firstStepType.execution!.receivedAmount = step.receivedAmount
			updateRouteStatusHook?.(routeStatus)
			return
		}

		await this.pollTransactionStatus(txHash, routeStatus, updateRouteStatusHook)
	}

	/**
	 * Polls the transaction status for the given transaction hash until it is no longer pending.
	 *
	 * @param txHash - The transaction hash to poll.
	 * @param routeStatus - The current status of the route.
	 * @param updateRouteStatusHook - The function to call when the route status is updated.
	 */
	private async pollTransactionStatus(
		txHash: Hash,
		routeStatus: IRouteType,
		updateRouteStatusHook?: UpdateRouteHook,
	) {
		let statusFromTx: Status = Status.PENDING
		do {
			try {
				const steps = await this.fetchRouteSteps(txHash)
				if (steps.length > 0) {
					const { status } = StatusManager.computeOverallStatus(steps)
					statusFromTx = status
					if (statusFromTx !== Status.PENDING) {
						StatusManager.syncStatuses(routeStatus, steps, updateRouteStatusHook)
						return
					}
				}
				await sleep(DEFAULT_REQUEST_RETRY_INTERVAL_MS)
			} catch (error) {
				StatusManager.setAllStatuses(routeStatus, Status.FAILED, error as string, updateRouteStatusHook)
				await globalErrorHandler.handle(error)
				throw globalErrorHandler.parse(error)
			}
		} while (statusFromTx === Status.PENDING)
	}

	/**
	 * Fetches the steps of a transaction route for the given transaction hash.
	 *
	 * @param txHash - The transaction hash for which to fetch the route steps.
	 *
	 * @returns A promise that resolves to an array of `ITxStep` objects representing the steps of the transaction route.
	 */
	private async fetchRouteSteps(txHash: Hash): Promise<ITxStep[]> {
		const options = new URLSearchParams({ txHash, isTestnet: String(this.config.testnet) })
		const { data: steps }: { data: ITxStep[] } = await httpClient.get(conceroApi.routeStatus, options)
		return steps
	}
}
