import { LibZip } from 'solady'
import type { Address, EstimateContractGasParameters, Hash, Hex, PublicClient, Transport, WalletClient } from 'viem'
import {
	BaseError,
	ContractFunctionExecutionError,
	createPublicClient,
	encodeAbiParameters,
	encodeFunctionData,
	erc20Abi,
	SwitchChainError,
	UserRejectedRequestError,
	zeroAddress,
	zeroHash,
} from 'viem'
import { conceroAbiV1_7, conceroAbiV2, swapDataAbi } from '../abi'
import {
	ccipChainSelectors,
	conceroAddressesMap,
	supportedViemChainsMap,
	v2ChainSelectors,
	conceroV2AddressesMap,
} from '../configs'
import { conceroApi } from '../configs'
import {
	ADDITIONAL_GAS_PERCENTAGE,
	DEFAULT_REQUEST_RETRY_INTERVAL_MS,
	DEFAULT_REQUEST_TIMEOUT_MS,
	DEFAULT_SLIPPAGE,
	DEFAULT_TOKENS_LIMIT,
	SUPPORTED_OP_CHAINS,
	UINT_MAX,
	viemReceiptConfig,
} from '../constants'
import {
	globalErrorHandler,
	NoRouteError,
	PublicClientError,
	TokensAreTheSameError,
	UserRejectedError,
	WalletClientError,
	WrongAmountError,
	ChainAddError,
} from '../errors'
import { httpClient } from '../http'
import type {
	IBridgeData,
	IExecutionConfig,
	IGetRoute,
	IGetTokens,
	IInputRouteData,
	IInputSwapData,
	IIntegration,
	ILancaChain,
	ILancaClientConfig,
	ILancaToken,
	IPrepareTransactionArgsReturnType,
	IRouteInternalStep,
	IRouteStep,
	IRouteType,
	SwapArgs,
	ISwapDirectionData,
	SwitchChainHook,
	TxName,
	ITxStep,
	UpdateRouteHook,
	ITxStepSwap,
} from '../types'
import { Status, StepType } from '../types'
import { isNative, sleep } from '../utils'
import { type PublicActionsL2, publicActionsL2 } from 'viem/op-stack'
import { getChainConfirmations } from '../constants'
import { LancaClientError } from '../errors'

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

			const routeStatus = this.initRouteStepsStatuses(route)
			updateRouteStatusHook?.(routeStatus)

			await this.handleSwitchChain(walletClient, routeStatus, switchChainHook, updateRouteStatusHook)

			const [clientAddress] = await walletClient.getAddresses()

			const fromChainId = route.from.chain.id

			const inputRouteData: IInputRouteData = this.buildRouteData(route, clientAddress, destinationAddress)

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
	 *
	 * @param walletClient - The wallet client instance to interact with the user's wallet.
	 * @param routeStatus - The route status object to update during the process.
	 * @param switchChainHook - An optional hook to switch the chain using a custom implementation.
	 *                          Useful for wallets that don't support the standard chain switching.
	 * @param updateRouteStatusHook - An optional hook to update the route status in the UI.
	 * @throws {UserRejectedError} If the user rejects the chain switch request.
	 * @throws {ChainNotFoundError} If the chain is not found and cannot be added.
	 * @throws {ChainSwitchError} If the chain switch fails for any other reason.
	 */
	private async handleSwitchChain(
		walletClient: WalletClient,
		routeStatus: IRouteType,
		switchChainHook?: SwitchChainHook,
		updateRouteStatusHook?: UpdateRouteHook,
	) {
		try {
			const currentChainId = await walletClient.getChainId()
			const chainIdFrom = Number(routeStatus.from.chain.id)

			if (String(chainIdFrom) === String(currentChainId)) {
				updateRouteStatusHook?.(routeStatus)
				return
			}

			routeStatus.steps.unshift({
				type: StepType.SWITCH_CHAIN,
				execution: { status: Status.PENDING },
			})
			const { execution } = routeStatus.steps[0]
			updateRouteStatusHook?.(routeStatus)

			try {
				if (switchChainHook) {
					await switchChainHook(chainIdFrom)
				} else {
					try {
						await walletClient.switchChain({ id: chainIdFrom })
					} catch (switchError) {
						if (switchError instanceof UserRejectedRequestError) {
							execution!.status = Status.REJECTED
							execution!.error = 'User rejected chain switch'
							updateRouteStatusHook?.(routeStatus)
							throw globalErrorHandler.parse(switchError)
						}

						if (
							switchError instanceof SwitchChainError &&
							this.config.chains &&
							this.config.chains[chainIdFrom]
						) {
							try {
								await this.addChainToWallet(walletClient, chainIdFrom)
							} catch (addChainError) {
								execution!.status = Status.FAILED
								execution!.error = 'Failed to add chain'
								updateRouteStatusHook?.(routeStatus)
								throw addChainError
							}
						} else {
							execution!.status = Status.FAILED
							execution!.error = 'Chain switch failed'
							updateRouteStatusHook?.(routeStatus)
							throw switchError
						}
					}
				}

				execution!.status = Status.SUCCESS
				updateRouteStatusHook?.(routeStatus)
			} catch (error) {
				if (execution!.status !== Status.REJECTED && execution!.status !== Status.FAILED) {
					execution!.status = Status.FAILED
					execution!.error = 'Failed to switch chain'
					updateRouteStatusHook?.(routeStatus)
				}

				throw error instanceof LancaClientError ? error : globalErrorHandler.parse(error)
			}
		} catch (error) {
			const parsedError = error instanceof LancaClientError ? error : globalErrorHandler.parse(error)
			await globalErrorHandler.handle(parsedError)
			throw parsedError
		}
	}

	/**
	 * @param walletClient - The wallet client instance used to interact with the user's wallet.
	 * @param chainId - The ID of the chain to add to the wallet and switch to.
	 * @throws {UserRejectedError} If the user rejects adding the chain or switching to it.
	 * @throws {ChainAddError} If the chain cannot be added to the wallet due to technical issues.
	 * @throws {ChainSwitchError} If switching to the chain fails after it was successfully added.
	 */
	private async addChainToWallet(walletClient: WalletClient, chainId: number): Promise<void> {
		try {
			const chainConfig = this.config.chains![chainId]
			const chainInfo = chainConfig.chain
			const chainToAdd = {
				id: chainId,
				name: chainInfo.name,
				nativeCurrency: chainInfo.nativeCurrency,
				rpcUrls: {
					default: {
						http: chainInfo.rpcUrls?.default?.http
							? Array.isArray(chainInfo.rpcUrls.default.http)
								? chainInfo.rpcUrls.default.http
								: [chainInfo.rpcUrls.default.http]
							: [],
					},
					public: {
						http: chainInfo.rpcUrls?.public?.http
							? Array.isArray(chainInfo.rpcUrls.public.http)
								? chainInfo.rpcUrls.public.http
								: [chainInfo.rpcUrls.public.http]
							: [],
					},
				},
			}

			try {
				await walletClient.addChain({
					chain: chainToAdd,
				})

				await sleep(250)
				await walletClient.switchChain({
					id: chainId,
				})
				return
			} catch (addChainError) {
				if (addChainError instanceof UserRejectedRequestError) {
					throw globalErrorHandler.parse(addChainError)
				}

				try {
					await walletClient.switchChain({
						id: chainId,
					})
					return
				} catch (switchError) {
					if (switchError instanceof UserRejectedRequestError) {
						throw globalErrorHandler.parse(switchError)
					}

					throw globalErrorHandler.parse(addChainError)
				}
			}
		} catch (error) {
			const parsedError = error instanceof LancaClientError ? error : globalErrorHandler.parse(error)
			await globalErrorHandler.handle(parsedError)
			throw parsedError
		}
	}

	/**
	 * Verifies that the token allowance is sufficient for the required transaction amount.
	 * This function polls the blockchain to check if the allowance has been updated after
	 * an approval transaction, which is necessary due to potential RPC node lag or caching.
	 *
	 * @param publicClient - The public client instance used for reading contract data from the blockchain.
	 * @param tokenAddress - The address of the ERC20 token contract to check allowance for.
	 * @param clientAddress - The address of the token owner (user's wallet address).
	 * @param conceroAddress - The address of the spender (Concero contract address).
	 * @param requiredAmount - The minimum allowance amount required for the transaction in wei.
	 * @param retries - The maximum number of verification attempts. Defaults to 5.
	 * @param delayMs - The delay in milliseconds between verification attempts. Defaults to 3000ms.
	 * @returns A promise that resolves to true if the allowance is sufficient, false if verification fails after all retries.
	 */
	private async verifyAllowance(
		publicClient: PublicClient,
		tokenAddress: Address,
		clientAddress: Address,
		conceroAddress: Address,
		requiredAmount: bigint,
		retries = 5,
		delayMs = 3000,
	): Promise<boolean> {
		for (let attempt = 0; attempt < retries; attempt++) {
			const currentAllowance: bigint = await publicClient.readContract({
				abi: erc20Abi,
				functionName: 'allowance',
				address: tokenAddress,
				args: [clientAddress, conceroAddress],
			})

			if (currentAllowance >= requiredAmount) return true

			await new Promise(resolve => setTimeout(resolve, delayMs))
		}
		return false
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
		txData: ISwapDirectionData,
		routeStatus: IRouteType,
		updateRouteStatusHook?: UpdateRouteHook,
	): Promise<void> {
		const { token, amount, chain } = txData

		if (isNative(token.address)) {
			return
		}

		const amountInDecimals = BigInt(amount)

		const isSwitchStepPresent = routeStatus.steps[0].type === StepType.SWITCH_CHAIN
		const allowanceIndex = isSwitchStepPresent ? 1 : 0

		routeStatus.steps.splice(allowanceIndex, 0, {
			type: StepType.ALLOWANCE,
			execution: {
				status: Status.NOT_STARTED,
			},
		})

		updateRouteStatusHook?.(routeStatus)

		const { execution } = routeStatus.steps[allowanceIndex]
		const conceroAddress = this.config.testnet ? conceroV2AddressesMap[chain.id] : conceroAddressesMap[chain.id]

		execution!.status = Status.PENDING
		updateRouteStatusHook?.(routeStatus)

		const allowance: bigint = await publicClient.readContract({
			abi: erc20Abi,
			functionName: 'allowance',
			address: token.address,
			args: [clientAddress, conceroAddress],
		})

		if (allowance >= amountInDecimals) {
			execution!.status = Status.SUCCESS
			updateRouteStatusHook?.(routeStatus)
			return
		}

		const approvalAmount = this.config.testnet ? UINT_MAX : amountInDecimals

		const contractArgs: EstimateContractGasParameters = {
			account: walletClient.account!,
			address: token.address,
			abi: erc20Abi,
			functionName: 'approve',
			args: [conceroAddress, approvalAmount],
			value: 0n,
		}

		try {
			const gasEstimate = await this.estimateGas(publicClient, contractArgs)

			const { request } = await publicClient.simulateContract({
				...contractArgs,
				gas: gasEstimate,
				chain: publicClient.chain,
			})

			const approveTxHash = await walletClient.writeContract(request)
			if (approveTxHash) {
				const chainId = publicClient.chain?.id || 0
				await publicClient.waitForTransactionReceipt({
					hash: approveTxHash,
					timeout: 0,
					confirmations: getChainConfirmations(chainId),
				})

				const allowanceVerified = await this.verifyAllowance(
					publicClient,
					token.address,
					clientAddress,
					conceroAddress,
					amountInDecimals,
				)

				if (allowanceVerified) {
					execution!.status = Status.SUCCESS
					;(execution! as ITxStepSwap).txHash = approveTxHash.toLowerCase() as Hash
				} else {
					execution!.status = Status.FAILED
					execution!.error = 'Allowance not updated after approval'
				}
				updateRouteStatusHook?.(routeStatus)
			} else {
				execution!.status = Status.FAILED
				execution!.error = 'Failed to approve allowance'
				updateRouteStatusHook?.(routeStatus)
			}
		} catch (error) {
			if (
				error instanceof UserRejectedRequestError ||
				(error instanceof ContractFunctionExecutionError && error.message && error.message.includes('rejected'))
			) {
				execution!.status = Status.REJECTED
				execution!.error = 'User rejected the request'
				updateRouteStatusHook?.(routeStatus)
				throw globalErrorHandler.parse(error)
			}

			execution!.status = Status.FAILED
			execution!.error = 'Failed to approve allowance'
			updateRouteStatusHook?.(routeStatus)
			throw globalErrorHandler.parse(error)
		}
	}

	/**
	 * Handles the transaction step of the route execution.
	 * @param publicClient - The public client instance to use for simulating the transaction.
	 * @param walletClient - The wallet client instance to use for writing the transaction.
	 * @param conceroAddress - The concero contract address.
	 * @param clientAddress - The client address.
	 * @param txArgs - The transaction arguments.
	 * @param routeStatus - The route status object.
	 * @param updateRouteStatusHook - An optional hook to update the route status.
	 * @returns A promise that resolves to the transaction hash or zeroHash if the transaction fails.
	 */
	private async handleTransaction(
		publicClient: PublicClient,
		walletClient: WalletClient,
		conceroAddress: Address,
		clientAddress: Address,
		txArgs: IInputRouteData,
		routeStatus: IRouteType,
		destinationAddress?: Address,
		updateRouteStatusHook?: UpdateRouteHook,
	): Promise<Hash> {
		const swapStep: IRouteStep = routeStatus.steps.find(
			({ type }) => type === StepType.SRC_SWAP || type === StepType.BRIDGE,
		) as IRouteStep

		swapStep!.execution!.status = Status.PENDING
		updateRouteStatusHook?.(routeStatus)

		const { txName, args, isFromNativeToken, fromAmount } = this.prepareTransactionArgs(
			txArgs,
			clientAddress,
			swapStep,
			destinationAddress,
		)
		let txHash: Hash = zeroHash
		let txValue: bigint

		if (this.config.testnet) {
			txValue = await this.computeV2TxValue(publicClient, conceroAddress, txArgs)
		} else {
			txValue = isFromNativeToken ? fromAmount : 0n
		}

		const abi = this.config.testnet ? conceroAbiV2 : conceroAbiV1_7

		const contractArgs: EstimateContractGasParameters = {
			account: walletClient.account!,
			abi: abi,
			functionName: txName,
			address: conceroAddress,
			args,
			value: txValue,
		}

		try {
			const gasEstimate = await this.estimateGas(publicClient, contractArgs)

			const { request } = await publicClient.simulateContract({
				...contractArgs,
				gas: gasEstimate,
				chain: publicClient.chain,
			})
			txHash = (await walletClient.writeContract(request)).toLowerCase() as Hash
			;(swapStep!.execution! as ITxStepSwap).txHash = txHash
		} catch (error) {
			if (
				error instanceof UserRejectedRequestError ||
				(error instanceof ContractFunctionExecutionError && error.message && error.message.includes('rejected'))
			) {
				swapStep!.execution!.status = Status.REJECTED
				swapStep!.execution!.error = 'User rejected the request'
				updateRouteStatusHook?.(routeStatus)
				throw globalErrorHandler.parse(error)
			}
			swapStep!.execution!.status = Status.FAILED
			swapStep!.execution!.error = 'Failed to execute transaction'
			updateRouteStatusHook?.(routeStatus)
			throw globalErrorHandler.parse(error)
		}

		updateRouteStatusHook?.(routeStatus)
		return txHash
	}

	/**
	 * Estimates the gas required for a contract call.
	 *
	 * @param publicClient - The PublicClient instance to use for estimating the gas.
	 * @param args - The arguments for the contract call.
	 * @returns A promise that resolves to the estimated gas amount.
	 */
	private async estimateGas(publicClient: PublicClient, args: EstimateContractGasParameters): Promise<bigint> {
		try {
			const { account, address, abi, functionName, args: functionArgs, value } = args

			const data = encodeFunctionData({ abi, functionName, args: functionArgs })
			const isOPStack = SUPPORTED_OP_CHAINS[publicClient.chain!.id]

			const gasLimit = isOPStack
				? await (publicClient.extend(publicActionsL2()) as PublicClient & PublicActionsL2).estimateTotalGas({
						data,
						account: account!,
						to: address,
						value,
						chain: publicClient.chain,
					})
				: await publicClient.estimateGas({
						data,
						account: account!,
						to: address,
						value,
					})

			return this.increaseGasByPercent(gasLimit, ADDITIONAL_GAS_PERCENTAGE)
		} catch (error) {
			throw globalErrorHandler.parse(error)
		}
	}

	/**
	 * Increases the given gas amount by the given percentage.
	 *
	 * @param gas - The gas amount to increase.
	 * @param percent - The percentage to increase the gas by.
	 * @returns The increased gas amount.
	 */
	private increaseGasByPercent(gas: bigint, percent: number): bigint {
		return gas + (gas / 100n) * BigInt(percent)
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
			this.setAllStepsData(routeStatus, Status.FAILED, 'Transaction reverted', updateRouteStatusHook)
			return
		}

		const firstStepType = routeStatus.steps.find(
			({ type }) => type === StepType.SRC_SWAP || type === StepType.BRIDGE,
		)

		const isBridgeStepExist = routeStatus.steps.some(({ type }) => type === StepType.BRIDGE)

		if (status === 'success' && firstStepType?.type === StepType.SRC_SWAP && !isBridgeStepExist) {
			let step
			do {
				;[step] = await this.fetchRouteSteps(txHash, this.config.testnet as boolean)
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
				const steps = await this.fetchRouteSteps(txHash, this.config.testnet as boolean)
				if (steps.length > 0) {
					const { status } = this.evaluateStepsStatus(steps)
					statusFromTx = status
					if (statusFromTx !== Status.PENDING) {
						this.updateRouteSteps(routeStatus, steps, updateRouteStatusHook)
						return
					}
				}
				await sleep(DEFAULT_REQUEST_RETRY_INTERVAL_MS)
			} catch (error) {
				this.setAllStepsData(routeStatus, Status.FAILED, error as string, updateRouteStatusHook)
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
	private async fetchRouteSteps(txHash: Hash, isTestnet: boolean): Promise<ITxStep[]> {
		const options = new URLSearchParams({ txHash, isTestnet: String(isTestnet) })
		const { data: steps }: { data: ITxStep[] } = await httpClient.get(conceroApi.routeStatus, options)
		return steps
	}

	/**
	 * Evaluate the status of a set of transaction steps.
	 *
	 * This function takes a list of {@link ITxStep} objects and returns an object
	 * with the overall status of the transaction and optionally a new txHash if the
	 * transaction was successful or an error message if the transaction failed.
	 *
	 * @param steps The list of transaction steps.
	 * @returns An object with the overall status of the transaction and optionally a
	 * new txHash if the transaction was successful or an error message if the
	 * transaction failed.
	 */
	private evaluateStepsStatus(steps: ITxStep[]): { status: Status; newTxHash?: Hash; error?: string } {
		const allSuccess = steps.every(({ status }: { status: Status }) => status === Status.SUCCESS)
		const anyFailed = steps.some(({ status }: { status: Status }) => status === Status.FAILED)

		if (allSuccess) {
			return { status: Status.SUCCESS }
		} else if (anyFailed) {
			const error = steps[steps.length - 1].error as string
			return { status: Status.FAILED, error }
		}

		return { status: Status.PENDING }
	}

	/**
	 * Updates the execution status of each step in the route with the given status and optional error.
	 * If a txHash is provided, it is used to update the execution txHash of the last step in the route.
	 * Then calls the updateRouteStatusHook with the updated routeStatus if it is defined.
	 *
	 * @param routeStatus - The route status object to be updated.
	 * @param txSteps - The list of transaction steps with their status and optional error.
	 * @param updateRouteStatusHook - An optional hook to call with the updated routeStatus.
	 */
	private updateRouteSteps(routeStatus: IRouteType, txSteps: ITxStep[], updateRouteStatusHook?: UpdateRouteHook) {
		let indexOfStep = 0
		routeStatus.steps.forEach(step => {
			const isNewStep = step.type !== StepType.SWITCH_CHAIN && step.type !== StepType.ALLOWANCE
			if (isNewStep) {
				step.execution = {
					...step.execution,
					...txSteps[indexOfStep++],
				}
			}
		})

		updateRouteStatusHook?.(routeStatus)
	}

	private setAllStepsData(
		routeStatus: IRouteType,
		status: Status,
		error?: string,
		updateRouteStatusHook?: UpdateRouteHook,
	) {
		routeStatus.steps.forEach(step => {
			if (step.type !== StepType.SWITCH_CHAIN && step.type !== StepType.ALLOWANCE) {
				step.execution!.status = status
				step.execution!.error = error
			}
		})

		updateRouteStatusHook?.(routeStatus)
	}

	/**
	 * Prepares the transaction arguments for the executeRoute function
	 * @param txArgs the transaction arguments
	 * @param clientAddress the client's address
	 * @returns {IPrepareTransactionArgsReturnType} the prepared transaction arguments
	 * @throws {EmptyAmountError} if the fromAmount is empty
	 * @throws {TokensAreTheSameError} if the fromToken and toToken are the same
	 * @throws {UnsupportedChainError} if the fromChainId or toChainId is not supported
	 * @throws {UnsupportedTokenError} if the fromToken or toToken is not supported
	 * @throws {LancaClientError} if the transaction arguments are invalid
	 */
	private prepareTransactionArgs(
		txArgs: IInputRouteData,
		clientAddress: Address,
		firstSwapStep: IRouteStep,
		destinationAddress?: Address,
	): IPrepareTransactionArgsReturnType {
		const { srcSwapData, bridgeData, dstSwapData } = txArgs

		const integrationInfo: IIntegration = {
			integrator: this.config.integratorAddress!,
			feeBps: this.config.feeBps!,
		}

		const recipient = destinationAddress ?? clientAddress

		let args: SwapArgs = [srcSwapData, recipient, integrationInfo]
		let txName: TxName = 'swap'

		if (bridgeData) {
			const compressDstSwapData = dstSwapData.length > 0 ? this.compressSwapData(dstSwapData) : '0x'
			bridgeData.compressedDstSwapData = compressDstSwapData
			args = [bridgeData, integrationInfo]

			if (srcSwapData.length > 0) {
				txName = 'swapAndBridge'
				args.splice(1, 0, srcSwapData)
			} else {
				txName = 'bridge'
			}
		}

		const isFromNativeToken = isNative(firstSwapStep.from.token.address)
		const fromAmount = BigInt(firstSwapStep.from.amount)

		return { txName, args, isFromNativeToken, fromAmount }
	}

	/**
	 * Calculates the transaction fee for v2 testnet operations.
	 *
	 * @param publicClient - The public client instance.
	 * @param conceroAddress - The concero contract address.
	 * @param txArgs - The transaction arguments.
	 * @returns The calculated transaction fee.
	 */
	/**
	 * Calculates the transaction fee for v2 testnet operations.
	 *
	 * @param publicClient - The public client instance.
	 * @param conceroAddress - The concero contract address.
	 * @param txArgs - The transaction arguments.
	 * @returns The calculated transaction fee.
	 */
	private async computeV2TxValue(
		publicClient: PublicClient,
		conceroAddress: Address,
		txArgs: IInputRouteData,
	): Promise<bigint> {
		try {
			const selector = txArgs.bridgeData?.dstChainSelector
			const amount = BigInt(txArgs.bridgeData?.amount || 0)

			if (!selector) {
				return 0n
			}

			const fee = (await publicClient.readContract({
				address: conceroAddress,
				abi: conceroAbiV2,
				functionName: 'getFee',
				args: [selector, amount, zeroAddress, 1000000],
			})) as bigint

			return fee
		} catch (error) {
			throw globalErrorHandler.parse(error)
		}
	}

	/**
	 * Initializes the execution status of each step in the given route to NOT_STARTED.
	 * @param route - The route object.
	 * @returns The route object with the execution status of each step initialized to NOT_STARTED.
	 */
	private initRouteStepsStatuses(route: IRouteType): IRouteType {
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
	private buildRouteData(
		routeData: IRouteType,
		clientAddress: Address,
		destinationAddress?: Address,
	): IInputRouteData {
		const { steps } = routeData
		let bridgeData: IBridgeData | null = null
		const srcSwapData: IInputSwapData[] = []
		const dstSwapData: IInputSwapData[] = []
		steps.forEach(step => {
			const { type } = step

			if (type === StepType.BRIDGE) {
				const { from, to } = step as IRouteStep
				const fromAmount = BigInt(from.amount)
				bridgeData = {
					token: from.token.address,
					amount: fromAmount,
					dstChainSelector: this.config.testnet
						? v2ChainSelectors[to.chain.id]
						: ccipChainSelectors[to.chain.id],
					receiver: destinationAddress ?? clientAddress,
					compressedDstSwapData: '0x',
				}
			} else if (type === StepType.SRC_SWAP || type === StepType.DST_SWAP) {
				;(step as IRouteStep).internalSteps.forEach((internalStep: IRouteInternalStep) => {
					const swapData: IInputSwapData = this.buildSwapData(internalStep)
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
	private buildSwapData(step: IRouteInternalStep): IInputSwapData {
		const { tool, from, to } = step
		const fromToken = from.token
		const toToken = to.token

		const { amountOutMin } = tool
		const { dexCallData, dexRouter } = tool.data!

		const fromAmount = BigInt(from.amount)
		const toAmount = BigInt(to.amount)
		const toAmountMin = BigInt(amountOutMin!)

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
	 * @param swapDataArray - An array of IInputSwapData objects, each containing details
	 * about a token swap, such as the router address, token addresses, amounts, and additional data.
	 * @returns A compressed byte array representing the encoded swap data.
	 */
	private compressSwapData(swapDataArray: IInputSwapData[]): Hex {
		const encodedSwapData = encodeAbiParameters([swapDataAbi], [swapDataArray])
		return LibZip.cdCompress(encodedSwapData) as Hex
	}
}
