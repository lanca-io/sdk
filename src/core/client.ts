import {
	BridgeData,
	ConceroConfig,
	ExecutionConfigs,
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
} from '../types'
import { baseUrl, defaultSlippage, defaultTokensLimit, dexTypesMap, uniswapV3RouterAddressesMap } from '../constants'
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
import { sendTransaction } from './sendTransaction'
import { checkTransactionStatus } from './checkTransactionStatus'
import { ConceroChain, ConceroToken, RouteInternalStep, RouteType } from '../types'
import { isNative } from '../utils'
import { globalRequestHandler } from './globalRequestHandler'

export class ConceroClient {
	private readonly config: ConceroConfig
	constructor(config: ConceroConfig) {
		this.config = config
		if (!this.config.chains) {
			this.config.chains = defaultRpcsConfig
		}
	}

	public async getRoute({
		fromChainId,
		toChainId,
		fromToken,
		toToken,
		amount,
		slippageTolerance = defaultSlippage,
	}: IGetRoute): Promise<RouteType | undefined> {
		const options = {
			method: 'GET',
			headers: {},
			...{
				fromChainId,
				toChainId,
				fromToken,
				toToken,
				amount,
				slippageTolerance
			}
		}
		const route = await globalRequestHandler.makeRequest('/route', options)
		return route?.data
	}

	public async executeRoute(
		route: RouteType,
		walletClient: WalletClient,
		executionConfigs: ExecutionConfigs,
	): Promise<RouteType | undefined> {
		try {
			return await this.executeRouteBase(route, walletClient, executionConfigs)
		} catch (error) {
			globalErrorHandler.handle(error)

			if (error.toString().toLowerCase().includes('user rejected')) {
				return
			}
		}
	}

	public async getSupportedChains(): Promise<ConceroChain[] | undefined> {
		const url = new URL(`${baseUrl}/chains`)

		try {
			const response = await fetch(url)
			if (response.status !== 200) {
				throw new Error(await response.text())
			}
			const chains = await response.json()
			return chains?.data
		} catch (error) {
			globalErrorHandler.handle(error)
			this.parseError(error) //move to errorHandler
		}
	}

	public async getSupportedTokens({
		chainId,
		name,
		symbol,
		limit = defaultTokensLimit,
	}: IGetTokens): Promise<ConceroToken[] | undefined> {
		const url = new URL(`${baseUrl}/tokens`)
		url.searchParams.append('chainId', chainId)
		url.searchParams.append('limit', limit)
		if (name) {
			url.searchParams.append('name', name)
		}
		if (symbol) {
			url.searchParams.append('symbol', symbol)
		}
		try {
			const response = await fetch(url)
			if (response.status !== 200) {
				throw new Error(await response.text())
			}
			const tokens = await response.json()
			return tokens?.data
		} catch (error) {
			globalErrorHandler.handle(error)
			this.parseError(error) //move to errorHandler
		}
	}

	public async getRouteStatus(txHash: string): Promise<TxStep[] | undefined> {
		const url = new URL(`${baseUrl}/route_status`)
		url.searchParams.append('txHash', txHash)

		try {
			const response = await fetch(url)
			if (response.status !== 200) {
				throw new RouteError(response.statusText)
			}
			const status = await response.json()
			return status?.data
		} catch (error) {
			globalErrorHandler.handle(error)
			this.parseError(error) //move to errorHandler
		}
	}

	private async executeRouteBase(route: RouteType, walletClient: WalletClient, executionConfigs: ExecutionConfigs): Promise<RouteType> {
		const { chains } = this.config
		if (!walletClient) throw new WalletClientError('Wallet client not initialized')

		this.validateRoute(route)

		//@review-from-oleg – for readability/maintainability purposes, lets refactor this logic into separate parts
		// you already have validateRoute here, in a similar fashion, lets do:
		// this.handleSwap
		// this.handleBridge
		const { switchChainHook, updateRouteStatusHook } = executionConfigs

		const routeStatus = this.initRouteStepsStatuses(route)

		updateRouteStatusHook?.(routeStatus)

		this.handleSwitchChain(walletClient, routeStatus, switchChainHook, updateRouteStatusHook)

		const [clientAddress] = await walletClient.requestAddresses()
		const fromChainId = Number(route.from.chain.id)

		const inputRouteData: InputRouteData = this.buildRouteData(route, clientAddress)
		const conceroAddress = conceroAddressesMap[fromChainId]

		const publicClient = createPublicClient({
			chain: fromChainId,
			transport: chains[fromChainId],
		})

		this.handleAllowance(walletClient, publicClient, clientAddress, route.from, routeStatus, updateRouteStatusHook)

		const hash = await sendTransaction(inputRouteData, publicClient, walletClient, conceroAddress, clientAddress)
		await checkTransactionStatus(hash, publicClient, routeStatus, updateRouteStatusHook)
		return routeStatus
	}

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
						dexType: dexTypesMap[tool.name],
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

	private buildDexData(step: RouteInternalStep): Address | undefined {
		const { tool, from } = step
		switch (tool.name) {
			case 'uniswapV3Multi':
				return this.encodeRouteStepUniswapV3Multi(step)
			case 'uniswapV3Single':
				return this.encodeRouteStepUniswapV3Single(step)
			case 'wrapNative':
				return '0x'
			case 'unwrapNative':
				return encodeAbiParameters([{ type: 'address' }], [uniswapV3RouterAddressesMap[from.chain.id]])
		}
		//@review-from-oleg - should we throw an error here, if the tool is not supported?
	}

	private encodeRouteStepUniswapV3Multi(step: RouteInternalStep): EncodeAbiParametersReturnType {
		return encodeAbiParameters(
			[{ type: 'address' }, { type: 'bytes' }, { type: 'uint256' }],
			[uniswapV3RouterAddressesMap[step.from.chain.id], step.tool.params?.path, BigInt(step.tool.params?.deadline)],
		)
	}

	private encodeRouteStepUniswapV3Single(step: RouteInternalStep): EncodeAbiParametersReturnType {
		return encodeAbiParameters(
			[{ type: 'address' }, { type: 'uint24' }, { type: 'uint160' }, { type: 'uint256' }],
			[uniswapV3RouterAddressesMap[step.from.chain.id], step.tool.params?.fee, 0n, BigInt(step.tool.params?.deadline)],
		)
	}
}
