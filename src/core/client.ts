import { LibZip } from 'solady'
import {
	Address,
	createPublicClient,
	encodeAbiParameters,
	erc20Abi,
	extractChain,
	Hash,
	Hex,
	parseUnits,
	PublicClient,
	WalletClient,
	zeroAddress,
	zeroHash,
} from 'viem'
import { conceroAbi } from '../abi'
import { conceroAddressesMap, defaultRpcsConfig } from '../configs'
import { conceroApi } from '../configs/apis'
import {
	DEFAULT_GAS_LIMIT,
	DEFAULT_REQUEST_RETRY_INTERVAL_MS,
	DEFAULT_SLIPPAGE,
	DEFAULT_TOKENS_LIMIT,
	SUPPORTED_CHAINS,
	viemReceiptConfig,
} from '../constants'
import { EmptyAmountError, globalErrorHandler, RouteError, TokensAreTheSameError, WalletClientError } from '../errors'
import { ErrorWithMessage } from '../errors/types'
import { httpClient } from '../http/httpClient'
import {
	BridgeData,
	ConceroChain,
	ConceroToken,
	ExecutionConfig,
	IGetRoute,
	IGetTokens,
	InputRouteData,
	InputSwapData,
	Integration,
	LancaClientConfig,
	PrepareTransactionArgsReturnType,
	RouteInternalStep,
	RouteStep,
	RouteType,
	Status,
	StepType,
	SwapArgs,
	SwapDirectionData,
	SwitchChainHook,
	TxName,
	TxStep,
	UpdateRouteHook,
} from '../types'
import { isNative, sleep } from '../utils'

