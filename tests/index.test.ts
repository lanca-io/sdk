import { createWalletClient, Hex, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { base } from 'viem/chains'
import { DEFAULT_SLIPPAGE } from '../src/constants'
import { LancaClient, StepType } from '../src/index'
import { FROM_ADDRESS, TEST_TIMEOUT, TO_ADDRESS, TOKENS_MAP } from './setup'

describe('ConceroClient', () => {
	let client: LancaClient
	beforeEach(() => {
		client = new LancaClient({
			integratorAddress: FROM_ADDRESS,
			feeBps: 1,
			chains: {
				'8453': ['https://rpc.ankr.com/eth'],
				'137': ['https://polygon-rpc.com'],
			},
		})
	})

	describe.skip('executeRoute', () => {
		let route, walletClient, account
		beforeEach(async () => {
			route = await client.getRoute({
				fromChainId: '8453',
				toChainId: '8453',
				fromToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', //USDC
				toToken: '0x50c5725949A6F0c72E6C4a641F24049A917DB0Cb', //DAI
				amount: '1',
				fromAddress: FROM_ADDRESS,
				toAddress: TO_ADDRESS,
				slippageTolerance: DEFAULT_SLIPPAGE,
			})

			account = privateKeyToAccount(process.env.PRIVATE_KEY as Hex)
			walletClient = createWalletClient({
				account,
				chain: base,
				transport: http(),
			})
		}, TEST_TIMEOUT)

		it(
			'test_canSwapSingleChain',
			async () => {
				console.log('route', route)
				const routeWithStatus = await client.executeRoute(route, walletClient, {
					switchChainHook: (chainId: number) => {
						console.log('switchChainHook chainId', chainId)
					},
					updateRouteStatusHook: routeStatus => {
						console.log(routeStatus)
					},
				})

				const routeStatus = await client.getRouteStatus(txHash)
				console.log(routeStatus)
				expect(routeStatus).toBeDefined()
			},
			TEST_TIMEOUT,
		)
	})

	describe('getRoute', () => {
		describe('success', () => {
			it(
				'test_canGetBridgeRoute',
				async () => {
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
				},
				TEST_TIMEOUT,
			)

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
			it.only(
				'test_failsWithUnsupportedChain',
				async () => {
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
					).rejects.toThrow('Token not supported')
				},
				TEST_TIMEOUT,
			)

			it(
				'test_failsWithUnsupportedToken',
				async () => {
					const unsupportedTokenFrom = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913'
					const unsupportedTokenTo = '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359'
					await expect(
						client.getRoute({
							fromChainId: '1',
							toChainId: '137',
							fromToken: unsupportedTokenFrom,
							toToken: unsupportedTokenTo,
							amount: '1',
							fromAddress: FROM_ADDRESS,
							toAddress: TO_ADDRESS,
							slippageTolerance: DEFAULT_SLIPPAGE,
						}),
					).rejects.toThrow()
				},
				TEST_TIMEOUT,
			)

			it(
				'test_failsWithTooHighAmount',
				async () => {
					await expect(
						client.getRoute({
							fromChainId: '8453',
							toChainId: '8453',
							fromToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', //USDC
							toToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', //USDC
							amount: '1000000000000000000000000000000000000000000',
							fromAddress: '0x8335Af2c71e1B39f75ccFb5389211A2A78a3EE03',
							toAddress: '0x8335Af2c71e1B39f75ccFb5389211A2A78a3EE03',
							slippageTolerance: '0.5',
						}),
					).rejects.toThrow()
				},
				TEST_TIMEOUT,
			)

			it(
				'test_failsWithTooLowAmount',
				async () => {
					await expect(
						client.getRoute({
							fromChainId: '8453',
							toChainId: '8453',
							fromToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', //USDC
							toToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913', //USDC
							amount: '0',
							fromAddress: '0x8335Af2c71e1B39f75ccFb5389211A2A78a3EE03',
							toAddress: '0x8335Af2c71e1B39f75ccFb5389211A2A78a3EE03',
							slippageTolerance: '0.5',
						}),
					).rejects.toThrow()
				},
				TEST_TIMEOUT,
			)
		})
	})

	describe('getTokens', () => {
		it(
			'test_canGetTokensWithChainId',
			async () => {
				const tokens = await client.getSupportedTokens({
					chainId: '137',
				})
				expect(tokens).toBeDefined()
				expect(tokens?.length).toBeGreaterThan(0)
			},
			TEST_TIMEOUT,
		)

		it(
			'test_canGetTokensWithSymbol',
			async () => {
				const tokens = await client.getSupportedTokens({
					chainId: '137',
					symbol: 'ETH',
				})
				expect(tokens).toBeDefined()
				expect(tokens?.length).toBeGreaterThan(0)
			},
			TEST_TIMEOUT,
		)

		it(
			'test_canGetTokensWithNameAndChainId',
			async () => {
				const tokens = await client.getSupportedTokens({
					chainId: '137',
					name: 'USD Coin',
				})
				expect(tokens).toBeDefined()
				expect(tokens?.length).toBeGreaterThan(0)
			},
			TEST_TIMEOUT,
		)
	})

	describe('getChains', () => {
		it(
			'test_canGetChains',
			async () => {
				const chains = await client.getSupportedChains()
				expect(chains).toBeDefined()
				expect(chains?.length).toBeGreaterThan(0)
			},
			TEST_TIMEOUT,
		)
	})
})
