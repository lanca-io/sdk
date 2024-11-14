import {
	BridgeData,
	LancaSDKConfig,
	ExecutionConfig,
	IGetRoute,
	IGetTokens,
	InputRouteData,
	InputSwapData,
	Status,
	TxStep,
	StepType,
	UpdateRouteHook,
	SwapDirectionData,
	SwitchChainHook,
	SwapArgs,
	TxName,
} from '../types'
import { DEFAULT_GAS_LIMIT, DEFAULT_SLIPPAGE, DEFAULT_REQUEST_RETRY_INTERVAL_MS, DEFAULT_TOKENS_LIMIT, DEX_TYPES_MAP, UNI_V3_ROUTER_ADDRESSES_MAP, viemReceiptConfig } from '../constants'
import {
	EmptyAmountError,
	globalErrorHandler,
	RouteError,
	TokensAreTheSameError,
	UnsupportedChainError,
	UnsupportedTokenError,
	WalletClientError,
} from '../errors'
import {
	Address,
	BaseError,
	createPublicClient,
	encodeAbiParameters,
	EncodeAbiParametersReturnType,
	erc20Abi,
	parseUnits,
	PublicClient,
	WalletClient,
} from 'viem'
import { conceroAddressesMap, defaultRpcsConfig } from '../configs'
import { ConceroChain, ConceroToken, RouteInternalStep, RouteType } from '../types'
import { isNative, sleep } from '../utils'
import { httpClient } from './httpClient'
import { conceroAbi } from '../abi'
import { conceroApi } from '../configs/apis'