export class LancaClient {
	private readonly config: LancaClientConfig
	/**
	 * @param config - The configuration object for the client.
	 * @param config.integratorAddress - The integrator address. It is used to identify the integrator in the Concero system.
	 * @param config.feeBps - The fee tier. It is used to determine the fee that will be charged for the transaction.
	 * @param config.chains - The chains configuration. If not provided, the default configuration will be used.
	 */
	constructor({ integratorAddress = zeroAddress, feeBps = 0, chains = defaultRpcsConfig }: LancaClientConfig) {
		this.config = { integratorAddress, feeBps, chains }
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
	}: IGetRoute): Promise<RouteType | undefined> {
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
		const routeResponse: { data: RouteType } = await httpClient.get(conceroApi.route, options)
		return routeResponse?.data
	}

	/**
	 * Execute the given route with the given wallet client and execution configurations.
	 * @param route - The route object.
	 * @param walletClient - The wallet client object.
	 * @param executionConfig - The execution configuration object.
	 * @returns The updated route object or undefined if the user rejected the transaction.
	 */
	public async executeRoute(
		route: RouteType,
		walletClient: WalletClient,
		executionConfig: ExecutionConfig,
	): Promise<RouteType | undefined> {
		try {
			return await this.executeRouteBase(route, walletClient, executionConfig)
		} catch (error) {
			globalErrorHandler.handle(error)

			if ((error as ErrorWithMessage).toString().toLowerCase().includes('user rejected')) {
				return
			}
		}
	}

	/**
	 * Get the list of supported chains.
	 * @returns The list of supported chains or undefined if the request failed.
	 */
	public async getSupportedChains(): Promise<ConceroChain[] | undefined> {
		const supportedChainsResponse: { data: ConceroChain[] } = await httpClient.get(conceroApi.chains)
		return supportedChainsResponse?.data
	}

	/**
	 * Fetches a list of supported tokens based on the provided filter criteria.
	 *
	 * @param chainId - The ID of the blockchain network to fetch tokens from.
	 * @param name - (Optional) The name of the token to filter by.
	 * @param symbol - (Optional) The symbol of the token to filter by.
	 * @param limit - (Optional) The maximum number of tokens to return. Defaults to `DEFAULT_TOKENS_LIMIT`.
	 *
	 * @returns A promise that resolves to an array of `ConceroToken` objects or undefined if the request fails.
	 */
	public async getSupportedTokens({
		chainId,
		name,
		symbol,
		limit = DEFAULT_TOKENS_LIMIT,
	}: IGetTokens): Promise<ConceroToken[] | undefined> {
		const options = new URLSearchParams({
			chainId,
			limit,
			...(name && { name }),
			...(symbol && { symbol }),
		})

		const supportedTokensResponse: { data: ConceroToken[] } = await httpClient.get(conceroApi.tokens, options)
		return supportedTokensResponse?.data
	}

	/**
	 * Fetches the status of the route execution by the given transaction hash.
	 *
	 * @param txHash - The transaction hash of the route execution.
	 *
	 * @returns A promise that resolves to an array of `TxStep` objects or undefined if the request fails.
	 */
	public async getRouteStatus(txHash: string): Promise<TxStep[] | undefined> {
		const options = new URLSearchParams({
			txHash,
		})

		const routeStatusResponse: { data: TxStep[] } = await httpClient.get(conceroApi.routeStatus, options)
		return routeStatusResponse?.data
	}

	/**
	 * Executes the given route with the given wallet client and execution configuration.
	 * This is a private method that should not be called directly. Instead, call `executeRoute` which is the public interface.
	 * @param route - The route object to be executed.
	 * @param walletClient - The wallet client object to be used for writing the transaction.
	 * @param executionConfig - The execution configuration object.
	 * @returns A promise that resolves to the updated route object with the transaction hash if the transaction is successful, otherwise undefined.
	 */
	private async executeRouteBase(
		route: RouteType,
		walletClient: WalletClient,
		executionConfig: ExecutionConfig,
	): Promise<RouteType> {
		const { chains } = this.config
		if (!walletClient) throw new WalletClientError('Wallet client not initialized')

		this.validateRoute(route)
		const { switchChainHook, updateRouteStatusHook } = executionConfig

		const routeStatus = this.initRouteStepsStatuses(route)
		updateRouteStatusHook?.(routeStatus)

		await this.handleSwitchChain(walletClient, routeStatus, switchChainHook, updateRouteStatusHook)

		const [clientAddress] = await walletClient.getAddresses()
		const fromChainId = Number(route.from.chain.id)

		const inputRouteData: InputRouteData = this.buildRouteData(route, clientAddress)
		const conceroAddress = conceroAddressesMap[fromChainId]

		const chain = extractChain({
			chains: SUPPORTED_CHAINS,
			id: Number(fromChainId),
		})

		const publicClient = createPublicClient({
			chain,
			transport: chains![fromChainId],
		})

		await this.handleAllowance(
			walletClient,
			publicClient,
			clientAddress,
			route.from,
			routeStatus,
			updateRouteStatusHook,
		)
		const hash = await this.handleTransaction(
			publicClient,
			walletClient,
			conceroAddress,
			clientAddress,
			inputRouteData,
		)
		await this.handleTransactionStatus(hash, publicClient, routeStatus, updateRouteStatusHook)
		return routeStatus
	}

	/**
	 * Validates the route data before executing the route.
	 * @throws {RouteError} if the route is not initialized.
	 * @throws {EmptyAmountError} if the `to.amount` is empty.
	 * @throws {TokensAreTheSameError} if the `from.token.address` and `to.token.address` are the same and the `from.chain.id` and `to.chain.id` are the same.
	 */
	private validateRoute(route: RouteType) {
		if (!route) throw new RouteError('Route not initialized')
		if (route.to.amount === '0' || route.to.amount === '') throw new EmptyAmountError(route.to.amount)
		if (route.from.token.address === route.to.token.address && route.from.chain?.id === route.to.chain?.id)
			throw new TokensAreTheSameError(route.from.token.address)
	}

	/**
	 * Handles the switch chain step of the route execution.
	 *
	 * @param walletClient - The wallet client instance.
	 * @param routeStatus - The route status object.
	 * @param switchChainHook - An optional hook to switch the chain using a custom implementation.
	 * @param updateRouteStatusHook - An optional hook to update the route status.
	 */
	private async handleSwitchChain(
		walletClient: WalletClient,
		routeStatus: RouteType,
		switchChainHook?: SwitchChainHook,
		updateRouteStatusHook?: UpdateRouteHook,
	) {
		const currentChainId: number = await walletClient.getChainId()
		const chainIdFrom = Number(routeStatus.from.chain.id)

		if (chainIdFrom !== currentChainId) {
			routeStatus.steps.unshift({
				type: StepType.SWITCH_CHAIN,
				execution: {
					status: Status.PENDING,
				},
			})

			const { execution } = routeStatus.steps[0]

			try {
				if (switchChainHook) {
					await switchChainHook(chainIdFrom)
				} else {
					await walletClient.switchChain({
						id: chainIdFrom,
					})
				}

				execution!.status = Status.SUCCESS
			} catch (error) {
				execution!.status = Status.FAILED
				globalErrorHandler.handle(error)
			}
		}

		updateRouteStatusHook?.(routeStatus)
	}

	/**
	 * Handles the token allowance for a transaction. If the allowance is less than the needed amount,
	 * it requests approval for the required amount from the user's wallet.
	 *
	 * @param walletClient - The wallet client instance used for interacting with the user's wallet.
	 * @param publicClient - The public client instance used for reading contract data and simulating transactions.
	 * @param clientAddress - The address of the client's wallet.
	 * @param txData - The transaction data containing token, amount, and chain information.
	 * @param routeStatus - The current status of the route execution steps.
	 * @param updateRouteStatusHook - An optional hook to update the route status during the allowance check and approval.
	 * @returns A promise that resolves when the allowance handling is complete.
	 */
	private async handleAllowance(
		walletClient: WalletClient,
		publicClient: PublicClient,
		clientAddress: Address,
		txData: SwapDirectionData,
		routeStatus: RouteType,
		updateRouteStatusHook?: UpdateRouteHook,
	): Promise<void> {
		const { token, amount, chain } = txData
		if (isNative(token.address)) {
			return
		}

		const conceroAddress = conceroAddressesMap[chain.id]
		const allowance: bigint = await publicClient.readContract({
			abi: erc20Abi,
			functionName: 'allowance',
			address: token.address,
			args: [clientAddress, conceroAddress],
		})

		const amountInDecimals: bigint = parseUnits(amount, token.decimals)

		const isSwitchStepPresent = routeStatus.steps[0].type === StepType.SWITCH_CHAIN
		const allowanceIndex = isSwitchStepPresent ? 1 : 0

		routeStatus.steps.splice(allowanceIndex, 0, {
			type: StepType.ALLOWANCE,
			execution: {
				status: Status.NOT_STARTED,
			},
		})

		const { execution } = routeStatus.steps[allowanceIndex]

		if (allowance >= amountInDecimals) {
			execution!.status = Status.SUCCESS
			updateRouteStatusHook?.(routeStatus)
			return
		}

		const { request } = await publicClient.simulateContract({
			account: clientAddress,
			address: token.address,
			abi: erc20Abi,
			functionName: 'approve',
			args: [conceroAddress, amountInDecimals],
		})

		execution!.status = Status.PENDING
		updateRouteStatusHook?.(routeStatus)

		try {
			const approveTxHash = await walletClient.writeContract(request)
			if (approveTxHash) {
				await publicClient.waitForTransactionReceipt({ hash: approveTxHash })
				execution!.status = Status.SUCCESS
				execution!.txHash = approveTxHash
			} else {
				execution!.status = Status.FAILED
				execution!.error = 'Failed to approve allowance'
			}
		} catch (error) {
			execution!.status = Status.FAILED
			execution!.error = 'Failed to approve allowance'
			globalErrorHandler.handle(error)
		}

		updateRouteStatusHook?.(routeStatus)
	}

	/**
	 * Handle a transaction by simulating a contract call and then writing the
	 * transaction using the provided wallet client.
	 *
	 * @param publicClient - The public client to use for simulating the contract call.
	 * @param walletClient - The wallet client to use for writing the transaction.
	 * @param conceroAddress - The address of the Concero contract.
	 * @param clientAddress - The address of the client executing the transaction.
	 * @param txArgs - The arguments for the transaction.
	 *
	 * @returns The transaction hash or undefined if the transaction failed.
	 */
	private async handleTransaction(
		publicClient: PublicClient,
		walletClient: WalletClient,
		conceroAddress: Address,
		clientAddress: Address,
		txArgs: InputRouteData,
	): Promise<Hash> {
		const { txName, args, isFromNativeToken, fromAmount } = this.prepareTransactionArgs(txArgs, clientAddress)
		const gasPrice = await publicClient.getGasPrice()

		let txHash: Hash = zeroHash
		try {
			const { request } = await publicClient.simulateContract({
				account: clientAddress,
				abi: conceroAbi,
				functionName: txName,
				address: conceroAddress,
				args,
				gas: DEFAULT_GAS_LIMIT,
				gasPrice,
				...(isFromNativeToken && { value: fromAmount }),
			})
			txHash = await walletClient.writeContract(request)
		} catch (error) {
			globalErrorHandler.handle(error)
		}

		return txHash
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
		routeStatus: RouteType,
		updateRouteStatusHook?: UpdateRouteHook,
	) {
		const { status } = await publicClient.waitForTransactionReceipt({
			hash: txHash,
			...viemReceiptConfig,
		})

		if (!status || status === 'reverted') {
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

		let isTransactionComplete = false
		while (!isTransactionComplete) {
			try {
				const options = new URLSearchParams({ txHash })
				const steps: TxStep[] = await httpClient.get(conceroApi.routeStatus, options)
				if (steps.every(({ status }) => status === Status.SUCCESS)) {
					isTransactionComplete = true
				}
				await sleep(DEFAULT_REQUEST_RETRY_INTERVAL_MS)
			} catch (error) {
				globalErrorHandler.handle(error)
			}
		}

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
	}

	/**
	 * Prepares the transaction arguments for the executeRoute function
	 * @param txArgs the transaction arguments
	 * @param clientAddress the client's address
	 * @returns {PrepareTransactionArgsReturnType} the prepared transaction arguments
	 * @throws {EmptyAmountError} if the fromAmount is empty
	 * @throws {TokensAreTheSameError} if the fromToken and toToken are the same
	 * @throws {UnsupportedChainError} if the fromChainId or toChainId is not supported
	 * @throws {UnsupportedTokenError} if the fromToken or toToken is not supported
	 * @throws {LancaClientError} if the transaction arguments are invalid
	 */
	private prepareTransactionArgs(txArgs: InputRouteData, clientAddress: Address): PrepareTransactionArgsReturnType {
		const { srcSwapData, bridgeData, dstSwapData } = txArgs

		const integrationInfo: Integration = {
			integrator: this.config.integratorAddress,
			feeBps: this.config.feeBps,
		}

		let args: SwapArgs = [srcSwapData, clientAddress, integrationInfo]
		let txName: TxName = 'swap'

		if (bridgeData) {
			const compressDstSwapData = this.compressSwapData(dstSwapData)
			args = [bridgeData, compressDstSwapData, integrationInfo]

			if (srcSwapData.length > 0) {
				txName = 'swapAndBridge'
				args.splice(1, 0, srcSwapData)
			} else {
				txName = 'bridge'
			}
		}

		const { fromAmount, fromToken } = srcSwapData[0]
		const isFromNativeToken = srcSwapData.length > 0 && isNative(fromToken)

		return { txName, args, isFromNativeToken, fromAmount }
	}

	/**
	 * Initializes the execution status of each step in the given route to NOT_STARTED.
	 * @param route - The route object.
	 * @returns The route object with the execution status of each step initialized to NOT_STARTED.
	 */
	private initRouteStepsStatuses(route: RouteType): RouteType {
		return {
			...route,
			steps: route.steps.map(step => ({
				...step,
				execution: {
					status: Status.NOT_STARTED,
				},
			})),
		}
	}

	/**
	 * Constructs and returns the route data needed for executing swaps and bridges.
	 *
	 * @param routeData - The route object containing the steps of the transaction.
	 * @param clientAddress - The address of the client executing the route.
	 * @returns An object containing the source swap data, bridge data, and destination swap data.
	 *          - `srcSwapData`: An array of swap data for source chain swaps.
	 *          - `bridgeData`: The data required to execute a bridge, or null if no bridge is required.
	 *          - `dstSwapData`: An array of swap data for destination chain swaps.
	 */
	private buildRouteData(routeData: RouteType, clientAddress: Address): InputRouteData {
		const { steps } = routeData
		let bridgeData: BridgeData | null = null
		const srcSwapData: InputSwapData[] = []
		const dstSwapData: InputSwapData[] = []
		steps.forEach(step => {
			const { type } = step

			if (type === StepType.BRIDGE) {
				const { from, to } = step as RouteStep
				const fromAmount = parseUnits(from.amount, from.token.decimals)
				bridgeData = {
					tokenType: 1,
					amount: fromAmount,
					dstChainSelector: BigInt(conceroAddressesMap[to.chain.id]),
					receiver: clientAddress,
				}
			} else if (type === StepType.SRC_SWAP || type === StepType.DST_SWAP) {
				;(step as RouteStep).internalSteps.forEach((internalStep: RouteInternalStep) => {
					const swapData: InputSwapData = this.buildSwapData(internalStep)
					if (bridgeData) dstSwapData.push(swapData)
					else srcSwapData.push(swapData)
				})
			}
		})
		return { srcSwapData, bridgeData, dstSwapData }
	}

	/**
	 * Constructs and returns the swap data required for executing a swap step.
	 *
	 * @param step - The step object containing the tool and from/to token data.
	 * @returns An object containing the source token, source amount, destination token, destination amount, and router address.
	 */
	private buildSwapData(step: RouteInternalStep): InputSwapData {
		const { tool, from, to } = step
		const fromToken = from.token
		const toToken = to.token

		const { amountOutMin } = tool
		const { dexCallData, dexRouter } = tool.data!

		const fromAmount = parseUnits(from.amount, from.token.decimals)
		const toAmount = parseUnits(to.amount, to.token.decimals)
		const toAmountMin = parseUnits(amountOutMin!, toToken.decimals)

		return {
			dexRouter,
			fromToken: fromToken.address,
			fromAmount,
			toToken: toToken.address,
			toAmount,
			toAmountMin,
			dexCallData,
		}
	}

	/**
	 * Compresses an array of swap data into a single encoded and compressed format.
	 *
	 * @param swapDataArray - An array of InputSwapData objects, each containing details
	 * about a token swap, such as the router address, token addresses, amounts, and additional data.
	 * @returns A compressed byte array representing the encoded swap data.
	 */
	private compressSwapData(swapDataArray: InputSwapData[]): Hex {
		const swapDataParams = [
			{ name: 'dexRouter', type: 'address' },
			{ name: 'fromToken', type: 'address' },
			{ name: 'fromAmount', type: 'uint256' },
			{ name: 'toToken', type: 'address' },
			{ name: 'toAmount', type: 'uint256' },
			{ name: 'toAmountMin', type: 'uint256' },
			{ name: 'dexData', type: 'bytes' },
		]
		const encodedSwapData = encodeAbiParameters(
			swapDataParams.map(param => ({ ...param, type: `${param.type}[]` })),
			swapDataArray,
		)

		return LibZip.cdCompress(encodedSwapData) as Hex
	}
}
