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
} from '../types'
import { baseUrl, dexTypesMap, uniswapV3RouterAddressesMap } from '../constants'
import {
	EmptyAmountError,
	RouteError,
	TokensAreTheSameError,
	UnsupportedChainError,
	UnsupportedTokenError,
	WalletClientError,
} from '../errors'
import {
	Address,
	createPublicClient,
	encodeAbiParameters,
	EncodeAbiParametersReturnType,
	parseUnits,
	WalletClient,
} from 'viem'
import { conceroAddressesMap, defaultRpcsConfig } from '../configs'
import { checkAllowanceAndApprove } from './checkAllowanceAndApprove'
import { sendTransaction } from './sendTransaction'
import { checkTransactionStatus } from './checkTransactionStatus'
import { ConceroChain, ConceroToken, RouteInternalStep, RouteType, RouteTypeExtended } from '../types/routeType'

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
		slippageTolerance = '0.5', //@review-from-oleg if this is a default, it should come from the constant in the config
	}: IGetRoute): Promise<RouteType | undefined> {
		const url = new URL(`${baseUrl}/route`)
		try {
			url.searchParams.append('fromChainId', fromChainId.toString())
			url.searchParams.append('toChainId', toChainId.toString())
			url.searchParams.append('fromToken', fromToken)
			url.searchParams.append('toToken', toToken)
			url.searchParams.append('amount', amount.toString())
			url.searchParams.append('slippageTolerance', slippageTolerance.toString())

			const response = await fetch(url)
			if (response.status !== 200) {
				throw new Error(await response.text())
			}
			const route = await response.json()
			return route?.data
		} catch (error) {
			console.error(error)
			this.parseError(error)
		}
	}

	public async executeRoute(
		route: RouteType,
		walletClient: WalletClient,
		executionConfigs: ExecutionConfigs,
	): Promise<Address | undefined> {
		try {
			await this.executeRouteBase(route, walletClient, executionConfigs)
			//@review-from-oleg - should return route with status
		} catch (error) {
			console.error(error)

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
			this.parseError(error)
		}
	}

	public async getSupportedTokens({
		chainId,
		name,
		symbol,
		limit = '10000000', //@review-from-oleg – This has to reference a constant in a config
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
			this.parseError(error)
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
			console.error(error)
			this.parseError(error)
		}
	}

	private async executeRouteBase(route: RouteType, walletClient: WalletClient, executionConfigs: ExecutionConfigs) {
		const { chains } = this.config
		if (!walletClient) throw new WalletClientError('Wallet client not initialized')

		this.validateRoute(route)

		//@review-from-oleg – for readability/maintainability purposes, lets refactor this logic into separate parts
		// you already have validateRoute here, in a similar fashion, lets do:
		// this.handleSwitchChain
		// this.handleAllowance
		// this.handleSwap
		// this.handleBridge
		const { switchChainHook, updateRouteStatusHook } = executionConfigs

		const routeStatus = this.buildRouteStatus(route)

		updateRouteStatusHook?.(routeStatus)

		const currentChainId = (await walletClient.getChainId()).toString()
		if (route.from.chain.id !== currentChainId) {
			routeStatus.switchChain.status = Status.PENDING
		} else {
			routeStatus.switchChain.status = Status.SUCCESS
		}

		updateRouteStatusHook?.(routeStatus)

		if (switchChainHook) {
			await switchChainHook(Number(route.from.chain.id))
		} else {
			await walletClient.switchChain({
				id: Number(route.from.chain.id),
			})
		}

		routeStatus.switchChain.status = Status.SUCCESS
		updateRouteStatusHook?.(routeStatus)

		const [clientAddress] = await walletClient.requestAddresses()

		const inputRouteData: InputRouteData = this.buildRouteData(route, clientAddress)
		const conceroAddress = conceroAddressesMap[route.from.chain.id]

		const publicClient = createPublicClient({
			chain: Number(route.from.chain.id),
			transport: chains[Number(route.from.chain.id)],
		})

		await checkAllowanceAndApprove(
			walletClient,
			publicClient,
			route.from,
			clientAddress,
			routeStatus,
			updateRouteStatusHook,
		)

		const hash = await sendTransaction(inputRouteData, publicClient, walletClient, conceroAddress, clientAddress)
		await checkTransactionStatus(hash, publicClient, routeStatus, updateRouteStatusHook)
		return hash
	}

	private parseError(error: unknown) {
		if (error instanceof Error) {
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

	private buildRouteStatus(route: RouteType): RouteTypeExtended {
		const [switchStatus, allowanceStatus, ...swapStatuses] = Array.from({ length: 5 }, () => Status.NOT_STARTED)
		//@review – switchChain and approveAllowance should be inside steps array, at positions of the first two elements
		return {
			...route,
			// @review move it to steps
			switchChain: {
				type: StepType.SWITCH_CHAIN,
				status: switchStatus,
				txHash: '',
			},
			approveAllowance: {
				type: StepType.ALLOWANCE,
				status: allowanceStatus,
				txHash: '',
			},
			steps: route.steps.map((step, index) => ({
				...step,
				execution: {
					status: swapStatuses[index],
					txHash: '', // ?
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
			} else {
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
