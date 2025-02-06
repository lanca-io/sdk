import { createWalletClient, Hex, PrivateKeyAccount, Transport } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { arbitrum, base, polygon } from 'viem/chains'
import { DEFAULT_SLIPPAGE } from '../src/constants'
import {
	AmountBelowFeeError,
	IGetRoute,
	LancaClient,
	Status,
	StepType,
	supportedViemChainsMap,
	TokensAreTheSameError,
	TooLowAmountError,
	UnsupportedChainError,
	UnsupportedTokenError,
	WrongAmountError,
	WrongSlippageError,
} from '../src/index'
import { FROM_ADDRESS, TEST_TIMEOUT, TO_ADDRESS, TOKENS_MAP } from './setup'

function hasDuplicates(arr: any): boolean {
	const seen = new Set()
	for (const item of arr) {
		if (seen.has(item)) {
			return true
		}
		seen.add(item)
	}
	return false
}

describe('ConceroClient', () => {
	let client: LancaClient
	beforeEach(() => {
		client = new LancaClient({
			integratorAddress: '0x0000000000000000000000000000000000000000',
			feeBps: 1n,
		})
	})

	describe('executeRoute', () => {
		let account: PrivateKeyAccount

		describe('success', () => {
			beforeEach(async () => {
				account = privateKeyToAccount(import.meta.env.VITE_PRIVATE_KEY as Hex)
			}, TEST_TIMEOUT)

			it('test_canExecuteBridgeRoute', async () => {
				const polygonId = '137'
				const baseId = '8453'
				const params: IGetRoute = {
					fromChainId: polygonId,
					toChainId: baseId,
					fromToken: TOKENS_MAP[polygonId].USDC,
					toToken: TOKENS_MAP[baseId].USDC,
					amount: '0.2',
					fromAddress: FROM_ADDRESS,
					toAddress: TO_ADDRESS,
					slippageTolerance: DEFAULT_SLIPPAGE,
				}
				const bridgeRoute = await client.getRoute(params)
				expect(bridgeRoute).toBeDefined()

				const polygonWalletClient = createWalletClient({
					account,
					chain: polygon,
					transport: supportedViemChainsMap[polygonId].provider as Transport,
				})

				const routeWithStatus = await client.executeRoute(bridgeRoute!, polygonWalletClient, {
					switchChainHook: (chainId: number) => {
						console.log('switchChainHook chainId', chainId)
					},
					updateRouteStatusHook: routeStatus => {
						console.log(routeStatus.steps)
					},
				})

				expect(routeWithStatus).toBeDefined()
				expect(routeWithStatus?.steps.find(step => step.type === StepType.BRIDGE)?.execution?.status).toEqual(
					Status.SUCCESS,
				)
				const txHashes = routeWithStatus?.steps.map(step => step.execution?.txHash)
				expect(hasDuplicates(txHashes)).toBe(false)
			})

			it('test_canExecuteSwapOnArbitrum', async () => {
				const arbitrumRoute = await client.getRoute({
					fromChainId: '42161',
					toChainId: '42161',
					fromToken: TOKENS_MAP['42161'].USDC,
					toToken: TOKENS_MAP['42161'].USDT,
					amount: '1',
					fromAddress: FROM_ADDRESS,
					toAddress: TO_ADDRESS,
					slippageTolerance: DEFAULT_SLIPPAGE,
				})
				expect(arbitrumRoute).toBeDefined()

				const arbitrumWalletClient = createWalletClient({
					account,
					chain: arbitrum,
					transport: supportedViemChainsMap['42161'].provider,
				})

				const routeWithStatus = await client.executeRoute(arbitrumRoute, arbitrumWalletClient, {
					switchChainHook: (chainId: number) => {
						console.log('switchChainHook chainId', chainId)
					},
					updateRouteStatusHook: routeStatus => {
						console.log(routeStatus)
					},
				})
				expect(routeWithStatus).toBeDefined()
			})

			it('test_canExecuteSwapOnBase', async () => {
				const baseRoute = await client.getRoute({
					fromChainId: '8453',
					toChainId: '8453',
					fromToken: TOKENS_MAP['8453'].USDC,
					toToken: TOKENS_MAP['8453'].ETH,
					amount: '0.9',
					fromAddress: FROM_ADDRESS,
					toAddress: TO_ADDRESS,
					slippageTolerance: DEFAULT_SLIPPAGE,
				})

				const baseWalletClient = createWalletClient({
					account,
					chain: base,
					transport: supportedViemChainsMap['8453'].provider,
				})

				const routeWithStatus = await client.executeRoute(baseRoute, baseWalletClient, {
					switchChainHook: (chainId: number) => {
						console.log('switchChainHook chainId', chainId)
					},
					updateRouteStatusHook: routeStatus => {
						console.log(routeStatus)
					},
				})
			})

			it(
				'test_canSwapSingleChain',
				async () => {
					const route = await client.getRoute({
						fromChainId: '42161',
						toChainId: '42161',
						fromToken: TOKENS_MAP['42161'].ETH,
						toToken: TOKENS_MAP['42161'].USDT,
						amount: '0.001',
						fromAddress: FROM_ADDRESS,
						toAddress: TO_ADDRESS,
						slippageTolerance: DEFAULT_SLIPPAGE,
					})

					const walletClient = createWalletClient({
						account,
						chain: arbitrum,
						transport: supportedViemChainsMap['42161'].provider,
					})

					const routeWithStatus = await client.executeRoute(route, walletClient, {
						switchChainHook: (chainId: number) => {
							console.log('switchChainHook chainId', chainId)
						},
						updateRouteStatusHook: routeStatus => {
							console.log(routeStatus)
						},
					})

					//const routeStatus = await client.getRouteStatus(txHash)
					//console.log(routeStatus)
					expect(routeWithStatus).toBeDefined()
				},
				TEST_TIMEOUT * 10000,
			)
		})

		describe('fails', () => {})
	})

	describe('getRoute', () => {
		describe('success', () => {
			it('test_canGetBridgeRoute', async () => {
				const fromChainId = '8453'
				const toChainId = '137'
				const fromToken = TOKENS_MAP[fromChainId].USDC
				const toToken = TOKENS_MAP[toChainId].USDC

				const route = await client.getRoute({
					fromChainId,
					toChainId,
					fromToken,
					toToken,
					amount: '100000000',
					fromAddress: FROM_ADDRESS,
					toAddress: TO_ADDRESS,
					slippageTolerance: DEFAULT_SLIPPAGE,
				})
				expect(route).toBeDefined()
				expect(route?.from.token.address).toEqual(fromToken)
				expect(route?.to.token.address).toEqual(toToken)
				expect(route?.steps.length).toEqual(1)
				expect(route?.steps[0].type).toEqual(StepType.BRIDGE)
			})

			it.only('test_canGetSrcSwapRoute', async () => {
				const fromChainId = '10'
				const toChainId = '10'
				const fromToken = '0x0b2C639c533813f4Aa9D7837CAf62653d097Ff85'
				const toToken = '0x4200000000000000000000000000000000000006'
				const route = await client.getRoute({
					fromChainId,
					toChainId,
					fromToken,
					toToken,
					amount: '100000',
					fromAddress: FROM_ADDRESS,
					toAddress: TO_ADDRESS,
					slippageTolerance: DEFAULT_SLIPPAGE,
				})

				expect(route).toBeDefined()
				expect(route?.from.token.address).toEqual(fromToken)
				expect(route?.to.token.address).toEqual(toToken)
				expect(route?.steps.length).toEqual(1)
				expect(route?.steps[0].type).toEqual(StepType.SRC_SWAP)
			})

			it('test_canGetBridgeAndDstSwapRoute', async () => {
				const fromChainId = '8453'
				const toChainId = '43114'
				const fromToken = TOKENS_MAP[fromChainId].USDC
				const toToken = TOKENS_MAP[toChainId].USDT
				const route = await client.getRoute({
					fromChainId,
					toChainId,
					fromToken,
					toToken,
					amount: '1',
					fromAddress: FROM_ADDRESS,
					toAddress: TO_ADDRESS,
					slippageTolerance: DEFAULT_SLIPPAGE,
				})
				expect(route).toBeDefined()
				expect(route?.from.token.address).toEqual(fromToken)
				expect(route?.to.token.address).toEqual(toToken)
				expect(route?.steps.length).toEqual(2)
				expect(route?.steps[0].type).toEqual(StepType.BRIDGE)
				expect(route?.steps[1].type).toEqual(StepType.DST_SWAP)
			})

			it('test_canGetSrcSwapAndBridgeRoute', async () => {
				const fromChainId = '42161'
				const toChainId = '137'
				const fromToken = TOKENS_MAP[fromChainId].WETH
				const toToken = TOKENS_MAP[toChainId].USDC
				const route = await client.getRoute({
					fromChainId,
					toChainId,
					fromToken,
					toToken,
					amount: '0.1',
					fromAddress: FROM_ADDRESS,
					toAddress: TO_ADDRESS,
					slippageTolerance: DEFAULT_SLIPPAGE,
				})
				expect(route).toBeDefined()
				expect(route?.from.token.address).toEqual(fromToken)
				expect(route?.to.token.address).toEqual(toToken)
				expect(route?.steps.length).toEqual(2)
				expect(route?.steps[0].type).toEqual(StepType.SRC_SWAP)
				expect(route?.steps[1].type).toEqual(StepType.BRIDGE)
			})

			it('test_canGetSrcSwapBridgeDstSwapRoute', async () => {
				const fromChainId = '42161'
				const toChainId = '8453'
				const fromToken = TOKENS_MAP[fromChainId].WETH
				const toToken = TOKENS_MAP[toChainId].ETH
				const route = await client.getRoute({
					fromChainId,
					toChainId,
					fromToken,
					toToken,
					amount: '0.1',
					fromAddress: FROM_ADDRESS,
					toAddress: TO_ADDRESS,
					slippageTolerance: DEFAULT_SLIPPAGE,
				})
				expect(route).toBeDefined()
				expect(route?.from.token.address).toEqual(fromToken)
				expect(route?.to.token.address).toEqual(toToken)
				expect(route?.steps.length).toEqual(3)
				expect(route?.steps[0].type).toEqual(StepType.SRC_SWAP)
				expect(route?.steps[1].type).toEqual(StepType.BRIDGE)
				expect(route?.steps[2].type).toEqual(StepType.DST_SWAP)
			})
		})

		describe('fails', () => {
			it('test_failsWithUnsupportedChain', async () => {
				const unsupportedChainId = '9999'
				await expect(
					client.getRoute({
						fromChainId: unsupportedChainId,
						toChainId: '137',
						fromToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
						toToken: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
						amount: '1',
						fromAddress: FROM_ADDRESS,
						toAddress: TO_ADDRESS,
						slippageTolerance: DEFAULT_SLIPPAGE,
					}),
				).rejects.toThrow(UnsupportedChainError)
			})

			it('test_failsWithUnsupportedToken', async () => {
				const unsupportedTokenFrom = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
				const unsupportedTokenTo = '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359'
				await expect(
					client.getRoute({
						fromChainId: '137',
						toChainId: '137',
						fromToken: unsupportedTokenFrom,
						toToken: unsupportedTokenTo,
						amount: '1',
						fromAddress: FROM_ADDRESS,
						toAddress: TO_ADDRESS,
						slippageTolerance: DEFAULT_SLIPPAGE,
					}),
				).rejects.toThrow(UnsupportedTokenError)
			})

			it('test_failsWithTheSameTokens', async () => {
				await expect(
					client.getRoute({
						fromChainId: '8453',
						toChainId: '8453',
						fromToken: TOKENS_MAP['8453'].USDC,
						toToken: TOKENS_MAP['8453'].USDC,
						amount: '1',
						fromAddress: FROM_ADDRESS,
						toAddress: TO_ADDRESS,
						slippageTolerance: DEFAULT_SLIPPAGE,
					}),
				).rejects.toThrow(TokensAreTheSameError)
			})

			it('test_failsWithWrongAmount', async () => {
				await expect(
					client.getRoute({
						fromChainId: '8453',
						toChainId: '8453',
						fromToken: TOKENS_MAP['8453'].ETH,
						toToken: TOKENS_MAP['8453'].USDC,
						amount: '0',
						fromAddress: FROM_ADDRESS,
						toAddress: TO_ADDRESS,
						slippageTolerance: DEFAULT_SLIPPAGE,
					}),
				).rejects.toThrow(WrongAmountError)
			})

			it('test_failsWithAmountBelowFee', async () => {
				await expect(
					client.getRoute({
						fromChainId: '8453',
						toChainId: '137',
						fromToken: TOKENS_MAP['8453'].USDC,
						toToken: TOKENS_MAP['137'].USDC,
						amount: '0.00000001',
						fromAddress: FROM_ADDRESS,
						toAddress: TO_ADDRESS,
						slippageTolerance: DEFAULT_SLIPPAGE,
					}),
				).rejects.toThrow(AmountBelowFeeError)
			})

			it('test_failsWithWrongSlippage', async () => {
				await expect(
					client.getRoute({
						fromChainId: '8453',
						toChainId: '137',
						fromToken: TOKENS_MAP['8453'].USDC,
						toToken: TOKENS_MAP['137'].USDC,
						amount: '0.1',
						fromAddress: FROM_ADDRESS,
						toAddress: TO_ADDRESS,
						slippageTolerance: '100',
					}),
				).rejects.toThrow(WrongSlippageError)
			})

			it('test_failsWithTooLowAmount', async () => {
				await expect(
					client.getRoute({
						fromChainId: '8453',
						toChainId: '8453',
						fromToken: '0x8Ee73c484A26e0A5df2Ee2a4960B789967dd0415', //CRV
						toToken: '0x3992B27dA26848C2b19CeA6Fd25ad5568B68AB98', //MANTRA
						amount: '1',
						fromAddress: FROM_ADDRESS,
						toAddress: TO_ADDRESS,
						slippageTolerance: DEFAULT_SLIPPAGE,
					}),
				).rejects.toThrow(TooLowAmountError)
			})
		})
	})

	describe('getTokens', () => {
		it('test_canGetTokensWithChainId', async () => {
			const tokens = await client.getSupportedTokens({
				chainId: '137',
			})
			expect(tokens).toBeDefined()
			expect(tokens?.length).toBeGreaterThan(0)
		})

		it('test_canGetTokensWithSymbol', async () => {
			const tokens = await client.getSupportedTokens({
				chainId: '137',
				symbol: 'ETH',
			})
			expect(tokens).toBeDefined()
			expect(tokens?.length).toBeGreaterThan(0)
		})

		it('test_canGetTokensWithNameAndChainId', async () => {
			const tokens = await client.getSupportedTokens({
				chainId: '137',
				name: 'USD Coin',
			})
			expect(tokens).toBeDefined()
			expect(tokens?.length).toBeGreaterThan(0)
		})
	})

	describe('getChains', () => {
		it('test_canGetChains', async () => {
			const chains = await client.getSupportedChains()
			expect(chains).toBeDefined()
			expect(chains?.length).toBeGreaterThan(0)
		})
	})

	describe('compressSwapData', () => {
		describe('success', () => {
			it('test_compressSwapData', () => {
				expect(
					client.compressSwapData([
						{
							dexRouter: '0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D',
							fromToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
							fromAmount: 1000000000000000000n,
							toToken: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
							toAmount: 1000000000000000000n,
							toAmountMin: 1000000000000000000n,
							dexCallData: '0x0acf123',
						},
					]),
				).toBeDefined()
			})
		})
	})
})