export class LansaSDK {
	private readonly config: LancaSDKConfig
	/**
	 * @param config - The configuration object for the client.
	 * @param config.integratorId - The integrator ID. It is used to identify the integrator in the Concero system.
	 * @param config.feeTier - The fee tier. It is used to determine the fee that will be charged for the transaction.
	 * @param config.chains - The chains configuration. If not provided, the default configuration will be used.
	 */
	constructor(config: LancaSDKConfig) {
		this.config = config
		if (!this.config.chains) {
			this.config.chains = defaultRpcsConfig
		}
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
		slippageTolerance = DEFAULT_SLIPPAGE,
	}: IGetRoute): Promise<RouteType | undefined> {
		const options = new URLSearchParams({
			fromChainId,
			toChainId,
			fromToken,
			toToken,
			amount,
			slippageTolerance
		})
		const routeResponse = await httpClient.get(conceroApi.route, options)
		return routeResponse?.data
	}

	/**
	 * Execute the given route with the given wallet client and execution configurations.
	 * @param route - The route object.
	 * @param walletClient - The wallet client object.
	 * @param ExecutionConfig - The execution configuration object.
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

			if (error.toString().toLowerCase().includes('user rejected')) {
				return
			}
		}
	}

	/**
	 * Get the list of supported chains.
	 * @returns The list of supported chains or undefined if the request failed.
	 */
	public async getSupportedChains(): Promise<ConceroChain[] | undefined> {
		const supportedChainsResponse = await httpClient.get(conceroApi.chains)
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

		const supportedTokensResponse = await httpClient.get(conceroApi.tokens, options)
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
			txHash
		})

		const routeStatusResponse = await httpClient.get(conceroApi.routeStatus, options)
		return routeStatusResponse?.data
	}

	private async executeRouteBase(route: RouteType, walletClient: WalletClient, executionConfig: ExecutionConfig): Promise<RouteType> {
		const { chains } = this.config
		if (!walletClient) throw new WalletClientError('Wallet client not initialized')

		this.validateRoute(route)
		const { switchChainHook, updateRouteStatusHook } = executionConfig

		const routeStatus = this.initRouteStepsStatuses(route)
		updateRouteStatusHook?.(routeStatus)

		this.handleSwitchChain(walletClient, routeStatus, switchChainHook, updateRouteStatusHook)

		const [clientAddress] = await walletClient.getAddresses()
		const fromChainId = Number(route.from.chain.id)

		const inputRouteData: InputRouteData = this.buildRouteData(route, clientAddress)
		const conceroAddress = conceroAddressesMap[fromChainId]

		const publicClient = createPublicClient({
			chain: fromChainId,
			transport: chains[fromChainId],
		})

		this.handleAllowance(walletClient, publicClient, clientAddress, route.from, routeStatus, updateRouteStatusHook)
		const hash = await this.handleTransaction(publicClient, walletClient, conceroAddress, clientAddress, inputRouteData)
		await this.handleTransactionStatus(hash, publicClient, routeStatus, updateRouteStatusHook)
		return routeStatus
	}

	// @alex we should disscuss its usage
	private parseError(error: unknown) {
		if (error instanceof BaseError) {
			const errorMessage = error.message
			if (errorMessage === 'Token not supported') {
				throw new UnsupportedTokenError(errorMessage)
			} else if (errorMessage === 'Chain not supported') {
				throw new UnsupportedChainError(errorMessage)
			}
		}
	}

	private validateRoute(route: RouteType) {
		if (!route) throw new RouteError('Route not initialized')
		if (route.to.amount === '0' || route.to.amount === '') throw new EmptyAmountError(route.to.amount)
		if (route.from.token.address === route.to.token.address && route.from.chain?.id === route.to.chain?.id)
			throw new TokensAreTheSameError(route.from.token.address)
	}

	private async handleSwitchChain(walletClient: WalletClient, routeStatus: RouteType, switchChainHook?: SwitchChainHook, updateRouteStatusHook?: UpdateRouteHook) {
		const currentChainId: number = await walletClient.getChainId()
		const chainIdFrom = Number(routeStatus.from.chain.id)

		if (chainIdFrom !== currentChainId) {
			routeStatus.steps.unshift({
				type: StepType.SWITCH_CHAIN,
				execution: {
					status: Status.PENDING
				}
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

	private async handleAllowance(walletClient: WalletClient, publicClient: PublicClient, clientAddress: Address, txData: SwapDirectionData, routeStatus: RouteType, updateRouteStatusHook?: UpdateRouteHook): Promise<void> {
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
				status: Status.NOT_STARTED
			}
		})

		const { execution } = routeStatus.steps[allowanceIndex]

		if (allowance >= amountInDecimals) {
			execution.status = Status.SUCCESS
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

		execution.status = Status.PENDING
		updateRouteStatusHook?.(routeStatus)

		try {
			const approveTxHash = await walletClient.writeContract(request)
			if (approveTxHash) {
				await publicClient.waitForTransactionReceipt({ hash: approveTxHash })
				execution.status = Status.SUCCESS
				execution.txHash = approveTxHash
			} else {
				execution.status = Status.FAILED
				execution.error = 'Failed to approve allowance'
			}
		} catch (error) {
			execution.status = Status.FAILED
			execution.error = 'Failed to approve allowance'
			globalErrorHandler.handle(error)
		}

		updateRouteStatusHook?.(routeStatus)
	}

	private async handleTransaction(publicClient: PublicClient, walletClient: WalletClient, conceroAddress: Address, clientAddress: Address, txArgs: InputRouteData) {
		const { txName, args, isFromNativeToken, fromAmount } = this.prepareTransactionArgs(txArgs, clientAddress)
		const gasPrice = await publicClient.getGasPrice()

		let txHash
		try {
			const { request } = await publicClient.simulateContract({
				account: clientAddress,
				abi: conceroAbi,
				functionName: txName,
				address: conceroAddress,
				args,
				gas: DEFAULT_GAS_LIMIT,
				gasPrice,
				...(isFromNativeToken && { value: fromAmount })
			})
			txHash = await walletClient.writeContract(request)
		} catch (error) {
			globalErrorHandler.handle(error)
		}

		return txHash
	}

	private async handleTransactionStatus(txHash: Address, publicClient: PublicClient, routeStatus: RouteType, updateRouteStatusHook?: UpdateRouteHook) {
		const { status } = await publicClient.waitForTransactionReceipt({
			hash: txHash,
			...viemReceiptConfig
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
				const options = {
					method: 'GET',
					headers: {},
					...{
						txHash
					}
				}
				const steps: TxStep[] = await httpClient.request('/route_status', options)
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

	private prepareTransactionArgs(txArgs: InputRouteData, clientAddress: Address) {
		const { srcSwapData, bridgeData, dstSwapData } = txArgs
		let args: SwapArgs = [srcSwapData, clientAddress]
		let txName: TxName = 'swap'
		if (srcSwapData.length > 0 && bridgeData) {
			txName = 'swapAndBridge'
			args = [bridgeData, srcSwapData, dstSwapData]
		}
		if (srcSwapData.length === 0 && bridgeData) {
			txName = 'bridge'
			args = [bridgeData, dstSwapData]
		}
		const { fromAmount, fromToken } = srcSwapData[0]
		const isFromNativeToken = srcSwapData.length > 0 && isNative(fromToken)
		return { txName, args, isFromNativeToken, fromAmount }
	}

	private initRouteStepsStatuses(route: RouteType): RouteType {
		return {
			...route,
			steps: route.steps.map((step) => ({
				...step,
				execution: {
					status: Status.NOT_STARTED,
				},
			})),
		}
	}

	private buildRouteData(routeData: RouteType, clientAddress: Address): InputRouteData {
		const { steps } = routeData
		let bridgeData: BridgeData | null = null
		const srcSwapData: InputSwapData[] = []
		const dstSwapData: InputSwapData[] = []
		steps.forEach(step => {
			const { from, to, type } = step
			const fromAmount = parseUnits(from.amount, from.token.decimals)
			const toAmount = parseUnits(to.amount, to.token.decimals)

			if (type === StepType.BRIDGE) {
				bridgeData = {
					tokenType: 1,
					amount: fromAmount,
					dstChainSelector: BigInt(conceroAddressesMap[to.chain.id]),
					receiver: clientAddress,
				}
			} else if (type === StepType.SRC_SWAP || type === StepType.DST_SWAP) {
				step.internalSteps.forEach(internalStep => {
					const tool = internalStep.tool

					const dexData = this.buildDexData(internalStep)
					const swapData: InputSwapData = {
						dexType: DEX_TYPES_MAP[tool.name],
						fromToken: from.token.address as Address,
						fromAmount,
						toToken: to.token.address as Address,
						toAmount,
						toAmountMin: parseUnits(tool.amountOutMin, to.token.decimals),
						dexData,
					}

					if (bridgeData) dstSwapData.push(swapData)
					else srcSwapData.push(swapData)
				})
			}
		})
		return { srcSwapData, bridgeData, dstSwapData }
	}

	private buildSwapData(step: RouteInternalStep): Address | undefined {

	}

}
