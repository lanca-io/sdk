import { createWalletClient, http } from 'viem'
import { privateKeyToAccount } from 'viem/accounts'
import { base } from 'viem/chains'
import { DEFAULT_SLIPPAGE } from '../src/constants'
import { LansaSDK } from '../src/core/client'

// @review add execute route test (swap, bridge, swapAndBridge)

const TEST_TIMEOUT = 100_000
const FROM_ADDRESS = '0x8335Af2c71e1B39f75ccFb5389211A2A78a3EE03'
const TO_ADDRESS = '0x8335Af2c71e1B39f75ccFb5389211A2A78a3EE03'

describe('ConceroClient', () => {
	let client: LansaSDK
	beforeEach(() => {
		client = new LansaSDK({
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

			account = privateKeyToAccount(process.env.PRIVATE_KEY)
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
		it(
			'test_canGetRoute',
			async () => {
				const route = await client.getRoute({
					fromChainId: '8453',
					toChainId: '137',
					fromToken: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
					toToken: '0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359',
					amount: '100000000',
					fromAddress: FROM_ADDRESS,
					toAddress: TO_ADDRESS,
					slippageTolerance: DEFAULT_SLIPPAGE,
				})
				expect(route).toBeDefined()
			},
			TEST_TIMEOUT,
		)

		it(
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
				).rejects.toThrow()
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
