import { createWalletClient, Hex, http, WalletClient } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { arbitrum } from 'viem/chains'
import { DEFAULT_SLIPPAGE } from '../src/constants'
import {
	AmountBelowFeeError,
	LancaClient,
	RouteType,
	StepType,
	TokensAreTheSameError,
	TooLowAmountError,
	UnsupportedChainError,
	UnsupportedTokenError,
	WrongAmountError,
	WrongSlippageError,
} from '../src/index'
import { FROM_ADDRESS, TEST_TIMEOUT, TO_ADDRESS, TOKENS_MAP } from './setup'

describe('ConceroClient', () => {
	let client: LancaClient
	beforeEach(() => {
		client = new LancaClient({
			chains: {
				'8453': ['https://rpc.ankr.com/eth'],
				'137': ['https://polygon-rpc.com'],
				'42161': ['https://arbitrum-mainnet.infura.io/v3/f4f2c85489af448eb26b4eaeaaa99f1c'],
			},
		})
	})

	describe.skip('executeRoute', () => {
		let route: RouteType, walletClient: WalletClient, account

		describe('success', () => {
			beforeEach(async () => {
				route = await client.getRoute({
					fromChainId: '42161',
					toChainId: '42161',
					fromToken: TOKENS_MAP['42161'].ETH,
					toToken: TOKENS_MAP['42161'].USDT,
					amount: '0.001',
					fromAddress: FROM_ADDRESS,
					toAddress: TO_ADDRESS,
					slippageTolerance: DEFAULT_SLIPPAGE,
				})

				account = privateKeyToAccount(import.meta.env.VITE_PRIVATE_KEY as Hex)
				walletClient = createWalletClient({
					account,
					chain: arbitrum,
					transport: http('https://arbitrum-mainnet.infura.io/v3/f4f2c85489af448eb26b4eaeaaa99f1c'),
				})
			}, TEST_TIMEOUT)
			it(
				'test_canSwapSingleChain',
				async () => {
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

			it('test_canGetSrcSwapRoute', async () => {
				const fromChainId = '43114'
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
})
