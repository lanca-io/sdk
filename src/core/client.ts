import {
	BridgeData,
	ConceroConfig,
	ExecuteRouteStatus,
	ExecutionConfigs,
	IGetRoute,
	IGetTokens,
	InputRouteData,
	InputSwapData,
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
import { type Address, createPublicClient, encodeAbiParameters, parseUnits } from 'viem'
import { conceroAddressesMap, defaultRpcsConfig } from '../configs'
import { checkAllowanceAndApprove } from './checkAllowanceAndApprove'
import { sendTransaction } from './sendTransaction'
import { checkTransactionStatus } from './checkTransactionStatus'
import { ConceroChain, ConceroToken, RouteInternalStep, RouteType, TxType } from '../types/routeType'

// @review lets group method in class by their visibility
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
		slippageTolerance = '0.5',
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

	public async executeRoute(route: RouteType, executionConfigs: ExecutionConfigs) {
		try {
			await this.executeRouteBase(route, executionConfigs)
		} catch (error) {
			console.error(error)

			if (error.toString().toLowerCase().includes('user rejected')) {
				return
			}
		}
	}

	private async executeRouteBase(route: RouteType, executionConfigs: ExecutionConfigs) {
		const { walletClient, chains } = this.config
		if (!walletClient) throw new WalletClientError('Wallet client not initialized')

		this.validateRoute(route)
		const { switchChainHook, updateRouteStatusHook } = executionConfigs

		const status = this.buildRouteStatus(
			route,
			ExecuteRouteStatus.NotStarted,
			ExecuteRouteStatus.NotStarted,
			ExecuteRouteStatus.NotStarted,
			ExecuteRouteStatus.NotStarted,
			ExecuteRouteStatus.NotStarted,
		)

		updateRouteStatusHook?.(status)

		const currentChainId = (await walletClient.getChainId()).toString()
		if (route.from.chain.id !== currentChainId) {
			status.switchChain = ExecuteRouteStatus.Pending
		} else {
			status.switchChain = ExecuteRouteStatus.Success
		}

		updateRouteStatusHook?.(status)

		if (!switchChainHook) {
			await walletClient.switchChain({
				id: Number(route.to.chain.id),
			})
		} else {
			await switchChainHook(Number(route.from.chain.id))
		}

		status.switchChain = ExecuteRouteStatus.Success
		updateRouteStatusHook?.(status)

		const [clientAddress] = await walletClient.requestAddresses()

		const inputRouteData: InputRouteData = this.buildRouteData(route, clientAddress)
		const conceroAddress = conceroAddressesMap[route.from.chain.id]

		const publicClient = createPublicClient({
			// @review: number should be passed
			chain: route.from.chain.id,
			// @review: number should be passed
			transport: chains[route.from.chain.id],
		})

		await checkAllowanceAndApprove(walletClient, publicClient, route.from, clientAddress, status, updateRouteStatusHook)

		const hash = await sendTransaction(inputRouteData, publicClient, walletClient, conceroAddress, clientAddress)
		await checkTransactionStatus(
			hash,
			publicClient,
			updateRouteStatusHook,
		)
		return hash
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
		limit = '10000000',
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

	// @review missed types
	private buildRouteStatus(route, switchStatus, allowanceStatus, srcStatus, bridgeStatus, dstStatus) {
		const statuses = [srcStatus, bridgeStatus, dstStatus]
		return {
			...route,
			switchChain: switchStatus,
			approveAllowance: allowanceStatus,
			steps: route.steps.map((step, index) => ({
				...step,
				execution: {
					status: statuses[index],
					error: null,
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

			if (type === TxType.BRIDGE) {
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

	// @review: why it returns Address?
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
	}

	private encodeRouteStepUniswapV3Multi(step: RouteInternalStep) {
		return encodeAbiParameters(
			[{ type: 'address' }, { type: 'bytes' }, { type: 'uint256' }],
			[uniswapV3RouterAddressesMap[step.from.chain.id], step.tool.params?.path, BigInt(step.tool.params?.deadline)],
		)
	}

	private encodeRouteStepUniswapV3Single(step: RouteInternalStep) {
		return encodeAbiParameters(
			[{ type: 'address' }, { type: 'uint24' }, { type: 'uint160' }, { type: 'uint256' }],
			[uniswapV3RouterAddressesMap[step.from.chain.id], step.tool.params?.fee, 0n, BigInt(step.tool.params?.deadline)],
		)
	}

	public async getRouteStatus(txHash: string) {
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
}
